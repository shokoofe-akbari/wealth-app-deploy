import React from "react";
import { Wallet, PiggyBank, Percent, Calendar, Activity } from "lucide-react";
import { useTheme } from "../theme";
import { Slider } from "./UI";
import { InflationModeSelector } from "./InflationPanel";
import { formatNumber } from "../utils/jalali";
import { ruleOf72 } from "../utils/finance";

export default function AssumptionsPanel({
  initial,
  setInitial,
  monthly,
  setMonthly,
  rate,
  setRate,
  years,
  setYears,
  inflationMode,
  setInflationMode,
  manualInflation,
  setManualInflation,
  resolvedInflation,
  showReal,
  setShowReal,
  showMonteCarlo,
  setShowMonteCarlo,
  volatility,
  setVolatility,
  persianDigits,
}) {
  const t = useTheme();
  const doublingYears = ruleOf72(rate);

  return (
    <div className="no-print rounded-xl p-5" style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, height: "fit-content" }}>
      <div className="text-xs mb-4 pb-3" style={{ color: t.muted, borderBottom: `1px solid ${t.panelBorder}` }}>
        دفترچه فرضیات
      </div>

      <Slider label="سرمایه اولیه" value={initial} onChange={setInitial} min={0} max={1000000000} step={5000000} unit=" ت" icon={Wallet} persianDigits={persianDigits} />
      <Slider label="واریز ماهانه" value={monthly} onChange={setMonthly} min={0} max={100000000} step={500000} unit=" ت" icon={PiggyBank} persianDigits={persianDigits} />
      <Slider label="بازده سالانه" value={rate} onChange={setRate} min={0} max={60} step={0.5} unit="٪" icon={Percent} persianDigits={persianDigits} />
      <Slider label="افق زمانی" value={years} onChange={setYears} min={1} max={40} step={1} unit=" سال" icon={Calendar} persianDigits={persianDigits} />

      <div className="mb-1 pt-1 border-t" style={{ borderColor: t.panelBorder }} />
      <InflationModeSelector
        mode={inflationMode}
        setMode={setInflationMode}
        manualValue={manualInflation}
        setManualValue={setManualInflation}
        resolvedValue={resolvedInflation}
        persianDigits={persianDigits}
      />

      <label className="flex items-center gap-2 mt-1 mb-4 text-xs cursor-pointer" style={{ color: t.muted }}>
        <input type="checkbox" checked={showReal} onChange={(e) => setShowReal(e.target.checked)} style={{ accentColor: t.warn }} />
        نمایش ارزش واقعی (تعدیل‌شده با تورم) روی نمودار
      </label>

      <div className="pt-3 border-t" style={{ borderColor: t.panelBorder }}>
        <label className="flex items-center gap-2 mb-3 text-xs cursor-pointer" style={{ color: t.muted }}>
          <input
            type="checkbox"
            checked={showMonteCarlo}
            onChange={(e) => setShowMonteCarlo(e.target.checked)}
            style={{ accentColor: t.violet }}
          />
          <Activity size={13} style={{ color: t.violet }} />
          نمایش عدم قطعیت بازار (مونت‌کارلو)
        </label>
        {showMonteCarlo && (
          <Slider
            label="نوسان سالانه بازده"
            value={volatility}
            onChange={setVolatility}
            min={0}
            max={50}
            step={1}
            unit="٪"
            icon={Activity}
            persianDigits={persianDigits}
          />
        )}
      </div>

      <div className="mt-2 pt-4 text-xs" style={{ borderTop: `1px solid ${t.panelBorder}`, color: t.muted }}>
        با نرخ {formatNumber(rate, persianDigits)}٪، سرمایه‌ات هر{" "}
        <span style={{ color: t.gold, fontFamily: "'IBM Plex Mono', monospace" }}>
          {isFinite(doublingYears) ? formatNumber(doublingYears.toFixed(1), persianDigits) : "∞"}
        </span>{" "}
        سال دو برابر می‌شود (قانون ۷۲)
      </div>
    </div>
  );
}
