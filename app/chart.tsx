"use client";

/** The one price chart used everywhere in the course.
 *
 *  It replaces two earlier renderers that were hard to read: a bar-height "mini market"
 *  that drew fat horizontal blocks rather than candles, and an SVG that stretched its
 *  viewBox with preserveAspectRatio="none", which squashed every candle out of shape.
 *
 *  Design rules here:
 *   - the drawing keeps its aspect ratio, so a candle looks like a candle at any width
 *   - a price scale on the right, because a chart without numbers cannot be reasoned about
 *   - date or time labels along the bottom, so a real market window can be dated
 *   - `visible` truncates the series AND the scale, so a replay cannot leak the future
 */

export type ChartBar = { o: number; h: number; l: number; c: number; t?: string; v?: number };
export type ChartLevel = { price: number; label: string; tone?: "entry" | "stop" | "target" };

const TONE = { entry: "#efb74d", stop: "#ff7466", target: "#43d39c" } as const;

const THEME = {
  dark: { grid: "#1b382d", axis: "#5d7568", text: "#8ca399", frame: "#123024", band: "#c6f05f" },
  light: { grid: "#e2e3db", axis: "#9aa39c", text: "#6e7c75", frame: "#d8d9d1", band: "#43d39c" },
};

/** Round the gridline spacing to something a person would actually choose. */
function niceStep(range: number, target = 4) {
  const raw = range / target;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const scaled = raw / magnitude;
  const step = scaled >= 5 ? 10 : scaled >= 2.5 ? 5 : scaled >= 2 ? 2.5 : scaled >= 1 ? 2 : 1;
  return step * magnitude;
}

const fmtPrice = (value: number, range: number) =>
  value.toLocaleString("en-IN", { minimumFractionDigits: range < 20 ? 1 : 0, maximumFractionDigits: range < 20 ? 1 : 0 });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (stamp: string) => {
  const [, month, day] = stamp.slice(0, 10).split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
};

/** Axis label for one bar. Intraday bars normally show only the clock — but an hourly
 *  window can span two sessions, and bare times then read as though the chart jumps
 *  backwards. Whenever the date changes, the label carries the date too. */
function fmtTime(stamp: string | undefined, index: number, previous?: string) {
  if (!stamp) return String(index + 1);
  if (stamp.length <= 10) return fmtDay(stamp);
  const newDay = !previous || previous.slice(0, 10) !== stamp.slice(0, 10);
  return newDay ? `${fmtDay(stamp)} ${stamp.slice(11, 16)}` : stamp.slice(11, 16);
}

export function PriceChart({
  bars, visible, levels = [], highlightFrom, highlightTo, showVolume = false,
  height = 200, width = 720, theme = "dark", minSlots, label, caption, ariaLabel,
}: {
  bars: ChartBar[];
  /** Draw only the first N bars. The scale uses only these, so the future never leaks. */
  visible?: number;
  levels?: ChartLevel[];
  /** Shade these bars — used to pick a candlestick pattern out of its context. */
  highlightFrom?: number;
  highlightTo?: number;
  showVolume?: boolean;
  height?: number;
  /** viewBox width. The svg scales to its container, so this sets the aspect ratio:
   *  narrow side panels need a smaller number or the chart renders too squat to read. */
  width?: number;
  theme?: "dark" | "light";
  /** Keeps a 3-bar pattern from occupying only a corner of a wide frame. */
  minSlots?: number;
  label?: string;
  caption?: string;
  ariaLabel?: string;
}) {
  const shown = bars.slice(0, visible ?? bars.length);
  if (!shown.length) return null;

  const padTop = label ? 22 : 10;
  const padBottom = 20;
  const padRight = 56;
  const padLeft = 10;
  const volumeHeight = showVolume ? Math.round(height * 0.16) : 0;
  const plotTop = padTop;
  const plotBottom = height - padBottom - volumeHeight;
  const plotHeight = Math.max(20, plotBottom - plotTop);
  const plotWidth = width - padLeft - padRight;
  const colours = THEME[theme];

  const prices = [...shown.flatMap((bar) => [bar.h, bar.l]), ...levels.map((level) => level.price)];
  const rawHi = Math.max(...prices), rawLo = Math.min(...prices);
  const pad = (rawHi - rawLo) * 0.06 || 1;
  const hi = rawHi + pad, lo = rawLo - pad;
  const y = (price: number) => plotTop + ((hi - price) / (hi - lo)) * plotHeight;

  const slots = Math.max(minSlots ?? 1, shown.length);
  const step = plotWidth / slots;
  const x = (index: number) => padLeft + index * step + step / 2;
  const bodyWidth = Math.max(1.4, Math.min(step * 0.62, 26));

  const gridStep = niceStep(hi - lo);
  const gridLines: number[] = [];
  for (let price = Math.ceil(lo / gridStep) * gridStep; price < hi; price += gridStep) gridLines.push(price);

  const maxVolume = showVolume ? Math.max(...shown.map((bar) => bar.v ?? 0), 1) : 1;
  // Label on a regular cadence, and always on the first bar of a new day so a window that
  // crosses a session boundary cannot look like it runs backwards.
  const timeEvery = Math.max(1, Math.ceil(shown.length / 6));
  const labelled = new Set<number>();
  shown.forEach((bar, index) => {
    const dayChanged = index > 0 && bar.t && shown[index - 1].t && bar.t.slice(0, 10) !== shown[index - 1].t!.slice(0, 10);
    if (index % timeEvery === 0 || dayChanged) labelled.add(index);
  });

  return (
    <figure className="price-chart" data-theme={theme}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel ?? label ?? "Price chart"}>
        <rect x={0} y={0} width={width} height={height} fill="none" stroke={colours.frame} strokeWidth={1} />

        {gridLines.map((price) => (
          <g key={price}>
            <line x1={padLeft} x2={width - padRight} y1={y(price)} y2={y(price)} stroke={colours.grid} strokeWidth={1} />
            <text x={width - padRight + 6} y={y(price) + 3.5} fill={colours.text} fontSize={10}>{fmtPrice(price, hi - lo)}</text>
          </g>
        ))}

        {(highlightFrom !== undefined) && (
          <rect x={x(highlightFrom) - step / 2} y={plotTop} height={plotHeight}
            width={step * ((highlightTo ?? shown.length) - highlightFrom)} fill={colours.band} opacity={0.1} />
        )}

        {levels.map((level) => (
          <g key={`${level.label}-${level.price}`}>
            <line x1={padLeft} x2={width - padRight} y1={y(level.price)} y2={y(level.price)}
              stroke={TONE[level.tone ?? "entry"]} strokeWidth={1.2} strokeDasharray="6 4" />
            <text x={padLeft + 4} y={y(level.price) - 5} fill={TONE[level.tone ?? "entry"]} fontSize={10} fontWeight={700}>{level.label}</text>
          </g>
        ))}

        {shown.map((bar, index) => {
          const rising = bar.c >= bar.o;
          const colour = rising ? "#43d39c" : "#ff7466";
          const top = y(Math.max(bar.o, bar.c));
          const bodyHeight = Math.max(1.2, y(Math.min(bar.o, bar.c)) - top);
          return (
            <g key={index}>
              <line x1={x(index)} x2={x(index)} y1={y(bar.h)} y2={y(bar.l)} stroke={colour} strokeWidth={Math.max(1, bodyWidth * 0.14)} />
              <rect x={x(index) - bodyWidth / 2} y={top} width={bodyWidth} height={bodyHeight} fill={colour} />
              {showVolume && (
                <rect x={x(index) - bodyWidth / 2} width={bodyWidth} fill={colour} opacity={0.45}
                  y={height - padBottom - ((bar.v ?? 0) / maxVolume) * volumeHeight}
                  height={Math.max(0.6, ((bar.v ?? 0) / maxVolume) * volumeHeight)} />
              )}
            </g>
          );
        })}

        {shown.map((bar, index) => labelled.has(index) && (
          <text key={`t${index}`} x={x(index)} y={height - 6} fill={colours.text} fontSize={9} textAnchor="middle">
            {fmtTime(bar.t, index, index > 0 ? shown[index - 1].t : undefined)}
          </text>
        ))}

        <line x1={padLeft} x2={width - padRight} y1={plotBottom} y2={plotBottom} stroke={colours.axis} strokeWidth={1} opacity={0.5} />

        {label && <text x={padLeft + 4} y={14} fill={colours.text} fontSize={10} letterSpacing={0.8}>{label}</text>}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
