#!/bin/bash
# Installation script for badge generation system
# Run this from your homepage-config repository root

set -e

echo "🎨 Installing badge generation system for homepage-config..."
echo

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository root"
    echo "   Please run this script from your homepage-config repository"
    exit 1
fi

# Check if we have the source files
BADGE_SCRIPT="$1"
WORKFLOW_FILE="$2"

if [ -z "$BADGE_SCRIPT" ] || [ -z "$WORKFLOW_FILE" ]; then
    echo "Usage: $0 <path-to-generate-badges.py> <path-to-update-badges.yml>"
    echo
    echo "Example:"
    echo "  $0 /path/to/generate-badges.py /path/to/update-badges.yml"
    exit 1
fi

# Copy badge generation script
echo "📋 Copying generate-badges.py..."
cp "$BADGE_SCRIPT" generate-badges.py
chmod +x generate-badges.py

# Create .github/workflows directory
echo "📁 Creating .github/workflows/ directory..."
mkdir -p .github/workflows

# Copy workflow file
echo "📋 Copying update-badges.yml workflow..."
cp "$WORKFLOW_FILE" .github/workflows/update-badges.yml

# Generate initial badges
echo "🎨 Generating initial badges..."
python3 generate-badges.py

# Check if .badges exists
if [ -d .badges ]; then
    echo "✅ Badges generated in .badges/"
    ls -lh .badges/
else
    echo "❌ Failed to generate badges"
    exit 1
fi

echo
echo "📝 Next steps:"
echo "   1. Update your README.md badges to use:"
echo "      [![GitHub last commit](.badges/last-commit.svg)](...)"
echo "      [![GitHub repo size](.badges/repo-size.svg)](...)"
echo
echo "   2. Commit and push:"
echo "      git add generate-badges.py .github/workflows/update-badges.yml .badges/"
echo "      git commit -m \"Add automated badge generation\""
echo "      git push"
echo
echo "   3. Badges will auto-update on every push to main!"
echo
echo "✨ Installation complete!"
