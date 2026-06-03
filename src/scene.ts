import {Pyramide} from './figures';
import { Sphere } from './sphere';
import { Renderer } from './renderer';
import { Engine3D } from './engineMatriciel';
import { Camera } from './camera';
import { Light } from './light';




export class Scene {

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly rendu: Renderer;
  private scrollCible : number = 0;
  private scrollActuel : number = 0;
  private readonly engine3D: Engine3D;
  public readonly camera: Float32Array;
  public readonly lumiere: Float32Array;
  private animationFrameId: number | null = null;
  private readonly scrollInertie = 0.1;
  private readonly scrollSeuilArret = 0.1;
  public readonly FiguresArray : Float32Array;
  public readonly couleursFigures : Float32Array;
  private geometrie: Float32Array;
  private instances: Float32Array;



  constructor(canvasId: string, sphere: Sphere) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d")!;

    this.camera = new Camera().toArray();

    this.lumiere = new Light().toArray(); // lumière positionnée devant la scène pour un éclairage plus réaliste, à faire évoluer vers une gestion plus complexe de la lumière pour un rendu plus réaliste
    
    this.engine3D = new Engine3D(sphere.geometrie, sphere.instances);

    this.rendu = new Renderer(this.ctx);

    this.initEventListeners();

  }

  public ajouter(maSphere: Sphere): void {
    this.geometrie = new Float32Array(maSphere.geometrie.length);
    this.geometrie.set(maSphere.geometrie, 0);
    this.instances = new Float32Array(maSphere.instances.length);
    this.instances.set(maSphere.instances, 0);
  }

  public ajouterCamera(maCamera: Camera): void {
    this.camera = maCamera.toArray();
  }

  public ajouterLumiere(maLumiere: Light): void {
    this.lumiere = maLumiere.toArray();
   }



  /*******************************************Gestion des événements******************************************************* */

  private initEventListeners(): void {
    window.addEventListener("scroll", () => {
      this.scrollCible = window.scrollY;
      this.requestRender();
    }, { passive: true });

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.requestRender();
    });


  }

  public start(): void {
      this.requestRender();
  }

  public requestRender(): void {
    if (this.animationFrameId !== null) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  private loop(): void {
    this.animationFrameId = null;
    this.scrollActuel += (this.scrollCible - this.scrollActuel) * this.scrollInertie;

    if (Math.abs(this.scrollCible - this.scrollActuel) < this.scrollSeuilArret) {
      this.scrollActuel = this.scrollCible;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.engine3D.update(this.canvas.width, this.canvas.height, this.scrollActuel, this.camera, this.lumiere);
    

    this.rendu.dessiner(this.engine3D.position2D, this.engine3D.ordreAffichage, this.engine3D.couleurUpdated);

    if (this.scrollActuel !== this.scrollCible) {
      this.requestRender();
    }
  }

}