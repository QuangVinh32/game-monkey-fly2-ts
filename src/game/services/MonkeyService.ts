import { MonkeyController } from '../controllers/MonkeyController';
import { MonkeyDTO } from '../dtos/MonkeyDTO';
import MonkeyView from '../views/MonkeyView';
import BaseService from './BaseService';

export class MonkeyService extends BaseService<MonkeyDTO>{

    private controller: MonkeyController;
    private monkeyViews: MonkeyView[] = [];

    constructor(scene: Phaser.Scene, jsonPath: string){
        super(scene, jsonPath)
        this.controller = new MonkeyController();
    }

    private mapMonkeys(data: any): MonkeyDTO[] {
        const monkeys = Array.isArray(data.monkeys) ? data.monkeys : [];
        if (!monkeys.length) {
            console.error('Invalid or missing monkeys data:', data.monkeys);
        }
    
        // console.log('Mapped monkeys:', monkeys);
    
        return monkeys.map((monkeyData: any) => new MonkeyDTO(
            monkeyData.monkeyId,
            monkeyData.positionX,
            monkeyData.positionY,
            monkeyData.width,
            monkeyData.height,
            monkeyData.texture,
            monkeyData.speed,
            monkeyData.ballId,
            monkeyData.levelId
        ));
    }

    public async initialize(levelId: number): Promise<void> {
        const data = await this.loadData();
        const monkeys = this.mapMonkeys(data); 
        monkeys.forEach(monkey => this.controller.addItem(monkey)); 
        const levelMonkeys = monkeys.filter(monkey => monkey.levelId === levelId);
        if (levelMonkeys.length === 0) {
            console.warn(`No monkeys found for levelId: ${levelId}`);
        } else {
            levelMonkeys.forEach(monkey => this.createMonkeyView(monkey));
        }        
    }
    
    public getMonkeyDTOById(monkeyId: number): MonkeyDTO | undefined {
        return this.controller.getItemByProperty('monkeyId', monkeyId); 
    }
    
    public getAllMonkeyDTOs(): MonkeyDTO[] {
        return this.controller.getAllItems();
    }
    public getMonkeysByLevelId(levelId: number): MonkeyDTO[] {
        return this.controller.getAllItems().filter(monkey => monkey.levelId === levelId);
    }
    
    public createMonkeyView(monkeyData: MonkeyDTO): void {
        const monkeyView = new MonkeyView(this.scene, monkeyData);
        monkeyView.setVisible(false);
        this.monkeyViews.push(monkeyView);
    }
    
    
    public getAllMonkeyViews(): MonkeyView[] { 
        return this.monkeyViews; 
    }
    
    public getMonkeyViewById(monkeyId: number): MonkeyView | undefined {
        const monkeyView = this.monkeyViews.find(view => view.monkeyData.monkeyId === monkeyId);
        // console.log(`Tìm thấy MonkeyView: ${monkeyView ? 'Có' : 'Không'} cho monkeyId: ${monkeyId}`);
        return monkeyView || undefined;
    }

    public getMonkeyViewBylevelId(levelId: number): MonkeyView | undefined {
        const monkeyView = this.monkeyViews.find(view => view.monkeyData.levelId === levelId);
        // console.log(`Tìm thấy MonkeyView: ${monkeyView ? 'Có' : 'Không'} cho LevelId: ${levelId}`);
        return monkeyView; 
    }

    public getMonkeyViewsByBallId(ballId: number): MonkeyView[] {
        // Lọc danh sách MonkeyView theo ballId
        const monkeys = this.monkeyViews.filter(
            view => view.monkeyData.ballId === ballId
        );
        // console.log(`Tìm thấy ${monkeys.length} MonkeyView liên kết với ballId: ${ballId}`);
        return monkeys;
    }
    
    
    
}