export class Renderer {

private readonly ctx: CanvasRenderingContext2D;

    constructor(ctx : CanvasRenderingContext2D) {
            this.ctx = ctx;
            


    }

    public dessiner (position: Float32Array, ordreAffichage: number[], couleur: Float32Array): void {
    const ctx = this.ctx;
    

    for (const index of ordreAffichage) {
      const indexDebut = index * 6;

    ctx.beginPath();

    ctx.moveTo(position[indexDebut], position[indexDebut + 1]); // Point de départ du triangle sommet
    ctx.lineTo(position[indexDebut + 2], position[indexDebut + 3]); // Point gauche du triangle base avant gauche
    ctx.lineTo(position[indexDebut + 4], position[indexDebut + 5]); // Point droit du triangle base avant
    
  
    //ctx.fillStyle = `hsl(${couleur[index * 3]}, ${couleur[index * 3 + 1]}%, ${couleur[index * 3 + 2]}%)`; // Couleur du triangle
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black'; // Couleur du contour du triangle
    
    ctx.closePath();

    ctx.fill();
   ctx.stroke();
    
    
  
    
    }

    
   


    }
}