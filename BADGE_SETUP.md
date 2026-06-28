# Static Badge Generation for homepage-config

This directory contains files to set up automatic badge generation for the [homepage-config](https://github.com/slmingol/homepage-config) repository.

## Problem

The homepage-config repository is **private**, so shields.io badges that rely on GitHub's API (like `last-commit` and `repo-size`) don't work because they can't access private repository data.

## Solution

Generate static SVG badges using GitHub Actions that:
1. Run on every push to `main`
2. Calculate repo stats locally
3. Generate SVG badges
4. Commit them to `.badges/` directory
5. Use relative paths in README to display them

## Installation

Copy these files to your homepage-config repository:

```bash
# From this directory, copy to homepage-config repo:
cp generate-badges.py /path/to/homepage-config/
cp .github-example/workflows/update-badges.yml /path/to/homepage-config/.github/workflows/update-badges.yml
```

## Files

1. **`generate-badges.py`** - Python script that generates SVG badges
   - Calculates last commit date (relative, e.g., "2 days ago")
   - Calculates repository size
   - Generates shields.io-style SVG badges

2. **`.github/workflows/update-badges.yml`** - GitHub Actions workflow
   - Triggers on: push to main, daily schedule, manual dispatch
   - Runs the badge generator
   - Commits updated badges automatically

## Badge Output

Badges are saved to `.badges/` directory:
- `.badges/last-commit.svg` - Last commit relative time
- `.badges/repo-size.svg` - Repository size

## Update README

Replace the shields.io badge URLs with local ones:

### Before
```markdown
[![GitHub last commit](https://img.shields.io/github/last-commit/slmingol/homepage-config)](https://github.com/slmingol/homepage-config/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/slmingol/homepage-config)](https://github.com/slmingol/homepage-config)
```

### After
```markdown
[![GitHub last commit](.badges/last-commit.svg)](https://github.com/slmingol/homepage-config/commits/main)
[![GitHub repo size](.badges/repo-size.svg)](https://github.com/slmingol/homepage-config)
```

## Customization

### Change Badge Colors

Edit `generate-badges.py` and modify the `color` parameter:
- Last commit: Currently `4c1` (green)
- Repo size: Currently `007ec6` (blue)

Common colors:
- `brightgreen` / `4c1` - Success/Active
- `blue` / `007ec6` - Info
- `orange` / `fe7d37` - Warning
- `red` / `e05d44` - Error
- `lightgrey` / `9f9f9f` - Neutral

### Add More Badges

To add custom badges, edit `generate-badges.py` and add to the `main()` function:

```python
# Example: File count badge
file_count = run_command("find . -type f | wc -l")
create_badge_svg(
    label="files",
    message=str(file_count),
    color="blue",
    output_path=badges_dir / "file-count.svg"
)
```

### Change Update Frequency

Edit `.github/workflows/update-badges.yml` schedule:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  - cron: '0 0 * * 0'    # Weekly on Sunday
```

## Manual Trigger

You can manually trigger the workflow from GitHub:
1. Go to Actions tab
2. Select "Update Repository Badges"
3. Click "Run workflow"

## First Run

After setup, trigger the workflow once to generate initial badges:

```bash
# In homepage-config repo
git add .github/workflows/update-badges.yml generate-badges.py
git commit -m "Add badge generation workflow"
git push

# Or run locally to test
python3 generate-badges.py
git add .badges/
git commit -m "Add initial badges"
git push
```

## Troubleshooting

### Workflow doesn't commit badges

Check that workflow has `contents: write` permission. This should be set in the workflow file.

### Python script fails

Make sure Git history is available:
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history needed
```

### Badges not displaying

- Ensure `.badges/` directory is committed
- Check README uses relative paths: `(.badges/filename.svg)`
- Verify SVG files are valid by opening them locally

## Benefits

✅ Works with private repositories  
✅ No external API dependencies  
✅ Automatic updates on every push  
✅ Customizable styling and metrics  
✅ Full control over badge content
