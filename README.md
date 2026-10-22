# NPC 2026 Mock Programming Test

A static website with 8 console programming problems for practicing for the
CodeChum NPC 2026: Sprint Edition. Topics covered: output operations, escape
sequences, placeholders, input operations, arithmetic operators and assignment
operators. There is nothing to install or build.

## Put it on GitHub Pages

1. Create a new repository on GitHub and push these files to the `main` branch
   (the files should be at the top level of the repository).
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select
   branch `main` and folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

## Try it in Python (built-in)

Each problem has a **Try it in Python** box. Students write their solution, press
**Run**, and see the output. The input box starts with the sample input, and the
page says whether the output matches the sample's expected output. A program that
runs longer than 5 seconds is stopped. Code is saved in the student's own browser.

Python runs inside the browser using [Pyodide](https://pyodide.org) (version 0.29.3),
which is included in the `pyodide/` folder, so no server or outside service is needed.
The first Run downloads about 10 MB; after that it is fast. Only Python is supported;
C, C++, C# and Java would need a server-side code runner.

## Run it on your computer

Running code needs the page to be served over http, so opening `index.html` by
double-clicking will show the problems but not run code. Serve the folder instead:

    python3 -m http.server 8000

then open http://localhost:8000.

## Edit or add problems

All problem text and samples are in `problems.js`. Each entry has:

| Field | Meaning |
| --- | --- |
| `title` | Problem title |
| `description` | List of paragraphs |
| `steps` | Optional list of lines shown as a numbered code list after the first paragraph |
| `input` / `output` | Bullet list for the input, paragraphs for the output |
| `sampleInput` / `sampleOutput` | Exact sample text (use `\t` for a tab, `\n` for a new line) |

Add an object to the `window.PROBLEMS` array and the page and navigation pick it
up automatically.

## Files

- `index.html`, `style.css`, `app.js`: the page
- `worker.js` and `pyodide/`: the in-browser Python runner (Pyodide is MPL-2.0 licensed)
- `problems.js`: the problems (edit this)
- `.nojekyll`: tells GitHub Pages to serve the files as they are
