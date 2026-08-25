(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const params = new URLSearchParams(location.search);
  const exportMode = params.has("export") || params.get("mode") === "export";
  const hud = document.getElementById("hud-n");

  function setScale() {
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    document.documentElement.style.setProperty("--scale", Math.min(sx, sy));
  }

  function show(i) {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, idx) => s.classList.toggle("active", idx === n));
    if (hud) hud.textContent = String(n + 1).padStart(2, "0");
    history.replaceState(null, "", `#${slides[n].id}`);
  }

  if (exportMode) {
    document.body.classList.remove("present");
    document.body.classList.add("export");
    slides.forEach((s) => s.classList.add("active"));
    return;
  }

  document.body.classList.add("present");
  setScale();
  window.addEventListener("resize", setScale);

  let i = 0;
  const hash = location.hash.replace("#", "");
  if (hash) {
    const found = slides.findIndex((s) => s.id === hash);
    if (found >= 0) i = found;
  }
  show(i);

  window.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      show(++i);
      i = Math.min(i, slides.length - 1);
    }
    if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) {
      e.preventDefault();
      show(--i);
      i = Math.max(i, 0);
    }
    if (e.key === "Home") show((i = 0));
    if (e.key === "End") show((i = slides.length - 1));
  });

  let touchX = null;
  window.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].screenX;
  });
  window.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (dx < -40) show((i = Math.min(i + 1, slides.length - 1)));
    if (dx > 40) show((i = Math.max(i - 1, 0)));
    touchX = null;
  });
})();
