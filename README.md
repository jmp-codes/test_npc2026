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

## Run it on your computer

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

## Edit or add problems

All problem text and samples are in `problems.js`. Each entry has:

| Field | Meaning |
| --- | --- |
| `title` | Problem title |
| `description` | List of paragraphs |
| `steps` | Optional list of lines shown as a numbered code list after the first paragraph |
| `input` / `output` | Bullet list for the input, paragraphs for the output |
| `sampleInput` / `sampleOutput` | Exact sample text (use `\t` for a tab, `\n` for a new line) |

Add an object to the `window.PROBLEMS` array and the page, navigation and
output checker pick it up automatically.

## Files

- `index.html`, `style.css`, `app.js`: the page
- `problems.js`: the problems (edit this)
- `.nojekyll`: tells GitHub Pages to serve the files as they are
