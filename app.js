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

  // ---- Python runner (Pyodide in a Web Worker) ----
  var worker = null, workerReady = null, busy = false, jobId = 0, RUN_LIMIT_MS = 5000;
  function startWorker() {
    worker = new Worker("worker.js");
    workerReady = new Promise(function (resolve, reject) {
      worker.addEventListener("message", function onMsg(e) {
        if (e.data.type === "ready") { worker.removeEventListener("message", onMsg); resolve(); }
        if (e.data.type === "fail") reject(new Error(e.data.message));
      });
      worker.addEventListener("error", function () { reject(new Error("The Python engine could not start.")); });
    });
  }
  function runPython(code, stdin) {
    if (location.protocol === "file:") return Promise.resolve({ out: "", err: "Running code needs the page to be opened from a web address (GitHub Pages, or run: python3 -m http.server).", timedOut: false });
    if (!worker) startWorker();
    var w = worker;
    return workerReady.then(function () {
      return new Promise(function (resolve) {
        var id = ++jobId, timer = setTimeout(function () {
          w.terminate(); if (worker === w) worker = null;
          resolve({ out: "", err: "Stopped: the program ran for more than " + (RUN_LIMIT_MS / 1000) + " seconds. Check for an endless loop or for a missing input.", timedOut: true });
        }, RUN_LIMIT_MS);
        w.addEventListener("message", function onMsg(e) {
          if (e.data.type === "done" && e.data.id === id) { clearTimeout(timer); w.removeEventListener("message", onMsg); resolve({ out: e.data.out, err: e.data.err, timedOut: false }); }
        });
        w.postMessage({ id: id, code: code, stdin: stdin });
      });
    }, function (e) { worker = null; return { out: "", err: e.message, timedOut: false }; });
  }
  window.NPC = { run: runPython };

  function store(key, val) { try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) {} return null; }
  function trimEnd(t) { return t.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").replace(/\s+$/, ""); }
  var STARTER = "# Write your Python solution here\n";

  function tryIt(p) {
    var codeKey = "npc-code-" + p.n;
    var code = el("textarea", { id: "code" + p.n, "class": "code", spellcheck: "false", autocomplete: "off", "aria-label": "Your Python code for problem " + p.n });
    code.value = store(codeKey) || STARTER;
    code.addEventListener("input", function () { store(codeKey, code.value); });
    code.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault(); var s = code.selectionStart; code.setRangeText("    ", s, code.selectionEnd, "end");
        store(codeKey, code.value);
      }
    });
    var stdin = el("textarea", { "class": "stdin", spellcheck: "false", "aria-label": "Input for problem " + p.n });
    stdin.value = p.sampleInput;
    var status = el("span", { "class": "status", role: "status", "aria-live": "polite" });
    var out = el("pre", { "class": "runout", "aria-label": "Program output" });
    var verdict = el("div", { "class": "verdict", role: "status" });
    var run = el("button", { type: "button", "class": "primary", text: "Run" });
    var reset = el("button", { type: "button", text: "Reset" });

    run.addEventListener("click", function () {
      if (busy) return;
      busy = true; run.disabled = true; out.textContent = ""; out.className = "runout"; verdict.textContent = ""; verdict.className = "verdict";
      status.textContent = worker ? "Running…" : "Loading Python (first time only, about 10 MB)…";
      runPython(code.value, stdin.value).then(function (r) {
        status.textContent = "";
        out.textContent = r.out + (r.err ? (r.out && !/\n$/.test(r.out) ? "\n" : "") + r.err : "");
        if (r.err) out.className = "runout has-err";
        if (!out.textContent) out.textContent = "(no output)";
        if (!r.err && trimEnd(stdin.value) === trimEnd(p.sampleInput)) {
          var ok = trimEnd(r.out) === trimEnd(p.sampleOutput);
          verdict.className = "verdict " + (ok ? "ok" : "bad");
          verdict.textContent = ok ? "Matches the expected output for the sample." : "Does not match the expected output for the sample.";
        }
      }).then(function () { busy = false; run.disabled = false; });
    });
    reset.addEventListener("click", function () {
      if (code.value.trim() !== STARTER.trim() && !window.confirm("Clear your code and restore the sample input?")) return;
      code.value = STARTER; store(codeKey, STARTER); stdin.value = p.sampleInput; out.textContent = ""; out.className = "runout"; verdict.textContent = ""; verdict.className = "verdict"; status.textContent = "";
    });

    return el("details", { "class": "try" }, [
      el("summary", { text: "Try it in Python" }),
      el("p", { "class": "hint", text: "Runs in your browser. Write your solution, then press Run. The input box starts with the sample input; change it to try other values." }),
      el("label", { "for": "code" + p.n, text: "Your code" }), code,
      el("label", { text: "Input (one value per line)" }), stdin,
      el("div", { "class": "tools" }, [run, reset, status]), verdict, out]);
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
    sec.appendChild(tryIt(p));
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
