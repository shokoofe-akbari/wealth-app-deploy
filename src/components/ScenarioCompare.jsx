import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useTheme } from "../theme";
import { SectionCard, ChartTooltip } from "./UI";
import { formatNumber } from "../utils/jalali";
import { finalValue } from "../utils/finance";

const ASSET_DEFS = [
  { key: "bank", label: "سپرده بانکی", colorKey: "teal" },
  { key: "gold", label: "سکه طلا", colorKey: "gold" },
  { key: "stock", label: "بورس", colorKey: "warn" },
  { key: "usd", label: "دلار", colorKey: "violet" },
];
const DEFAULT_RATES = { bank: 21, gold: 34, stock: 38, usd: 27 };

export default function ScenarioCompare({ initial, monthly, years, persianDigits }) {
  const t = useTheme();
  const [rates, setRates] = useState(DEFAULT_RATES);

  const updateRate = (key, rate) => {
    setRates((prev) => ({ ...prev, [key]: rate }));
  };

  const assets = useMemo(() => ASSET_DEFS.map((a) => ({ ...a, rate: rates[a.key], color: t[a.colorKey] })), [rates, t]);

  const scenarioData = useMemo(
    () =>
      assets.map((a) => ({
        name: a.label,
        value: Math.round(finalValue({ initial, monthly, annualRatePct: a.rate, years })),
        color: a.color,
        rate: a.rate,
      })),
    [assets, initial, monthly, years]
  );

  return (
    <SectionCard className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: t.muted }}>
          مقایسه با طبقات دارایی رایج، بعد از {years} سال با همین واریزی
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={scenarioData} layout="vertical" margin={{ left: 10, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" stroke={t.muted} fontSize={12} width={80} />
          <Tooltip content={<ChartTooltip persianDigits={persianDigits} />} />
          <Bar dataKey="value" name="ارزش نهایی" radius={[0, 6, 6, 0]} isAnimationActive={false}>
            {scenarioData.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => formatNumber(v, persianDigits)}
              style={{ fill: t.text, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
        {assets.map((a) => (
          <div key={a.key} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
            <span style={{ color: t.muted }}>{a.label}</span>
            <input
              type="number"
              value={a.rate}
              onChange={(e) => updateRate(a.key, parseFloat(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 rounded text-center"
              style={{ background: t.bg, border: `1px solid ${t.panelBorder}`, color: t.text, fontFamily: "'IBM Plex Mono', monospace" }}
            />
            <span style={{ color: t.muted }}>٪</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-3" style={{ color: t.muted, opacity: 0.75 }}>
        نرخ‌های بالا فرض‌های قابل‌ویرایش و تخمینی‌اند، نه پیش‌بینی یا توصیه سرمایه‌گذاری. بر اساس برآورد خودت اصلاحشون کن.
      </p>
    </SectionCard>
  );
}
