import * as fs from 'fs';

// 1. Notre algorithme mathématique (version pure JS)
function genererDataIcosphereLvl3() {
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const norm = (x, y, z) => {
        const d = Math.sqrt(x * x + y * y + z * z);
        return [x / d, y / d, z / d];
    };

    const sommets = [
        norm(-1, t, 0), norm(1, t, 0), norm(-1, -t, 0), norm(1, -t, 0),
        norm(0, -1, t), norm(0, 1, t), norm(0, -1, -t), norm(0, 1, -t),
        norm(t, 0, -1), norm(t, 0, 1), norm(-t, 0, -1), norm(-t, 0, 1)
    ];

    let faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    const subdiviser = (anciennesFaces, tableauSommets) => {
        const nouvellesFaces = [];
        const getMilieu = (i1, i2) => {
            const v1 = tableauSommets[i1];
            const v2 = tableauSommets[i2];
            const m = norm((v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2);
            tableauSommets.push(m);
            return tableauSommets.length - 1;
        };

        for (let f of anciennesFaces) {
            const a = getMilieu(f[0], f[1]);
            const b = getMilieu(f[1], f[2]);
            const c = getMilieu(f[2], f[0]);
            nouvellesFaces.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]);
        }
        return nouvellesFaces;
    };

    // Subdiviser 2 fois pour atteindre le Level 3 (320 faces)
    faces = subdiviser(faces, sommets);
    faces = subdiviser(faces, sommets);

    const instancesData = [];
    const sommetsLocauxData = [];

    for (let i = 0; i < faces.length; i++) {
        const A = sommets[faces[i][0]];
        const B = sommets[faces[i][1]];
        const C = sommets[faces[i][2]];

        const centreX = (A[0] + B[0] + C[0]) / 4;
        const centreY = (A[1] + B[1] + C[1]) / 4;
        const centreZ = (A[2] + B[2] + C[2]) / 4;

        // On push les 6 datas de l'instance
        instancesData.push(centreX, centreY, centreZ, 0, 0, 0);

        const locA = [A[0] - centreX, A[1] - centreY, A[2] - centreZ];
        const locB = [B[0] - centreX, B[1] - centreY, B[2] - centreZ];
        const locC = [C[0] - centreX, C[1] - centreY, C[2] - centreZ];
        const locO = [-centreX, -centreY, -centreZ];

        const points = [
            ...locA, 1.0, ...locB, 1.0, ...locC, 1.0,
            ...locA, 1.0, ...locO, 1.0, ...locB, 1.0,
            ...locB, 1.0, ...locO, 1.0, ...locC, 1.0,
            ...locC, 1.0, ...locO, 1.0, ...locA, 1.0
        ];

        // On push les 48 datas de la géométrie locale
        sommetsLocauxData.push(...points);
    }

    return {
        instances: instancesData,
        geometrie: sommetsLocauxData
    };
}

// 2. Exécution et Sauvegarde
console.log("Calcul de la géométrie en cours...");
const data = genererDataIcosphereLvl3();

const jsonAExporter = JSON.stringify(data);

fs.writeFileSync('icosphere_lvl3.json', jsonAExporter);
console.log("Succès ! Le fichier 'icosphere_lvl3.json' a été généré.");