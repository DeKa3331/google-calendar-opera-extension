const defaults = { calendars: "", tz: Intl.DateTimeFormat().resolvedOptions().timeZone };

chrome.storage.sync.get(defaults).then((s) => {
  document.getElementById("calendars").value = s.calendars;
  document.getElementById("tz").value = s.tz;
});

document.getElementById("save").onclick = async () => {
  await chrome.storage.sync.set({
    calendars: document.getElementById("calendars").value.trim(),
    tz: document.getElementById("tz").value.trim() || defaults.tz,
  });
  const st = document.getElementById("status");
  st.textContent = "Zapisano ✓";
  setTimeout(() => (st.textContent = ""), 1500);
};
