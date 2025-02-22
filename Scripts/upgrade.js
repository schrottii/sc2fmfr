// list of all resources and their IDs
let RESOURCE_SCRAP = 0,
    RESOURCE_MAGNET = 1,
    RESOURCE_GS = 2,
    RESOURCE_MERGE_TOKEN = 3,
    RESOURCE_BRICK = 4,
    RESOURCE_TIRE = 5,
    RESOURCE_FRAGMENT = 6,
    RESOURCE_BARREL = 7,
    RESOURCE_DARKSCRAP = 8,
    RESOURCE_DARKFRAGMENT = 9,
    RESOURCE_BEAM = 10,
    RESOURCE_AEROBEAM = 11,
    RESOURCE_WRENCH = 12,
    RESOURCE_ANGELBEAM = 13,
    RESOURCE_REINFORCEDBEAM = 14,
    RESOURCE_GLITCHBEAM = 15,
    RESOURCE_LEGENDARYSCRAP = 16,
    RESOURCE_STEELMAGNET = 17,
    RESOURCE_BLUEBRICK = 18,
    RESOURCE_MASTERYTOKEN = 19,
    RESOURCE_PLASTICBAG = 20,
    RESOURCE_BUCKET = 21,
    RESOURCE_FISHINGNET = 22,
    RESOURCE_SCREW = 23,
    RESOURCE_COGWHEEL = 24,
    RESOURCE_COSMICEMBLEMS = 25,
    RESOURCE_STARDUST = 26,
    RESOURCE_ALIENDUST = 27,
    RESOURCE_FAIRYDUST = 28;

// applyUpgrade my beloved
function applyUpgrade(upg) {
    return upg.getEffect(upg.level);
}

// gets the amount
function getUpgradeResource(res) {
    switch (res) {
        case RESOURCE_SCRAP:
            return game.scrap;
        case RESOURCE_MAGNET:
            return game.magnets;
        case RESOURCE_GS:
            return game.goldenScrap.amount;
        case RESOURCE_MERGE_TOKEN:
            return game.mergeQuests.mergeTokens;
        case RESOURCE_BRICK:
            return game.bricks.amount;
        case RESOURCE_TIRE:
            return game.tires.amount;
        case RESOURCE_FRAGMENT:
            return game.fragment.amount;
        case RESOURCE_BARREL:
            return new Decimal(game.highestBarrelReached + 1);
        case RESOURCE_DARKSCRAP:
            return game.darkscrap.amount;
        case RESOURCE_DARKFRAGMENT:
            return game.darkfragment.amount;
        case RESOURCE_BEAM:
            return game.beams.amount;
        case RESOURCE_AEROBEAM:
            return game.aerobeams.amount;
        case RESOURCE_WRENCH:
            return game.wrenches.amount;
        case RESOURCE_ANGELBEAM:
            return game.angelbeams.amount;
        case RESOURCE_REINFORCEDBEAM:
            return game.reinforcedbeams.amount;
        case RESOURCE_GLITCHBEAM:
            return game.glitchbeams.amount;
        case RESOURCE_LEGENDARYSCRAP:
            return game.factory.legendaryScrap.round();
        case RESOURCE_STEELMAGNET:
            return game.factory.steelMagnets.round();
        case RESOURCE_BLUEBRICK:
            return game.factory.blueBricks.round();
        case RESOURCE_MASTERYTOKEN:
            return game.barrelMastery.masteryTokens;
        case RESOURCE_PLASTICBAG:
            return game.plasticBags.amount;
        case RESOURCE_BUCKET:
            return game.factory.buckets.round();
        case RESOURCE_FISHINGNET:
            return game.factory.fishingNets.round();
        case RESOURCE_SCREW:
            return game.screws.amount;
        case RESOURCE_COGWHEEL:
            return game.cogwheels.amount;
        case RESOURCE_COSMICEMBLEMS:
            return game.supernova.cosmicEmblems.round();
        case RESOURCE_STARDUST:
            return game.supernova.starDust;
        case RESOURCE_ALIENDUST:
            return game.supernova.alienDust;
        case RESOURCE_FAIRYDUST:
            return game.supernova.fairyDust;
        default:
            return null;
    }
}

// sets the resource to an amount
function assignResourceAfterUpgrade(resType, res) {
    switch (resType) {
        case RESOURCE_SCRAP:
            game.scrap = res;
            break;
        case RESOURCE_MAGNET:
            game.magnets = res;
            break;
        case RESOURCE_GS:
            game.goldenScrap.amount = res;
            break;
        case RESOURCE_MERGE_TOKEN:
            game.mergeQuests.mergeTokens = res;
            break;
        case RESOURCE_BRICK:
            game.bricks.amount = res;
            break;
        case RESOURCE_TIRE:
            game.tires.amount = res;
            break;
        case RESOURCE_FRAGMENT:
            game.fragment.amount = res;
            break;
        case RESOURCE_DARKSCRAP:
            game.darkscrap.amount = res;
            break;
        case RESOURCE_DARKFRAGMENT:
            game.darkfragment.amount = res;
            break;
        case RESOURCE_BEAM:
            game.beams.amount = res;
            break;
        case RESOURCE_AEROBEAM:
            game.aerobeams.amount = res;
            break;
        case RESOURCE_WRENCH:
            game.wrenches.amount = res;
            break;
        case RESOURCE_ANGELBEAM:
            game.angelbeams.amount = res;
            break;
        case RESOURCE_REINFORCEDBEAM:
            game.reinforcedbeams.amount = res;
            break;
        case RESOURCE_GLITCHBEAM:
            game.glitchbeams.amount = res;
            break;
        case RESOURCE_LEGENDARYSCRAP:
            game.factory.legendaryScrap = res;
            break;
        case RESOURCE_STEELMAGNET:
            game.factory.steelMagnets = res;
            break;
        case RESOURCE_BLUEBRICK:
            game.factory.blueBricks = res;
            break;
        case RESOURCE_MASTERYTOKEN:
            game.barrelMastery.masteryTokens = res;
            break;
        case RESOURCE_PLASTICBAG:
            game.plasticBags.amount = res;
            break;
        case RESOURCE_BUCKET:
            game.factory.buckets = res;
            break;
        case RESOURCE_FISHINGNET:
            game.factory.fishingNets = res;
            break;
        case RESOURCE_SCREW:
            game.screws.amount = res;
            break;
        case RESOURCE_COGWHEEL:
            game.cogwheels.amount = res;
            break;
        case RESOURCE_COSMICEMBLEMS:
            game.supernova.cosmicEmblems = res;
            break;
        case RESOURCE_STARDUST:
            game.supernova.starDust = res;
            break;
        case RESOURCE_ALIENDUST:
            game.supernova.alienDust = res;
            break;
        case RESOURCE_FAIRYDUST:
            game.supernova.fairyDust = res;
            break;
        default:
            break;
    }
}

// gets the resource image
function getResourceImage(res) {
    switch (res) {
        case RESOURCE_SCRAP:
            return "$images.scrap$";
        case RESOURCE_MAGNET:
            return "$images.magnet$";
        case RESOURCE_GS:
            return "$images.goldenScrap$";
        case RESOURCE_MERGE_TOKEN:
            return "$images.mergeToken$";
        case RESOURCE_BRICK:
            return "$images.brick$";
        case RESOURCE_TIRE:
            return "$images.tire$";
        case RESOURCE_FRAGMENT:
            return "$images.fragment$";
        case RESOURCE_BARREL:
            return "$images.scrap$";
        case RESOURCE_DARKSCRAP:
            return "$images.darkscrap$";
        case RESOURCE_DARKFRAGMENT:
            return "$images.darkfragment$";
        case RESOURCE_BEAM:
            return "$images.beam$";
        case RESOURCE_AEROBEAM:
            return "$images.aerobeam$";
        case RESOURCE_WRENCH:
            return "$images.wrench$";
        case RESOURCE_ANGELBEAM:
            return "$images.angelbeam$";
        case RESOURCE_REINFORCEDBEAM:
            return "$images.reinforcedbeam$";
        case RESOURCE_GLITCHBEAM:
            return "$images.glitchbeam$";
        case RESOURCE_LEGENDARYSCRAP:
            return "$images.legendaryScrap$";
        case RESOURCE_STEELMAGNET:
            return "$images.steelMagnet$";
        case RESOURCE_BLUEBRICK:
            return "$images.blueBrick$";
        case RESOURCE_MASTERYTOKEN:
            return "$images.masteryToken$";
        case RESOURCE_PLASTICBAG:
            return "$images.plasticBag$";
        case RESOURCE_BUCKET:
            return "$images.bucket$";
        case RESOURCE_FISHINGNET:
            return "$images.fishingNet$";
        case RESOURCE_SCREW:
            return "$images.screw$";
        case RESOURCE_COGWHEEL:
            return "$images.cogwheel$";
        case RESOURCE_COSMICEMBLEMS:
            return "$images.cosmicemblem$";
        case RESOURCE_STARDUST:
            return "$images.stardust$";
        case RESOURCE_ALIENDUST:
            return "$images.aliendust$";
        case RESOURCE_FAIRYDUST:
            return "$images.fairydust$";
        default:
            break;
    }
}

// Various upgrade classes are here
class ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        this.level = 0;

        this.getPrice = getPrice;
        this.getEffect = getEffect;
        if (cfg) {
            if (cfg.getEffectDisplay) {
                this.getEffectDisplay = cfg.getEffectDisplay;
            }
            if (cfg.onBuy) {
                this.onBuy = cfg.onBuy;
            }
            if (cfg.afterBuy) {
                this.afterBuy = cfg.afterBuy;
            }
            if (cfg.onLevelDown) {
                this.onLevelDown = cfg.onLevelDown;
            }
            if (cfg.onBuyMax) {
                this.onBuyMax = cfg.onBuyMax;
            }
            if (cfg.isUnlocked) {
                this.isUnlocked = cfg.isUnlocked;
            }
            if (cfg.integral) {
                this.integral = cfg.integral;
            }
        }
        this.maxLevel = cfg && cfg.maxLevel ? cfg.maxLevel : Infinity;

        this.resource = RESOURCE_SCRAP;
    }

    onBuy() {

    }

    afterBuy() {

    }

    onLevelDown() {

    }

    onBuyMax() {

    }



    buy(round, disableOnBuy = false) {
        let resource = getUpgradeResource(this.resource);
        let canAfford = round ? (this.currentPrice().round().lte(resource.round())) : this.currentPrice().lte(resource);
        if (this.level < this.getMaxLevel() && canAfford && this.level < HARDLEVELCAP) {
            if (!disableOnBuy) this.onBuy();
            let p = round ? this.currentPrice().round() : this.currentPrice();
            if (resource.mul(1000000).gt(p)) resource = resource.sub(p);
            if (isNaN(resource) && !resource.gte(10)) //is resource negative
            {
                resource = new Decimal(0);
            }
            assignResourceAfterUpgrade(this.resource, resource);
            this.level++;
        }

        this.afterBuy();
        return canAfford;
    }

    buyToTarget(level, round) {
        let originHyper = false;
        if (level == "hyperbuy") originHyper = true;
        if (level != "hyperbuy" && level <= this.level) {
            if (level < this.level) {
                this.onLevelDown(level);
            }
            this.level = level;
            return true;
        }
        else if (this.resource == 7 && game.settings.hyperBuy2) {
            // Super super fast Mythus calc - Added in 3.2.1
            let resource = getUpgradeResource(this.resource);
            if (this.maxLevel != 14) game.solarSystem.upgrades.mythus.level = Math.min(HARDLEVELCAP, Math.max(0, Math.floor(((Math.floor(resource) - 3008) - applyUpgrade(game.supernova.alienDustUpgrades.aquila) + 20) / 20)));
            else game.skillTree.upgrades.higherDarkScrapTokenMax.level = Math.min(14, Math.floor(resource / 1200));
            this.onBuy();
            this.afterBuy();
            return true;
        }
        let resource = getUpgradeResource(this.resource).mul(Math.min(100, game.settings.hyperBuyPer) / 100);
        // 3.2 - new hyperbuy upgrade buying
        // Mass calculations using integrals
        // Made by Schrottii

        if (level == "hyperbuy") {
            // is hyperbuy, level = "hyperbuy"
            level = 10000;

            if (this.level + level < this.getMaxLevel() // manually buy 10k without integral calc if it's near max. level
                && game.settings.hyperBuy2 // or if integral is disabled in settings
                && this.integral != undefined // or integral doesn't exist
                && !isNaN(this.integral(this.level)) // or cost is NaN (like Cetus)
                && this.integral(this.level + level).sub(this.integral(this.level)).max(1).lt(resource)) { // and whatever this is, yeah yeah!
                // Keep doubling as long as possible
                while (this.integral(this.level + level).sub(this.integral(this.level)).max(1).lt(resource)) {
                    level *= 2;
                }
                level = level / 2;

                // Half, now x1.03 as long as possible. Should be fairly accurate
                while (this.integral(this.level + level * 1.02).sub(this.integral(this.level)).max(1).lt(resource)) {
                    level = Math.floor(level * 1.02);
                }

                // Set level, remove currency
                level = Math.min(this.maxLevel - this.level, level);
                if (game.settings.hyperBuyCap != 0) level = Math.min(level, game.settings.hyperBuyCap);
                level = Math.min(level, HARDLEVELCAP - this.level);

                resource = getUpgradeResource(this.resource);
                resource = resource.sub(this.integral(this.level + level).sub(this.integral(this.level)));
                if (isNaN(resource) && !resource.gte(1)) // is resource negative
                {
                    resource = new Decimal(0);
                }
                assignResourceAfterUpgrade(this.resource, resource);

                this.level = this.level + level; // put it here. grrr
                this.onBuy();
                this.afterBuy();

                return true;
            }
            else {
                level = level + this.level;
            }
        }
        else {
            if (originHyper) resource = getUpgradeResource(this.resource).mul(Math.min(100, game.settings.hyperBuyPer) / 100).round();
            else resource = getUpgradeResource(this.resource);
        }

        // cap the level
        if (game.settings.hyperBuyCap != 0 && originHyper) level = this.level + Math.min(level, game.settings.hyperBuyCap);
        if (level > this.getMaxLevel()) level = this.getMaxLevel();

        if (this.level > 1e15 || this.getMaxLevel() - this.level == 0 /*|| isNaN(this.getPrice(level))*/) {
            //this.level = this.getMaxLevel();        ummmm what???
            return false;
        }

        let maxAttempts = 10000;
        while (this.currentPrice().lte(resource) && this.level < level && this.level < this.getMaxLevel() && maxAttempts > 0 && this.level < HARDLEVELCAP) {
            this.buy(round);
            maxAttempts -= 1;
            if (!originHyper) resource = getUpgradeResource(this.resource);
            else resource = resource.sub(this.getPrice(this.level - 1));
        }

    }

    currentPrice() {
        return this.getPrice(this.level);
    }

    getMaxLevel() {
        if (typeof this.maxLevel == "function") {
            return this.maxLevel();
        }
        return this.maxLevel;
    }

    getPriceDisplay(suffix, prefix, space, showResource) {
        let p = prefix !== undefined ? prefix : "";
        let s = suffix !== undefined ? suffix : "";
        let spaceChar = space || space === undefined ? " " : "";
        let img = showResource ? getResourceImage(this.resource) : "";
        if (this.level < this.getMaxLevel()) {
            return img + p + spaceChar + formatNumber(this.currentPrice()) + spaceChar + s;
        }
        else {
            return "Max";
        }
    }

    getEffectDisplay() {
        return "x" + this.getEffect(this.level) + " → " + "x" + this.getEffect(this.level + 1);
    }

    getLevelDisplay() {
        return this.level + (this.getMaxLevel() < Infinity ? "/" + this.getMaxLevel() : "");
    }
}

class FixedLevelUpgrade {
    constructor(levels, effects, cfg) {
        this.levels = levels;
        this.effects = effects;
        this.getEffectDisplay = cfg && cfg.getEffectDisplay ? cfg.getEffectDisplay : this.getEffectDisplay;
        this.level = 0;
    }

    getPrices(level) {
        return this.levels[level];
    }

    getCurrentPrices() {
        return this.getPrices(this.level);
    }

    getPriceDisplay() {
        if (this.level === this.getMaxLevel()) return "Max";
        let str = "";
        let len = this.getCurrentPrices().length;
        let nlFreq = len > 2 ? 2 : 1;
        let i = 0;
        for (let p of this.getCurrentPrices()) {
            let img = getResourceImage(p[1]);
            str += img + formatNumber(p[0]) + (i % nlFreq === nlFreq - 1 ? "\n" : " ");
            i++;
        }
        return str;
    }

    getEffect(level) {
        return this.effects[level];
    }

    getEffectDisplay() {
        return "x" + this.getEffect(this.level) + " → " + "x" + this.getEffect(this.level + 1);
    }

    getMaxLevel() {
        return this.levels.length;
    }

    buy() {
        if (this.level >= this.getMaxLevel()) {
            return;
        }
        for (let p of this.getCurrentPrices()) {
            let resource = getUpgradeResource(p[1]);
            if (p[0].gt(resource.round())) {
                return;
            }
        }

        for (let p of this.getCurrentPrices()) {
            let resource = getUpgradeResource(p[1]);
            resource = resource.sub(p[0]).max(0);
            assignResourceAfterUpgrade(p[1], resource);
        }
        this.level++;
    }

    onLevelDown() {

    }

    buyToTarget(level, round) {
        if (level <= this.level) {
            if (level < this.level) {
                this.onLevelDown(level);
            }
            this.level = level;
        }
        else {
            while (this.level < level && this.level < this.getMaxLevel()) {
                for (let p of this.getCurrentPrices()) {
                    let resource = getUpgradeResource(p[1]);
                    if (p[0].gt(resource.round())) {
                        return;
                    }
                }
                this.buy(round);
                //resource = getUpgradeResource(this.resource);
            }
        }
    }
}

class SkillTreeUpgrade extends ScrapUpgrade {
    constructor(getPrice, resource, getEffect, cfg, deps) {
        super(getPrice, getEffect, cfg);
        this.deps = deps;
        this.resource = resource;
    }

    isUnlocked() {
        if (this.deps === undefined) {
            return true;
        }
        if (this.deps.upg != undefined) {
            for (let upg of this.deps) {
                if (upg.level === 0 || upg.level == undefined) return false;
            }
        }
        else {
            for (let k of this.deps) {
                if (game.skillTree.upgrades[k].level === 0) return false;
            }
        }
        return true;
    }

    getPriceDisplay(suffix, prefix, space, showResource) {
        return super.getPriceDisplay(suffix, prefix, space, true);
    }
}

class SkillTreeUpgradeFixed extends FixedLevelUpgrade {
    constructor(prices, effects, cfg, deps) {
        super(prices, effects, cfg);
        this.cfg = cfg;
        this.deps = deps;
    }

    isUnlocked() {
        if (this.deps === undefined) {
            return true;
        }
        if (this.cfg.nova == true) {
            if (game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA) {
                if (game.supernova.stars.gt(0) && this.level == 0) this.level = 1;
                return true;
            }
            return false;
        }
        if (this.cfg.oneDep != true) {
            for (let k of this.deps) {
                if (game.skillTree.upgrades[k].level === 0) return false;
            }
        }
        else {
            for (let k of this.deps) {
                if (game.skillTree.upgrades[k].level > 0) return true;
            }
            return false;
        }
        return true;
    }
}

class CosmicEmblemUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg, stars) {
        super(getPrice, getEffect, cfg);
        this.cfg = cfg;
        this.resource = RESOURCE_COSMICEMBLEMS;
        this.stars = stars;
    }

    isUnlocked() {
        if (game.supernova.stars.gte(Math.max(0, this.stars - 2))) return true;
        return false;
    }
    getStarRequirement() {
        return this.stars;
    }
    buy(round, disableOnBuy = false) {
        let resource = getUpgradeResource(this.resource);
        let canAfford = round ? (this.currentPrice().round().lte(resource.round())) : this.currentPrice().lte(resource);
        if (this.level < this.getMaxLevel() && canAfford && game.supernova.stars.gte(this.stars)) {
            if (!disableOnBuy) this.onBuy();
            let p = round ? this.currentPrice().round() : this.currentPrice();
            resource = resource.sub(p);
            if (isNaN(resource)) //is resource negative
            {
                resource = new Decimal(0);
            }
            assignResourceAfterUpgrade(this.resource, resource);
            this.level++;
        }

        this.afterBuy();
    }
}

class MagnetUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_MAGNET;
    }
}

class GoldenScrapUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_GS;
    }
}


class BarrelUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_BARREL;
    }
}

class MergeTokenUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_MERGE_TOKEN;
    }
}

class BrickUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_BRICK;
    }
}

class TireUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_TIRE;
    }
}

class FragmentUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_FRAGMENT;
    }
}
class DarkFragmentUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_DARKFRAGMENT;
    }
}
class DarkScrapUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_DARKSCRAP;
    }
}
class BeamUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_BEAM;
    }
}
class AeroBeamUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_AEROBEAM;
    }
}
class WrenchUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_WRENCH;
    }
}
class AngelBeamUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_ANGELBEAM;
    }
}
class ReinforcedBeamUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_REINFORCEDBEAM;
    }
}
class GlitchBeamUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_GLITCHBEAM;
    }
}
class PlasticBagUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_PLASTICBAG;
    }
}
class ScrewUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_SCREW;
    }
}
class FactoryUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg, currencies) {
        super(getPrice, getEffect, cfg, currencies);
        this.levels = currencies;
    }
    getPrices(level) {
        return this.levels(level);
    }
    getCurrentPrices() {
        return this.getPrices(this.level);
    }

    getPriceDisplay() {
        if (this.level === this.getMaxLevel()) return "Max";
        let str = "";
        let len = this.getPrices().length;
        let nlFreq = len > 2 ? 2 : 1;
        let i = 0;
        for (let p of this.getPrices(this.level)) {
            let img = getResourceImage(p[1]);
            str += img + formatNumber(p[0]) + (i % nlFreq === nlFreq - 1 ? "\n" : " ");
            i++;
        }
        return str;
    }
    buy(round, hyperbuy = false) {
        if (game.factory.time > 0) return false;
        if (game.factory.tank.round().lt(this.getPrice(0))) return false;
        let resource = getUpgradeResource(this.resource);

        for (let p of this.getCurrentPrices()) {
            let resource = getUpgradeResource(p[1]);

            if (p[0].gt(resource.round())) {
                return false;
            }
        }

        let canAfford = round ? (this.currentPrice().round().lte(resource.round())) : this.currentPrice().lte(resource);
        if (this.level < this.getMaxLevel() && canAfford) {
            if (!hyperbuy) this.onBuy();

            for (let p of this.getCurrentPrices()) {
                let resource = getUpgradeResource(p[1]);
                resource = resource.sub(p[0]).max(0);
                assignResourceAfterUpgrade(p[1], resource);
            }

            game.factory.tank = game.factory.tank.sub(this.getPrice(0));
            if (isNaN(game.factory.tank)) //is resource negative
            {
                game.factory.tank = new Decimal(0);
            }
            this.level++;
        }

        this.afterBuy();
        return true;
    }

    buyToTarget(level, round) {
        if (game.factory.time > 0) return false;
        if (game.factory.tank.round().lt(this.getPrice(0))) return false;

        if (level <= this.level) {
            if (level < this.level) {
                this.onLevelDown(level);
            }
            this.level = level;
        }
        else {
            let resource = getUpgradeResource(this.resource);
            let canAfford = true;
            let levelsBefore = this.level;
            while (this.level < this.getMaxLevel() && canAfford && level > this.level) {
                canAfford = this.buy(round, true);
            }
            this.onBuy(this.level - levelsBefore);
        }
    }
}

class AutoUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, currency, auto, time, cfg) {
        super(getPrice, getEffect, cfg);
        this.currency = currency;
        this.auto = auto;
        this.time = time;
        this.cfg = cfg;
        this.resource = this.currency;
    }
}

class MasteryTokenUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_MASTERYTOKEN;
    }
}
class CogwheelUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_COGWHEEL;
    }
}
class StarDustUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_STARDUST;
    }
}
class AlienDustUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_ALIENDUST;
    }
}
class FairyDustUpgrade extends ScrapUpgrade {
    constructor(getPrice, getEffect, cfg) {
        super(getPrice, getEffect, cfg);
        this.resource = RESOURCE_FAIRYDUST;
    }
}

// planet earth upgrade levels (solar system)
var EarthLevels =
{
    UNLOCK_MARS: 2,
    MAGNET_3_LEVELS: 3,
    UNLOCK_JUPITER: 4,
    UNLOCK_SATURN: 5,
    UNLOCK_URANUS: 6,
    UNLOCK_NEPTUNE: 7,
    SKILL_TREE: 8,
    BRICK_3_LEVELS: 9,
    ANGEL_BEAMS: 10,
    SECOND_DIMENSION: 11,
    SCRAP_FACTORY: 12,
    GIFTS: 13,
    UNLOCK_NOVA: 14,
};

var effectDisplayTemplates =
{
    numberStandard: function (digits, prefix, suffix, cfg) {
        let p = prefix !== undefined ? prefix : "x";
        let s = suffix !== undefined ? suffix : "";
        let c = cfg ? cfg : {};
        c.precision = digits;
        return function () {
            if (game.settings.lang == "ru" && s == "% Chance") s = "% Шанс";
            if (this.level === this.getMaxLevel()) {
                return p + formatNumber(this.getEffect(this.level), game.settings.numberFormatType, c) + s;
            }

            return p + formatNumber(this.getEffect(this.level), game.settings.numberFormatType, c) + s + " → " +
                p + formatNumber(this.getEffect(this.level + 1), game.settings.numberFormatType, c) + s;
        }
    },
    percentStandard: function (digits, prefix) {
        let p = prefix !== undefined ? prefix : "";
        return function () {
            if (this.level === this.getMaxLevel()) {
                return p + formatPercent(this.getEffect(this.level), digits);
            }

            return p + formatPercent(this.getEffect(this.level), digits) + " → " +
                p + formatPercent(this.getEffect(this.level + 1), digits);
        }
    },
    unlock: function () {
        return function () {
            return this.getEffect(this.level) ? tt("unlocked") : tt("locked");
        }
    },
    unlockEffect: function (prefix, suffix) {
        let p = prefix !== undefined ? prefix : "";
        let s = suffix !== undefined ? suffix : "";
        return function () {
            if (this.getEffect(this.level) == true) return tt("unlocked");
            else if (this.getEffect(this.level) == false) return tt("locked");
            else return (p + this.getEffect(this.level) + s);
        }
    }
};