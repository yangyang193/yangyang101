# 创作者工作台 · 身份选择与发布

零依赖静态网页：选择身份、设定人设、选标签、发作品、加入公会、购买流量。界面由单一数据源渲染，所有操作通过事件总线进入处理器。

## 本地打开

不要直接双击 `index.html`（`file://` 下 ES Module 会被浏览器拦截）。在仓库根目录启动任意静态服务器，例如：

```bash
python3 -m http.server 4173
```

或在已安装 Node.js 时：

```bash
npx --yes serve .
```

浏览器访问 `http://localhost:4173`（或 `serve` 提示的端口）。

## GitHub Pages

1. 把本仓库推到 GitHub。
2. 打开仓库 **Settings → Pages**。
3. Source 选择 **Deploy from a branch**，Branch 选 `master`（或 `main`），文件夹选 `/`（根目录）。
4. 保存后访问 `https://<用户名>.github.io/<仓库名>/`。

每个人的金币、作品和身份都存在自己浏览器的 `localStorage` 中，互不影响。

## 架构

- `js/store.js`：唯一状态，写入 `localStorage`
- `js/eventBus.js`：`on` / `emit`
- `js/events.js`：事件名常量
- `js/handlers.js`：业务规则（金币、加成、校验）
- `js/render.js`：按 `state.ui.view` 画界面
- `js/app.js`：把点击/提交转成事件

刷新页面后身份、作品与金币会保留。侧栏「重置数据」可清空本地状态。
