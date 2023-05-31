var compareStats = {};
var comparePage = 0;

var C = "default";
var calcTime = "";
var calcTime2 = "";
var timeDisplay = "";
var futureTimeDisplay = "";
var year = month = "";
var timeOutID = "none";

var barrelsDisplayMode = 0;
var selectedConvert = 0;
var selectedConvertTo = 0;

var giftMsg = "";
var sendTo = "";
var giftType = "none";
var giftContent;
var giftAmount = 0;

var worth1, worth2;
var multiConvert = 1;

var timeMode = false;
var timeModeTime = 0;
var timeTires = 0;
var upgradingBarrel = 0;
var upgradingType = "mas";

var characters = [[0.4, 0.6, 1, 0, () => applyUpgrade(game.shrine.factoryUnlock)], [0.6, 0.75, 1, 0.5, () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)]];
const tabYs = [0.2, 1.1, 2.0, 2.4];

var musicPlayer = document.getElementById("audioPlayer");
musicPlayer.src = songs["newerWave"];
musicPlayer.loop = true;
musicPlayer.preload = true;

function getTotalLevels(x) {
    return 0;
}

function playMusic() {
    if (game.settings.musicOnOff) {
        musicPlayer.src = songs[Object.keys(songs)[game.settings.musicSelect]];
        musicPlayer.volume = game.settings.musicVolume / 100;
        musicPlayer.play();
    }
    else {
        musicPlayer.pause();
    }
}

class Scene
{
    static loadScene(name)
    {
        let scene = scenes.find(scene => scene.name === name);
        if (scene !== undefined)
        {
            currentScene = scene;
        }
        else
        {
            console.warn("Scene \"" + name + "\" does not exist");
        }
    }

    constructor(name, ui, render, onpress, onrelease, cfg)
    {
        this.name = name;
        this.ui = ui;
        this.render = render;
        this.scenePress = onpress ? onpress : function ()
        {
        };
        this.sceneRelease = onrelease ? onrelease : function ()
        {
        };
        this.oncreate = cfg && cfg.oncreate ? cfg.oncreate : this.oncreate;
        this.popupTexts = [];

        this.oncreate();
    }

    oncreate()
    {

    }

    addUI(el)
    {
        this.ui.push(el);
    }

    onPress()
    {
        this.scenePress();

        this.handleUIClick();
    }

    onRelease()
    {
        this.sceneRelease();

        this.handleUIRelease();
    }

    update(delta)
    {
        this.render(delta);

        for (let element of this.ui)
        {
            element.update();
            element.render(ctx);
        }

        for (let p of this.popupTexts)
        {
            p.tick(delta);
            p.render(ctx);
        }

        this.popupTexts = this.popupTexts.filter(text => text.lifeTime < 1);

        
    }

    handleElementAction(element, type)
    {
        if (!element.isGroup)
        {
            if (element.isHovered())
            {
                if(type === 0)
                {
                    element.onclick();
                }
                else
                {
                    element.onrelease();
                }
            }
        }
        else
        {
            if(element.isVisible() && !element.outOfScroll)
            {
                for (let el of element.uiElements)
                {
                    this.handleElementAction(el, type);
                }
            }
        }
    }

    handleUIClick()
    {
        for (let element of this.ui)
        {
            this.handleElementAction(element, 0);
        }
    }

    handleUIRelease()
    {
        for (let element of this.ui)
        {
            this.handleElementAction(element, 1);
        }
    }
}

function drawStars(amount, size)
{
    for (let i = 0; i < amount; i++)
    {
        let x = (0.5 + 0.5 * Math.sin(i * 675510 + Date.now() / 51234)) * w;
        let y = (0.5 + 0.5 * Math.sin(i * 387450 + Date.now() / 84521)) * h;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(x, y, h / 300 * size, h / 300 * size, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function drawCurrencyBar(val, img, offY, width)
{
    let oy = offY !== undefined ? offY : 0;
    let widthTimes = width ? width : 1;

    let xOff = w / 1.75 / 2 * (widthTimes - 1);

    ctx.fillStyle = "#5F7B9F";
    ctx.fillRect(w * 0.25 - xOff, h * 0.2 + oy, w / 1.75 * widthTimes, h * 0.06);

    ctx.font = (h * 0.06) + "px " + fonts.default;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";

    ctx.fillText(formatNumber(val), w * 0.25 + h * 0.055 - xOff, h * 0.2 + 4 + oy, w / 2.25 * widthTimes);
    ctx.drawImage(img, w * 0.25 - h * 0.03 - xOff, h * 0.19 + oy, h * 0.08, h * 0.08);
}

function getBeamTime() {
    if (timeMode) {
        return tt("time") + formatTime(timeModeTime);
    }
    else {
        if (game.beams.selected == 0) {
            return tt("Next Beam in: ") + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 1) {
            return tt("Next Beam in: ") + (45 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 2) {
            return tt("Next Beam in: ") + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 3) {
            return tt("Next Beam in: ") + (45 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 4) {
            return tt("Next Beam in: ") + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
    }
}

function getStonks(swit) {
    let worth;
    switch (swit) {
        case 0:
            worth = (game.beams.hbv != undefined ? game.beams.hbv : getBeamBaseValue()) / (30 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
        case 1:
            worth = (game.beams.haebv != undefined ? game.beams.haebv : getAeroBeamValue()) / (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams));
            break;
        case 2:
            worth = (game.beams.habv != undefined ? game.beams.habv : getAngelBeamValue()) / (30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams));
            break;
        case 3:
            worth = (game.beams.hrbv != undefined ? game.beams.hrbv : getReinforcedBeamValue()) / (45 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
        case 4:
            worth = (game.beams.hgbv != undefined ? game.beams.hgbv : getGlitchBeamValue()) / (30 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
    }
    return worth;
}

function convertButtonCheck(type, worthn) {
    let got;
    switch (type) {
        case 0:
            got = game.beams.amount;
            break;
        case 1:
            got = game.aerobeams.amount;
            break;
        case 2:
            got = game.angelbeams.amount;
            break;
        case 3:
            got = game.reinforcedbeams.amount;
            break;
        case 4:
            got = game.glitchbeams.amount;
            break;
    }
    return got.gte(worthn);
}

function convertButtonConvert(type, amount, type2, amount2) {
    switch (type) {
        case 0:
            game.beams.amount = game.beams.amount.sub(amount);
            break;
        case 1:
            game.aerobeams.amount = game.aerobeams.amount.sub(amount);
            break;
        case 2:
            game.angelbeams.amount = game.angelbeams.amount.sub(amount);
            break;
        case 3:
            game.reinforcedbeams.amount = game.reinforcedbeams.amount.sub(amount);
            break;
        case 4:
            game.glitchbeams.amount = game.glitchbeams.amount.sub(amount);
            break;
    }
    switch (type2) {
        case 0:
            game.beams.amount = game.beams.amount.add(amount2);
            break;
        case 1:
            game.aerobeams.amount = game.aerobeams.amount.add(amount2);
            break;
        case 2:
            game.angelbeams.amount = game.angelbeams.amount.add(amount2);
            break;
        case 3:
            game.reinforcedbeams.amount = game.reinforcedbeams.amount.add(amount2);
            break;
        case 4:
            game.glitchbeams.amount = game.glitchbeams.amount.add(amount2);
            break;
    }
}

let loadDots = 0;

var scenes =
    [
        new Scene("Loading",
            [],
            function (delta) {
                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table2"];
                ctx.fillRect(0, h * 0.1, w, h);

                ctx.drawImage(images.appIcon, w * 0.3, h * 0.25, w * 0.4, w * 0.4);

                ctx.fillStyle = colors[C]["text"];
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.font = "300 " + (h * 0.06) + "px " + fonts.default;
                ctx.fillText("Scrap II Fanmade FR", w * 0.5, h * 0.02, w * 0.9);
                ctx.fillText(tt("madeby"), w * 0.5, h * 0.075, w * 0.4);

                // Loading... text
                loadDots += delta * 1000;
                ctx.font = "300 " + (h * 0.05) + "px " + fonts.default;
                if (loadDots > 3999) {
                    loadDots = 0;
                }
                else if (loadDots > 2999) ctx.fillText(tt("Loading") + "...", w * 0.5, h * 0.6, w * 0.9);
                else if (loadDots > 1999) ctx.fillText(tt("Loading") + "..", w * 0.5, h * 0.6, w * 0.9);
                else if (loadDots > 999) ctx.fillText(tt("Loading") + ".", w * 0.5, h * 0.6, w * 0.9);
                else ctx.fillText(tt("Loading"), w * 0.5, h * 0.6, w * 0.9);

                ctx.font = "300 " + (h * 0.03) + "px " + fonts.default;
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillText(gameVersionText, w * 0.99, h - w * 0.01);

                ctx.textAlign = "center";
                ctx.font = "200 " + (h * 0.03) + "px " + fonts.default;
                ctx.fillText("Bonus update 3", w * 0.49, h - w * 0.2);

            }),
        new Scene("Barrels",
            [
                new UIButton(0.125, 0.73, 0.05, 0.05, images.upgrades.betterBarrels, function () {
                    game.settings.hyperBuy ? game.scrapUpgrades.betterBarrels.buyToTarget("hyperbuy", false) : game.scrapUpgrades.betterBarrels.buy();
                }, {
                    isVisible: () => !timeMode,
                    quadratic: true
                }),
                new UIButton(0.875, 0.73, 0.05, 0.05, images.ezUpgrade, function () {
                    let GoTo = prompt(tt("barrelgoto"));
                    GoTo = Math.round(GoTo - 1);
                    if (GoTo < 0) {
                        alert(tt("Too low!"));
                        return;
                    }
                    if (GoTo < game.scrapUpgrades.betterBarrels.maxLevel) {
                        game.scrapUpgrades.betterBarrels.buyToTarget(GoTo);
                        updateUpgradingBarrelFromBB();
                    }
                    else {
                        alert(tt("Too high!"));
                    }
                }, {
                    isVisible: () => (game.skillTree.upgrades.superEzUpgrader.level > 0 || game.supernova.cosmicUpgrades.keepEZ.level > 0) && !timeMode,
                    quadratic: true
                }),
                new UIButton(0.125, 0.81, 0.05, 0.05, images.upgrades.fasterBarrels, function () {
                    game.settings.hyperBuy ? game.scrapUpgrades.fasterBarrels.buyToTarget("hyperbuy", false) : game.scrapUpgrades.fasterBarrels.buy();
                }, {
                    isVisible: () => !timeMode,
                    quadratic: true
                }),



                new UIButton(0, 0.97, 0.15, 0.06, images.scenes.dimension, () => Scene.loadScene("SecondDimension"), {
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SECOND_DIMENSION && !timeMode,
                    quadraticMin: true, anchor: [0, 0.5]
                }),
                new UIButton(0.2, 0.97, 0.15, 0.06, images.scenes.barrelGallery, () => Scene.loadScene("BarrelGallery"), {
                    isVisible: () => !timeMode,
                    quadraticMin: true
                }),
                new UIButton(0.35, 0.97, 0.15, 0.06, images.scenes.steelBeams, () => {
                    switch (game.settings.beamRed) {
                        case 0: // Normal Beams
                            Scene.loadScene("Beams");
                            break;
                        case 1: // Current
                            Scene.loadScene(["Beams", "Aerobeams", "AngelBeams", "ReinforcedBeams", "GlitchBeams"][game.beams.selected]);
                            break;
                        case 2: // Selection
                            Scene.loadScene("Beamselection");
                            break;
                    }
                }, {
                    isVisible: () => game.beams.isUnlocked() && !timeMode,
                    quadraticMin: true
                }),
                new UIButton(0.5, 0.97, 0.15, 0.06, images.scenes.factory, () => Scene.loadScene("ScrapFactory"), {
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SCRAP_FACTORY && !timeMode,
                    quadraticMin: true
                }),
                new UIButton(0.65, 0.97, 0.15, 0.06, images.scenes.fragment, () => Scene.loadScene("Fragment"),
                    {
                        isVisible: () => game.highestBarrelReached >= 100 && !timeMode,
                        quadraticMin: true
                    }),
                new UIButton(0.8, 0.97, 0.15, 0.06, images.scenes.goldenScrap, () => Scene.loadScene("GoldenScrap"),
                    {
                        isVisible: () => game.highestScrapReached.gte(1e15) && !timeMode,
                        quadraticMin: true
                    }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.solarSystem, () => Scene.loadScene("SolarSystem"),
                    {
                        isVisible: () => game.goldenScrap.upgrades.scrapBoost.level >= 8 && !timeMode,
                        quadraticMin: true,
                        anchor: [1, 0.5]
                    }),


                new UIButton(0.125, 0.9, 0.05, 0.05, images.scenes.magnet, () => Scene.loadScene("MagnetUpgrades"), { quadratic: true }),
                new UIButton(0.275, 0.9, 0.05, 0.05, images.scenes.options, () => Scene.loadScene("Options"), { quadratic: true }),
                new UIButton(0.425, 0.9, 0.05, 0.05, images.scenes.milestones, () => Scene.loadScene("Milestones"), { quadratic: true }),
                new UIButton(0.575, 0.9, 0.05, 0.05, images.buttonMaxAll, () => maxScrapUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.earth.level >= 1 && !timeMode
                    }),
                new UICheckbox(0.725, 0.9, 0.05, 0.05, "game.settings.autoMerge", {
                    isVisible: () => game.ms.includes(7) && !timeMode,
                    quadratic: true,
                    off: images.checkbox.autoMerge.off,
                    on: images.checkbox.autoMerge.on,
                }),
                new UICheckbox(0.875, 0.9, 0.05, 0.05, "game.settings.autoConvert", {
                    isVisible: () => game.highestBarrelReached >= 300 && !timeMode,
                    quadratic: true,
                    off: images.checkbox.autoConvert.off,
                    on: images.checkbox.autoConvert.on,
                }),

                new UICheckbox(0.575, 0.825, 0.05, 0.05, "game.settings.hyperBuy", {
                    isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0,
                    quadratic: true,
                    off: images.checkbox.hyperbuy.off,
                    on: images.checkbox.hyperbuy.on,
                }),
                new UIText(() => formatNumber(game.settings.hyperBuyCap), 0.725, 0.785, 0.025, "black", { bold: true, isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0 }),
                new UIButton(0.725, 0.825, 0.05, 0.05, images.hyperbuyLevel, () => {
                    let newCap = prompt("New Hyper Buy level cap? (It won't buy more levels than that. 0 = unlimited)");
                    if (Math.round(newCap) > -1) {
                        game.settings.hyperBuyCap = newCap;
                    }
                    else {
                        alert(tt("Too low!"));
                    }
                }, { quadratic: true, isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0 }),
                new UIText(() => formatNumber(game.settings.hyperBuyPer) + "%", 0.875, 0.785, 0.025, "black", { bold: true, isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0 }),
                new UIButton(0.875, 0.825, 0.05, 0.05, images.hyperbuyPercent, () => {
                    let newCap = prompt("New Hyper Buy percentage? (It won't buy more than this percentage. 100 = unlimited)");
                    if (Math.round(newCap) > -1) {
                        game.settings.hyperBuyPer = Math.min(newCap, 100);
                    }
                    else {
                        alert(tt("Too low!"));
                    }
                }, { quadratic: true, isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0 }),

                new UIText(() => game.scrapUpgrades.betterBarrels.getPriceDisplay(), 0.125, 0.76, 0.035, "black", { bold: true }),
                new UIText(() => tt("Better Barrels") + " (" + game.scrapUpgrades.betterBarrels.level.toFixed(0) + "/" + game.scrapUpgrades.betterBarrels.maxLevel + "):\n" + tt("bbdesc"), 0.225, 0.74, 0.03, "black", { halign: "left", valign: "middle" }),
                new UIText(() => game.scrapUpgrades.fasterBarrels.getPriceDisplay(), 0.125, 0.84, 0.035, "black", { bold: true }),
                new UIText(() => tt("Faster Barrels") + ":\n" + tt("fbdesc") + "\n" + game.scrapUpgrades.fasterBarrels.getEffectDisplay(), 0.225, 0.82, 0.03, "black", { halign: "left", valign: "middle" }),

                new UIText(() => {
                    if (game.dimension == 0) return "+" + formatNumber(Barrel.getGlobalIncome()) + "/s"
                    else return "+" + formatNumber((Barrel.getGlobalIncome().min((new Decimal(game.highestScrapReached.floor().sub(game.scrap.floor()))))).max(0)) + "/s"
                }, 0.3, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.settings.beamTimer == true) { return getBeamTime() } else { return " " } }, 0.725, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0 && timeMode == false) { return tt("Next Storm Chance in: ") + (60 - gsStormTime.toFixed(0)) + "s" } else { return " " } }, 0.725, 0.085, 0.025, "white", { bold: true }),
            ],
            function (delta) {
                for (let i = 0, l = barrels.length; i < l; i++) {
                    if (barrels[i] !== undefined) {
                        barrels[i].tick(delta);
                    }
                }

                incomeTextTime.cooldown += delta;

                if (incomeTextTime.cooldown >= incomeTextTime.time && !game.settings.lowPerformance) {
                    for (let b of barrels) {
                        if (b !== undefined) {
                            b.createIncomeText();
                        }
                    }
                    incomeTextTime.cooldown = 0;
                }

                if (draggedBarrel !== undefined) {
                    draggedBarrel.scale = 1.2;
                }

                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
                ctx.lineWidth = 0;

                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, h * 0.857, w, h * 0.0075);
                ctx.fillRect(0, h * 0.696, w, h * 0.0075);
                ctx.fillRect(0, h * 0.098, w, h * 0.0075);
                ctx.fillRect(0, h * 0.935, w, h * 0.01);

                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, 0, w, h * 0.1);
                ctx.fillRect(0, h * 0.94, w, h * 0.06);

                ctx.fillStyle = "#003E8F";
                ctx.fillRect(w * 0.1, h * 0.04, w / 2.5, h * 0.04);
                ctx.fillRect(w * 0.92, h * 0.04, -w / 2.75, h * 0.04);

                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillStyle = "white";

                // barrels1, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE
                ctx.drawImage(images.scrap, w * 0.1 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);
                ctx.fillText(formatNumber(game.scrap), w * 0.15, h * 0.043, w / 3);

                ctx.textAlign = "right";
                ctx.fillText(formatNumber(game.magnets, game.settings.numberFormatType, { namesAfter: 1e9 }), w * 0.85, h * 0.043, w / 3.5);
                ctx.drawImage(images.magnet, w * 0.9 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(0, h * 0.7, w, h * 0.08);
                ctx.fillStyle = colors[C]["table2"];
                ctx.fillRect(0, h * 0.78, w, h * 0.08);

                for (let i = 0, l = barrels.length; i < l; i++) {
                    if (barrels[i] !== undefined && barrels[i].scale >= 1 || barrels[i] === undefined) {
                        tempDrawnBarrels[i] = undefined;
                    }
                }

                let barrelSize = Barrel.getBarrelSize();
                for (let i = 0, l = barrels.length; i < l; i++) {
                    let x = w / 2 + (barrelSize * 1.1 * (i % 4)) - (barrelSize * 1.1 * 1.5);
                    let y = h / 2 + (barrelSize * 1.15 * Math.floor(i / 4)) - (barrelSize * 1.15 * 2.6) - h * 0.03;

                    ctx.fillStyle = "rgb(127, 127, 127)";

                    if (!game.settings.nobarrels) {
                        if (barrels[i] === undefined && tempDrawnBarrels[i] === undefined || (barrels[i] !== undefined && barrels[i].scale < 1) && tempDrawnBarrels[i] === undefined) {
                            ctx.drawImage(images.barrelTemplate, x - barrelSize / 2, y - barrelSize / 2, barrelSize, barrelSize);
                        }
                        if (!game.settings.lowPerformance && tempDrawnBarrels[i] !== undefined && (barrels[i] !== undefined && barrels[i].scale < 1)) {
                            Barrel.renderBarrel(ctx, tempDrawnBarrels[i], x, y, barrelSize);
                        }
                        if (barrels[i] !== undefined) {
                            barrels[i].setCoord(x, y);
                            barrels[i].render(ctx);
                        }
                        if (game.barrelMastery.isUnlocked()) {
                            Barrel.renderBarrel(ctx, upgradingBarrel, 0.04 * w, 0.65 * h, barrelSize / 2);

                            ctx.fillStyle = colors[C]["text"];
                            ctx.textAlign = "left";
                            ctx.font = (h * 0.015) + "px " + fonts.default;
                            if (upgradingType == "mas") {
                                ctx.fillText(game.barrelMastery.b[upgradingBarrel % BARRELS], 0.01, 0.64 * h + barrelSize / 2);
                            }
                            else {
                                ctx.fillText(game.mergeQuests.quests[upgradingType].currentMerges + "/" + game.mergeQuests.quests[upgradingType].getNeededMerges(), 0.01, 0.64 * h + barrelSize / 2);
                            }
                        }
                    }
                }

                if (draggedBarrel != null) {
                    draggedBarrel.setCoord(mouseX, mouseY);
                    draggedBarrel.render(ctx);
                }

                ctx.fillStyle = "black";
            },
            function () {
                for (let i = 0; i < barrels.length; i++) {
                    let b = barrels[i];
                    if (b != null && b.isClicked()) {
                        if (draggedBarrel == undefined) undefiner = true;
                        else {
                            undefiner = false;
                            undefinerPos = draggedBarrel.originPos;
                            undefinerLev = draggedBarrel.level;
                        }
                        draggedBarrel = b;
                        if (timeSinceLastBarrelClick <= 0.2 && lastClickedBarrel === i && game.settings.destroyBarrels && !timeMode) {
                            if (game.fragment.isUnlocked() == true) {
                                let Amount = new Decimal(0.1 + barrels[i].level / 10).mul(getFragmentBaseValue());
                                if (game.dimension == 0) {
                                    let Amount = new Decimal(0.1 + barrels[i].level / 10).mul(getFragmentBaseValue());
                                    game.fragment.amount = game.fragment.amount.add(Amount);
                                    game.stats.totalfragments = game.stats.totalfragments.add(Amount);
                                }
                                else if (game.dimension == 1) {
                                    let Amount = new Decimal(0.1 + barrels[i].level / 10).mul(getDarkFragmentBaseValue());
                                    game.darkfragment.amount = game.darkfragment.amount.add(Amount);
                                    game.stats.totaldarkfragments = game.darkfragment.amount.add(Amount);
                                }
                            }
                            barrels[i] = undefined;
                            draggedBarrel = undefined;
                            lastClickedBarrel = -1;
                            freeSpots += 1;
                        }
                        else { // Pick up a barrel / start dragging it - set draggedBarrel to the now dragged barrel
                            if (undefiner) {
                                lastClickedBarrel = i;
                                timeSinceLastBarrelClick = 0;
                                draggedBarrel.originPos = i;
                                barrels[i] = undefined;
                            }
                            else {
                                barrels[undefinerPos] = new Barrel(undefinerLev);
                                lastClickedBarrel = -1;
                                draggedBarrel = undefined;
                            }
                            /*if (freeSpots == 0) {
                                for (b in barrels) {
                                    if (barrels[b] == undefined) {
                                        freeSpots += 1;
                                    }
                                }
                            }*/
                        }
                    }
                }
            },
            function () {
                if (draggedBarrel != null) {
                    let index = draggedBarrel.getDropIndex();
                    if (index !== -1) { // -1 means it's dropped into nowhere
                        let b = barrels[index];
                        if (b !== undefined) { // Place you drag to is not empty
                            let lvl = barrels[index].level;
                            if (Math.round(lvl) === Math.round(draggedBarrel.level)) { // MERGE
                                tempDrawnBarrels[index] = draggedBarrel.level;
                                barrels[index] = new Barrel(draggedBarrel.level + 1);
                                onBarrelMerge(false, Math.round(draggedBarrel.level));
                                draggedBarrel = undefined;
                            }
                            else { // NOT SAME, BACK TO WHERE IT WAS
                                barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                                if (!game.settings.lowPerformance) barrels[draggedBarrel.originPos].scale = 0.7;
                                draggedBarrel = undefined;
                            }
                        }
                        else { // Is empty, put my barrel there
                            barrels[index] = draggedBarrel;
                            barrels[draggedBarrel.originPos].scale = 1;
                            draggedBarrel = undefined;
                            // no need to change freeSpots
                        }
                    }
                    else { // put it back man
                        barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                        barrels[draggedBarrel.originPos].scale = 1;
                        draggedBarrel = undefined;
                    }
                }
            }),
        new Scene("MagnetUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIText("Magnet Upgrades", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIMagnetUpgrade(game.magnetUpgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "mag1"),
                new UIMagnetUpgrade(game.magnetUpgrades.moreGoldenScrap, images.upgrades.goldenScrapBoost, 0.5, "mag2", "table2"),
                new UIMagnetUpgrade(game.magnetUpgrades.magnetMergeChance, images.upgrades.magnetChance, 0.6, "mag3"),
                new UIGroup(
                    [
                        new UIMagnetUpgrade(game.magnetUpgrades.autoMerger, images.upgrades.fasterAutoMerge, 0.7, "mag4", "table2")
                    ], () => game.ms.includes(7)),
                new UIMagnetUpgrade(game.magnetUpgrades.brickSpeed, images.upgrades.brickSpeed, 0.8, "mag5", "table", () => applyUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed)),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.magnets, images.magnet);
            }),
        new Scene("GoldenScrap",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.goldenScrap, () => {
                    if (game.goldenScrap.getResetAmount().gt(0)) {
                        if (!game.settings.resetConfirmation || confirm(tt("gsreset").replace("<amount>", formatNumber(game.goldenScrap.getResetAmount())))) {
                            game.goldenScrap.reset();
                        }
                    }
                }, { quadratic: true }),
                new UIText(() => tt("goldenscrap"), 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => tt("gsgain").replace("<amount>", formatNumber(game.goldenScrap.getResetAmount(), game.settings.numberFormatType, { namesAfter: 1e10 })) + "\n" +
                    tt("gsboost").replace("<value>", formatPercent(applyUpgrade(game.solarSystem.upgrades.mercury), 0)) +
                    "\n\n", 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.goldenScrap$" + formatNumber(game.goldenScrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }) +
                    " → +" + formatPercent(game.goldenScrap.getBoost().sub(1), game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "gs1"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.75, "gs2", "table2"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "gs3"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("TimeMode",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.timemode, () => {
                    if (game.cogwheels.timeModeAttempts > 0) {
                        if (!game.settings.resetConfirmation || confirm("Do you really want to start the Time Mode and prestige?")) {
                            game.cogwheels.timeModeAttempts -= 1;
                            timeModeTime = 0;
                            timeMode = true;
                            game.goldenScrap.reset();

                            if (game.ms.includes(212) == false) {
                                game.ms.push(212);
                                GameNotification.create(new MilestoneNotificaion(213));
                            }
                        }
                    }
                }, { quadratic: true }),
                new UIText(() => tt("timemode"), 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => tt("timetext") + game.cogwheels.timeModeAttempts, 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.cogwheel$ " + tt("cogwheels") + ": " + formatNumber(game.cogwheels.amount), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),
                new UICogwheelUpgrade(game.cogwheels.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "cog1"),
                new UICogwheelUpgrade(game.cogwheels.upgrades.darkScrapBoost, images.upgrades.moreDarkScrap, 0.75, "cog2", "table2"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("SecondDimension",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.dimension, () => {
                    if (game.dimension == 0) { //Enter Dimension
                        if (game.goldenScrap.amount * 2 < new Decimal(1e20) * 2) {
                            alert(tt("enter2nddim").replace("<amount>", formatNumber(new Decimal(1e20))));
                        }
                        else {
                            game.dimension = 1;
                            game.mergesThisPrestige = 0;
                            updateBetterBarrels();
                            setBarrelQuality(game.settings.barrelQuality);
                            for (let i = 0; i < barrels.length; i++) {
                                barrels[i] = undefined;
                            }
                            freeSpots = 20;
                            draggedBarrel = undefined;

                            game.scrap = new Decimal(0);
                            game.scrapThisPrestige = new Decimal(0);

                            for (let upg of Object.keys(game.scrapUpgrades)) {
                                game.scrapUpgrades[upg].level = 0;
                            }
                            game.settings.barrelGalleryPage = 0;
                            Scene.loadScene("Barrels");
                        }
                    }
                    else if (game.dimension == 1) { //Leave Dimension
                        game.dimension = 0;
                        game.mergesThisPrestige = 0;
                        updateBetterBarrels();

                        game.darkscrap.amount = game.darkscrap.amount.add(getDarkScrap(calculateCurrentHighest()));
                        game.stats.totaldarkscrap = game.stats.totaldarkscrap.add(getDarkScrap(calculateCurrentHighest()));

                        game.scrapUpgrades.betterBarrels.level = 0;
                        game.scrapUpgrades.fasterBarrels.level = 0;

                        setBarrelQuality(game.settings.barrelQuality);
                        for (let i = 0; i < barrels.length; i++) {
                            barrels[i] = undefined;
                        }
                        freeSpots = 20;
                        draggedBarrel = undefined;

                        game.scrap = new Decimal(0);
                        game.goldenScrap.amount = new Decimal(0);
                        game.scrapThisPrestige = new Decimal(0);
                    }
                }, { quadratic: true }),
                new UIText(() => tt("Second Dimension"), 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return tt("2nddimtext") + "\n\n";
                    }
                    else {
                        return tt("2nddimtext2") + "\n\n" +
                            tt("earn") + ": " + formatNumber(getDarkScrap(calculateCurrentHighest()));
                    }
                }, 0.5, 0.2, 0.025, "black"),

                new UIText(() => tt("dsgsboost").replace("<amount>", formatNumber(applyUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap).toFixed(2))).replace("<multiplier>", formatNumber(((applyUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap).add(1).mul(game.darkscrap.amount))))) + "!", 0.5, 0.3, 0.025, "black"),

                new UIText(() => "$images.darkscrap$" + tt("darkscrap") + ": " + formatNumber(game.darkscrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIDarkScrapUpgrade(game.darkscrap.upgrades.darkScrapBoost, images.upgrades.moreDarkScrap, 0.65, "ds1"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.mergeTokenBoost, images.upgrades.moreMergeTokens, 0.75, "ds2", "table2"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap, images.upgrades.moreGS, 0.85, "ds3"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.strongerTiers, images.upgrades.strongerBarrelTiers, 0.95, "ds4", "table2"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("Fragment",
            [
                new UIText(() => tt("barrelfragments"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return tt("fragmentearn").replace("<tier>", (parseInt(game.scrapUpgrades.betterBarrels.level) + 1)).replace("<amount>", formatNumber(new Decimal(0.1 + game.scrapUpgrades.betterBarrels.level / 10).mul(getFragmentBaseValue())));
                    }
                    if (game.dimension == 1) {
                        return tt("dfragmentearn").replace("<tier>", (parseInt(game.scrapUpgrades.betterBarrels.level) + 1)).replace("<amount>", formatNumber(new Decimal(0.1 + game.scrapUpgrades.betterBarrels.level / 10).mul(getDarkFragmentBaseValue())));
                    }
                }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.fragment$ Barrel Fragments: " + formatNumber(game.fragment.amount), 0.5, 0.3, 0.04, "yellow"),
                new UIFragmentUpgrade(game.fragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.45, "frag1"),
                new UIFragmentUpgrade(game.fragment.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.55, "frag2", "table2"),

                new UIText(() => {
                    if (game.darkfragment.isUnlocked()) {
                        return "$images.darkfragment$ " + tt("darkfragments") + ": " + formatNumber(game.darkfragment.amount);
                    }
                    else {
                        return "";
                    }
                }, 0.5, 0.65, 0.04, "yellow"),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.75, "darkfrag1", 0,
                    () => { return game.darkfragment.isUnlocked() }),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.moreFragments, images.upgrades.moreFragments, 0.85, "darkfrag2", "table2",
                    () => { return game.darkfragment.isUnlocked() }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
                if (game.darkfragment.isUnlocked()) {
                    ctx.fillRect(w * 0.05, h * 0.638, w * 0.9, h * 0.06);
                }
            }),
        new Scene("BarrelGallery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.checkbox.autoMerge.on, () => {
                    if (barrelsDisplayMode == 0) barrelsDisplayMode = 1;
                    else barrelsDisplayMode = 0;
                }, { quadratic: true, isVisible: game.barrelMastery.isUnlocked }),
                new UIButton(0.9, 0.05, 0.07, 0.07, images.masteryIcon, () => Scene.loadScene("Mastery"),
                    { quadratic: true, isVisible: game.barrelMastery.isUnlocked }),

                new UIButton(0.25, 0.15, 0.07, 0.07, images.upgrades.betterBarrels, function () {
                    game.scrapUpgrades.betterBarrels.buy();
                }, { quadratic: true, isVisible: game.barrelMastery.isUnlocked }),
                new UIButton(0.25, 0.9, 0.1, 0.1, images.arrows.left, () => game.settings.barrelGalleryPage = Math.max(0, game.settings.barrelGalleryPage - 1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.75, 0.9, 0.1, 0.1, images.arrows.right, () => {
                    game.settings.barrelGalleryPage = Math.min(game.barrelGallery.getMaxPage(), game.settings.barrelGalleryPage + 1);
                }, {
                    quadratic: true,
                    isVisible: () => game.settings.barrelGalleryPage < game.barrelGallery.getMaxPage()
                }),
                new UIButton(0.5, 0.9, 0.1, 0.1, images.searchbutton, () => {
                    let GoTo = prompt(tt("barrelgoto"));
                    if (GoTo > -1) {
                        GoTo = Math.floor(GoTo);
                        if (GoTo < 1) GoTo = 1;
                        if (GoTo == game.scrapUpgrades.betterBarrels.level + 1) {
                            if (game.ms.includes(120) == false) {
                                game.ms.push(120);
                                GameNotification.create(new MilestoneNotificaion(121));
                            }
                        }
                        game.settings.barrelGalleryPage = Math.floor((GoTo - 1) / 20);
                    }
                    else alert("Invalid number!");
                }, {
                    quadratic: true,
                    isVisible: () => game.highestBarrelReached > 99
                }),
                new UIButton(0.1, 0.9, 0.1, 0.1, images.arrows.left_2, () => game.settings.barrelGalleryPage = 0,
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.9, 0.9, 0.1, 0.1, images.arrows.right_2, () => {
                    game.settings.barrelGalleryPage = game.barrelGallery.getMaxPage();
                }, {
                    quadratic: true,
                    isVisible: () => game.settings.barrelGalleryPage < game.barrelGallery.getMaxPage()
                }),
                new UIText(() => tt("Barrels"), 0.5, 0.05, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => formatThousands(20 * game.settings.barrelGalleryPage + 1) + "-" + formatThousands(20 * game.settings.barrelGalleryPage + 20), 0.5, 0.125, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.003,
                    font: fonts.title
                })
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                for (let i = 0; i < 4; i++) {
                    ctx.fillStyle = colors[C][["table", "bg"][i % 2]];
                    ctx.fillRect(0, h * 0.1875 + h * 0.15 * i, w, h * 0.15);
                }
                let maxLvl = Math.min(20 * game.settings.barrelGalleryPage + 20, Math.round(Barrel.getMaxLevelBarrel()) + 1);
                for (let i = 20 * game.settings.barrelGalleryPage; i < 20 * game.settings.barrelGalleryPage + 20; i++) {
                    let c = i - 20 * game.settings.barrelGalleryPage; //used for coordinates
                    let x = (0.15 + 0.7 * (c % 5) / 4) * w;
                    let y = h * 0.15 * Math.floor(c / 5) + h * 0.25;

                    let drawPreview = maxLvl <= i;

                    let size = Math.min(w * 0.19, h * 0.1);
                    Barrel.renderBarrel(ctx, i, x, y, size, drawPreview);

                    ctx.fillStyle = colors[C]["text"];
                    ctx.font = "bold " + (h * 0.025) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    if (!drawPreview) {
                        if (barrelsDisplayMode == 0) ctx.fillText(i + 1, x, y - h * 0.065, w * 0.15);
                        else ctx.fillText(game.barrelMastery.b[i % BARRELS], x, y - h * 0.065, w * 0.15);
                        if (barrelsDisplayMode == 0) ctx.fillText(formatNumber(Barrel.getIncomeForLevel(i)), x, y + h * 0.06, w * 0.15);
                        else ctx.fillText(calculateMasteryLevel(game.barrelMastery.b[i % BARRELS]), x, y + h * 0.06, w * 0.15);
                    }
                }
            }),
        new Scene("Mastery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("BarrelGallery"), { quadratic: true }),
                new UIText(() => tt("Mastery Upgrades"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "mastery1", "table", () => getTotalLevels(1) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.goldenScrapBoost, images.upgrades.moreGS, 0.525, "mastery2", "table2", () => getTotalLevels(2) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.brickBoost, images.upgrades.brickBoost, 0.65, "mastery3", "table", () => getTotalLevels(3) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.fragmentBoost, images.upgrades.moreFragments, 0.775, "mastery4", "table2", () => getTotalLevels(4) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.9, "mastery5", "table", () => getTotalLevels(5) > 9),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.barrelMastery.masteryTokens, images.masteryToken);

                for (i = 0; i < 5; i++) {
                    ctx.fillStyle = "black";
                    ctx.font = (h * 0.04) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.fillText("Unlocked at 10 mastery level " + (i + 1) + " barrels!", w * 0.5, h * (0.4 + (0.125 * i)), w * 0.5);

                    ctx.fillStyle = "rgb(66, 66, 66)";
                    ctx.fillRect(0, h * (0.445 + (0.125 * i)), w, h * 0.025);
                    ctx.fillStyle = colors[C]["bgFront"];
                    ctx.fillRect(0, h * (0.445 + (0.125 * i)), w * (getTotalLevels(i + 1) / BARRELS), h * 0.025);
                    ctx.fillStyle = "white";
                    ctx.font = (h * 0.025) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.fillText(getTotalLevels(i + 1) + " / " + BARRELS, w * 0.5, h * (0.4475 + (0.125 * i)), w * 0.15);
                    ctx.textAlign = "left";
                    ctx.fillText("x" + formatNumber(new Decimal(applyUpgrade(
                        game.barrelMastery.upgrades[["scrapBoost", "goldenScrapBoost", "brickBoost", "fragmentBoost", "magnetBoost"][i]]
                    )).pow(getTotalLevels(i + 1))), w * 0.025, h * (0.4475 + (0.125 * i)), w * 0.15);
                }
            }),
        new Scene("SolarSystem",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIButton(0.9, 0.2, 0.07, 0.07, images.scenes.mergeQuests, () => Scene.loadScene("MergeQuests"), {
                    quadratic: true,
                    isVisible: game.mergeQuests.isUnlocked
                }),
                new UIButton(0.9, 0.1, 0.07, 0.07, images.scenes.mergeMastery, () => Scene.loadScene("MergeMastery"), {
                    quadratic: true,
                    isVisible: game.mergeMastery.isUnlocked
                }),
                new UIButton(0.9, 0.3, 0.07, 0.07, images.scenes.bricks, () => Scene.loadScene("Bricks"), {
                    quadratic: true,
                    isVisible: game.bricks.isUnlocked
                }),
                new UIButton(0.9, 0.4, 0.07, 0.07, images.scenes.tires, () => Scene.loadScene("Tires"), {
                    quadratic: true,
                    isVisible: game.tires.isUnlocked
                }),
                new UIButton(0.9, 0.5, 0.07, 0.07, images.scenes.skillTree, () => Scene.loadScene("SkillTree"), {
                    quadratic: true,
                    isVisible: game.skillTree.isUnlocked
                }),
                new UIButton(0.9, 0.6, 0.07, 0.07, images.scenes.wrenches, () => Scene.loadScene("Wrenches"), {
                    quadratic: true,
                    isVisible: game.wrenches.isUnlocked
                }),
                new UIButton(0.9, 0.7, 0.07, 0.07, images.scenes.daily, () => Scene.loadScene("Daily"), {
                    quadratic: true,
                    isVisible: () => game.highestBarrelReached >= 1000
                }),
                new UIButton(0.9, 0.8, 0.07, 0.07, images.scenes.statistics, () => Scene.loadScene("StatCompare"), {
                    quadratic: true
                }),
                new UIButton(0.7, 0.9, 0.07, 0.07, images.scenes.plasticbags, () => Scene.loadScene("PlasticBags"), {
                    quadratic: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockPlasticBags)
                }),
                new UIButton(0.7, 0.8, 0.07, 0.07, images.scenes.screws, () => Scene.loadScene("Screws"), {
                    quadratic: true,
                    isVisible: () => game.screws.isUnlocked()
                }),
                new UIButton(0.5, 0.9, 0.07, 0.07, images.scenes.gifts, () => Scene.loadScene("Gifts"), {
                    quadratic: true,
                    isVisible: () => game.gifts.isUnlocked()
                }),
                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("OuterSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER
                }),

                new UIButton(0.25, 0.6, 0.1, 0.1, images.solarSystem.destroyer, () => Scene.loadScene("Supernova"), { quadratic: true, isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA || game.supernova.stars.gte(0) }),

                new UIPlanet(0.5, 0.5, () => tt("planet1"), game.solarSystem.upgrades.sun, "$images.magnet$", images.solarSystem.sun, 0.13),
                new UIPlanet(0.7, 0.7, () => tt("planet2"), game.solarSystem.upgrades.mercury, "$images.magnet$", images.solarSystem.mercury, 0.035),
                new UIPlanet(0.3, 0.325, () => tt("planet3"), game.solarSystem.upgrades.venus, "$images.scrap$", images.solarSystem.venus, 0.055),
                new UIPlanet(0.65, 0.2, () => tt("planet4"), game.solarSystem.upgrades.earth, "$images.goldenScrap$", images.solarSystem.earth, 0.055),
                new UIPlanet(0.2, 0.825, () => tt("planet5").replace("<amount>", formatNumber(fallingMagnetWorth())), game.solarSystem.upgrades.mars, "$images.fragment$", images.solarSystem.mars, 0.04, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS), //whoever did not put a , there before I hate U!!!

                new UIButton(0.6, 0.5, 0.05, 0.05, images.buttonMaxAll, () => maxSunUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.sun.level >= 250 && game.solarSystem.upgrades.sun.level < game.solarSystem.upgrades.sun.maxLevel
                    }),
                new UIButton(0.8, 0.7, 0.05, 0.05, images.buttonMaxAll, () => maxMercuryUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.mercury.level >= 100 && game.solarSystem.upgrades.mercury.level < game.solarSystem.upgrades.mercury.maxLevel
                    }),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);

                if (!game.settings.lowPerformance) {
                    drawStars(10, 2);
                    drawStars(40, 1);
                }
            }),
        new Scene("OuterSolarSystem",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIPlanet(0.4, 0.6, () => tt("planet6"), game.solarSystem.upgrades.jupiter, "$images.mergeToken$", images.solarSystem.jupiter, 0.075, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER),
                new UIPlanet(0.8, 0.7, () => tt("planet7"), game.solarSystem.upgrades.saturn, "$images.scrap$", images.solarSystem.saturn, 0.07, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_SATURN),
                new UIPlanet(0.8, 0.25, () => tt("planet8"), game.solarSystem.upgrades.uranus, "$images.magnet$", images.solarSystem.uranus, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_URANUS),
                new UIPlanet(0.25, 0.3, () => tt("planet9"), game.solarSystem.upgrades.neptune, "$images.tire$", images.solarSystem.neptune, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NEPTUNE),

                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("ThirdSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.neptune.level > 4,
                })
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.inner, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("ThirdSolarSystem",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("OuterSolarSystem"), { quadratic: true }),
                new UIPlanet(0.4, 0.6, () => tt("planet10"), game.solarSystem.upgrades.astro, "$images.goldenScrap$", images.solarSystem.astro, 0.075, () => game.solarSystem.upgrades.neptune.level > 4),
                new UIPlanet(0.8, 0.7, () => tt("planet11"), game.solarSystem.upgrades.mythus, "$images.scrap$", images.solarSystem.mythus, 0.07, () => game.solarSystem.upgrades.neptune.level > 4),
                new UIPlanet(0.8, 0.15, () => tt("planet12"), game.solarSystem.upgrades.posus, "$images.magnet$", images.solarSystem.posus, 0.12, () => game.solarSystem.upgrades.neptune.level > 4),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(10, 0.3);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("MergeMastery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIText(() => tt("Merge Mastery"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup(
                    [
                        new UIButton(0.5, 0.9, 0.3, 0.07, images.buttonEmpty, () => game.mergeMastery.prestige.reset()),
                        new UIText(() => tt("Prestige"), 0.5, 0.9, 0.06, "white", { bold: true, valign: "middle" })
                    ], () => game.mergeMastery.level > 49)
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
                let lvl = game.mergeMastery.level;

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(0, h * 0.2, w, h * 0.19);

                if (game.screws.isUnlocked()) {
                    ctx.fillStyle = colors[C]["table2"];
                    ctx.fillRect(0, h * 0.39, w, h * 0.08);

                    ctx.fillStyle = colors[C]["table"];
                    ctx.fillRect(0, h * (0.39 + 0.08), w, h * 0.08);

                    ctx.fillStyle = colors[C]["table2"];
                    ctx.fillRect(0, h * (0.39 + 0.16), w, h * 0.08);
                }
                else {
                    ctx.fillStyle = colors[C]["table2"];
                    ctx.fillRect(0, h * 0.39, w, h * 0.12);

                    ctx.fillStyle = colors[C]["table"];
                    ctx.fillRect(0, h * (0.39 + 0.12), w, h * 0.12);
                }

                //main
                ctx.fillStyle = "#000000a0";
                ctx.fillRect(0, h * 0.32, w, h * 0.05);
                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, h * 0.32, w * (game.mergeMastery.currentMerges / game.mergeMastery.getNeededMerges(lvl)), h * 0.05);

                ctx.fillStyle = "white";
                ctx.font = (h * 0.05) + "px " + fonts.default;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(formatThousands(game.mergeMastery.currentMerges) + "/" + formatThousands(game.mergeMastery.getNeededMerges(lvl)), w / 2, h * 0.32);

                ctx.fillStyle = colors[C]["text"];
                ctx.font = "bold " + (h * 0.075) + "px " + fonts.default;
                ctx.fillText("Level " + game.mergeMastery.level, w / 2, h * 0.225);

                if (game.screws.isUnlocked()) {
                    ctx.font = (h * 0.045) + "px " + fonts.default;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "middle";
                    Barrel.renderBarrel(ctx, 0, w * 0.05 + h * 0.05, h * 0.425, h * 0.075);
                    ctx.fillText("+" + formatPercent(game.mergeMastery.getScrapBoost(lvl).sub(1), 0), w * 0.3, h * 0.425, w * 0.68);
                    ctx.drawImage(images.magnet, w * 0.075, h * 0.475, h * 0.075, h * 0.075);
                    ctx.fillText("+" + formatNumber(game.mergeMastery.getMagnetBonus(lvl), game.settings.numberFormatType, { namesAfter: 1e10 }), w * 0.3, h * 0.5, w * 0.68);
                    ctx.drawImage(images.screw, w * 0.075, h * 0.55, h * 0.075, h * 0.075);
                    ctx.fillText("+" + formatNumber(game.screws.getScrews(lvl)), w * 0.3, h * 0.575, w * 0.68);
                    ctx.font = (h * 0.025) + "px " + fonts.default;
                    ctx.fillText(tt("scrapincome"), w * 0.3, h * 0.45);
                    ctx.fillText(tt("magnetsonlvlup"), w * 0.3, h * 0.525);
                    ctx.fillText(tt("screwsonlvlup"), w * 0.3, h * 0.6);
                }
                else {
                    ctx.font = (h * 0.07) + "px " + fonts.default;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "middle";
                    Barrel.renderBarrel(ctx, 0, w * 0.05 + h * 0.05, h * 0.45, h * 0.1);
                    ctx.fillText("+" + formatPercent(game.mergeMastery.getScrapBoost(lvl).sub(1), 0), w * 0.3, h * 0.45, w * 0.68);
                    ctx.drawImage(images.magnet, w * 0.05, h * 0.525, h * 0.1, h * 0.1);
                    ctx.fillText("+" + formatNumber(game.mergeMastery.getMagnetBonus(lvl), game.settings.numberFormatType, { namesAfter: 1e10 }), w * 0.3, h * 0.58, w * 0.68);

                    ctx.font = (h * 0.025) + "px " + fonts.default;
                    ctx.fillText(tt("scrapincome"), w * 0.3, h * 0.495);
                    ctx.fillText(tt("magnetsonlvlup"), w * 0.3, h * 0.62);
                }

                if (game.mergeMastery.level > 20 || game.mergeMastery.prestige.level > 0) {
                    ctx.fillStyle = colors[C]["table"];
                    ctx.fillRect(w * 0.1, h * 0.65, w * 0.8, h * 0.3);
                    ctx.font = "bold " + (h * 0.07) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    if (game.mergeMastery.level < 50 && game.mergeMastery.prestige.level === 0) {
                        Utils.drawEscapedText(ctx, "Reach Level 50 to\nunlock Prestige", w * 0.5, h * 0.79, 0.04, w * 0.7);
                    }
                    else {
                        let nextLvl = game.mergeMastery.prestige.level + Math.max(0, game.mergeMastery.level - 49);
                        let displayNext = nextLvl - game.mergeMastery.prestige.level > 0;

                        ctx.fillStyle = colors[C]["table2"];
                        ctx.fillRect(w * 0.18, h * 0.73, w * 0.64, h * 0.13);

                        ctx.fillStyle = colors[C]["text"];
                        ctx.fillText(tt("Prestige"), w * 0.5, h * 0.69);
                        ctx.font = (h * 0.035) + "px " + fonts.default;
                        ctx.textAlign = "left";
                        ctx.textBaseline = "top";
                        ctx.drawImage(images.goldenScrap, w * 0.2, h * 0.74, h * 0.05, h * 0.05);
                        let nxtGS = displayNext ? " → +" + formatPercent(game.mergeMastery.prestige.getGoldenScrapBoost(nextLvl)
                            .sub(1)) : "";
                        ctx.fillText("+" + formatPercent(game.mergeMastery.prestige.currentGSBoost().sub(1)) +
                            nxtGS, w * 0.3, h * 0.75, w * 0.5);
                        ctx.drawImage(images.magnet, w * 0.2, h * 0.8, h * 0.05, h * 0.05);
                        let nxtM = displayNext ? " → +" + formatPercent(game.mergeMastery.prestige.getMagnetBoost(nextLvl)
                            .sub(1)) : "";
                        ctx.fillText("+" + formatPercent(game.mergeMastery.prestige.currentMagnetBoost().sub(1)) +
                            nxtM, w * 0.3, h * 0.81, w * 0.5);
                    }
                }
            }),
        new Scene("Bricks",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIText(() => tt("bricks"), 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.9, 0.42, 0.05, 0.05, images.buttonMaxAll, () => game.bricks.maxUpgrades(), { quadratic: true, isVisible: () => game.bricks.amount >= (1e100) }),
                new UIBrickUpgrade(game.bricks.upgrades.scrapBoost, images.upgrades.moreScrap, 0.5, "brick1"),
                new UIBrickUpgrade(game.bricks.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.6, "brick2", "table2"),
                new UIBrickUpgrade(game.bricks.upgrades.brickBoost, images.upgrades.brickBoost, 0.7, "brick3"),
                new UIBrickUpgrade(game.bricks.upgrades.questSpeed, images.upgrades.questSpeed, 0.8, "brick4", "table2"),
                new UIBrickUpgrade(game.bricks.upgrades.questLevels, images.upgrades.questLevels, 0.9, "brick5")
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.bricks.amount, images.brick, -h * 0.025, 1.2);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(0, h * 0.28, w, h * 0.14);

                ctx.fillStyle = "black";
                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textAlign = "center";


                ctx.fillStyle = "rgb(66, 66, 66)";
                ctx.fillRect(0, h * 0.295, w, h * 0.05);
                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, h * 0.295, w * (game.bricks.currentMergeProgress / game.bricks.mergesPerLevel()), h * 0.05);
                ctx.fillStyle = "white";
                ctx.fillText(formatThousands(game.bricks.currentMergeProgress) + " / " + formatThousands(game.bricks.mergesPerLevel()), w * 0.5, h * 0.3);
                ctx.fillStyle = colors[C]["text"];
                ctx.font = (h * 0.02) + "px " + fonts.default;
                ctx.fillText(formatNumber(game.bricks.getCurrentProduction()) + " x" + formatNumber(new Decimal(2).pow(getBrickIncrease())) + "/s → " + formatNumber(game.bricks.getProduction(game.bricks.productionLevel.add(getBrickIncrease()))) + "/s", w * 0.5, h * 0.36);
            }),
        new Scene("Tires",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIButton(0.1, 0.125, 0.07, 0.07, images.scenes.tires, () => Scene.loadScene("Tire Club"), {
                    isVisible: () => game.tires.amount.gte(new Decimal("1e1000000000")) || game.tires.time != 600,
                    quadratic: true,
                }),
                new UIText(() => tt("tires"), 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIScrollContainerY([
                    new UIGroup([
                        new UIRect(0.5, 0.6, 1, 0.2, "table2"),
                        new UIImage(images.locked, 0.5, 0.58, 0.125, 0.125, { quadratic: true }),
                        new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[1]), 0.5, 0.67, 0.09, "black", { bold: true, valign: "middle" }),
                    ], () => game.tires.amount.lt(game.tires.milestones[1])),
                    new UIGroup([
                        new UIRect(0.5, 0.8, 1, 0.2, "table"),
                        new UIImage(images.locked, 0.5, 0.78, 0.125, 0.125, { quadratic: true }),
                        new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[2]), 0.5, 0.87, 0.09, "black", { bold: true, valign: "middle" }),
                    ], () => game.tires.amount.lt(game.tires.milestones[2])),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[0][0], images.upgrades.fasterBarrels, "tire11", 0.5 / 3, 0.4),
                        new UITireUpgrade(game.tires.upgrades[0][1], images.upgrades.brickSpeed, "tire12", 1.5 / 3, 0.4),
                        new UITireUpgrade(game.tires.upgrades[0][2], images.upgrades.fasterMastery, "tire13", 2.5 / 3, 0.4),
                        new UIButton(0.5 / 3 + 0.11, 0.4, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[0][0].buyToTarget(game.tires.upgrades[0][0].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[0][1].level == game.tires.upgrades[0][1].maxLevel && game.tires.upgrades[0][2].level == game.tires.upgrades[0][2].maxLevel }),
                    ]),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[1][0], images.upgrades.tireBoost, "tire21", 0.5 / 3, 0.6, "table2"),
                        new UITireUpgrade(game.tires.upgrades[1][1], images.upgrades.tireChance, "tire22", 1.5 / 3, 0.6, "table2"),
                        new UITireUpgrade(game.tires.upgrades[1][2], images.upgrades.questSpeed, "tire23", 2.5 / 3, 0.6, "table2"),
                        new UIButton(0.5 / 3 + 0.11, 0.6, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[1][0].buyToTarget(game.tires.upgrades[1][0].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[1][1].level == game.tires.upgrades[1][1].maxLevel && game.tires.upgrades[1][2].level == game.tires.upgrades[1][2].maxLevel }),
                    ], () => game.tires.amount.gt(game.tires.milestones[1])),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[2][0], images.upgrades.fasterFallingMagnets, "tire31", 0.5 / 3, 0.8),
                        new UITireUpgrade(game.tires.upgrades[2][1], images.upgrades.fasterAutoMerge, "tire32", 1.5 / 3, 0.8),
                        new UITireUpgrade(game.tires.upgrades[2][2], images.upgrades.goldenScrapBoost, "tire33", 2.5 / 3, 0.8),
                        new UIButton(2.5 / 3 + 0.11, 0.8, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[2][2].buyToTarget(game.tires.upgrades[2][2].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[2][0].level == game.tires.upgrades[2][0].maxLevel && game.tires.upgrades[2][1].level == game.tires.upgrades[2][1].maxLevel }),
                    ], () => game.tires.amount.gt(game.tires.milestones[2])),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[3][0], images.upgrades.higherNeptuneMax, "tire41", 0.5 / 3, 1.0, "table2"),
                        new UITireUpgrade(game.tires.upgrades[3][1], images.upgrades.beamValue, "tire42", 1.5 / 3, 1.0, "table2"),
                        new UITireUpgrade(game.tires.upgrades[3][2], images.upgrades.doublePlasticBags, "tire43", 2.5 / 3, 1.0, "table2"),
                        new UIButton(2.5 / 3 + 0.11, 1.0, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[3][2].buyToTarget(game.tires.upgrades[3][2].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[3][0].level == game.tires.upgrades[3][0].maxLevel && game.tires.upgrades[3][1].level == game.tires.upgrades[3][1].maxLevel }),
                    ], () => game.tires.milestones[3]())
                ], 0, 0.3, 1, 0.7, () => game.tires.milestones[3](), { ymin: 0, ymax: 1.1 })
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.tires.amount, images.tire, -h * 0.025, 1.2);
            }),
        new Scene("Beams",
            [
                new UIText(() => tt("beams"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIButton(0, 0.97, 0.15, 0.06, images.scenes.beamselection, () => Scene.loadScene("Beamselection"), {
                    quadraticMin: true,
                    isVisible: () => game.aerobeams.isUnlocked(),
                    anchor: [0, 0.5]
                }),
                new UIButton(0.235, 0.97, 0.15, 0.06, images.scenes.aerobeams, () => Scene.loadScene("Aerobeams"), {
                    quadraticMin: true,
                    isVisible: () => game.aerobeams.isUnlocked(),
                }),
                new UIButton(0.415, 0.97, 0.15, 0.06, images.scenes.convert, () => Scene.loadScene("Beamconvert"), {
                    quadraticMin: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockBeamConverter),
                }),
                new UIButton(0.585, 0.97, 0.15, 0.06, images.scenes.angelbeams, () => Scene.loadScene("AngelBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.angelbeams.isUnlocked(),
                }),
                new UIButton(0.765, 0.97, 0.15, 0.06, images.scenes.reinforcedbeams, () => Scene.loadScene("ReinforcedBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.reinforcedbeams.isUnlocked(),
                }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.glitchbeams, () => Scene.loadScene("GlitchBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.glitchbeams.isUnlocked(),
                    anchor: [1, 0.5]
                }),


                new UIText(() => tt("beamfalltext").replace("<interval>", (30 - applyUpgrade(game.beams.upgrades.fasterBeams))).replace("<value>", getBeamBaseValue()).replace("<chance>", applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1)).replace("<amount2>", (5 + applyUpgrade(game.beams.upgrades.beamStormValue))), 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$" + tt("beams") + ": " + formatNumber(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIScrollContainerY([
                    new UIBeamUpgrade(game.beams.upgrades.fasterBeams, images.upgrades.beamChance, 0.4, "beam1"),
                    new UIBeamUpgrade(game.beams.upgrades.beamValue, images.upgrades.beamValue, 0.5, "beam2", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.slowerBeams, images.upgrades.slowerBeams, 0.6, "beam3"),
                    new UIBeamUpgrade(game.beams.upgrades.beamStormChance, images.upgrades.beamStormChance, 0.7, "beam4", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.beamStormValue, images.upgrades.beamStormValue, 0.8, "beam5"),
                    new UIBeamUpgrade(game.beams.upgrades.moreScrap, images.upgrades.moreScrap, 0.9, "beam6", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.moreMagnets, images.upgrades.magnetBoost, 1.0, "beam7", "table", () => { return game.beams.upgrades.moreScrap.level > 9 }),

                ], 0, 0.35, 1, 0.55, () => true, { ymin: 0, ymax: 1.05 }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);

                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, h * 0.94, w, h * 0.06);
            }),
        new Scene("Beamselection",
            [
                new UIText(() => tt("beamselection"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("beamselecttext"), 0.5, 0.15, 0.03, "black"),

                new UIText(() => "$images.beam$ " + tt("beams") + ": " + formatNumber(game.beams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "$images.aerobeam$ " + tt("aerobeams") + ": " + formatNumber(game.aerobeams.amount), 0.5, 0.24, 0.06, "yellow"),
                new UIText(() => "$images.angelbeam$ " + tt("angelbeams") + ": " + formatNumber(game.angelbeams.amount), 0.5, 0.28, 0.06, "yellow", { isVisible: () => game.angelbeams.isUnlocked() }),
                new UIText(() => "$images.reinforcedbeam$ " + tt("reinforcedbeams") + ": " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.32, 0.06, "yellow", { isVisible: () => game.reinforcedbeams.isUnlocked() }),
                new UIText(() => "$images.glitchbeam$ " + tt("glitchbeams") + ": " + formatNumber(game.glitchbeams.amount), 0.5, 0.36, 0.06, "yellow", { isVisible: () => game.glitchbeams.isUnlocked() }),
                new UIText(() => tt("selected") + ": " + [tt("beams"), tt("aerobeams"), tt("angelbeams"), tt("reinforcedbeams"), tt("glitchbeams")][game.beams.selected], 0.5, 0.4, 0.06, "yellow"),


                new UIButton(0.3, 0.55, 0.15, 0.15, images.beam, () => game.beams.selected = 0, { quadratic: true }),
                new UIButton(0.7, 0.55, 0.15, 0.15, images.aerobeam, () => game.beams.selected = 1, { quadratic: true }),
                new UIButton(0.3, 0.7, 0.15, 0.15, images.angelbeam, () => game.beams.selected = 2, {
                    quadratic: true,
                    isVisible: () => { return game.angelbeams.isUnlocked() }
                }),
                new UIButton(0.7, 0.7, 0.15, 0.15, images.reinforcedbeam, () => game.beams.selected = 3, {
                    quadratic: true,
                    isVisible: () => { return game.reinforcedbeams.isUnlocked() }
                }),
                new UIButton(0.5, 0.85, 0.15, 0.15, images.glitchbeam, () => game.beams.selected = 4, {
                    quadratic: true,
                    isVisible: () => { return game.glitchbeams.isUnlocked() }
                }),

                new UIText(() => {
                    if (game.settings.beamTimer == false) {
                        return getBeamTime();
                    }
                    if (game.settings.beamTimer == true) {
                        return tt("(ON)") + " " + getBeamTime();
                    }
                }, 0.5, 0.95, 0.06, "yellow"),

                new UIButton(0.9, 0.97, 0.07, 0.07, images.scenes.options, () => {
                    switch (game.settings.beamTimer) {
                        case false:
                            game.settings.beamTimer = true;
                            break;
                        case true:
                            game.settings.beamTimer = false;
                            break;
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);


                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.24);
                ctx.fillRect(w * 0.05, h * 0.388, w * 0.9, h * 0.06);
                ctx.fillRect(w * 0.05, h * 0.938, w * 0.9, h * 0.06);
            }),
        new Scene("Beamconvert",
            [
                new UIText(() => tt("beamconverter"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("selecttype"), 0.5, 0.15, 0.03, "black"),

                new UIText(() => "$images.beam$ " + tt("beams") + ": " + formatNumber(game.beams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "$images.aerobeam$ " + tt("aerobeams") + ": " + formatNumber(game.aerobeams.amount), 0.5, 0.24, 0.06, "yellow"),
                new UIText(() => "$images.angelbeam$ " + tt("angelbeams") + ": " + formatNumber(game.angelbeams.amount), 0.5, 0.28, 0.06, "yellow"),
                new UIText(() => "$images.reinforcedbeam$ " + tt("reinforcedbeams") + ": " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.32, 0.06, "yellow"),
                new UIText(() => "$images.glitchbeam$ " + tt("glitchbeams") + ": " + formatNumber(game.glitchbeams.amount), 0.5, 0.36, 0.06, "yellow"),
                new UIText(() => tt("selected") + ": " + [tt("beams"), tt("aerobeams"), tt("angelbeams"), tt("reinforcedbeams"), tt("glitchbeams")][selectedConvert] + "\n" + tt("convertto") + [tt("beams"), tt("aerobeams"), tt("angelbeams"), tt("reinforcedbeams"), tt("glitchbeams")][selectedConvertTo], 0.5, 0.4, 0.04, "yellow"),
                new UIText(() => tt("convertworth").replace("<amount>", formatNumber(worth1)).replace("<amount2>", formatNumber(worth2)), 0.5, 0.435, 0.04, "yellow", { isVisible: () => worth1 > 0 && worth2 > 0}),
                new UIText(() => "Try increasing the value of falling beams\nof that type: " + (worth1 < 1 ? [tt("beams"), tt("aerobeams"), tt("angelbeams"), tt("reinforcedbeams"), tt("glitchbeams")][selectedConvert] : [tt("beams"), tt("aerobeams"), tt("angelbeams"), tt("reinforcedbeams"), tt("glitchbeams")][selectedConvertTo]) + "!", 0.5, 0.435, 0.04, "yellow", { isVisible: () => worth1 < 1 || worth2 < 1}),


                new UIButton(0.1, 0.525, 0.1, 0.1, images.beam, () => selectedConvert = 0, { quadratic: true }),
                new UIButton(0.3, 0.525, 0.1, 0.1, images.aerobeam, () => selectedConvert = 1, { quadratic: true }),
                new UIButton(0.5, 0.525, 0.1, 0.1, images.angelbeam, () => selectedConvert = 2, { quadratic: true }),
                new UIButton(0.7, 0.525, 0.1, 0.1, images.reinforcedbeam, () => selectedConvert = 3, { quadratic: true }),
                new UIButton(0.9, 0.525, 0.1, 0.1, images.glitchbeam, () => selectedConvert = 4, { quadratic: true }),

                new UIButton(0.1, 0.65, 0.1, 0.1, images.beam, () => selectedConvertTo = 0, { quadratic: true }),
                new UIButton(0.3, 0.65, 0.1, 0.1, images.aerobeam, () => selectedConvertTo = 1, { quadratic: true }),
                new UIButton(0.5, 0.65, 0.1, 0.1, images.angelbeam, () => selectedConvertTo = 2, { quadratic: true }),
                new UIButton(0.7, 0.65, 0.1, 0.1, images.reinforcedbeam, () => selectedConvertTo = 3, { quadratic: true }),
                new UIButton(0.9, 0.65, 0.1, 0.1, images.glitchbeam, () => selectedConvertTo = 4, { quadratic: true }),


                new UIText(() => "Current convert multi: x" + multiConvert, 0.5, 0.95, 0.04, "yellow"),

                new UIButton(0.5, 0.785, 0.4, 0.1, images.convertbutton, () => {
                    if (convertButtonCheck(selectedConvert, worth1)) {
                        convertButtonConvert(selectedConvert, worth1, selectedConvertTo, worth2);
                    }
                }, { quadratic: false }),
                new UIButton(0.5, 0.9, 0.4, 0.1, images.multibuybutton, () => {
                    switch (multiConvert) {
                        case 1:
                            multiConvert = 10;
                            break;
                        case 10:
                            multiConvert = 25;
                            break;
                        case 25:
                            multiConvert = 100;
                            break;
                        case 100:
                            multiConvert = 1000;
                            break;
                        case 1000:
                            multiConvert = 10000;
                            break;
                        case 10000:
                            multiConvert = 100000;
                            break;
                        case 100000:
                            multiConvert = 1;
                            break;
                    }
                }, { quadratic: false }),
                new UIButton(0.76, 0.9, 0.1, 0.1, images.ezUpgrade, () => {
                    let newMulti = parseInt(prompt("What multiplier do you want?"));
                    if (typeof (newMulti) == typeof (1000)) multiConvert = newMulti;
                }, { quadratic: false, isVisible: () => game.supernova.stars.gt(0) })
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.24);
                ctx.fillRect(w * 0.05, h * 0.388, w * 0.9, h * 0.06);

                worth1 = Math.ceil(getStonks(selectedConvert) * 1.5) * multiConvert;
                worth2 = Math.floor(getStonks(selectedConvertTo)) * multiConvert;
            }),
        new Scene("Aerobeams",
            [
                new UIText(() => tt("aerobeams"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("aerobeamfalltext").replace("<interval>", (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams))).replace("<value>", getAeroBeamValue()).replace("<chance>", applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1)).replace("<amount2>", (5 + applyUpgrade(game.beams.upgrades.beamStormValue))), 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.aerobeam$ " + tt("aerobeams") + ": " + formatNumber(game.aerobeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIAerobeamUpgrade(game.aerobeams.upgrades.fasterBeams, images.upgrades.aerobeamChance, 0.45, "aero1"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.slowerFallingMagnets, images.upgrades.magnetBoost, 0.55, "aero2", "table2"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.betterFallingMagnets, images.upgrades.magnetBoost, 0.65, "aero3"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.tireCloneChance, images.upgrades.tireChance, 0.75, "aero4", "table2"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.unlockGoldenScrapStorms, images.upgrades.beamStormChance, 0.85, "aero5"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.moreTires, images.upgrades.tireBoost, 0.95, "aero6", "table2", () => { return game.beams.upgrades.moreMagnets.level > 9 }),
                //new UIBeamUpgrade(game.aerobeams.upgrades.strongerTopRow, images.upgrades.scrapBoost, 0.75, "The Top Row produces more Scrap", "table2"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("AngelBeams",
            [
                new UIText(() => tt("angelbeams"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("angelbeamfalltext").replace("<interval>", (30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams))).replace("<value>", getAngelBeamValue()).replace("<chance>", applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1)).replace("<amount2>", (5 + applyUpgrade(game.beams.upgrades.beamStormValue))), 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.angelbeam$ " + tt("angelbeams") + ": " + formatNumber(game.angelbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIAngelBeamUpgrade(game.angelbeams.upgrades.beamValue, images.upgrades.angelBeamValue, 0.45, "angel1"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.fasterBeams, images.upgrades.angelBeamChance, 0.55, "angel2", "table2"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.moreMasteryGS, images.upgrades.goldenScrapBoost, 0.65, "angel3"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.goldenScrapStormChance, images.upgrades.goldenScrapBoost, 0.75, "angel4", "table2",
                    () => { return game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0 }),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "angel5", "", () => { return game.aerobeams.upgrades.moreTires.level > 9 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("ReinforcedBeams",
            [
                new UIText(() => tt("reinforcedbeams"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("reinforcedbeamfalltext").replace("<interval>", (45 - applyUpgrade(game.beams.upgrades.fasterBeams))).replace("<value>", getReinforcedBeamValue()).replace("<taps>", getReinforcedTapsNeeded()).replace("<chance>", applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1)).replace("<amount2>", (5 + applyUpgrade(game.beams.upgrades.beamStormValue))), 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.reinforcedbeam$ " + tt("reinforcedbeams") + ": " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforce, images.upgrades.reinforcedBeamValue, 0.45, "re1"),
                new UIButton(0.775, 0.475, 0.05, 0.05, images.buttonReset, () => {
                    if (confirm("Do you really want to reduce this upgrade by 1 level and get 50% back?") && game.reinforcedbeams.upgrades.reinforce.level > 0) {
                        game.reinforcedbeams.amount = game.reinforcedbeams.amount.add(Decimal.floor(game.reinforcedbeams.upgrades.reinforce.getPrice(game.reinforcedbeams.upgrades.reinforce.level).div(2)))
                        game.reinforcedbeams.upgrades.reinforce.level -= 1;
                    }
                }, { quadratic: true }),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.strength, images.upgrades.reinforcedBeamPower, 0.55, "re2", "table2"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.powerpunch, images.upgrades.reinforcedBeamCrit, 0.65, "re3"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforcedbricks, images.upgrades.reinforcedBricks, 0.75, "re4", "table2"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.fragmentBoost, images.upgrades.moreFragments, 0.85, "re5", "table", () => { return game.angelbeams.upgrades.gsBoost.level > 9 }),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.darkFragmentBoost, images.upgrades.moreFragments, 0.95, "re6", "table2", () => { return game.reinforcedbeams.upgrades.fragmentBoost.level > 9 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("GlitchBeams",
            [
                new UIText(() => tt("glitchbeams"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => tt("glitchbeamfalltext").replace("<interval>", (30 - applyUpgrade(game.beams.upgrades.fasterBeams))).replace("<taps>", applyUpgrade(game.glitchbeams.upgrades.minimumValue)).replace("<value>", getGlitchBeamValue()).replace("<chance>", applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1)).replace("<amount2>", (5 + applyUpgrade(game.beams.upgrades.beamStormValue))), 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.glitchbeam$ " + tt("glitchbeams") + ": " + formatNumber(game.glitchbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.beamValue, images.upgrades.glitchBeamValue, 0.45, "glitch1"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.repeat, images.upgrades.repeatUpgrade, 0.55, "glitch2", "table2"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.valueGlitch, images.upgrades.valueGlitchUpgrade, 0.65, "glitch3"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.goldenbeam, images.upgrades.goldenBeams, 0.75, "glitch4", "table2"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.minimumValue, images.upgrades.glitchBeamValue, 0.85, "glitch5"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.alienDustBoost, images.upgrades.glitchBeamValue, 0.95, "glitch6", "table2", () => { return game.reinforcedbeams.upgrades.darkFragmentBoost.level > 9 && game.supernova.stars.gt(0) }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("PlasticBags",
            [
                new UIText(() => tt("plasticbags"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => tt("crabs"), 0.575, 0.3, 0.04, "yellow"),
                new UIText(() => tt("costs") + ": " + getResourceImage(game.plasticBags.currentResource) + formatNumber(game.plasticBags.currentCosts), 0.5, 0.34, 0.06, "yellow"),
                new UIText(() => " (" + tt("level") + " " + Math.floor(game.plasticBags.total.sub(Math.min(game.plasticBags.total, applyUpgrade(game.tires.upgrades[3][2]))).add(1)) + ")", 0.85, 0.34, 0.03, "yellow"),
                new UIButton(0.15, 0.325, 0.1, 0.1, images.plasticBag, () => {
                    if (getUpgradeResource(game.plasticBags.currentResource).gte(game.plasticBags.currentCosts)) {
                        let amount = 1 + game.skillTree.upgrades.doublePlasticBags.level + game.supernova.fairyDustUpgrades.cancer.level;
                        game.plasticBags.amount = game.plasticBags.amount.add(amount);
                        game.plasticBags.total = game.plasticBags.total.add(amount);
                        game.stats.totalplasticbags = game.stats.totalplasticbags.add(amount);

                        let re = game.plasticBags.currentResource;
                        let co = game.plasticBags.currentCosts;

                        if (re == RESOURCE_SCRAP) {
                            game.scrap = game.scrap.sub(co);
                        }
                        if (re == RESOURCE_MAGNET) {
                            game.magnets = game.magnets.sub(co);
                        }
                        if (re == RESOURCE_GS) {
                            game.goldenScrap.amount = game.goldenScrap.amount.sub(co);
                        }
                        if (re == RESOURCE_MERGE_TOKEN) {
                            game.mergeQuests.mergeTokens = game.mergeQuests.mergeTokens.sub(co);
                        }
                        if (re == RESOURCE_FRAGMENT) {
                            game.fragment.amount = game.fragment.amount.sub(co);
                        }
                        if (re == RESOURCE_ANGELBEAM) {
                            game.angelbeams.amount = game.angelbeams.amount.sub(co);
                        }
                        if (re == RESOURCE_AEROBEAM) {
                            game.aerobeams.amount = game.aerobeams.amount.sub(co);
                        }
                        if (re == RESOURCE_BEAM) {
                            game.beams.amount = game.beams.amount.sub(co);
                        }

                        let rand = Math.random() * 100;
                        let sin = Math.sin(game.stats.totalplasticbags) > 0 ? Math.sin(game.stats.totalplasticbags) : Math.sin(game.stats.totalplasticbags) * -1;
                        let pbt = game.plasticBags.total.sub(Math.min(game.plasticBags.total, applyUpgrade(game.tires.upgrades[3][2]))); // the min is to prevent neg

                        if (rand > 87.5) {
                            game.plasticBags.currentResource = RESOURCE_SCRAP;
                            game.plasticBags.currentCosts = game.highestScrapReached.div(100000 * sin).round();
                        }
                        else if (rand > 75) {
                            game.plasticBags.currentResource = RESOURCE_MAGNET;
                            game.plasticBags.currentCosts = new Decimal(1e50 * sin).mul(new Decimal(1.4).pow(pbt));
                            // game.magnets.mul(1000 * Math.random());
                        }
                        else if (rand > 62.5) {
                            game.plasticBags.currentResource = RESOURCE_GS;
                            game.plasticBags.currentCosts = new Decimal(1e60 * sin).mul(new Decimal(1.8).pow(pbt));
                        }
                        else if (rand > 50) {
                            game.plasticBags.currentResource = RESOURCE_MERGE_TOKEN;
                            game.plasticBags.currentCosts = new Decimal(25 + Math.floor(500 * sin * Math.random() * (1 + (pbt / 200))));
                        }
                        else if (rand > 37.5) {
                            game.plasticBags.currentResource = RESOURCE_FRAGMENT;
                            game.plasticBags.currentCosts = new Decimal(1000000 * sin).mul(new Decimal(1.03).pow(pbt));
                        }
                        else if (rand > 25) {
                            game.plasticBags.currentResource = RESOURCE_ANGELBEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(250 * sin * Math.random() * (1 + (pbt / 150))));
                        }
                        else if (rand > 12.5) {
                            game.plasticBags.currentResource = RESOURCE_AEROBEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(250 * sin * Math.random() * (1 + (pbt / 100))));
                        }
                        else {
                            game.plasticBags.currentResource = RESOURCE_BEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(100 * sin * Math.random() * (1 + (pbt / 200))));
                        }
                    }
                }),

                new UIText(() => "$images.plasticBag$ " + tt("plasticbags") + ": " + Math.round(game.plasticBags.amount), 0.5, 0.4, 0.06, "yellow"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.moreScrap, images.upgrades.moreScrap, 0.55, "plastic1"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.moreTires, images.upgrades.tireBoost, 0.65, "plastic2", "table2"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.higherEasierReinforced, images.upgrades.reinforcedBeamPower, 0.75, "plastic3"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.08);
                ctx.fillRect(w * 0.05, h * 0.388, w * 0.9, h * 0.06);
            }),
        new Scene("Screws",
            [
                new UIText(() => tt("screws"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => tt("screwstext"), 0.5, 0.2, 0.025, "black"),

                new UIText(() => "Screws from level ups: +" + formatNumber(game.screws.getScrews(game.mergeMastery.level)), 0.5, 0.3, 0.04, "white"),
                new UIText(() => "Screws from tires: +" + formatNumber(getScrews()), 0.5, 0.325, 0.04, "white"),
                new UIText(() => "Screws from falling screws: +" + formatNumber(getScrews(true)), 0.5, 0.35, 0.04, "white"),

                new UIText(() => "$images.screw$ Screws: " + Math.round(game.screws.amount), 0.5, 0.4, 0.06, "yellow"),
                new UIScrewUpgrade(game.screws.upgrades.fallingScrews, images.upgrades.unlockScrews, 0.55, "screw1"),
                new UIScrewUpgrade(game.screws.upgrades.higherMoreReinforced, images.upgrades.reinforcedBeamValue, 0.65, "screw2", "table2"),
                new UIScrewUpgrade(game.screws.upgrades.fasterBricks, images.upgrades.brickSpeed, 0.75, "screw3"),
                new UIScrewUpgrade(game.screws.upgrades.moreMergeTokens, images.upgrades.moreMergeTokens, 0.85, "ds2", "table2"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.08);
                ctx.fillRect(w * 0.05, h * 0.388, w * 0.9, h * 0.06);
            }),
        new Scene("Daily",
            [
                new UIText(() => tt("daily"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIButton(0.1, 0.15, 0.07, 0.07, images.scenes.timemode, () => Scene.loadScene("TimeMode"), {
                    quadratic: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockTimeMode)
                }),

                new UIText(() => tt("currenttime") + ": " + timeDisplay, 0.5, 0.2, 0.06, "yellow"),

                new UIButton(0.84, 0.435, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.dailyQuest.active) {
                        if (game.mergeQuests.dailyQuest.barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            let buyTo = game.mergeQuests.dailyQuest.barrelLvl;
                            if (applyUpgrade(game.skillTree.upgrades.starDaily)) buyTo = (Math.floor(game.highestBarrelReached / BARRELS) - 1) * BARRELS + game.mergeQuests.dailyQuest.barrelLvl;
                            game.scrapUpgrades.betterBarrels.buyToTarget(buyTo);
                            updateUpgradingBarrelFromBB();

                            while (applyUpgrade(game.skillTree.upgrades.starDaily) && game.scrapUpgrades.betterBarrels.level != buyTo) {
                                // If star daily tree upg: Go down 1 star every time and keep trying to buy it
                                buyTo = Math.max(buyTo - BARRELS, 0);
                                game.scrapUpgrades.betterBarrels.buyToTarget(buyTo);
                                updateUpgradingBarrelFromBB();
                            }
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.superEzUpgrader) || game.supernova.cosmicUpgrades.keepEZ.level > 0 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                if (calcTime == "" || futureTimeDisplay == "" || calcTime >= game.mergeQuests.nextDaily) {

                    let currentTime = new Date();
                    year = currentTime.getUTCFullYear();
                    month = currentTime.getUTCMonth();
                    puremonth = month;
                    month += 1;
                    if (month < 10) month = "0" + month;
                    day = currentTime.getUTCDate();
                    tomorrow = day + 1;
                    if (day < 10) day = "0" + day;
                    if (tomorrow < 10) tomorrow = "0" + tomorrow;
                    hour = currentTime.getUTCHours();
                    if (hour.length == 1) hour = "0" + month;
                    calcTime2 = year + "" + (month) + tomorrow;
                    if (calcTime == "") {
                        calcTime = year + "" + (month) + day;
                    }

                    if (calcTime >= game.mergeQuests.nextDaily) {
                        let dq = game.mergeQuests.dailyQuest;
                        dq.generateQuest(dq.possibleTiers[Math.floor(dq.possibleTiers.length * Math.random())]);
                        dq.currentMerges = 0;
                        game.cogwheels.timeModeAttempts = 3;
                        game.gifts.openLimit = game.gifts.openLimit = CONST_OPENLIMIT;
                        game.gifts.sendLimit = CONST_SENDLIMIT;
                        game.gifts.openedToday = [];
                        game.mergeQuests.nextDaily = calcTime2;
                    }
                }

                monthsL = tto({
                    default: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                    ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
                })
                timeDisplay = "" + monthsL[puremonth] + " " + day + ". " + Math.min(12, Math.floor(hour / 12)) + [" AM", " PM"][Math.floor(hour / 12)];
                futureTimeDisplay = "" + monthsL[puremonth] + " " + tomorrow + ". " + "0 AM (UTC)";

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                game.mergeQuests.dailyQuest.render(ctx, w * 0.15, h * (0.225 + 0.13));
            }),
        new Scene("Gifts",
            [
                new UIText(() => tt("gifts"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIButton(0.1, 0.15, 0.07, 0.07, images.scenes.timemode, () => Scene.loadScene("TimeMode"), {
                    quadratic: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockTimeMode)
                }),

                new UIButton(0.9, 0.395, 0.07, 0.07, images.importGame, () => Scene.loadScene("FriendList"), { quadratic: true }),

                new UIText(() => tt("friendcode") + ": " + game.code, 0.5, 0.1, 0.08, "lightgreen"),
                new UIText(() => tt("gifttext1"), 0.5, 0.15, 0.03),

                new UIText(() => tt("scissors") + game.gifts.openLimit, 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => tt("stamps") + game.gifts.sendLimit, 0.5, 0.25, 0.06, "yellow"),

                // Send Gift
                new UIText(() => tt("sendgift" + giftType), 0.5, 0.325, 0.05),
                new UIText(() => (giftType == "magnets" ? tt("upto") : "") + formatNumber(giftAmount), 0.5, 0.37, 0.04, "white", { isVisible: () => giftType != "none" }),
                new UIText(() => tt("gifttext2"), 0.5, 0.39, 0.03, "white", { isVisible: () => giftType != "none" }),

                new UIButton(0.1, 0.525, 0.05, 0.05, images.setmessage, () => {
                    giftMsg = prompt(tt("gifttext3")).substr(0, 80);

                    for (f in filthyWords) {
                        let prev = "";
                        while (giftMsg != prev) {
                            prev = giftMsg;
                            giftMsg = giftMsg.replace(filthyWords[f], "#".repeat(filthyWords[f].length));
                        }
                    }

                    if (game.ms.includes(232) == false) {
                        game.ms.push(232);
                        GameNotification.create(new MilestoneNotificaion(233));
                    }
                }, { quadratic: true }),
                new UIButton(0.9, 0.525, 0.05, 0.05, images.setcode, () => {
                    sendTo = prompt(tt("gifttext4")).substr(0, 5);
                }, { quadratic: true }),
                new UIText(() => giftMsg.substr(0, 40), 0.5, 0.525, 0.02),
                new UIText(() => giftMsg.substr(40, 40), 0.5, 0.55, 0.02),

                new UIText(() => tt("to") + sendTo, 0.8, 0.45, 0.05),

                new UIButton(0.5, 0.45, 0.1, 0.1, images.gift, () => {
                    if (giftType != "none") {
                        if (game.gifts.sendLimit > 0) {
                            if (sendTo == null) {
                                alert("You forgot to enter a friend code!");
                                return false;
                            }
                            if (sendTo == game.code) {
                                alert("You can not send a gift to yourself!");
                                return false;
                            }
                            if (sendTo != "" && sendTo != false && giftAmount > 0) {
                                game.gifts.sendLimit -= 1;

                                giftContent = {
                                    from: game.code,
                                    to: sendTo,
                                    content: giftType,
                                    amount: giftAmount,
                                    date: year + "" + month + day,
                                    message: giftMsg != "" ? giftMsg : "Example Message... nothing special to see here!"
                                }

                                document.querySelector("div.copyGift").style.display = "block";
                                document.querySelector("div.copyGift button#close").style.display = "none";
                                document.querySelector("div.copyGift button#cancelg").style.display = "block";

                                game.stats.giftsSent = game.stats.giftsSent.add(1);

                                if (game.ms.includes(230) == false) {
                                    game.ms.push(230);
                                    GameNotification.create(new MilestoneNotificaion(231));
                                }
                            }
                        }
                        else {
                            alert("Limit reached!");
                        }
                    }
                    else {
                        alert("You have to set gift content first!")
                    }
                }, { quadratic: true, isVisible: () => giftType != "none" }),

                new UIText(() => tt("giftcontent"), 0.5, 0.595, 0.04),
                new UIButton(0.2, 0.65, 0.075, 0.075, images.magnet, () => {
                    giftType = "magnets"
                    giftAmount = new Decimal(game.magnets).div(1000);
                }, { quadratic: true }),
                new UIButton(0.4, 0.65, 0.075, 0.075, images.mergeToken, () => {
                    giftType = "mergetoken"
                    giftAmount = game.mergeQuests.mergeTokens.div(10).min(400);
                }, { quadratic: true }),
                new UIButton(0.6, 0.65, 0.075, 0.075, images.masteryToken, () => {
                    giftType = "masterytoken"
                    giftAmount = game.barrelMastery.masteryTokens.div(10).min(20);
                }, { quadratic: true }),
                new UIButton(0.8, 0.65, 0.075, 0.075, images.wrench, () => {
                    giftType = "wrench"
                    giftAmount = game.wrenches.amount.div(10).min(1000);
                }, { quadratic: true }),

                // Open Gift
                new UIText(() => tt("opengift"), 0.5, 0.725, 0.07),

                new UIButton(0.5, 0.825, 0.1, 0.1, images.gift, () => {
                    if (game.gifts.openLimit > 0) {
                        let giftCode = prompt("Enter the gift code your friend sent to you");
                        giftCode = atob(giftCode);
                        let giftContent = JSON.parse(giftCode);

                        let tmp = giftContent.message.split("i");
                        giftContent.message = "";
                        for (i in tmp) {
                            giftContent.message = giftContent.message + String.fromCharCode(parseInt(tmp[i]));
                        }

                        if (giftContent.date == year + "" + month + day) {
                            if (giftContent.to == game.code && !game.gifts.openedToday.includes(giftContent.from)) {
                                game.gifts.openLimit -= 1;
                                giftMsg = giftContent.message;
                                game.gifts.openedToday.push(giftContent.from);

                                giftContent.amount = new Decimal(giftContent.amount);

                                switch (giftContent.content) {
                                    case "magnets":
                                        game.magnets = game.magnets.add(giftContent.amount.min(game.magnets.div(2)));
                                        break;
                                    case "mergetoken":
                                        game.mergeQuests.mergeTokens = game.mergeQuests.mergeTokens.add(giftContent.amount.min(400));
                                        break;
                                    case "masterytoken":
                                        game.barrelMastery.masteryTokens = game.barrelMastery.masteryTokens.add(giftContent.amount.min(20));
                                        break;
                                    case "wrench":
                                        game.wrenches.amount = game.wrenches.amount.add(giftContent.amount.min(1000));
                                        break;
                                }

                                GameNotification.create(new TextNotification("+" + formatNumber(giftContent.amount) + " " + tt("sendgift" + giftContent.content), "Gift opened successfully!"));
                                GameNotification.create(new TextNotification(giftContent.message, "Important message"));

                                game.stats.giftsReceived = game.stats.giftsReceived.add(1);

                                if (game.ms.includes(231) == false) {
                                    game.ms.push(231);
                                    GameNotification.create(new MilestoneNotificaion(232));
                                }
                            }
                            else {
                                alert("This gift appears to be for someone else, or you already opened a gift from that person today...");
                            }
                        }
                        else {
                            alert("Gift expired!");
                        }
                    }
                    else {
                        alert("Limit reached!");
                    }
                }, { quadratic: true }),

                new UIText(() => tt("sendtext"), 0.01, 0.85, 0.03, "white", { halign: "left" }),

                new UIText(() => tt("opentext"), 0.99, 0.85, 0.03, "white", { halign: "right" }),
            ],
            function () {
                currentTime = new Date();
                day = currentTime.getUTCDate();

                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.1); // should be 0.12 (0.06 * 2) but somehow 0.1 looks much better

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0.315 * h, w, 0.005 * h);
                ctx.fillRect(0, 0.7 * h, w, 0.005 * h);

                year = currentTime.getUTCFullYear();
                month = currentTime.getUTCMonth();
                month += 1;
                if (month < 10) month = "0" + month;
                if (day < 10) day = "0" + day;
                calcTime = year + "" + (month) + day;

                if (calcTime >= game.mergeQuests.nextDaily) {
                    let dq = game.mergeQuests.dailyQuest;
                    dq.generateQuest(dq.possibleTiers[Math.floor(dq.possibleTiers.length * Math.random())]);
                    dq.currentMerges = 0;
                    game.cogwheels.timeModeAttempts = 3;
                    game.gifts.openLimit = game.gifts.openLimit = CONST_OPENLIMIT;
                    game.gifts.sendLimit = CONST_SENDLIMIT;
                    game.gifts.openedToday = [];
                    game.mergeQuests.nextDaily = calcTime2;
                }
            }),
        new Scene("FriendList",
            [
                new UIText(() => tt("friendlist"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Gifts"), { quadratic: true }),
                new UIButton(0.9, 0.05, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("FriendList2"), { quadratic: true }),

                new UIFriend(0.15, 0),
                new UIFriend(0.25, 1),
                new UIFriend(0.35, 2),
                new UIFriend(0.45, 3),
                new UIFriend(0.55, 4),
                new UIFriend(0.65, 5),
                new UIFriend(0.75, 6),
                new UIFriend(0.85, 7),
                new UIFriend(0.95, 8),
            ],

            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("FriendList2",
            [
                new UIText(() => tt("friendlist"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Gifts"), { quadratic: true }),
                new UIButton(0.9, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("FriendList"), { quadratic: true }),

                new UIFriend(0.15, 9),
                new UIFriend(0.25, 10),
                new UIFriend(0.35, 11),
                new UIFriend(0.45, 12),
                new UIFriend(0.55, 13),
                new UIFriend(0.65, 14),
                new UIFriend(0.75, 15),
                new UIFriend(0.85, 16),
                new UIFriend(0.95, 17),
            ],

            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Wrenches",
            [
                new UIText(() => tt("wrenches"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "$images.wrench$ " + tt("wrenches") + ": " + game.wrenches.amount.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => {
                    if (isMobile()) {
                        return "You get 1 wrench for every merge!";
                    }
                    else {
                        return "As a PC player, you get 3 wrenches for every merge!";
                    }
                }, 0.5, 0.3, 0.03, "black"),

                //new UIText(() => "Total Scrap Boost: x" + formatNumber(game.wrenches.amount.pow(((1 + game.wrenches.upgrades.wrenchScrapBoost.level / 100) * (100 / (1 + Math.pow(2.71828, (-0.000003 * game.wrenches.amount))) - 50))) )/*.toFixed(1)*/, 0.5, 0.7, 0.03, "black"),

                new UIText(() => tt("totalmerges") + ": " + game.totalMerges + "\n" + tt("selfmerges") + ": " + game.selfMerges, 0.5, 0.8, 0.06, "black"),
                new UIText(() => tt("mergeexplanation"), 0.5, 0.9, 0.03, "black"),

                new UIWrenchUpgrade(game.wrenches.upgrades.doubleMergeMastery, images.upgrades.fasterAutoMerge, 0.35, "wrench1", "table", game.mergeMastery.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.instantBricksChance, images.upgrades.brickBoost, 0.45, "wrench2", "table2", game.bricks.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.wrenchScrapBoost, images.upgrades.moreScrap, 0.55, "wrench3"),
                new UIWrenchUpgrade(game.wrenches.upgrades.fasterBeamChance, images.upgrades.beamChance, 0.65, "wrench4", "table2", game.beams.isUnlocked),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.06);
            }),
        new Scene("Statistics",
            [
                new UIText(() => tt("statistics"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "Highest Merge Mastery Level: " + game.highestMasteryLevel, 0.5, 0.1, 0.04, "black"),
                new UIText(() => "Highest Barrel: " + game.highestBarrelReached, 0.5, 0.125, 0.04, "black"),
                new UIText(() => "Highest Scrap Reached: " + formatNumber(game.highestScrapReached), 0.5, 0.15, 0.04, "black"),

                new UIText(() => "Total Wrenches: " + formatNumber(game.stats.totalwrenches), 0.5, 0.2, 0.04, "black"),
                new UIText(() => "Total Beams: " + formatNumber(game.stats.totalbeams), 0.5, 0.225, 0.04, "black"),
                new UIText(() => "Total Aerobeams: " + formatNumber(game.stats.totalaerobeams), 0.5, 0.25, 0.04, "black"),
                new UIText(() => "Total Angel Beams: " + formatNumber(game.stats.totalangelbeams), 0.5, 0.275, 0.04, "black"),
                new UIText(() => "Total Reinforced Beams: " + formatNumber(game.stats.totalreinforcedbeams), 0.5, 0.3, 0.04, "black"),
                new UIText(() => "Total Glitch Beams: " + formatNumber(game.stats.totalglitchbeams), 0.5, 0.325, 0.04, "black"),
                new UIText(() => "Total Beams Collected: " + formatNumber(game.stats.totalbeamscollected), 0.5, 0.35, 0.04, "black"),
                new UIText(() => "Total Aerobeams Collected: " + formatNumber(game.stats.totalaerobeamscollected), 0.5, 0.375, 0.04, "black"),
                new UIText(() => "Total Angel Beams Collected: " + formatNumber(game.stats.totalangelbeamscollected), 0.5, 0.4, 0.04, "black"),
                new UIText(() => "Total Reinforced Beams Collected: " + formatNumber(game.stats.totalreinforcedbeamscollected), 0.5, 0.425, 0.04, "black"),
                new UIText(() => "Total Glitch Beams Collected: " + formatNumber(game.stats.totalglitchbeamscollected), 0.5, 0.45, 0.04, "black"),
                new UIText(() => "Total Quests completed: " + game.stats.totalquests.toFixed(0), 0.5, 0.475, 0.04, "black"),
                new UIText(() => "Total Merge Tokens: " + formatNumber(game.stats.totalmergetokens), 0.5, 0.5, 0.04, "black"),
                new UIText(() => "Total Dark Scrap: " + formatNumber(game.stats.totaldarkscrap), 0.5, 0.525, 0.04, "black"),
                new UIText(() => "Total Fragments: " + formatNumber(game.stats.totalfragments), 0.5, 0.55, 0.04, "black"),
                new UIText(() => "Total Dark Fragments: " + formatNumber(game.stats.totaldarkfragments), 0.5, 0.575, 0.04, "black"),
                new UIText(() => "Total Achievements: " + game.ms.length + "/" + game.milestones.achievements.length, 0.5, 0.6, 0.04, "black"),
                new UIText(() => "Total Tires Collected: " + formatNumber(game.stats.totaltirescollected), 0.5, 0.625, 0.04, "black"),
                new UIText(() => "Total GS Resets: " + formatNumber(game.stats.totalgsresets), 0.5, 0.65, 0.04, "black"),
                new UIText(() => "Play Time: " + formatSuperTime(game.stats.playtime), 0.5, 0.675, 0.04, "black"),
                new UIText(() => "Total Daily Quests completed: " + game.stats.totaldailyquests.toFixed(0), 0.5, 0.7, 0.04, "black"),

                new UIText(() => "Total Merges: " + game.totalMerges, 0.5, 0.75, 0.04, "black"),
                new UIText(() => "Self Merges: " + game.selfMerges, 0.5, 0.775, 0.04, "black"),

                new UIButton(0.8, 0.95, 0.3, 0.07, images.buttonEmpty, () => Scene.loadScene("StatCompare")),
                new UIText(() => tt("compare"), 0.8, 0.95, 0.06, "white", {
                    bold: true, valign: "middle",
                }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),

        new Scene("StatCompare",
            [
                new UIText(() => tt("statistics"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),


                new UIButton(0.2, 0.95, 0.3, 0.07, images.buttonEmpty, () => {
                    exportCompare();
                }),
                new UIText("Export CompareCode", 0.2, 0.95, 0.03, "white", {
                    bold: true, valign: "middle",
                }),

                new UIButton(0.5, 0.95, 0.2, 0.07, images.buttonEmpty, () => {
                    comparePage = ++comparePage % 2;
                }),

                new UIButton(0.8, 0.95, 0.3, 0.07, images.buttonEmpty, () => {
                    importType = 1;
                    document.querySelector("div.absolute").style.display = "block"

                }),
                new UIText("Import CompareCode", 0.8, 0.95, 0.03, "white", {
                    bold: true, valign: "middle",
                }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["text"];
                ctx.font = (h * 0.02) + "px " + fonts.default;
                ctx.textAlign = "left";
                ctx.textBaseline = "top";

                if (comparePage == 0) {
                    var compareIDs = [
                        "totalwrenches", "totalbeams", "totalaerobeams", "totalangelbeams", "totalreinforcedbeams", "totalglitchbeams", "totalbeamscollected", "totalaerobeamscollected", "totalangelbeamscollected", "totalreinforcedbeamscollected", "totalglitchbeamscollected", "totalquests", "totalmergetokens", "totaldarkscrap", "totalfragments", "totaldarkfragments", "totaltirescollected", "totalgsresets", "playtime", "totaldailyquests", "totalmasterytokens", "totalplasticbags", "totalscrews", "totalscrewscollected", "giftsSent", "giftsReceived"
                    ];
                    var compareNums = [new Decimal(game.highestMasteryLevel), new Decimal(game.highestBarrelReached), new Decimal(game.highestScrapReached), game.stats.totalwrenches, game.stats.totalbeams, game.stats.totalaerobeams, game.stats.totalangelbeams, game.stats.totalreinforcedbeams, game.stats.totalglitchbeams, game.stats.totalbeamscollected, game.stats.totalaerobeamscollected, game.stats.totalangelbeamscollected, game.stats.totalreinforcedbeamscollected, game.stats.totalglitchbeamscollected, game.stats.totalquests, game.stats.totalmergetokens, game.stats.totaldarkscrap, game.stats.totalfragments, game.stats.totaldarkfragments, game.stats.totaltirescollected, game.stats.totalgsresets, game.stats.playtime, game.stats.totaldailyquests, game.stats.totalmasterytokens, game.stats.totalplasticbags, game.stats.totalscrews, game.stats.totalscrewscollected, game.stats.giftsSent, game.stats.giftsReceived, new Decimal(game.totalMerges), new Decimal(game.selfMerges)];
                    var textDisplays =
                        tto({
                            default: ["Highest Merge Mastery Level", "Highest Barrel Reached", "Highest Scrap Reached", "Total Wrenches", "Total Beams", "Total Aerobeams", "Total Angel Beams", "Total Reinforced Beams", "Total Glitch Beams", "Total Beams Collected", "Total Aerobeams Collected", "Total Angel Beams Collected", "Total Reinforced Collected", "Total Glitch Beams Collected", "Total Quests Completed", "Total Merge Tokens", "Total Dark Scrap", "Total Fragments", "Total Dark Fragments", "Total Tires Collected", "Total GS Resets", "Play Time", "Total Daily Quests completed", "Total Mastery Tokens", "Total Plastic Bags", "Total Screws", "Total Screws Collected", "Gifts Sent", "Gifts Received", "Total Merges", "Self Merges"],
                            de: ["Höchstes Merge Mastery Level", "Höchste Tonne", "Meister Schrott", "Schraubenschlüssel", "Stahlträger", "Aerostahl", "Engelstahl", "Stahlstahl", "Glitchstahl", "Stahlträger gefangen", "Aerostahl gefangen", "Engelstahl gefangen", "Stahlstahl gefangen", "Glitchstahl gefangen", "Quests", "Merge Tokens insgesamt", "Schattenschrott", "Fragmente", "Schattenfragmente", "Reifen eingesammelt", "GS Resets", "Spielzeit", "Quests", "Mastery Tokens", "Plastiktüten", "Schrauben", "Schrauben eingesammelt", "Geschenke gesendet", "Geschenke erhalten", "Verbindungen", "Eigene Verbindungen"],
                            ru: ["Наивысший уровень Мастерства Слияний", "Наивысшая Бочк", "Наибольший достигнутый Мусо", "Всего Гаечных Ключей", "Всего Балок", "Всего Аэробалок", "Всего Ангельских Балок", "Всего Усиленных Балок", "Всего Глючных Балок", "Всего Собрано Балок", "Всего Собрано Аэробалок", "Всего Собрано Ангельских Балок", "Всего Собрано Усиленных Балок", "Всего Собрано Глючных Балок", "Всего Квестов завершено", "Всего Токенов Слияний", "Всего Тёмного Мусора", "Всего Фрагментов", "Всего Тёмных Фрагментов", "Всего Собрано Покрышек", "Всего Сбросов ЗМ", "Время Игры", "Всего Ежедневных Квестов завершено", "Всего Токенов Мастерства", "Всего Пластиковых Пакетов", "Всего Винтов", "Всего Винтов Собрано", "Подарков Отправлено", "Подарков Получено", "Всего Слияний", "Самослияний"],
                    });
                }
                else {
                    var compareIDs = [
                        "totallegendaryscrap", "totalsteelmagnets", "totalbluebricks", "totalfishingnets", "totalbuckets", "totaltanks", "totalstardust", "totalaliendust", "totalfairydust"
                    ];
                    var compareNums = [game.stats.totallegendaryscrap, game.stats.totalsteelmagnets, game.stats.totalbluebricks, game.stats.totalfishingnets, game.stats.totalbuckets, game.stats.totaltanks, game.stats.totalstardust, game.stats.totalaliendust, game.stats.totalfairydust];
                    var textDisplays =
                        tto({
                            default: ["Total Legendary Scrap", "Total Steel Magnets", "Total Blue Bricks", "Total Fishing Nets", "Total Buckets", "Total Tank Fills", "Total Star Dust", "Total Alien Dust", "Total Fairy Dust"],
                            de: ["Legendärer Schrott", "Stahlmagnete", "Blaue Ziegel", "Fischernetze", "Eimer", "Tankauffüllungen", "Sternenstaub", "Alienstaub", "Feenstaub"],
                            ru: ["Всего Легендарного Мусора", "Всего Стальных Магнитов", "Всего Голубых Кирпичей", "Всего Рыболовных Сетей", "Всего Вёдер", "Всего Заполнений Бака", "Всего Звёздной Пыли", "Всего Инопланетной Пыли", "Всего Волшебной Пыли"],
                        });
                }

                var compareIDs2 = [];
                for (c in compareIDs) compareIDs2.push(compareIDs[c]);
                if (comparePage == 0) compareIDs2.unshift("highestMasteryLevel", "highestBarrelReached", "highestScrapReached");

                if (comparePage == 0) {
                    for (i = 0; i < 3; i++) {
                        ctx.fillText(formatNumber([game.highestMasteryLevel, game.highestBarrelReached, game.highestScrapReached][i]), w * 0.01, h * (0.125 + (0.025 * i)));
                    }
                    for (i = 0; i < 2; i++) {
                        ctx.fillText(formatNumber([game.totalMerges, game.selfMerges][i]), w * 0.01, h * (0.85 + (0.025 * i)));
                    }
                }
                for (i = 0; i < compareIDs.length; i++) {
                    if (i != 18) ctx.fillText(formatNumber(game.stats[compareIDs[i]]), w * 0.01, h * (0.2 + (0.025 * i)));
                }
                if (comparePage == 0) ctx.fillText(formatSuperTime(game.stats[compareIDs[18]]), w * 0.01, h * (0.2 + (0.025 * 18)));

                ctx.textAlign = "right";

                if (comparePage == 0) {
                    for (i = 0; i < 3; i++) {
                        ctx.fillText(formatNumber([compareStats.highestMasteryLevel, compareStats.highestBarrelReached, compareStats.highestScrapReached][i]), w * 0.99, h * (0.125 + (0.025 * i)));
                    }
                    for (i = 0; i < 2; i++) {
                        ctx.fillText(formatNumber([compareStats.totalMerges, compareStats.selfMerges][i]), w * 0.99, h * (0.85 + (0.025 * i)));
                    }
                }
                for (i = 0; i < compareIDs.length; i++) {
                    if (i != 18) ctx.fillText(formatNumber(compareStats[compareIDs[i]]), w * 0.99, h * (0.2 + (0.025 * i)));
                }
                if (comparePage == 0) ctx.fillText(formatSuperTime(compareStats[compareIDs[18]] != undefined ? compareStats[compareIDs[18]] : 0), w * 0.99, h * (0.2 + (0.025 * 18)));

                ctx.textAlign = "center";

                for (i = 0; i < compareNums.length; i++) {
                    ctx.fillStyle = compareNums[i].gte(compareStats[compareIDs2[i]]) ? "lightgreen" : colors[C]["text"];
                    ctx.fillText(textDisplays[i], w * 0.5, h * (0.125 + (0.025 * i) + (comparePage > 0 ? 0.075 : 0)));
                }
            }
        ),
        new Scene("Options",
            [
                new UIText(() => tt("Options"), 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIScrollContainerY([
                    new UIText(() => tt("General Options"), 0.5, tabYs[0], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    // Notation
                    new UIOption(tabYs[0] + 0.1, images.options.numberFormat, () => {
                        game.settings.numberFormatType = (++game.settings.numberFormatType) % NUM_FORMAT_TYPES;
                    }, () => {
                        let fmtnmb = [];
                        for (let i = 6, j = 0; j < 4; i = (i + 3) * 1.25, j++) {
                            fmtnmb.push(formatNumber(Decimal.pow(10, i)));
                        }
                        return tt("Switch Number format") + "\n" + fmtnmb.join(", ");
                    }, "table"),

                    // Theme
                    new UIOption(tabYs[0] + 0.2, images.options.barrelQuality, () => {
                        game.settings.C = (++game.settings.C) % 4;
                        C = ["default", "darkblue", "dark", "pink"][game.settings.C];
                    }, () => tt("Theme") + ": " + [tt("theme1"), tt("theme2"), tt("theme3"), tt("theme4")][game.settings.C], "table2"),

                    // Convert / destroy barrels
                    new UIToggleOption(tabYs[0] + 0.3, "game.settings.destroyBarrels", () => tt("convertsetting"), "table"),

                    // Barrel Spawn
                    new UIToggleOption(tabYs[0] + 0.4, "game.settings.barrelSpawn", () => tt("barrelspawn"), "table2"),

                    // Reset confirmation dialogue
                    new UIToggleOption(tabYs[0] + 0.5, "game.settings.resetConfirmation", () => tt("resetconfirmation"), "table"),

                    // Language
                    new UIOption(tabYs[0] + 0.6, images.language, () => {
                        switch (game.settings.lang) {
                            case "en":
                                game.settings.lang = "de";
                                break;
                            case "de":
                                game.settings.lang = "ru";
                                break;
                            case "ru":
                                game.settings.lang = "en";
                                break;
                        }
                    }, () => tt("language") + ": " + ["English", "Deutsch", "Русский"][["en", "de", "ru"].indexOf(game.settings.lang)], "table"),

                    // Open Beams
                    new UIOption(tabYs[0] + 0.7, images.scenes.beamselection, () => {
                        game.settings.beamRed = (game.settings.beamRed + 1) % 3
                    }, () => tt("beamsredirect") + " (" + tt("br" + (game.settings.beamRed + 1)) + ")", "table2"),

                    // Hyper Buy 2.0
                    new UIToggleOption(tabYs[0] + 0.8, "game.settings.hyperBuy2", () => tt("hyperBuy2"), "table"),


                    new UIText(() => tt("Performance"), 0.5, tabYs[1], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    // Barrel Shadows
                    new UIToggleOption(tabYs[1] + 0.1, "game.settings.barrelShadows", () => tt("shadows") + "\n" + tt("slow1"), "table"),

                    // Cache Images
                    new UIToggleOption(tabYs[1] + 0.2, "game.settings.useCachedBarrels", () => tt("cacheimages") + "\n" + tt("slow2"), "table2"),

                    // Quality
                    new UIOption(tabYs[1] + 0.3, images.options.barrelQuality, () => {
                        game.settings.barrelQuality = (++game.settings.barrelQuality) % 3;
                        setBarrelQuality(game.settings.barrelQuality, "Options");
                    }, () => tt("Barrel Quality") + ": " + [tt("High"), tt("Low"), tt("Ultra Low")][game.settings.barrelQuality] + "\n" + tt("slow1"), "table"),

                    // Low Performance Mode
                    new UIToggleOption(tabYs[1] + 0.4, "game.settings.lowPerformance", () => tt("lpm"), "table2"),

                    // FPS
                    new UIOption(tabYs[1] + 0.5, images.options.barrelQuality, () => {
                        switch (game.settings.FPS) {
                            case 9999:
                                game.settings.FPS = 60;
                                break;
                            case 60:
                                game.settings.FPS = 30;
                                break;
                            case 30:
                                game.settings.FPS = 15;
                                break;
                            case 15:
                                game.settings.FPS = 5;
                                break;
                            case 5:
                                game.settings.FPS = 9999;
                                break;
                        }
                        FPS = game.settings.FPS;
                    }, () => {
                        if (FPS != 9999) return tt("FPS") + ": " + FPS;
                        else return tt("FPS") + ": " + tt("Unlimited");
                    }, "table"),

                    // FPS
                    new UIToggleOption(tabYs[1] + 0.6, "game.settings.displayFPS", () => tt("Show FPS"), "table2"),

                    // Coconut
                    new UIToggleOption(tabYs[1] + 0.7, "game.settings.coconut", () => tt("Coconut"), "table"),

                    // No Barrels
                    new UIToggleOption(tabYs[1] + 0.8, "game.settings.nobarrels", () => tt("hidesetting"), "table2"),


                    new UIText(() => tt("Audio"), 0.5, tabYs[2], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    // Enable or disable music
                    new UIOption(tabYs[2] + 0.1, images.change, () => {
                        game.settings.musicOnOff = !game.settings.musicOnOff;
                        playMusic();
                    }, () => game.settings.musicOnOff ? tt("Music") + ": " + tt("musicon") : tt("Music") + ": " + tt("musicoff"), "table"),

                    // Select song
                    new UIOption(tabYs[2] + 0.2, images.options.numberFormat, () => {
                        if (game.ms.length > [-1, 9, 24, 49][game.settings.musicSelect]) {
                            game.settings.musicSelect = game.settings.musicSelect + 1;
                        }
                        else {
                            game.settings.musicSelect = 0;
                        }
                        if (game.settings.musicSelect == 4) game.settings.musicSelect = 0;
                        playMusic();
                    }, () => tt("Current") + ": " + ["Newerwave\nKevin MacLeod", "Getting It Done\nKevin MacLeod", "Power Beams\nSchrottii", "Voltaic\nKevin MacLeod"][game.settings.musicSelect], "table2"),

                    // Volume
                    new UIOption(tabYs[2] + 0.3, images.options.numberFormat, () => {
                        game.settings.musicVolume += 10;
                        if (game.settings.musicVolume > 100) game.settings.musicVolume = 0;
                        playMusic();
                    }, () => tt("Volume") + ": " + game.settings.musicVolume + "%", "table"),

                    /*new UIOption(1.35, images.scenes.options, () => {
                        if (confirm("Warning! You are about to reset your Dark Scrap (Upgrades), Dark Fragment (Upgrades) and related achievements. Press cancel if you want to keep them.")) {
                            game.darkscrap.amount = new Decimal(0);
                            Object.keys(game.darkscrap.upgrades).forEach(k => {
                                game.darkscrap.upgrades[k].level = 0;
                            })

                            game.darkfragment.amount = new Decimal(0);
                            Object.keys(game.darkfragment.upgrades).forEach(k => {
                                game.darkfragment.upgrades[k].level = 0;
                            })

                            const removethose = [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84];
                            for (i = 0; i < removethose.length; i++) {
                                const index = game.ms.indexOf(removethose[i]);
                                if (index > -1) {
                                    game.ms.splice(index, 1);
                                }
                            }
                        }
                    }, "Reset Second Dimension Progress", "bg"),*/


                    new UIText(() => tt("Credits"), 0.5, tabYs[3], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    new UIText(() => tt("cp1") +
                        "\n" + tt("cp2") +
                        "\n" + tt("cp3"), 0.5, tabYs[3] + 0.1, 0.035, "white"),
                    new UIText(() => tt("cp4"), 0.5, tabYs[3] + 0.2, 0.035, "white"),

                    new UIText(() => tt("credit"), 0.5, tabYs[3] + 0.3, 0.035, "white"),
                    new UIText(() => tt("thanks"), 0.5, tabYs[3] + 0.4, 0.035, "white"),
                    new UIText(gameVersionText, 0.5, tabYs[3] + 0.5, 0.05, "white"),

                    new UIText(() => tt("Libraries used") + ":\nbreak_infinity\ngrapheme-splitter", 0.5, tabYs[3] + 0.6, 0.04, "white"),

                    new UIOption(tabYs[3] + 0.8, images.buttonReset, () => {
                        if (confirm(tt("HR1"))) {
                            if (confirm(tt("HR2"))) {
                                if (confirm(tt("HR3"))) {
                                    if (confirm(tt("HR4"))) {
                                        hardReset();
                                    }
                                }
                            }
                        }
                    }, () => tt("HARDRESET"), "table"),


            ], 0, 0.2, 1, 0.5, () => true, { ymin: 0, ymax: tabYs[3] + 0.9 }),
                /*new UIButton(0.25, 0.65, 0.075, 0.075, images.arrows.left, () => game.settings.changeOptionsPage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage > 0
                    }),
                new UIButton(0.75, 0.65, 0.075, 0.075, images.arrows.right, () => game.settings.changeOptionsPage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage < 2
                    }),*/
                new UIButton(0.8, 0.925, 0.1, 0.1, images.logos.schrottii, () => {
                    GameNotification.create(new TextNotification(tt("You have found me"), "Schrottii"))
                    if (game.ms.includes(206) == false) {
                        game.ms.push(206);
                        GameNotification.create(new MilestoneNotificaion(207));
                    }
                }, { quadratic: true }),
                new UIButton(0.1, 0.89, 0.05, 0.05, images.logos.discord, () => location.href = "https://discord.gg/3T4CBmh", { quadratic: true }),
                new UIText(() => tt("myserver"), 0.18, 0.89, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIButton(0.1, 0.96, 0.05, 0.05, images.logos.youtube, () => location.href = "https://www.youtube.com/channel/UC7qnN9M1_PUqmrgOHQipC2Q", { quadratic: true }),
                new UIText(() => tt("myyt"), 0.18, 0.96, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIText(() => tt("Export and Import"), 0.3, 0.825, 0.035, "black"),
                new UIButton(0.3, 0.775, 0.09, 0.09, images.exportImport, () => { importType = 0; document.querySelector("div.absolute").style.display = "block" }, { quadratic: true }),
                new UIText(() => tt("ogsc2"), 0.7, 0.825, 0.035, "black"),
                new UIButton(0.7, 0.775, 0.09, 0.09, images.logos.scrap2, () => location.href = "https://play.google.com/store/apps/details?id=com.scrap.clicker.android&hl=gsw", { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(0, h * 0.85, w, h * 0.15);
            }),
        new Scene("MergeQuests",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIButton(0.1, 0.125, 0.07, 0.07, images.scenes.scrapyard, () => Scene.loadScene("Scrapyard"), {
                    isVisible: () => game.skillTree.upgrades.unlockScrapyard.isUnlocked(),
                    quadratic: true,
                }),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.scrapBoost, images.upgrades.moreScrap, 0.63, "mq1"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.goldenScrapBoost, images.upgrades.goldenScrapBoost, 0.73, "mq2", "table2"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.83, "mq3"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, 0.93, "mq4", "table2", () => applyUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet)),


                new UIButton(0.9, 0.105, 0.05, 0.05, images.buttonReset, () => {
                    if (confirm("Do you really want to reset all 3 quests?")) {
                        for (i = 0; i < 3; i++) {
                            game.mergeQuests.quests[i].active = false;
                            game.mergeQuests.quests[i].currentCooldown = 0;
                        }
                    }
                }, { quadratic: true }),

                new UIButton(0.84, 0.255, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[0].active) {
                        if (game.mergeQuests.quests[0].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[0].barrelLvl);
                            updateUpgradingBarrelFromBB();
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) || game.supernova.cosmicUpgrades.keepEZ.level > 0 }),
                new UIButton(0.84, 0.385, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[1].active) {
                        if (game.mergeQuests.quests[1].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[1].barrelLvl);
                            updateUpgradingBarrelFromBB();
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) || game.supernova.cosmicUpgrades.keepEZ.level > 0 }),
                new UIButton(0.84, 0.515, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[2].active) {
                        if (game.mergeQuests.quests[2].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[2].barrelLvl);
                            updateUpgradingBarrelFromBB();
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) || game.supernova.cosmicUpgrades.keepEZ.level > 0 })
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                for (let [idx, q] of game.mergeQuests.quests.entries()) {
                    q.render(ctx, w * 0.15, h * (0.225 + 0.13 * idx));
                }
            }, null, null),
        new Scene("Scrapyard",
            [
                new UIText(() => tt("scrapyard"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => {
                    if (timeOutID != "none") clearTimeout(timeOutID);
                    Scene.loadScene("MergeQuests")
                }, { quadratic: true }),

                new UIText(() => "$images.mergeToken$ " + tt("tokens") + ": " + game.mergeQuests.mergeTokens.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => tt("scrapyardtext").replace("<amount>", (game.mergeQuests.scrapyard - 1)) + tt("scrapyardtext2").replace("<n>", (10 - game.mergeQuests.scrapyardProgress)).replace("<amount>", game.mergeQuests.scrapyard), 0.5, 0.275, 0.03, "black"),

                new UIText(() => tt("level") + ": " + game.mergeQuests.scrapyard + "\n" + tt("scrapyardtext3").replace("<percent>", game.mergeQuests.scrapyardProgress * 10), 0.5, 0.8, 0.06, "black"),
                new UIButton(0.5, 0.6, 0.4, 0.4, images.scrapyard, () => {
                    // Scrapyard
                    if (game.settings.hyperBuy) {
                        if (timeOutID != "none") {
                            clearTimeout(timeOutID);
                            timeOutID = "none";
                        }
                        upgradeScrapyard();
                        timeOutID = setInterval(() => {
                            upgradeScrapyard();
                            upgradeScrapyard();
                            upgradeScrapyard();
                            upgradeScrapyard();
                            upgradeScrapyard();
                        }, 50)
                    }
                    else {
                        upgradeScrapyard();
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Tire Club",
            [
                new UIText(() => tt("tireclub"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Tires"), { quadratic: true }),
                new UIText(() => tt("tireclub2"), 0.5, 0.2, 0.06),
                new UIText(() => {
                    if (game.tires.time >= 0) return tt("showertime") + (game.tires.time).toFixed(1);
                    if (game.tires.time >= -60) return tt("shower1");
                    if (game.tires.time >= -240) return tt("shower2");
                    else return tt("shower3");
                }, 0.5, 0.3, 0.035),

                new UIButton(0.5, 0.5, 0.25, 0.25, images.tire, () => {
                    if (game.tires.time <= 0) {
                        let amount = 20;
                        if (game.tires.time >= -60) amount = 20;
                        else if (game.tires.time >= -240) amount = 40;
                        else amount = 60;

                        game.tires.time = 60;

                        for (i = 0; i < amount; i++) {
                            stormQueue.push([200 * i, "tire", 1]);
                        }
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(images.club, 0, 0, w, h);


                if (Math.random() > 0.9999) {
                    for (i = 0; i < 3; i++) {
                        stormQueue.push([300 * i, "tire", 1]);
                    }
                }
                if (Math.random() > 0.95) movingItemFactory.fallingTireBG(0);
            }),
        new Scene("Milestones",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.1, 0.93, 0.1, 0.1, images.arrows.left, () => game.milestones.changePage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.milestones.page > 0
                    }),
                new UIButton(0.9, 0.93, 0.1, 0.1, images.arrows.right, () => game.milestones.changePage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.milestones.page < game.milestones.maxPage()
                    }),
                new UIText(() => tt("achievements"), 0.5, 0.09, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => game.ms.length + " / " + game.milestones.achievements.length, 0.5, 0.15, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.003,
                    font: fonts.title
                })
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                let perRow = 5; //achievements per row
                let maxTrophies = game.milestones.achievements.length;

                ctx.font = "bold " + (h * 0.06) + "px " + fonts.default;
                ctx.fillStyle = "black";

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(0, h * 0.2, w, w);
                for (let i = 25 * game.milestones.page; i < Math.min(25 * game.milestones.page + 25, maxTrophies); i++) {
                    let tSize = w / perRow;
                    let x = tSize * (i % perRow);
                    let y = h * 0.2 + tSize * Math.floor((i - 25 * game.milestones.page) / perRow);
                    let iid = game.milestones.achievements[i].imageId;
                    let iX = 256 * (iid % 10);
                    let iY = 256 * Math.floor(iid / 10);
                    ctx.drawImage(game.ms.includes(game.milestones.achievements[i].id - 1) ? images.achievements.unlocked : images.achievements.locked, iX, iY, 256, 256, x, y, tSize, tSize);
                    if (game.milestones.achievements[i].id == game.milestones.highlighted) {
                        ctx.drawImage(images.highlightedSlot, x, y, tSize, tSize);
                    }
                    if (game.milestones.achievements[i].id == game.milestones.next) {
                        ctx.drawImage(images.nextSlot, x, y, tSize, tSize);
                    }
                    ctx.fillStyle = game.ms.includes(game.milestones.achievements[i].id - 1) ? game.milestones.achievements[i].fontColor : "white";
                    ctx.lineWidth = 0;
                }

                if (game.milestones.tooltip !== null) {
                    let y = h * 0.2 + w * ((1 / perRow) * Math.floor((game.milestones.tooltip - 25 * game.milestones.page) / perRow) + 0.18);
                    let cx = w * ((1 / perRow) * (game.milestones.tooltip % perRow) + 0.05);
                    let arrowX = cx + w / perRow / 4;
                    cx = Utils.clamp(cx, w * 0.325, w * 0.675);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(cx - w * 0.3, y, w * 0.6, h * 0.1);
                    ctx.beginPath();
                    ctx.moveTo(arrowX, y - w * 0.025);
                    ctx.lineTo(arrowX + w * 0.025, y);
                    ctx.lineTo(arrowX - w * 0.025, y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = game.milestones.achievements[game.milestones.tooltip].fontColor;
                    ctx.textBaseline = "top";
                    ctx.textAlign = "center";
                    ctx.font = (w * 0.045) + "px " + fonts.default;
                    Utils.drawEscapedText(ctx, game.settings.lang == "en" ? game.milestones.achievements[game.milestones.tooltip].title : tta(0, ("" + game.milestones.highlighted).padStart(3, "0")), cx, y + w * 0.02, 0.04);
                    ctx.fillStyle = "white";
                    Utils.drawEscapedText(ctx, game.milestones.achievements[game.milestones.tooltip].getDescriptionDisplay(), cx, y + w * 0.065, 0.0225, w * 0.6);
                }
            },
            function () {
                let perRow = 5;
                let clickedMileStone = Math.floor(mouseX / w * perRow) + perRow * Math.floor((mouseY - h * 0.2) / w * perRow) + 25 * game.milestones.page;
                if (clickedMileStone >= 25 * game.milestones.page && clickedMileStone < Math.min(25 * game.milestones.page + 25, game.milestones.achievements.length)) {
                    game.milestones.highlighted = game.milestones.achievements[clickedMileStone].id;
                    game.milestones.next = game.milestones.getNext();
                    if (game.milestones.tooltip === clickedMileStone) {
                        game.milestones.tooltip = null;
                    }
                    else {
                        game.milestones.tooltip = clickedMileStone;
                    }
                }
                else {
                    game.milestones.tooltip = null;
                }
            }),
        new Scene("ScrapFactory",
            [
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.8, 0.2, 0.15, 0.15, images.buildings.shrine, () => Scene.loadScene("Shrine"), { quadratic: true }),
                new UIButton(0.25, 0.5, 0.25, 0.25, images.buildings.generator, () => Scene.loadScene("Generator"), { quadratic: true, isVisible: () => applyUpgrade(game.shrine.generatorUnlock) }),
                new UIButton(0.75, 0.5, 0.25, 0.25, images.buildings.factory, () => Scene.loadScene("Factory"), { quadratic: true, isVisible: () => applyUpgrade(game.shrine.factoryUnlock) }),
                new UIButton(0.75, 0.5, 0.25, 0.25, images.buildings.factorylocked, () => Scene.loadScene("ScrapFactory"), { quadratic: true, isVisible: () => !applyUpgrade(game.shrine.factoryUnlock) }),
                new UIButton(0.225, 0.8, 0.25, 0.25, images.buildings.bluestacks, () => Scene.loadScene("Autobuyers"), { quadratic: true, isVisible: () => applyUpgrade(game.shrine.autosUnlock) }),
                new UIButton(0.75, 0.9, 0.25, 0.25, images.buildings.collectors, () => Scene.loadScene("Autocollectors"), { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors) }),
            ],
            function (delta) {
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(0, 0, w, h);

                for (c in characters) {
                    if (characters[c][4]()) {
                        if (characters[c][2] == 0) {
                            characters[c][0] -= 0.02 * delta;
                        }
                        if (characters[c][2] == 1) {
                            characters[c][0] += 0.02 * delta;
                        }
                        characters[c][3] += 0.1 * delta;
                        if (characters[c][3] > 1) {
                            characters[c][2] = characters[c][2] == 1 ? 0 : 1;
                            characters[c][3] = 0;
                        }

                        ctx.drawImage(images["factoryguy"], 64 * characters[c][2], 0, 64, 64, w * characters[c][0], h * characters[c][1], h * 0.08, h * 0.08);
                    }
                }
            }),
        new Scene("Shrine",
            [
                new UIText(() => tt("shrine"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.2, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UISkillTreeUpgradeNoBG(game.shrine.generatorUnlock, images.upgrades.unlockGenerator, "shrine1", 0.5, 0.3, "white"),
                new UISkillTreeUpgradeNoBG(game.shrine.factoryUnlock, images.upgrades.unlockFactory, "shrine2", 0.5, 0.525, "white"),
                new UISkillTreeUpgradeNoBG(game.shrine.autosUnlock, images.upgrades.unlockAutos, "shrine3", 0.5, 0.75, "white"),
            ],
            function () {
                ctx.fillStyle = "gray";
                ctx.fillRect(0, 0, w, h);

                ctx.drawImage(images.shrine, 0, 0, w, h);
            }),
        new Scene("Factory",
            [
                new UIText(() => tt("scrapfactory"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),

                new UIText(() => tt("factorytext"), 0.5, 0.8, 0.03, "black"),

                new UIText(() => "$images.legendaryScrap$" + Math.round(game.factory.legendaryScrap), 0.2, 0.15, 0.06, "yellow"),
                new UIText(() => "$images.steelMagnet$" + Math.round(game.factory.steelMagnets), 0.2, 0.175, 0.06, "yellow"),
                new UIText(() => "$images.blueBrick$" + Math.round(game.factory.blueBricks), 0.2, 0.2, 0.06, "yellow"),

                new UIText(() => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors) ? "$images.bucket$" + Math.round(game.factory.buckets) : "", 0.8, 0.15, 0.06, "yellow"),
                new UIText(() => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors) ? "$images.fishingNet$" + Math.round(game.factory.fishingNets) : "", 0.8, 0.175, 0.06, "yellow"),


                new UIFactoryUpgrade(game.factory.upgrades.legendaryScrap, images.legendaryScrap, 0.3, "factory1"),
                new UIFactoryUpgrade(game.factory.upgrades.steelMagnets, images.steelMagnet, 0.4, "factory2", "table2"),
                new UIFactoryUpgrade(game.factory.upgrades.blueBricks, images.blueBrick, 0.5, "factory3"),
                new UIFactoryUpgrade(game.factory.upgrades.buckets, images.bucket, 0.6, "factory4", "table2", () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)),
                new UIFactoryUpgrade(game.factory.upgrades.fishingNets, images.fishingNet, 0.7, "factory5", "", () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Generator",
            [
                new UIText(() => tt("generator"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),

                new UIButton(0.5, 0.5, 0.07, 0.07, images.fillthetank, () => {
                    fillTank();
                }, { quadratic: true }),
                new UIButton(0.8, 0.5, 0.07, 0.07, images.fillthetank, () => {
                    while (game.glitchbeams.amount.gte(5) && game.factory.tank.lt(getTankSize())) {
                        fillTank();
                    }
                }, {
                    quadratic: true,
                    isVisible: () => game.supernova.stars.gt(0)
                }),
                new UIText(() => "MAX", 0.82, 0.51, 0.04, "white", { isVisible: () => game.supernova.stars.gt(0) }),

                new UIText(() => "$images.glitchbeam$ " + tt("glitchbeams") + ": " + formatNumber(game.glitchbeams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => tt("tanktext"), 0.6, 0.4, 0.04, "black"),
                new UIText(() => Math.round(game.factory.tank) + "/" + Math.round(getTankSize()), 0.15, 0.5, 0.033, "orange"),

                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.factoryTankSize, images.upgrades.reinforcedBricks, 0.8, "gen1"),
                new UIBrickUpgrade(game.bricks.upgrades.fasterCrafting, images.upgrades.reinforcedBricks, 0.9, "gen2", "table2"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = "black";
                ctx.fillRect(0.05 * w, 0.3 * h, 0.2 * w, 0.4 * h);

                ctx.fillStyle = "white";
                ctx.fillRect(0.075 * w, 0.3125 * h, 0.15 * w, 0.375 * h);

                ctx.fillStyle = "gray";
                ctx.fillRect(0.075 * w, (0.6875 * h) - ((0.375 * h) * (Math.min(1, game.factory.tank.add(20).div(getTankSize()) * 1))), 0.15 * w, (0.375 * h) * (Math.min(1, game.factory.tank.add(20).div(getTankSize()) * 1)));


                ctx.fillStyle = "yellow";
                ctx.fillRect(0.075 * w, (0.6875 * h) - ((0.375 * h) * (game.factory.tank.div(getTankSize()))), 0.15 * w, (0.375 * h) * (game.factory.tank.div(getTankSize())));

                // Glitch Beams display
                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.06);
            }),
        new Scene("Autobuyers",
            [
                new UIText(() => tt("autobuyers"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UIText(() => tt("autobuyertext").replace("<energy>", (game.skillTree.upgrades.efficientEnergy.level > 0 ? "1" : "2")).replace("<ru_energy>", game.skillTree.upgrades.efficientEnergy.level > 0 ? "энергию" : "энергии"), 0.5, 0.2, 0.04, "white"),

                new UIAutoUpgrade(game.autos.autoBetterBarrels, images.legendaryScrap, 0.3, "auto1"),
                new UIAutoUpgrade(game.autos.autoFasterBarrels, images.legendaryScrap, 0.4, "auto2", "table2"),
                new UIAutoUpgrade(game.autos.autoScrapBoost, images.steelMagnet, 0.5, "auto3"),
                new UIAutoUpgrade(game.autos.autoMoreGoldenScrap, images.steelMagnet, 0.6, "auto4", "table2"),
                new UIAutoUpgrade(game.autos.autoBrickUpgrades, images.blueBrick, 0.7, "auto5"),
                new UIAutoUpgrade(game.autos.autoGetMoreMagnets, images.blueBrick, 0.8, "auto6", "table2"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Autocollectors",
            [
                new UIText(() => tt("autocollectors"), 0.5, 0.1, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UIText(() => tt("collectortext"), 0.5, 0.2, 0.04, "white"),

                new UIAutoUpgrade(game.collectors.beams, images.beam, 0.3, "coll1"),
                new UIAutoUpgrade(game.collectors.aerobeams, images.aerobeam, 0.4, "coll2", "table2"),
                new UIAutoUpgrade(game.collectors.angelbeams, images.angelbeam, 0.5, "coll3"),
                new UIAutoUpgrade(game.collectors.reinforcedbeams, images.reinforcedbeam, 0.6, "coll4", "table2"),
                new UIAutoUpgrade(game.collectors.glitchbeams, images.glitchbeam, 0.7, "coll5"),
                new UIAutoUpgrade(game.collectors.tires, images.tire, 0.8, "coll6", "table2"),
                new UIAutoUpgrade(game.collectors.gold, images.movingItems.goldenBeam, 0.9, "coll7"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("SkillTree",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText(() => tt("skilltree"), 0.5, 0.09, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIScrollContainerY([
                    new UIRect(0.5, 0.4, 1, 0.4, "table"),
                    new UIRect(0.5, 0.7, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.0, 1, 0.3, "table"),
                    new UIRect(0.5, 1.3, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.6, 1, 0.3, "table"),
                    new UIRect(0.5, 1.9, 1, 0.3, "table2"),
                    new UIRect(0.5, 2.2, 1, 0.3, "table"),
                    new UIRect(0.5, 2.5, 1, 0.3, "table2"),
                    new UIRect(0.5, 2.8, 1, 0.3, "table"),
                    new UIRect(0.5, 3.1, 1, 0.3, "table2"),
                    new UIRect(0.5, 3.4, 1, 0.3, "table"),
                    new UIRect(0.5, 3.7, 1, 0.3, "table2"),
                    new UIRect(0.5, 4.0, 1, 0.3, "table"),
                    new UIRect(0.5, 4.3, 1, 0.3, "table2"),
                    new UIRect(0.5, 4.6, 1, 0.3, "table"),
                    new UIRect(0.5, 4.9, 1, 0.3, "table2"),
                    new UIRect(0.5, 5.2, 1, 0.3, "table"),
                    new UIRect(0.5, 5.5, 1, 0.3, "table2"),
                    new UIRect(0.5, 5.8, 1, 0.3, "table"),
                    new UIRect(0.5, 6.1, 1, 0.3, "table2"),
                    new UIRect(0.5, 6.4, 1, 0.3, "table"),
                    new UIRect(0.5, 6.7, 1, 0.3, "table2"),
                    new UIRect(0.5, 7.0, 1, 0.3, "table"),

                    new UISkillTreePath(0.5, 0.4, 0.5, 0.65, 0.01, "skillTreePath", game.skillTree.upgrades.scrapBoost),

                    new UISkillTreePath(0.5, 0.7, 0.5, 0.85, 0.01, "skillTreePath", game.skillTree.upgrades.xplustwo),

                    new UISkillTreePath(0.5, 0.95, 0.2, 1.2, 0.01, "skillTreePath", game.skillTree.upgrades.unlockbeamtypes),
                    new UISkillTreePath(0.5, 0.95, 0.8, 1.2, 0.01, "skillTreePath", game.skillTree.upgrades.unlockbeamtypes),

                    new UISkillTreePath(0.2, 1.25, 0.2, 1.55, 0.01, "skillTreePath", game.skillTree.upgrades.brickBoost),
                    new UISkillTreePath(0.2, 1.25, 0.5, 1.55, 0.01, "skillTreePath", [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),
                    new UISkillTreePath(0.8, 1.25, 0.5, 1.55, 0.01, "skillTreePath", [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),
                    new UISkillTreePath(0.8, 1.25, 0.8, 1.55, 0.01, "skillTreePath", game.skillTree.upgrades.mergeQuestUpgFallingMagnet),

                    new UISkillTreePath(0.2, 1.55, 0.2, 1.85, 0.01, "skillTreePath", game.skillTree.upgrades.tireBoost),
                    new UISkillTreePath(0.5, 1.55, 0.5, 1.85, 0.01, "skillTreePath", game.skillTree.upgrades.magnetUpgBrickSpeed),
                    new UISkillTreePath(0.8, 1.55, 0.8, 1.85, 0.01, "skillTreePath", game.skillTree.upgrades.moreFragments),

                    new UISkillTreePath(0.2, 1.85, 0.2, 2.15, 0.01, "skillTreePath", game.skillTree.upgrades.scrapBoost2),
                    new UISkillTreePath(0.8, 1.85, 0.8, 2.15, 0.01, "skillTreePath", game.skillTree.upgrades.fasterAutoMerge),

                    new UISkillTreePath(0.2, 2.15, 0.5, 2.45, 0.01, "skillTreePath", [game.skillTree.upgrades.higherAstroMax, game.skillTree.upgrades.tireValue]),
                    new UISkillTreePath(0.8, 2.15, 0.5, 2.45, 0.01, "skillTreePath", [game.skillTree.upgrades.higherAstroMax, game.skillTree.upgrades.tireValue]),

                    new UISkillTreePath(0.5, 2.45, 0.2, 2.75, 0.01, "skillTreePath", game.skillTree.upgrades.moreMergeTokens),
                    new UISkillTreePath(0.5, 2.45, 0.8, 2.75, 0.01, "skillTreePath", game.skillTree.upgrades.moreMergeTokens),

                    new UISkillTreePath(0.2, 2.75, 0.2, 3.05, 0.01, "skillTreePath", game.skillTree.upgrades.unlockScrapyard),
                    new UISkillTreePath(0.8, 2.75, 0.8, 3.05, 0.01, "skillTreePath", game.skillTree.upgrades.superEzUpgrader),

                    new UISkillTreePath(0.2, 3.05, 0.5, 3.35, 0.01, "skillTreePath", [game.skillTree.upgrades.fasterBricks, game.skillTree.upgrades.higherBeamValueMax]),
                    new UISkillTreePath(0.8, 3.05, 0.5, 3.35, 0.01, "skillTreePath", [game.skillTree.upgrades.fasterBricks, game.skillTree.upgrades.higherBeamValueMax]),

                    new UISkillTreePath(0.5, 3.35, 0.5, 3.65, 0.01, "skillTreePath", game.skillTree.upgrades.speedBoostsFragments),

                    new UISkillTreePath(0.5, 3.65, 0.2, 3.95, 0.01, "skillTreePath", game.skillTree.upgrades.unlockMastery),
                    new UISkillTreePath(0.5, 3.65, 0.8, 3.95, 0.01, "skillTreePath", game.skillTree.upgrades.unlockMastery),

                    new UISkillTreePath(0.2, 3.95, 0.2, 4.25, 0.01, "skillTreePath", game.skillTree.upgrades.efficientEnergy),
                    new UISkillTreePath(0.8, 3.95, 0.8, 4.25, 0.01, "skillTreePath", game.skillTree.upgrades.fourthMaxLevel),

                    new UISkillTreePath(0.2, 4.25, 0.5, 4.55, 0.01, "skillTreePath2", game.skillTree.upgrades.renewableEnergy),
                    new UISkillTreePath(0.8, 4.25, 0.5, 4.55, 0.01, "skillTreePath2", game.skillTree.upgrades.unlockBeamConverter),

                    new UISkillTreePath(0.5, 4.55, 0.2, 4.85, 0.01, "skillTreePath", game.skillTree.upgrades.unlockPlasticBags),
                    new UISkillTreePath(0.5, 4.55, 0.5, 4.85, 0.01, "skillTreePath", game.skillTree.upgrades.unlockPlasticBags),
                    new UISkillTreePath(0.5, 4.55, 0.8, 4.85, 0.01, "skillTreePath", game.skillTree.upgrades.unlockPlasticBags),

                    new UISkillTreePath(0.2, 4.85, 0.2, 5.15, 0.01, "skillTreePath", game.skillTree.upgrades.strongerMasteryGS),
                    new UISkillTreePath(0.5, 4.85, 0.5, 5.15, 0.01, "skillTreePath", game.skillTree.upgrades.tireBoost2),
                    new UISkillTreePath(0.8, 4.85, 0.8, 5.15, 0.01, "skillTreePath", game.skillTree.upgrades.shortGSStorms),

                    new UISkillTreePath(0.2, 5.15, 0.2, 5.45, 0.01, "skillTreePath", game.skillTree.upgrades.strongerMasteryMagnets),
                    new UISkillTreePath(0.5, 5.15, 0.5, 5.45, 0.01, "skillTreePath", game.skillTree.upgrades.doublePlasticBags),
                    new UISkillTreePath(0.8, 5.15, 0.8, 5.45, 0.01, "skillTreePath", game.skillTree.upgrades.higherNeptuneMax),

                    new UISkillTreePath(0.2, 5.45, 0.2, 5.75, 0.01, "skillTreePath2", game.skillTree.upgrades.fasterMergeMastery),
                    new UISkillTreePath(0.2, 5.7475, 0.5, 5.75, 0.01, "skillTreePath2", game.skillTree.upgrades.fasterMergeMastery),
                    new UISkillTreePath(0.5, 5.45, 0.5, 5.75, 0.01, "skillTreePath2", game.skillTree.upgrades.cheaperMythus),
                    new UISkillTreePath(0.8, 5.45, 0.8, 5.75, 0.01, "skillTreePath2", game.skillTree.upgrades.unlockAutoCollectors),
                    new UISkillTreePath(0.8, 5.7475, 0.5, 5.75, 0.01, "skillTreePath2", game.skillTree.upgrades.unlockAutoCollectors),

                    new UISkillTreePath(0.5, 5.75, 0.2, 6.05, 0.01, "skillTreePath", game.skillTree.upgrades.unlockScrews),
                    new UISkillTreePath(0.5, 5.75, 0.5, 6.05, 0.01, "skillTreePath", game.skillTree.upgrades.unlockScrews),
                    new UISkillTreePath(0.5, 5.75, 0.8, 6.05, 0.01, "skillTreePath", game.skillTree.upgrades.unlockScrews),

                    new UISkillTreePath(0.2, 6.05, 0.2, 6.35, 0.01, "skillTreePath", game.skillTree.upgrades.magnetBoost),
                    new UISkillTreePath(0.5, 6.05, 0.5, 6.35, 0.01, "skillTreePath", game.skillTree.upgrades.newTireUpgrades),
                    new UISkillTreePath(0.8, 6.05, 0.8, 6.35, 0.01, "skillTreePath", game.skillTree.upgrades.posusAffectsDark),

                    new UISkillTreePath(0.2, 6.35, 0.2, 6.65, 0.01, "skillTreePath", game.skillTree.upgrades.fallingMagnetValue),
                    new UISkillTreePath(0.5, 6.35, 0.5, 6.65, 0.01, "skillTreePath", game.skillTree.upgrades.unlockTimeMode),
                    new UISkillTreePath(0.8, 6.35, 0.8, 6.65, 0.01, "skillTreePath", game.skillTree.upgrades.starDaily),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost, images.upgrades.moreScrap, "tree1", 0.5, 0.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.xplustwo, images.upgrades.xplustwo, "tree2", 0.5, 0.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockbeamtypes, images.upgrades.unlockbeamtypes, "tree3", 0.5, 0.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.brickBoost, images.upgrades.brickBoost, "tree4", 0.2, 1.25, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet, images.upgrades.fasterFallingMagnets, "tree5", 0.8, 1.25, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost, images.upgrades.tireBoost, "tree6", 0.2, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed, images.upgrades.brickSpeed, "tree7", 0.5, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreFragments, images.upgrades.moreFragments, "tree8", 0.8, 1.55),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost2, images.upgrades.moreScrap2, "tree9", 0.2, 1.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.ezUpgraderQuests, images.ezUpgrade, "tree10", 0.5, 1.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterAutoMerge, images.upgrades.brickSpeed, "tree11", 0.8, 1.85, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherAstroMax, images.upgrades.moreFragments, "tree12", 0.2, 2.15),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireValue, images.upgrades.tireBoost, "tree13", 0.8, 2.15),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreMergeTokens, images.upgrades.moreMergeTokens, "tree14", 0.5, 2.45, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockScrapyard, images.upgrades.unlockscrapyard, "tree15", 0.2, 2.75),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.superEzUpgrader, images.ezUpgrade, "tree16", 0.8, 2.75),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterBricks, images.ezUpgrade, "tree17", 0.2, 3.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherBeamValueMax, images.upgrades.unlockscrapyard, "tree18", 0.8, 3.05, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.speedBoostsFragments, images.upgrades.moreFragments, "tree19", 0.5, 3.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockMastery, images.upgrades.unlockMastery, "tree20", 0.5, 3.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.efficientEnergy, images.upgrades.efficientenergy, "tree21", 0.2, 3.95),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.fourthMaxLevel, images.upgrades.fourthUpgrades, "tree22", 0.8, 3.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.renewableEnergy, images.upgrades.renewableenergy, "tree23", 0.2, 4.25, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockBeamConverter, images.upgrades.unlockConverter, "tree24", 0.8, 4.25, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockPlasticBags, images.upgrades.unlockPlasticBags, "tree25", 0.5, 4.55, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.strongerMasteryGS, images.upgrades.strongerMasteryScrap, "tree26", 0.2, 4.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost2, images.upgrades.tireBoost, "tree27", 0.5, 4.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.shortGSStorms, images.upgrades.shorterGSStorms, "tree28", 0.8, 4.85, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.strongerMasteryMagnets, images.upgrades.strongerMasteryMagnets, "tree29", 0.2, 5.15, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.doublePlasticBags, images.upgrades.doublePlasticBags, "tree30", 0.5, 5.15, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherNeptuneMax, images.upgrades.higherNeptuneMax, "tree31", 0.8, 5.15, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterMergeMastery, images.upgrades.fasterMaster, "tree32", 0.2, 5.45, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.cheaperMythus, images.upgrades.cheaperMythus, "tree33", 0.5, 5.45, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockAutoCollectors, images.upgrades.unlockAutoCollectors, "tree34", 0.8, 5.45, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockScrews, images.upgrades.unlockScrews, "tree35", 0.5, 5.75, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetBoost, images.upgrades.magnetBoost, "tree36", 0.2, 6.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.newTireUpgrades, images.upgrades.tireBoost, "tree37", 0.5, 6.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.posusAffectsDark, images.upgrades.posusDarkFragments, "tree38", 0.8, 6.05, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, "tree39", 0.2, 6.35, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockTimeMode, images.upgrades.unlockTimeMode, "tree40", 0.5, 6.35, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.starDaily, images.upgrades.starDaily, "tree41", 0.8, 6.35, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.veryFastCrafting, images.upgrades.fasterFactory, "tree42", 0.2, 6.65, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.funnyGlitchBeams, images.upgrades.funnyGlitchBeams, "tree43", 0.5, 6.65, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherDarkScrapTokenMax, images.upgrades.moreDarkScrap, "tree44", 0.8, 6.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockSupernova, images.solarSystem.sun, "tree45", 0.5, 6.95, "table"),
                    
                ], 0, 0.2, 1, 0.8, () => true, {ymin: 0, ymax: 7.15})
            ],
            function ()
            {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Supernova",
                [
                    new UIText(() => tt("supernova"), 0.5, 0.05, 0.08, "white", {
                        bold: 900,
                        borderSize: 0.005,
                        font: fonts.title
                    }),
                    new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                    new UIText(() => tt("supernovatext"), 0.5, 0.175, 0.03, "black", { isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA }),

                    new UIButton(0.5, 0.4, 0.15, 0.15, images.solarSystem.destroyer, () => Scene.loadScene("Supernova2"), { quadratic: true, isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA }),

                    new UIText(() => tt("stars") + ": " + formatNumber(game.supernova.stars) + "\nx" + formatNumber(new Decimal(1000).pow(game.supernova.stars)) + " " + tt("goldenscrap"), 0.5, 0.6, 0.04, "black"),

                    new UIText(() => "$images.stardust$ " + tt("stardust") + ": " + formatNumber(game.supernova.starDust), 0.5, 0.7, 0.05, "black"),
                    new UIText(() => "$images.aliendust$ " + tt("aliendust") + ": " + formatNumber(game.supernova.alienDust), 0.5, 0.75, 0.05, "black"),
                    new UIText(() => "$images.fairydust$ " + tt("fairydust") + ": " + formatNumber(game.supernova.fairyDust), 0.5, 0.8, 0.05, "black"),

                    new UIText(() => "$images.cosmicemblem$ " + tt("emblems") + ": " + formatNumber(game.supernova.cosmicEmblems), 0.5, 0.85, 0.04, "black"),


                    new UIButton(0.075, 0.97, 0.15, 0.06, images.scenes.stardustupgrades, () => Scene.loadScene("StarDustUpgrades"), {
                        quadraticMin: true,
                        isVisible: () => game.supernova.stars.gte(1)
                    }),
                    new UIButton(0.25 + 0.075, 0.97, 0.15, 0.06, images.scenes.cosmicupgrades, () => Scene.loadScene("EmblemUpgrades"), {
                        quadraticMin: true,
                        isVisible: () => game.supernova.stars.gte(1)
                    }),
                    new UIButton(0.6 + 0.075, 0.97, 0.15, 0.06, images.scenes.aliendustupgrades, () => Scene.loadScene("AlienDustUpgrades"), {
                        quadraticMin: true,
                        isVisible: () => game.supernova.stars.gte(1)
                    }),
                    new UIButton(1 - 0.075, 0.97, 0.15, 0.06, images.scenes.fairydustupgrades, () => Scene.loadScene("FairyDustUpgrades"), {
                        quadraticMin: true,
                        isVisible: () => game.supernova.stars.gte(1)
                    }),
                ],

                function () {
                    ctx.fillStyle = colors[C]["bg"];
                    ctx.fillRect(0, 0, w, h);

                    ctx.fillStyle = colors[C]["table"];
                    ctx.fillRect(w * 0.05, h * 0.688, w * 0.9, h * 0.15);
            }),
        new Scene("Supernova2",
            [
                new UIText(() => tt("supernova"), 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true, isVisible: () => supernovaAlpha == 0 }),

                new UIText(() => tt("supernovawarning"), 0.5, 0.175, 0.03, "black"),
                new UIText(() => tt("firstsupernova"), 0.5, 0.225, 0.03, "black", { isVisible: () => game.supernova.stars.lt(1)}),

                new UIText(() => tt("youwillearn") + "\n+" + formatNumber(game.supernova.getEmblems()) + " " + tt("emblems") +
                    "\n+" + formatNumber(game.supernova.getStarDust()) + " " + tt("stardust") +
                    "\n+" + formatNumber(game.supernova.getAlienDust()) + " " + tt("aliendust") +
                    "\n+" + formatNumber(game.supernova.getFairyDust()) + " " + tt("fairydust") +
                    "\n+1 " + tt("stars"), 0.5, 0.3, 0.04, "black"),

                new UIText(() => tt("supernovagetmore"), 0.5, 0.5, 0.03, "black"),

                new UIText(() => tt("anothersupernovatext"), 0.5, 0.6, 0.03, "black"),

                new UIButton(0.5, 0.8, 0.15, 0.15, images.supernovabutton, () => {
                    if (confirm("Do you really want to do a Supernova?")) {
                        supernovaAlpha = 0.001;
                    }
                }, { quadratic: true, isVisible: () => supernovaAlpha == 0 }),
            ],
            
            function (delta) {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                lowestbeams = "beam";
                lowestbeamsa = game.stats.beamstp;
                if (game.stats.aebeamstp.lt(lowestbeamsa)) {
                    lowestbeamsa = game.stats.aebeamstp;
                    lowestbeams = "aerobeam";
                }
                if (game.stats.abeamstp.lt(lowestbeamsa)) {
                    lowestbeamsa = game.stats.abeamstp;
                    lowestbeams = "angelbeam";
                }
                if (game.stats.rbeamstp.lt(lowestbeamsa)) {
                    lowestbeamsa = game.stats.rbeamstp;
                    lowestbeams = "reinforcedbeam";
                }
                if (game.stats.gbeamstp.lt(lowestbeamsa)) {
                    lowestbeamsa = game.stats.gbeamstp;
                    lowestbeams = "glitchbeam";
                }
                ctx.drawImage(images[lowestbeams], w * 0.45, h * 0.535, w * 0.1, w * 0.1);



                if (supernovaAlpha > 0) {
                    supernovaAlpha += delta / 3;
                }
                if (supernovaAlpha >= 1) {
                    game.supernova.reset();
                    supernovaAlpha = 0;
                }

                //ctx.globalAlpha = cloudAlpha;
                ctx.fillStyle = "#F9F1A4"
                ctx.globalAlpha = supernovaAlpha;
                ctx.fillRect(0, 0, w, h);
                ctx.globalAlpha = 1;
            }),
        new Scene("EmblemUpgrades",
            [
                new UIText(() => tt("emblems"), 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Supernova"), { quadratic: true }),

                new UIText(() => "$images.cosmicemblem$ " + tt("emblems") + ": " + formatNumber(game.supernova.cosmicEmblems), 0.5, 0.2, 0.06, "yellow"),

                new UIScrollContainerY([
                    new UIRect(0.5, 0.5, 1, 0.4, "table"),
                    new UIRect(0.5, 0.8, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.1, 1, 0.3, "table"),
                    new UIRect(0.5, 1.4, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.7, 1, 0.3, "table"),
                    new UIRect(0.5, 2.0, 1, 0.3, "table2"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.autoBuyerMax, images.upgrades.moreMergeTokens, "em1", 0.2, 0.45, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.hyperBuy, images.checkbox.hyperbuy.on, "em14", 0.5, 0.45, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.keepEZ, images.upgrades.goldenScrapBoost, "em3", 0.8, 0.45, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.fasterMergeQuests, images.upgrades.moreScrap, "em4", 0.2, 0.75, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.doubleBeams, images.upgrades.beamValue, "em5", 0.5, 0.75, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.strongerMagnetGS, images.upgrades.goldenScrapBoost, "em2", 0.8, 0.75, "table2"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.keepAutoBuyers, images.upgrades.unlockAutos, "em7", 0.2, 1.05, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.startScrap, images.upgrades.moreScrap, "em8", 0.5, 1.05, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.startBeams, images.upgrades.beamValue, "em9", 0.8, 1.05, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.moreQuestLevelsMax, images.upgrades.moreMergeTokens, "em10", 0.2, 1.35, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.strongerCollectors, images.upgrades.unlockAutoCollectors, "em11", 0.5, 1.35, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.fasterAutoMerge, images.upgrades.fasterAutoMerge, "em12", 0.8, 1.35, "table2"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.faster2ndDim, images.upgrades.moreDarkScrap, "em13", 0.2, 1.65, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.moreScrapMax, images.upgrades.moreScrap, "em6", 0.5, 1.65, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.mythusMultiBuy, images.upgrades.cheaperMythus, "em15", 0.8, 1.65, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.moreDust, images.upgrades.efficientenergy, "em16", 0.2, 1.95, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.keepAutoCollectors, images.upgrades.unlockAutos, "em17", 0.5, 1.95, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.startBricks, images.upgrades.brickBoost, "em18", 0.8, 1.95, "table2"),
                ], 0, 0.3, 1, 0.7, () => true, { ymin: 0, ymax: 2.15 })

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.06);
            }),
        new Scene("StarDustUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("Supernova"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.buttonBack, () => {
                    if (confirm(tt("resetstar"))) {
                        dustReset("starDustUpgrades", "starDust", "totalstardust");
                    }
                }, { quadratic: true }),

                new UIText(() => "$images.stardust$ " + tt("stardust") + ": " + formatNumber(game.supernova.starDust), 0.1, 0.98, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIConstellation(0.4, 0.6, "sd1", game.supernova.starDustUpgrades.ara, "$images.stardust$", images.constellations.ara, 0.075),
                new UIConstellation(0.15, 0.4, "sd2", game.supernova.starDustUpgrades.aries, "$images.stardust$", images.constellations.aries, 0.075),
                new UIConstellation(0.75, 0.5, "sd3", game.supernova.starDustUpgrades.corvus, "$images.stardust$", images.constellations.corvus, 0.075),
                new UIConstellation(0.85, 0.2, "sd4", game.supernova.starDustUpgrades.volans, "$images.stardust$", images.constellations.volans, 0.075),
                new UIConstellation(0.8, 0.8, "sd5", game.supernova.starDustUpgrades.vulpecula, "$images.stardust$", images.constellations.vulpecula, 0.075),
                new UIConstellation(0.2, 0.85, "sd6", game.supernova.starDustUpgrades.caelum, "$images.stardust$", images.constellations.caelum, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.95, w * 0.9, h * 0.06);
            }),
        new Scene("AlienDustUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("Supernova"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.buttonBack, () => {
                    if (confirm(tt("resetalien"))) {
                        dustReset("alienDustUpgrades", "alienDust", "totalaliendust");
                        updateBetterBarrels();
                    }
                }, { quadratic: true }),

                new UIText(() => "$images.aliendust$ " + tt("aliendust") + ": " + formatNumber(game.supernova.alienDust), 0.1, 0.98, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIConstellation(0.2, 0.8, "ad1", game.supernova.alienDustUpgrades.cetus, "$images.aliendust$", images.constellations.cetus, 0.075),
                new UIConstellation(0.8, 0.2, "ad2", game.supernova.alienDustUpgrades.triangulum, "$images.aliendust$", images.constellations.triangulum, 0.075),
                new UIConstellation(0.5, 0.6, "ad3", game.supernova.alienDustUpgrades.volans2, "$images.aliendust$", images.constellations.volans, 0.075),
                new UIConstellation(0.7, 0.85, "ad4", game.supernova.alienDustUpgrades.aquila, "$images.aliendust$", images.constellations.aquila, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.95, w * 0.9, h * 0.06);
            }),
        new Scene("FairyDustUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("Supernova"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.buttonBack, () => {
                    if (confirm(tt("resetfairy"))) {
                        if (game.beams.hbv == undefined) game.beams.hbv = 0;
                        if (game.beams.haebv == undefined) game.beams.haebv = 0;
                        if (game.beams.habv == undefined) game.beams.habv = 0;
                        if (game.beams.hrbv == undefined) game.beams.hrbv = 0;
                        if (game.beams.hgbv == undefined) game.beams.hgbv = 0;

                        game.beams.hbv = Math.max(game.beams.hbv, getBeamBaseValue());
                        game.beams.haebv = Math.max(game.beams.haebv, getAeroBeamValue());
                        game.beams.habv = Math.max(game.beams.habv, getAngelBeamValue());
                        game.beams.hrbv = Math.max(game.beams.hrbv, getReinforcedBeamValue());
                        game.beams.hgbv = Math.max(game.beams.hgbv, getGlitchBeamValue());
                        dustReset("fairyDustUpgrades", "fairyDust", "totalfairydust");
                    }
                }, { quadratic: true }),

                new UIText(() => "$images.fairydust$ " + tt("fairydust") + ": " + formatNumber(game.supernova.fairyDust), 0.1, 0.98, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIConstellation(0.4, 0.6, "fd1", game.supernova.fairyDustUpgrades.cancer, "$images.fairydust$", images.constellations.cancer, 0.075),
                new UIConstellation(0.85, 0.2, "fd2", game.supernova.fairyDustUpgrades.pyxis, "$images.fairydust$", images.constellations.pyxis, 0.075),
                new UIConstellation(0.3, 0.4, "fd3", game.supernova.fairyDustUpgrades.antlia, "$images.fairydust$", images.constellations.antlia, 0.075),
                new UIConstellation(0.6, 0.45, "fd4", game.supernova.fairyDustUpgrades.phoenix, "$images.fairydust$", images.constellations.phoenix, 0.075),
                new UIConstellation(0.35, 0.8, "fd5", game.supernova.fairyDustUpgrades.orion, "$images.fairydust$", images.constellations.orion, 0.075),
                new UIConstellation(0.7, 0.85, "fd6", game.supernova.fairyDustUpgrades.puppis, "$images.fairydust$", images.constellations.puppis, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.95, w * 0.9, h * 0.06);
            }),
    ];