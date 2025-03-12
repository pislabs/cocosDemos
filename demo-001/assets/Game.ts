import { _decorator, CCInteger, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  job: string = "法师";

  @property({ type: CCInteger })
  hp: number = 10;

  @property({ type: Label })
  label: Label = null; // 绑定Label节点

  start() {
    console.log("job: ", this.job);
    console.log("hp: ", this.hp);

    this.label.string = "Game Start";
  }

  update(deltaTime: number) {}
}
