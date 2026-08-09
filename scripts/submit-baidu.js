'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(repoRoot, 'dist', 'sitemap.xml');
const site = (process.env.BAIDU_SITE || '').trim().replace(/\/+$/, '');
const token = (process.env.BAIDU_TOKEN || '').trim();

function readSitemapUrls() {
    if (!fs.existsSync(sitemapPath)) {
        throw new Error('dist/sitemap.xml does not exist. Run the production build first.');
    }

    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function validateUrls(urls) {
    const siteUrl = new URL(site);
    const invalid = urls.filter((url) => {
        const parsed = new URL(url);
        return parsed.origin !== siteUrl.origin;
    });

    if (invalid.length > 0) {
        throw new Error(`Sitemap contains URLs outside BAIDU_SITE: ${invalid.join(', ')}`);
    }
}

async function submitUrls(urls) {
    const endpoint = new URL('https://data.zz.baidu.com/urls');
    endpoint.searchParams.set('site', site);
    endpoint.searchParams.set('token', token);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain; charset=UTF-8'
        },
        body: `${urls.join('\n')}\n`
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.error) {
        const message = result.message || result.error || `HTTP ${response.status}`;
        throw new Error(`Baidu URL submission failed: ${message}`);
    }

    console.log(`Submitted ${result.success ?? urls.length} URL(s) to Baidu.`);
    if (typeof result.remain === 'number') {
        console.log(`Baidu daily quota remaining: ${result.remain}.`);
    }
}

async function main() {
    if (!site || !token) {
        throw new Error('BAIDU_SITE and BAIDU_TOKEN are required.');
    }

    const urls = readSitemapUrls();
    if (urls.length === 0) {
        throw new Error('No URLs were found in dist/sitemap.xml.');
    }

    validateUrls(urls);

    if (process.env.BAIDU_DRY_RUN === '1') {
        console.log(`Validated ${urls.length} sitemap URL(s) for Baidu submission.`);
        return;
    }

    await submitUrls(urls);
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
