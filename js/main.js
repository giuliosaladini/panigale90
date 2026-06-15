(function () {
  "use strict";

  // Load availability from the CMS-managed JSON file, then start the app.
  // Falls back to an inline global (js/availability.js) or empty config.
  fetch("availability.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (data) {
      boot(data || window.PANIGALE_AVAILABILITY || { booked: [], contactEmail: "" });
    });

  function boot(cfg) {
  /* ---------- DATA ---------- */
  var PHOTOS = [
    { src: "assets/img/photo-03.jpg", cap: "Soggiorno con angolo cottura", cls: "g-big" },
    { src: "assets/img/photo-01.jpg", cap: "Esterno — il borgo e l'ingresso indipendente" },
    { src: "assets/img/photo-07.jpg", cap: "Giardino condominiale con parcheggio" },
    { src: "assets/img/photo-04.jpg", cap: "Interni dell'appartamento" },
    { src: "assets/img/photo-05.jpg", cap: "Zona giorno", cls: "g-wide" },
    { src: "assets/img/photo-06.jpg", cap: "Dettagli dell'alloggio" },
    { src: "assets/img/photo-08.jpg", cap: "Camera / zona notte" },
    { src: "assets/img/photo-09.jpg", cap: "Ambienti luminosi" },
    { src: "assets/img/photo-10.jpg", cap: "Spazi dell'appartamento" },
    { src: "assets/img/photo-02.jpg", cap: "Il borgo" }
  ];

  var AMENITIES = [
    { ic: "🅿️", t: "Parcheggio gratuito nel giardino" },
    { ic: "📶", t: "Wi-Fi" },
    { ic: "🍳", t: "Angolo cottura attrezzato" },
    { ic: "🧺", t: "Lavatrice" },
    { ic: "🚪", t: "Ingresso indipendente" },
    { ic: "🌳", t: "Giardino condominiale" },
    { ic: "☕", t: "Area di ristoro comune" },
    { ic: "🏠", t: "Piano terra" },
    { ic: "🧥", t: "Stenditoio per soggiorni lunghi" }
  ];

  /* ---------- HELPERS ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
  var ymd = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var parseD = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };

  var today = new Date(); today.setHours(0, 0, 0, 0);

  // Build a Set of busy date strings from booked ranges
  var busy = {};
  (cfg.booked || []).forEach(function (r) {
    var d = parseD(r.from), end = parseD(r.to);
    while (d <= end) { busy[ymd(d)] = true; d = new Date(d.getTime() + 86400000); }
  });
  var isBusy = function (d) { return !!busy[ymd(d)]; };
  var isPast = function (d) { return d < today; };

  /* ---------- GALLERY ---------- */
  var grid = $("#galleryGrid");
  PHOTOS.forEach(function (p, i) {
    var fig = document.createElement("figure");
    if (p.cls) fig.className = p.cls;
    fig.dataset.index = i;
    var img = document.createElement("img");
    img.src = p.src; img.alt = p.cap; img.loading = "lazy";
    fig.appendChild(img);
    grid.appendChild(fig);
  });

  /* ---------- LIGHTBOX ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), cur = 0;
  function openLb(i) { cur = i; lbImg.src = PHOTOS[i].src; lbImg.alt = PHOTOS[i].cap; lb.hidden = false; document.body.style.overflow = "hidden"; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
  function step(n) { cur = (cur + n + PHOTOS.length) % PHOTOS.length; lbImg.src = PHOTOS[cur].src; lbImg.alt = PHOTOS[cur].cap; }
  grid.addEventListener("click", function (e) {
    var fig = e.target.closest("figure"); if (fig) openLb(+fig.dataset.index);
  });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function () { step(-1); });
  $("#lbNext").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- AMENITIES ---------- */
  var aGrid = $("#amenitiesGrid");
  AMENITIES.forEach(function (a) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="ic">' + a.ic + '</span><span>' + a.t + "</span>";
    aGrid.appendChild(li);
  });

  /* ---------- CALENDAR ---------- */
  var WD = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  var MO = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var selStart = null, selEnd = null;

  function buildMonth(base) {
    var wrap = document.createElement("div");
    wrap.className = "cal-grid";
    var week = document.createElement("div");
    week.className = "cal-week";
    WD.forEach(function (w) { var s = document.createElement("span"); s.textContent = w; week.appendChild(s); });
    wrap.appendChild(week);

    var days = document.createElement("div");
    days.className = "cal-days";
    var first = new Date(base.getFullYear(), base.getMonth(), 1);
    var startDow = (first.getDay() + 6) % 7; // Monday-first
    var total = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

    for (var i = 0; i < startDow; i++) {
      var e = document.createElement("div"); e.className = "cal-day empty"; days.appendChild(e);
    }
    for (var dnum = 1; dnum <= total; dnum++) {
      var d = new Date(base.getFullYear(), base.getMonth(), dnum);
      var cell = document.createElement("div");
      cell.className = "cal-day";
      cell.textContent = dnum;
      var ds = ymd(d);
      if (isPast(d)) cell.classList.add("past");
      else if (isBusy(d)) cell.classList.add("busy");
      else {
        cell.classList.add("free");
        cell.dataset.date = ds;
        if (selStart && ds === selStart) cell.classList.add("sel");
        if (selEnd && ds === selEnd) cell.classList.add("sel");
        if (selStart && selEnd && ds > selStart && ds < selEnd) cell.classList.add("inrange");
      }
      days.appendChild(cell);
    }
    wrap.appendChild(days);
    return wrap;
  }

  function rangeHasBusy(a, b) {
    var d = parseD(a), end = parseD(b);
    while (d < end) { if (isBusy(d)) return true; d = new Date(d.getTime() + 86400000); }
    return false;
  }

  function render() {
    var months = $("#calMonths");
    var m2 = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    months.innerHTML = "<span>" + MO[view.getMonth()] + " " + view.getFullYear() +
      "</span><span>" + MO[m2.getMonth()] + " " + m2.getFullYear() + "</span>";

    var grids = $("#calGrids");
    grids.innerHTML = "";
    grids.appendChild(buildMonth(view));
    grids.appendChild(buildMonth(m2));

    var sel = $("#calSelection");
    if (selStart && selEnd) {
      var n = Math.round((parseD(selEnd) - parseD(selStart)) / 86400000);
      sel.textContent = "Dal " + fmt(selStart) + " al " + fmt(selEnd) + " · " + n + (n === 1 ? " notte" : " notti");
    } else if (selStart) {
      sel.textContent = "Check-in: " + fmt(selStart) + " — scegli il check-out";
    } else {
      sel.textContent = "Nessuna data selezionata";
    }
  }

  function fmt(s) { var d = parseD(s); return d.getDate() + " " + MO[d.getMonth()].slice(0, 3).toLowerCase() + " " + d.getFullYear(); }

  $("#calGrids").addEventListener("click", function (e) {
    var cell = e.target.closest(".cal-day.free");
    if (!cell || !cell.dataset.date) return;
    var ds = cell.dataset.date;
    if (!selStart || (selStart && selEnd)) { selStart = ds; selEnd = null; }
    else if (ds <= selStart) { selStart = ds; selEnd = null; }
    else if (rangeHasBusy(selStart, ds)) { selStart = ds; selEnd = null; } // can't span a booked night
    else { selEnd = ds; }
    syncForm();
    render();
  });

  $("#calPrev").addEventListener("click", function () {
    var m = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    var floor = new Date(today.getFullYear(), today.getMonth(), 1);
    if (m >= floor) { view = m; render(); }
  });
  $("#calNext").addEventListener("click", function () {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render();
  });

  function syncForm() {
    if (selStart) $("#fIn").value = selStart;
    if (selEnd) $("#fOut").value = selEnd;
  }
  render();

  /* ---------- FORM (mailto) ---------- */
  var form = $("#bookForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var subject = "Richiesta soggiorno Panigale 90";
    var body =
      "Nome: " + f.name.value + "\n" +
      "Email: " + f.email.value + "\n" +
      "Check-in: " + (f.checkin.value || "—") + "\n" +
      "Check-out: " + (f.checkout.value || "—") + "\n" +
      "Ospiti: " + f.guests.value + "\n\n" +
      "Messaggio:\n" + (f.message.value || "—");
    var mail = "mailto:" + (cfg.contactEmail || "") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    window.location.href = mail;
    $("#bookNote").textContent = "Si aprirà il tuo programma di posta con la richiesta precompilata.";
  });

  /* ---------- MISC ---------- */
  $("#year").textContent = new Date().getFullYear();
  } // end boot
})();
