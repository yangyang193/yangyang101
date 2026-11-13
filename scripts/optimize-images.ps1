# 将 raw PNG 压成适合手机展示的 JPEG（需 Windows 自带 GDI+）
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$rawDir = Join-Path $root "assets\products\raw"
$outDir = Join-Path $root "assets\products\display"
$dataPath = Join-Path $root "data\products.json"
$maxEdge = 860
$quality = 82L

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Save-ResizedJpeg {
  param([string]$InputPath, [string]$OutputPath, [int]$MaxEdge, [long]$JpegQuality)
  $img = [System.Drawing.Image]::FromFile($InputPath)
  try {
    $scale = [Math]::Min(1.0, $MaxEdge / [double][Math]::Max($img.Width, $img.Height))
    $nw = [Math]::Max(1, [int][Math]::Round($img.Width * $scale))
    $nh = [Math]::Max(1, [int][Math]::Round($img.Height * $scale))
    $bmp = New-Object System.Drawing.Bitmap $nw, $nh
  try {
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $g.Dispose()
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, $JpegQuality)
    $bmp.Save($OutputPath, $codec, $encParams)
  } finally {
    $bmp.Dispose()
  }
  } finally {
    $img.Dispose()
  }
}

$totalIn = 0L
$totalOut = 0L
Get-ChildItem (Join-Path $rawDir "*.png") | ForEach-Object {
  $outName = $_.BaseName + ".jpg"
  $outPath = Join-Path $outDir $outName
  Save-ResizedJpeg -InputPath $_.FullName -OutputPath $outPath -MaxEdge $maxEdge -JpegQuality $quality
  $totalIn += $_.Length
  $totalOut += (Get-Item $outPath).Length
}

$coverPath = Join-Path $root "assets\cover.jpg"
if (Test-Path $coverPath) {
  $coverTmp = Join-Path $root "assets\cover.opt.jpg"
  Save-ResizedJpeg -InputPath $coverPath -OutputPath $coverTmp -MaxEdge $maxEdge -JpegQuality 85
  Move-Item -Force $coverTmp $coverPath
}

$json = Get-Content $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($cat in $json.categories) {
  foreach ($item in $cat.items) {
    $item.image = $item.image -replace '\.png$', '.jpg'
  }
}
$json | ConvertTo-Json -Depth 10 | Set-Content $dataPath -Encoding UTF8

Write-Host ("Done: {0} images, {1:N2} MB -> {2:N2} MB" -f ((Get-ChildItem $outDir *.jpg).Count), ($totalIn / 1MB), ($totalOut / 1MB))
