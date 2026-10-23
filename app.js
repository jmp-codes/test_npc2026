(function () {
  "use strict";
  var data = window.PROBLEMS || [];
  var navEl = document.getElementById("nav");
  var mainEl = document.getElementById("problems");

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function showWs(text) { return text.replace(/\t/g, "→\t").replace(/ $/gm, "·"); }

  function copy(text, btn) {
    var done = function () { var old = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = old; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else { var t = el("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
  }

  function sampleBox(title, text, key) {
    var pre = el("pre", { text: text }); pre.dataset.raw = text;
    var btn = el("button", { type: "button", text: "Copy", "aria-label": "Copy " + title.toLowerCase() });
    btn.addEventListener("click", function () { copy(text, btn); });
    return el("div", { "class": "box" }, [el("header", {}, [el("span", { text: title }), btn]), pre]);
  }

  data.forEach(function (p) {
    var id = "p" + p.n;
    navEl.appendChild(el("a", { href: "#" + id, "data-id": id }, [el("b", { text: String(p.n) }), el("span", { text: p.title })]));

    var sec = el("section", { "class": "problem", id: id, "aria-labelledby": id + "-h" });
    sec.appendChild(el("h2", { id: id + "-h" }, [el("span", { text: "Problem " + p.n + ":" }), document.createTextNode(p.title)]));
    p.description.forEach(function (t, i) {
      sec.appendChild(el("p", { text: t }));
      if (i === 0 && p.steps) {
        var ol = el("ol", { "class": "steps" });
        p.steps.forEach(function (s) { ol.appendChild(el("li", { text: s })); });
        sec.appendChild(ol);
      }
    });
    sec.appendChild(el("h3", { text: "Input" }));
    var ul = el("ul"); p.input.forEach(function (t) { ul.appendChild(el("li", { text: t })); }); sec.appendChild(ul);
    sec.appendChild(el("h3", { text: "Output" }));
    p.output.forEach(function (t) { sec.appendChild(el("p", { text: t })); });
    sec.appendChild(el("h3", { text: "Sample" }));

    var inBox = sampleBox("Sample Input", p.sampleInput), outBox = sampleBox("Expected Output", p.sampleOutput);
    sec.appendChild(el("div", { "class": "sample" }, [inBox, outBox]));

    var ws = el("input", { type: "checkbox", id: "ws" + p.n });
    ws.addEventListener("change", function () {
      [inBox, outBox].forEach(function (b) { var pre = b.querySelector("pre"); pre.textContent = ws.checked ? showWs(pre.dataset.raw) : pre.dataset.raw; });
    });
    sec.appendChild(el("div", { "class": "tools" }, [el("label", { "for": "ws" + p.n }, [ws, document.createTextNode("Show whitespace (tabs as →)")])]));
    mainEl.appendChild(sec);
  });

  // highlight the problem currently in view
  if ("IntersectionObserver" in window) {
    var links = {}; [].forEach.call(navEl.querySelectorAll("a"), function (a) { links[a.dataset.id] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); }); links[e.target.id].classList.add("active"); }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    [].forEach.call(mainEl.querySelectorAll(".problem"), function (s) { io.observe(s); });
  }
})();
