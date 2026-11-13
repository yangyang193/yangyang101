# 仅把蛋糕店站点推到 gh-pages（线上实际生效分支），不碰 main 里的 python 项目
# 先：gh auth login
$ErrorActionPreference = "Stop"
$owner = "yangyang193"
$repo = "yangyang101"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) { $git = Join-Path $root ".tools\MinGit\cmd\git.exe" }
$gh = "C:\Program Files\GitHub CLI\gh.exe"
& $gh auth status

$paths = @("index.html", "css", "js", "data", "assets/cover.jpg", "assets/products/display", ".gitignore")
& $git fetch origin gh-pages 2>$null
& $git checkout --orphan gh-pages-deploy-tmp 2>$null
& $git reset --hard
foreach ($p in $paths) {
  if (Test-Path (Join-Path $root $p)) { & $git checkout HEAD -- $p 2>$null; & $git add $p }
}
# 从工作区直接 add（若上面 checkout 失败）
foreach ($p in $paths) {
  if (Test-Path (Join-Path $root $p)) { & $git add $p }
}

& $git -c user.name=$owner -c user.email="243399808+$owner@users.noreply.github.com" `
  commit -m "feat: 贝焙面包公开菜单（仅蛋糕店站点）"
& $git push origin gh-pages-deploy-tmp:gh-pages --force

Write-Host "线上地址：https://$owner.github.io/$repo/"
