import {
  _decorator,
  Component,
  director,
  Node,
  Rect,
  resources,
  Sprite,
  SpriteFrame,
  Texture2D,
  UITransform,
  Vec2,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Block")
export class Block extends Component {
  public initIndex = new Vec2(0, 0); // 初始位置下标
  public nowIndex = new Vec2(0, 0); // 初始位置下标

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onBlockTouch, this);
  }

  onBlockTouch() {
    director.emit("click_pic", this.nowIndex);
  }

  init(texture: Texture2D, blockSize: number, index: Vec2) {
    const sprite = this.getComponent(Sprite);

    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    spriteFrame.rect = new Rect(
      index.x * blockSize,
      index.y * blockSize,
      blockSize,
      blockSize
    );
    sprite.spriteFrame = spriteFrame;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(blockSize, blockSize);

    this.nowIndex = index;
    this.initIndex = index;
  }
}
