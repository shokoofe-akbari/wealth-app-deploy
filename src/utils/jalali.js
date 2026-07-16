// تبدیل تاریخ میلادی به شمسی (الگوریتم استاندارد، بدون نیاز به کتابخانه خارجی)
function div(a, b) {
  return Math.trunc(a / b);
}

export function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export function getCurrentJalaliYear() {
  const now = new Date();
  const [jy] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return jy;
}

// تخمین سال شمسی معادل یک سال میلادی مشخص (برای برچسب‌گذاری داده‌های تاریخی)
// دقت این تابع در حد سال است، نه ماه؛ برای نمایش کافی است.
export function approxJalaliFromGregorianYear(gregorianYear) {
  const [jy] = gregorianToJalali(gregorianYear, 6, 21);
  return jy;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input) {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(n, usePersian = false) {
  if (!isFinite(n)) return usePersian ? "—" : "—";
  const rounded = Math.round(n);
  const withCommas = rounded.toLocaleString("en-US");
  return usePersian ? toPersianDigits(withCommas) : withCommas;
}

export function formatYear(n, usePersian = false) {
  return usePersian ? toPersianDigits(Math.round(n)) : String(Math.round(n));
}
