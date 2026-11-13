# 贝焙面包 · 公开产品菜单

暖色系翻页电子菜单，封面使用门店海报，品类数据来自产品表（甜品类 18 款、蛋糕类 53 款）。

## 本地预览

在项目目录执行：

```bash
npx --yes serve .
```

浏览器打开提示的地址即可。

## 发布到 GitHub Pages（公开链接）

账号 **yangyang193**，建议仓库名 **beipei-bakery**。

在 PowerShell 中：

```powershell
gh auth login
cd "c:\Users\Administrator\Documents\蛋糕店网页"
.\scripts\deploy-github.ps1
```

成功后公开地址为：

**https://yangyang193.github.io/beipei-bakery/**

若 Pages 未自动开启，到仓库 **Settings → Pages** 选择分支 `main`、目录 `/ (root)`。
