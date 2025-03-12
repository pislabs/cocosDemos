import { _decorator, Component, director, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Node })
  private enemySkillNode: Node = null; //绑定enemy_skill节点

  @property({ type: Label })
  private hintLabel: Label = null; // 绑定hint节点

  private enemyAttackType = 0; // 敌人招式 0:弓箭；1:流星锤；2:盾牌
  private timer = null; // 计时器

  start() {
    this.timer = setInterval(() => {
      this.randEnemyAttack();
    }, 100);
  }

  update(deltaTime: number) {}

  // 重新加载场景
  restart() {
    director.loadScene("Game");
  }

  // 出招按钮响应函数
  attach(event, customEventData) {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;

    let pkRes = 0; // 0: 平，1:赢， -1: 输
    let attackType = event.target.name; // 获取目标节点的name

    if (attackType == 0) {
      if (this.enemyAttackType == 0) {
        pkRes = 0;
      } else if (this.enemyAttackType == 1) {
        pkRes = 1;
      } else if (this.enemyAttackType == 2) {
        pkRes = -1;
      }
    } else if (attackType == 1) {
      if (this.enemyAttackType == 0) {
        pkRes = -1;
      } else if (this.enemyAttackType == 1) {
        pkRes = 0;
      } else if (this.enemyAttackType == 2) {
        pkRes = 1;
      }
    } else if (attackType == 2) {
      if (this.enemyAttackType == 0) {
        pkRes = 1;
      } else if (this.enemyAttackType == 1) {
        pkRes = -1;
      } else if (this.enemyAttackType == 2) {
        pkRes = 0;
      }
    }

    if (pkRes == -1) {
      this.hintLabel.string = "失败";
    } else if (pkRes == 1) {
      this.hintLabel.string = "胜利";
    } else {
      this.hintLabel.string = "平局";
    }
  }

  // 敌人随机招式
  randEnemyAttack() {
    this.enemyAttackType = Math.floor(Math.random() * 3); // 给敌人随机招式

    let children = this.enemySkillNode.children; // 获取enemySkillNode下的所有子节点
    // 如果节点名字与随机招式的编号一致则显示，否则将节点进行隐藏
    children.forEach((childNode) => {
      if (childNode.name === this.enemyAttackType.toString()) {
        childNode.active = true;
      } else {
        childNode.active = false;
      }
    });
  }
}
