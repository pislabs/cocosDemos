import {
  _decorator,
  Component,
  Node,
  EventTarget,
  Input,
  input,
  tween,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

const eventTarget = new EventTarget();

@ccclass("Game")
export class Game extends Component {
  @property({ type: Node })
  private bulletNode: Node = null; // 绑定bullet节点

  private user_exp = 0; // 用户经验

  private gameState: number = 0; // 0: 子弹未发射，1:子弹已发射，2:游戏结束

  protected onLoad(): void {
    eventTarget.on("incr_exp", (exp) => {
      this.user_exp += exp;

      console.log("获得了" + exp + "点经验，当前经验值：" + this.user_exp);
    });

    // 手指落在目标节点区域时
    input.on(Input.EventType.TOUCH_START, this.fire, this);

    // 手指在屏幕上移动时
    input.on(
      Input.EventType.TOUCH_MOVE,
      (event) => {
        console.log("TOUCH_MOVE");
      },
      this
    );

    // 手指在目标节点内离开屏幕时
    input.on(
      Input.EventType.TOUCH_END,
      (event) => {
        console.log("TOUCH_END");
      },
      this
    );

    // 手指在目标节点区域外离开屏幕时
    input.on(
      Input.EventType.TOUCH_CANCEL,
      (event) => {
        console.log("TOUCH_CANCEL");
      },
      this
    );
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

  update(deltaTime: number) {}

  fire() {
    if (this.gameState != 0) return; // 字典已发射
    this.gameState = 1; // 修改子弹发射标记变量

    console.log("发射子弹");

    tween(this.bulletNode) // 指定缓动对象
      .to(0.6, { position: new Vec3(0, 600, 0) }) // 对象在0.6s内移动到目标位置
      .start(); // 启动缓动
  }
}
