// Kliknięcie ikonki otwiera albo zamyka małe okno z kalendarzem przy prawej krawędzi okna Opery.

const SIZES = { day: { width: 460, height: 640 }, week: { width: 860, height: 640 } };
const MARGIN_RIGHT = 16;  // odstęp od prawej krawędzi okna przeglądarki
const OFFSET_TOP = 140;   // jak nisko pod górną krawędzią okna przeglądarki

let lastAutoClose = 0;

async function getCalWindowId() {
  const { calWindowId } = await chrome.storage.session.get("calWindowId");
  if (calWindowId == null) return null;
  try {
    await chrome.windows.get(calWindowId);
    return calWindowId;
  } catch {
    await chrome.storage.session.remove("calWindowId");
    return null;
  }
}

async function openCalendar() {
  const { lastView = "day" } = await chrome.storage.local.get("lastView");
  const size = SIZES[lastView] || SIZES.day;
  const browser = await chrome.windows.getLastFocused();

  const left = Math.max(0, browser.left + browser.width - size.width - MARGIN_RIGHT);
  const top = browser.top + OFFSET_TOP;

  const win = await chrome.windows.create({
    url: "popup.html",
    type: "popup",
    focused: true,
    left, top,
    width: size.width,
    height: size.height,
  });
  await chrome.storage.session.set({ calWindowId: win.id });
}

chrome.action.onClicked.addListener(async () => {
  // Kliknięcie ikonki najpierw zabiera fokus z okna kalendarza, co je zamyka (niżej).
  // Wtedy nie otwieramy go od nowa – to ma działać jak przełącznik.
  if (Date.now() - lastAutoClose < 500) return;

  const id = await getCalWindowId();
  if (id != null) {
    await chrome.windows.remove(id);
    await chrome.storage.session.remove("calWindowId");
  } else {
    await openCalendar();
  }
});

// Okno chowa się samo, gdy klikniesz gdzie indziej (jak zwykłe okienko wtyczki).
chrome.windows.onFocusChanged.addListener(async (focusedId) => {
  const id = await getCalWindowId();
  if (id == null || focusedId === id) return;
  lastAutoClose = Date.now();
  await chrome.storage.session.remove("calWindowId");
  chrome.windows.remove(id).catch(() => {});
});

chrome.windows.onRemoved.addListener(async (removedId) => {
  const { calWindowId } = await chrome.storage.session.get("calWindowId");
  if (removedId === calWindowId) await chrome.storage.session.remove("calWindowId");
});
