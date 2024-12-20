export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        const titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Thank you', {
            fontSize: '40px Arial',
            fontStyle: "bold",
            color: 'green'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titleText, 
            scaleX: 1.5,        
            scaleY: 1.5,      
            duration: 1000,     
            yoyo: true,       
            repeat: -1,         
            ease: 'Sine.easeInOut'
        });
    }
}
