import QuestionDTO from "../dtos/QuestionDTO";
import BaseView from "./BaseView";

export default class QuestionView extends BaseView {
    public questionData: QuestionDTO;
    private textQuestion: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, questionData: QuestionDTO) {
        super(scene);
        this.questionData = questionData;
        this.createQuestion();
        this.setViewPosition(questionData.positionX,questionData.positionY);
        this.animateQuestion(); 
    }

    private createQuestion(): void {
        this.textQuestion = this.scene.add.text(0,0, this.questionData.text, {
            fontSize: '20px Arial',
            color: 'black',
            fontStyle: "bold"
        });
        this.add(this.textQuestion);
    }
    private animateQuestion(): void {
        this.scene.tweens.add({
            targets: this.textQuestion,
            x: this.questionData.positionX, 
            duration: 1000, 
            ease: 'Power2.easeInOut', 
            yoyo: true, 
            onYoyo: () => {
                this.setViewPosition(this.questionData.positionX, this.questionData.positionY);
            },
            onComplete: () => {
                // console.log('Animation completed');
            }
        });
    }

}
