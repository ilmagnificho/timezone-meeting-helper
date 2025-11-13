// Simple, focused timezone converter for meeting scheduling.
// Uses Luxon (loaded from CDN) for robust timezone & DST handling.

const { DateTime } = luxon;

const i18n = {
  en: {
    title: "Meeting Timezone Helper",
    language: "Language",
    subtitle: "Convert meeting times instantly between your timezone and your partner's.",
    myTimeTitle: "My Time",
    partnerTimeTitle: "Partner Time",
    timezoneLabel: "Timezone / City",
    dateLabel: "Date",
    timeLabel: "Time",
    swapButton: "Swap My Time & Partner Time",
    hintText:
      "Type in either side (date & time), and the other side updates instantly with correct timezone conversion.",
    footerText:
      "Made for frequent international meetings. Built by you, powered by the browser."
  },
  ko: {
    title: "해외 미팅 시차 계산기",
    language: "언어",
    subtitle: "내 시간대와 상대 시간대를 한 번에 변환해서, 미팅 일정 조율을 더 쉽게 만들어 줍니다.",
    myTimeTitle: "내 시간",
    partnerTimeTitle: "상대방 시간",
    timezoneLabel: "시간대 / 도시",
    dateLabel: "날짜",
    timeLabel: "시간",
    swapButton: "내 시간 ↔ 상대방 시간 바꾸기",
    hintText:
      "양쪽 중 편한 쪽에 날짜와 시간을 입력하면, 다른 쪽이 자동으로 시차를 반영해 변환됩니다.",
    footerText:
      "해외 미팅이 잦은 사용자를 위해 만든 간단한 시차 계산 도구입니다."
  },
  ja: {
    title: "ミーティング時差コンバーター",
    language: "言語",
    subtitle: "自分のタイムゾーンと相手のタイムゾーンを一瞬で変換し、日程調整をスムーズにします。",
    myTimeTitle: "自分の時間",
    partnerTimeTitle: "相手の時間",
    timezoneLabel: "タイムゾーン / 都市",
    dateLabel: "日付",
    timeLabel: "時刻",
    swapButton: "自分の時間と相手の時間を入れ替える",
    hintText:
      "どちらか一方の日付と時刻を入力すると、もう一方が自動的に時差を考慮して更新されます。",
    footerText:
      "海外とのミーティングが多い方向けに作られた、シンプルな時差計算ツールです。"
  },
  zh: {
    title: "会议时差转换工具",
    language: "语言",
    subtitle: "在您的时区和对方时区之间快速转换，轻松安排跨国会议时间。",
    myTimeTitle: "我的时间",
    partnerTimeTitle: "对方时间",
    timezoneLabel: "时区 / 城市",
    dateLabel: "日期",
    timeLabel: "时间",
    swapButton: "交换我的时间和对方时间",
    hintText:
      "在任意一侧输入日期和时间，另一侧会自动根据时差实时更新。",
    footerText:
      "为经常开跨国会议的用户打造的简洁时差计算工具。"
  }
};

// A curated list of useful IANA timezones with human-friendly labels.
const timezones = [
  { zone: "Asia/Seoul", label: "Seoul (Korea)" },
  { zone: "Asia/Tokyo", label: "Tokyo (Japan)" },
  { zone: "Asia/Shanghai", label: "Shanghai (China)" },
  { zone: "Asia/Hong_Kong", label: "Hong Kong" },
  { zone: "Asia/Singapore", label: "Singapore" },
  { zone: "Asia/Bangkok", label: "Bangkok (Thailand)" },
  { zone: "Asia/Dubai", label: "Dubai (UAE)" },
  { zone: "Europe/London", label: "London (UK)" },
  { zone: "Europe/Paris", label: "Paris (France)" },
  { zone: "Europe/Berlin", label: "Berlin (Germany)" },
  { zone: "Europe/Amsterdam", label: "Amsterdam (Netherlands)" },
  { zone: "Europe/Madrid", label: "Madrid (Spain)" },
  { zone: "Europe/Moscow", label: "Moscow (Russia)" },
  { zone: "America/New_York", label: "New York (US Eastern)" },
  { zone: "America/Chicago", label: "Chicago (US Central)" },
  { zone: "America/Denver", label: "Denver (US Mountain)" },
  { zone: "America/Los_Angeles", label: "Los Angeles (US Pacific)" },
  { zone: "America/Vancouver", label: "Vancouver (Canada Pacific)" },
  { zone: "America/Toronto", label: "Toronto (Canada Eastern)" },
  { zone: "America/Sao_Paulo", label: "São Paulo (Brazil)" },
  { zone: "Australia/Sydney", label: "Sydney (Australia)" },
  { zone: "Australia/Melbourne", label: "Melbourne (Australia)" },
  { zone: "Pacific/Auckland", label: "Auckland (New Zealand)" }
];

const els = {
  languageSelect: document.getElementById("language-select"),
  myTimezone: document.getElementById("my-timezone"),
  partnerTimezone: document.getElementById("partner-timezone"),
  myDate: document.getElementById("my-date"),
  myTime: document.getElementById("my-time"),
  partnerDate: document.getElementById("partner-date"),
  partnerTime: document.getElementById("partner-time"),
  swapBtn: document.getElementById("swap-btn")
};

let lastEdited = "my"; // "my" or "partner"
let suspendEvents = false;

function detectLanguage() {
  const navLang = (navigator.language || "en").toLowerCase();
  if (navLang.startsWith("ko")) return "ko";
  if (navLang.startsWith("ja")) return "ja";
  if (navLang.startsWith("zh")) return "zh";
  return "en";
}

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
  } catch {
    return "Asia/Seoul";
  }
}

function populateTimezones() {
  [els.myTimezone, els.partnerTimezone].forEach(select => {
    select.innerHTML = "";
    timezones.forEach(tz => {
      const opt = document.createElement("option");
      opt.value = tz.zone;
      opt.textContent = tz.label;
      select.appendChild(opt);
    });
  });

  const userZone = detectTimezone();
  const defaultIndex = timezones.findIndex(t => t.zone === userZone);
  if (defaultIndex >= 0) {
    els.myTimezone.selectedIndex = defaultIndex;
  }

  const partnerDefaultIndex = timezones.findIndex(
    t => t.zone === "America/Los_Angeles"
  );
  els.partnerTimezone.selectedIndex =
    partnerDefaultIndex >= 0 ? partnerDefaultIndex : 0;
}

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.en;
  document.documentElement.lang = lang;
  document
    .querySelectorAll("[data-i18n]")
    .forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
}

function initLanguage() {
  const detected = detectLanguage();
  els.languageSelect.value = detected;
  applyLanguage(detected);

  els.languageSelect.addEventListener("change", () => {
    applyLanguage(els.languageSelect.value);
  });
}

function initializeDateTimeFields() {
  const now = DateTime.now();
  const dateStr = now.toISODate();
  const timeStr = now.toFormat("HH:mm");

  els.myDate.value = dateStr;
  els.myTime.value = timeStr;
  els.partnerDate.value = dateStr;
  els.partnerTime.value = timeStr;

  convert("my");
}

function readInputs(source) {
  const fromZone =
    source === "my" ? els.myTimezone.value : els.partnerTimezone.value;
  const toZone =
    source === "my" ? els.partnerTimezone.value : els.myTimezone.value;

  const fromDateEl = source === "my" ? els.myDate : els.partnerDate;
  const fromTimeEl = source === "my" ? els.myTime : els.partnerTime;

  const dateVal = fromDateEl.value;
  const timeVal = fromTimeEl.value;

  if (!dateVal || !timeVal || !fromZone || !toZone) return null;

  const [year, month, day] = dateVal.split("-").map(Number);
  const [hour, minute] = timeVal.split(":").map(Number);

  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: fromZone }
  );

  if (!dt.isValid) return null;

  const converted = dt.setZone(toZone);
  return { fromZone, toZone, dt, converted };
}

function updateTargetFields(source, converted) {
  const targetDateEl = source === "my" ? els.partnerDate : els.myDate;
  const targetTimeEl = source === "my" ? els.partnerTime : els.myTime;

  targetDateEl.value = converted.toISODate();
  targetTimeEl.value = converted.toFormat("HH:mm");
}

function convert(source) {
  if (suspendEvents) return;
  const payload = readInputs(source);
  if (!payload) return;
  const { converted } = payload;

  suspendEvents = true;
  updateTargetFields(source, converted);
  suspendEvents = false;
}

function attachEvents() {
  els.myTimezone.addEventListener("change", () => {
    lastEdited = "my";
    convert("my");
  });
  els.partnerTimezone.addEventListener("change", () => {
    lastEdited = "partner";
    convert("partner");
  });

  els.myDate.addEventListener("input", () => {
    if (suspendEvents) return;
    lastEdited = "my";
    convert("my");
  });
  els.myTime.addEventListener("input", () => {
    if (suspendEvents) return;
    lastEdited = "my";
    convert("my");
  });

  els.partnerDate.addEventListener("input", () => {
    if (suspendEvents) return;
    lastEdited = "partner";
    convert("partner");
  });
  els.partnerTime.addEventListener("input", () => {
    if (suspendEvents) return;
    lastEdited = "partner";
    convert("partner");
  });

  els.swapBtn.addEventListener("click", () => {
    const myIndex = els.myTimezone.selectedIndex;
    const partnerIndex = els.partnerTimezone.selectedIndex;

    suspendEvents = true;
    els.myTimezone.selectedIndex = partnerIndex;
    els.partnerTimezone.selectedIndex = myIndex;

    const myDate = els.myDate.value;
    const myTime = els.myTime.value;
    els.myDate.value = els.partnerDate.value;
    els.myTime.value = els.partnerTime.value;
    els.partnerDate.value = myDate;
    els.partnerTime.value = myTime;
    suspendEvents = false;

    lastEdited = "my";
    convert("my");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateTimezones();
  initLanguage();
  attachEvents();
  initializeDateTimeFields();
});
