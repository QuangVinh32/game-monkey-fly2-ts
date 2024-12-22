import { BallService } from '../services/BallService';

const CONFIG = {
    TOTAL_GRID_WIDTH: 550,
    TOTAL_GRID_HEIGHT: 200,
    FONT_SIZE_TITLE: '30px Arial',
    FONT_SIZE_LABEL: '20px',
    FONT_SIZE_FOOTER: '12px',
    ROW_START_Y: 85,
    GRID_OFFSET: 25,
};

export class ResultScene extends Phaser.Scene {
    public levelId: number;
    private score: number;
    private levelScores: { [key: number]: number } = {}; 
    private dotCoordinates: { x: number; y: number; color: number; levelId: number }[] = [];
    private graphics: Phaser.GameObjects.Graphics;
    private ballService: BallService | null;

    constructor() {
        super('ResultScene');
    }

    init(data: { levelId: number; score: number }){
        this.levelId = data.levelId;
        this.score = data.score;

        if (this.levelId === 1) {
            this.levelScores = {};
            this.dotCoordinates = [];
        }

        this.levelScores[this.levelId] = this.score;  
        console.log(this.levelScores);
    }

    preload() {
        this.load.audio('sound_success', 'assets/audio/sound_success.mp3');
        this.load.audio('sound_failure', 'assets/audio/sound_failure.mp3');
    }

    async create() {
        this.add.text(this.scale.width / 2, this.scale.height / 50, 'Ballons Popped', { fontSize: '25px Arial', fontStyle: 'bold', color: 'black', 
        }).setOrigin(0.5, 0)
        .setResolution(2);

        this.ballService = new BallService(this, 'assets/data/ball.json');
        await this.ballService.initializeNoView(this.levelId);

        
        const levelIds = this.ballService.getUniqueLevelIds();
        const cols = levelIds.length; 
        console.log(`Cols (Number of unique levels) = ${cols}`);

        let maxBalls = 0;
        let maxLevel = levelIds[0];
        if (this.ballService) {
            levelIds.forEach(levelId => {
                const ballsAtLevel = this.ballService!.getBallsByLevelId(levelId);
                console.log(`Level ${levelId} có ${ballsAtLevel.length} bóng.`);
                if (ballsAtLevel.length > maxBalls) {
                    maxBalls = ballsAtLevel.length;
                    maxLevel = levelId;
                }
            });
        } else {
            console.error('BallService chưa được khởi tạo.');
        }

        const rows = maxBalls;

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000, 0.95);

        const gridStartX = 70;
        const gridStartY = 60;

        const cellWidth = CONFIG.TOTAL_GRID_WIDTH / cols; 
        const cellHeight = CONFIG.TOTAL_GRID_HEIGHT / rows;

        // const rows = 5;
        // Được tính bởi số level Id có trong data
        // const cols = 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = gridStartX + col * cellWidth;
                const y = gridStartY + row * cellHeight;

                if (col > 0) {
                    this.graphics.strokeLineShape(new Phaser.Geom.Line(x, y, x, y + cellHeight));
                }
                
                if (row < rows - 1) {
                    this.graphics.strokeLineShape(new Phaser.Geom.Line(x, y + cellHeight, x + cellWidth, y + cellHeight));
                }

                if (row === 0) {
                    this.graphics.strokeLineShape(new Phaser.Geom.Line(x, y, x + cellWidth, y));
                }
                this.graphics.strokeLineShape(new Phaser.Geom.Line(x + cellWidth, y, x + cellWidth, y + cellHeight));
            }
        }

        this.graphics.lineStyle(4, 0x000000, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(gridStartX + 5, gridStartY);
        this.graphics.lineTo(gridStartX + 5, gridStartY + rows * cellHeight);
        this.graphics.strokePath();

        this.graphics.lineStyle(4, 0x000000, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(gridStartX, gridStartY + rows * cellHeight - 5);
        this.graphics.lineTo(gridStartX + cols * cellWidth, gridStartY + rows * cellHeight - 5);
        this.graphics.strokePath();

        for (let row = 0; row <= rows; row++) {
            const number = rows - row;
            this.add.text(
                gridStartX - 20,
                gridStartY + row * cellHeight - 10,
                number.toString(),
                { fontSize: '18px Arial', color: 'black' }
            )
            .setResolution(2);
        }

        const fruitNames = [
            'yellow', 'green', 'blue', 'orange', 'red'
        ];

        for (let col = 0; col < cols; col++) {
            let textColor = 'black';
            const fruitName = fruitNames[col % fruitNames.length];

            if (fruitName === 'yellow') {
                textColor = 'yellow';
            } else if (fruitName === 'green') {
                textColor = 'green';
            } else if (fruitName === 'blue') {
                textColor = 'blue';
            } else if (fruitName === 'orange') {
                textColor = 'orange';
            } else if (fruitName === 'red') {
                textColor = 'red';
            }

            this.add.text(
                gridStartX + col * cellWidth + cellWidth - 20,
                gridStartY + rows * cellHeight + 10,
                fruitName,
                { fontSize: '15px Arial', color: textColor }
            );
            // .setResolution(2);
        }

        Object.keys(this.levelScores).forEach(levelId => {
            this.drawScoreDots(gridStartX, gridStartY, cellWidth, cellHeight, parseInt(levelId), this.levelScores[parseInt(levelId)]);
        });
    }

    drawScoreDots(startX: number, startY: number, cellWidth: number, cellHeight: number, levelId: number, score: number) {
        const dotRadius = 8;
    
        const colors: Record<number, number> = {
            1: 0xFFFF00, // Yellow
            2: 0x008000, // Green
            3: 0x0000FF, // Blue
            4: 0xFFA500, // Orange
            5: 0xFF0000  // Red
        };
    
        if (!colors[levelId]) {
            console.error(`Level ${levelId} is not supported.`);
            return;
        }
    
        const dotColor = colors[levelId] || 0x000000;
        const x = startX + (levelId - 1) * cellWidth + cellWidth; 
        const y = startY + (5 - score) * cellHeight; 
    
        console.log(`Vẽ điểm tại x: ${x}, y: ${y}`);
    
        this.dotCoordinates = this.dotCoordinates.filter(dot => dot.levelId !== levelId);
        this.dotCoordinates.push({ x, y, color: dotColor, levelId });
    
        this.add.circle(x, y, dotRadius, dotColor);
    
        if (this.dotCoordinates.length > 1) {
            const prevDot = this.dotCoordinates[this.dotCoordinates.length - 2];
            if (prevDot.levelId === levelId - 1) {
                this.graphics.lineStyle(4, prevDot.color, 1);
                this.graphics.lineBetween(prevDot.x, prevDot.y, x, y);
            }
        }
    }
    
}
