class Barrel
{
    constructor(level)
    {
        this.x = 0;
        this.y = 0;
        this.originPos = 0;
        this.textCooldown = {
            cd: 0,
            time: 1
        };

        this.scale = 0;
        this.level = level;
    }

    static getBarrelSize()
    {
        return h * 0.1;
    }

    static getGlobalIncome()
    {
        let income = new Decimal(0);
        for (let b of barrels)
        {
            if (b !== undefined)
            {
                income = income.add(b.getIncome());
            }
        }
        if (draggedBarrel !== undefined)
        {
            income = income.add(draggedBarrel.getIncome());
        }
        return income;
    }

    static getMaxLevelBarrel()
    {
        let maxlvl = 0;
        for (let b of barrels)
        {
            if (b !== undefined && b.level > maxlvl)
            {
                maxlvl = b.level;
            }
        }
        return maxlvl;
    }

    static getIncomeForLevel(level)
    {
        if (game.dimension == 0) {
            return Decimal.pow(applyUpgrade(game.darkscrap.upgrades.strongerTiers), level).mul(applyUpgrade(game.magnetUpgrades.scrapBoost))
                .mul(game.goldenScrap.getBoost())
                .mul(applyUpgrade(game.goldenScrap.upgrades.scrapBoost))
                .mul(applyUpgrade(game.solarSystem.upgrades.sun))
                .mul(applyUpgrade(game.mergeQuests.upgrades.scrapBoost))
                .mul(game.mergeMastery.getScrapBoost(game.mergeMastery.level))
                .mul(applyUpgrade(game.bricks.upgrades.scrapBoost))
                .mul(applyUpgrade(game.skillTree.upgrades.scrapBoost))
                .mul(applyUpgrade(game.skillTree.upgrades.scrapBoost2))
                .mul(applyUpgrade(game.beams.upgrades.moreScrap))
                .mul(game.supernova.stars == 0 || game.highestBarrelReached > 499 ? applyUpgrade(game.wrenches.upgrades.wrenchScrapBoost) : 1)
                .mul(applyUpgrade(game.fragment.upgrades.scrapBoost))
                .mul(new Decimal(applyUpgrade(game.barrelMastery.upgrades.scrapBoost)).pow(getTotalLevels(1)))
                .mul(applyUpgrade(game.plasticBags.upgrades.moreScrap))
                .mul(game.cogwheels.isUnlocked() ? applyUpgrade(game.cogwheels.upgrades.scrapBoost) : 1)
        }
        if (game.dimension == 1) {
            return (Decimal.pow(1.1, level)
                .mul(new Decimal(1.05 + ((game.highestBarrelReached / 100000) * game.supernova.cosmicUpgrades.faster2ndDim.level)).pow(game.mergesThisPrestige))
                .mul(1 + applyUpgrade(game.darkfragment.upgrades.scrapBoost)))
        }          
    }

    getIncome()
    {
        return Barrel.getIncomeForLevel(this.level);
    }

    tick(delta)
    {
        if (this.scale < 1) this.scale = game.settings.lowPerformance ? 1 : Math.min(1, this.scale + delta * 5);
    }

    createIncomeText()
    {
        let size = Barrel.getBarrelSize();
        currentScene.popupTexts.push(new PopUpText(formatNumber(this.getIncome(), game.settings.numberFormatType), this.x, this.y - size * 0.45, {
            size: 0.025,
            speed: 0.05,
            bold: true,
            color: "#000000c0",
            maxWidth: size
        }));
        this.textCooldown.cd = 0;
    }

    setCoord(x, y)
    {
        this.x = x;
        this.y = y;
    }

    isClicked()
    {
        let size = Barrel.getBarrelSize();
        return mouseX > this.x - size * 0.45 && mouseX < this.x + size * 0.45 && mouseY > this.y - size * 0.55 && mouseY < this.y + size * 0.55;
    }

    getDropIndex()
    {
        let size = Barrel.getBarrelSize();
        for (let x = 0; x < 4; x++)
        {
            for (let y = 0; y < 5; y++)
            {
                let baseX = w / 2 + (size * 1.1 * x) - (size * 1.1 * 1.5);
                let baseY = h / 2 + (size * 1.15 * y) - (size * 1.15 * 2.6) - h * 0.03;

                if (mouseX > baseX - size * 0.55 && mouseX < baseX + size * 0.55 && mouseY > baseY - size * 0.725 && mouseY < baseY + size * 0.725)
                {
                    return 4 * y + x;
                }
            }
        }

        return -1;
    }

    static renderBarrel(ctx, level, x, y, size, preview)
    {
        let section = Math.max((Math.max(1, Math.ceil((0.0001 + level % BARRELS) / 100))) % 11 /* Change this when you add new BARRELS files */, 1);
        if (images["barrels" + section].width > 0 && images["barrels" + section].height > 0) //prevent infinite loop, wait for loaded image
        {
            let barrelRows = Math.floor(images["barrels" + section].height / BARREL_SPRITE_SIZE); //rows in spritesheet
            
            let lvl = Math.round(level);
            let lvlToDraw = lvl % BARRELS;
            let spriteX = BARREL_SPRITE_SIZE * (lvlToDraw % 10); // don't change these 2
            let spriteY = BARREL_SPRITE_SIZE * Math.floor((lvlToDraw / 10) % barrelRows);

            let order = Math.floor(lvl / BARRELS);
            
            let finalX = x - size / 2;
            let finalY = y - size / 2;

            if (game.settings.coconut) {
                ctx.drawImage(images["coconut"], finalX, finalY, size, size);
                return true;
            }
            if (game.settings.useCachedBarrels)
            {
                if (preview)
                {
                    if (images.previewBarrels[lvlToDraw] === undefined && barrelsLoaded)
                    {
                        cacheBarrel(lvlToDraw);
                    }
                    if (images.previewBarrels[lvlToDraw] !== undefined)
                    {
                        ctx.drawImage(images.previewBarrels[lvlToDraw], finalX, finalY, size, size);
                    }
                }
                else if (!game.settings.barrelShadows)
                {
                    ctx.drawImage(images["barrels" + section], spriteX, spriteY, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, finalX, finalY, size, size);
                }
                else
                {
                    if (game.settings.barrelShadows || preview) {
                        let ox = preview ? 10000 : size * 0.05;
                        let oy = preview ? 0 : size * 0.05;
                        Utils.setCanvasShadow(ctx, "#00000064", 0, ox, oy);
                    }
                    ctx.drawImage(images["barrels" + section], spriteX, spriteY, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, finalX, finalY, size, size);
                }
            }
            else
            {
                if (game.settings.barrelShadows || preview)
                {
                    let ox = preview ? 10000 : size * 0.05;
                    let oy = preview ? 0 : size * 0.05;
                    Utils.setCanvasShadow(ctx, "#00000064", 0, ox, oy);
                }

                if (preview)
                {
                    ctx.translate(-10000, 0);
                }
                ctx.drawImage(images["barrels" + section], spriteX, spriteY, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, finalX, finalY, size, size);
                if (preview)
                {
                    ctx.translate(10000, 0);
                }
            }

            if (game.settings.barrelShadows || preview) Utils.removeCanvasShadow();

            if (!preview)
            {
                let starSize;
                if (order <= 3)
                {
                    for (let i = 0; i < order; i++)
                    {
                        starSize = size / 3.0;
                        let offsetX = starSize / 2 * (i - order / 2 + 0.5);
                        let offsetY = -starSize / 5;
                        ctx.drawImage(images.starSmall, x - starSize / 2 + offsetX, y - starSize / 2 + size / 3 - offsetY, starSize, starSize);
                    }
                }
                else
                {
                    starSize = size / 1.8;
                    let starX = x - starSize / 2;
                    let starY = y - starSize / 2 + size / 3;
                    ctx.drawImage(images.starSmall, starX, starY, starSize, starSize);
                    ctx.font = "bold " + (starSize / 2.75) + "px Helvetica";
                    ctx.fillStyle = "black";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(formatThousands(order), x, y + size * 0.37, starSize * 0.5);
                }
            }
        }
    }

    render(ctx)
    {
        Barrel.renderBarrel(ctx, this.level, this.x, this.y, Barrel.getBarrelSize() * this.scale);
    }
}