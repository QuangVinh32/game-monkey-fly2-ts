export default class UIScene extends Phaser.Scene {
    private levelId: number = 0;
    private score: number = 0;
    private totalScore: number = 0;

    private readonly SCORE_TEXT_X_POSITION = 10;
    private readonly SCORE_TEXT_Y_POSITION = 14;
    private readonly SCORE_FONT_SIZE = '18px Inter';

    constructor() {
        super("UIScene");
    }

    init(data: { levelId: number, score: number }) {
        this.levelId = data.levelId || 0;
        this.score = data.score || 0; 

         if (this.levelId === 1) {
            this.totalScore = 0;
        }

        if (!isNaN(this.score)) {
            this.totalScore += this.score;
        } else {
            console.error("Score is invalid: ", this.score);
        }
    }

    create() {

        this.add.text(
            this.SCORE_TEXT_X_POSITION, 
            this.SCORE_TEXT_Y_POSITION, 
            `Score: ${this.totalScore}`, { 
                fontSize: this.SCORE_FONT_SIZE, 
                // fontStyle: "bold", 
                fontFamily: 'Inter',
                fontStyle: 'italic',
                color: 'black',
            }
        )
        .setResolution(2);
    }
}
