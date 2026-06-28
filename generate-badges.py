#!/usr/bin/env python3
"""
Generate static SVG badges for private repository stats.
Run by GitHub Actions on push to keep badges up-to-date.
"""
import os
import subprocess
from datetime import datetime
from pathlib import Path


def run_command(cmd):
    """Run a shell command and return output."""
    result = subprocess.run(
        cmd, shell=True, capture_output=True, text=True, check=True
    )
    return result.stdout.strip()


def get_last_commit_date():
    """Get the date of the last commit."""
    timestamp = run_command("git log -1 --format=%ct")
    dt = datetime.fromtimestamp(int(timestamp))
    
    # Calculate relative time
    now = datetime.now()
    delta = now - dt
    
    if delta.days == 0:
        return "today"
    elif delta.days == 1:
        return "yesterday"
    elif delta.days < 30:
        return f"{delta.days} days ago"
    elif delta.days < 365:
        months = delta.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    else:
        years = delta.days // 365
        return f"{years} year{'s' if years > 1 else ''} ago"


def get_repo_size():
    """Calculate repository size in KB."""
    size = run_command("git count-objects -vH | grep 'size-pack' | awk '{print $2}'")
    # If no pack file, use size
    if not size:
        size = run_command("git count-objects -vH | grep '^size:' | awk '{print $2}'")
    return size if size else "0 KB"


def create_badge_svg(label, message, color, output_path):
    """
    Create an SVG badge similar to shields.io style.
    
    Args:
        label: Left side text (e.g., "last commit")
        message: Right side text (e.g., "2 days ago")
        color: Hex color for right side (without #)
        output_path: Path to save SVG file
    """
    # Calculate widths based on text length (rough estimate)
    label_width = len(label) * 6 + 10
    message_width = len(message) * 6 + 10
    total_width = label_width + message_width
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{total_width}" height="20" role="img" aria-label="{label}: {message}">
  <title>{label}: {message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="{total_width}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="{label_width}" height="20" fill="#555"/>
    <rect x="{label_width}" width="{message_width}" height="20" fill="#{color}"/>
    <rect width="{total_width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="{label_width // 2 * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="{(label_width - 10) * 10}">{label}</text>
    <text x="{label_width // 2 * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="{(label_width - 10) * 10}">{label}</text>
    <text aria-hidden="true" x="{(label_width + message_width // 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="{(message_width - 10) * 10}">{message}</text>
    <text x="{(label_width + message_width // 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="{(message_width - 10) * 10}">{message}</text>
  </g>
</svg>'''
    
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(svg)
    print(f"Created badge: {output_path}")


def main():
    """Generate all stat badges."""
    badges_dir = Path(".badges")
    badges_dir.mkdir(exist_ok=True)
    
    # Generate last commit badge
    last_commit = get_last_commit_date()
    create_badge_svg(
        label="last commit",
        message=last_commit,
        color="4c1",
        output_path=badges_dir / "last-commit.svg"
    )
    
    # Generate repo size badge
    repo_size = get_repo_size()
    create_badge_svg(
        label="repo size",
        message=repo_size,
        color="007ec6",
        output_path=badges_dir / "repo-size.svg"
    )
    
    print("\nBadges generated successfully in .badges/")


if __name__ == "__main__":
    main()
