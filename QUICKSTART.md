# Quick Start: Badge Generation for homepage-config

## Problem
Your private homepage-config repository has broken badges because shields.io can't access private repo data.

## Solution
✅ Auto-generate static SVG badges using GitHub Actions  
✅ Badges update on every push  
✅ No external dependencies  

---

## 🚀 Quick Installation (5 minutes)

### Method 1: Automated Install (Recommended)

```bash
# 1. Clone or download these files to a temp directory
cd /tmp
# (assume you have generate-badges.py and update-badges.yml)

# 2. Navigate to your homepage-config repo
cd /path/to/homepage-config

# 3. Run the installer
bash /path/to/install-badges.sh /tmp/generate-badges.py /tmp/.github-example/workflows/update-badges.yml

# 4. Update README badges (see README_EXAMPLE.md for exact syntax)
# Replace:
#   [![GitHub last commit](https://img.shields.io/github/last-commit/...)]
# With:
#   [![GitHub last commit](.badges/last-commit.svg)]
#
# And:
#   [![GitHub repo size](https://img.shields.io/github/repo-size/...)]
# With:
#   [![GitHub repo size](.badges/repo-size.svg)]

# 5. Commit and push
git add generate-badges.py .github/workflows/update-badges.yml .badges/ README.md
git commit -m "Add automated badge generation"
git push
```

### Method 2: Manual Install

```bash
# Navigate to homepage-config repo
cd /path/to/homepage-config

# Copy files
cp /path/to/generate-badges.py .
mkdir -p .github/workflows
cp /path/to/update-badges.yml .github/workflows/

# Generate initial badges
python3 generate-badges.py

# Update README.md (see README_EXAMPLE.md)
# Then commit
git add .
git commit -m "Add automated badge generation"
git push
```

---

## 📋 What Gets Created

```
homepage-config/
├── generate-badges.py              # Badge generation script
├── .github/
│   └── workflows/
│       └── update-badges.yml       # CI workflow
└── .badges/                        # Generated badges (auto-created)
    ├── last-commit.svg
    └── repo-size.svg
```

---

## 🎨 Badge Examples

Generated badges look like shields.io badges:

![Last Commit Example](https://img.shields.io/badge/last%20commit-2%20days%20ago-brightgreen)
![Repo Size Example](https://img.shields.io/badge/repo%20size-245%20KB-blue)

---

## 🔄 How It Works

1. **Trigger**: Workflow runs on:
   - Every push to `main`
   - Daily at midnight UTC
   - Manual trigger via GitHub Actions UI

2. **Generate**: Python script calculates:
   - Last commit date (relative: "2 days ago")
   - Repository size (formatted: "245 KB")

3. **Update**: Script creates SVG badges in `.badges/`

4. **Commit**: Workflow auto-commits badges if changed

5. **Display**: README shows badges via relative paths

---

## ✅ Verification

After installation, verify it works:

```bash
# Check badges exist
ls -lh .badges/
# Should show:
# last-commit.svg
# repo-size.svg

# Check they're valid SVGs
cat .badges/last-commit.svg
# Should show SVG XML

# Test the workflow
# Go to: https://github.com/slmingol/homepage-config/actions
# Click "Update Repository Badges" → "Run workflow"
```

---

## 🎚️ Customization

### Change Colors

Edit `generate-badges.py`:

```python
# Last commit badge - line ~88
create_badge_svg(
    label="last commit",
    message=last_commit,
    color="4c1",  # ← Change this (green)
    ...
)

# Repo size badge - line ~96
create_badge_svg(
    label="repo size",
    message=repo_size,
    color="007ec6",  # ← Change this (blue)
    ...
)
```

Color options:
- `4c1` - Green (success)
- `007ec6` - Blue (info)
- `fe7d37` - Orange (warning)
- `e05d44` - Red (error)
- `9f9f9f` - Gray (neutral)

### Add Custom Badges

Add to `main()` in `generate-badges.py`:

```python
# Example: Count YAML files
yaml_count = run_command("find . -name '*.yaml' | wc -l")
create_badge_svg(
    label="config files",
    message=f"{yaml_count} YAML",
    color="red",
    output_path=badges_dir / "config-files.svg"
)
```

Then reference in README:
```markdown
[![Config Files](.badges/config-files.svg)](...)
```

---

## 🐛 Troubleshooting

### Badges not updating
- Check Actions tab for workflow runs
- Verify workflow has `contents: write` permission
- Ensure `.badges/` is committed to repo

### "Command not found" error
- Workflow runs in Ubuntu, has Python 3 and Git
- Test locally: `python3 generate-badges.py`

### Badges not displaying in README
- Use relative paths: `(.badges/file.svg)` not `(https://...)`
- Check SVGs are in repo: `git ls-files .badges/`
- Clear browser cache

---

## 🆘 Help

See `BADGE_SETUP.md` for detailed documentation.

Issues? Check:
1. Workflow runs: https://github.com/slmingol/homepage-config/actions
2. Generated SVGs exist: `ls .badges/`
3. README uses relative paths: `.badges/filename.svg`

---

## 📚 Files in This Package

- `QUICKSTART.md` ← You are here
- `BADGE_SETUP.md` - Detailed documentation
- `README_EXAMPLE.md` - Example badge section for README
- `generate-badges.py` - Badge generation script
- `.github-example/workflows/update-badges.yml` - GitHub Actions workflow
- `install-badges.sh` - Automated installation script

---

**Ready?** Start with Method 1 above! 🚀
