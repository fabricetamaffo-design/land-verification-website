# Contributing Guide — Land Verification Website
**PKFokam Institute of Excellence | Capstone Spring 2026**

Welcome to the team! This guide explains exactly how we work together using **GitFlow**. Please read it carefully before pushing any code.

---

## Team Members & Their Feature Branches

| Name | Role | Assigned Branch |
|---|---|---|
| Tamaffo Fabrice | Project Manager / Backend / DB | `develop` (merge coordinator) |
| Kuate Messado | Backend Developer | `feature/land-upload-verification` |
| Nkam Titcha | Frontend Developer / DB | `feature/browse-and-ui` |
| Kemgang Leprince | Frontend + Backend | `feature/search-and-map` |

---

## Branch Structure (GitFlow)

```
master          ← Production-ready code only. NEVER push here directly.
│
develop         ← Integration branch. All features merge here first.
│
├── feature/auth-and-registration       ← User registration & login
├── feature/land-upload-verification    ← Admin upload & verification engine
├── feature/search-and-map              ← Search page & GPS map
├── feature/admin-panel                 ← Admin dashboard & management
├── feature/browse-and-ui               ← Browse by quarter & UI polish
│
release/v1.0    ← Final release preparation before merging to master
hotfix/*        ← Emergency fixes on master
```

### Rules
- **NEVER push directly to `master` or `develop`**
- Always work on your assigned `feature/` branch
- When your feature is done, open a **Pull Request** to `develop`
- At least **1 team member must review and approve** before merging
- Only the **Project Manager (Tamaffo Fabrice)** merges `develop` into `master`

---

## Step-by-Step: How to Start Working

### 1. Clone the repository (first time only)
```bash
git clone https://github.com/fabricetamaffo-design/land-verification-website.git
cd land-verification-website
```

### 2. Switch to your assigned branch
```bash
git checkout feature/your-branch-name
```
For example, Kuate Messado runs:
```bash
git checkout feature/land-upload-verification
```

### 3. Always pull latest changes before starting work
```bash
git pull origin feature/your-branch-name
```

---

## Step-by-Step: How to Save and Push Your Work

### 1. Check what files you changed
```bash
git status
```

### 2. Stage your changes
```bash
git add .
```
Or add specific files only:
```bash
git add backend/src/controllers/land.controller.ts
```

### 3. Commit with a clear message
```bash
git commit -m "feat: add GPS validation to land upload form"
```

**Commit message format:**
- `feat:` — new feature added
- `fix:` — bug fixed
- `refactor:` — code restructured
- `style:` — UI/styling changes
- `docs:` — documentation updated
- `test:` — tests added

### 4. Push to your branch
```bash
git push origin feature/your-branch-name
```

---

## Step-by-Step: How to Submit Your Work (Pull Request)

When your feature is complete and tested:

1. Go to: https://github.com/fabricetamaffo-design/land-verification-website
2. Click **"Compare & pull request"** (GitHub shows this automatically after a push)
3. Set **base branch** to `develop`
4. Set **compare branch** to your feature branch
5. Write a clear title and description of what you did
6. Assign a teammate as reviewer
7. Click **"Create pull request"**
8. Wait for approval — do NOT merge yourself

---

## Step-by-Step: How to Get Latest Changes from develop

When other teammates merge their work into `develop`, you need to update your branch:

```bash
git checkout develop
git pull origin develop
git checkout feature/your-branch-name
git merge develop
```

If there are conflicts, VS Code will highlight them. Fix the conflicts, then:
```bash
git add .
git commit -m "fix: resolved merge conflict with develop"
git push origin feature/your-branch-name
```

---

## GitFlow Diagram

```
master:   ──────────────────────────────────────── v1.0 ──►
                                                     ↑
develop:  ─────────────────────────────────────────→┘
               ↑           ↑          ↑
feature/*: ────┘       ────┘      ────┘
           (auth)  (upload)   (search)
```

---

## DO's and DON'Ts

| ✅ DO | ❌ DON'T |
|---|---|
| Work on your assigned branch | Push directly to master or develop |
| Pull before you start working | Commit broken/untested code |
| Write clear commit messages | Use vague messages like "fixed stuff" |
| Open a Pull Request when done | Merge your own Pull Request |
| Ask for help if stuck | Stay blocked without telling the team |
| Test your code before pushing | Push code that breaks the backend or frontend |

---

## Quick Reference

```bash
# See all branches
git branch -a

# Switch to your branch
git checkout feature/your-branch-name

# Pull latest changes
git pull origin feature/your-branch-name

# See what changed
git status
git diff

# Stage, commit, push
git add .
git commit -m "feat: your message here"
git push origin feature/your-branch-name
```

---

*Team LandVerify — PKFokam Institute of Excellence — Spring 2026*
