import { _decorator, Component, find, Node, Button, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
  start() {
    const btnNode = find("/Canvas/bg/startBtn");
    btnNode.on(Button.EventType.CLICK, this.gameStart, this);
  }

  update(deltaTime: number) {}

  gameStart() {
    director.loadScene("Game");
  }
}
