#!/usr/bin/env node
/**
 * Archive-based scraper - Gets ALL puzzle URLs from archive page, then fetches each
 * More reliable than date-guessing since it uses actual links
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function getAllArchiveLinks() {
    console.log('Fetching archive page...');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('https://raddle.quest/archive', { 
        waitUntil: 'networkidle0', 
        timeout: 30000 
    });
    
    // Wait for archive to render
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Extract all puzzle links
    const links = await page.evaluate(() => {
        // Look for links that contain dates (various patterns)
        const anchors = document.querySelectorAll('a[href*="/20"]');
        const puzzleLinks = [];
        
        anchors.forEach(a => {
            const url = a.href;
            // Match URLs like raddle.quest/2023/06/12 or raddle.quest/archive/123
            if (url.match(/raddle\.quest\/(202[0-9]\/\d{2}\/\d{2}|archive\/\d+)/)) {
                puzzleLinks.push({
                    url: url,
                    text: a.textContent.trim()
                });
            }
        });
        
        return puzzleLinks;
    });
    
    await browser.close();
    
    console.log(`Found ${links.length} puzzle links in archive`);
    return links;
}

async function scrapePuzzle(browser, url) {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
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
            
            // Extract start and end words
            const fromToMatch = fullText.match(/From\s+([A-Z][A-Z\s']+?)\s+to\s+([A-Z][A-Z\s']+?)(?=\s+[^A-Z]|\s*$)/);
            if (!fromToMatch) {
                return null;
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
        console.error(`  Error: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('ARCHIVE-BASED PUZZLE SCRAPER');
    console.log('='.repeat(60));
    console.log();
    
    // Load existing collection
    const collectionPath = path.join(__dirname, '../data/collected-puzzles.json');
    let collection = { collected: new Date().toISOString(), count: 0, puzzles: [] };
    
    if (fs.existsSync(collectionPath)) {
        collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        console.log(`Loaded existing collection: ${collection.count} puzzles\n`);
    }
    
    // Build set of existing puzzle URLs
    const existingUrls = new Set(collection.puzzles.map(p => p.url).filter(Boolean));
    
    // Get all archive links
    const archiveLinks = await getAllArchiveLinks();
    
    if (!archiveLinks || archiveLinks.length === 0) {
        console.error('Failed to fetch archive links');
        process.exit(1);
    }
    
    console.log();
    console.log('Starting puzzle scraping...\n');
    
    // Launch browser for scraping
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let added = 0;
    let skipped = 0;
    let failed = 0;
    
    for (let i = 0; i < archiveLinks.length; i++) {
        const link = archiveLinks[i];
        const num = i + 1;
        
        // Skip if already exists
        if (existingUrls.has(link.url)) {
            console.log(`${num}/${archiveLinks.length} ${link.text} - Already exists`);
            skipped++;
            continue;
        }
        
        console.log(`${num}/${archiveLinks.length} ${link.text} - Fetching...`);
        const puzzleData = await scrapePuzzle(browser, link.url);
        
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
            console.log(`  ✗ Failed to parse puzzle`);
            failed++;
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    // Final save
    collection.collected = new Date().toISOString();
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('SCRAPING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Archive links found: ${archiveLinks.length}`);
    console.log(`New puzzles added: ${added}`);
    console.log(`Already existed: ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log(`Final collection size: ${collection.count}`);
    console.log('='.repeat(60));
    
    // Run merge
    console.log('\nRunning merge with custom puzzles...');
    const { execSync } = require('child_process');
    try {
        const mergeScript = path.join(__dirname, 'merge-puzzles.js');
        execSync(`node "${mergeScript}"`, { cwd: __dirname, stdio: 'inherit' });
    } catch (err) {
        console.error('Warning: Merge failed:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
