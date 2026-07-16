import React, { useMemo, useState, useCallback } from "react";
import { ThemeContext, THEMES } from "./theme";
import Header from "./components/Header";
import AssumptionsPanel from "./components/AssumptionsPanel";
import GrowthChart from "./components/GrowthChart";
import { MetricCard, Disclaimer } from "./components/UI";
import BacktestPanel, { useInflationValue } from "./components/InflationPanel";
import ScenarioCompare from "./components/ScenarioCompare";
import GoalSeek from "./components/GoalSeek";
import YearlyTable from "./components/YearlyTable";
import { simulateGrowth, monteCarloBands, ruleOf72 } from "./utils/finance";
import { getCurrentJalaliYear, formatNumber } from "./utils/jalali";

function readStateFromURL() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out = {};
  ["initial", "monthly", "rate", "years", "manualInflation", "volatility"].forEach((k) => {
    if (params.has(k)) {
      const v = parseFloat(params.get(k));
      if (!Number.isNaN(v)) out[k] = v;
    }
  });
  if (params.has("inflationMode")) out.inflationMode = params.get("inflationMode");
  if (params.has("showReal")) out.showReal = params.get("showReal") === "1";
  if (params.has("showMonteCarlo")) out.showMonteCarlo = params.get("showMonteCarlo") === "1";
  if (params.has("theme")) out.themeMode = params.get("theme");
  if (params.has("digits")) out.persianDigits = params.get("digits") === "fa";
  return out;
}

export default function App() {
  const initialUrlState = useMemo(readStateFromURL, []);
  const baseJalaliYear = useMemo(getCurrentJalaliYear, []);

  const [initial, setInitial] = useState(initialUrlState.initial ?? 50000000);
  const [monthly, setMonthly] = useState(initialUrlState.monthly ?? 5000000);
  const [rate, setRate] = useState(initialUrlState.rate ?? 8);
  const [years, setYears] = useState(initialUrlState.years ?? 15);

  const [inflationMode, setInflationMode] = useState(initialUrlState.inflationMode ?? "historical");
  const [manualInflation, setManualInflation] = useState(initialUrlState.manualInflation ?? 30);
  const resolvedInflation = useInflationValue(inflationMode, manualInflation);

  const [showReal, setShowReal] = useState(initialUrlState.showReal ?? true);
  const [showMonteCarlo, setShowMonteCarlo] = useState(initialUrlState.showMonteCarlo ?? false);
  const [volatility, setVolatility] = useState(initialUrlState.volatility ?? 15);

  const [themeMode, setThemeMode] = useState(initialUrlState.themeMode ?? "dark");
  const [persianDigits, setPersianDigits] = useState(initialUrlState.persianDigits ?? false);

  const theme = THEMES[themeMode];

  const data = useMemo(
    () => simulateGrowth({ initial, monthly, annualRatePct: rate, years, inflationPct: resolvedInflation }),
    [initial, monthly, rate, years, resolvedInflation]
  );

  const monteCarloRaw = useMemo(() => {
    if (!showMonteCarlo) return null;
    return monteCarloBands({ initial, monthly, meanRatePct: rate, volatilityPct: volatility, years, trials: 180 });
  }, [showMonteCarlo, initial, monthly, rate, volatility, years]);

  const chartData = useMemo(() => {
    if (!monteCarloRaw) return data;
    const mcByYear = new Map(monteCarloRaw.map((r) => [r.year, r]));
    return data.map((row) => {
      const mc = mcByYear.get(row.year);
      if (!mc) return row;
      return { ...row, mc10: mc.mc10, mcBand: Math.max(0, mc.mc90 - mc.mc10), mc50: mc.mc50 };
    });
  }, [data, monteCarloRaw]);

  const last = data[data.length - 1] || { total: 0, principal: 0, interest: 0, real: 0 };
  const multiplier = last.principal > 0 ? last.total / last.principal : 0;

  const inflationSubLabel =
    inflationMode === "manual"
      ? `با نرخ فرضی ${resolvedInflation.toFixed(1)}٪`
      : `بر اساس تورم واقعی ایران (${resolvedInflation.toFixed(1)}٪ میانگین)`;

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams({
      initial: String(initial),
      monthly: String(monthly),
      rate: String(rate),
      years: String(years),
      inflationMode,
      manualInflation: String(manualInflation),
      volatility: String(volatility),
      showReal: showReal ? "1" : "0",
      showMonteCarlo: showMonteCarlo ? "1" : "0",
      theme: themeMode,
      digits: persianDigits ? "fa" : "en",
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (e) {
      window.prompt("لینک زیر را کپی کن:", url);
      return true;
    }
  }, [initial, monthly, rate, years, inflationMode, manualInflation, volatility, showReal, showMonteCarlo, themeMode, persianDigits]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        dir="rtl"
        style={{
          background: theme.bg,
          color: theme.text,
          fontFamily: "'Vazirmatn', sans-serif",
          minHeight: "100vh",
          padding: "28px 20px",
          transition: "background 0.2s ease, color 0.2s ease",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Header
            total={last.total}
            multiplier={multiplier}
            years={years}
            rate={rate}
            themeMode={themeMode}
            onToggleTheme={() => setThemeMode((m) => (m === "dark" ? "light" : "dark"))}
            persianDigits={persianDigits}
            onTogglePersianDigits={() => setPersianDigits((p) => !p)}
            onShare={handleShare}
          />

          <div className="grid gap-6 grid-cols-1 md:grid-cols-[300px_1fr]">
            <AssumptionsPanel
              initial={initial}
              setInitial={setInitial}
              monthly={monthly}
              setMonthly={setMonthly}
              rate={rate}
              setRate={setRate}
              years={years}
              setYears={setYears}
              inflationMode={inflationMode}
              setInflationMode={setInflationMode}
              manualInflation={manualInflation}
              setManualInflation={setManualInflation}
              resolvedInflation={resolvedInflation}
              showReal={showReal}
              setShowReal={setShowReal}
              showMonteCarlo={showMonteCarlo}
              setShowMonteCarlo={setShowMonteCarlo}
              volatility={volatility}
              setVolatility={setVolatility}
              persianDigits={persianDigits}
            />

            <div>
              <div className="rounded-xl p-4 mb-6" style={{ background: theme.panel, border: `1px solid ${theme.panelBorder}` }}>
                <GrowthChart
                  data={chartData}
                  showReal={showReal}
                  showMonteCarlo={showMonteCarlo}
                  baseJalaliYear={baseJalaliYear}
                  persianDigits={persianDigits}
                />
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <MetricCard label="مجموع واریزی شما" value={formatNumber(last.principal, persianDigits) + " ت"} accent={theme.teal} />
                <MetricCard label="سود مرکب کسب‌شده" value={formatNumber(last.interest, persianDigits) + " ت"} accent={theme.gold} />
                <MetricCard
                  label="ارزش واقعی امروز"
                  value={formatNumber(last.real, persianDigits) + " ت"}
                  sub={inflationSubLabel}
                  accent={theme.warn}
                />
              </div>

              <ScenarioCompare initial={initial} monthly={monthly} years={years} persianDigits={persianDigits} />

              <BacktestPanel rate={rate} persianDigits={persianDigits} />

              <GoalSeek initial={initial} rate={rate} persianDigits={persianDigits} />

              <YearlyTable data={data} baseJalaliYear={baseJalaliYear} persianDigits={persianDigits} />
            </div>
          </div>

          <Disclaimer>
            این ابزار صرفاً یک شبیه‌ساز آموزشی است. نرخ‌های پیش‌فرض بازده و تورم برآوردی‌اند، نه پیش‌بینی قطعی یا توصیه
            سرمایه‌گذاری. برای تصمیم مالی واقعی حتماً با منابع رسمی و مشاور مالی مشورت کن.
          </Disclaimer>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
