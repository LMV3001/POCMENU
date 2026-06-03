import { Camera } from './camera';

export class Point {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

 public Interpolation(pointArrivée: Point, tempsEcoulé: number): Point {
    const x = this.x + (pointArrivée.x - this.x) * tempsEcoulé;
    const y = this.y + (pointArrivée.y - this.y) * tempsEcoulé;
    const z = this.z + (pointArrivée.z - this.z) * tempsEcoulé;
     return new Point(x, y, z);
 }

}

export class Position extends Point {


  public InterpolationCamera(camera: Camera): this {
    
    return new Position(this.x - camera.position.x, this.y - camera.position.y, this.z - camera.position.z) as this;
 }

 public RotationAxisX(rotation: Axis, centre: Position): Position {
      // Rotation autour de l'axe X
    let y1 = (this.y - centre.y) * Math.cos(rotation.x) - (this.z - centre.z) * Math.sin(rotation.x);
    let z1 = (this.y - centre.y) * Math.sin(rotation.x) + (this.z - centre.z) * Math.cos(rotation.x);
   
    return new Position(this.x + centre.x, y1 + centre.y, z1 + centre.z);
 }

    public RotationAxisY(rotation: Axis, centre: Position): Position {
    // Rotation autour de l'axe Y
    let x1 = (this.x - centre.x) * Math.cos(rotation.y) + (this.z - centre.z) * Math.sin(rotation.y);
    let z1 = -(this.x - centre.x) * Math.sin(rotation.y) + (this.z - centre.z) * Math.cos(rotation.y);
    return new Position(x1 + centre.x, this.y, z1 + centre.z);
    }
    
    public RotationAxisZ(rotation: Axis, centre: Position): Position {
    // Rotation autour de l'axe Z
    let x1 = (this.x - centre.x) * Math.cos(rotation.z) - (this.y - centre.y) * Math.sin(rotation.z);
    let y1 = (this.x - centre.x) * Math.sin(rotation.z) + (this.y - centre.y) * Math.cos(rotation.z);
    return new Position(x1 + centre.x, y1 + centre.y, this.z);
    }

    public RotationAxis(rotation: Axis, centre: Position): Position {
        let rotated = this.RotationAxisX(rotation, centre);
        rotated = rotated.RotationAxisY(rotation, centre);
        rotated = rotated.RotationAxisZ(rotation, centre);
        return rotated;
    }
        // Rotation autour de l'axe X
  public Interpolation(pointArrivée: Point, tempsEcoulé: number): Position {
    const x = this.x + (pointArrivée.x - this.x) * tempsEcoulé;
    const y = this.y + (pointArrivée.y - this.y) * tempsEcoulé;
    const z = this.z + (pointArrivée.z - this.z) * tempsEcoulé;
    return new Position(x, y, z);
 }

 public ajouter(x: number, y: number, z: number): Position {
    const newX = this.x + x;
    const newY = this.y + y;
    const newZ = this.z + z;    
    return new Position(newX, newY, newZ);
}
}
export class Axis extends Point {


    public InterpolationAxis(axisArrivée: Point, tempsEcoulé: number): Axis {

    const rotationX = this.x + (axisArrivée.x - this.x) * tempsEcoulé;
    const rotationY = this.y + (axisArrivée.y - this.y) * tempsEcoulé;
    const rotationZ = this.z + (axisArrivée.z - this.z) * tempsEcoulé;

    return new Axis(rotationX, rotationY, rotationZ);
    }

    public ajouter(x: number, y: number, z: number): Axis {
        const newX = this.x + x;
        const newY = this.y + y;
        const newZ = this.z + z;
        return new Axis(newX, newY, newZ);
    }
}

export class Couleur {

    public h : number; // teinte
    public s : number; // saturation
    public l : number; // luminosité

    constructor(h: number, s: number, l: number) {
        this.h = h;
        this.s = s;
        this.l = l;
    }

    public ajouter(h: number, s: number, l: number): Couleur {
        const newH = this.h + h;
        const newS = this.s + s;
        const newL = this.l + l;
        return new Couleur(newH, newS, newL);
    }

    public Interpolation(couleurArrivée: Couleur, tempsEcoulé: number): Couleur {
        const h = this.h + (couleurArrivée.h - this.h) * tempsEcoulé;
        const s = this.s + (couleurArrivée.s - this.s) * tempsEcoulé;
        const l = this.l + (couleurArrivée.l - this.l) * tempsEcoulé;
        return new Couleur(h, s, l);
    }

}

export function CalculerCentre(a : Position, b: Position, c: Position): Position {
    const x = (a.x + b.x + c.x) / 3;
    const y = (a.y + b.y + c.y) / 3;
    const z = (a.z + b.z + c.z) / 3;
    return new Position(x, y, z);
}   




