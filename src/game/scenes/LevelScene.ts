import { BallService } from "../services/BallService";
import { MonkeyService } from "../services/MonkeyService";

export default class LevelScene extends Phaser.Scene {
    private monkeyService: MonkeyService | null;
    private ballService: BallService | null;
    private levelId: number;
    private score: number = 0;
    private completedCount: number = 0;
    private popSound: Phaser.Sound.BaseSound | null = null;
    private landSound: Phaser.Sound.BaseSound | null = null;
    private scenesLaunched: boolean = false;

    constructor() {
        super('LevelScene');
        this.levelId = 1;
    }

    init(data: { levelId: number}) {
        this.levelId = data.levelId || 1;
        this.completedCount = 0;
        this.score = 0;  
        this.scenesLaunched = false;

    }

    preload() {
        this.load.image('monkey_and_ball_yellow', 'assets/images/monkey_and_ball_yellow.png');
        this.load.image('monkey_yellow', 'assets/images/monkey_yellow.png');

        this.load.image('monkey_and_ball_green', 'assets/images/monkey_and_ball_green.png');
        this.load.image('monkey_green', 'assets/images/monkey_green.png');

        this.load.image('monkey_and_ball_blue', 'assets/images/monkey_and_ball_blue.png');
        this.load.image('monkey_blue', 'assets/images/monkey_blue.png');

        this.load.image('monkey_and_ball_orange', 'assets/images/monkey_and_ball_orange.png');
        this.load.image('monkey_orange', 'assets/images/monkey_orange.png');

        this.load.image('monkey_and_ball_red', 'assets/images/monkey_and_ball_red.png');
        this.load.image('monkey_red', 'assets/images/monkey_red.png');

        this.load.image('shadow', 'assets/images/shadow.png');


        this.load.audio('sound_pop','assets/audio/sound_pop.mp3');
        this.load.audio('sound_land','assets/audio/sound_land.mp3');
    }

    async create() {
        this.popSound = this.sound.add('sound_pop', { volume: 1 });
        this.landSound = this.sound.add('sound_land', { volume: 1 });

        // Initialize BallService and MonkeyService
        this.ballService = new BallService(this, 'assets/data/ball.json');
        await this.ballService.initialize(this.levelId);
    
        this.monkeyService = new MonkeyService(this, 'assets/data/monkey.json');
        await this.monkeyService.initialize(this.levelId);
    
        const allBalls = this.ballService.getAllBallDTOs().filter(ball => ball.levelId === this.levelId);
        const totalBalls = allBalls.length;

        allBalls.forEach(ballDTO => {
            const ballView = this.ballService?.getBallViewById(ballDTO.ballId);
            const monkeyView = this.monkeyService?.getMonkeyViewsByBallId(ballDTO.ballId)?.[0];

            if (ballView && monkeyView) {
                monkeyView.setPosition(ballView.x, ballView.y);

                let monkeyDropped = false;
                let ballClicked = false; 

                let shadow = this.add.image(monkeyView.x, monkeyView.y + 110, 'shadow').setOrigin(0.5, 0.5).setDisplaySize(monkeyView.width, monkeyView.height);
                shadow.setDepth(monkeyView.depth - 1);
                // shadow.setScale(0.75);
                // shadow.setAlpha(0.5); // Điều chỉnh độ trong suốt của bóng đổ

                this.tweens.add({
                    targets: ballView,
                    y: -165,
                    duration: Phaser.Math.Between(1000, 6000),
                    ease: 'Power1',
                    onUpdate: () => {
                        if (!monkeyDropped) {
                            monkeyView.y = ballView.y;
                        }
                    },
                    onComplete: () => {
                        ballView.setVisible(false);
                        // rect.setVisible(false);
                        if (!ballClicked) {
                            this.completedCount++;
                        }     
                        this.checkAllBallsCompleted(totalBalls);
                    }
                });

                ballView.setInteractive();
                ballView.on('pointerdown', () => {
                    if (this.popSound) {
                        this.popSound.play();
                    }

                    this.score++;
                    console.log(`Ball clicked: ${ballDTO.ballId}`);
                    this.handleBallComplete(ballView, monkeyView, totalBalls);

                    ballView.setVisible(false);
                    monkeyDropped = true;
                    ballClicked = true;

                    const monkeysToHide = this.monkeyService?.getMonkeyViewsByBallId(ballDTO.ballId);
                    if (monkeysToHide && monkeysToHide.length > 0) {
                        monkeysToHide.forEach(monkey => monkey.setVisible(false));
                    }

                    const linkedMonkeys = this.monkeyService?.getMonkeyViewsByBallId(ballDTO.ballId);
                    if (linkedMonkeys && linkedMonkeys.length > 0) {
                        linkedMonkeys.forEach(monkey => monkey.setVisible(true));
                    } else {
                        console.warn(`Không tìm thấy Monkey nào liên kết với ballId: ${ballDTO.ballId}`);
                    }
                    // shadow.setVisible(false);
                });
            }
        });
    }  

    private handleBallComplete(ballView: any, monkeyView: any, totalBalls: number) {
        ballView.setVisible(false); 

        this.tweens.add({
            targets: monkeyView,
            y: 530, 
            duration: 600,
            ease: 'Since.easeOut',
            onComplete: () => {
                if (this.landSound) {
                    this.landSound.play();
                }
                this.completedCount++;
                console.log(`Ball hoàn thành. Tổng số ball hoàn thành: ${this.completedCount}`);
                this.checkAllBallsCompleted(totalBalls); 
            }
        });
    }

    private checkAllBallsCompleted(totalBalls: number) {
        if (this.completedCount === totalBalls && !this.scenesLaunched) {
            console.log("Tất cả các ball đã hoàn thành!");
            this.scenesLaunched = true; 
            this.scene.launch("ResultScene", { score: this.score, levelId: this.levelId });
            this.scene.launch("QuestionAndOptionScene", { score: this.score, levelId: this.levelId });
        }
    }
}
