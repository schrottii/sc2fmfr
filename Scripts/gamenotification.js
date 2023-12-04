class GameNotification
{
    constructor(text)
    {
        this.text = text;
        this.y = 0;
        this.lifeTime = 0;
    }

    static create(notification)
    {
        gameNotifications.push(notification);
    }

    remove()
    {
        gameNotifications = gameNotifications.filter(nf => nf !== this);
    }

    tick(delta)
    {
        this.lifeTime += delta;

        if(this.lifeTime < 0.5)
        {
            this.y = this.lifeTime * 2 * h * 0.15;
        }
        else if(this.lifeTime > 2.5)
        {
            this.y = (3 - this.lifeTime) * 2 * h * 0.15;
        }
        else
        {
            this.y = h * 0.15;
        }

        if(this.lifeTime > 3.25)
        {
            this.remove();
        }
    }

    renderBackground(ctx)
    {
        ctx.drawImage(images.gameNotifaction, w * 0.25, this.y - h * 0.125, w * 0.5, h * 0.125);
    }

    setDefaultFont(ctx)
    {
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + (h * 0.03) + "px " + fonts.default;
    }

    render(ctx)
    {
        this.renderBackground(ctx);

        this.setDefaultFont(ctx);
        ctx.fillText(this.text, w / 2, this.y - h * 0.07, w * 0.4);
    }
}

class MergeQuestNotification extends GameNotification
{
    constructor(quest)
    {
        super("Merge Quest Complete!");
        this.barrelLvl = quest.barrelLvl;
        this.reward = quest.reward;
    }

    render(ctx)
    {
        super.renderBackground(ctx);

        super.setDefaultFont(ctx);
        ctx.fillText(tt("questcomplete"), w / 2, this.y - h * 0.09, w * 0.4);
        Barrel.renderBarrel(ctx, this.barrelLvl, w * 0.35, this.y - h * 0.0325, h * 0.05);

        ctx.fillStyle = "white";
        ctx.font = "bold " + (h * 0.05) + "px " + fonts.default;
        ctx.fillText(formatNumber(this.reward), w * 0.5, this.y - h * 0.0275);
        ctx.drawImage(images.mergeToken, w * 0.6, this.y - h * 0.05, h * 0.04, h * 0.04);
    }
}

class MasteryLevelUpNotification extends GameNotification
{
    constructor(level)
    {
        super("Mastery Level Up!");
        this.reward = game.mergeMastery.getMagnetBonus(level);
    }

    render(ctx)
    {
        super.renderBackground(ctx);

        super.setDefaultFont(ctx);
        ctx.fillText(this.text, w / 2, this.y - h * 0.09, w * 0.4);
        ctx.textAlign = "left";
        ctx.drawImage(images.magnet, w / 2 - w * 0.225, this.y - h * 0.06, h * 0.05, h * 0.05);
        ctx.fillText("+" + formatNumber(this.reward), w / 2 - w * 0.125, this.y - h * 0.03, w * 0.4);
    }
}

class MilestoneNotification extends GameNotification
{
    constructor(milestone)
    {
        for (i in game.milestones.achievements) {
            if (game.milestones.achievements[i].id == milestone) milestone = game.milestones.achievements[i];
        }
        super(tt("not_achievement"));
        this.title = game.settings.lang == "en" ? milestone.title : tta(0, ("" + milestone.id).padStart(3, "0"));
        this.iid = milestone.imageId;
    }

    render(ctx)
    {
        super.renderBackground(ctx);

        super.setDefaultFont(ctx);
        let iX = 256 * (this.iid % 10);
        let iY = 256 * Math.floor(this.iid / 10);
        ctx.drawImage(images.achievements.unlocked, iX, iY, 256, 256, h * 0.04, this.y - h * 0.064, 64, 64);

        Barrel.renderBarrel(ctx, 203, w / 2 - w * 0.2, this.y - h * 0.032, h * 0.04);
        ctx.fillText(this.text, w / 2, this.y - h * 0.09, w * 0.45);
        ctx.textAlign = "left";
        ctx.font = (h * 0.025) + "px " + fonts.default;
        ctx.fillText(this.title, w / 2 - w * 0.15, this.y - h * 0.03, w * 0.35);
    }
}

// Added in SC2FMFR 2.1 :)
// Parameter 1 is the Title (top), 2 is text (below)
class TextNotification extends GameNotification {
    constructor(title, text, img="none", b="0") {
        super(title);
        this.title = title;
        this.text = text;
        this.img = img;
        this.b = b;
    }

    render(ctx) {
        super.renderBackground(ctx);

        super.setDefaultFont(ctx);
        ctx.fillText(this.text, w / 2, this.y - h * 0.09, w * 0.45);
        ctx.font = (h * 0.025) + "px " + fonts.default;

        if (this.img != "none") {
            ctx.textAlign = "left";
            if (this.img != "barrel" && this.img != "barrelm") ctx.drawImage(images[this.img], w / 2 - w * 0.2, this.y - h * 0.064, h * 0.05, h * 0.05);
            else Barrel.renderBarrel(ctx, this.b - 1, w / 2 - w * 0.2, this.y - h * 0.032, h * 0.04);
            if (this.img == "barrelm") ctx.drawImage(images.masteryToken, w / 2 + w * 0.15, this.y - h * 0.06, h * 0.05, h * 0.05);
            ctx.fillText(this.title, w * 0.375, this.y - h * 0.03, w * 0.35);
        }
        else {
            ctx.textAlign = "center";
            ctx.fillText(this.title, w / 2, this.y - h * 0.03, w * 0.35);
        }
    } // :)
}