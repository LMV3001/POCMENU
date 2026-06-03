import { Position } from "./point";
export class Light {

    public readonly position: Position;
    public readonly ambientLight: number;
    public readonly intensity: number;

    constructor(position: Position = new Position(0, 0, 0), intensity: number = 1, ambientLight: number = 0.1) {
        this.position = position;
        this.intensity = intensity;
        this.ambientLight = ambientLight;
    }
    
    public toArray(): Float32Array {
        return new Float32Array([this.position.x, this.position.y, this.position.z, this.intensity, this.ambientLight]);
    }
}