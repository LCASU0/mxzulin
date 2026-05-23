# 重庆敏祥吊装租赁责任有限公司官网

基于 StartBootstrap Agency 模板改造的一页式中文企业官网，面向起重机租赁、履带式起重机租赁、汽车式起重机租赁和吊装租赁获客场景。

当前页面已重点覆盖“重庆履带吊”“重庆吊车”“重庆吊车出租”“重庆履带吊租赁”等客户常用搜索词，并在正文中同时保留“履带式起重机”“汽车式起重机”等专业叫法。

## 需求文档

当前官网需求统一记录在 [`REQUIREMENTS.md`](./REQUIREMENTS.md)。

以后公司信息、联系方式、SEO、页面结构、logo、域名或部署策略发生变化时，需要同步更新该文件。

## 本地运行

```bash
npm install
npm start
```

启动后访问：

```text
http://localhost:3000
```

只构建静态文件：

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 搜索引擎优化

已针对 Google、Bing、百度、搜狗、360 等搜索引擎做基础优化：

- 页面标题和描述重点覆盖“重庆履带吊”“重庆吊车”“重庆吊车出租”“重庆履带吊租赁”等客户常用词。
- 页面正文使用“常用叫法 + 专业名称”，例如“重庆履带吊”对应“履带式起重机”，“重庆吊车”对应“汽车式起重机”。
- 图片均保留描述性 `alt`，方便搜索引擎理解图片内容。
- 页面包含 LocalBusiness 结构化数据，便于 Bing、Google 等识别公司、电话、地址和主营服务。
- 构建时会生成 `robots.txt`，允许搜索引擎抓取。

正式部署时建议带上域名生成 sitemap：

```powershell
$env:SITE_URL="https://你的正式域名"
npm run build
```

生成后会在 `dist/` 中得到 `robots.txt` 和 `sitemap.xml`。如果未设置 `SITE_URL`，项目会生成 `sitemap.example.xml` 作为替换模板，避免把错误域名提交给搜索引擎。

上线后建议提交：

- Bing Webmaster Tools：提交站点和 `sitemap.xml`。
- 百度搜索资源平台：提交站点和 sitemap。
- 搜狗站长平台：提交 sitemap，并检查快照更新。
- 360 搜索站长平台：提交站点和 sitemap。

## 信息维护

公司信息集中在 `src/pug/index.pug` 顶部的 `companyInfo` 配置中：

- `primaryPhone`：主联系电话和主要复制号码
- `secondaryPhone`：备用联系电话
- `wechatPrimary`：主要微信号
- `wechatSecondary`：备用微信号
- `address`：公司地址
- `serviceArea`：服务区域
- `qrcode`：微信二维码路径

电话和微信按钮交互逻辑在 `src/js/scripts.js`。

## 图片替换

后续替换真实照片时，保持文件名不变即可：

- 首页背景：`src/assets/img/hero/hero-crane.jpg`
- 设备图片：`src/assets/img/equipment/`
- 工程案例：`src/assets/img/portfolio/portfolio-*.jpg`
- 微信二维码：`src/assets/img/contact/wechat-qrcode.jpg`

替换后运行 `npm run build`，新的图片会复制到 `dist/`。

## 部署

把 `dist/` 目录内的所有文件上传到服务器网站根目录，或部署到任意静态托管平台。入口文件是 `dist/index.html`。

## 自动部署

仓库已配置 GitHub Actions：`.github/workflows/deploy-cloudflare-pages.yml`。

每次 push 到 `main` 分支时会自动：

1. 安装依赖
2. 使用 `SITE_URL=https://mxzulin.com` 构建静态文件
3. 创建或复用 Cloudflare Pages 项目 `mxzulin`
4. 部署 `dist/` 到 Cloudflare Pages
5. 尝试把自定义域名 `mxzulin.com` 绑定到 Pages 项目

GitHub Secrets 需要包含：

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

GitHub Variables 需要包含：

- `SITE_URL=https://mxzulin.com`

## 模板来源

原始模板来自 StartBootstrap/startbootstrap-agency，模板代码遵循 MIT License。
