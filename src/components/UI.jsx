import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme";
import { formatNumber } from "../utils/jalali";

export function SectionCard({ children, className = "", style = {} }) {
  const t = useTheme();
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, ...style }}
    >
      {children}
    </div>
  );
}

export function Slider({ label, value, onChange, min, max, step, unit, icon: Icon, persianDigits }) {
  const t = useTheme();
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} style={{ color: t.gold }} />}
          <span className="text-xs" style={{ color: t.muted }}>
            {label}
          </span>
        </div>
        <span
          className="text-sm font-semibold px-2 py-0.5 rounded"
          style={{ color: t.gold, fontFamily: "'IBM Plex Mono', monospace", background: t.goldSoft }}
        >
          {formatNumber(value, persianDigits)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: t.gold, height: "4px" }}
      />
    </div>
  );
}

export function NumberField({ value, onChange, width = "w-32", prefix, suffix }) {
  const t = useTheme();
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: t.muted }}>
      {prefix}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`${width} px-2 py-1 rounded text-center`}
        style={{
          background: t.bg,
          border: `1px solid ${t.panelBorder}`,
          color: t.text,
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      />
      {suffix}
    </div>
  );
}

export function MetricCard({ label, value, sub, accent }) {
  const t = useTheme();
  return (
    <div
      className="flex-1 min-w-[140px] rounded-xl p-4"
      style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}
    >
      <div className="text-xs mb-2" style={{ color: t.muted }}>
        {label}
      </div>
      <div
        className="text-2xl font-bold mb-1 break-words"
        style={{ color: accent || t.text, fontFamily: "'Fraunces', serif" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: t.muted }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, persianDigits }) {
  const t = useTheme();
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg p-3 text-xs"
      style={{ background: t.panelAlt, border: `1px solid ${t.panelBorder}`, fontFamily: "'IBM Plex Mono', monospace", direction: "ltr" }}
    >
      <div style={{ color: t.muted, marginBottom: 6 }}>Year {label}</div>
      {payload
        .slice()
        .reverse()
        .map((p) => (
          <div key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
            <span>{p.name}</span>
            <span>{formatNumber(p.value, persianDigits)}</span>
          </div>
        ))}
    </div>
  );
}

export function ThemeToggle({ mode, onToggle }) {
  const t = useTheme();
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition"
      style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.muted }}
      aria-label="تغییر پوسته روشن/تیره"
    >
      {mode === "dark" ? <Sun size={13} /> : <Moon size={13} />}
      {mode === "dark" ? "روشن" : "تیره"}
    </button>
  );
}

export function Disclaimer({ children }) {
  const t = useTheme();
  return (
    <p className="text-xs text-center mt-6 mb-2 px-4" style={{ color: t.muted, opacity: 0.8 }}>
      {children}
    </p>
  );
}
