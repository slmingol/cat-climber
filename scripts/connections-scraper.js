#!/usr/bin/env node
/**
 * Connections Plus scraper
 * Fetches puzzles from connectionsplus.io
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapePuzzle(browser, puzzleNum) {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        const url = `https://connectionsplus.io/game/${puzzleNum}`;
        console.log(`Fetching puzzle #${puzzleNum}...`);
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const puzzleData = await page.evaluate(() => {
            const data = {
                number: null,
                date: '',
                words: [],
                categories: [],
                url: window.location.href
            };
            
            const fullText = document.body.textContent;
            
            // Extract puzzle number
            const numMatch = fullText.match(/Connections #(\d+)/);
            if (numMatch) data.number = parseInt(numMatch[1]);
            
            // Extract date
            const dateMatch = fullText.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}/);
            if (dateMatch) data.date = dateMatch[0];
            
            // Extract all word buttons/tiles
            const wordElements = document.querySelectorAll('button[class*="word"], div[class*="tile"], button[class*="tile"]');
            wordElements.forEach(el => {
                const word = el.textContent.trim();
                if (word && word.length > 0 && !word.match(/Submit|Shuffle|Deselect|Share/i)) {
                    data.words.push(word);
                }
            });
            
            // Try to extract categories from revealed answers (if any)
            const categoryElements = document.querySelectorAll('[class*="category"], [class*="group"]');
            categoryElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length > 5) {
                    data.categories.push(text);
                }
            });
            
            return data;
        });
        
        await page.close();
        
        // Validate we got data
        if (!puzzleData.number || puzzleData.words.length === 0) {
            return null;
        }
        
        return puzzleData;
        
    } catch (error) {
        console.error(`  Error: ${error.message}`);
        return null;
    }
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node connections-scraper.js [start-puzzle] [end-puzzle]');
        console.log('Example: node connections-scraper.js 1 100');
        process.exit(1);
    }
    
    const startNum = parseInt(args[0]);
    const endNum = parseInt(args[1]);
    
    console.log('='.repeat(60));
    console.log('CONNECTIONS PLUS SCRAPER');
    console.log('='.repeat(60));
    console.log(`Scraping puzzles #${startNum} to #${endNum}\n`);
    
    // Load or create collection
    const collectionPath = path.join(__dirname, '../data/connections-puzzles.json');
    let collection = { collected: new Date().toISOString(), count: 0, puzzles: [] };
    
    if (fs.existsSync(collectionPath)) {
        collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        console.log(`Loaded existing collection: ${collection.count} puzzles\n`);
    }
    
    // Track existing puzzle numbers
    const existingNums = new Set(collection.puzzles.map(p => p.number).filter(Boolean));
    
    // Launch browser
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let added = 0;
    let skipped = 0;
    let failed = 0;
    
    for (let num = startNum; num <= endNum; num++) {
        // Skip if already exists
        if (existingNums.has(num)) {
            console.log(`#${num} - Already exists`);
            skipped++;
            continue;
        }
        
        const puzzleData = await scrapePuzzle(browser, num);
        
        if (puzzleData && puzzleData.number) {
            collection.puzzles.push(puzzleData);
            collection.count = collection.puzzles.length;
            console.log(`  ✓ #${puzzleData.number} - ${puzzleData.date} (${puzzleData.words.length} words)`);
            added++;
            
            // Save progress every 10 puzzles
            if (added % 10 === 0) {
                collection.collected = new Date().toISOString();
                fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
                console.log(`  💾 Progress saved (${added} puzzles)\n`);
            }
        } else {
            console.log(`  ✗ #${num} - Failed or not found`);
            failed++;
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    // Final save
    collection.collected = new Date().toISOString();
    // Sort by puzzle number
    collection.puzzles.sort((a, b) => a.number - b.number);
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('SCRAPING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Puzzles scraped: ${startNum}-${endNum} (${endNum - startNum + 1} total)`);
    console.log(`New puzzles added: ${added}`);
    console.log(`Already existed: ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log(`Final collection size: ${collection.count}`);
    console.log(`Saved to: ${collectionPath}`);
    console.log('='.repeat(60));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
