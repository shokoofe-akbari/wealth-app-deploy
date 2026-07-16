import React from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../theme";
import { ChartTooltip } from "./UI";
import { formatNumber } from "../utils/jalali";

export default function GrowthChart({ data, showReal, showMonteCarlo, baseJalaliYear, persianDigits }) {
  const t = useTheme();

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.gold} stopOpacity={0.85} />
            <stop offset="100%" stopColor={t.gold} stopOpacity={0.15} />
          </linearGradient>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.teal} stopOpacity={0.7} />
            <stop offset="100%" stopColor={t.teal} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={t.panelBorder} vertical={false} />
        <XAxis
          dataKey="year"
          stroke={t.muted}
          fontSize={11}
          tickFormatter={(v) => formatNumber(baseJalaliYear + v, persianDigits)}
        />
        <YAxis stroke={t.muted} fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
        <Tooltip content={<ChartTooltip persianDigits={persianDigits} />} />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: t.muted }}>{v}</span>} />

        {showMonteCarlo && (
          <>
            <Area dataKey="mc10" stackId="mc" stroke="none" fill="transparent" legendType="none" isAnimationActive={false} />
            <Area
              dataKey="mcBand"
              name="بازه احتمالی ۸۰٪"
              stackId="mc"
              stroke="none"
              fill={t.violet}
              fillOpacity={0.18}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="mc50"
              name="میانه با نوسان بازار"
              stroke={t.violet}
              strokeWidth={1.5}
              strokeDasharray="2 3"
              dot={false}
              isAnimationActive={false}
            />
          </>
        )}

        <Area type="monotone" dataKey="principal" name="مجموع واریزی" stackId="1" stroke={t.teal} fill="url(#tealGrad)" />
        <Area type="monotone" dataKey="interest" name="سود مرکب" stackId="1" stroke={t.gold} fill="url(#goldGrad)" />
        {showReal && (
          <Line
            type="monotone"
            dataKey="real"
            name="ارزش واقعی (تعدیل تورم)"
            stroke={t.warn}
            strokeDasharray="5 4"
            strokeWidth={2}
            dot={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
