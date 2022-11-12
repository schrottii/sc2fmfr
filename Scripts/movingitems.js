class MovingItem
{
    constructor(x, y, w, h, img, move, oncollect)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.move = move ? move : this.move;
        this.oncollect = oncollect ? oncollect : this.oncollect;
        this.collected = false;
        this.timeSinceCollect = 0;
    }

    tick(delta)
    {
        if(currentScene.name !== "Loading")
        {
            this.render(ctx);
            this.move(delta);

            if(this.isHovered() && !this.collected)
            {
                this.oncollect();
            }
            if(this.collected)
            {
                this.timeSinceCollect += delta;
                this.w *= Math.pow(4, delta);
                this.h *= Math.pow(4, delta);
                if(this.timeSinceCollect > 0.5)
                {
                    this.destroy();
                }
            }
        }
    }

    isHovered()
    {
        return mousePressed && mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
                mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2;
    }

    oncollect()
    {
        this.collected = true;
        if(game.settings.lowPerformance)
        {
            this.destroy();
        }
    }

    destroy()
    {
        movingItems = movingItems.filter(item => item !== this);
    }

    move(delta)
    {

    }

    render(ctx)
    {
        if(this.collected)
        {
            ctx.globalAlpha = 1 - this.timeSinceCollect * (1 / 0.5);
            ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
            ctx.globalAlpha = 1;
        }
        else
        {
            ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        }
    }
}

class FallingItem extends MovingItem
{
    constructor(img, x, y, w, h, speed, acc, swizzle, oncollect)
    {
        super(x, y, w, h, img, undefined, oncollect);
        this.speed = speed;
        this.acc = acc;
        this.swizzle = swizzle;
    }

    move(delta)
    {
        if(this.collected)
        {
            this.speed /= Math.pow(2, delta * 5);
        }
        this.y += this.speed * delta;
        this.x += Math.sin(Date.now() / 500) * this.swizzle * delta;
        if(this.collected)
        {
            this.speed = 0;
            this.swizzle = 0;
        }
    }

    tick(delta)
    {
        if(currentScene.name !== "Loading")
        {
            this.speed += this.acc * delta;
            super.tick(delta);

            if (this.y > h + this.h / 2) this.destroy();
        }
    }
}

class JumpingItem extends MovingItem{
    constructor(img, x, y, w, h, xspeed, grav, oncollect)
    {
        super(x, y, w,h, img, undefined, oncollect);
        this.xspeed = xspeed;
        this.grav = grav;
        this.yspeed = 0;
    }

    move(delta)
    {
        this.x += this.xspeed * delta;
        this.yspeed += this.grav * delta;
        this.y += this.yspeed * delta;
        if(this.y >= h - this.h / 2 && this.yspeed > 0 && !this.collected)
        {
            this.yspeed *= -0.7;
        }
        if(this.collected)
        {
            this.xspeed = 0;
            this.yspeed = 0;
        }
    }

    tick(delta)
    {
        if(currentScene.name !== "Loading")
        {
            super.tick(delta);

            if (this.x > w + this.w / 2) this.destroy();
        }
    }
}

var movingItemFactory =
{
    fallingMagnet: (value) =>
    {
        movingItems.push(new FallingItem(images.movingItems.magnet, w * 0.15 + Math.random() * w * 0.7, -100, h * 0.15, h * 0.15, h * 0.2, h * 0.2, w * 0.2,
        function()
        {
            this.collected = true;
            if(game.settings.lowPerformance)
            {
                this.destroy();
            }
            game.magnets = game.magnets.add(value);
            currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, {color: "#ffffff", bold: true, size: 0.1, border: h * 0.01}))
        }))
    },
    jumpingTire: value =>
    {
        let dir = Math.random() > 0.5 ? -1 : 1;
        movingItems.push(new JumpingItem(images.movingItems.tire, dir === 1 ? 0 : w, -w * 0.2, h * 0.15, h * 0.15, h * 0.1 * dir * (0.7 + 0.3 * Math.random()), h * 0.75,
            function()
            {
                this.collected = true;
                if (game.milestones.unlocked.includes(89) == false && barrels[0] != undefined) {
                    if (barrels[0].level.toFixed(0) == 384) {
                        game.milestones.unlocked.push(89);
                        GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[89]));
                    }
                }
                if(game.settings.lowPerformance)
                {
                    this.destroy();
                }
                let v = value ? value : Decimal.round(game.tires.value);
                game.tires.amount = game.tires.amount.add(v);
                game.tires.value = game.tires.value.mul(applyUpgrade(game.tires.upgrades[1][0]));
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(v), this.x, this.y, {color: "#bbbbbb", bold: true, size: 0.1, border: h * 0.005}))
            }))
    },
    fallingBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.beam, w * 0.15 + Math.random() * w * 0.7, -100, h * 0.15, h * 0.15, h * (0.75 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.25, 0,
            function () {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                game.beams.amount = game.beams.amount.add(value);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    }
};
