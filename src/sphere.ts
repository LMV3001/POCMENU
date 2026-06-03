export class Sphere {
    // La classe possède les tableaux bruts, c'est très performant
    public geometrie: Float32Array;
    public instances: Float32Array;
    public estChargee: boolean = false;

    constructor() {
        // Initialisation vide en attendant le chargement réseau
        this.geometrie = new Float32Array();
        this.instances = new Float32Array();
    }

    // La méthode asynchrone appartient à la sphère !
    public async chargerData() {
        const reponse = await fetch('icosphere_lvl3.json');
        const data = await reponse.json();

        // On assigne la géométrie
        this.geometrie = new Float32Array(data.geometrie);
        
        this.instances = new Float32Array(data.instances.length * 2); // on suppose que les instances sont stockées sous forme de tableaux de positions (x, y, z) et de rotations (rx, ry, rz) pour chaque instance, soit 6 valeurs par instance
        let indexJson = 0;
        for (let i = 0; i < this.instances.length; i += 6) {
            this.instances[i] = data.instances[indexJson]; // x
            this.instances[i + 1] = data.instances[indexJson + 1]; // y
            this.instances[i + 2] = data.instances[indexJson + 2]; // z
            this.instances[i + 3] = 0; // rotation x
            this.instances[i + 4] = 0; // rotation y
            this.instances[i + 5] = 0; // rotation z
            indexJson += 3;
        }
        this.estChargee = true;
    }
}