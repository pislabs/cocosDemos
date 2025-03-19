import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  resources,
  Texture2D,
  Vec2,
  Vec3,
} from "cc";
import { Block } from "./Block";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Prefab })
  private blockPrefab: Prefab = null; // 绑定block预制体

  @property({ type: Node })
  private bgNode: Node = null; // 绑定bg节点

  @property({ type: AudioManager })
  private audioManager: AudioManager = null;

  private blockNum: number = 2; // 拼图规模
  private picNodeArr: Node[][] = [];

  private hideBlockNode: Node = null;

  start() {
    this.loadPicture();

    director.on("click_pic", this.onClickPic, this);
  }

  onClickPic(nowIndex) {
    let dirs = [
      new Vec2(0, 1),
      new Vec2(0, -1),
      new Vec2(-1, 0),
      new Vec2(1, 0),
    ];

    let nearBlockNode: Node;
    let nearBlockIndex: Vec2;

    // 检查上下左右是否有位置可以移动
    for (let dir of dirs) {
      let nearIndex = nowIndex.clone().add(dir);

      if (
        nearIndex.x < 0 ||
        nearIndex.x >= this.blockNum ||
        nearIndex.y < 0 ||
        nearIndex.y >= this.blockNum
      ) {
        continue;
      }

      let blockNode = this.picNodeArr[nearIndex.y][nearIndex.x];
      if (!blockNode || blockNode.active) continue;

      nearBlockNode = blockNode;
      nearBlockIndex = nearIndex.clone();
    }

    if (nearBlockNode) {
      this.swapPicByPos(nowIndex, nearBlockIndex);

      this.checkComplete();
    }

    this.audioManager.playSound();
  }

  checkComplete() {
    let rightCount = 0;
    for (let i = 0; i < this.blockNum; i++) {
      for (let j = 0; j < this.blockNum; j++) {
        const blockNode = this.picNodeArr[i][j];
        const blockNodeScript = blockNode.getComponent("Block") as Block;

        if (blockNodeScript.nowIndex.equals(blockNodeScript.initIndex)) {
          rightCount++;
        }
      }
    }

    if (rightCount == this.blockNum * this.blockNum) {
      this.hideBlockNode.active = true;
      console.log("游戏结束");
    }
  }

  loadPicture() {
    let pic_num = Math.floor(Math.random() * 2) + 1;

    resources.load(`pic_${pic_num}/texture`, Texture2D, (err, texture) => {
      if (err) {
        console.error(err);
        return;
      }

      this.initGame(texture);
      this.removeOnePic();
      this.randPic();
    });
  }

  initGame(texture) {
    let blockSize = texture.image.width / this.blockNum;

    this.picNodeArr = [];
    for (let i = 0; i < this.blockNum; i++) {
      this.picNodeArr[i] = [];

      for (let j = 0; j < this.blockNum; j++) {
        const blockNode = instantiate(this.blockPrefab);

        const blockScript = blockNode.getComponent("Block") as Block;
        blockScript.init(texture, blockSize, new Vec2(j, i));

        blockNode.setPosition(new Vec3(j * blockSize, -i * blockSize, 0));

        this.picNodeArr[i][j] = blockNode;
        this.bgNode.addChild(blockNode);
      }
    }
  }

  removeOnePic() {
    let picNode = this.picNodeArr[this.blockNum - 1][this.blockNum - 1];
    picNode.active = false;
    this.hideBlockNode = picNode;
  }

  randPic() {
    let swapTimes = 100; // 随机次数

    for (let i = 0; i < swapTimes; i++) {
      let dirs = [
        new Vec2(0, 1),
        new Vec2(0, -1),
        new Vec2(1, 0),
        new Vec2(-1, 0),
      ];

      let randDir = dirs[Math.floor(Math.random() * dirs.length)];
      let hideBlockNodeScript = this.hideBlockNode.getComponent(
        "Block"
      ) as Block;

      let nearIndex = hideBlockNodeScript.nowIndex.clone().add(randDir);

      if (
        nearIndex.x < 0 ||
        nearIndex.x >= this.blockNum ||
        nearIndex.y < 0 ||
        nearIndex.y >= this.blockNum
      ) {
        continue;
      }

      this.swapPicByPos(hideBlockNodeScript.nowIndex, nearIndex);
    }
  }

  // 交换两个位置的拼图块
  swapPicByPos(nowPos: Vec2, desPos: Vec2) {
    if (nowPos.x === desPos.x && nowPos.y === desPos.y) return;

    let nowPicNode = this.picNodeArr[nowPos.y][nowPos.x];
    let desPicNode = this.picNodeArr[desPos.y][desPos.x];

    let tempPos = nowPicNode.position.clone();
    nowPicNode.position = desPicNode.position.clone();
    desPicNode.position = tempPos;

    let nowPicNodeScript = nowPicNode.getComponent("Block") as Block;
    let desPicNodeScript = desPicNode.getComponent("Block") as Block;
    let tempIndx = nowPicNodeScript.nowIndex.clone();
    nowPicNodeScript.nowIndex = desPicNodeScript.nowIndex;
    desPicNodeScript.nowIndex = tempIndx;

    this.picNodeArr[nowPos.y][nowPos.x] = desPicNode;
    this.picNodeArr[desPos.y][desPos.x] = nowPicNode;
  }
}
