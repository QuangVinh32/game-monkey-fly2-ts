
export default class PlayGameScene extends Phaser.Scene {
    private buttonSound: Phaser.Sound.BaseSound | null = null;
    public levelId: number;
    private score: number;
    private isUISceneLaunched: boolean = false; 

    constructor() {
        super('PlayGameScene');
        // this.levelId = 1;
    }

    init(data: {levelId: number,score: number}) {
        this.levelId = data.levelId;
        this.score = data.score
    }

    preload() {
        this.load.image('button_start_big', 'assets/images/button_start_big.png');
        this.load.audio('sound_initial','assets/audio/sound_initial.mp3')
    }

    create() {
        this.buttonSound = this.sound.add('sound_initial', {
            volume: 1,
        });

        this.add.text(
            350,
            290,
            'Pop the ballons before the monkeys fly away.', {
            fontSize: '17px Arial',
            fontStyle: 'bold',
            color: 'black',
        }).setOrigin(0.5, 0); 
        
        this.add.text(
            360,
            320,
            "Select 'Start' to begin.", {
            fontSize: '15px Arial',
            color: 'black',
        }).setOrigin(0.5, 0);
        
        let buttonStart = this.add.image(0, 0, 'button_start_big').setDisplaySize(
            165,
            165
            );

        let startText = this.add.text(0, 0, 'Start', {
            fontSize: '40px Arial',
            fontStyle: 'bold',
            color: 'black',
        }).setOrigin(0.5, 0.5);
    
        let buttonContainer = this.add.container(
            this.scale.width / 2,
            this.scale.height / 4, 
            [buttonStart, startText]);
    
        buttonContainer.setSize(
            100,
            100
            ).setInteractive();
    
        buttonContainer.on('pointerup', () => {
            if (this.buttonSound) {
                this.buttonSound.play();
            }
    
            this.tweens.add({
                targets: buttonContainer,
                scale: { from: 1, to: 1.1 }, 
                duration: 300,
                yoyo: true,                 
                ease: 'Sine.easeInOut',    
                onComplete: () => {
                    if (!this.isUISceneLaunched) {
                        this.scene.launch('UIScene', { score: this.score });
                        this.isUISceneLaunched = true;
                    }
                    this.scene.start('LevelScene')
                    this.scene.stop('PlayGameScene');
                },
            });
        });
    }      
}
    