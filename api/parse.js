import playwright from 'playwright-aws-lambda';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let browser = null;
    try {
        browser = await playwright.launchChromium({ headless: true });
        const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36' });
        const page = await context.newPage();
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const html = await page.content();
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article || !article.content) {
            throw new Error('Failed to parse article using Readability.');
        }
        
        return res.status(200).json({
            title: article.title || 'Untitled',
            content: article.content,
            author: article.byline || 'Unknown Author',
        });

    } catch (error) {
        console.error(`Error processing URL: ${url}`, error);
        return res.status(500).json({ error: `Failed to process the page. It might be too complex or protected.` });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}