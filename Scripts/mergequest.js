class MergeQuest
{
    constructor(cooldown, possibleTiers)
    {
        this.barrelLvl = -1;
        this.possibleTiers = possibleTiers;
        this.currentMerges = 0;
        this.neededMerges = 500;
        this.reward = new Decimal(0);
        this.active = false;
        this.cooldown = cooldown;
        this.currentCooldown = 0;

    }

    generateQuest(tier)
    {
        let highestLvl = game ? Math.max(100, Math.min(game.highestBarrelReached - 10, game.scrapUpgrades.betterBarrels.maxLevel)) : 100;
        let minLvl = game ? Math.max(50, game.highestBarrelReached - 250) : 0;
        if (tier != 5) this.barrelLvl = Math.floor(minLvl + Math.random() * (highestLvl - minLvl));
        else this.barrelLvl = (calcTime * (28643 * calcTime)) % BARRELS; //Amount of barrels
        this.neededMerges = [100, 250, 500, 1000, 2500, 10000][tier];
        if(this.neededMerges < 10000) this.reward = new Decimal(Math.floor([1, 2, 4, 8, 25, 250][tier] * applyUpgrade(game.darkscrap.upgrades.mergeTokenBoost) * (1+applyUpgrade(game.skillTree.upgrades.moreMergeTokens)))).mul(applyUpgrade(game.supernova.alienDustUpgrades.triangulum)).round();
        else this.reward = new Decimal(Math.floor([1, 2, 4, 8, 25, 250][tier] * applyUpgrade(game.darkscrap.upgrades.mergeTokenBoost) * (1 + applyUpgrade(game.skillTree.upgrades.moreMergeTokens)) / applyUpgrade(game.bricks.upgrades.questSpeed).mul(applyUpgrade(game.tires.upgrades[1][2])).toNumber())).mul(applyUpgrade(game.supernova.alienDustUpgrades.triangulum)).round();
        // merges/token:  100, 125, 125, 125, 100, 40
        this.active = true;
        this.currentCooldown = 0;
    }

    getCooldown()
    {
        return this.cooldown * applyUpgrade(game.bricks.upgrades.questSpeed).mul(applyUpgrade(game.tires.upgrades[1][2])).toNumber() * (game.supernova.cosmicUpgrades.fasterMergeQuests.level > 0 ? 0.01 : 1);
    }

    getNeededMerges()
    {
        if (this.neededMerges < 3000) return Math.round(this.neededMerges * applyUpgrade(game.bricks.upgrades.questSpeed).mul(applyUpgrade(game.tires.upgrades[1][2])).toNumber());
        else return Math.round(this.neededMerges);
    }

    check(mergedLvl)
    {
        let merged = this.barrelLvl === ((this.getNeededMerges() > 8000 && applyUpgrade(game.skillTree.upgrades.starDaily)) ? Math.floor(mergedLvl % BARRELS) : Math.floor(mergedLvl));
        if(merged)
        {
            this.currentMerges++;
        }

        if(this.currentMerges >= this.getNeededMerges() && this.active)
        {
            game.mergeQuests.mergeTokens = Decimal.round(game.mergeQuests.mergeTokens.add(this.reward));
            game.stats.totalmergetokens = Decimal.round(game.stats.totalmergetokens.add(this.reward));
            game.stats.totalquests = game.stats.totalquests.add(1);
            if (this.getNeededMerges() > 8000) {
                game.stats.totaldailyquests = game.stats.totaldailyquests.add(1);
                if (game.barrelMastery.isUnlocked()) {
                    game.barrelMastery.masteryTokens = game.barrelMastery.masteryTokens.add(25);
                    game.stats.totalmasterytokens = game.stats.totalmasterytokens.add(25);
                }
            }
            GameNotification.create(new MergeQuestNotification(this));
            this.active = false;
            this.currentMerges = 0;
            this.barrelLvl = -1;
        }

        return merged;
    }

    tick(delta)
    {
        if(!this.active)
        {
            this.currentCooldown += delta;
            if(this.currentCooldown >= this.getCooldown())
            {
                this.generateQuest(this.possibleTiers[Math.floor(this.possibleTiers.length * Math.random())]);
            }
        }
    }

    render(ctx, x, y)
    {
        ctx.fillStyle = colors[C]["table"];
        if (this.getNeededMerges() > 8000) ctx.fillRect(x - w * 0.1, y - h * 0.0575, w * 0.875, h * 0.17);
        else ctx.fillRect(x - w * 0.1, y - h * 0.0575, w * 0.875, h * 0.12);

        if(this.active)
        {
            Barrel.renderBarrel(ctx, this.barrelLvl, x, y, h * 0.1);

            ctx.fillStyle = "#505050";
            ctx.fillRect(x + h * 0.08, y - h * 0.05, w * 0.6, h * 0.05);
            ctx.fillStyle = colors[C]["bgFront"];
            ctx.fillRect(x + h * 0.08, y - h * 0.05, w * 0.6 * (this.currentMerges / this.getNeededMerges()), h * 0.05);

            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillStyle = colors[C]["text"];
            ctx.font = "bold " + (this.getNeededMerges() > 8000 ? (h * 0.035) : (h * 0.05)) + "px " + fonts.default;
            ctx.fillText(formatThousands(this.currentMerges) + " / " + formatThousands(this.getNeededMerges()), x + h * 0.1, y - h * 0.02);
            let rewardText = formatThousands(this.reward);
            ctx.fillText(rewardText, x + h * 0.12, y + h * 0.04);
            ctx.drawImage(images.mergeToken, x + h * 0.13 + ctx.measureText(rewardText).width, y + h * 0.01, h * 0.05, h * 0.05);

            if (this.getNeededMerges() > 8000 && game.barrelMastery.isUnlocked()) {
                ctx.fillText(25, x + h * 0.12, y + h * 0.09);
                ctx.drawImage(images.masteryToken, x + h * 0.13 + ctx.measureText(25).width, y + h * 0.06, h * 0.05, h * 0.05);
            }

            ctx.font = (h * 0.025) + "px " + fonts.default;
            ctx.fillStyle = colors[C]["text"];
            ctx.fillText("#" + this.barrelLvl, x + h * 0.035, y + h * 0.05);
        }
        else
        {
            ctx.fillStyle = colors[C]["text"];
            ctx.font = "bold " + (h * 0.09) + "px " + fonts.default;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.drawImage(images.clock, x - h * 0.04, y - h * 0.04, h * 0.08, h * 0.08);

            ctx.font = "bold " + (h * 0.06) + "px " + fonts.default;
            ctx.textAlign = "left";
            if (this != game.mergeQuests.dailyQuest) ctx.fillText(formatTime(this.getCooldown() - this.currentCooldown), x + h * 0.1, y + h * 0.02);
            else ctx.fillText(futureTimeDisplay, x + h * 0.1, y + h * 0.02, w * 0.55);

            ctx.font = "bold " + (h * 0.02) + "px " + fonts.default;
            ctx.fillText(tt("nextquest"), x + h * 0.1, y - h * 0.02);
        }
    }
}
