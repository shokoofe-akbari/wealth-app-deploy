// نرخ تورم سالانه ایران (درصد تغییر شاخص قیمت مصرف‌کننده نسبت به سال قبل)
// منبع: تجمیع داده‌های بانک جهانی (World Bank CPI indicator)، صندوق بین‌المللی پول (IMF)
// و Macrotrends. سال‌های ۲۰۲۲ تا ۲۰۲۵ مستقیماً از Macrotrends تأیید شده‌اند؛
// سال‌های قدیمی‌تر برآوردی و گرد شده‌اند و ممکن است با آمار رسمی بانک مرکزی
// یا مرکز آمار ایران (که بر مبنای سال شمسی محاسبه می‌شود) اندکی تفاوت داشته باشند.
// این داده صرفاً برای شبیه‌سازی آموزشی است، نه منبع رسمی آماری.
//
// کلید: سال میلادی → درصد تورم آن سال
export const IRAN_INFLATION_HISTORY = {
  2011: 21.5,
  2012: 30.5,
  2013: 34.7,
  2014: 15.6,
  2015: 11.9,
  2016: 9.0,
  2017: 9.6,
  2018: 30.2,
  2019: 34.8,
  2020: 36.5,
  2021: 40.2,
  2022: 43.5,
  2023: 44.6,
  2024: 32.5,
  2025: 42.2,
};

export const INFLATION_YEARS = Object.keys(IRAN_INFLATION_HISTORY)
  .map(Number)
  .sort((a, b) => a - b);

export const EARLIEST_INFLATION_YEAR = INFLATION_YEARS[0];
export const LATEST_INFLATION_YEAR = INFLATION_YEARS[INFLATION_YEARS.length - 1];

export function getAverageInflation(fromYear = EARLIEST_INFLATION_YEAR, toYear = LATEST_INFLATION_YEAR) {
  const rates = INFLATION_YEARS.filter((y) => y >= fromYear && y <= toYear).map(
    (y) => IRAN_INFLATION_HISTORY[y]
  );
  if (!rates.length) return 0;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

// میانگین n سال با کمترین تورم (برای سناریوی خوش‌بینانه)
export function getOptimisticInflation(n = 5) {
  const sorted = [...INFLATION_YEARS].sort(
    (a, b) => IRAN_INFLATION_HISTORY[a] - IRAN_INFLATION_HISTORY[b]
  );
  const picked = sorted.slice(0, n).map((y) => IRAN_INFLATION_HISTORY[y]);
  return picked.reduce((a, b) => a + b, 0) / picked.length;
}

// میانگین n سال با بیشترین تورم (برای سناریوی بدبینانه)
export function getPessimisticInflation(n = 5) {
  const sorted = [...INFLATION_YEARS].sort(
    (a, b) => IRAN_INFLATION_HISTORY[b] - IRAN_INFLATION_HISTORY[a]
  );
  const picked = sorted.slice(0, n).map((y) => IRAN_INFLATION_HISTORY[y]);
  return picked.reduce((a, b) => a + b, 0) / picked.length;
}
