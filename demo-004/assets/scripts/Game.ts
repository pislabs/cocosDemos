import {
  _decorator,
  Component,
  Node,
  EventTarget,
  Input,
  input,
  Tween,
  tween,
  Vec3,
  Director,
} from "cc";
const { ccclass, property } = _decorator;

const eventTarget = new EventTarget();

@ccclass("Game")
export class Game extends Component {
  private user_exp = 0; // 用户经验

  @property({ type: Node })
  private bulletNode: Node = null; // 绑定bullet节点
  private bulletTween: Tween<Node> = null; // 绑定bullet缓动对象

  @property({ type: Node })
  private enemyNode: Node = null; // 绑定enemy节点
  private enemyTween: Tween<Node> = null; // 绑定enemy缓动对象

  private gameState: number = 0; // 0: 子弹未发射，1:子弹已发射，2:游戏结束

  protected onLoad(): void {
    eventTarget.on("incr_exp", (exp) => {
      this.user_exp += exp;

      console.log("获得了" + exp + "点经验，当前经验值：" + this.user_exp);
    });

    // 手指落在目标节点区域时
    input.on(Input.EventType.TOUCH_START, this.fire, this);

    this.initEnemy(); // 初始化enemy节点
  }

  initEnemy() {
    let stPos = new Vec3(300, 260, 0); // 初始位置
    let duration = 1.5; // 缓动时间

    this.enemyNode.setPosition(stPos); // 设置初始位置
    this.enemyNode.active = true; // 显示目标节点

    this.enemyTween = tween(this.enemyNode) // 指定缓动对象
      .to(duration, { position: new Vec3(-stPos.x, stPos.y, 0) }) // 对象在duration秒内移动到目标位置
      .to(duration, { position: new Vec3(stPos.x, stPos.y, 0) }) // 对象在duration秒内移动到目标位置
      .union() // 合并缓动对象
      .repeatForever() // 循环播放
      .start(); // 启动缓动
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.fire, this);
  }

  start() {
    eventTarget.emit("incr_exp", 5);

    setInterval(() => {
      eventTarget.emit("incr_exp", 1);
    }, 1000);
  }

  update(deltaTime: number) {
    this.checkHit(); // 检测子弹是否击中目标节点
  }

  // 发射子弹
  fire() {
    if (this.gameState != 0) return; // 字典已发射

    this.gameState = 1; // 修改子弹发射标记变量

    console.log("发射子弹");

    tween(this.bulletNode) // 指定缓动对象
      .to(0.6, { position: new Vec3(0, 600, 0) }) // 对象在0.6s内移动到目标位置
      .call(() => {
        this.gameOver(); // 子弹击中目标节点后游戏结束
      })
      .start(); // 启动缓动
  }

  gameOver() {
    console.log("游戏结束");

    this.gameState = 2; // 修改游戏结束标记变量
    Director.instance.loadScene("Game"); // 重新加载Game场景
  }

  // 检测命中
  checkHit() {
    if (this.gameState != 1) return; // 子弹处于发射状态时才执行后续的逻辑

    let dis = Vec3.distance(this.bulletNode.position, this.enemyNode.position); // 计算子弹与目标节点的距离

    if (dis < 50) {
      this.bulletTween.stop(); // 停止子弹缓动
      this.gameState = 2; // 修改游戏结束标记变量

      this.bulletNode.active = false; // 隐藏子弹节点
      this.enemyNode.active = false; // 隐藏目标节点
    }
  }
}
