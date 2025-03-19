import { _decorator, AudioClip, AudioSource, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  @property({ type: AudioClip })
  public clickClip: AudioClip = null;

  private audioSource: AudioSource;

  protected onLoad(): void {
    this.audioSource = this.getComponent(AudioSource);
  }

  playSound() {
    this.audioSource.playOneShot(this.clickClip, 1);
  }
}
