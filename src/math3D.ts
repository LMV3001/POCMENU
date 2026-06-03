// transformation point
// on ajoute un poids w=1 pour les transformations homogènes, ce qui permet de faire des translations en plus des rotations et des mises à l'échelle


export function générerCoordonnéesTriangle( tailleFigure : number, centres : Float32Array, rotations : Float32Array,): Float32Array {

    const h = tailleFigure*(Math.sqrt(3)/2);
    const zPointe = -(2*h)/3;
    const zBase = h/3;

  //1. Calcul des coordonnées des sommets du triangle plat

    let sommets = [
      { x: 0, y: 0, z: zPointe }, // sommet
      { x: -tailleFigure/2, y: 0, z: zBase }, // bas gauche
      { x: tailleFigure/2, y: 0, z: zBase } // bas droit
    ];

     sommets.forEach((sommet) => {
      let x = sommet.x, y = sommet.y, z = sommet.z;

        // étape 1 : rotation autour de l'axe X
        let y1 = y * Math.cos(rotation[0]) - z * Math.sin(rotation[0]);
        let z1 = y * Math.sin(rotation[0]) + z * Math.cos(rotation[0]);
        y = y1;
        z = z1;
        
        // étape 2 : rotation autour de l'axe Y
        let x2 = x * Math.cos(rotation[1]) + z * Math.sin(rotation[1]);
        let z2 = -x * Math.sin(rotation[1]) + z * Math.cos(rotation[1]);
        x = x2;
        z = z2;

        // étape 3 : rotation autour de l'axe Z
        let x3 = x * Math.cos(rotation[2]) - y * Math.sin(rotation[2]);
        let y3 = x * Math.sin(rotation[2]) + y * Math.cos(rotation[2]);
        x = x3;
        y = y3;

        // étape 4 : translation pour centrer le triangle sur sa position centrale
        sommet.x = x + centres[0];
        sommet.y = y + centres[1];
        sommet.z = z + centres[2];
    });


    return new Float32Array([
      sommets[0].x, sommets[0].y, sommets[0].z, 1,
      sommets[1].x, sommets[1].y, sommets[1].z, 1,
      sommets[2].x, sommets[2].y, sommets[2].z, 1
    ]);

}

export function transformerPoint (point: {x: number, y: number, z: number}): Float32Array {
  const x = point.x;
  const y = point.y;
  const z = point.z;
  const w = 1;

  return new Float32Array([x, y, z, w]);
}

export function multiplierMatrices (matriceA: Float32Array, matriceB: Float32Array): Float32Array {
const out = new Float32Array(16);
// pas de boucle pour que le processeur execute les opérations en un bloc (source : stack overflow)
let b0 = matriceB[0], b1 = matriceB[1], b2 = matriceB[2], b3 = matriceB[3];

out[0] = b0 * matriceA[0] + b1 * matriceA[4] + b2 * matriceA[8] + b3 * matriceA[12];
out[1] = b0 * matriceA[1] + b1 * matriceA[5] + b2 * matriceA[9] + b3 * matriceA[13];
out[2] = b0 * matriceA[2] + b1 * matriceA[6] + b2 * matriceA[10] + b3 * matriceA[14];
out[3] = b0 * matriceA[3] + b1 * matriceA[7] + b2 * matriceA[11] + b3 * matriceA[15];

b0 = matriceB[4]; b1 = matriceB[5]; b2 = matriceB[6]; b3 = matriceB[7];

out[4] = b0 * matriceA[0] + b1 * matriceA[4] + b2 * matriceA[8] + b3 * matriceA[12];
out[5] = b0 * matriceA[1] + b1 * matriceA[5] + b2 * matriceA[9] + b3 * matriceA[13];
out[6] = b0 * matriceA[2] + b1 * matriceA[6] + b2 * matriceA[10] + b3 * matriceA[14];
out[7] = b0 * matriceA[3] + b1 * matriceA[7] + b2 * matriceA[11] + b3 * matriceA[15];

b0 = matriceB[8]; b1 = matriceB[9]; b2 = matriceB[10]; b3 = matriceB[11];

out[8] = b0 * matriceA[0] + b1 * matriceA[4] + b2 * matriceA[8] + b3 * matriceA[12];
out[9] = b0 * matriceA[1] + b1 * matriceA[5] + b2 * matriceA[9] + b3 * matriceA[13];
out[10] = b0 * matriceA[2] + b1 * matriceA[6] + b2 * matriceA[10] + b3 * matriceA[14];
out[11] = b0 * matriceA[3] + b1 * matriceA[7] + b2 * matriceA[11] + b3 * matriceA[15];

b0 = matriceB[12]; b1 = matriceB[13]; b2 = matriceB[14]; b3 = matriceB[15];

out[12] = b0 * matriceA[0] + b1 * matriceA[4] + b2 * matriceA[8] + b3 * matriceA[12];
out[13] = b0 * matriceA[1] + b1 * matriceA[5] + b2 * matriceA[9] + b3 * matriceA[13];
out[14] = b0 * matriceA[2] + b1 * matriceA[6] + b2 * matriceA[10] + b3 * matriceA[14];
out[15] = b0 * matriceA[3] + b1 * matriceA[7] + b2 * matriceA[11] + b3 * matriceA[15];

return out;

}

export function modifierEchelle(matrice: Float32Array, scale: number, matriceRésultat: Float32Array) {
  for (let i = 0; i < matrice.length; i += 4) {
    matriceRésultat[i] = matrice[i] * scale;
    matriceRésultat[i + 1] = matrice[i + 1] * scale;
    matriceRésultat[i + 2] = matrice[i + 2] * scale;
    matriceRésultat[i + 3] = matrice[i + 3]; // IL ne faut pas toucher au w pour les transformations homogènes, sinon on perd la possibilité de faire des translations et des rotations correctement
  }
}

export function creerMatriceIdentité(): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

export function creerMatriceTranslation(tx: number, ty: number, tz: number): Float32Array {
  const out = creerMatriceIdentité();
    out[12] = tx;
    out[13] = ty;
    out[14] = tz;
  return out;
}

// Matrice de rotation X
// Permet de retrouver la formule de rotationX
// y' = y * cos(angle) - z * sin(angle)
// z' = y * sin(angle) + z * cos(angle)

export function creerMatriceRotationX(angle: number): Float32Array {
  const out = creerMatriceIdentité();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  out[5] = c;
  out[6] = s;
  out[9] = -s;
  out[10] = c;
  return out;
}

// Matrice de rotation Y
// Permet de retrouver la formule de rotationY
// x' = x * cos(angle) + z * sin(angle)
// z' = -x * sin(angle) + z * cos(angle)

export function creerMatriceRotationY(angle: number): Float32Array {
  const out = creerMatriceIdentité();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  out[0] = c;
  out[2] = -s;
  out[8] = s;
  out[10] = c;
  return out;
}

// Matrice de rotation Z
// Permet de retrouver la formule de rotationZ
// x' = x * cos(angle) - y * sin(angle)
// y' = x * sin(angle) + y * cos(angle)

export function creerMatriceRotationZ(angle: number): Float32Array {
  const out = creerMatriceIdentité();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  out[0] = c;
  out[1] = s;
  out[4] = -s;
  out[5] = c;
  return out;
}

// ajouter un calcul de matrice de perspective qui permet de garder la valeur du z pour faire du tri de faces et du clipping, et qui permet aussi de faire un effet de profondeur plus réaliste en réduisant la taille des objets à mesure qu'ils s'éloignent de la caméra

export function creerMatricePerspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const out = creerMatriceIdentité();
  const f = 1 / Math.tan(fov / 2);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (far - near); // On inverse le dénominateur
  out[11] = 1; //
  out[14] = (2 * far * near) / (near - far);
  out[15] = 0;
  return out;
}

export function transformerPoints(points: Float32Array, matriceTransformatioon: Float32Array): Float32Array {
const résultat = new Float32Array(points.length);
 const mo = matriceTransformatioon[0], m1 = matriceTransformatioon[1], m2 = matriceTransformatioon[2], m3 = matriceTransformatioon[3],
       m4 = matriceTransformatioon[4], m5 = matriceTransformatioon[5], m6 = matriceTransformatioon[6], m7 = matriceTransformatioon[7],
       m8 = matriceTransformatioon[8], m9 = matriceTransformatioon[9], m10 = matriceTransformatioon[10], m11 = matriceTransformatioon[11],
       m12 = matriceTransformatioon[12], m13 = matriceTransformatioon[13], m14 = matriceTransformatioon[14], m15 = matriceTransformatioon[15];

  for (let i = 0; i < points.length; i += 4) {
   // on calcule l'index global dans le tableau de positions 3D en fonction de l'indice de la figure et de l'index local du point
    const x = points[i], y = points[i + 1], z = points[i + 2], w = points[i + 3];
    résultat[i] = x * mo + y * m4 + z * m8 + w * m12; 
    résultat[i + 1] = x * m1 + y * m5 + z * m9 + w * m13; 
    résultat[i + 2] = x * m2 + y * m6 + z * m10 + w * m14; 
    résultat[i + 3] = x * m3 + y * m7 + z * m11 + w * m15; 
  }
  return résultat;
}

export function projeterPoints(points: Float32Array, width: number, height: number, résultat: Float32Array) {
  for (let i = 0; i < points.length; i += 4) {
    const x = points[i], y = points[i + 1], w = points[i + 3];
    const index2D = i / 2;
    résultat[index2D] = ((x / w) + 1) * width / 2;
    résultat[index2D + 1] = (1-(y / w)) * height / 2; // projection orthographique simple, à améliorer pour une projection perspective plus réaliste
  }
}


//************************Function pour le tri de l'ordre d'affichage************************************************ */

export function calculerZmoyen(points: Float32Array, zMoyen: Float32Array): void {
  for (let i = 0; i < points.length; i += 12) {
    zMoyen[i / 12] = (points[i + 2] + points[i + 6] + points[i + 10])/3; // on stocke la profondeur (z) de chaque sommet pour le tri des faces
  }
}
export function calculerOrdreAffichage(profondeur: Float32Array, ordreAffichage: number[]) {
  ordreAffichage.sort((a, b) => profondeur[b] - profondeur[a]);
}

//************************function pour le calcul des normales pour suppression des faces cachées(back-face culling) et éclairage*********************************************************/

export function calculerNormales(points: Float32Array, normales: Float32Array): void {
  for (let i = 0; i < points.length; i += 12) {
const indexDepart = i;

// 1. Extraire les coordonnées X, Y, Z des 3 sommets (On ignore le W)
const Ax = points[indexDepart];
const Ay = points[indexDepart + 1];
const Az = points[indexDepart + 2];

const Bx = points[indexDepart + 4];
const By = points[indexDepart + 5];
const Bz = points[indexDepart + 6];

const Cx = points[indexDepart + 8];
const Cy = points[indexDepart + 9];
const Cz = points[indexDepart + 10];

// 2. Calculer les vecteurs U (AB) et V (AC)
const Ux = Bx - Ax;
const Uy = By - Ay;
const Uz = Bz - Az;

const Vx = Cx - Ax;
const Vy = Cy - Ay;
const Vz = Cz - Az;

// 3. Le Produit Vectoriel (Cross Product) pour avoir la Normale Brute
let Nx = (Uy * Vz) - (Uz * Vy);
let Ny = (Uz * Vx) - (Ux * Vz);
let Nz = (Ux * Vy) - (Uy * Vx);

// --- ÉTAPE DE CULLING (Optionnelle mais recommandée) ---
// Si tu fais face à la caméra (Z vers l'écran), tu peux éliminer les faces arrière ici
// if (Nz <= 0) continue; 
// -------------------------------------------------------

// 4. Normalisation (Ramener la longueur du vecteur à 1)
// On utilise le théorème de Pythagore 3D
//const longueur = Math.sqrt(Nx * Nx + Ny * Ny + Nz * Nz);

// On évite la division par zéro au cas où le triangle serait corrompu/plat
  normales[i/12*3] = Nx;
  normales[i/12*3 + 1] = Ny;
  normales[i/12*3 + 2] = Nz;
}
}

export function calculerFaceVisible(normales: Float32Array, ordreAffichage: number[]) {
  for (let i = 0; i < normales.length; i += 3) {  
    if (normales[i + 2] <= 0) {
      ordreAffichage.push(i / 3); // on stocke l'index de la face visible (normale pointant vers la caméra)
    }
  }
}

export function calculerFaceVisible2D(normales: Float32Array, ordreAffichage: number[]) {
  for (let i = 0; i < normales.length; i += 3) {
    if (normales[i + 2] <= 0) {
      ordreAffichage.push(i / 3); // on stocke l'index de la face visible (normale pointant vers la caméra)
    }
  }
}
export function calculerEclairage(normales: Float32Array, lumière: Float32Array, intensitéLumière: Float32Array) {
  const Lx = lumière[0];
    const Ly = lumière[1];
    const Lz = lumière[2];
    const longueurLumière = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
    
   const Nlx = Lx / longueurLumière;
   const Nly = Ly / longueurLumière;
   const Nlz = Lz / longueurLumière;
  
  for (let i = 0; i < normales.length; i += 3) {
    const Nx = normales[i];
    const Ny = normales[i + 1];
    const Nz = normales[i + 2];
    const longueur = Math.sqrt(Nx * Nx + Ny * Ny + Nz * Nz);
    
    if (longueur > 0) { // éviter la division par zéro
      const Nnx = Nx / longueur;
      const Nny = Ny / longueur;
      const Nnz = Nz / longueur;
      const dotProduct = Nnx * Nlx + Nny * Nly + Nnz * Nlz;
      intensitéLumière[i / 3] = lumière[4] + lumière[3] * Math.max(0, dotProduct); 
    }
  }
}// on calcule l'intensité de la lumière sur la face en fonction de l'angle entre la normale et la direction de la lumière, en ajoutant

export function calculerCouleur(couleur: Float32Array, intensitéLumière: Float32Array, couleurUpdated: Float32Array) {
  for (let i = 0; i < couleur.length; i += 3) {
    couleurUpdated[i] = couleur[i]; // on applique l'intensité de la lumière à la couleur de base pour obtenir la couleur finale, en s'assurant que les valeurs restent entre 0 et 1
    couleurUpdated[i + 1] = couleur[i + 1];
    couleurUpdated[i + 2] = intensitéLumière[i / 3] * 50; // on applique l'intensité de la lumière à la composante de luminosité (L) de la couleur HSL pour obtenir la couleur finale, en s'assurant que les valeurs restent entre 0 et 1
  }
}

export function calculerProfondeur(points: Float32Array, profondeur: Float32Array, ordreAffichage: number[]): void {

for (let i = 0; i < points.length; i += 12) {
    let index = i;
    // 1. Extraction des W
    const W1 = points[index + 3];
    const W2 = points[index + 7];
    const W3 = points[index + 11];

    // 2. LE BOUCLIER ANTI-DÉFORMATION (Near Clipping)
    // Si un seul point est derrière la caméra ou trop près (ex: W < 0.1), on jette le triangle !
    if (W1 < 0.1 || W2 < 0.1 || W3 < 0.1) {
        continue; 
    }

    // 3. CALCUL DU Z MOYEN (Pour le Tri)
    // IMPORTANT : On utilise le Z pur de la matrice MVP, AVANT la division !
    const Z1 = points[index + 2];
    const Z2 = points[index + 6];
    const Z3 = points[index + 10];
    const zMoyen = (Z1 + Z2 + Z3) / 3;

    // 4. DIVISION PERSPECTIVE (Passage en 2D pour ce triangle)
    const ecranX1 = points[index] / W1;
    const ecranY1 = points[index + 1] / W1;
    
    const ecranX2 = points[index + 4] / W2;
    const ecranY2 = points[index + 5] / W2;
    
    const ecranX3 = points[index + 8] / W3;
    const ecranY3 = points[index + 9] / W3;

    // 5. CULLING 2D (Face cachée)
    const surface2D = (ecranX2 - ecranX1) * (ecranY3 - ecranY1) - (ecranY2 - ecranY1) * (ecranX3 - ecranX1);
    // (Ajuste le signe > ou < selon ton Winding Order)

    if (surface2D <= 0) {
        continue;
    }

    // 6. ENREGISTREMENT DANS LA FILE
    // Si le triangle a survécu à tout ça, on le stocke avec son zMoyen pour le tri
    ordreAffichage.push(i / 12); // on stocke l'index du triangle
    profondeur[i / 12] = zMoyen;
    
    // N'oublie pas d'écraser tes coordonnées dans le tableau avec les valeurs écrans finales (pixels)
    // pour que le Renderer puisse les dessiner !
  }
}