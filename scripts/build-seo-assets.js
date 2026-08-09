'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const distPath = path.join(repoRoot, 'dist');
const pugPath = path.join(repoRoot, 'src', 'pug');
const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');

function ensureDist() {
    fs.mkdirSync(distPath, { recursive: true });
}

function getLastMod(sourcePath) {
    const relativePath = path.relative(repoRoot, sourcePath).replace(/\\/g, '/');
    const gitResult = spawnSync('git', ['log', '-1', '--format=%cs', '--', relativePath], {
        cwd: repoRoot,
        encoding: 'utf8'
    });
    const gitDate = (gitResult.stdout || '').trim();
    if (gitResult.status === 0 && /^\d{4}-\d{2}-\d{2}$/.test(gitDate)) {
        return gitDate;
    }

    const stats = fs.statSync(sourcePath);
    return stats.mtime.toISOString().slice(0, 10);
}

function collectSitemapPages() {
    const files = fs.readdirSync(pugPath)
        .filter((file) => file.endsWith('.pug'))
        .filter((file) => !file.startsWith('_'))
        .sort((a, b) => {
            const order = ['index.pug', 'chongqing-lvdaidiao.pug', 'lvdaidiao-zulin.pug', 'sichuan-lvdaidiao.pug', 'chongqing-diaoche-chuzu.pug', 'lifting-plan.pug'];
            const ai = order.indexOf(a);
            const bi = order.indexOf(b);
            if (ai !== -1 || bi !== -1) {
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            }
            return a.localeCompare(b);
        });

    return files.map((file) => {
        const loc = file === 'index.pug' ? '/' : `/${file.replace(/\.pug$/, '.html')}`;
        const isHome = file === 'index.pug';
        const isCoreSeo = ['chongqing-lvdaidiao.pug', 'lvdaidiao-zulin.pug', 'sichuan-lvdaidiao.pug', 'chongqing-diaoche-chuzu.pug'].includes(file);
        return {
            loc,
            source: path.join(pugPath, file),
            priority: isHome ? '1.0' : (isCoreSeo ? '0.9' : '0.8'),
            changefreq: isHome || isCoreSeo ? 'weekly' : 'monthly'
        };
    });
}

function writeRobots() {
    const lines = [
        'User-agent: *',
        'Allow: /',
        '',
        '# Public static pages may be crawled by search engines.',
        '# Build with SITE_URL set to generate the production sitemap URL.',
    ];

    if (siteUrl) {
        lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
    } else {
        lines.push('# Sitemap: https://example.com/sitemap.xml');
    }

    fs.writeFileSync(path.join(distPath, 'robots.txt'), `${lines.join('\n')}\n`, 'utf8');
}

function renderUrl(page, baseUrl) {
    return `    <url>\n` +
        `        <loc>${baseUrl}${page.loc}</loc>\n` +
        `        <lastmod>${getLastMod(page.source)}</lastmod>\n` +
        `        <changefreq>${page.changefreq}</changefreq>\n` +
        `        <priority>${page.priority}</priority>\n` +
        `    </url>`;
}

function writeSitemap() {
    const sitemapPages = collectSitemapPages();
    if (!siteUrl) {
        const sitemapPath = path.join(distPath, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
            fs.unlinkSync(sitemapPath);
        }
        const urls = sitemapPages.map((page) => renderUrl(page, 'https://example.com')).join('\n');
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
    const urls = sitemapPages.map((page) => renderUrl(page, siteUrl)).join('\n');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${urls}\n` +
        `</urlset>\n`;
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap, 'utf8');
}

ensureDist();
writeRobots();
writeSitemap();
