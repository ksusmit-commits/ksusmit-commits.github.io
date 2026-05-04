# Deploying to GitHub Pages

Step-by-step guide to get this site live at `https://ksusmit.github.io`.

> Replace `ksusmit` with your actual GitHub username throughout this document if it's different.

---

## Prerequisites

- A GitHub account with username `ksusmit`
- Git installed locally (`git --version` to check)
- The site folder at `~/Projects/ksusmit.github.io/`

---

## Step 1 — Create the repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `ksusmit.github.io`
   - ⚠️ This name MUST exactly match your GitHub username for a "user site" to work.
3. **Visibility**: Public (required for free GitHub Pages)
4. **Do NOT** tick "Add a README", "Add .gitignore", or "Choose a license" — we already have local files
5. Click **Create repository**

You'll see a page with setup instructions. Keep this tab open.

---

## Step 2 — Initialize git and push from your machine

Open a terminal and run these commands one at a time:

```bash
cd ~/Projects/ksusmit.github.io

# Initialize git repo
git init
git branch -M main

# Configure git identity (if not already set globally)
# Replace with your email and name
git config user.email "your.email@example.com"
git config user.name "Susmit Kallurkar"

# Stage and commit
git add .
git commit -m "Initial site"

# Link to the remote repo (replace ksusmit if different)
git remote add origin https://github.com/ksusmit/ksusmit.github.io.git

# Push to GitHub
git push -u origin main
```

If prompted for credentials, use a **Personal Access Token** (not your password):
- Generate one at https://github.com/settings/tokens/new
- Scope: `repo`
- Paste it when git asks for your password

---

## Step 3 — Enable GitHub Pages

1. On the repo page (https://github.com/ksusmit/ksusmit.github.io), click **Settings**
2. In the left sidebar, click **Pages**
3. Under **Source**:
   - Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

GitHub will show a message: *"Your site is being built at https://ksusmit.github.io/"*

Wait 1–2 minutes for the first build.

---

## Step 4 — Visit your site

Open https://ksusmit.github.io in a new tab.

If it shows a 404 at first, wait another minute and refresh. GitHub Pages first deploys can take up to 5 minutes.

---

## Step 5 — Make updates

Whenever you edit `content.js` (or any other file):

```bash
cd ~/Projects/ksusmit.github.io
git add .
git commit -m "Update experience section"
git push
```

GitHub Pages auto-rebuilds within ~30 seconds. Refresh the browser to see changes.

---

## Troubleshooting

### Site shows a 404
- Wait 5 minutes, it may still be building
- Settings → Pages → confirm the branch is `main` and folder is `/ (root)`
- Confirm repo name is exactly `ksusmit.github.io` (lowercase, matches your username)
- Confirm repo is **Public**

### Styles don't load
- Open the browser console (Cmd+Option+I on Mac, F12 on Windows). Check the **Network** tab for 404s on `styles.css` or `script.js`.
- Make sure you pushed those files (`git status` should say "nothing to commit, working tree clean").

### Changes not showing
- Hard refresh the browser: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
- Check that your commit actually went up: visit the GitHub repo page and confirm your latest commit is there
- Go to Settings → Pages → confirm "Your site is live at..." shows a recent deployment time

### Want a custom domain?
- Buy a domain (e.g., `susmit.dev`)
- Settings → Pages → Custom domain → enter `susmit.dev`
- At your domain registrar, add these DNS records:
  - `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Or a `CNAME` record `www` → `ksusmit.github.io`
- Back on GitHub, tick **Enforce HTTPS** once the check passes (may take up to 24h for DNS propagation)

---

## Rollback if something breaks

If you push an update that breaks the site:

```bash
# See recent commits
git log --oneline

# Revert the last commit
git revert HEAD
git push
```

Or reset to a previous commit (destructive — only on your own personal repo):

```bash
git reset --hard <commit-hash>
git push --force
```

⚠️ `--force` is destructive. Only use it on your own repo, never on shared branches.

---

## That's it

Site is live, updates are one commit away, and you never have to touch a build tool.

> Built between escalations, powered by ☕ and curiosity.
