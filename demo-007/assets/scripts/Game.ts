import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  private playerMaxHp: number = 25; // 玩家最大血量
  private playerMaxAp: number = 3; // 玩家最大行动点
  private playerMaxMp: number = 10; // 玩家法力值上限
  private playerArk: number = 5; // 玩家攻击力
  private healMpCost: number = 8; // 恢复术法力消耗
  private healHp: number = 5; // 恢复术血量
  private incrMp: number = 2; // 法力恢复速度

  private enemyMaxHp: number = 25; // 敌人最大血量
  private enemyAtk: number = 3; // 敌人攻击力

  private playerHp: number = 0; // 玩家当前血量
  private playerAp: number = 0; // 玩家当前行动点
  private playerMp: number = 0; // 玩家当前法力值
  private enemyHp: number = 0; // 敌人当前血量

  private turnNum = 0; // 0: 玩家回合， 1: 敌人回合

  @property({ type: Node })
  private enemyAreaNode: Node = null;

  @property({ type: Label })
  private enemyHpLabel: Label = null;

  @property({ type: Label })
  private playerHpLabel: Label = null;
  @property({ type: Label })
  private playerApLabel: Label = null;
  @property({ type: Label })
  private playerMpLabel: Label = null;

  start() {
    this.initEnemy();
    this.initPlayer();
  }

  initEnemy() {
    this.updateEnemyHp(this.enemyMaxHp);
    this.enemyAreaNode.active = true;
  }

  updateEnemyHp(hp: number) {
    this.enemyHp = hp;
    this.enemyHpLabel.string = `${this.enemyHp}hp`;
  }

  initPlayer() {
    this.updatePlayerHp(this.playerMaxHp);
    this.updatePlayerAp(this.playerMaxAp);
    this.updatePlayerMp(this.playerMaxMp);
  }

  updatePlayerHp(hp: number) {
    this.playerHp = hp;
    this.playerHpLabel.string = `${this.playerHp}hp`;
  }
  updatePlayerAp(ap: number) {
    this.playerAp = ap;
    this.playerApLabel.string = `${this.playerAp}ap`;
  }
  updatePlayerMp(mp: number) {
    this.playerMp = mp;
    this.playerMpLabel.string = `${this.playerMp}mp`;
  }
}
