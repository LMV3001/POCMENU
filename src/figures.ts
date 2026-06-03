import {Position, Axis, Couleur } from './point';

export abstract class Figures {
  public readonly tailleFigure: number;
  public readonly centreLocal: Position; 
  public readonly centreGlobal: Position;
  public readonly rotationGlobale: Axis;
  public readonly rotationLocale: Axis; 
  public readonly couleur: Couleur; 
  public readonly keyframe : {id : number,scroll: number, tailleFigure: number, position: Position, rotation: Axis, couleur: Couleur}[] = [];
  private keyframeIdCounter: number = 0;


  constructor(tailleFigure : number, centreLocal: Position, centreGlobal: Position,rotationLocale: Axis, rotationGlobale: Axis, couleur : Couleur) {
    this.tailleFigure = tailleFigure;
    this.centreLocal = centreLocal;
    this.centreGlobal = centreGlobal;
    this.rotationLocale = rotationLocale;
    this.rotationGlobale = rotationGlobale;
    this.couleur = couleur;
    this.ajouterKeyframe(0, tailleFigure, centreGlobal, rotationGlobale, couleur); // keyframe initiale
  }

    public ajouterKeyframe(scroll: number, tailleFigure: number, position: Position, rotation: Axis, couleur: Couleur) {
    this.keyframe.push({
      id: this.keyframeIdCounter++,
      scroll: scroll,
      tailleFigure: tailleFigure,
      position: position,
      rotation: rotation,
      couleur: couleur
    });

  }

  public abstract générerCoordonnées(): Float32Array; // méthode à implémenter par les classes filles pour générer les coordonnées des sommets de la figure en fonction de sa taille, de sa position et de sa rotation

  public abstract obtenirCouleurs(): Float32Array; // méthode à implémenter par les classes filles pour générer les couleurs des sommets de la figure en fonction de sa couleur globale et de ses éventuelles variations locales

  public abstract obtenirNormales(): Float32Array; // méthode à implémenter par les classes filles pour générer les normales des sommets de la figure en fonction de sa géométrie et de son orientation dans l'espace
}
/********************************TRIANGLE*************************************************/

export class Triangle extends Figures {

  private readonly nombreSommets: number = 3;


  public obtenirCouleurs(): Float32Array {
    return new Float32Array([
      this.couleur.h, this.couleur.s, this.couleur.l,
    ]);
  }

  public générerCoordonnées(): Float32Array {
    
    const h = this.tailleFigure*(Math.sqrt(3)/2);
    const zPointe = -(2*h)/3;
    const zBase = h/3;

  //1. Calcul des coordonnées des sommets du triangle plat

    let sommets = [
      { x: 0, y: 0, z: zPointe }, // sommet
      { x: -this.tailleFigure/2, y: 0, z: zBase }, // bas gauche
      { x: this.tailleFigure/2, y: 0, z: zBase } // bas droit
    ];

     sommets.forEach((sommet) => {
      let x = sommet.x, y = sommet.y, z = sommet.z;

        // étape 1 : rotation autour de l'axe X
        let y1 = y * Math.cos(this.rotationLocale.x) - z * Math.sin(this.rotationLocale.x);
        let z1 = y * Math.sin(this.rotationLocale.x) + z * Math.cos(this.rotationLocale.x);
        y = y1;
        z = z1;
        
        // étape 2 : rotation autour de l'axe Y
        let x2 = x * Math.cos(this.rotationLocale.y) + z * Math.sin(this.rotationLocale.y);
        let z2 = -x * Math.sin(this.rotationLocale.y) + z * Math.cos(this.rotationLocale.y);
        x = x2;
        z = z2;

        // étape 3 : rotation autour de l'axe Z
        let x3 = x * Math.cos(this.rotationLocale.z) - y * Math.sin(this.rotationLocale.z);
        let y3 = x * Math.sin(this.rotationLocale.z) + y * Math.cos(this.rotationLocale.z);
        x = x3;
        y = y3;

        // étape 4 : translation pour centrer le triangle sur sa position centrale
        sommet.x = x + this.centreLocal.x;
        sommet.y = y + this.centreLocal.y;
        sommet.z = z + this.centreLocal.z;
    });


    return new Float32Array([
      sommets[0].x, sommets[0].y, sommets[0].z, 1,
      sommets[1].x, sommets[1].y, sommets[1].z, 1,
      sommets[2].x, sommets[2].y, sommets[2].z, 1
    ]);
  }

}

/********************************PYRAMIDE*************************************************/

export class Pyramide extends Figures {
    private readonly nombreSommets: number = 12;
    public readonly triangles: Triangle[]; // à utiliser pour une animation de profondeur éventuelle, à modifier pour les autres types de figures
    public readonly figuresArray : Float32Array = new Float32Array(28); // stockage des centres des faces de la pyramide en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
    public readonly couleursArray : Float32Array = new Float32Array(12);


  constructor(tailleFigure: number, centre: Position, rotation: Axis, couleur: Couleur) {
    super(
      tailleFigure,
      new Position(0, 0, 0),
      centre,
      new Axis(0, 0, 0),
      rotation,
      couleur,
    );

    const centreGlobale = centre;
    const rotationGlobale = rotation;
    const arete : number = tailleFigure;
    const rayon : number = arete * (Math.sqrt(6)/12); // Rayon du cercle circonscrit à la base de la pyramide
    const theta : number = Math.acos(1/3); // Angle entre la hauteur de la pyramide et une arête de la base
    const angle120 : number = (2 * Math.PI) / 3; // 120 degrés en radians
    
    // les normales des faces de la pyramide sont inclinées de 19,47 degrés par rapport à l'axe vertical, ce qui correspond à l'angle entre la hauteur de la pyramide et une arête de la base
    const sinTheta : number = Math.sin(theta);
    const cosTheta : number = 1/3;

    const hauteur : number = rayon * cosTheta; // Hauteur de la pyramide
    const deplacementHorizontal : number = rayon * sinTheta; // Déplacement horizontal des sommets de la base par rapport au centre

    const centreA : Position = new Position(0, hauteur, deplacementHorizontal); // Centre de la face A (face avant)
    const centreB : Position = new Position(deplacementHorizontal*Math.sin(angle120), hauteur, deplacementHorizontal*Math.cos(angle120));
    const centreC : Position = new Position(deplacementHorizontal*Math.sin(-angle120), hauteur, deplacementHorizontal*Math.cos(-angle120));
    const centreD : Position = new Position(0, -rayon, 0);

    const rotationLocaleA : Axis = new Axis(theta, 0, 0);
    const rotationLocaleB : Axis = new Axis(theta, angle120, 0);
    const rotationLocaleC : Axis = new Axis(theta, -angle120, 0);
    const rotationLocaleD : Axis = new Axis(0, 0, Math.PI); // Rotation de 90 degrés pour la face du bas

    const couleurA : Couleur = new Couleur(0, 100, 50); // Rouge
    const couleurB : Couleur = new Couleur(120, 100, 50); // Vert
    const couleurC : Couleur = new Couleur(240, 100, 50); // Bleu
    const couleurD : Couleur = new Couleur(60, 100, 50); // Jaune

    
    const faceA : Triangle = new Triangle(tailleFigure, centreA, centreGlobale, rotationLocaleA, rotationGlobale, couleurA);
    const faceB : Triangle = new Triangle(tailleFigure, centreB, centreGlobale, rotationLocaleB, rotationGlobale, couleurB); 
    const faceC : Triangle = new Triangle(tailleFigure, centreC, centreGlobale, rotationLocaleC, rotationGlobale, couleurC);
    const faceD : Triangle = new Triangle(tailleFigure, centreD, centreGlobale, rotationLocaleD, rotationGlobale, couleurD);
   
    this.triangles = [faceD, faceA, faceB, faceC];

    this.figuresArray.set([
      centreA.x, centreA.y, centreA.z, 1, rotationLocaleA.x, rotationLocaleA.y, rotationLocaleA.z,
      centreB.x, centreB.y, centreB.z, 1, rotationLocaleB.x, rotationLocaleB.y, rotationLocaleB.z,
      centreC.x, centreC.y, centreC.z, 1, rotationLocaleC.x, rotationLocaleC.y, rotationLocaleC.z,
      centreD.x, centreD.y, centreD.z, 1, rotationLocaleD.x, rotationLocaleD.y, rotationLocaleD.z,

    ]);

    this.couleursArray.set([
      couleurD.h, couleurD.s, couleurD.l,
      couleurA.h, couleurA.s, couleurA.l,
      couleurB.h, couleurB.s, couleurB.l,
      couleurC.h, couleurC.s, couleurC.l
    ]);

  }

  public obtenirCouleurs(): Float32Array {
    const couleursPyramide = new Float32Array(this.triangles.length * 3); // 3 composantes (h, s, l) par sommet
    for (let i = 0; i < this.triangles.length; i++) {
      const couleursTriangle = this.triangles[i].obtenirCouleurs();
      couleursPyramide.set(couleursTriangle, i * 3);
    }
    return couleursPyramide;
  }

  public générerCoordonnées(): Float32Array {
    const coordonnéesPyramide = new Float32Array(this.triangles.length * 12);
    for (let i = 0; i < this.triangles.length; i++) {
      const coordonnéesTriangle = this.triangles[i].générerCoordonnées();
      coordonnéesPyramide.set(coordonnéesTriangle, i * 12);
    }
    return coordonnéesPyramide;
  }

  
}

