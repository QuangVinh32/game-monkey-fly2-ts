import { BaseDTO } from "./BaseDTO";

export class BallDTO extends BaseDTO {
    private _ballId: number;
    private _width: number;
    private _height: number;
    private _texture: string;
    private _speed: number;
    private _levelId: number;

    constructor(
        ballId: number,
        positionX: number,
        positionY: number,
        width: number,
        height: number,
        texture: string,
        speed: number, 
        levelId: number,
     
    ) {
        super(positionX, positionY);
        this._ballId = ballId;
        this._width = width;
        this._height = height;
        this._texture = texture;
        this._speed = speed;
        this._levelId = levelId;
    }


    /**
     * Getter ballId
     * @return {number}
     */
	public get ballId(): number {
		return this._ballId;
	}

    /**
     * Setter ballId
     * @param {number} value
     */
	public set ballId(value: number) {
		this._ballId = value;
	}


    /**
     * Getter speed
     * @return {number}
     */
    public get speed(): number {
        return this._speed;
    }

    /**
     * Setter speed
     * @param {number} value
     */
    public set speed(value: number) {
        this._speed = value;
    }

    /**
     * Getter width
     * @return {number}
     */
    public get width(): number {
        return this._width;
    }

    /**
     * Getter height
     * @return {number}
     */
    public get height(): number {
        return this._height;
    }

    /**
     * Getter texture
     * @return {string}
     */
    public get texture(): string {
        return this._texture;
    }

    /**
     * Getter levelId
     * @return {number}
     */
    public get levelId(): number {
        return this._levelId;
    }

    /**
     * Setter width
     * @param {number} value
     */
    public set width(value: number) {
        this._width = value;
    }

    /**
     * Setter height
     * @param {number} value
     */
    public set height(value: number) {
        this._height = value;
    }

    /**
     * Setter texture
     * @param {string} value
     */
    public set texture(value: string) {
        this._texture = value;
    }

    /**
     * Setter levelId
     * @param {number} value
     */
    public set levelId(value: number) {
        this._levelId = value;
    }
    
}
