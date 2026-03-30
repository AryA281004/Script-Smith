import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  Bar,
  Line,
  Pie,
  Tooltip,
  Legend
} from "recharts";
import useMeasure from "../hooks/useMeasure";

// Suppress Recharts SVG attribute warnings (they're from the vendor library, not our code)
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const suppressedWarnings = [
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'enable-background',
    'xml:space',
    'xmlns:xlink',
    'stroke-dasharray',
    'fill-opacity',
    'font-family',
    'text-anchor'
  ];
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    // Only suppress "Invalid DOM property" warnings from Recharts
    if (message.includes('Invalid DOM property') && suppressedWarnings.some(attr => message.includes(attr))) {
      return; // Silently ignore these vendor warnings
    }
    originalError(...args);
  };
}

const COLORS = [
  "#A78BFA",
  "#34D399",
  "#F472B6",
  "#60A5FA",
  "#FBBF24",
  "#FB7185",
  "#C084FC",
  "#38BDF8"
];

const CustomBar = ({ x, y, width, height, idx }) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={COLORS[idx % COLORS.length]}
      rx={6}
      ry={6}
    />
  );
};

/**
 * Extract meaningful label from data object
 * Priority order: label > name > category > key > x > title > first non-value string property
 */
const extractLabel = (dataObj, fallbackIndex) => {
  if (!dataObj || typeof dataObj !== 'object') {
    return `Item ${fallbackIndex + 1}`;
  }

  // 1. Try standard label properties (highest priority)
  const standardProps = ['label', 'name', 'category', 'key', 'x', 'title', 'topic', 'item'];
  for (const prop of standardProps) {
    if (dataObj[prop] && typeof dataObj[prop] === 'string' && dataObj[prop].trim()) {
      return String(dataObj[prop]).trim();
    }
  }

  // 2. If single key-value pair, use the key as label
  const keys = Object.keys(dataObj).filter(k => !k.startsWith('_') && !['fill', 'color'].includes(k));
  if (keys.length === 1) {
    return keys[0];
  }

  // 3. Find first string property that's not a known value/data property
  const valueProps = ['value', 'y', 'v', 'val', 'data', 'values', 'count', 'amount', 'fill', 'color'];
  const candidateKey = keys.find(k => {
    const val = dataObj[k];
    return !valueProps.includes(k) && 
           typeof val === 'string' && 
           val.trim() && 
           !val.match(/^item[_-]?\d+$/i); // Don't use "item-0" type values
  });

  if (candidateKey && typeof dataObj[candidateKey] === 'string') {
    return String(dataObj[candidateKey]).trim();
  }

  // 4. Final fallback with 1-based index (more natural)
  return `Item ${fallbackIndex + 1}`;
};

const RechartSetup = ({ chart, charts }) => {
  const list = Array.isArray(charts) ? charts : chart ? [chart] : [];
  if (!list.length) return null;

  return (
    <div className="space-y-8">
      {list.map((chartItem, chartIndex) => {
        // FALLBACK: If type is missing, default to 'bar'
        const chartType = chartItem?.type || 'bar';
        const xAxisLabel = chartItem?.xAxisLabel || chartItem?.xLabel || 'Categories';
        const yAxisLabel = chartItem?.yAxisLabel || chartItem?.yLabel || 'Values';

        const incoming = chartItem?.data;

        const arrayLike = (() => {
          if (Array.isArray(incoming)) return incoming;
          if (!incoming) return [];

          if (typeof incoming === "object") {
            const keys = Object.keys(incoming);

            if (!keys.length) return [];

            // Case 1: Simple key-value pairs where values are numbers (e.g., {Python: 10, Java: 8})
            const firstValue = incoming[keys[0]];
            if (typeof firstValue === "number") {
              return keys.map((k, i) => ({
                label: k,
                value: incoming[k],
                _i: i
              }));
            }

            // Case 2: Values are objects - extract and preserve labels
            return keys.map((k, i) => {
              const v = incoming[k];
              
              // If value is an object with label/value properties
              if (v && typeof v === "object" && ("label" in v || "value" in v)) {
                return { 
                  ...v, 
                  label: v.label || k, // Preserve existing label or use key
                  _i: i 
                };
              }

              // Case 3: Numeric keys with string values - values are the labels
              if (!isNaN(k) && typeof v === "string" && v.trim()) {
                return { label: v.trim(), value: 0, _i: i };
              }

              // Case 4: String keys with any value - key is the label
              return { label: k, value: v, _i: i };
            });
          }

          return [];
        })();

        let safeData = arrayLike
          .map((d, idx) => {
            if (!d) return null;

            if (typeof d === "object") {
              // Use the robust label extraction helper
              const label = extractLabel(d, idx);

              // Extract keys excluding internal properties
              const dKeys = Object.keys(d || {}).filter(k => !k.startsWith('_'));
              const inferredKey = dKeys.length === 1 ? dKeys[0] : undefined;

              // Extract value with fallback chain
              const rawVal =
                d.value ??
                d.y ??
                d.v ??
                d.val ??
                d.count ??
                d.amount ??
                (inferredKey && typeof d[inferredKey] === 'number' ? d[inferredKey] : undefined) ??
                Object.values(d).find(v => typeof v === 'number') ??
                0;

              const value = Number(rawVal ?? 0);

              return {
                label: String(label),
                value: Number.isFinite(value) ? value : 0,
                fill: d.fill ?? COLORS[idx % COLORS.length],
                _i: d._i ?? idx
              };
            }

            // Primitive value (just a number)
            const value = Number(d);
            return {
              label: `Item ${idx + 1}`,
              value: Number.isFinite(value) ? value : 0,
              fill: COLORS[idx % COLORS.length],
              _i: idx
            };
          })
          .filter(Boolean);

        if (!safeData.length) return null;

        // Override labels if chart has explicit labels/keys arrays
        if (
          Array.isArray(chartItem?.labels) &&
          chartItem.labels.length === safeData.length
        ) {
          safeData = safeData.map((d, i) => ({
            ...d,
            label: String(chartItem.labels[i] ?? d.label)
          }));
        }

        if (
          Array.isArray(chartItem?.keys) &&
          chartItem.keys.length === safeData.length
        ) {
          safeData = safeData.map((d, i) => ({
            ...d,
            label: String(chartItem.keys[i] ?? d.label)
          }));
        }

        const extractCaption = (item, dataArr) => {
          if (!item && !dataArr.length) return "";
          if (item?.title) return String(item.title);
          if (item?.caption) return String(item.caption);
          if (item?.description) return String(item.description);

          if (dataArr.length > 0 && dataArr[0]?.label)
            return String(dataArr[0].label);

          return "";
        };

        const caption = extractCaption(chartItem, safeData);

        const [measureRef, measured] = useMeasure();

        return (
          <div
            key={chartIndex}
            className="bg-white rounded-[25px] p-4 overflow-x-auto"
            style={{ minWidth: 0 }}
          >

            {caption && (
              <div className="mb-2 text-sm text-gray-600">
                {caption}
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-indigo-600 mb-2">
                {chartItem.title ?? caption ?? "Chart"}
              </h4>
              {chartItem.description && (
                <p className="text-xs text-indigo-400/70 mb-2">{chartItem.description}</p>
              )}
            </div>

            <div
              ref={measureRef}
              style={{ height: Math.max(300, Math.min(560, measured.width > 0 ? Math.round(measured.width * 0.55) : 300)), minWidth: 0, minHeight: 0 }}
            >
              {measured.width > 0 && measured.height > 0 ? (

                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (

                    <BarChart data={safeData} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
                      <XAxis 
                        dataKey="label" 
                        angle={measured.width < 480 ? -30 : -45}
                        textAnchor="end"
                        height={measured.width < 480 ? 80 : 100}
                        tick={{ fontSize: measured.width < 480 ? 11 : 13 }}
                        label={{ value: xAxisLabel, position: 'insideBottomRight', offset: measured.width < 480 ? -40 : -60, fill: '#9CA3AF', style: { fontSize: measured.width < 480 ? 12 : 13 } }}
                      />
                      <YAxis 
                        tick={{ fontSize: measured.width < 480 ? 11 : 13 }}
                        label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF', style: { fontSize: measured.width < 480 ? 12 : 13 } }}
                      />
                      <Tooltip />
                      <Legend iconType="rect" />

                      <Bar
                        dataKey="value"
                        shape={(props) => (
                          <CustomBar
                            {...props}
                            idx={
                              props.payload?._i ??
                              props.index
                            }
                          />
                        )}
                      />
                    </BarChart>

                  ) : chartType === "line" ? (

                    <LineChart 
                      data={safeData}
                      margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
                    >
                      <XAxis 
                        dataKey="label"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -60, fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF' }}
                      />
                      <Tooltip />
                      <Legend iconType="rect" />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          COLORS[
                            chartIndex % COLORS.length
                          ]
                        }
                        strokeWidth={3}
                      />
                    </LineChart>

                  ) : chartType === "pie" ? (

                    <PieChart>
                      <Tooltip />
                      <Legend iconType="rect" />

                      <Pie
                        data={safeData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={Math.max(60, Math.min(120, Math.floor((measured.width || 320) / 4)))}
                        label={{ fontSize: measured.width < 480 ? 10 : 12 }}
                      />
                    </PieChart>

                  ) : null}
                </ResponsiveContainer>

              ) : (
                <div style={{ width: "100%", height: "100%" }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RechartSetup;