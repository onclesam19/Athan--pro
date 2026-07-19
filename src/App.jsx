import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGES = {
  ar: { label: "العربية", dir: "rtl", translation: "ar.muyassar", name: "العربية" },
  fr: { label: "Français", dir: "ltr", translation: "fr.hamidullah", name: "Français" },
  en: { label: "English", dir: "ltr", translation: "en.sahih", name: "English" },
  tr: { label: "Türkçe", dir: "ltr", translation: "tr.diyanet", name: "Türkçe" },
  ur: { label: "اردو", dir: "rtl", translation: "ur.ahmedali", name: "اردو" },
};

const PRAYER_NAMES = {
  ar: { Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء", Sunrise: "الشروق" },
  fr: { Fajr: "Fajr", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha", Sunrise: "Lever" },
  en: { Fajr: "Fajr", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha", Sunrise: "Sunrise" },
  tr: { Fajr: "İmsak", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı", Sunrise: "Güneş" },
  ur: { Fajr: "فجر", Dhuhr: "ظہر", Asr: "عصر", Maghrib: "مغرب", Isha: "عشاء", Sunrise: "طلوع" },
};

const UI_TEXT = {
  ar: { prayerTimes: "أوقات الصلاة", quran: "القرآن الكريم", compass: "القبلة", settings: "الإعدادات", selectSurah: "اختر سورة", loading: "جارٍ التحميل...", error: "خطأ في التحميل", city: "المدينة", noLocation: "أدخل مدينتك", search: "بحث", nextPrayer: "الصلاة القادمة", ayah: "آية", of: "من", qibla: "اتجاه القبلة", direction: "الاتجاه", degrees: "درجة" },
  fr: { prayerTimes: "Horaires de Prière", quran: "Coran", compass: "Qibla", settings: "Paramètres", selectSurah: "Choisir une Sourate", loading: "Chargement...", error: "Erreur de chargement", city: "Ville", noLocation: "Entrez votre ville", search: "Rechercher", nextPrayer: "Prochaine prière", ayah: "Verset", of: "sur", qibla: "Direction de la Qibla", direction: "Direction", degrees: "degrés" },
  en: { prayerTimes: "Prayer Times", quran: "Quran", compass: "Qibla", settings: "Settings", selectSurah: "Select Surah", loading: "Loading...", error: "Loading error", city: "City", noLocation: "Enter your city", search: "Search", nextPrayer: "Next prayer", ayah: "Verse", of: "of", qibla: "Qibla Direction", direction: "Direction", degrees: "degrees" },
  tr: { prayerTimes: "Namaz Vakitleri", quran: "Kur'an-ı Kerim", compass: "Kıble", settings: "Ayarlar", selectSurah: "Sure Seçin", loading: "Yükleniyor...", error: "Yükleme hatası", city: "Şehir", noLocation: "Şehrinizi girin", search: "Ara", nextPrayer: "Sonraki namaz", ayah: "Ayet", of: "/", qibla: "Kıble Yönü", direction: "Yön", degrees: "derece" },
  ur: { prayerTimes: "نماز کے اوقات", quran: "قرآن مجید", compass: "قبلہ", settings: "ترتیبات", selectSurah: "سورہ منتخب کریں", loading: "لوڈ ہو رہا ہے...", error: "لوڈنگ میں خرابی", city: "شہر", noLocation: "اپنا شہر درج کریں", search: "تلاش", nextPrayer: "اگلی نماز", ayah: "آیت", of: "کا", qibla: "قبلہ کی سمت", direction: "سمت", degrees: "ڈگری" },
};

const SURAHS_LIST = [
  { number: 1, name: "Al-Fatiha", arabic: "الفاتحة", verses: 7 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", verses: 286 },
  { number: 3, name: "Al-Imran", arabic: "آل عمران", verses: 200 },
  { number: 4, name: "An-Nisa", arabic: "النساء", verses: 176 },
  { number: 5, name: "Al-Ma'idah", arabic: "المائدة", verses: 120 },
  { number: 6, name: "Al-An'am", arabic: "الأنعام", verses: 165 },
  { number: 7, name: "Al-A'raf", arabic: "الأعراف", verses: 206 },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", verses: 75 },
  { number: 9, name: "At-Tawbah", arabic: "التوبة", verses: 129 },
  { number: 10, name: "Yunus", arabic: "يونس", verses: 109 },
  { number: 11, name: "Hud", arabic: "هود", verses: 123 },
  { number: 12, name: "Yusuf", arabic: "يوسف", verses: 111 },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", verses: 43 },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", verses: 52 },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", verses: 99 },
  { number: 16, name: "An-Nahl", arabic: "النحل", verses: 128 },
  { number: 17, name: "Al-Isra", arabic: "الإسراء", verses: 111 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", verses: 110 },
  { number: 19, name: "Maryam", arabic: "مريم", verses: 98 },
  { number: 20, name: "Ta-Ha", arabic: "طه", verses: 135 },
  { number: 21, name: "Al-Anbiya", arabic: "الأنبياء", verses: 112 },
  { number: 22, name: "Al-Hajj", arabic: "الحج", verses: 78 },
  { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", verses: 118 },
  { number: 24, name: "An-Nur", arabic: "النور", verses: 64 },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", verses: 77 },
  { number: 36, name: "Ya-Sin", arabic: "يس", verses: 83 },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", verses: 59 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", verses: 78 },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", verses: 96 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", verses: 30 },
  { number: 78, name: "An-Naba", arabic: "النبأ", verses: 40 },
  { number: 87, name: "Al-A'la", arabic: "الأعلى", verses: 19 },
  { number: 89, name: "Al-Fajr", arabic: "الفجر", verses: 30 },
  { number: 93, name: "Ad-Duha", arabic: "الضحى", verses: 11 },
  { number: 94, name: "Ash-Sharh", arabic: "الشرح", verses: 8 },
  { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", verses: 8 },
  { number: 108, name: "Al-Kawthar", arabic: "الكوثر", verses: 3 },
  { number: 109, name: "Al-Kafirun", arabic: "الكافرون", verses: 6 },
  { number: 110, name: "An-Nasr", arabic: "النصر", verses: 3 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", verses: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", verses: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", verses: 6 },
];

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useCompass() {
  const [heading, setHeading] = useState(null);
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        const lat1 = (latitude * Math.PI) / 180;
        const lat2 = (21.4225 * Math.PI) / 180;
        const dLon = ((39.8262 - longitude) * Math.PI) / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        const brng = (Math.atan2(y, x) * 180) / Math.PI;
        setQiblaAngle((brng + 360) % 360);
      });
    }
    const handleOrientation = (e) => {
      if (e.webkitCompassHeading != null) setHeading(e.webkitCompassHeading);
      else if (e.alpha != null) setHeading((360 - e.alpha) % 360);
    };
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission !== "function") {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, []);
  return { heading, qiblaAngle, coords };
}

function formatTime(t) { if (!t) return "--:--"; return t; }

function getNextPrayer(timings) {
  if (!timings) return null;
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const p of prayers) {
    if (!timings[p]) continue;
    const [h, m] = timings[p].split(":").map(Number);
    if (h * 60 + m > nowMin) return { name: p, time: timings[p] };
  }
  return { name: "Fajr", time: timings["Fajr"] };
}

function getCountdown(timeStr) {
  if (!timeStr) return "";
  const now = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);
  const diff = Math.floor((target - now) / 1000);
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor((diff % 3600) / 60);
  const ss = diff % 60;
  return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}function PrayerCard({ name, time, isNext, lang }) {
  const pNames = PRAYER_NAMES[lang] || PRAYER_NAMES.fr;
  const icons = { Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌇", Isha: "🌃" };
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", borderRadius: 14,
      background: isNext ? "linear-gradient(135deg, #1a3a1a 0%, #0f2a1a 100%)" : "rgba(255,255,255,0.03)",
      border: isNext ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.06)",
      boxShadow: isNext ? "0 0 20px rgba(74,222,128,0.15)" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{icons[name] || "🕌"}</span>
        <div>
          <div style={{ color: isNext ? "#4ade80" : "#a0b8a0", fontSize: 14, fontWeight: 600 }}>
            {pNames[name] || name}
          </div>
          {isNext && <div style={{ color: "#6b8f6b", fontSize: 11, marginTop: 2 }}>Prochaine</div>}
        </div>
      </div>
      <div style={{ color: isNext ? "#4ade80" : "#6b8f6b", fontFamily: "monospace", fontSize: 17, fontWeight: 700 }}>
        {formatTime(time)}
      </div>
    </div>
  );
}

function CompassNeedle({ heading, qiblaAngle }) {
  const needleAngle = heading != null && qiblaAngle != null ? qiblaAngle - heading : qiblaAngle ?? 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ position: "relative", width: 220, height: 220 }}>
        <svg width="220" height="220" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <radialGradient id="compassGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a2a1a" />
              <stop offset="100%" stopColor="#0d1a0d" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="110" r="108" fill="url(#compassGrad)" stroke="#2d5a27" strokeWidth="2" />
          <circle cx="110" cy="110" r="90" fill="none" stroke="#1e3a1a" strokeWidth="1" strokeDasharray="4 6" />
          {[{ angle: 0, label: "N" }, { angle: 90, label: "E" }, { angle: 180, label: "S" }, { angle: 270, label: "W" }].map(({ angle, label }) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = 110 + 78 * Math.cos(rad);
            const y = 110 + 78 * Math.sin(rad);
            return (
              <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fill={label === "N" ? "#4ade80" : "#6b8f6b"} fontSize="13" fontWeight="700">
                {label}
              </text>
            );
          })}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180 - Math.PI / 2;
            const isMajor = i % 9 === 0;
            const r1 = isMajor ? 95 : 98;
            return (
              <line key={i}
                x1={110 + r1 * Math.cos(angle)} y1={110 + r1 * Math.sin(angle)}
                x2={110 + 105 * Math.cos(angle)} y2={110 + 105 * Math.sin(angle)}
                stroke={isMajor ? "#4ade80" : "#2d4a2d"} strokeWidth={isMajor ? 2 : 1} />
            );
          })}
        </svg>
        <div style={{
          position: "absolute", top: 0, left: 0, width: 220, height: 220,
          transform: `rotate(${needleAngle}deg)`,
          transition: "transform 0.3s ease",
        }}>
          <svg width="220" height="220">
            <polygon points="110,22 118,108 102,108" fill="#4ade80" opacity="0.9" />
            <polygon points="110,198 118,112 102,112" fill="#374151" opacity="0.7" />
            <circle cx="110" cy="110" r="8" fill="#4ade80" />
            <circle cx="110" cy="110" r="4" fill="#0d1a0d" />
          </svg>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        {heading != null ? (
          <div style={{ color: "#4ade80", fontSize: 13, fontFamily: "monospace" }}>
            ↑ {Math.round(heading)}° · Qibla: {qiblaAngle ? Math.round(qiblaAngle) + "°" : "—"}
          </div>
        ) : (
          <div style={{ color: "#6b8f6b", fontSize: 12 }}>
            Qibla: {qiblaAngle ? Math.round(qiblaAngle) + "°" : "Calculé depuis coordonnées"}
          </div>
        )}
      </div>
    </div>
  );
}export default function AthanApp() {
  const [tab, setTab] = useState("prayer");
  const [lang, setLang] = useState("fr");
  const [city, setCity] = useState("Paris");
  const [cityInput, setCityInput] = useState("Paris");
  const [prayerData, setPrayerData] = useState(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [surahLoading, setSurahLoading] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const now = useClock();
  const { heading, qiblaAngle, coords } = useCompass();
  const t = UI_TEXT[lang] || UI_TEXT.fr;
  const dir = LANGUAGES[lang]?.dir || "ltr";

  const fetchPrayers = useCallback(async (cityName) => {
    if (!cityName) return;
    setPrayerLoading(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=&method=2`);
      const data = await res.json();
      if (data.code === 200) setPrayerData(data.data);
    } catch (e) {}
    setPrayerLoading(false);
  }, []);

  useEffect(() => { fetchPrayers(city); }, [city]);

  const fetchSurah = useCallback(async (number) => {
    setSurahLoading(true);
    setSurahData(null);
    try {
      const translation = LANGUAGES[lang]?.translation || "fr.hamidullah";
      const [arabicRes, transRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/${translation}`),
      ]);
      const arabicData = await arabicRes.json();
      const transData = await transRes.json();
      if (arabicData.code === 200 && transData.code === 200) {
        setSurahData({ arabic: arabicData.data, translation: transData.data });
      }
    } catch (e) {}
    setSurahLoading(false);
  }, [lang]);

  useEffect(() => { if (selectedSurah) fetchSurah(selectedSurah.number); }, [selectedSurah, lang]);

  const timings = prayerData?.timings;
  const nextPrayer = getNextPrayer(timings);
  const countdown = nextPrayer ? getCountdown(nextPrayer.time) : "";
  const filteredSurahs = SURAHS_LIST.filter(s =>
    s.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.arabic.includes(surahSearch) ||
    String(s.number).includes(surahSearch)
  );
  const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const hijri = prayerData?.date?.hijri;
  const gregorian = prayerData?.date?.readable;

  return (
    <div dir={dir} style={{
      minHeight: "100vh", background: "#080f08",
      fontFamily: dir === "rtl" ? "'Amiri', serif" : "'Jost', sans-serif",
      color: "#c8dcc8", display: "flex", flexDirection: "column",
      maxWidth: 440, margin: "0 auto", position: "relative",
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(74,222,128,0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(74,222,128,0.03) 0%, transparent 50%)` }} />

      <header style={{ position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,15,8,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(74,222,128,0.12)", padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🕌</span>
            <div>
              <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 18 }}>أَذَان</div>
              <div style={{ color: "#4a6a4a", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Athan App</div>
              <div style={{ color: "#3a5a3a", fontSize: 9, marginTop: 1 }}>
                par <span style={{ color: "#4ade80", fontWeight: 700 }}>Sami Vitija</span> 🇦🇱
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "monospace", fontSize: 15, color: "#4ade80", fontWeight: 700,
              background: "rgba(74,222,128,0.08)", padding: "4px 10px", borderRadius: 8,
              border: "1px solid rgba(74,222,128,0.15)" }}>
              {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{
                background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 8, padding: "6px 10px", color: "#4ade80", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {LANGUAGES[lang].label}
              </button>
              {showLangMenu && (
                <div style={{ position: "absolute", top: "110%", right: 0, background: "#0f1f0f",
                  border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, overflow: "hidden",
                  zIndex: 200, minWidth: 130, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  {Object.entries(LANGUAGES).map(([code, info]) => (
                    <button key={code} onClick={() => { setLang(code); setShowLangMenu(false); }} style={{
                      display: "block", width: "100%", padding: "10px 16px", textAlign: "right",
                      background: lang === code ? "rgba(74,222,128,0.1)" : "transparent",
                      border: "none", color: lang === code ? "#4ade80" : "#6b8f6b",
                      cursor: "pointer", fontSize: 13, fontWeight: lang === code ? 700 : 400 }}>
                      {info.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {hijri && (
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#4a6a4a" }}>{gregorian}</span>
            <span style={{ fontSize: 12, color: "#6b8f6b", fontFamily: "serif" }}>
              {hijri.day} {hijri.month.en} {hijri.year} هـ
            </span>
          </div>
        )}
      </header>

      <main style={{ flex: 1, padding: "20px 16px 100px", position: "relative", zIndex: 1 }}>
        {tab === "prayer" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input value={cityInput} onChange={e => setCityInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setCity(cityInput)}
                placeholder={t.noLocation} style={{
                  flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,222,128,0.15)",
                  borderRadius: 12, padding: "12px 16px", color: "#c8dcc8", fontSize: 14,
                  outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => setCity(cityInput)} style={{
                background: "linear-gradient(135deg, #2d6a27, #1a4a1a)", border: "none",
                borderRadius: 12, padding: "12px 18px", color: "#4ade80", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                🔍
              </button>
            </div>
            {nextPrayer && !prayerLoading && (
              <div style={{ background: "linear-gradient(135deg, #0f2a1a 0%, #0a1f0f 100%)",
                border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "20px",
                marginBottom: 20, textAlign: "center", boxShadow: "0 0 40px rgba(74,222,128,0.08)" }}>
                <div style={{ color: "#4a6a4a", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{t.nextPrayer}</div>
                <div style={{ color: "#4ade80", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
                  {(PRAYER_NAMES[lang] || PRAYER_NAMES.fr)[nextPrayer.name] || nextPrayer.name}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: 4,
                  textShadow: "0 0 20px rgba(74,222,128,0.3)" }}>{countdown}</div>
                <div style={{ color: "#4a6a4a", fontSize: 13, marginTop: 4 }}>{formatTime(nextPrayer.time)}</div>
              </div>
            )}
            {prayerLoading ? (
              <div style={{ textAlign: "center", color: "#4a6a4a", padding: 40 }}>{t.loading}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {timings ? prayerKeys.map(key => (
                  <PrayerCard key={key} name={key} time={timings[key]} isNext={nextPrayer?.name === key} lang={lang} />
                )) : <div style={{ textAlign: "center", color: "#4a6a4a", padding: 40 }}>{t.error}</div>}
              </div>
            )}
          </div>
        )}

        {tab === "quran" && (
          <div>
            {!selectedSurah ? (
              <>
                <input value={surahSearch} onChange={e => setSurahSearch(e.target.value)}
                  placeholder={`🔍 ${t.search}...`} style={{
                    width: "100%", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12,
                    padding: "12px 16px", color: "#c8dcc8", fontSize: 14,
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 16 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {filteredSurahs.map(s => (
                    <button key={s.number} onClick={() => setSelectedSurah(s)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 16px", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(74,222,128,0.08)", borderRadius: 12,
                      color: "#c8dcc8", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(74,222,128,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#4ade80", fontSize: 12, fontWeight: 700 }}>{s.number}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "#4a6a4a" }}>{s.verses} versets</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 18, color: "#4ade80", fontFamily: "serif" }}>{s.arabic}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <button onClick={() => { setSelectedSurah(null); setSurahData(null); }} style={{
                    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)",
                    borderRadius: 10, padding: "8px 12px", color: "#4ade80", cursor: "pointer", fontSize: 16 }}>←</button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 18 }}>{selectedSurah.arabic}</div>
                    <div style={{ color: "#4a6a4a", fontSize: 12 }}>{selectedSurah.name} · {selectedSurah.verses} {t.ayah}</div>
                  </div>
                </div>
                {selectedSurah.number !== 9 && (
                  <div style={{ textAlign: "center", marginBottom: 20, fontFamily: "serif", padding: "16px",
                    background: "rgba(74,222,128,0.05)", borderRadius: 16, border: "1px solid rgba(74,222,128,0.1)" }}>
                    <div style={{ fontSize: 22, color: "#4ade80", marginBottom: 6 }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>
                    <div style={{ fontSize: 11, color: "#4a6a4a", letterSpacing: 1 }}>Bismillah ir-Rahman ir-Rahim</div>
                  </div>
                )}
                {surahLoading ? (
                  <div style={{ textAlign: "center", color: "#4a6a4a", padding: 40 }}>{t.loading}</div>
                ) : surahData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {surahData.arabic.ayahs.map((ayah, i) => {
                      const trans = surahData.translation?.ayahs?.[i];
                      return (
                        <div key={ayah.numberInSurah} style={{ background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(74,222,128,0.06)", borderRadius: 14, padding: "16px" }}>
                          <span style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", width: 28, height: 28,
                            borderRadius: 7, display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{ayah.numberInSurah}</span>
                          <div style={{ direction: "rtl", textAlign: "right", fontFamily: "'Amiri', serif",
                            fontSize: 22, lineHeight: 2.2, color: "#e8f4e8", marginBottom: 10 }}>{ayah.text}</div>
                          {trans && lang !== "ar" && (
                            <div style={{ direction: dir, textAlign: dir === "rtl" ? "right" : "left",
                              fontSize: 13, color: "#7a9a7a", lineHeight: 1.7, fontStyle: "italic",
                              borderTop: "1px solid rgba(74,222,128,0.06)", paddingTop: 10 }}>{trans.text}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : <div style={{ textAlign: "center", color: "#4a6a4a", padding: 40 }}>{t.error}</div>}
              </div>
            )}
          </div>
        )}

        {tab === "compass" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#4ade80", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{t.qibla}</div>
              <div style={{ color: "#4a6a4a", fontSize: 13 }}>
                {coords ? `${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°` : t.noLocation}
              </div>
            </div>
            <CompassNeedle heading={heading} qiblaAngle={qiblaAngle} />
            {qiblaAngle && (
              <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: 16, padding: "16px 28px", textAlign: "center" }}>
                <div style={{ color: "#4a6a4a", fontSize: 12, marginBottom: 4 }}>{t.direction}</div>
                <div style={{ color: "#4ade80", fontSize: 32, fontWeight: 900, fontFamily: "monospace" }}>{Math.round(qiblaAngle)}°</div>
                <div style={{ color: "#6b8f6b", fontSize: 12, marginTop: 2 }}>{t.degrees}</div>
              </div>
            )}
            <div style={{ background: "rgba(74,222,128,0.03)", border: "1px solid rgba(74,222,128,0.08)",
              borderRadius: 14, padding: 16, textAlign: "center", maxWidth: 300 }}>
              <p style={{ color: "#4a6a4a", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                🕋 La Mecque · 21.4225° N, 39.8262° E<br />
                L'aiguille verte indique la direction de la Qibla
              </p>
            </div>
          </div>
        )}
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 440, background: "rgba(8,15,8,0.97)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(74,222,128,0.12)", display: "flex", padding: "8px 0 12px", zIndex: 100 }}>
        {[
          { id: "prayer", icon: "🕐", label: t.prayerTimes },
          { id: "quran", icon: "📖", label: t.quran },
          { id: "compass", icon: "🧭", label: t.compass },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer", padding: "8px 4px" }}>
            <span style={{ fontSize: 22, filter: tab === item.id ? "drop-shadow(0 0 6px rgba(74,222,128,0.6))" : "none" }}>
              {item.icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: tab === item.id ? 700 : 400,
              color: tab === item.id ? "#4ade80" : "#4a6a4a" }}>{item.label}</span>
            {tab === item.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ade80" }} />}
          </button>
        ))}
      </nav>

      <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 440, textAlign: "center", padding: "4px 0", zIndex: 99, pointerEvents: "none" }}>
        <span style={{ fontSize: 10, color: "#2d4a2d", letterSpacing: 0.5 }}>
          Créé par <span style={{ color: "#4a6a4a", fontWeight: 700 }}>Sami Vitija</span> · d'origine Albanaise 🇦🇱
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #4a6a4a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}
