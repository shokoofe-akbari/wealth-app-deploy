import React, { useMemo } from "react";
import { Download } from "lucide-react";
import { useTheme } from "../theme";
import { SectionCard } from "./UI";
import { formatNumber } from "../utils/jalali";

export default function YearlyTable({ data, baseJalaliYear, persianDigits }) {
  const t = useTheme();

  const rows = useMemo(() => {
    if (data.length <= 12) return data;
    const step = Math.ceil(data.length / 12);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  const downloadCSV = () => {
    const header = ["سال شمسی", "واریزی تجمعی", "سود تجمعی", "مجموع", "ارزش واقعی"];
    const lines = [header.join(",")];
    data.forEach((row) => {
      lines.push([baseJalaliYear + row.year, row.principal, row.interest, row.total, row.real].join(","));
    });
    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roshd-e-sarmaye.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SectionCard className="overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: t.muted }}>
          ریز روند سال‌به‌سال
        </span>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition"
          style={{ background: t.tealSoft, color: t.teal, border: `1px solid ${t.panelBorder}` }}
        >
          <Download size={12} />
          دانلود CSV
        </button>
      </div>
      <table className="w-full text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: t.muted, textAlign: "right" }}>
            <th className="py-2 pr-2">سال</th>
            <th className="py-2">واریزی تجمعی</th>
            <th className="py-2">سود تجمعی</th>
            <th className="py-2">مجموع</th>
            <th className="py-2">ارزش واقعی</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year} style={{ borderTop: `1px solid ${t.panelBorder}` }}>
              <td className="py-2 pr-2" style={{ color: t.text }}>
                {formatNumber(baseJalaliYear + row.year, persianDigits)}
              </td>
              <td className="py-2" style={{ color: t.teal }}>
                {formatNumber(row.principal, persianDigits)}
              </td>
              <td className="py-2" style={{ color: t.gold }}>
                {formatNumber(row.interest, persianDigits)}
              </td>
              <td className="py-2 font-semibold" style={{ color: t.text }}>
                {formatNumber(row.total, persianDigits)}
              </td>
              <td className="py-2" style={{ color: t.warn }}>
                {formatNumber(row.real, persianDigits)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
