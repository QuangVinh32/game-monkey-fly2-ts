import { BallController } from '../controllers/BallController';
import { BallDTO } from '../dtos/BallDTO';
import BallView from '../views/BallView';
import BaseService from './BaseService';

export class BallService extends BaseService<BallDTO> {
    private controller: BallController;
    private ballViews: BallView[] = [];

    constructor(scene: Phaser.Scene, jsonPath: string) {
        super(scene, jsonPath);
        this.controller = new BallController();
    }

    private mapBalls(data: any): BallDTO[] {
        const balls = Array.isArray(data.balls) ? data.balls : [];
        if (!balls.length) {
            console.error('Invalid or missing balls data:', data.balls);
        }

        // console.log('Mapped balls:', balls);

        return balls.map((ballData: any) => new BallDTO(
            ballData.ballId,
            ballData.positionX,
            ballData.positionY,
            ballData.width,
            ballData.height,
            ballData.texture,
            ballData.speed,
            ballData.levelId
        ));
    }

    public async initialize(levelId: number): Promise<void> {
        const data = await this.loadData();
        const balls = this.mapBalls(data); 
        balls.forEach(ball => this.controller.addItem(ball)); 
        const levelBalls = balls.filter(ball => ball.levelId === levelId); 
        if (levelBalls.length === 0) {
            console.warn(`No balls found for levelId: ${levelId}`); 
        } else {
            levelBalls.forEach(ball => this.createBallView(ball)); 
        }
    }

    public async initializeNoView(levelId: number): Promise<void> {
        const data = await this.loadData();
        const balls = this.mapBalls(data); 
        balls.forEach(ball => this.controller.addItem(ball)); 
        const levelBalls = balls.filter(ball => ball.levelId === levelId); 
        if (levelBalls.length === 0) {
            console.warn(`No balls found for levelId: ${levelId}`); 
        } else {
            // levelBalls.forEach(ball => this.createBallView(ball)); 
        }
    }

    public getBallDTOById(ballId: number): BallDTO | undefined {
        return this.controller.getItemByProperty('ballId', ballId); 
    }

    public getBallsByLevelId(levelId: number): BallDTO[] {
        return this.controller.getAllItems().filter(ball => ball.levelId === levelId);
    }

    public getAllBallDTOs(): BallDTO[] {
        return this.controller.getAllItems();
    }

    public createBallView(ballData: BallDTO): void {
        const ballView = new BallView(this.scene, ballData); 
        this.ballViews.push(ballView);
    }

    public getAllBallViews(): BallView[] { 
        return this.ballViews; 
    }

    public getBallViewById(ballId: number): BallView | undefined {
        const ballView = this.ballViews.find(view => view.ballData.ballId === ballId);
        // console.log(`Tìm thấy BallView: ${ballView ? 'Có' : 'Không'} cho ballId: ${ballId}`);
        return ballView || undefined;
    }

    public getUniqueLevelIds(): number[] {
        const balls = this.controller.getAllItems();
        const levelIds: number[] = [];
        balls.forEach(ball => {
            if (!levelIds.includes(ball.levelId)) {
                levelIds.push(ball.levelId);
            }
        });
        return levelIds;
    }
}
