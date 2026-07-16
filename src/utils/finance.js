import { IRAN_INFLATION_HISTORY, INFLATION_YEARS, LATEST_INFLATION_YEAR } from "../data/inflationHistory";

// شبیه‌سازی رشد سرمایه با سود مرکب ماهانه، به تفکیک اصل پول و سود
export function simulateGrowth({ initial, monthly, annualRatePct, years, inflationPct }) {
  const r = annualRatePct / 100 / 12;
  const inf = inflationPct / 100;
  const data = [];
  let balance = initial;
  let contributed = initial;
  const totalMonths = Math.max(1, Math.round(years * 12));
  for (let m = 0; m <= totalMonths; m++) {
    if (m > 0) {
      balance = balance * (1 + r) + monthly;
      contributed += monthly;
    }
    if (m % 12 === 0) {
      const yearIdx = m / 12;
      const interest = Math.max(0, balance - contributed);
      const real = balance / Math.pow(1 + inf, yearIdx);
      data.push({
        year: yearIdx,
        principal: Math.round(contributed),
        interest: Math.round(interest),
        total: Math.round(balance),
        real: Math.round(real),
      });
    }
  }
  return data;
}

export function finalValue({ initial, monthly, annualRatePct, years }) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return initial + monthly * n;
  const fvLump = initial * Math.pow(1 + r, n);
  const fvAnnuity = monthly * ((Math.pow(1 + r, n) - 1) / r);
  return fvLump + fvAnnuity;
}

// محاسبه معکوس: واریز ماهانه لازم برای رسیدن به یک هدف مشخص
export function requiredMonthly({ initial, target, annualRatePct, years }) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  const fvLump = initial * Math.pow(1 + r, n);
  if (r === 0) return Math.max(0, (target - fvLump) / n);
  const denom = (Math.pow(1 + r, n) - 1) / r;
  return Math.max(0, (target - fvLump) / denom);
}

// قانون ۷۲: تخمین سال‌های لازم برای دوبرابر شدن سرمایه با نرخ ثابت
export function ruleOf72(annualRatePct) {
  if (!annualRatePct || annualRatePct <= 0) return Infinity;
  return 72 / annualRatePct;
}

function randNormal() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = (sortedArr.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

// شبیه‌سازی مونت‌کارلو: چند صد مسیر تصادفی با نوسان بازده، برای نمایش بازه احتمالی نتیجه
export function monteCarloBands({ initial, monthly, meanRatePct, volatilityPct, years, trials = 250 }) {
  const monthlyMean = meanRatePct / 100 / 12;
  const monthlyVol = volatilityPct / 100 / Math.sqrt(12);
  const totalMonths = Math.max(1, Math.round(years * 12));
  // yearBalances[yearIdx] = آرایه‌ای از موجودی همه مسیرها در پایان آن سال
  const yearBalances = Array.from({ length: totalMonths / 12 + 1 }, () => []);

  for (let t = 0; t < trials; t++) {
    let balance = initial;
    yearBalances[0].push(balance);
    for (let m = 1; m <= totalMonths; m++) {
      const monthlyReturn = monthlyMean + monthlyVol * randNormal();
      balance = balance * (1 + monthlyReturn) + monthly;
      if (m % 12 === 0) {
        yearBalances[m / 12].push(balance);
      }
    }
  }

  return yearBalances.map((arr, yearIdx) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return {
      year: yearIdx,
      mc10: Math.round(percentile(sorted, 0.1)),
      mc50: Math.round(percentile(sorted, 0.5)),
      mc90: Math.round(percentile(sorted, 0.9)),
    };
  });
}

// بک‌تست تاریخی: با استفاده از تورم واقعی سال‌به‌سال ایران، ارزش واقعی امروزِ
// سرمایه‌ای که در یک سال مشخص در گذشته شروع شده را محاسبه می‌کند.
export function backtestFromHistory({ initial, monthly, nominalAnnualRatePct, startYear }) {
  const years = INFLATION_YEARS.filter((y) => y >= startYear && y <= LATEST_INFLATION_YEAR);
  if (!years.length) return null;

  const r = nominalAnnualRatePct / 100 / 12;
  let balance = initial;
  let contributed = initial;
  let cumulativeCPI = 1;

  years.forEach((y) => {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
      contributed += monthly;
    }
    cumulativeCPI *= 1 + IRAN_INFLATION_HISTORY[y] / 100;
  });

  const realValue = balance / cumulativeCPI;
  return {
    years: years.length,
    nominalTotal: Math.round(balance),
    contributed: Math.round(contributed),
    realValue: Math.round(realValue),
    cumulativeInflationPct: Math.round((cumulativeCPI - 1) * 100),
  };
}
