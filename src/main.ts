import './style.css';
import { Scene } from './scene';
import { Pyramide} from './figures';
import { Sphere } from './sphere';
import { Position, Axis, Couleur } from './point';

/*const pyramide = new Pyramide(100, new Position(0, 0, 0), new Axis(0, Math.PI/12, 0), new Couleur(0, 100, 50));
pyramide.ajouterKeyframe(500, 200, new Position(0, 0, 0), new Axis(Math.PI*2, Math.PI*2,0), new Couleur(0, 100, 50)); // keyframe initiale
console.log(pyramide);
   
const pyramide2 = new Pyramide(100, new Position(100, 0, 0), new Axis(0,0, 0), new Axis(0,Math.PI/12, 0), new Couleur(0, 100, 50));
pyramide2.ajouterKeyframe(500, 100, new Position(100, 0, 0), new Axis(Math.PI*2, Math.PI*2,0), new Couleur(0, 100, 50)); // keyframe initiale

   
const pyramide3 = new Pyramide(100, new Position(-100, 0, 0), new Axis(0, -Math.PI/12, 0), new Couleur(0, 100, 50));
pyramide3.ajouterKeyframe(500, 100, new Position(-100, 0, 0), new Axis(Math.PI*2, Math.PI*2,0), new Couleur(0, 100, 50)); // keyframe initiale*/

const maSphere = new Sphere();

    // 1. On charge le lourd fichier JSON
await maSphere.chargerData();

const maScene = new Scene("scene", maSphere);

maScene.start();

// une figure plus complexe pour tester les performances du moteur de rendu
//const scene = new Scene("scene", maSphere); // 2eme paramètre(type de figures) 0: losange, 1: triangle, 2 : triangle rectangle, 3: hexagone, 4: octogone
//scene.start();


/-------------------------------------------gestion des contrôles de la caméra et du zoom--------------------------------------------------/

const cameraYPlus = document.getElementById("cameraYPlus") as HTMLButtonElement;
const cameraYMinus = document.getElementById("cameraYMinus") as HTMLButtonElement;
const cameraXPlus = document.getElementById("cameraXPlus") as HTMLButtonElement;
const cameraXMinus = document.getElementById("cameraXMinus") as HTMLButtonElement;
const cameraCenter = document.getElementById("cameraCenter") as HTMLButtonElement;
const zoomIn = document.getElementById("zoomIn") as HTMLButtonElement;
const zoomOut = document.getElementById("zoomOut") as HTMLButtonElement;
const zoomCenter = document.getElementById("zoomCenter") as HTMLButtonElement;

let intervalId: number | null = null;

function stopContinuousAction(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startContinuousAction(action: () => void): void {
  stopContinuousAction();
  action();
  scene.requestRender();
  intervalId = globalThis.setInterval(() => {
    action();
    scene.requestRender();
  }, 33);
}

cameraYPlus.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.rotation.x -= Math.PI / 18;
  });
});

cameraYMinus.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.rotation.x += Math.PI / 18;
  });
});

cameraXPlus.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.rotation.y += Math.PI / 18;
  });
});

cameraXMinus.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.rotation.y -= Math.PI / 18;
  });
});

cameraYPlus.addEventListener("mouseup", () => {
  stopContinuousAction();
});

cameraYMinus.addEventListener("mouseup", () => {
  stopContinuousAction();
});

cameraXPlus.addEventListener("mouseup", () => {
  stopContinuousAction();
});

cameraXMinus.addEventListener("mouseup", () => {
  stopContinuousAction();
});

cameraYPlus.addEventListener("mouseleave", () => {
  stopContinuousAction();
});

cameraYMinus.addEventListener("mouseleave", () => {
  stopContinuousAction();
});

cameraXPlus.addEventListener("mouseleave", () => {
  stopContinuousAction();
});

cameraXMinus.addEventListener("mouseleave", () => {
  stopContinuousAction();
});


cameraCenter.addEventListener("click", () => {
  scene.camera.rotation.x = 0;
  scene.camera.rotation.y = 0;
  scene.requestRender();
});

zoomIn.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.position.z += 10;
  });
});

zoomOut.addEventListener("mousedown", () => {
  startContinuousAction(() => {
    scene.camera.position.z -= 10;
  });
});

zoomIn.addEventListener("mouseup", () => {
  stopContinuousAction();
});

zoomOut.addEventListener("mouseup", () => {
  stopContinuousAction();
});

zoomIn.addEventListener("mouseleave", () => {
  stopContinuousAction();
});

zoomOut.addEventListener("mouseleave", () => {
  stopContinuousAction();
});

zoomCenter.addEventListener("click", () => {
  scene.camera.position.z = 0;
  scene.requestRender();
});