# EduVibe 3D - 仅清理脚本
# 用途：清理所有占用的端口和缓存，但不启动项目

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EduVibe 3D - 端口和缓存清理" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 清理占用的开发端口
Write-Host "正在清理占用的端口..." -ForegroundColor Yellow
$ports = @(3000, 5173, 5174, 5175, 8080, 4000, 5000)
$cleanedCount = 0

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($process in $processes) {
                $processInfo = Get-Process -Id $process -ErrorAction SilentlyContinue
                if ($processInfo) {
                    Write-Host "  关闭端口 $port - 进程: $($processInfo.Name) (PID: $process)" -ForegroundColor Yellow
                    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
                    $cleanedCount++
                    Start-Sleep -Milliseconds 200
                }
            }
        }
    }
    catch {
        # 忽略错误
    }
}

Write-Host ""
if ($cleanedCount -gt 0) {
    Write-Host "✓ 已清理 $cleanedCount 个进程" -ForegroundColor Green
} else {
    Write-Host "✓ 所有端口都是空闲的" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  清理完成！现在可以启动项目了" -ForegroundColor Green
Write-Host "  运行: npm run dev" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
