// @ts-nocheck
import { ColorRGBA, tweenManager, uiCanvas } from "gameApi";
export class AmazingTextUI {
    color;
    animeDuration;
    duringConfig = false;
    text;
    duringAnimation = false;
    ui = uiCanvas.createUI("Text");
    constructor(text, fontSize, offset, defaultShow, animeDuration, color) {
        this.color = color;
        this.animeDuration = animeDuration;
        this.setText(text);
        this.ui.color = color;
        this.ui.fontSize = fontSize;
        this.ui.anchorMin = this.ui.anchorMax = offset;
        this.ui.raycastEvent = true;
        this.ui.onPointerClick = mouseButton => {
            if (mouseButton === 0 &&
                !this.duringConfig &&
                !this.duringAnimation) {
                this.duringConfig = true;
            }
        };
        this.ui.onPointerEnter = () => {
            const { r, g, b, a } = this.color;
            if (this.duringAnimation)
                return;
            this.ui.color = new ColorRGBA(r, g, b, a * 0.5);
        };
        this.ui.onPointerExit = () => {
            if (this.duringAnimation)
                return;
            this.ui.color = this.color;
        };
        this.ui.enabled = defaultShow;
    }
    startAnimation() {
        this.ui.color = new ColorRGBA(this.color.r, this.color.g, this.color.b, 1);
        this.duringAnimation = true;
        this.duringConfig = false;
    }
    setText(text) {
        this.text = text;
        this.ui.text = `<b>${text}</b>`;
    }
    show(text) {
        if (this.ui.enabled)
            return;
        if (this.duringAnimation)
            return;
        this.startAnimation();
        this.ui.enabled = true;
        tweenManager
            .createFloatTween(0, text.length, "Linear", this.animeDuration, v => this.setText(text.slice(0, v)), () => {
            this.setText(text);
            this.duringAnimation = false;
        })
            .play();
    }
    hide() {
        if (!this.ui.enabled)
            return;
        if (this.duringAnimation)
            return;
        this.startAnimation();
        const text = this.text;
        tweenManager
            .createFloatTween(text.length, 0, "Linear", this.animeDuration, v => this.setText(text.slice(0, v)), () => {
            this.setText("");
            this.ui.enabled = false;
            this.duringAnimation = false;
        })
            .play();
    }
    toggle(text) {
        if (this.ui.enabled) {
            this.hide();
        }
        else {
            this.show(text);
        }
    }
    update(text) {
        if (this.ui.enabled && !this.duringAnimation && this.text !== text) {
            this.setText(text);
        }
    }
}
export default AmazingTextUI;
