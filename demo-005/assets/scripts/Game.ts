import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  RigidBody2D,
  Vec2,
  Collider2D,
  Contact2DType,
  Prefab,
  Vec3,
  instantiate,
  Label,
  director,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Node })
  private ballNode: Node = null;

  @property({ type: Node })
  private blocksNode: Node = null;

  @property({ type: Prefab })
  private blockPrefab: Prefab = null;
  private blockGap: number = 250; // 块之间的间隔

  private bounceSpeed: number = 0;
  private gameState: number = 0;

  @property({ type: Label })
  private scoreLabel: Label = null;
  private score: number = 0;

  start() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

    this.collisionHandler();

    this.ballNode.position = new Vec3(-250, 200, 0);
    this.initBlocks();
  }

  update(deltaTime: number) {
    if (this.gameState == 1) {
      this.moveAllBlocks(deltaTime);
    }
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
    const speed = -300 * dt; // 块移动速度

    this.blocksNode.children.forEach((block) => {
      const blockPos = block.position.clone();
      blockPos.x += speed;
      block.position = blockPos;

      this.checkBlockOut(block);
    });
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

  checkBlockOut(blockNode) {
    if (blockNode.position.x < -400) {
      const nextPosX = this.getLastBlockPosX() + this.blockGap;
      const nextPosY =
        (Math.random() > 0.5 ? 1 : -1) * (10 + 40 * Math.random());

      blockNode.position = new Vec3(nextPosX, nextPosY, 0);

      this.incScore();
    }

    if (this.ballNode.position.y < -700) {
      this.gameState = 2;
      director.loadScene("Game");
    }
  }

  onTouchStart() {
    if (this.bounceSpeed == 0) return;

    const rigidBody = this.ballNode.getComponent(RigidBody2D);
    rigidBody.linearVelocity = new Vec2(0, -this.bounceSpeed * 1.5); // 修改刚体移动速度
    this.gameState = 1;
  }

  collisionHandler() {
    const collider = this.ballNode.getComponent(Collider2D);
    const rigidBody = this.ballNode.getComponent(RigidBody2D);

    collider.on(
      Contact2DType.BEGIN_CONTACT,
      () => {
        if (this.bounceSpeed == 0) {
          // 记录第一次落地的速度
          this.bounceSpeed = Math.abs(rigidBody.linearVelocity.y);
        } else {
          // 将落地反弹的速度锁定为第一次落地的速度
          rigidBody.linearVelocity = new Vec2(0, this.bounceSpeed);
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
