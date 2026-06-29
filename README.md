# CAT·CLIMBER - Word Ladder Puzzle Game

<p align="center">
  <img src="public/cat-climber-logo.png" alt="CAT·CLIMBER Logo" width="480">
</p>

![Version](https://img.shields.io/badge/Version-v1.1.199-blue?style=flat)
![Build](https://img.shields.io/github/actions/workflow/status/slmingol/cat-climber/docker-build.yml?branch=main&style=flat&label=Build)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Caddy](https://img.shields.io/badge/Caddy-%231F88C0.svg?style=flat&logo=caddy&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)

A word ladder puzzle game inspired by Raddle.quest where you transform one word into another by changing one letter at a time.

## 🎮 How to Play

1. **Start and End**: You're given a starting word and an ending word
2. **Transform**: Change one letter at a time to create new valid words
3. **Connect**: Each step must be a valid word that differs by exactly one letter from the previous word
4. **Use Clues**: Clues are provided out of order to help you find the path
5. **Win**: Successfully transform the start word into the end word!

## ✨ Features

- **964 Puzzles** (844 scraped from raddle.quest + 120 custom) with daily auto-updates
- **Archive Page** to browse all puzzles by theme, filter by source, and sort by date
- **Themed Categories** spanning MIT Mystery Hunt, Winter Olympics, Grateful Dead, Eurovision, NHL Playoffs, and more
- **Shuffled Clues** to increase the challenge
- **Real-time Validation** checks if words differ by one letter
- **Visual Feedback** shows correct and incorrect entries
- **Keyboard Navigation** use arrow keys to move between inputs
- **Reveal Answer** option if you get stuck
- **Responsive Design** works on desktop and mobile
- **Dark/Light/System Theme** toggle

## 🎯 Example

```text
From SAVE to PLAN:
1. SAVE (start)
2. SAGE (change V to G)
3. PAGE (change S to P)
4. PALE (change G to L)
5. PALS (change E to S)
6. PLAN (change S to N - end!)
```

## 🚀 Getting Started

### Local Development

```bash
cd public && python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Docker Deployment

Run with Docker Compose (recommended):

```bash
docker-compose up -d
# Visit http://localhost:3992
```

The compose file mounts `./data` as a persistent volume so puzzle data survives container restarts and receives daily scraper updates:

```yaml
volumes:
  - ./data:/puzzle-data
```

Or run with Docker directly:

```bash
docker pull ghcr.io/slmingol/cat-climber:latest
docker run -d -p 3992:80 \
  -v $(pwd)/data:/puzzle-data \
  ghcr.io/slmingol/cat-climber:latest
```

> **Note:** After pulling a new image that includes updated puzzle data, copy the bundled seed to the host volume so the changes take effect:
> ```bash
> docker exec <container> cat /app/seed/collected-puzzles.json > ./data/collected-puzzles.json
> ```

## 📁 Project Structure

```text
cat-climber/
├── .github/
│   └── workflows/
│       └── docker-build.yml         # Docker build & publish CI/CD
├── data/
│   ├── collected-puzzles.json        # Scraped + merged puzzle database (964 puzzles)
│   └── custom-puzzles.json           # Hand-authored puzzles (120)
├── public/
│   ├── archive.html                  # Archive browse page
│   ├── archive-script.js             # Archive logic (filtering, sorting, theme display)
│   ├── archive-styles.css            # Archive styling
│   ├── collected-puzzles.json        # Copy of data/ version served statically
│   ├── cat-climber-logo.png          # Logo image
│   ├── index.html                    # Main game page
│   ├── script.js                     # Game logic
│   └── styles.css                    # Styling and animations
├── scripts/
│   ├── scheduler.js                  # Runs at 2am/8am/2pm/8pm, backfills 7 days
│   ├── daily-scraper.js              # Single-day scraper called by scheduler
│   ├── archive-scraper.js            # Bulk scraper for date ranges
│   ├── historical-scraper.js         # Historical backfill scraper
│   ├── connections-scraper.js        # NYT Connections scraper (connectionsplus.io)
│   ├── scraper.js                    # Core scrape logic
│   └── merge-puzzles.js              # Merges scraped + custom puzzles
├── docs/
│   ├── DOCKER.md                     # Docker/Podman guide
│   └── PUZZLE-MANAGEMENT.md          # Puzzle management guide
├── Caddyfile                         # Caddy web server config
├── Dockerfile                        # Container definition (Caddy + Node.js + Chromium)
├── docker-compose.yml                # Compose with bind-mounted puzzle data
├── package.json                      # Node.js dependencies
├── ARCHITECTURE.md                   # System architecture documentation
├── README.md                         # This file
└── VERSION                           # Semantic version tracking
```

## 🔄 Puzzle Data

Puzzles are scraped from [raddle.quest](https://raddle.quest) and merged with hand-authored custom puzzles at build time. The scheduler inside the container keeps the dataset current automatically.

### Data flow

```
raddle.quest ──► scripts/daily-scraper.js ──► /puzzle-data/collected-puzzles.json
                                                        │
custom-puzzles.json ──► scripts/merge-puzzles.js ───────┘
                                                        │
                              /usr/share/caddy/ ◄───────┘ (symlink)
```

### Adding custom puzzles

Edit `data/custom-puzzles.json`, then run the merge script and copy both output files:

```bash
node scripts/merge-puzzles.js
cp data/collected-puzzles.json public/collected-puzzles.json
```

### Bulk scraping

```bash
# Scrape a date range
node scripts/archive-scraper.js 2026-01-01 2026-06-30

# Backfill historical puzzles
node scripts/historical-scraper.js
```

## 🚢 CI/CD and Versioning

GitHub Actions builds and publishes a Docker image on every push to `main`. Images are tagged as `latest` and with the version from the `VERSION` file.

```bash
docker pull ghcr.io/slmingol/cat-climber:latest
```

The version is displayed in the lower-right corner of the UI.

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design decisions
- **[docs/DOCKER.md](docs/DOCKER.md)** - Docker/Podman deployment guide
- **[docs/PUZZLE-MANAGEMENT.md](docs/PUZZLE-MANAGEMENT.md)** - Puzzle creation and management

## 🛠️ Technologies Used

- **HTML5 / CSS3 / Vanilla JavaScript** - No frameworks
- **Caddy** - Static file server
- **Node.js + Puppeteer** - Headless scraping with Chromium
- **Docker / Podman** - Container runtime

## 📝 Credits

Inspired by [Raddle.quest](https://raddle.quest) - A daily word ladder puzzle by The Mystery League

## 📄 License

MIT License - Feel free to use and modify as you wish!

---

Made with 💜 for word puzzle enthusiasts
