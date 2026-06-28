#!/usr/bin/env node
/**
 * Historical puzzle scraper - fetches puzzles from a date range
 * Usage: node historical-scraper.js [start-date] [end-date]
 * Example: node historical-scraper.js 2024-01-01 2024-12-31
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node historical-scraper.js [start-date] [end-date]');
    console.log('Example: node historical-scraper.js 2024-01-01 2024-12-31');
    console.log('');
    console.log('Or specify days ago:');
    console.log('  node historical-scraper.js --days 365');
    process.exit(1);
}

let startDate, endDate;

if (args[0] === '--days') {
    const daysAgo = parseInt(args[1]);
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
} else {
    startDate = new Date(args[0]);
    endDate = new Date(args[1]);
}

console.log(`Scraping puzzles from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

// Generate array of dates
function getDateRange(start, end) {
    const dates = [];
    const current = new Date(start);
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

// Fetch puzzle for a specific date
async function fetchPuzzleForDate(browser, dateStr) {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        const [year, month, day] = dateStr.split('-');
        const url = `https://raddle.quest/${year}/${month}/${day}`;
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const puzzleData = await page.evaluate(() => {
            const data = {
                start: '',
                end: '',
                clues: [],
                solution: [],
                theme: '',
                date: '',
                url: window.location.href
            };
            
            const fullText = document.body.textContent;
            
            // Check if puzzle exists (look for "From X to Y" pattern)
            const fromToMatch = fullText.match(/From\s+([A-Z][A-Z\s']+?)\s+to\s+([A-Z][A-Z\s']+?)(?=\s+[^A-Z]|\s*$)/);
            if (!fromToMatch) {
                return null; // No puzzle found
            }
            
            data.start = fromToMatch[1];
            data.end = fromToMatch[2];
            
            // Extract date
            const dateMatch = fullText.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[^,]*,\s*\w+\s+\d+,\s*\d{4}/);
            if (dateMatch) data.date = dateMatch[0];
            
            // Extract theme
            const themeMatch = fullText.match(/Raddle #\d+\s+([^\n]+?)(?:\s+From|$)/);
            if (themeMatch) data.theme = themeMatch[1].trim();
            
            // Extract clues
            const cluesSection = fullText.match(/Clues, out of order\s+([\s\S]*?)(?=About this|$)/i);
            if (cluesSection && data.start) {
                const clueText = cluesSection[1];
                const clueLines = clueText.split(/\s{3,}/)
                    .map(line => line.trim().replace(/\s+/g, ' '))
                    .filter(line => {
                        return line.length > 20 && 
                               line.includes(data.start) &&
                               !line.match(/^(Switch to|About|Raddle)/i);
                    })
                    .map(line => line.replace(new RegExp(data.start, 'g'), '____'));
                data.clues = clueLines;
            }
            
            // Extract note
            const noteMatch = fullText.match(/About this Raddle\s+([\s\S]*?)(?=About this theme|©|$)/i);
            if (noteMatch) {
                data.note = noteMatch[1].trim()
                    .replace(/\s+/g, ' ')
                    .substring(0, 1000);
            }
            
            return data;
        });
        
        await page.close();
        return puzzleData;
        
    } catch (error) {
        console.error(`  ✗ Error fetching ${dateStr}: ${error.message}`);
        return null;
    }
}

// Main execution
async function main() {
    const dates = getDateRange(startDate, endDate);
    console.log(`Found ${dates.length} dates to check\n`);
    
    // Load existing collection
    const collectionPath = path.join(__dirname, '../data/collected-puzzles.json');
    let collection = { collected: new Date().toISOString(), count: 0, puzzles: [] };
    
    if (fs.existsSync(collectionPath)) {
        collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        console.log(`Loaded existing collection with ${collection.count} puzzles\n`);
    }
    
    // Track existing puzzles by date to avoid duplicates
    const existingDates = new Set();
    collection.puzzles.forEach(p => {
        if (p.date) {
            const normalized = new Date(p.date).toISOString().split('T')[0];
            existingDates.add(normalized);
        }
    });
    
    // Launch browser once for all requests
    console.log('Launching browser...\n');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let added = 0;
    let skipped = 0;
    let notFound = 0;
    
    // Process dates with rate limiting
    for (let i = 0; i < dates.length; i++) {
        const dateStr = dates[i];
        
        // Skip if already exists
        if (existingDates.has(dateStr)) {
            console.log(`${i+1}/${dates.length} ${dateStr} - Already in collection`);
            skipped++;
            continue;
        }
        
        console.log(`${i+1}/${dates.length} ${dateStr} - Fetching...`);
        const puzzleData = await fetchPuzzleForDate(browser, dateStr);
        
        if (puzzleData && puzzleData.start && puzzleData.end) {
            collection.puzzles.unshift(puzzleData);
            collection.count = collection.puzzles.length;
            console.log(`  ✓ ${puzzleData.start} → ${puzzleData.end} (${puzzleData.clues.length} clues)`);
            added++;
            
            // Save progress every 10 puzzles
            if (added % 10 === 0) {
                collection.collected = new Date().toISOString();
                fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
                console.log(`  💾 Progress saved (${added} new puzzles)\n`);
            }
        } else {
            console.log(`  - No puzzle found`);
            notFound++;
        }
        
        // Rate limiting: wait 1 second between requests
        if (i < dates.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    await browser.close();
    
    // Final save
    collection.collected = new Date().toISOString();
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    
    console.log('\n' + '='.repeat(50));
    console.log('HISTORICAL SCRAPE COMPLETE');
    console.log('='.repeat(50));
    console.log(`Total dates checked: ${dates.length}`);
    console.log(`New puzzles added: ${added}`);
    console.log(`Already existed: ${skipped}`);
    console.log(`Not found: ${notFound}`);
    console.log(`Final collection size: ${collection.count}`);
    console.log('='.repeat(50));
    
    // Run merge with custom puzzles
    console.log('\nRunning merge with custom puzzles...');
    const { execSync } = require('child_process');
    try {
        const mergeScript = path.join(__dirname, 'merge-puzzles.js');
        execSync(`node "${mergeScript}"`, { cwd: __dirname, stdio: 'inherit' });
    } catch (err) {
        console.error('Warning: Merge script failed:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
