class MovingItem
{
    constructor(x, y, w, h, img, autoType, move, oncollect)
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
        this.timeSinceSpawn = 0;
        this.autoTried = false;
        this.autoType = autoType;
    }

    tick(delta)
    {
        if(currentScene.name !== "Loading")
        {
            this.render(ctx);
            this.timeSinceSpawn += delta;
            if(this.mTime == undefined) this.move(delta);

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

    oncollect(isAuto=false)
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
        if (this.x < w * -1.5 || this.x > w * 1.5) this.destroy();

        if (this.img == images.movingItems.glitchbeam) {
            if (Math.random() > 0.99) {
                this.x = w * Math.random();
                this.y = h * Math.min(Math.random(), 0.6);
            }
            if (applyUpgrade(game.skillTree.upgrades.funnyGlitchBeams)) {
                if (Math.random() > 0.99) {
                    this.speed = h * (0.6 - applyUpgrade(game.beams.upgrades.slowerBeams));
                    this.swizzle = 0;
                }
                if (Math.random() > 0.995) {
                    this.speed = h * (0.6 - applyUpgrade(game.beams.upgrades.slowerBeams)) * (-1);
                }
                if (Math.random() > 0.997) {
                    this.speed *= 2.5;
                }
                if (Math.random() > 0.999) {
                    this.speed *= 0.5;
                }
                if (Math.random() > 0.999) {
                    this.swizzle = w * 0.5;
                    this.speed *= 0.8;
                }
                if (Math.random() > 0.9993) {
                    this.speed = 0;
                    this.acc = 0;
                }
                if (Math.random() > 0.9995) {
                    movingItemFactory.fallingGlitchBeam(Math.max(applyUpgrade(game.glitchbeams.upgrades.minimumValue), Math.ceil(Math.random() * getGlitchBeamValue())));
                }
                if (Math.random() > 0.9999) {
                    this.img = images.movingItems.goldenBeam;
                }
            }
        }
        if ((this.timeSinceSpawn >= 1 || this.y > h / 2) && !this.autoTried && game.collectors[this.autoType] != undefined && game.factory.tank.gte(1)) {
            if (Math.random() * 100 <= applyUpgrade(game.collectors[this.autoType])) {
                if (Math.random() * 100 <= applyUpgrade(game.screws.upgrades.fallingScrews)) movingItemFactory.fallingScrew(1);
                game.factory.tank = game.factory.tank.sub(1);
                this.oncollect(true);
            }
            this.autoTried = true;
        }
    }
}

class FallingItem extends MovingItem
{
    constructor(img, autoType, x, y, w, h, speed, acc, swizzle, oncollect, progress)
    {
        super(x, y, w, h, img, autoType, undefined, oncollect);
        this.speed = speed;
        this.acc = acc;
        this.swizzle = swizzle;
        this.progress = progress;
        this.autoType = autoType;
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

            if (this.y > h + this.h / 2) {
                if (applyUpgrade(game.glitchbeams.upgrades.repeat) < Math.random() * 100
                    || this.img == images.movingItems.magnet || this.img == images.goldenScrap) {
                    this.destroy();
                }
                else {
                    if (game.ms.includes(142) == false) {
                        game.ms.push(142);
                        GameNotification.create(new MilestoneNotificaion(143));
                    }
                    this.y = -1;
                    this.acc = 0;
                }
            }
        }
    }
}

class JumpingItem extends MovingItem{
    constructor(img, autoType, x, y, w, h, xspeed, grav, oncollect)
    {
        super(x, y, w, h, img, autoType, undefined, oncollect);
        this.xspeed = xspeed;
        this.grav = grav;
        this.yspeed = 0;
        this.autoType = autoType;
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


class StaticItem extends MovingItem {
    constructor(img, autoType, x, y, w, h, mTime, oncollect) {
        super(x, y, w, h, img, autoType, mTime, oncollect);
        this.mTime = mTime;
        this.time = 0;
        this.autoType = autoType;
    }

    move(delta) {
        this.x += 0;
    }

    tick(delta) {
        if (currentScene.name !== "Loading") {
            super.tick(delta);
            this.time += delta;
            if (this.time > this.mTime) this.destroy();
        }
    }
}

var movingItemFactory =
{
    fallingMagnet: (value) =>
    {
        movingItems.push(new FallingItem(images.movingItems.magnet, "magnets", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.125, h * 0.125, h * (0.275 - applyUpgrade(game.aerobeams.upgrades.slowerFallingMagnets)), h * 0.2, w * 0.2,
        function(isAuto=false)
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
    fallingGold: (value) => {
        movingItems.push(new FallingItem(images.goldenScrap, "gs", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.15, h * 0.15, h * 0.3 /* Speed */, h * 0.2, w * 0.2,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                game.goldenScrap.amount = game.goldenScrap.amount.add(value);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    jumpingTire: value =>
    {
        let dir = Math.random() > 0.5 ? -1 : 1;
        movingItems.push(new JumpingItem(images.movingItems.tire, "tires", dir === 1 ? 0 : w, -w * 0.2, h * 0.15, h * 0.15, h * 0.1 * dir * (0.7 + 0.3 * Math.random()), h * 0.75,
            function (isAuto = false)
            {
                this.collected = true;
                if (game.ms.includes(89) == false && barrels[0] != undefined) {
                    if (barrels[0].level.toFixed(0) == 384) {
                        game.ms.push(89);
                        GameNotification.create(new MilestoneNotificaion(90));
                    }
                }
                if(game.settings.lowPerformance)
                {
                    this.destroy();
                }
                let v = value ? value : Decimal.round(game.tires.value);
                game.tires.amount = game.tires.amount.add(v);
                game.tires.value = game.tires.value.mul(applyUpgrade(game.tires.upgrades[1][0]));
                game.stats.totaltirescollected = game.stats.totaltirescollected.add(1);

                if (game.screws.isUnlocked()) {
                    game.screws.amount = game.screws.amount.add(1);
                    game.stats.totalscrews = game.stats.totalscrews.add(1);
                }

                if (Math.random() < applyUpgrade(game.aerobeams.upgrades.tireCloneChance) / 100) {
                    movingItemFactory.jumpingTire();
                    currentScene.popupTexts.push(new PopUpText("Spawned!", this.x, this.y + 50, { color: "#bbbbbb", bold: true, size: 0.1, border: h * 0.005 }))
                    if (game.ms.includes(112) == false) {
                            game.ms.push(112);
                            GameNotification.create(new MilestoneNotificaion(113));
                    }
                }
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(v), this.x, this.y, {color: "#bbbbbb", bold: true, size: 0.1, border: h * 0.005}))
            }))
    },
    fallingTireBG: (value) => {
        movingItems.push(new FallingItem(images.movingItems.tirebg, "tirebg", w * 0.15 + Math.random() * w * 1.2, -100, h * 0.125, h * 0.15, h * 0.75, h * 0.25, 0,
            function (isAuto = false) {
                
            }))
    },
    fallingBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.beam, "beams", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.15, h * 0.15, h * (0.75 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.25, 0,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                game.beams.amount = game.beams.amount.add(value);
                game.stats.totalbeams = game.stats.totalbeams.add(value);
                game.stats.totalbeamscollected = game.stats.totalbeamscollected.add(1);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    fallingAeroBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.aerobeam, "aerobeams", w * 0.5 + Math.random() * w * 0.2, -35, h * 0.125, h * 0.125, h * (0.6 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.25, w * 0.65,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                game.aerobeams.amount = game.aerobeams.amount.add(value);
                game.stats.totalaerobeams = game.stats.totalaerobeams.add(value);
                game.stats.totalaerobeamscollected = game.stats.totalaerobeamscollected.add(1);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    fallingAngelBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.angelbeam, "angelbeams", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.125, h * 0.125, h * (0.4 - applyUpgrade(game.beams.upgrades.slowerBeams)), 0, w * 0.2,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                game.angelbeams.amount = game.angelbeams.amount.add(value);
                game.stats.totalangelbeams = game.stats.totalangelbeams.add(value);
                game.stats.totalangelbeamscollected = game.stats.totalangelbeamscollected.add(1);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    fallingReinforcedBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.reinforcedbeam, "reinforcedbeams", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.2, h * 0.2, h * (0.6 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.25, 0,
            function (isAuto = false) {
                if (this.cooldown < 0.15) return false;
                if (Math.random() < applyUpgrade(game.reinforcedbeams.upgrades.powerpunch) / 100 || isAuto) {
                    this.progress += 3;
                    if (game.ms.includes(131) == false && !isAuto) {
                        game.ms.push(131);
                        GameNotification.create(new MilestoneNotificaion(132));
                    }
                }
                else {
                    this.progress += 1;
                }
                this.cooldown = 0;
                if (this.progress >= getReinforcedTapsNeeded()) {
                    this.collected = true;
                    if (game.settings.lowPerformance) {
                        this.destroy();
                    }
                    if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                    if (game.ms.includes(205) == false && game.settings.musicSelect == 2 && value > 139) {
                        game.ms.push(205);
                        GameNotification.create(new MilestoneNotificaion(206));
                    }

                    game.reinforcedbeams.amount = game.reinforcedbeams.amount.add(value);
                    game.stats.totalreinforcedbeams = game.stats.totalreinforcedbeams.add(value);
                    game.stats.totalreinforcedbeamscollected = game.stats.totalreinforcedbeamscollected.add(1);
                    currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
                }
                else {
                    currentScene.popupTexts.push(new PopUpText(((this.progress / getReinforcedTapsNeeded()) * 100).toFixed(0) + "%", this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
                }
            }, 0))
    },
    fallingGlitchBeam: (value) => {
        let rndm = applyUpgrade(game.skillTree.upgrades.funnyGlitchBeams) ? Math.max(0.75, Math.random() + 0.25) : 1;
        movingItems.push(new FallingItem(images.movingItems.glitchbeam, "glitchbeams", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.15 * rndm, h * 0.15 * rndm, h * (0.6 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.1, 0,
            function (isAuto = false) {
                if (this.cooldown < 0.05) return false;
                if (Math.random() < applyUpgrade(game.reinforcedbeams.upgrades.powerpunch) / 100 || isAuto) {
                    this.progress += 3;
                    if (game.ms.includes(131) == false && !isAuto) {
                        game.ms.push(131);
                        GameNotification.create(new MilestoneNotificaion(132));
                    }
                    this.x = w * Math.random();
                    this.y = h * Math.min(Math.random(), 0.6);
                }
                else {
                    this.progress += 1;
                    this.x = w * Math.random();
                    this.y = h * Math.min(Math.random(), 0.6);
                }
                this.cooldown = 0;
                if (this.progress >= 3) {
                    this.collected = true;
                    if (game.settings.lowPerformance) {
                        this.destroy();
                    }
                    if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                    if (this.img == images.movingItems.goldenBeam) {
                        awardGoldenBeam(value);
                    }
                    else {
                        game.glitchbeams.amount = game.glitchbeams.amount.add(value);
                        game.stats.totalglitchbeams = game.stats.totalglitchbeams.add(value);
                        game.stats.totalglitchbeamscollected = game.stats.totalglitchbeamscollected.add(1);
                    }
                    currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
                }
                else {
                    currentScene.popupTexts.push(new PopUpText(((this.progress / 3) * 100).toFixed(0) + "%", this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
                }
            }, 0))
    },
    glitchItem: (value) => {
        movingItems.push(new StaticItem(images.glitch, "glitches", w * 0.15 + Math.random() * w * 0.7, h * Math.random(), h * 0.15, h * 0.15, 2 * Math.random(),
            function (isAuto = false) {
                this.collected = true;
                game.glitchesCollected += 1;
                if (game.glitchesCollected == 10) {
                    GameNotification.create(new TextNotification("Glitches", "Glitch Beams unlocked!"));
                }
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    fallingGoldenBeam: (value) => {
        movingItems.push(new FallingItem(images.movingItems.goldenBeam, "gold", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.175, h * 0.175, h * (0.5 - applyUpgrade(game.beams.upgrades.slowerBeams)), h * 0.1, w * 0.1,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }
                if (applyUpgrade(game.glitchbeams.upgrades.valueGlitch) / 100 > Math.random()) value = value * (Math.round(1 + Math.random() * 6));

                awardGoldenBeam(value);

                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
    fallingScrew: (value) => {
        movingItems.push(new FallingItem(images.screw, "screws", w * 0.15 + Math.random() * w * 0.7, -100, h * 0.075, h * 0.075, h * 1, h * 0.2, 0,
            function (isAuto = false) {
                this.collected = true;
                if (game.settings.lowPerformance) {
                    this.destroy();
                }

                game.screws.amount = game.screws.amount.add(value);
                game.stats.totalscrews = game.stats.totalscrews.add(value);
                game.stats.totalscrewscollected = game.stats.totalscrewscollected.add(1);
                currentScene.popupTexts.push(new PopUpText("+" + formatNumber(value), this.x, this.y, { color: "#ffffff", bold: true, size: 0.1, border: h * 0.01 }))
            }))
    },
};
