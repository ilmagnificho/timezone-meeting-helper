// Enhanced Meeting Timezone Helper with improved UX and features
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
      "Made for frequent international meetings. Built by you, powered by the browser.",
    dstOnShort: "DST",
    dstOffShort: "Standard",
    diffLabel: "Time difference",
    nowButton: "Now",
    copyLinkButton: "Copy Link",
    linkCopied: "Link copied to clipboard!",
    hoursAhead: "hours ahead",
    hoursBehind: "hours behind",
    sameTime: "Same timezone",
    yourTimeIs: "Your time is",
    when: "when",
    partnerTimeIs: "partner time is"
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
      "해외 미팅이 잦은 사용자를 위해 만든 간단한 시차 계산 도구입니다.",
    dstOnShort: "서머타임",
    dstOffShort: "표준시",
    diffLabel: "시간 차이",
    nowButton: "지금",
    copyLinkButton: "링크 복사",
    linkCopied: "링크가 복사되었습니다!",
    hoursAhead: "시간 빠름",
    hoursBehind: "시간 느림",
    sameTime: "같은 시간대",
    yourTimeIs: "내 시간",
    when: "일 때",
    partnerTimeIs: "상대방 시간"
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
      "海外とのミーティングが多い方向けに作られた、シンプルな時差計算ツールです。",
    dstOnShort: "サマータイム",
    dstOffShort: "標準時",
    diffLabel: "時間差",
    nowButton: "今",
    copyLinkButton: "リンクをコピー",
    linkCopied: "リンクをコピーしました！",
    hoursAhead: "時間進んでいます",
    hoursBehind: "時間遅れています",
    sameTime: "同じタイムゾーン",
    yourTimeIs: "自分の時間",
    when: "の時",
    partnerTimeIs: "相手の時間"
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
      "为经常开跨国会议的用户打造的简洁时差计算工具。",
    dstOnShort: "夏令时",
    dstOffShort: "标准时",
    diffLabel: "时差",
    nowButton: "现在",
    copyLinkButton: "复制链接",
    linkCopied: "链接已复制！",
    hoursAhead: "小时快",
    hoursBehind: "小时慢",
    sameTime: "相同时区",
    yourTimeIs: "我的时间",
    when: "时",
    partnerTimeIs: "对方时间"
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
  swapBtn: document.getElementById("swap-btn"),
  myOffset: document.getElementById("my-offset"),
  partnerOffset: document.getElementById("partner-offset"),
  timeDiff: document.getElementById("time-diff"),
  timeDiffDescription: document.getElementById("time-diff-description"),
  myTimeDisplay: document.getElementById("my-time-display"),
  partnerTimeDisplay: document.getElementById("partner-time-display"),
  nowBtn: document.getElementById("now-btn"),
  copyLinkBtn: document.getElementById("copy-link-btn"),
  toast: document.getElementById("toast")
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
    convert(lastEdited);
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

// Update time displays with formatted readable text
function updateTimeDisplays(myDt, partnerDt) {
  const lang = document.documentElement.lang || "en";
  
  const formatOptions = {
    ko: { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    en: { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    ja: { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    zh: { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };

  const locale = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  }[lang] || 'en-US';

  els.myTimeDisplay.textContent = myDt.toLocaleString(locale, formatOptions[lang] || formatOptions.en);
  els.partnerTimeDisplay.textContent = partnerDt.toLocaleString(locale, formatOptions[lang] || formatOptions.en);
}

// UTC offset, DST, and improved time difference display
function updateMetaInfo(myDt, partnerDt) {
  if (!els.myOffset || !els.partnerOffset || !els.timeDiff) return;

  const lang = document.documentElement.lang || "en";
  const dict = i18n[lang] || i18n.en;

  function formatOffset(dt) {
    const offsetMinutes = dt.offset;
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = abs % 60;

    let base = "UTC" + sign + String(hours).padStart(2, "0");
    if (minutes !== 0) {
      base += ":" + String(minutes).padStart(2, "0");
    }

    const dstText = dt.isInDST ? dict.dstOnShort : dict.dstOffShort;
    return base + " • " + dstText;
  }

  els.myOffset.textContent = formatOffset(myDt);
  els.partnerOffset.textContent = formatOffset(partnerDt);

  // Enhanced time difference display
  const diffMinutes = myDt.offset - partnerDt.offset;
  const absDiff = Math.abs(diffMinutes);
  const hoursDiff = Math.floor(absDiff / 60);
  const minutesDiff = absDiff % 60;
  
  let diffText = "";
  let descriptionText = "";

  if (diffMinutes === 0) {
    diffText = dict.sameTime;
    descriptionText = dict.sameTime;
  } else {
    const sign = diffMinutes > 0 ? "+" : "-";
    diffText = sign + String(hoursDiff) + "h";
    if (minutesDiff !== 0) {
      diffText += " " + String(minutesDiff) + "m";
    }

    // More descriptive explanation
    const direction = diffMinutes > 0 ? dict.hoursAhead : dict.hoursBehind;
    const hourText = hoursDiff + (minutesDiff !== 0 ? `.${Math.round(minutesDiff / 60 * 10) / 10}` : "");
    descriptionText = `${dict.yourTimeIs} ${hourText} ${direction}`;
  }

  els.timeDiff.textContent = diffText;
  els.timeDiffDescription.textContent = descriptionText;
}

function convert(source) {
  if (suspendEvents) return;
  const payload = readInputs(source);
  if (!payload) return;
  const { dt, converted } = payload;

  suspendEvents = true;
  updateTargetFields(source, converted);
  suspendEvents = false;

  let myDt, partnerDt;
  if (source === "my") {
    myDt = dt;
    partnerDt = converted;
  } else {
    myDt = converted;
    partnerDt = dt;
  }
  
  updateMetaInfo(myDt, partnerDt);
  updateTimeDisplays(myDt, partnerDt);
  
  // Track conversion in Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'timezone_conversion', {
      'from_timezone': myDt.zoneName,
      'to_timezone': partnerDt.zoneName
    });
  }
}

// Show toast notification
function showToast(message, type = 'default') {
  els.toast.textContent = message;
  els.toast.className = 'toast show';
  if (type === 'success') {
    els.toast.classList.add('success');
  }
  
  setTimeout(() => {
    els.toast.classList.remove('show');
  }, 3000);
}

// Set current time
function setToNow() {
  const now = DateTime.now();
  const dateStr = now.toISODate();
  const timeStr = now.toFormat("HH:mm");

  suspendEvents = true;
  els.myDate.value = dateStr;
  els.myTime.value = timeStr;
  suspendEvents = false;

  lastEdited = "my";
  convert("my");
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'set_to_now', {
      'event_category': 'user_interaction'
    });
  }
}

// Copy shareable link to clipboard
function copyShareLink() {
  const myTz = els.myTimezone.value;
  const partnerTz = els.partnerTimezone.value;
  const myDateTime = `${els.myDate.value}T${els.myTime.value}`;
  
  const url = new URL(window.location.href);
  url.searchParams.set('from', myTz);
  url.searchParams.set('to', partnerTz);
  url.searchParams.set('time', myDateTime);
  
  const shareUrl = url.toString();
  
  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      const dict = i18n[document.documentElement.lang] || i18n.en;
      showToast(dict.linkCopied, 'success');
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_share_link', {
          'event_category': 'sharing'
        });
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
      showToast('Failed to copy link', 'error');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const dict = i18n[document.documentElement.lang] || i18n.en;
      showToast(dict.linkCopied, 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    document.body.removeChild(textArea);
  }
}

// Load state from URL parameters
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  const to = params.get('to');
  const time = params.get('time');
  
  if (from && to && time) {
    // Set timezones
    const fromIndex = timezones.findIndex(tz => tz.zone === from);
    const toIndex = timezones.findIndex(tz => tz.zone === to);
    
    if (fromIndex >= 0) els.myTimezone.selectedIndex = fromIndex;
    if (toIndex >= 0) els.partnerTimezone.selectedIndex = toIndex;
    
    // Set date and time
    const [dateStr, timeStr] = time.split('T');
    if (dateStr && timeStr) {
      els.myDate.value = dateStr;
      els.myTime.value = timeStr;
    }
    
    convert("my");
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'load_from_shared_link', {
        'event_category': 'sharing'
      });
    }
  }
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
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'swap_timezones', {
        'event_category': 'user_interaction'
      });
    }
  });
  
  // New buttons
  els.nowBtn.addEventListener("click", setToNow);
  els.copyLinkBtn.addEventListener("click", copyShareLink);
}

document.addEventListener("DOMContentLoaded", () => {
  populateTimezones();
  initLanguage();
  attachEvents();
  loadFromURL(); // Check for URL parameters first
  
  // If no URL parameters, initialize with current time
  if (!new URLSearchParams(window.location.search).has('time')) {
    initializeDateTimeFields();
  }
});
