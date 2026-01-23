# Three.js 本地化设置脚本（简化版）
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Three.js 本地化设置工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 创建目录
$libsPath = "d:\Education_3D\backend\public\libs"
Write-Host "创建目录: $libsPath" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $libsPath | Out-Null
Write-Host "✓ 目录已创建" -ForegroundColor Green
Write-Host ""

# 使用已知可用的 CDN 源（从测试中验证的）
$files = @(
    @{
        Name = "three.min.js"
        Url = "https://unpkg.com/three@0.128.0/build/three.min.js"
        Description = "Three.js 核心库 (r128)"
    },
    @{
        Name = "OrbitControls.js"
        Url = "https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js"
        Description = "轨道控制器（作为 THREE.OrbitControls）"
    },
    @{
        Name = "tween.umd.js"
        Url = "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js"
        Description = "动画补间库"
    }
)

Write-Host "开始下载库文件..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    $outputPath = Join-Path $libsPath $file.Name
    Write-Host "[$($successCount + $failCount + 1)/$($files.Count)] $($file.Description)" -ForegroundColor Cyan
    Write-Host "  文件: $($file.Name)" -ForegroundColor Gray
    
    try {
        Invoke-WebRequest -Uri $file.Url -OutFile $outputPath -UseBasicParsing -TimeoutSec 30
        
        if ((Test-Path $outputPath) -and (Get-Item $outputPath).Length -gt 0) {
            $fileSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
            Write-Host "  ✓ 下载成功 ($fileSize KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ 下载失败: 文件为空" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ✗ 下载失败: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# 创建 CSS2DRenderer.js（手动实现简化版）
Write-Host "[$($successCount + $failCount + 1)/4] 创建 CSS2DRenderer.js（自定义实现）" -ForegroundColor Cyan
$css2dPath = Join-Path $libsPath "CSS2DRenderer.js"
$css2dContent = @'
// CSS2DRenderer - 简化实现版本
// 用于在 3D 场景中渲染 2D HTML 标签

class CSS2DObject {
    constructor(element) {
        this.element = element;
        this.element.style.position = 'absolute';
        this.element.style.pointerEvents = 'auto';
        this.element.style.userSelect = 'none';
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        this.scale = new THREE.Vector3(1, 1, 1);
        this.parent = null;
    }
}

class CSS2DRenderer {
    constructor() {
        this.domElement = document.createElement('div');
        this.domElement.style.overflow = 'hidden';
        this._width = 0;
        this._height = 0;
        this._widthHalf = 0;
        this._heightHalf = 0;
        this._cache = {
            objects: new WeakMap()
        };
    }

    setSize(width, height) {
        this._width = width;
        this._height = height;
        this._widthHalf = this._width / 2;
        this._heightHalf = this._height / 2;
        this.domElement.style.width = width + 'px';
        this.domElement.style.height = height + 'px';
    }

    render(scene, camera) {
        const vector = new THREE.Vector3();
        const viewMatrix = camera.matrixWorldInverse;
        const projectionMatrix = camera.projectionMatrix;

        const renderObject = (object) => {
            if (object instanceof CSS2DObject) {
                vector.setFromMatrixPosition(object.matrixWorld || new THREE.Matrix4());
                vector.applyMatrix4(viewMatrix);
                vector.applyMatrix4(projectionMatrix);

                const element = object.element;
                
                if (vector.z > -1 && vector.z < 1) {
                    element.style.display = '';
                    element.style.transform = 
                        'translate(-50%, -50%) ' +
                        'translate(' + 
                        (vector.x * this._widthHalf + this._widthHalf) + 'px,' + 
                        (-(vector.y * this._heightHalf) + this._heightHalf) + 'px)';
                } else {
                    element.style.display = 'none';
                }

                if (!this._cache.objects.has(object)) {
                    this.domElement.appendChild(element);
                    this._cache.objects.set(object, {});
                }
            }

            if (object.children) {
                for (let i = 0; i < object.children.length; i++) {
                    renderObject(object.children[i]);
                }
            }
        };

        renderObject(scene);
    }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.CSS2DObject = CSS2DObject;
    window.CSS2DRenderer = CSS2DRenderer;
}

// 也可以通过 THREE 命名空间访问
if (typeof THREE !== 'undefined') {
    THREE.CSS2DObject = CSS2DObject;
    THREE.CSS2DRenderer = CSS2DRenderer;
}
'@

try {
    [System.IO.File]::WriteAllText($css2dPath, $css2dContent, [System.Text.Encoding]::UTF8)
    $fileSize = [math]::Round((Get-Item $css2dPath).Length / 1KB, 2)
    Write-Host "  ✓ 创建成功 ($fileSize KB)" -ForegroundColor Green
    $successCount++
} catch {
    Write-Host "  ✗ 创建失败: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "完成！" -ForegroundColor Cyan
Write-Host "  成功: $successCount 个文件" -ForegroundColor Green
Write-Host "  失败: $failCount 个文件" -ForegroundColor $(if ($failCount -gt 0) { 'Red' } else { 'Green' })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($successCount -ge 3) {
    Write-Host "🎉 本地化设置成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "文件位置: $libsPath" -ForegroundColor White
    Write-Host ""
    Write-Host "下一步（自动执行）：" -ForegroundColor Yellow
    Write-Host "1. 配置后端静态文件服务" -ForegroundColor White
    Write-Host "2. 更新 promptEngine.ts 使用本地路径" -ForegroundColor White
    Write-Host ""
    Write-Host "按任意键继续..." -ForegroundColor Gray
} else {
    Write-Host "⚠️ 部分文件处理失败" -ForegroundColor Yellow
    Write-Host "请检查网络连接" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "按任意键退出..." -ForegroundColor Gray
}

$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
'@
