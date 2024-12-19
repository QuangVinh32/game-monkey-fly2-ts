import { BaseDTO } from "./BaseDTO";

export default class QuestionDTO extends BaseDTO {
    private _questionId: number;
    private _levelId: number;
    private _text: string;

    constructor(
        questionId: number,
        positionX: number,
        positionY: number,
        levelId: number,
        text: string
    ) {
        super(positionX, positionY); 
        this._questionId = questionId;
        this._levelId = levelId;
        this._text = text;
    }

    /**
     * Getter questionId
     * @return {number}
     */
    public get questionId(): number {
        return this._questionId;
    }

    /**
     * Setter questionId
     * @param {number} value
     */
    public set questionId(value: number) {
        this._questionId = value;
    }

    /**
     * Getter levelId
     * @return {number}
     */
    public get levelId(): number {
        return this._levelId;
    }

    /**
     * Setter levelId
     * @param {number} value
     */
    public set levelId(value: number) {
        this._levelId = value;
    }

    /**
     * Getter text
     * @return {string}
     */
    public get text(): string {
        return this._text;
    }

    /**
     * Setter text
     * @param {string} value
     */
    public set text(value: string) {
        this._text = value;
    }
}
