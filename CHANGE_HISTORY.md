# 历史更改记录

本文件记录项目实际实现层面的变更。`REQUIREMENTS.md` 负责描述当前有效需求，本文件负责回答“何时改了什么、影响哪里、如何验证、是否部署”。

## 强制记录规则

- 前端、服务端脚本、构建流程、部署、DNS、SEO 和文档变更都必须在完成前追加记录。
- 每条记录至少包含日期、类别、影响文件或模块、变更结果、验证方式和部署状态。
- 同一天同一任务可以合并记录，但不能只写“优化”“修复”等无法追溯的描述。
- 不得记录 API Token、密码、验证码、Secret 明文或其他凭据。
- 仅修改需求但尚未实现时，更新 `REQUIREMENTS.md`；代码已经变化时，同时更新本文件。
- 未推送到生产环境的变更必须明确标注“本地待部署”，不能写成已上线。

## 记录

| 日期 | 类别 | 影响范围 | 变更结果 | 验证 | 部署状态 |
| --- | --- | --- | --- | --- | --- |
| 2026-05-22 | 前端 | 首页、设备、案例、联系区域 | 将 Agency 模板改为中文一页式企业官网，删除联系表单，改为电话和微信直接咨询。 | 本地页面与移动端交互检查 | 已部署 |
| 2026-05-22 | 部署 | GitHub Actions、Cloudflare Pages | 建立 `main` 分支推送后自动构建并部署到 Cloudflare Pages 的流程。 | GitHub Actions 部署记录 | 已部署 |
| 2026-05-24 | 域名 | `mxzulin.com`、`www.mxzulin.com` | 确定根域名为唯一 canonical，`www` 使用 301 跳转到根域名。 | HTTP 状态与跳转检查 | 已配置 |
| 2026-05-26 | 前端 | `lifting-plan`、选型脚本 | 新增起重机吨位初步选择页，修复固定导航遮挡和提交后刷新问题。 | 本地生成建议、移动端布局检查 | 已部署 |
| 2026-05-27 | 前端资源 | Hero、设备图、工程案例图 | 替换项目图片并优化六个案例详情文案，去掉占位式描述。 | 图片路径、尺寸和弹窗检查 | 已部署 |
| 2026-06-30 | SEO | 首页 TDK、正文关键词 | 强化“重庆履带吊”“履带吊租赁”“四川履带吊”，缩短首页标题并保持自然正文。 | HTML 元信息与关键词分布检查 | 已部署 |
| 2026-08-10 | SEO | 10 个独立落地页、首页内链 | 增加地区词、业务词和常用吨位的真实内容页；每页保留独立 TDK、canonical、结构化数据、正文、FAQ、内链和联系方式，不使用自动跳转门页。 | 静态 HTML、canonical、内链和重复度检查 | 已部署：`96511ee` |
| 2026-08-10 | 构建 | `scripts/build-seo-assets.js`、GitHub Actions | sitemap 自动发现顶层 Pug 页面；`lastmod` 优先采用 Git 最后提交日期；修复 robots 模板乱码；Actions 使用完整 Git 历史。 | 生产域名构建与 XML 检查 | 已部署：`96511ee` |
| 2026-08-10 | SEO 自动化 | `scripts/submit-baidu.js`、GitHub Actions | 增加部署后可选的百度普通收录主动推送；凭据仅从 GitHub Secret 读取，未配置时自动跳过，提交失败不影响 Cloudflare 部署。 | 本地参数校验与脚本静态检查 | 已部署：`96511ee`；Token 待配置 |
| 2026-08-10 | 文档 | `REQUIREMENTS.md`、`README.md`、`SEARCH_ENGINE_SUBMISSION.md` | 建立强制变更记录约束，并整理 Google、Bing、百度、搜狗、360、神马的验证和提交步骤。 | 文档交叉链接检查 | 已部署：`96511ee` |
| 2026-08-10 | SEO 平台配置 | GitHub Actions Variables | 新增 `BAIDU_SITE=https://mxzulin.com`；百度推送 Token 仍需完成百度站点验证后保存为 `BAIDU_TOKEN` Secret。 | `gh variable list` | 变量已配置，Token 待平台登录 |
| 2026-08-10 | 部署 | GitHub Actions、Cloudflare Pages、`mxzulin.com` | 推送 `96511ee` 并完成 Cloudflare Pages 自动发布；生产域名、自定义域名和证书状态正常。 | Actions `31327780396` 成功；12 个页面均返回 200；`www` 301 到根域名 | 已部署 |
| 2026-08-10 | SEO 线上验证 | robots、sitemap、百度/搜狗/360 爬虫访问 | 生产 sitemap 已包含 12 个 URL；robots 返回 200 并声明正式 sitemap；Baiduspider、Sogou web spider、360Spider 均可获取首页。 | 生产 HTTP 与 User-Agent 请求检查 | 已验证 |
| 2026-08-10 | SEO 平台验证 | 百度、搜狗、360 站长平台 | 三个平台均要求登录后才能添加、验证站点和提交 sitemap；当前浏览器没有对应登录状态，因此未伪造“已提交”结果。 | 官方站点管理和登录页面检查 | 待账号登录 |
| 2026-08-10 | SEO URL 规范 | canonical、sitemap、站内链接 | 生产验证发现 Cloudflare Pages 会将 `.html` 永久重定向到无后缀 URL；统一改用最终返回 200 的无后缀地址，在首页补充 10 个真实落地页文本内链，并统一首页 canonical 与 sitemap 的根路径斜杠。 | 12 个 sitemap URL 全部返回 200；canonical 全部匹配；旧 `.html` 返回 308 | 已部署：`5b3aaba`；Actions `31329223448` |
| 2026-08-10 | SEO 生产验收 | `mxzulin.com`、Cloudflare Pages | 验证正式域名、Cloudflare 预览地址、robots、sitemap、`www` 跳转以及 Baiduspider、Sogou web spider、360Spider 访问状态。 | 正式与预览首页 200；robots 200；`www` 301；三类爬虫均 200 | 已验证 |
