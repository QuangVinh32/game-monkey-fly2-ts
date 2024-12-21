import Boot from './scenes/Boot';
import MainGame from './scenes/Game';
import LoadingScene from './scenes/LoadingScene';
import MainMenu from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import PlayGameScene from './scenes/PlayGameScene';
import UIScene from './scenes/UIScene';
import LevelScene from './scenes/LevelScene';
import { ResultScene } from './scenes/ResultScene';
import { QuestionAndOptionScene } from './scenes/QuestionAndOptionScene';
import { TrueScene } from './scenes/TrueScene';
import { FalseScene } from './scenes/FalseScene';
import { GameOverScene } from './scenes/GameOverScene';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 700,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#FFFFFF',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
            
    },

    pixelArt: false, // Tắt chế độ pixelArt nếu không cần, giữ ảnh sắc nét
    // resolution: 3,


    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            // debug: true,
            // debugShowVelocity: false
        }
    },
    scene: [
        Boot,
        MainMenu,
        MainGame,
        LoadingScene,
        PlayGameScene,
        UIScene,
        LevelScene,
        ResultScene,
        QuestionAndOptionScene,
        TrueScene,
        FalseScene,
        GameOverScene
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
