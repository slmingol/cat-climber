# Badge Migration Guide for homepage-config README

This shows **exactly** what to change in your README.md file.

---

## 🔴 BEFORE (Current - Broken for Private Repos)

```markdown
# Homepage Configuration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Homepage](https://img.shields.io/badge/Homepage-v0.9-blue?logo=homeassistant&logoColor=white)](https://gethomepage.dev/)
[![Docker](https://img.shields.io/badge/Docker-required-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/slmingol/homepage-config/graphs/commit-activity)
[![GitHub last commit](https://img.shields.io/github/last-commit/slmingol/homepage-config)](https://github.com/slmingol/homepage-config/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/slmingol/homepage-config)](https://github.com/slmingol/homepage-config)
[![YAML](https://img.shields.io/badge/Config-YAML-red?logo=yaml&logoColor=white)](https://yaml.org/)
[![Private](https://img.shields.io/badge/Visibility-Private-critical)](https://github.com/slmingol/homepage-config)

Configuration files for [Homepage](https://gethomepage.dev/) dashboard.
```

### Why These Are Broken
- ❌ **Line 5**: `https://img.shields.io/github/last-commit/...` - Can't access private repo
- ❌ **Line 6**: `https://img.shields.io/github/repo-size/...` - Can't access private repo

---

## 🟢 AFTER (Fixed - Works for Private Repos)

```markdown
# Homepage Configuration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Homepage](https://img.shields.io/badge/Homepage-v0.9-blue?logo=homeassistant&logoColor=white)](https://gethomepage.dev/)
[![Docker](https://img.shields.io/badge/Docker-required-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/slmingol/homepage-config/graphs/commit-activity)
[![GitHub last commit](.badges/last-commit.svg)](https://github.com/slmingol/homepage-config/commits/main)
[![GitHub repo size](.badges/repo-size.svg)](https://github.com/slmingol/homepage-config)
[![YAML](https://img.shields.io/badge/Config-YAML-red?logo=yaml&logoColor=white)](https://yaml.org/)
[![Private](https://img.shields.io/badge/Visibility-Private-critical)](https://github.com/slmingol/homepage-config)

Configuration files for [Homepage](https://gethomepage.dev/) dashboard.
```

### What Changed
- ✅ **Line 5**: Now uses `.badges/last-commit.svg` (local file)
- ✅ **Line 6**: Now uses `.badges/repo-size.svg` (local file)

---

## 🎯 Exact Changes Required

### Change #1: Last Commit Badge

**Find this line:**
```markdown
[![GitHub last commit](https://img.shields.io/github/last-commit/slmingol/homepage-config)](https://github.com/slmingol/homepage-config/commits/main)
```

**Replace with:**
```markdown
[![GitHub last commit](.badges/last-commit.svg)](https://github.com/slmingol/homepage-config/commits/main)
```

### Change #2: Repo Size Badge

**Find this line:**
```markdown
[![GitHub repo size](https://img.shields.io/github/repo-size/slmingol/homepage-config)](https://github.com/slmingol/homepage-config)
```

**Replace with:**
```markdown
[![GitHub repo size](.badges/repo-size.svg)](https://github.com/slmingol/homepage-config)
```

---

## 📋 Step-by-Step Edit

1. Open `README.md` in your homepage-config repository
2. Locate the badge section (first ~8 lines after the title)
3. Find the two lines with `img.shields.io/github/last-commit` and `img.shields.io/github/repo-size`
4. Replace the image URLs (the part in `![]()` brackets) with `.badges/filename.svg`
5. Keep the link URLs (the part in `()()` parentheses after the image) unchanged
6. Save the file

---

## 🔍 Visual Diff

```diff
  [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](...)
- [![GitHub last commit](https://img.shields.io/github/last-commit/slmingol/homepage-config)](...)
+ [![GitHub last commit](.badges/last-commit.svg)](...)
- [![GitHub repo size](https://img.shields.io/github/repo-size/slmingol/homepage-config)](...)
+ [![GitHub repo size](.badges/repo-size.svg)](...)
  [![YAML](https://img.shields.io/badge/Config-YAML-red?logo=yaml&logoColor=white)](...)
```

---

## ✅ Verification

After making changes, verify the syntax:

```markdown
# Correct format:
[![ALT_TEXT](IMAGE_PATH)](LINK_URL)

# Your new badges should look like:
[![GitHub last commit](.badges/last-commit.svg)](https://...)
                        ^^^^^^^^^^^^^^^^^^^^^^^^^
                        This is a RELATIVE PATH to the SVG file
```

**Common mistakes:**
- ❌ Using `badges/` instead of `.badges/` (missing the dot)
- ❌ Adding `https://` or `http://` before the path
- ❌ Changing the link URL (second set of parentheses) - keep it as-is

---

## 🧪 Test Locally

After editing and committing:

```bash
# Verify badges exist
ls -lh .badges/
# Should show: last-commit.svg and repo-size.svg

# Check they're committed
git ls-files .badges/
# Should list both files

# View README on GitHub
# Badges should display correctly
```

---

## 🎨 How They'll Look

Your badges will look identical to shields.io badges:

- **Last Commit**: ![Last Commit](https://img.shields.io/badge/last%20commit-2%20days%20ago-brightgreen)  
  Updates automatically with relative time

- **Repo Size**: ![Repo Size](https://img.shields.io/badge/repo%20size-245%20KB-blue)  
  Updates automatically with current size

---

## 📝 Full Complete Badge Section

Here's the complete badge section, ready to copy-paste:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Homepage](https://img.shields.io/badge/Homepage-v0.9-blue?logo=homeassistant&logoColor=white)](https://gethomepage.dev/)
[![Docker](https://img.shields.io/badge/Docker-required-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/slmingol/homepage-config/graphs/commit-activity)
[![GitHub last commit](.badges/last-commit.svg)](https://github.com/slmingol/homepage-config/commits/main)
[![GitHub repo size](.badges/repo-size.svg)](https://github.com/slmingol/homepage-config)
[![YAML](https://img.shields.io/badge/Config-YAML-red?logo=yaml&logoColor=white)](https://yaml.org/)
[![Private](https://img.shields.io/badge/Visibility-Private-critical)](https://github.com/slmingol/homepage-config)
```

---

**Done!** After these changes and committing `.badges/`, your badges will display correctly. 🎉
