'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distPath = path.join(repoRoot, 'dist');
const sourceIndexPath = path.join(repoRoot, 'src', 'pug', 'index.pug');
const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');

function ensureDist() {
    fs.mkdirSync(distPath, { recursive: true });
}

function getLastMod() {
    const stats = fs.statSync(sourceIndexPath);
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
        const template = `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            `    <url>\n` +
            `        <loc>https://你的正式域名/</loc>\n` +
            `        <lastmod>${getLastMod()}</lastmod>\n` +
            `    </url>\n` +
            `</urlset>\n`;
        fs.writeFileSync(path.join(distPath, 'sitemap.example.xml'), template, 'utf8');
        return;
    }

    const examplePath = path.join(distPath, 'sitemap.example.xml');
    if (fs.existsSync(examplePath)) {
        fs.unlinkSync(examplePath);
    }
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `    <url>\n` +
        `        <loc>${siteUrl}/</loc>\n` +
        `        <lastmod>${getLastMod()}</lastmod>\n` +
        `    </url>\n` +
        `</urlset>\n`;
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap, 'utf8');
}

ensureDist();
writeRobots();
writeSitemap();
