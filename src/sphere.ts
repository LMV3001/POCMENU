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
        
        this.instances = new Float32Array(data.instances);
        
        this.estChargee = true;
    }
}