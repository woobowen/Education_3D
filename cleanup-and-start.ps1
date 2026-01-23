# EduVibe 3D - 清理并启动脚本
# 用途：清理所有占用的端口，然后启动项目

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EduVibe 3D - 清理并启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 清理占用的开发端口
Write-Host "[1/4] 清理占用的端口..." -ForegroundColor Yellow
$ports = @(3000, 5173, 5174, 5175)
$cleanedPorts = @()

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($process in $processes) {
                Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
                $cleanedPorts += $port
                Write-Host "  ✓ 已关闭占用端口 $port 的进程 $process" -ForegroundColor Green
            }
        }
    }
    catch {
        # 忽略错误
    }
}

if ($cleanedPorts.Count -eq 0) {
    Write-Host "  ✓ 所有端口都是空闲的" -ForegroundColor Green
}

Start-Sleep -Seconds 1

# 2. 清理 node_modules 中的缓存（可选）
Write-Host ""
Write-Host "[2/4] 检查缓存..." -ForegroundColor Yellow
$cacheItems = @(
    "backend\.turbo",
    "frontend\.turbo",
    "backend\dist",
    "frontend\dist"
)

foreach ($item in $cacheItems) {
    $fullPath = Join-Path $PSScriptRoot $item
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ 已清理: $item" -ForegroundColor Green
    }
}

Write-Host "  ✓ 缓存检查完成" -ForegroundColor Green

# 3. 检查 .env 文件
Write-Host ""
Write-Host "[3/4] 检查配置..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ✓ .env 文件存在" -ForegroundColor Green
} else {
    Write-Host "  ⚠ 警告: .env 文件不存在，请先配置！" -ForegroundColor Red
    Write-Host "  提示: 复制 .env.example 为 .env 并填入 API Key" -ForegroundColor Yellow
    exit 1
}

# 4. 启动项目
Write-Host ""
Write-Host "[4/4] 启动项目..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  准备启动前端和后端..." -ForegroundColor Cyan
Write-Host "  后端: http://localhost:3000" -ForegroundColor Green
Write-Host "  前端: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 启动项目
npm run dev
