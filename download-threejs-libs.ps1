# Three.js 庫下載腳本
# 用於將 Three.js 資源本地化，避免 CDN 問題

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Three.js 庫本地化工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 創建目錄
$libsPath = "d:\Education_3D\backend\public\libs"
Write-Host "創建目錄: $libsPath" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $libsPath | Out-Null

# 定義文件列表（使用 r119 版本）
$files = @(
    @{
        Name = "three.min.js"
        Url = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r119/three.min.js"
    },
    @{
        Name = "OrbitControls.js"
        Url = "https://cdn.jsdelivr.net/npm/three@0.119.0/examples/js/controls/OrbitControls.js"
    },
    @{
        Name = "CSS2DRenderer.js"
        Url = "https://cdn.jsdelivr.net/npm/three@0.119.0/examples/js/renderers/CSS2DRenderer.js"
    },
    @{
        Name = "tween.umd.js"
        Url = "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js"
    }
)

Write-Host "開始下載 Three.js 庫文件..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    $outputPath = Join-Path $libsPath $file.Name
    Write-Host "下載: $($file.Name)" -ForegroundColor Cyan
    Write-Host "  來源: $($file.Url)" -ForegroundColor Gray
    Write-Host "  目標: $outputPath" -ForegroundColor Gray
    
    try {
        # 使用 Invoke-WebRequest 下載文件
        Invoke-WebRequest -Uri $file.Url -OutFile $outputPath -UseBasicParsing
        
        # 檢查文件是否存在且不為空
        if ((Test-Path $outputPath) -and (Get-Item $outputPath).Length -gt 0) {
            $fileSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
            Write-Host "  ✓ 成功 ($fileSize KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ 失敗: 文件為空或不存在" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ✗ 失敗: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "下載完成" -ForegroundColor Cyan
Write-Host "  成功: $successCount 個文件" -ForegroundColor Green
Write-Host "  失敗: $failCount 個文件" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($successCount -eq $files.Count) {
    Write-Host "🎉 所有文件下載成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 更新 backend/src/services/promptEngine.ts" -ForegroundColor White
    Write-Host "   將 CDN 路徑改為: /libs/filename.js" -ForegroundColor White
    Write-Host ""
    Write-Host "2. 確保後端提供靜態文件服務：" -ForegroundColor White
    Write-Host "   app.use(express.static('public'))" -ForegroundColor White
    Write-Host ""
    Write-Host "3. 重啟後端服務" -ForegroundColor White
} else {
    Write-Host "⚠️ 部分文件下載失敗" -ForegroundColor Yellow
    Write-Host "請檢查網絡連接或手動下載失敗的文件" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意鍵退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
