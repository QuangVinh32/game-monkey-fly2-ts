import { BaseView } from 'mct-commom';
import { BallDTO } from '../dtos/BallDTO';
// import BaseView from './BaseView';

export default class BallView extends BaseView {
    public ballData: BallDTO;
    private ball: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, ballData: BallDTO) {
        super(scene);
        this.ballData = ballData;
        this.createBall();
        this.setViewPosition(ballData.positionX, ballData.positionY);
        this.updateContainerSize(ballData.width, ballData.height);
    }

    private createBall(): void {
        this.ball = this.scene.physics.add.sprite(
            0,
            0,
            this.ballData.texture
        )
        .setDisplaySize(this.ballData.width, this.ballData.height)
        .setOrigin(0.5, 0.5);
        // console.log('Ball created at:', this.ballData.texture);
        this.add(this.ball);
    }
}
