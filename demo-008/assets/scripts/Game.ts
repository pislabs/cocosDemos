import {
  _decorator,
  Collider,
  Component,
  director,
  input,
  Input,
  instantiate,
  Label,
  Node,
  Prefab,
  RigidBody,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Node })
  private ballNode: Node = null;

  @property({ type: Prefab })
  private blockPrefab: Prefab = null;

  @property({ type: Node })
  private blocksNode: Node = null;

  @property({ type: Label })
  private scoreLabel: Label = null;

  private bounceSpeed: number = 0;
  private gameState: number = 0;
  private blockGap: number = 2.4;
  private score: number = 0;

  start() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

    this.collisionHandler();

    // 设置小球初始位置，偏左上方
    this.ballNode.position = new Vec3(-0.5, 1.5, 0);

    this.initBlocks();
  }

  // update中向左移动跳板，看起来小球向右跑动
  update(deltaTime: number) {
    if (this.gameState == 1) {
      this.moveAllBlocks(deltaTime);
    }
  }

  onTouchStart() {
    if (this.bounceSpeed == 0) return;

    const rigidBody = this.ballNode.getComponent(RigidBody);
    rigidBody.setLinearVelocity(new Vec3(0, -this.bounceSpeed * 1.5, 0)); // 修改刚体移动速度
    this.gameState = 1;
  }

  initBlocks() {
    let posX;

    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        posX = this.ballNode.position.x;
      } else {
        posX = posX + this.blockGap;
      }

      this.createNewBlock(new Vec3(posX, 0, 0));
    }
  }

  createNewBlock(pos) {
    const blockNode = instantiate(this.blockPrefab);
    blockNode.position = pos;
    this.blocksNode.addChild(blockNode);
  }

  moveAllBlocks(dt) {
    const speed = -2 * dt; // 块移动速度

    this.blocksNode.children.forEach((block) => {
      const blockPos = block.position.clone();
      blockPos.x += speed;
      block.position = blockPos;

      this.checkBlockOut(block);
    });
  }

  checkBlockOut(blockNode) {
    if (blockNode.position.x < -3) {
      const nextPosX = this.getLastBlockPosX() + this.blockGap;
      //   const nextPosY =
      //     (Math.random() > 0.5 ? 1 : -1) * (10 + 40 * Math.random());
      blockNode.position = new Vec3(nextPosX, 0, 0);

      this.incScore();
    }

    if (this.ballNode.position.y < -4) {
      this.gameState = 2;
      director.loadScene("Game");
    }
  }

  getLastBlockPosX() {
    let lastBlockPosX = 0;
    this.blocksNode.children.forEach((block) => {
      if (block.position.x > lastBlockPosX) {
        lastBlockPosX = block.position.x;
      }
    });
    return lastBlockPosX;
  }

  collisionHandler() {
    const collider = this.ballNode.getComponent(Collider);
    const rigidBody = this.ballNode.getComponent(RigidBody);

    collider.on(
      "onCollisionEnter",
      () => {
        let vc = new Vec3(0, 0, 0);
        rigidBody.getLinearVelocity(vc);

        if (this.bounceSpeed == 0) {
          // 记录第一次落地的速度
          this.bounceSpeed = Math.abs(vc.y);
        } else {
          // 将落地反弹的速度锁定为第一次落地的速度
          rigidBody.setLinearVelocity(new Vec3(0, this.bounceSpeed, 0));
        }
      },
      this
    );
  }

  incScore() {
    this.score++;
    this.scoreLabel.string = String(this.score);
  }
}
