# ksusmit.github.io

Personal site for **Susmit Kallurkar** — Cloud Support Engineer II at AWS (EC2 Linux, Dublin).

Single-page, vanilla HTML/CSS/JS. No frameworks. No build step. Deploys straight from the repo to GitHub Pages.

---

## 📁 Structure

```
ksusmit.github.io/
├── index.html          ← page shell (sections + mount points)
├── styles.css          ← terminal theme, light/dark toggle, responsive
├── script.js           ← rendering, interactions, easter eggs
├── content.js          ← 🔑 ALL YOUR CONTENT LIVES HERE
├── README.md           ← this file
└── deploy-instructions.md  ← step-by-step GitHub Pages setup
```

## ✏️ How to update content

**You should only need to edit `content.js`** to change what appears on the site.
The rest of the code reads from it.

Every `TODO:` marker in `content.js` is a placeholder you need to fill in:

- `hero.name`, `hero.title`, `hero.subtitle` — the stuff shown at the top
- `experience` — list of roles, most recent first
- `skills` — grouped by category
- `certifications` — cards linking to Credly or similar
- `projects` — numbered project cards
- `publications` — articles, training, internal contributions
- `education` — degrees (delete the whole `education` array if you don't want this section)
- `contact` — email, LinkedIn, GitHub

After editing `content.js`, just refresh the browser. No build step needed.

## 🏃 Run locally

Open `index.html` directly in a browser, or run a simple local server for cleaner behavior:

```bash
# Python 3
cd ~/Projects/ksusmit.github.io
python3 -m http.server 8000
# then open http://localhost:8000
```

```bash
# Node (if you have it)
npx serve .
```

## 🚀 Deploy to GitHub Pages

See [`deploy-instructions.md`](./deploy-instructions.md) for the full walkthrough.

TL;DR:

1. Create a **public** repository on GitHub named exactly **`ksusmit.github.io`** (must match your GitHub username)
2. Push this folder to the `main` branch
3. GitHub → Settings → Pages → Source: `Deploy from branch` → Branch: `main` / `/ (root)` → Save
4. Wait ~1–2 minutes → visit `https://ksusmit.github.io`

## 🎨 Theme

Dark by default (terminal aesthetic). Light mode via the 🌙 toggle top-right. Preference is saved in `localStorage`.

Color tokens are defined as CSS variables in `styles.css` under `:root` (dark) and `[data-theme="light"]`. Tweak once, applies everywhere.

## 🥚 Easter eggs

Four hidden surprises — try to find them:

1. Konami code (↑↑↓↓←→←→BA)
2. Click the `<SK/>` logo 5 times quickly
3. Type `sudo` on your keyboard, then move your mouse
4. Open the browser devtools console

Open the "Under the Hood" panel at the bottom of the page to see which you've found.

## 🛠 Built with

HTML5, CSS3, vanilla JavaScript, `IntersectionObserver`, Google Fonts (JetBrains Mono + Inter). Hosted on GitHub Pages.

## 📦 Dependencies

None. On purpose.

---

> Built between escalations, powered by ☕ and curiosity.
