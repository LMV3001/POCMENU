
import * as MATH3D from "./math3D.ts";

// test d'amélioration de la performance par utilisation de calcul matriciel au lieu des objets pour le stockage des données des figures, à faire évoluer vers une utilisation de shaders pour un rendu plus rapide et plus fluide, avec une gestion plus complexe de la lumière et des ombres pour un rendu plus réaliste
export class Engine3D {
  private readonly figures: Figures[];

  private readonly instances: Float32Array; // stockage des keyframes des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
    // stockage des keyframes des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
  private readonly geometrie: Float32Array; // stockage des positions des sommets des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
  public position3DUptated: Float32Array; // stockage des positions des sommets des figures après transformation en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
  private readonly zMoyen: Float32Array; 
  public position3DSorted: Float32Array;
  
  private // stockage des profondeurs des sommets des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
  private readonly position2D : Float32Array; // stockage des positions projetées des sommets des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
  public ordreAffichage: number[] = []; // stockage de l'ordre d'affichage des faces pour un rendu correct des superpositions, à faire évoluer vers une gestion plus complexe de la scène pour un rendu plus réaliste
  public couleur: Float32Array; // stockage des couleurs des sommets des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendua profondeur pour un rendu plus réaliste
  
  constructor(geometrie: Float32Array, instances: Float32Array) {
    this.geometrie = new Float32Array(geometrie.length);
    this.geometrie.set(geometrie, 0);
    this.instances = new Float32Array(instances.length);
    this.instances.set(instances, 0);
    this.position3D = new Float32Array(geometrie.length); // stockage des positions des sommets des figures en format matriciel pour une utilisation plus rapide dans les calculs de transformation et de rendu
    this.position3DUptated = new Float32Array(geometrie.length); // 4 composantes (x, y, z, w) par sommet après transformation
    this.zMoyen = new Float32Array(geometrie.length / 12); // 1 composante (profondeur) par sommet
    this.position3DSorted = new Float32Array(geometrie.length); // 4 composantes (x, y, z, w) par sommet après tri par profondeur
    this.position2D = new Float32Array(geometrie.length / 2); // 2 composantes (x, y) par sommet pour les positions projetées
    this.normales = new Float32Array(geometrie.length / 12 * 3); // 3 composantes (x, y, z) par sommet pour les normales
    this.couleur = new Float32Array(geometrie.length / 12); // 3 composantes (h, s, l) par sommet
    this.couleurUpdated = new Float32Array(geometrie.length / 12); // 3 composantes (h, s, l) par sommet pour les couleurs après transformation
    //this.keyframes = new Float32Array(nbKeyframesTotal * 11); // 11 composantes par keyframe

    for ( let i = 0; i < this.geometrie.length; i +=48) {
    let indiceInstance = i/48*6;
    const matriceTranslation = MATH3D.creerMatriceTranslation(this.instances[indiceInstance], this.instances[indiceInstance + 1], this.instances[indiceInstance + 2]);
    this.position3D.set(MATH3D.transformerPoints(this.geometrie.subarray(i, i+48), matriceTranslation), i);
    }

    console.log("position3D", this.position3D);
  }

  public update(canvasWidth: number, canvasHeight: number, scroll: number, camera: Float32Array, lumiere: Light) {


 for ( let i = 0; i < this.geometrie.length; i +=48) {
  let indiceInstance = i/48*6;
  const keyframe1 = [0, 100, 0, 0, 0, 0, 0, 0];
  const keyframe2 = [500, 100,this.instances[indiceInstance]*2, this.instances[indiceInstance + 1]*2, this.instances[indiceInstance + 2]*2, 0, 0, 0, 0];
  
  const ratio = Math.max(Math.min((scroll - keyframe1[0])/(keyframe2[0] - keyframe1[0]), 1), 0); // on suppose que les keyframes sont triées par ordre de scroll
  
  const scale = keyframe1[1]/100 + ratio * (keyframe2[1] - keyframe1[1])/100;;
 
  const translationX = keyframe1[2] + ratio * (keyframe2[2] - keyframe1[2]);
  const translationY = keyframe1[3] + ratio * (keyframe2[3] - keyframe1[3]);
  const translationZ = keyframe1[4] + ratio * (keyframe2[4] - keyframe1[4]);
  
  const rotationX = keyframe1[5] + ratio * (keyframe2[5] - keyframe1[5]);
  const rotationY = keyframe1[6] + ratio * (keyframe2[6] - keyframe1[6]);
  const rotationZ = keyframe1[7] + ratio * (keyframe2[7] - keyframe1[7]);
  
  //const couleurH = this.keyframes[indiceFigureKeyframes + 8] + ratio * (this.keyframes[indiceFigureKeyframes + 19] - this.keyframes[indiceFigureKeyframes + 8]);
  //const couleurS = this.keyframes[indiceFigureKeyframes + 9] + ratio * (this.keyframes[indiceFigureKeyframes + 20] - this.keyframes[indiceFigureKeyframes + 9]);
  //const couleurL = this.keyframes[indiceFigureKeyframes + 10] + ratio * (this.keyframes[indiceFigureKeyframes + 21] - this.keyframes[indiceFigureKeyframes + 10]);


  // détermination de la matrice modèle en fonction des keyframes et du scroll actuel, à faire évoluer vers une interpolation plus fluide entre les keyframes pour un rendu plus réaliste
  
  const matriceTranslation = MATH3D.creerMatriceTranslation(translationX, translationY, translationZ);
  const matriceRotationX = MATH3D.creerMatriceRotationX(rotationX);
  const matriceRotationY = MATH3D.creerMatriceRotationY(rotationY);
  const matriceRotationZ = MATH3D.creerMatriceRotationZ(rotationZ); 



  let matriceRotation = MATH3D.multiplierMatrices(matriceRotationX, matriceRotationZ);
  matriceRotation = MATH3D.multiplierMatrices(matriceRotation, matriceRotationY);
  
  const matriceModel = MATH3D.multiplierMatrices(matriceTranslation, matriceRotation);
  
  // détermination de la matrice de vue en fonction de la position et de la rotation de la caméra, à faire évoluer vers une gestion plus complexe de la caméra pour un rendu plus réaliste
  
  const matriceTranslationCamera = MATH3D.creerMatriceTranslation(-camera[0], -camera[1], -camera[2]);
  const matriceRotationCameraX = MATH3D.creerMatriceRotationX(-camera[3]);
  const matriceRotationCameraY = MATH3D.creerMatriceRotationY(-camera[4]);
  const matriceRotationCameraZ = MATH3D.creerMatriceRotationZ(-camera[5]);
  let matriceRotationCamera = MATH3D.multiplierMatrices(matriceRotationCameraX, matriceRotationCameraZ);
  matriceRotationCamera = MATH3D.multiplierMatrices(matriceRotationCamera, matriceRotationCameraY);
  const matriceView = MATH3D.multiplierMatrices(matriceRotationCamera, matriceTranslationCamera);

  // détermination de la matrice de projection pour imiter les effets de perspective et de profondeur, à faire évoluer vers une gestion plus réaliste de la projection pour un rendu plus réaliste
 
  const matriceProjection = MATH3D.creerMatricePerspective(Math.PI/4, canvasWidth / canvasHeight, 0.1, 1000);
  
  
  // détermination de la matrice MVP (modèle-vue-projection) en multipliant les matrices modèle, vue et projection, ce qui permet de transformer les coordonnées des sommets des figures du repère local de la figure vers le repère de la caméra, puis vers le repère de l'écran pour le rendu
  
  const matriceMV = MATH3D.multiplierMatrices(matriceView, matriceModel);

  const matriceMVP = MATH3D.multiplierMatrices(matriceProjection, matriceMV);

  //MATH3D.modifierEchelle(this.position3D.subarray(i*48, 48*(i+1)), scale, this.position3DUptated.subarray(i*48, 48*(i+1))); // on transforme les points de la figure du repère local de la figure vers le repère de la caméra pour le rendu, à faire évoluer vers une gestion plus efficace des transformations pour un rendu plus rapide et plus fluide
  
  this.position3DUptated.set(MATH3D.transformerPoints(this.position3D.subarray(i, i+48), matriceMVP), i);

 // modifcation les matrices view et projection ne doivent pas être recalculées pour chaque figure, elles doivent être calculées une seule fois par frame en fonction de la position de la caméra et des paramètres de projection, puis utilisées pour transformer les points de toutes les figures, à faire évoluer vers une gestion plus efficace des transformations pour un rendu plus rapide et plus fluide
 }

 this.ordreAffichage = [];

  MATH3D.calculerNormales(this.position3DUptated, this.normales); // on calcule les normales des sommets pour une gestion plus réaliste de la lumière et des ombres

  MATH3D.calculerFaceVisible(this.normales, this.ordreAffichage);
 
  MATH3D.calculerZmoyen(this.position3DUptated, this.zMoyen);
  

  MATH3D.calculerProfondeur(this.position3DUptated, this.zMoyen, this.ordreAffichage); // on calcule la profondeur des sommets pour un tri correct des faces et un rendu plus réaliste
 
  MATH3D.calculerOrdreAffichage(this.zMoyen, this.ordreAffichage); // on trie les faces par ordre de profondeur pour un rendu correct des superpositions
  
  const intensitéLumière = new Float32Array(this.normales.length / 3); // 1 composante (intensité) par sommet pour l'éclairage

  MATH3D.calculerEclairage(this.normales, lumiere, intensitéLumière);// on calcule la couleur des sommets en fonction de la lumière pour un rendu plus réaliste
 
  MATH3D.calculerCouleur(this.couleur, intensitéLumière, this.couleurUpdated); 
  
  // on calcule la couleur des sommets en fonction de la lumière pour un rendu plus réaliste
  
  MATH3D.projeterPoints(this.position3DUptated, canvasWidth, canvasHeight, this.position2D); 
  
}

}

