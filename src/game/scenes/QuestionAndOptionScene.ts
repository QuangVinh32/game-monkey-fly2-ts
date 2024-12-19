import OptionDTO from "../dtos/OptionDTO";
import { MonkeyService } from "../services/MonkeyService";
import QuestionService from "../services/QuestionService";
import OptionView from "../views/OptionView";

export class QuestionAndOptionScene extends Phaser.Scene{
    public successSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    public failureSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private questionService: QuestionService | null = null;
    private monkeyService: MonkeyService | null;
    private levelId: number;
    private score: number;

    constructor(){
        super("QuestionAndOptionScene")
    }

    preload() { 
        this.load.image('button_choice', 'assets/images/button_choice.png');
 
        this.load.audio('sound_success', 'assets/audio/sound_success.mp3');
        this.load.audio('sound_failure', 'assets/audio/sound_failure.mp3');
    }

    init(data: {levelId: number,score: number}) {
        this.levelId = data.levelId;
        this.score = data.score
        console.log(data.score)
    }

    async create(){

        this.successSound = this.sound.add("sound_success", {
            volume: 3,
        });
        this.failureSound = this.sound.add("sound_failure", {
            volume: 3,
        });

        this.questionService = new QuestionService(this,"assets/data/question.json");
        await this.questionService.initialize(this.levelId);

        this.monkeyService = new MonkeyService(this, 'assets/data/monkey.json');
        await this.monkeyService.initialize(this.levelId);

        const monkeysAtLevel = this.monkeyService.getMonkeysByLevelId(this.levelId);
        console.log("monkeysAtLevel",monkeysAtLevel)
        const monkeyCount = monkeysAtLevel.length
        console.log(`Level ${this.levelId}: MonkeyCount = ${monkeyCount}`);

        const options = [];
        // const maxMonkeys = 5;

        options.push(this.score);
        
        while (options.length < 4) {
            const randomValue = Phaser.Math.Between(0, monkeyCount);
            if (!options.includes(randomValue)) {
                options.push(randomValue);
            }
        }
            Phaser.Utils.Array.Shuffle(options);
            
            options.forEach((value, index) => {
                const x = 125 + index * 150; 
                const y = 395;             
                const width = 110;           
                const height = 110;          
                const isAnswer = value === this.score; 
            
                const optionDTO = new OptionDTO(
                    index,        
                    isAnswer,    
                    value,        
                    this.levelId, 
                    x,            
                    y,            
                    width,        
                    height    
                );
            
                const optionView = new OptionView(this, optionDTO);
                optionView.setPosition(x, y);
                this.add.existing(optionView);
            
                optionView.buttonOption.on("pointerup", () => {
                    this.checkAnswer(this.score, optionDTO);
                });
            });
    }

    checkAnswer(currentCount: number, optionDTO: OptionDTO): void {
        if (currentCount === optionDTO.value) {
            console.log("Đúng!");
            if (this.successSound) {
                this.successSound.play();
            }
            console.log("Chuyển sang LevelScene với levelId:", this.levelId);
            this.scene.launch('UIScene',{levelId: this.levelId, score: this.score})
            this.scene.launch('TrueScene',{levelId: this.levelId, score: this.score})
            this.scene.stop('QuestionAndOptionScene')

        } else {
            console.log("Sai!");
            if (this.failureSound) {
                this.failureSound.play();
            }
            this.scene.launch("FalseScene", { levelId: this.levelId, score: this.score});
            this.scene.stop('QuestionAndOptionScene')
        }
    }

}

