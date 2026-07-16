import React, { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useTheme } from "../theme";
import { SectionCard, NumberField } from "./UI";
import { formatNumber, approxJalaliFromGregorianYear } from "../utils/jalali";
import {
  getAverageInflation,
  getOptimisticInflation,
  getPessimisticInflation,
  EARLIEST_INFLATION_YEAR,
  LATEST_INFLATION_YEAR,
} from "../data/inflationHistory";
import { backtestFromHistory } from "../utils/finance";

const MODES = [
  { key: "manual", label: "دستی" },
  { key: "historical", label: "میانگین تاریخی" },
  { key: "optimistic", label: "خوش‌بینانه" },
  { key: "pessimistic", label: "بدبینانه" },
];

export function useInflationValue(mode, manualValue) {
  return useMemo(() => {
    if (mode === "historical") return getAverageInflation();
    if (mode === "optimistic") return getOptimisticInflation(5);
    if (mode === "pessimistic") return getPessimisticInflation(5);
    return manualValue;
  }, [mode, manualValue]);
}

export function InflationModeSelector({ mode, setMode, manualValue, setManualValue, resolvedValue, persianDigits }) {
  const t = useTheme();
  return (
    <div className="mb-4">
      <div className="text-xs mb-2" style={{ color: t.muted }}>
        فرض نرخ تورم
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="text-xs px-2.5 py-1.5 rounded-lg transition"
            style={{
              background: mode === m.key ? t.goldSoft : "transparent",
              color: mode === m.key ? t.gold : t.muted,
              border: `1px solid ${mode === m.key ? t.gold : t.panelBorder}`,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "manual" ? (
        <input
          type="range"
          min={0}
          max={60}
          step={1}
          value={manualValue}
          onChange={(e) => setManualValue(parseFloat(e.target.value))}
          className="w-full"
          style={{ accentColor: t.gold, height: "4px" }}
        />
      ) : (
        <div className="text-xs" style={{ color: t.muted }}>
          بر اساس داده واقعی تورم ایران (
          {formatNumber(EARLIEST_INFLATION_YEAR, persianDigits)}–{formatNumber(LATEST_INFLATION_YEAR, persianDigits)}
          )
        </div>
      )}
      <div className="text-left mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: t.gold, fontSize: "0.8rem" }}>
        {formatNumber(resolvedValue.toFixed(1), persianDigits)}٪
      </div>
    </div>
  );
}

export default function BacktestPanel({ rate, persianDigits }) {
  const t = useTheme();
  const [startYear, setStartYear] = useState(2018);
  const [btInitial, setBtInitial] = useState(50000000);
  const [btMonthly, setBtMonthly] = useState(5000000);
  const [btRate, setBtRate] = useState(rate || 20);

  const result = useMemo(
    () =>
      backtestFromHistory({
        initial: btInitial,
        monthly: btMonthly,
        nominalAnnualRatePct: btRate,
        startYear,
      }),
    [btInitial, btMonthly, btRate, startYear]
  );

  const startJalali = approxJalaliFromGregorianYear(startYear);

  return (
    <SectionCard className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <History size={14} style={{ color: t.violet }} />
        <span className="text-xs" style={{ color: t.muted }}>
          بک‌تست: با تورم واقعیِ رخ‌داده، اگه از گذشته شروع کرده بودی
        </span>
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: t.muted }}>
          شروع از سال
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="px-2 py-1 rounded text-center"
            style={{ background: t.bg, border: `1px solid ${t.panelBorder}`, color: t.text, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {Array.from({ length: LATEST_INFLATION_YEAR - EARLIEST_INFLATION_YEAR + 1 }, (_, i) => EARLIEST_INFLATION_YEAR + i).map((y) => (
              <option key={y} value={y}>
                {y} ({approxJalaliFromGregorianYear(y)})
              </option>
            ))}
          </select>
        </div>
        <NumberField value={btInitial} onChange={setBtInitial} prefix="سرمایه اولیه" suffix="ت" />
        <NumberField value={btMonthly} onChange={setBtMonthly} prefix="واریز ماهانه" suffix="ت" width="w-28" />
        <NumberField value={btRate} onChange={setBtRate} prefix="نرخ بازده اسمی" suffix="٪" width="w-16" />
      </div>
      {result && (
        <div className="pt-3 text-sm" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
          از سال {formatNumber(startJalali, persianDigits)} شمسی تا امروز ({formatNumber(result.years, persianDigits)} سال)، مجموع{" "}
          <span style={{ color: t.teal, fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatNumber(result.contributed, persianDigits)}
          </span>{" "}
          تومان واریز می‌شد و امروز به عدد اسمی{" "}
          <span style={{ color: t.gold, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
            {formatNumber(result.nominalTotal, persianDigits)}
          </span>{" "}
          تومان می‌رسید — اما با احتساب {formatNumber(result.cumulativeInflationPct, persianDigits)}٪ تورم تجمعی واقعی این دوره، قدرت خرید آن معادل{" "}
          <span style={{ color: t.warn, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
            {formatNumber(result.realValue, persianDigits)}
          </span>{" "}
          تومان امروز است.
        </div>
      )}
    </SectionCard>
  );
}
