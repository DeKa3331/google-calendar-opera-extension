// Stan: widok ("day" | "week") i dzień, wokół którego pokazujemy kalendarz.
let view = "day";
let anchor = startOfDay(new Date());
let settings = { calendars: "", tz: Intl.DateTimeFormat().resolvedOptions().timeZone };

const $ = (id) => document.getElementById(id);

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
// Poniedziałek tygodnia, w którym jest data d
function mondayOf(d) {
  const day = (d.getDay() + 6) % 7; // pon = 0
  return addDays(startOfDay(d), -day);
}
function ymd(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}
function fmt(d, opts) {
  return d.toLocaleDateString("pl-PL", opts);
}

function rangeFor() {
  if (view === "day") return [anchor, addDays(anchor, 1)];
  const mon = mondayOf(anchor);
  return [mon, addDays(mon, 7)];
}

function buildEmbedUrl() {
  const [from, to] = rangeFor();
  const params = new URLSearchParams({
    ctz: settings.tz,
    mode: view === "day" ? "AGENDA" : "WEEK",
    dates: `${ymd(from)}/${ymd(to)}`,
    wkst: "2", // tydzień od poniedziałku
    hl: "pl",
    showTitle: "0",
    showPrint: "0",
    showTabs: "0",
    showCalendars: "0",
    showTz: "0",
    showNav: "0",
    showDate: "0",
  });
  const ids = settings.calendars.split(",").map((s) => s.trim()).filter(Boolean);
  let url = "https://calendar.google.com/calendar/embed?" + params.toString();
  for (const id of ids) url += "&src=" + encodeURIComponent(id);
  return url;
}

function fullCalendarUrl() {
  const d = anchor;
  const path = view === "day" ? "day" : "week";
  return `https://calendar.google.com/calendar/r/${path}/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function render() {
  document.body.classList.toggle("day", view === "day");
  $("btn-day").classList.toggle("active", view === "day");
  $("btn-week").classList.toggle("active", view === "week");

  const [from, to] = rangeFor();
  $("range").textContent =
    view === "day"
      ? fmt(from, { weekday: "short", day: "numeric", month: "short" })
      : `${fmt(from, { day: "numeric", month: "short" })} – ${fmt(addDays(to, -1), { day: "numeric", month: "short" })}`;

  const hasCalendars = settings.calendars.trim().length > 0;
  $("setup").hidden = hasCalendars;
  $("cal").hidden = !hasCalendars;
  if (hasCalendars) $("cal").src = buildEmbedUrl();
}

function step(dir) {
  anchor = addDays(anchor, dir * (view === "day" ? 1 : 7));
  render();
}

// Zmiana widoku zmienia też szerokość okna, przy zachowaniu prawej krawędzi.
const WIDTHS = { day: 460, week: 860 };
async function setView(v) {
  if (v === view) return;
  view = v;
  chrome.storage.local.set({ lastView: view });
  render();
  const win = await chrome.windows.getCurrent();
  if (win.type === "popup") {
    const right = win.left + win.width;
    chrome.windows.update(win.id, { left: Math.max(0, right - WIDTHS[v]), width: WIDTHS[v] });
  }
}
$("btn-day").onclick = () => setView("day");
$("btn-week").onclick = () => setView("week");
$("prev").onclick = () => step(-1);
$("next").onclick = () => step(1);
$("today").onclick = () => { anchor = startOfDay(new Date()); render(); };
$("open-full").onclick = () => chrome.tabs.create({ url: fullCalendarUrl() });
$("settings").onclick = $("go-settings").onclick = () => chrome.runtime.openOptionsPage();

Promise.all([
  chrome.storage.sync.get({ calendars: "", tz: settings.tz }),
  chrome.storage.local.get({ lastView: "day" }),
]).then(([s, l]) => {
  settings = s;
  view = l.lastView;
  render();
});
