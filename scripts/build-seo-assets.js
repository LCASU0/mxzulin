'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distPath = path.join(repoRoot, 'dist');
const sitemapPages = [
    { loc: '/', source: path.join(repoRoot, 'src', 'pug', 'index.pug') },
    { loc: '/lifting-plan.html', source: path.join(repoRoot, 'src', 'pug', 'lifting-plan.pug') },
];
const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');

function ensureDist() {
    fs.mkdirSync(distPath, { recursive: true });
}

function getLastMod(sourcePath) {
    const stats = fs.statSync(sourcePath);
    return stats.mtime.toISOString().slice(0, 10);
}

function writeRobots() {
    const lines = [
        'User-agent: *',
        'Allow: /',
        '',
        '# 搜索引擎可抓取整站静态内容。',
        '# 部署正式域名后，建议使用：',
        '# SITE_URL=https://www.example.com npm run build',
    ];

    if (siteUrl) {
        lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
    } else {
        lines.push('# Sitemap: https://你的正式域名/sitemap.xml');
    }

    fs.writeFileSync(path.join(distPath, 'robots.txt'), `${lines.join('\n')}\n`, 'utf8');
}

function writeSitemap() {
    if (!siteUrl) {
        const sitemapPath = path.join(distPath, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
            fs.unlinkSync(sitemapPath);
        }
        const urls = sitemapPages.map((page) => (
            `    <url>\n` +
            `        <loc>https://你的正式域名${page.loc}</loc>\n` +
            `        <lastmod>${getLastMod(page.source)}</lastmod>\n` +
            `    </url>`
        )).join('\n');
        const template = `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            `${urls}\n` +
            `</urlset>\n`;
        fs.writeFileSync(path.join(distPath, 'sitemap.example.xml'), template, 'utf8');
        return;
    }

    const examplePath = path.join(distPath, 'sitemap.example.xml');
    if (fs.existsSync(examplePath)) {
        fs.unlinkSync(examplePath);
    }
    const urls = sitemapPages.map((page) => (
        `    <url>\n` +
        `        <loc>${siteUrl}${page.loc}</loc>\n` +
        `        <lastmod>${getLastMod(page.source)}</lastmod>\n` +
        `    </url>`
    )).join('\n');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${urls}\n` +
        `</urlset>\n`;
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap, 'utf8');
}

ensureDist();
writeRobots();
writeSitemap();
