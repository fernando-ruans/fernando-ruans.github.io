/* ==========================================================================
   Traçado de osciloscópio.
   Sete pacotes, um por projeto em destaque, na ordem em que aparecem na
   página. A amplitude de cada pacote é logarítmica no tamanho do repositório
   em KB (para o PdfToolkit de 30 MB não achatar o resto); a largura do pacote
   é fixa e a separação é real, então os sete são contáveis no traçado.
   ========================================================================== */
(function () {
  "use strict";

  // repo -> tamanho em KB, lido da API pública do GitHub em 2026-09-29.
  // A ordem é a ordem de leitura da seção "Projetos em destaque".
  var PROJECTS = [
    { name: "CipherSync",     kb: 1130 },
    { name: "NetSuite",       kb: 1914 },
    { name: "AxisDoc",        kb: 1244 },
    { name: "ViraTudo",       kb: 334 },
    { name: "PdfToolkit",     kb: 30299 },
    { name: "SDR-Global-Hub", kb: 42 },
    { name: "Lingua",         kb: 499 }
  ];

  var TICK_LABEL = ["D-01", "D-02", "D-03", "D-04", "W-01", "W-02", "F-01"];

  // PRNG determinístico: a forma precisa ser idêntica a cada visita.
  function seeded(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  var W = 1200;
  var MID = 46;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var maxKb = PROJECTS.reduce(function (m, p) { return Math.max(m, p.kb); }, 1);

  // geometria: slots iguais no viewBox, com respiro entre eles
  function layout(count) {
    var gap = count > 1 ? 22 : 0;
    return { gap: gap, slot: (W - gap * (count - 1)) / count };
  }

  function packet(rnd, x0, slot, amp, cycles) {
    var inset = slot * 0.12;
    var w = slot - inset * 2;
    var steps = Math.max(28, Math.round(w / 1.5));
    var phase = rnd() * Math.PI * 2;
    var pts = [];

    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      // senoide com envelope: começa e termina na linha de base
      var s = Math.sin(t * Math.PI * 2 * cycles + phase);
      var env = Math.pow(Math.sin(t * Math.PI), 0.45);
      pts.push([x0 + inset + t * w, MID - amp * s * env]);
    }
    return pts;
  }

  function buildTrace(svg, path, projects, seedText) {
    var rnd = seeded(hash(seedText || "fernando-ruans"));
    var L = layout(projects.length);
    var pts = [];

    for (var p = 0; p < projects.length; p++) {
      var kb = projects[p].kb;
      // escala log: o PdfToolkit cabe sem esmagar os outros seis
      var norm = Math.log(kb + 1) / Math.log(maxKb + 1);
      var amp = 6 + 30 * norm;
      var cycles = 2 + Math.round(norm * 4);
      var x0 = p * (L.slot + L.gap);
      pts = pts.concat(packet(rnd, x0, L.slot, amp, cycles));
    }

    var d = pts
      .map(function (pt, i) {
        return (i === 0 ? "M" : "L") + pt[0].toFixed(1) + " " + pt[1].toFixed(1);
      })
      .join(" ");

    path.setAttribute("d", d);

    if (reduced) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }
    try {
      path.style.setProperty("--len", Math.ceil(path.getTotalLength()));
    } catch (e) {
      path.style.setProperty("--len", "3000");
    }
  }

  function applyTicks() {
    var list = document.querySelector(".trace__ticks");
    if (!list) return;
    var L = layout(PROJECTS.length);
    var kids = list.children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.setProperty("--tick", L.slot.toFixed(2));
      kids[i].textContent = TICK_LABEL[i] || kids[i].textContent;
    }
  }

  var main = document.querySelector("[data-trace]");
  if (main) {
    var seed = PROJECTS.map(function (p) { return p.name; }).join("|");
    main.dataset.seed = seed;
    buildTrace(main, main.querySelector("[data-trace-path]"), PROJECTS, seed);
  }

  // Mini-traço do CipherSync: mesma função, um único pacote.
  var mini = document.querySelector("[data-mini-trace]");
  if (mini) {
    mini.dataset.seed = "CipherSync";
    buildTrace(mini, mini.querySelector("[data-mini-path]"),
      [{ name: "CipherSync", kb: 1130 }], "CipherSync");
  }

  applyTicks();
})();

