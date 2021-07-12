import { AmbientLight, AnimationMixer, CanvasTexture, Clock, DirectionalLight, LinearMipMapLinearFilter, Mesh, MeshBasicMaterial, NearestFilter, Object3D, OrthographicCamera, PCFSoftShadowMap, PlaneGeometry, PointLight, RepeatWrapping, Scene, ShadowMaterial, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { degToRad } from "three/src/math/MathUtils";
import { ScreenCanvas } from "./ScreenCanvas";
import "./style.css";

const canvas = document.getElementById("c") as HTMLCanvasElement;

const scene = new Scene();

// Camera
const orthoCamera = new OrthographicCamera(-2, 2, 1, -1, 0, 2000);
orthoCamera.position.x = -0.1;
orthoCamera.position.y = 4;
orthoCamera.position.z = -5;
orthoCamera.zoom = 1000;
orthoCamera.lookAt(0, 0, .15);

const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.pixelRatio = devicePixelRatio > 2 ? 2 : devicePixelRatio;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

// Directional Light
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -0.3;
directionalLight.shadow.camera.right = 0.4;
directionalLight.shadow.camera.top = -0.2;
directionalLight.shadow.camera.bottom = 0.2;
directionalLight.position.z = 0.2;
directionalLight.position.set(0, 1, .2)
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Point Light
const pointLight1 = new PointLight(0x86C1CC, 0.5, 100);
pointLight1.position.set(0, 0, -0.15);
scene.add(pointLight1);


const pointLight2 = new PointLight(0x86C1CC, 0.5, 100);
pointLight2.position.set(0, 0, 0.15);
scene.add(pointLight2);

// Ambient light 
const ambLight = new AmbientLight(0x343434);
scene.add(ambLight);

// Plane
const planeGeo = new PlaneGeometry(10, 10);
const planeMat = new ShadowMaterial();
const plane = new Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
plane.rotateX(degToRad(-90));
scene.add(plane);

// Sreen texture
const canvas2d = document.createElement('canvas');
canvas2d.width = 1920 / 4;
canvas2d.height = 1080 / 4;
const screenCanvas = new ScreenCanvas(canvas2d);
const texture = new CanvasTexture(canvas2d);
texture.flipY = false;
texture.wrapS = RepeatWrapping;
texture.repeat.x = - 1;

// Gemotry 
const loader = new GLTFLoader();
let mixer: AnimationMixer;
let laptop: Object3D;
loader.load("/laptop.glb", (gltf) => {
    gltf.scene.traverse(obj => {
        if (obj.name === "Cube001") laptop = obj;
        if (obj.type === "Mesh") {
            obj.castShadow = true;
            if (obj.name == "Cube003") {
                (obj as any).material.alphaTest = 0.001;
                (obj as any).material.transparent = true;
                (obj as any).material.map.magFilter = NearestFilter;
                (obj as any).material.map.minFilter = LinearMipMapLinearFilter;
            }

            if (obj.name === "Screen") {
                const screenMat = new MeshBasicMaterial({ map: texture });
                (obj as any).material.dispose();
                (obj as any).material = screenMat;
            }
        }
    })
    scene.add(gltf.scene);

    canvas.classList.remove("hidden");
    document.getElementById("s").classList.add("hidden")
    mixer = new AnimationMixer(gltf.scene);
    gltf.animations.map(animation => mixer.clipAction(animation).play());

}, undefined, (err) => console.error(err));


function needResize() {
    const pixelRatio = devicePixelRatio > 2 ? 2 : devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;

    if (width !== canvas.width || height !== canvas.height) {
        renderer.setSize(width, height, false);
        return true;
    }
    return false;
}

// Event listenr of mouse postion relative to the center of the canvas multiped by 0.0001
let mouseAngle: number = 0;
window.addEventListener("mousemove", (ev) => {
    const box = canvas.getBoundingClientRect();
    mouseAngle = (ev.x - box.right + box.width / 2) * 0.0001;
}, { passive: true });
window.addEventListener("touchmove", (ev) => {
    const box = canvas.getBoundingClientRect();
    mouseAngle = (ev.touches[0].pageX - box.right + box.width / 2) / canvas.clientWidth * 2 * Math.PI / 16;
}, { passive: true });

let start = Date.now();
const clock = new Clock();

const animate = function () {
    requestAnimationFrame(animate);

    if (laptop) laptop.rotation.y = mouseAngle;

    const delay = 500;
    const current = Date.now();
    if (start + delay <= Date.now()) {
        screenCanvas.play();
        texture.needsUpdate = true
        start = current;
    }
    if (needResize()) {
        orthoCamera.left = (-canvas.clientWidth / 2);
        orthoCamera.right = (canvas.clientWidth / 2);
        orthoCamera.top = (canvas.clientHeight / 2);
        orthoCamera.bottom = (-canvas.clientHeight / 2);
        orthoCamera.updateProjectionMatrix()
    }

    if (mixer) {
        mixer.update(clock.getDelta());
    };
    renderer.render(scene, orthoCamera);
};

animate();