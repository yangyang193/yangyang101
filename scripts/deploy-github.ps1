# 发布到已有仓库 yangyang101（GitHub Pages 不改地址）
# 需先执行：gh auth login
$ErrorActionPreference = "Stop"
$owner = "yangyang193"
$repo = "yangyang101"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$git = Join-Path $root ".tools\MinGit\cmd\git.exe"
if (-not (Test-Path $git)) {
  $git = "git"
}

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { throw "未找到 GitHub CLI，请先安装：winget install GitHub.cli" }

& $gh auth status

$remoteUrl = "https://github.com/$owner/$repo.git"
$existing = & $git remote get-url origin 2>$null
if ($existing) {
  & $git remote set-url origin $remoteUrl
} else {
  & $git remote add origin $remoteUrl
}

& $git fetch origin main
$hasMerge = $false
try {
  & $git merge origin/main --allow-unrelated-histories --no-edit -m "merge: 合并 yangyang101 现有内容"
  $hasMerge = $true
} catch {
  Write-Warning "自动合并失败，请手动解决冲突后：git add -A ; git commit ; git push -u origin main"
  throw
}

& $git add -A
$status = & $git status --porcelain
if ($status) {
  & $git -c user.name=$owner -c user.email="243399808+$owner@users.noreply.github.com" commit -m "feat: 贝焙面包公开菜单站点（Pages 根目录）"
}

& $git push -u origin main

Write-Host ""
Write-Host "公开链接（1～3 分钟生效）：https://$owner.github.io/$repo/"
Write-Host "请在仓库 Settings → Pages 确认：Branch = main，Folder = / (root)"
Write-Host "根目录 index.html 将作为首页；仓库内 python 等旧文件会保留。"
