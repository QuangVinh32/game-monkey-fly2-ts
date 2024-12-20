import { MonkeyDTO } from "../dtos/MonkeyDTO";
import BaseView from "./BaseView";

export default class MonkeyView extends BaseView {

    public monkeyData: MonkeyDTO;
    private monkey: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, monkeyData: MonkeyDTO) {
        super(scene);
        this.monkeyData = monkeyData;
        this.createMonkey();
        this.setViewPosition(monkeyData.positionX, monkeyData.positionY);
        this.updateContainerSize(monkeyData.width, monkeyData.height)
    }

    private createMonkey(): void {
        this.monkey = this.scene.physics.add.sprite(
            0,         
            0,
            this.monkeyData.texture
        )
        .setDisplaySize(this.monkeyData.width, this.monkeyData.height)
        .setOrigin(0.5, 0.5);
        console.log("Monkey created at:", this.monkeyData.texture);
        this.add(this.monkey);
    }
    

}
