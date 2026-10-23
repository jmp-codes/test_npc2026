(function () {
  "use strict";
  var TOTAL = 60 * 60 * 1000;            // 1 hour
  var KEY = "npc-timer-v1";
  var clock = document.getElementById("clock"), msg = document.getElementById("tmsg");
  var bStart = document.getElementById("tStart"), bReset = document.getElementById("tReset");
  var bTest = document.getElementById("tTest"), bStop = document.getElementById("tStop");
  var baseTitle = document.title;

  var st = { mode: "idle", endAt: 0, left: TOTAL };   // idle | running | done
  var tick = null;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && (s.mode === "running" || s.mode === "done")) st = s;
    } catch (e) {}
    if (st.mode === "running" && Date.now() >= st.endAt) { st = { mode: "done", endAt: 0, left: 0 }; save(); }
  }
  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function remaining() { return st.mode === "running" ? Math.max(0, st.endAt - Date.now()) : st.left; }

  // ---- sound (generated with the Web Audio API; no audio file needed) ----
  var ac = null, live = [];
  function audio() {
    if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (C) { try { ac = new C(); } catch (e) { ac = null; } } }
    if (ac && ac.state === "suspended") ac.resume();
    return ac;
  }
  function beep(a, at, freq, dur) {
    var o = a.createOscillator(), g = a.createGain();
    o.type = "square"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(a.destination); o.start(at); o.stop(at + dur + 0.02);
    live.push(o); o.onended = function () { live = live.filter(function (x) { return x !== o; }); if (!live.length) bStop.hidden = true; };
  }
  function alarm(rounds) {
    var a = audio(); if (!a) return;
    var t = a.currentTime + 0.05;
    for (var i = 0; i < rounds; i++) { beep(a, t + i * 1.0, 988, 0.22); beep(a, t + i * 1.0 + 0.3, 988, 0.22); beep(a, t + i * 1.0 + 0.6, 1319, 0.3); }
    bStop.hidden = false;
  }
  function stopSound() { live.forEach(function (o) { try { o.stop(); } catch (e) {} }); live = []; bStop.hidden = true; }

  // ---- display ----
  function render() {
    var left = remaining();
    clock.textContent = fmt(left);
    clock.className = "clock" + (st.mode === "running" ? " running" : "") + (st.mode === "running" && left <= 5 * 60000 ? " warn" : "") + (st.mode === "done" ? " done" : "");
    bStart.textContent = st.mode === "running" ? "Running" : "Start";
    bStart.disabled = st.mode !== "idle";
    msg.className = "tmsg" + (st.mode === "done" ? " alert" : "");
    if (st.mode === "idle") msg.textContent = "1 hour. Press Start when you begin.";
    else if (st.mode === "running") msg.textContent = left <= 5 * 60000 ? "Less than 5 minutes left." : "Timer running.";
    else msg.textContent = "Time's up!";
    document.title = st.mode === "running" ? fmt(left) + " – " + baseTitle : (st.mode === "done" ? "Time's up! – " + baseTitle : baseTitle);
  }
  function loop() {
    clearInterval(tick); tick = null;
    if (st.mode !== "running") return;
    tick = setInterval(function () {
      if (Date.now() >= st.endAt) { clearInterval(tick); tick = null; st = { mode: "done", endAt: 0, left: 0 }; save(); render(); alarm(10); return; }
      render();
    }, 250);
  }

  bStart.addEventListener("click", function () {
    audio();                                   // unlock sound on this click (browsers require a user action)
    if (st.mode !== "idle") return;
    st = { mode: "running", endAt: Date.now() + TOTAL, left: 0 };
    save(); render(); loop();
  });
  bReset.addEventListener("click", function () {
    if (st.mode === "running" && !window.confirm("Reset the timer to 60:00?")) return;
    stopSound(); st = { mode: "idle", endAt: 0, left: TOTAL }; save(); render(); loop();
  });
  bTest.addEventListener("click", function () { alarm(1); });
  bStop.addEventListener("click", stopSound);

  load(); render(); loop();
  // keep the display right when returning to a background tab
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { render(); if (st.mode === "running" && Date.now() >= st.endAt) loop(); } });
  window.NPCTimer = { state: function () { return st; } };
})();
