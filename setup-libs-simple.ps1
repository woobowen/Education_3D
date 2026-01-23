# Three.js Libraries Setup Script
Write-Host "========================================"
Write-Host "Three.js Local Setup Tool"
Write-Host "========================================"
Write-Host ""

# Create directory
$libsPath = "d:\Education_3D\backend\public\libs"
Write-Host "Creating directory: $libsPath"
New-Item -ItemType Directory -Force -Path $libsPath | Out-Null
Write-Host "Directory created successfully"
Write-Host ""

# File list
$files = @(
    @{
        Name = "three.min.js"
        Url = "https://unpkg.com/three@0.128.0/build/three.min.js"
    },
    @{
        Name = "OrbitControls.js"
        Url = "https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js"
    },
    @{
        Name = "tween.umd.js"
        Url = "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js"
    }
)

Write-Host "Downloading Three.js libraries..."
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    $outputPath = Join-Path $libsPath $file.Name
    Write-Host "[$($successCount + $failCount + 1)/$($files.Count)] Downloading: $($file.Name)"
    
    try {
        Invoke-WebRequest -Uri $file.Url -OutFile $outputPath -UseBasicParsing -TimeoutSec 30
        
        if ((Test-Path $outputPath) -and (Get-Item $outputPath).Length -gt 0) {
            $fileSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
            Write-Host "  Success ($fileSize KB)"
            $successCount++
        } else {
            Write-Host "  Failed: File is empty"
            $failCount++
        }
    } catch {
        Write-Host "  Failed: $($_.Exception.Message)"
        $failCount++
    }
    
    Write-Host ""
}

# Create CSS2DRenderer.js
Write-Host "[$($successCount + $failCount + 1)/4] Creating CSS2DRenderer.js"
$css2dPath = Join-Path $libsPath "CSS2DRenderer.js"

# CSS2DRenderer content
$css2dContent = 'class CSS2DObject {
    constructor(element) {
        this.element = element;
        this.element.style.position = "absolute";
        this.element.style.pointerEvents = "auto";
        this.element.style.userSelect = "none";
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        this.scale = new THREE.Vector3(1, 1, 1);
        this.parent = null;
    }
}

class CSS2DRenderer {
    constructor() {
        this.domElement = document.createElement("div");
        this.domElement.style.overflow = "hidden";
        this._width = 0;
        this._height = 0;
        this._widthHalf = 0;
        this._heightHalf = 0;
        this._cache = { objects: new WeakMap() };
    }

    setSize(width, height) {
        this._width = width;
        this._height = height;
        this._widthHalf = this._width / 2;
        this._heightHalf = this._height / 2;
        this.domElement.style.width = width + "px";
        this.domElement.style.height = height + "px";
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
                    element.style.display = "";
                    element.style.transform = 
                        "translate(-50%, -50%) translate(" + 
                        (vector.x * this._widthHalf + this._widthHalf) + "px," + 
                        (-(vector.y * this._heightHalf) + this._heightHalf) + "px)";
                } else {
                    element.style.display = "none";
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

if (typeof window !== "undefined") {
    window.CSS2DObject = CSS2DObject;
    window.CSS2DRenderer = CSS2DRenderer;
}

if (typeof THREE !== "undefined") {
    THREE.CSS2DObject = CSS2DObject;
    THREE.CSS2DRenderer = CSS2DRenderer;
}'

try {
    [System.IO.File]::WriteAllText($css2dPath, $css2dContent, [System.Text.Encoding]::UTF8)
    $fileSize = [math]::Round((Get-Item $css2dPath).Length / 1KB, 2)
    Write-Host "  Success ($fileSize KB)"
    $successCount++
} catch {
    Write-Host "  Failed: $($_.Exception.Message)"
    $failCount++
}

Write-Host ""
Write-Host "========================================"
Write-Host "Complete!"
Write-Host "  Success: $successCount files"
Write-Host "  Failed: $failCount files"
Write-Host "========================================"
Write-Host ""

if ($successCount -ge 3) {
    Write-Host "Setup successful!"
    Write-Host ""
    Write-Host "Files location: $libsPath"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Backend has been configured"
    Write-Host "2. Restart backend service (Ctrl+C then npm run dev)"
    Write-Host "3. Open test-local-libs.html in browser"
} else {
    Write-Host "Some files failed to download"
    Write-Host "Please check network connection"
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
