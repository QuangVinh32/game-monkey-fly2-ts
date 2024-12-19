export class TrueScene extends Phaser.Scene{
    private buttonSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private levelId: number;
    private score: number;
    constructor(){
        super("TrueScene")
    }

    init(data: {levelId: number,score: number}) {
        this.levelId = data.levelId;
        this.score = data.score
    }

    preload(){
        this.load.image('button_start_small', 'assets/images/button_start_small.png');

    }
    
    create() {
        
        this.buttonSound = this.sound.add('sound_initial', {
            volume: 1,
        });

        this.add.text(
            350,
            310,
            'Good job.', {
            fontSize: "17px Arial",
            fontStyle: "bold",
            color: "black",
        }).setOrigin(0.5, 0); 
        
        this.add.text(
            350,
            335,
            "Let's try faster ballons.", {
            fontSize: "15px Arial",
            color: "black",
        }).setOrigin(0.5, 0);
        
        let buttonStart = this.add.image(0, 0, 'button_start_small').setDisplaySize(
            130,
            130
            );

        let startText = this.add.text(0, 0, 'Start', {
            fontSize: "30px Arial",
            fontStyle: "bold",
            color: "black",
        }).setOrigin(0.5, 0.5);
    
        let buttonContainer = this.add.container(
            this.scale.width / 2,
            this.scale.height / 4, 
            [buttonStart, startText]);
    
        buttonContainer.setSize(
            100,
            100
            ).setInteractive();
    
        buttonContainer.on("pointerup", () => {
            if (this.buttonSound) {
                this.buttonSound.play();
            }
    
            this.tweens.add({
                targets: buttonContainer,
                scale: { from: 1, to: 1.1 }, 
                duration: 300,
                yoyo: true,                 
                ease: "Sine.easeInOut",    
                onComplete: () => {
                    this.levelId += 1;
                    this.scene.start("LevelScene",{levelId: this.levelId})
                    // this.scene.launch("UIScene",{levelId: this.levelId,score: this.score})
                    this.scene.stop("ResultScene");
                    this.scene.stop("QuestionAndOptionScene");

                },
            });
        });
    }

}