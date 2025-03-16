import {
  _decorator,
  Component,
  Node,
  Label,
  Input,
  input,
  Tween,
  tween,
  Vec3,
  director,
  Sprite,
  ParticleSystem2D,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Node })
  private bulletNode: Node = null; // 绑定bullet节点
  private bulletTween: Tween<Node> = null; // 绑定bullet缓动对象

  @property({ type: Node })
  private enemyNode: Node = null; // 绑定enemy节点
  private enemyTween: Tween<Node> = null; // 绑定enemy缓动对象

  @property({ type: Label })
  private scoreLabel: Label = null; // 绑定scoreLabel节点
  private score: number = 0; // 绑定score变量

  @property({ type: Node })
  private boomNode: Node = null; // 绑定boom节点

  private gameState: number = 0; // 0: 子弹未发射，1:子弹已发射，2:游戏结束

  start() {
    // 手指落在目标节点区域时
    this.node.on(Input.EventType.TOUCH_START, this.fire, this);

    this.newRound();
  }

  update(deltaTime: number) {
    this.checkHit(); // 检测子弹是否击中目标节点
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.fire, this);
  }

  // 新一轮游戏
  newRound() {
    this.initEnemy(); // 初始化enemy节点
    this.initBullet(); // 初始化bullet节点

    this.gameState = 0; // 重置游戏状态变量
  }

  initEnemy() {
    if (this.enemyTween != null) {
      this.enemyTween.stop(); // 停止enemy缓动
    }

    let stPos = new Vec3(300, 260, 0); // 初始位置
    stPos.y = stPos.y + Math.random() * 100; // 随机位置
    if (Math.random() > 0.5) {
      stPos.x = -stPos.x; // 随机方向
    }

    let duration = 1.5 - Math.random() * 0.5; // 缓动时间

    this.enemyNode.setPosition(stPos); // 设置初始位置
    this.enemyNode.active = true; // 显示目标节点

    this.enemyTween = tween(this.enemyNode) // 指定缓动对象
      .to(duration, { position: new Vec3(-stPos.x, stPos.y, 0) }) // 对象在duration秒内移动到目标位置
      .to(duration, { position: new Vec3(stPos.x, stPos.y, 0) }) // 对象在duration秒内移动到目标位置
      .union() // 合并缓动对象
      .repeatForever() // 循环播放
      .start(); // 启动缓动
  }

  initBullet() {
    let stPos = new Vec3(0, -340, 0); // 初始位置

    this.bulletNode.setPosition(stPos); // 设置初始位置
    this.bulletNode.active = true; // 显示子弹节点
  }

  // 发射子弹
  fire() {
    if (this.gameState != 0) return; // 字典已发射

    this.gameState = 1; // 修改子弹发射标记变量

    console.log("发射子弹");

    this.bulletTween = tween(this.bulletNode) // 指定缓动对象
      .to(0.6, { position: new Vec3(0, 600, 0) }) // 对象在0.6s内移动到目标位置
      .call(() => {
        this.gameOver(); // 子弹击中目标节点后游戏结束
      })
      .start(); // 启动缓动
  }

  // 播放例子效果
  boom(pos, color) {
    this.boomNode.setPosition(pos);

    // 获取组件方法 getComponent
    let particle = this.boomNode.getComponent(ParticleSystem2D);

    // 注意-样例代码错误
    if (color != undefined) {
      particle.startColor = particle.endColor = color;
    }

    particle.resetSystem();
  }

  gameOver() {
    console.log("游戏结束");
    this.gameState = 2; // 修改游戏结束标记变量

    // 播放粒子，子弹的颜色
    let bulletColor = this.bulletNode.getComponent(Sprite).color;
    this.boom(this.bulletNode.position, bulletColor);

    // 延时1s，用于播放粒子
    setTimeout(() => {
      // 重新加载场景
      director.loadScene("Game", (err, scene) => {});
    }, 1000);
  }

  // 检测命中
  checkHit() {
    if (this.gameState != 1) return; // 子弹处于发射状态时才执行后续的逻辑

    let dis = Vec3.distance(this.bulletNode.position, this.enemyNode.position); // 计算子弹与目标节点的距离

    if (dis < 50) {
      this.bulletTween.stop(); // 停止子弹缓动
      this.enemyTween.stop(); // 停止enemy缓动
      this.gameState = 2; // 修改游戏结束标记变量

      this.bulletNode.active = false; // 隐藏子弹节点
      this.enemyNode.active = false; // 隐藏目标节点

      this.incScore(); // 增加分数
      this.newRound(); // 开始新一轮游戏
    }
  }

  incScore() {
    this.score++;
    this.scoreLabel.string = String(this.score); // 更新scoreLabel节点显示
  }
}
