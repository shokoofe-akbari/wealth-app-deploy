import React, { useMemo, useState } from "react";
import { Target } from "lucide-react";
import { useTheme } from "../theme";
import { SectionCard, NumberField } from "./UI";
import { formatNumber } from "../utils/jalali";
import { requiredMonthly } from "../utils/finance";

export default function GoalSeek({ initial, rate, persianDigits }) {
  const t = useTheme();
  const [goalTarget, setGoalTarget] = useState(2000000000);
  const [goalYears, setGoalYears] = useState(10);

  const goalPMT = useMemo(
    () => requiredMonthly({ initial, target: goalTarget, annualRatePct: rate, years: Math.max(1, goalYears) }),
    [initial, goalTarget, rate, goalYears]
  );

  return (
    <SectionCard className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Target size={14} style={{ color: t.gold }} />
        <span className="text-xs" style={{ color: t.muted }}>
          محاسبه معکوس: به هدفت برس
        </span>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <NumberField value={goalYears} onChange={setGoalYears} prefix="می‌خوام تا" suffix="سال دیگه" width="w-14" />
        <NumberField value={goalTarget} onChange={setGoalTarget} prefix="به" suffix="تومان برسم" width="w-32" />
      </div>
      <div className="mt-4 pt-3 text-sm" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
        باید ماهانه{" "}
        <span style={{ color: t.gold, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
          {formatNumber(goalPMT, persianDigits)} تومان
        </span>{" "}
        کنار بذاری (با نرخ بازده {formatNumber(rate, persianDigits)}٪ و سرمایه اولیه فعلی)
      </div>
    </SectionCard>
  );
}
