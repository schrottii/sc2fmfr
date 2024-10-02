class PopUpText {
    constructor(text, x, y, cfg) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.lifeTime = 0;
        if (cfg) {
            this.color = cfg.color ? cfg.color : "#000000";
            this.size = cfg.size ? cfg.size : 0.02;
            this.speed = cfg.speed ? cfg.speed : 0.05;
            this.bold = cfg.bold ? cfg.bold : false;
            this.maxWidth = cfg.maxWidth ? cfg.maxWidth : undefined;
            this.border = cfg.border ? cfg.border : 0;
        }
        else {
            this.color = "#000000";
            this.size = 0.02;
            this.speed = 0.05;
            this.bold = false;
            this.maxWidth = undefined;
            this.border = 0;
        }
    }

    tick(delta) {
        this.y -= delta * this.speed * h;
        this.lifeTime += delta;
    }

    render(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let alphaMulti = this.color.length <= 7 ? 1 : parseInt(this.color.slice(-2), 16) / 255;
        let alpha = Math.floor(255 * Math.max(0, alphaMulti * (1 - (this.lifeTime * 1.5)))).toString(16);
        alpha = ("0" + alpha).slice(-2);
        ctx.fillStyle = this.color.substr(0, 7) + alpha;
        ctx.font = (this.bold ? "bold " : "") + (this.size * h) + "px " + fonts.default;
        ctx.strokeStyle = "#000000" + alpha;
        ctx.lineWidth = this.border;

        if (this.border > 0) {
            ctx.strokeText(this.text, this.x, this.y, this.maxWidth);
        }
        ctx.fillText(this.text, this.x, this.y, this.maxWidth);

        ctx.lineWidth = 0;
    }
}