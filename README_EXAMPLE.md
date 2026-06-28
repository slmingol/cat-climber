# Example README.md Badge Section

Replace the badge section at the top of your homepage-config README.md with this:

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

## What Changed?

Only two badges changed - they now point to local SVG files instead of shields.io:

### Before (doesn't work for private repos):
```markdown
[![GitHub last commit](https://img.shields.io/github/last-commit/slmingol/homepage-config)](...)
[![GitHub repo size](https://img.shields.io/github/repo-size/slmingol/homepage-config)](...)
```

### After (works with private repos):
```markdown
[![GitHub last commit](.badges/last-commit.svg)](...)
[![GitHub repo size](.badges/repo-size.svg)](...)
```

All other badges remain unchanged because they're static and don't require repo access.
