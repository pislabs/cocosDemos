import { _decorator, Component, Label, Node, Animation } from "cc";
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

  @property({ type: Node })
  private nexBtnNode: Node = null;

  @property({ type: Animation })
  private bgAni: Animation = null;

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

    this.bgAni.on(Animation.EventType.FINISHED, this.bgAniFinish, this);

    let ani = this.enemyAreaNode.getComponent(Animation);
    ani.on(
      Animation.EventType.FINISHED,
      () => {
        this.turnNum = 0;
      },
      this
    );
  }

  bgAniFinish() {
    this.initEnemy();

    this.turnNum = 0;
    this.updatePlayerAp(this.playerMaxAp);
  }

  playerAttack() {
    if (this.turnNum != 0) return; // 不是自己的回合不能行动
    if (this.playerAp <= 0) return;

    this.playerAp--; // 消耗一个行动点
    this.playerMp += this.incrMp; // 自然法力恢复

    if (this.playerMp > this.playerMaxMp) {
      this.playerMp = this.playerMaxMp;
    }

    // 播放敌人受攻击动画
    let ani = this.enemyAreaNode.getComponent(Animation);
    ani.play("hurt");

    this.enemyHp -= this.playerArk;

    if (this.enemyHp <= 0) {
      this.enemyDie();
      return;
    }

    this.updateEnemyHp(this.enemyHp);
    this.updatePlayerAp(this.playerAp);
    this.updatePlayerMp(this.playerMp);

    this.checkEnemyAction();
  }

  playerHeal() {
    if (this.turnNum != 0) return; // 不是自己的回合不能行动
    if (this.playerAp <= 0 || this.playerMp < this.healMpCost) return;

    this.playerAp--; // 消耗一个行动点
    this.playerMp -= this.healMpCost; // 消耗法力值
    this.playerHp += this.healHp;

    if (this.playerHp > this.playerMaxHp) {
      this.playerHp = this.playerMaxHp;
    }

    this.updatePlayerHp(this.playerHp);
    this.updatePlayerAp(this.playerAp);
    this.updatePlayerMp(this.playerMp);

    this.checkEnemyAction();
  }

  checkEnemyAction() {
    if (this.turnNum == 0 && this.playerAp <= 0) {
      this.turnNum = 1;
      this.enemyAttack();
    }
  }

  enemyAttack() {
    const atk = this.enemyAtk;

    if (this.turnNum != 1) return; // 不是自己的回合不能行动

    this.playerHp--;
    this.updatePlayerHp(this.playerHp);

    // 播放玩家受攻击动画
    let ani = this.enemyAreaNode.getComponent(Animation);
    ani.play("attack");

    if (this.playerHp <= 0) {
      console.log("游戏结束");
      return;
    }

    // this.turnNum = 0;
    this.updatePlayerAp(this.playerMaxAp);
  }

  enemyDie() {
    this.enemyAreaNode.active = false;
    this.nexBtnNode.active = true;

    // this.nextRoom();
  }

  nextRoom() {
    console.log("进入下一个房间");

    let ani = this.enemyAreaNode.getComponent(Animation);
    ani.stop();

    this.bgAni.play("interlude");

    this.nexBtnNode.active = false;
  }

  //#region 初始化

  initEnemy() {
    this.updateEnemyHp(this.enemyMaxHp);
    this.enemyAreaNode.active = true;
  }

  initPlayer() {
    this.updatePlayerHp(this.playerMaxHp);
    this.updatePlayerAp(this.playerMaxAp);
    this.updatePlayerMp(this.playerMaxMp);
  }

  //#endregion

  //#region 修改

  updateEnemyHp(hp: number) {
    this.enemyHp = hp;
    this.enemyHpLabel.string = `${this.enemyHp}hp`;
  }

  updatePlayerHp(hp: number) {
    this.playerHp = hp;
    this.playerHpLabel.string = `HP\n${this.playerHp}`;
  }

  updatePlayerAp(ap: number) {
    this.playerAp = ap;
    this.playerApLabel.string = `AP\n${this.playerAp}`;
  }

  updatePlayerMp(mp: number) {
    this.playerMp = mp;
    this.playerMpLabel.string = `MP\n${this.playerMp}`;
  }

  //#endregion
}
