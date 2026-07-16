import React, { useState } from "react";
import { Sparkles, Share2, Printer, Check, Hash } from "lucide-react";
import { useTheme } from "../theme";
import { ThemeToggle } from "./UI";
import { formatNumber } from "../utils/jalali";

export default function Header({
  total,
  multiplier,
  years,
  rate,
  themeMode,
  onToggleTheme,
  persianDigits,
  onTogglePersianDigits,
  onShare,
}) {
  const t = useTheme();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const ok = await onShare();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const numberFont = persianDigits ? "'Vazirmatn', sans-serif" : "'Fraunces', serif";

  return (
    <div className="mb-8">
      <div className="no-print flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: t.gold }} />
          <span className="text-xs tracking-wide" style={{ color: t.muted }}>
            شبیه‌ساز ثروت — سود مرکب با تورم واقعی ایران
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePersianDigits}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition"
            style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.muted }}
            aria-label="تغییر ارقام فارسی/انگلیسی"
          >
            <Hash size={13} />
            {persianDigits ? "۱۲۳" : "123"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition"
            style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: copied ? t.teal : t.muted }}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            {copied ? "کپی شد" : "اشتراک‌گذاری"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition"
            style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.muted }}
          >
            <Printer size={13} />
            چاپ گزارش
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <h1 style={{ fontFamily: numberFont, fontSize: "2.6rem", fontWeight: 700, color: t.text, lineHeight: 1.1 }}>
          {formatNumber(total, persianDigits)} <span style={{ fontSize: "1.1rem", color: t.muted, fontWeight: 400 }}>تومان</span>
        </h1>
        <span
          className="text-sm mb-2 px-2 py-1 rounded"
          style={{ color: t.gold, background: t.goldSoft, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          ×{formatNumber(multiplier.toFixed(1), persianDigits)} در {formatNumber(years, persianDigits)} سال
        </span>
      </div>
      <p className="text-sm mt-1" style={{ color: t.muted }}>
        ارزش دارایی تو در پایان دوره، با احتساب واریز ماهانه و سود مرکب سالانه {formatNumber(rate, persianDigits)}٪
      </p>
    </div>
  );
}
