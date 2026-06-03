import {Position, Axis} from './point';

export class Camera {
    public position: Position;
    public rotation: Axis;

    constructor(position: Position = new Position(0,0,-5), rotation: Axis = new Axis(0,0,0)) {
        this.position = position;
        this.rotation = rotation;
    }

    public toArray(): Float32Array {
     
        return new Float32Array([this.position.x, this.position.y, this.position.z, this.rotation.x, this.rotation.y, this.rotation.z]);

    }
}