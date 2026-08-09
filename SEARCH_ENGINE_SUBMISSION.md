# 搜索引擎收录与提交清单

## 当前结论

- 线上首页允许搜索引擎抓取，未发现 `noindex`、robots 禁止或 Cloudflare 人机验证拦截。
- `https://www.mxzulin.com/` 已 301 跳转到 `https://mxzulin.com/`，canonical 统一使用根域名。
- 生产环境 `sitemap.xml` 已包含首页、吊装选型页和 10 个真实 SEO 落地页，共 12 个 URL。
- Bing 已收录说明网站具备基本可抓取性。其他搜索引擎未收录，更可能是尚未验证站点、未主动提交、页面数量少或抓取周期较慢，而不是代码被统一屏蔽。

## 2026-08-10 平台状态

- Cloudflare Pages 部署成功，12 个页面全部返回 HTTP 200。
- `www.mxzulin.com` 正常 301 跳转到 `mxzulin.com`。
- Baiduspider、Sogou web spider 和 360Spider 均可访问首页，没有服务器或 Cloudflare 拦截。
- GitHub Variable `BAIDU_SITE=https://mxzulin.com` 已配置；`BAIDU_TOKEN` 必须在百度账号登录并完成站点验证后获取。
- 百度搜索资源平台、搜狗资源平台和 360 站长平台都要求账号登录后才能添加站点、完成所有权验证并提交 sitemap。当前浏览器没有这些平台的登录状态，尚未完成平台内提交。

## 代码侧约束

- 所有可索引页面必须返回 HTTP 200，并包含唯一的 `title`、description、H1 和 canonical。
- 页面必须有真实独立内容和站内链接，不创建自动跳转首页的关键词门页。
- `robots.txt` 允许常规搜索引擎抓取，并声明绝对地址的 sitemap。
- sitemap 只放 canonical、可索引且希望进入搜索结果的 URL。
- sitemap 的 `lastmod` 必须反映页面内容真实变更日期，不在每次部署时伪造全部页面更新时间。
- 正式域名统一为 `https://mxzulin.com`，不同时提交 `www`、Pages 默认域名或重复 `.html`/无后缀地址。
- Cloudflare Pages 会把 `.html` 地址 308 到无后缀地址，因此 canonical、sitemap 和站内链接统一使用无后缀生产 URL。
- 搜索引擎验证码可以写入页面或根目录验证文件；Token、API Key 必须放在 GitHub Secrets，禁止提交到仓库。

## GitHub Actions 自动化

部署工作流会在 Cloudflare Pages 发布成功后尝试执行百度普通收录主动推送。

在 GitHub 仓库 `Settings > Secrets and variables > Actions` 中配置：

| 类型 | 名称 | 值 |
| --- | --- | --- |
| Variable | `BAIDU_SITE` | `https://mxzulin.com` |
| Secret | `BAIDU_TOKEN` | 百度搜索资源平台为该站点提供的普通收录推送 Token |

未配置时工作流会跳过百度推送。Token 不得写入 Markdown、JavaScript、HTML、提交记录或聊天截图。

## GitHub 方案核对结论

- GitHub Marketplace 的 `generate-sitemap` 建议 `actions/checkout` 使用 `fetch-depth: 0`，再按每个页面最后一次提交日期生成真实 `<lastmod>`。本项目已采用相同原则，但保留现有 Node 构建脚本，不额外引入 Action。
- GitHub 上的百度提交示例通常从 sitemap 提取 URL，再提交到百度普通收录接口。本项目实现了同类流程，并额外校验所有 URL 必须属于 `BAIDU_SITE`，Token 只从 Secret 读取。
- GitHub 上的 IndexNow 工具适合通知 Bing 及其他协议参与方，但不能代替 Google Search Console、百度普通收录、搜狗或 360 站长平台。本项目当前 Bing 已收录，因此本轮不增加 IndexNow 密钥和重复提交流程。
- GitHub 示例只解决构建和通知自动化，不会直接提高排名，也不能保证任何搜索引擎收录。

## 各平台操作

### Google Search Console

1. 添加 `mxzulin.com` 域名资源并按要求增加 DNS TXT 验证记录。
2. 提交 `https://mxzulin.com/sitemap.xml`。
3. 使用“网址检查”请求首页和核心落地页编入索引。

### Bing Webmaster Tools

1. 保留当前已验证站点。
2. 新页面部署后重新提交 sitemap。
3. 用 URL Inspection 检查 canonical、抓取状态和索引状态。
4. Bing 已收录时无需频繁手工重复提交同一 URL。

### 百度搜索资源平台

1. 添加并验证 `https://mxzulin.com`，验证的协议和主机必须与 canonical 一致。
2. 在“普通收录”中提交 sitemap；如平台暂未开放 sitemap 权限，使用 API 主动推送。
3. 把平台显示的推送 Token 存入 GitHub Secret `BAIDU_TOKEN`。
4. 部署后查看 GitHub Actions 的百度提交步骤，以及平台反馈的抓取、索引和配额。

### 搜狗搜索

1. 在搜狗网站收录入口提交 `https://mxzulin.com/`。
2. 如账号开放站长或开放平台权限，再提交 sitemap。
3. 搜狗没有本项目可依赖的通用公开推送 API，因此保留手工提交和日志检查流程。

### 360 搜索

1. 在 360 站长平台添加并验证站点。
2. 提交首页和 `https://mxzulin.com/sitemap.xml`。
3. 在平台检查 robots、抓取异常和索引量。

### 神马搜索

1. 在神马站长平台添加并验证移动站点。
2. 提交 sitemap，并重点检查手机端可访问性、页面加载和固定咨询栏是否遮挡正文。

## 每次发布后的检查

1. 打开首页、核心落地页、`robots.txt` 和 `sitemap.xml`，确认均返回 200。
2. 确认 `www` 仍然 301 到根域名，Pages 默认域名未被用作 canonical。
3. 确认 GitHub Actions 的 Cloudflare 部署成功；百度提交步骤允许因未配置或平台限额跳过，但需要查看原因。
4. 将 sitemap 重新提交到已验证的站长平台，不要每天重复提交未变化的 URL。
5. 在 `CHANGE_HISTORY.md` 记录代码、页面、部署和提交状态。

## 参考资料

- [Google：构建并提交 sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Bing：Sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)
- [Bing：URL Submission 与 IndexNow](https://www.bing.com/webmasters/help/URL-Submission-62f2860b)
- [百度搜索资源平台：普通收录](https://ziyuan.baidu.com/linksubmit/index)
- [搜狗搜索：提交网站](https://help.sogou.com/submit.html)
- [360 搜索：网站收录](https://info.so.360.cn/site_submit.html)
- [GitHub Marketplace：generate-sitemap](https://github.com/marketplace/actions/generate-sitemap)
- [GitHub 示例：从 sitemap 向百度提交 URL](https://gist.github.com/knktc/846950067e60a92612c1befbe4213a32)
- [GitHub：IndexNow sitemap submitter](https://github.com/viv1/indexnow-submitter)
