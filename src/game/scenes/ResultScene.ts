import { BallService } from "../services/BallService";

export class ResultScene extends Phaser.Scene {
    public levelId: number;
    private score: number;
    private levelScores: { [key: number]: number } = {}; 
    private dotCoordinates: { x: number; y: number; color: number; levelId: number }[] = [];
    private graphics: Phaser.GameObjects.Graphics;
     private ballService: BallService | null;
    

    constructor() {
        super("ResultScene");
    }

    init(data: { levelId: number; score: number }) {
        this.levelId = data.levelId;
        this.score = data.score;

        this.levelScores[this.levelId] = this.score;  
        console.log(this.levelScores);
    }

    preload() {
        this.load.audio('sound_success', 'assets/audio/sound_success.mp3');
        this.load.audio('sound_failure', 'assets/audio/sound_failure.mp3');
    }

    async create() {
        this.add.text(this.scale.width / 2, this.scale.height / 30, "Ballons Popped", { fontSize: '22px Arial', fontStyle: "bold", color: 'black' }).setOrigin(0.5, 0);

        // this.ballService = new BallService(this, 'assets/data/ball.json');
        // await this.ballService.initialize(this.levelId);

        // const levelIds = this.ballService.getUniqueLevelIds();
        // const cols1 = levelIds.length; 
        // console.log(`Cols (Number of unique levels) = ${cols1}`);


        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000, 0.75);

        const gridStartX = 100;
        const gridStartY = 60;
        const cellWidth = 105;
        const cellHeight = 40;
        const rows = 5;
        const cols = 5;

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

        // Show level numbers
        for (let row = 0; row <= rows; row++) {
            const number = rows - row;
            this.add.text(
                gridStartX - 20,
                gridStartY + row * cellHeight - 10,
                number.toString(),
                { fontSize: "18px Arial", color: 'black' }
            );
        }

        const fruitNames = [
            "yellow", "green", "blue", "orange", "red"
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
    
        // Kiểm tra nếu levelId không hợp lệ
        if (!colors[levelId]) {
            console.error(`Level ${levelId} is not supported.`);
            return;
        }
    
        // Vẽ dấu chấm tại vị trí (x, y) tùy theo levelId và score
        const dotColor = colors[levelId];
        const x = startX + (levelId - 1) * cellWidth + cellWidth; // Xác định vị trí theo levelId
        const y = startY + (5 - score) * cellHeight; // Y sẽ phụ thuộc vào điểm số
    
        console.log(`Vẽ điểm tại x: ${x}, y: ${y}`);
    
        // Lưu lại tọa độ dấu chấm
        this.dotCoordinates = this.dotCoordinates.filter(dot => dot.levelId !== levelId); // Xóa các dấu chấm cùng levelId
        this.dotCoordinates.push({ x, y, color: dotColor, levelId });
    
        // Vẽ dấu chấm
        this.add.circle(x, y, dotRadius, dotColor);
    
        // Nối dấu chấm với dấu chấm trước đó chỉ khi levelId liền kề
        if (this.dotCoordinates.length > 1) {
            const prevDot = this.dotCoordinates[this.dotCoordinates.length - 2];
            if (prevDot.levelId === levelId - 1) {
                // Nếu levelId hiện tại là kế tiếp levelId trước đó, vẽ đường nối
                this.graphics.lineStyle(2, prevDot.color, 1);
                this.graphics.lineBetween(prevDot.x, prevDot.y, x, y);
            }
        }
    }
    
}
