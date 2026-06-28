# Homepage-Config Badge Generation System

Complete CI/CD solution for generating static badges in private GitHub repositories.

## 📦 What's Included

This package provides everything needed to add auto-updating badges to your [homepage-config](https://github.com/slmingol/homepage-config) repository:

### Core Files
- **`generate-badges.py`** - Python script that generates shields.io-style SVG badges
- **`.github-example/workflows/update-badges.yml`** - GitHub Actions workflow for automation
- **`install-badges.sh`** - Automated installation script

### Documentation
- **`QUICKSTART.md`** - 5-minute setup guide (start here!)
- **`BADGE_SETUP.md`** - Complete documentation and troubleshooting
- **`README_EXAMPLE.md`** - Copy-paste badge syntax for your README

## 🎯 Purpose

Your homepage-config repository is **private**, which breaks shields.io badges that rely on the GitHub API:

❌ **Before**: `https://img.shields.io/github/last-commit/slmingol/homepage-config` (broken)  
✅ **After**: `.badges/last-commit.svg` (works!)

## 🚀 Quick Install

```bash
# Navigate to homepage-config repo
cd /path/to/homepage-config

# Copy files
cp /path/to/these/files/generate-badges.py .
mkdir -p .github/workflows
cp /path/to/these/files/.github-example/workflows/update-badges.yml .github/workflows/

# Generate initial badges
python3 generate-badges.py

# Update README.md to use:
# [![GitHub last commit](.badges/last-commit.svg)](...)
# [![GitHub repo size](.badges/repo-size.svg)](...)

# Commit everything
git add generate-badges.py .github/workflows/update-badges.yml .badges/ README.md
git commit -m "Add automated badge generation"
git push
```

**See `QUICKSTART.md` for detailed steps!**

## 🎨 Generated Badges

The system creates two badges:

1. **Last Commit** - Shows relative time (e.g., "2 days ago")
2. **Repo Size** - Shows repository size (e.g., "245 KB")

Both auto-update on every push to `main`.

## ✨ Features

✅ Works with private repositories  
✅ No external API dependencies  
✅ Shields.io-compatible SVG styling  
✅ Auto-updates on push + daily schedule  
✅ Fully customizable colors and metrics  
✅ Manual trigger via GitHub Actions UI  

## 📁 Generated Structure

After installation, your repo will have:

```
homepage-config/
├── generate-badges.py              # Badge generator
├── .github/
│   └── workflows/
│       └── update-badges.yml       # CI workflow
└── .badges/                        # Generated badges
    ├── last-commit.svg
    └── repo-size.svg
```

## 🔧 Testing

Test the badge generator locally:

```bash
# In this directory (cat-climber)
python3 generate-badges.py
ls -lh .badges/
# Should show two SVG files

# View a badge
cat .badges/last-commit.svg
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | 5-minute installation guide |
| **BADGE_SETUP.md** | Complete documentation with troubleshooting |
| **README_EXAMPLE.md** | Example README badge section |

## 🎚️ Customization

### Change Badge Colors

Edit `generate-badges.py`:

```python
create_badge_svg(
    label="last commit",
    message=last_commit,
    color="4c1",  # ← Change color here
    ...
)
```

### Add More Badges

Extend `generate-badges.py`:

```python
# Count YAML files
yaml_count = run_command("find . -name '*.yaml' | wc -l")
create_badge_svg(
    label="config files",
    message=f"{yaml_count}",
    color="red",
    output_path=badges_dir / "yaml-count.svg"
)
```

### Change Update Frequency

Edit `.github/workflows/update-badges.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

## 🆘 Support

- **Installation help**: See `QUICKSTART.md`
- **Customization**: See `BADGE_SETUP.md`
- **Badge syntax**: See `README_EXAMPLE.md`

## 🧪 Verified Working

Tested and working in this repository:
- ✅ Badge generation script runs without errors
- ✅ SVG badges created with valid syntax
- ✅ Shields.io-compatible styling
- ✅ Git commands execute correctly

## 📞 Next Steps

1. **Read** `QUICKSTART.md` for installation
2. **Copy** files to homepage-config repository
3. **Run** installation steps
4. **Update** README.md badge URLs
5. **Commit** and push
6. **Verify** badges display correctly

---

**Ready to install?** Open `QUICKSTART.md` and follow the 5-minute guide! 🚀
