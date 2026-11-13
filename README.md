# 贝焙面包 · 公开产品菜单

暖色系翻页电子菜单，封面使用门店海报，品类数据来自产品表（甜品类 18 款、蛋糕类 53 款）。

## 本地预览

```bash
npx --yes serve .
```

## 发布到已有 GitHub Pages（不新建仓库）

使用账号 **yangyang193** 下已有仓库 **yangyang101**，公开地址保持为：

**https://yangyang193.github.io/yangyang101/**

PowerShell：

```powershell
gh auth login
cd "c:\Users\Administrator\Documents\蛋糕店网页"
.\scripts\deploy-github.ps1
```

脚本会把本项目的 `index.html`、`assets`、`css`、`js`、`data` 推到仓库 **根目录**，并与远程已有的 `python/` 等内容合并。

请在 GitHub 仓库 **Settings → Pages** 中确认：**Branch = main**，**Folder = / (root)**。

说明：根目录 `index.html` 会作为网站首页；原先同地址上的其他首页若也在根目录，会被新菜单替换，`python` 文件夹仍留在仓库中。
