/* Runs Python (Pyodide) off the main thread so a stuck program can be stopped. */
importScripts("pyodide/pyodide.js");

var pyodide = null;
var ready = loadPyodide({ indexURL: "pyodide/" }).then(function (p) {
  pyodide = p;
  postMessage({ type: "ready" });
}).catch(function (e) {
  postMessage({ type: "fail", message: String(e && e.message || e) });
});

onmessage = function (e) {
  var job = e.data;
  ready.then(async function () {
    if (!pyodide) return;
    var out = "", err = "";
    var dec = new TextDecoder();
    var lines = job.stdin.replace(/\r\n?/g, "\n").split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    var i = 0;
    pyodide.setStdin({ stdin: function () { return i < lines.length ? lines[i++] : null; } });
    pyodide.setStdout({ write: function (buf) { out += dec.decode(buf, { stream: true }); return buf.length; } });
    pyodide.setStderr({ write: function (buf) { err += dec.decode(buf, { stream: true }); return buf.length; } });
    var g = pyodide.globals.get("dict")();
    try {
      await pyodide.runPythonAsync(job.code, { globals: g });
    } catch (ex) {
      var msg = String(ex && ex.message || ex), k = msg.indexOf('File "<exec>"');
      err += (k >= 0 ? "Traceback (most recent call last):\n  " + msg.slice(k) : msg);
    }
    try { g.destroy(); } catch (x) {}
    postMessage({ type: "done", id: job.id, out: out, err: err });
  });
};
