class CSS2DObject {
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
}