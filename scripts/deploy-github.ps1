# 一键发布到 GitHub Pages（需先执行 gh auth login）
$ErrorActionPreference = "Stop"
$repo = "beipei-bakery"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$git = Join-Path $root ".tools\MinGit\cmd\git.exe"
if (-not (Test-Path $git)) { throw "未找到 Git，请先运行 MinGit 下载步骤或安装 Git for Windows" }

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { throw "未找到 GitHub CLI，请先安装：winget install GitHub.cli" }

& $gh auth status
if (-not ((& $gh repo view "yangyang193/$repo" 2>$null))) {
  & $gh repo create "yangyang193/$repo" --public --description "贝焙面包公开产品菜单" --confirm
}

if (-not (Test-Path ".git")) { & $git init -b main }
$remote = (& $git remote get-url origin 2>$null)
if (-not $remote) {
  & $git remote add origin "https://github.com/yangyang193/$repo.git"
}

& $git add -A
& $git -c user.name="yangyang193" -c user.email="243399808+yangyang193@users.noreply.github.com" commit -m "update: 菜单站点" 2>$null
& $git push -u origin main

& $gh api repos/yangyang193/$repo/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/ 2>$null
Write-Host "公开链接（稍等 1～3 分钟生效）：https://yangyang193.github.io/$repo/"
