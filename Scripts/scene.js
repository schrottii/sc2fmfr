var isPlaying = 0;
var hePlayed = 0;
var compareStats = {};
var comparePage = 0;

var C = "default";
var calcTime = "";
var calcTime2 = "";
var timeDisplay = "";
var futureTimeDisplay = "";
var year = month = "";

var barrelsDisplayMode = 0;
var selectedConvert = 0;
var selectedConvertTo = 0;

var giftMsg = "";
var sendTo = "";
var giftType = "none";
var giftContent;
var giftAmount = 0;
var giftNames = {
    "none": "???",
    "magnets": "Magnets",
    "mergetoken": "Merge Tokens",
    "masterytoken": "Mastery Tokens",
    "wrench": "Wrenches"
}

var worth1, worth2;
var multiConvert = 1;

var timeMode = false;
var timeModeTime = 0;
var timeTires = 0;

var characters = [[0.4, 0.6, 1, 0, () => applyUpgrade(game.shrine.factoryUnlock)], [0.6, 0.75, 1, 0.5, () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)]];
var tabYs = [0.2, 0.8, 1.7, 2.1];

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
        return "Time: " + formatTime(timeModeTime);
    }
    else {
        if (game.beams.selected == 0) {
            return "Next Beam in: " + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 1) {
            return "Next Beam in: " + (45 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 2) {
            return "Next Beam in: " + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 3) {
            return "Next Beam in: " + (45 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
        if (game.beams.selected == 4) {
            return "Next Beam in: " + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
        }
    }
}

function getStonks(swit) {
    let worth;
    switch (swit) {
        case 0:
            worth = getBeamBaseValue() / (30 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
        case 1:
            worth = getAeroBeamValue() / (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams));
            break;
        case 2:
            worth = getAngelBeamValue() / (30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams));
            break;
        case 3:
            worth = getReinforcedBeamValue() / (45 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
        case 4:
            worth = getGlitchBeamValue() / (30 - applyUpgrade(game.beams.upgrades.fasterBeams));
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

var scenes =
    [
        new Scene("Loading",
            [],
            function () {
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
                ctx.fillText("mod made by Schrottii", w * 0.5, h * 0.075, w * 0.45);

                ctx.font = "300 " + (h * 0.05) + "px " + fonts.default;
                ctx.fillText("Loading...", w * 0.5, h * 0.6, w * 0.9);

                ctx.font = "300 " + (h * 0.03) + "px " + fonts.default;
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillText(gameVersionText, w * 0.99, h - w * 0.01);

                //ctx.textAlign = "center";
                //ctx.font = "300 px " + fonts.default;
                //ctx.fillText("Hopefully bug free?", w * 0.49, h - w * 0.1);

            }),
        new Scene("Barrels",
            [
                new UIButton(0.125, 0.73, 0.05, 0.05, images.upgrades.betterBarrels, function () {
                    game.scrapUpgrades.betterBarrels.buy();
                }, {
                    isVisible: () => !timeMode,
                    quadratic: true
                }),
                new UIButton(0.75, 0.73, 0.05, 0.05, images.ezUpgrade, function () {
                    let GoTo = prompt("Which barrel do you want to go to?");
                    GoTo = Math.round(GoTo - 1);
                    if (GoTo < 0) {
                        alert("Too low!");
                        return;
                    }
                    if (GoTo < game.scrapUpgrades.betterBarrels.maxLevel) {
                        game.scrapUpgrades.betterBarrels.buyToTarget(GoTo);
                        Scene.loadScene("Barrels");
                    }
                    else {
                        alert("Too high!");
                    }
                }, {
                    isVisible: () => (game.skillTree.upgrades.superEzUpgrader.level > 0 || game.supernova.cosmicUpgrades.keepEZ.level > 0) && !timeMode,
                    quadratic: true
                }),
                new UIButton(0.125, 0.81, 0.05, 0.05, images.upgrades.fasterBarrels, function () {
                    game.scrapUpgrades.fasterBarrels.buy();
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
                new UIButton(0.35, 0.97, 0.15, 0.06, images.scenes.steelBeams, () => Scene.loadScene("Beams"), {
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
                    isVisible: () => game.ms.includes(5) && !timeMode,
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
                new UICheckbox(0.875, 0.825, 0.05, 0.05, "hyperBuy", {
                    isVisible: () => game.supernova.cosmicUpgrades.hyperBuy.level > 0,
                    quadratic: true,
                    off: images.checkbox.hyperbuy.off,
                    on: images.checkbox.hyperbuy.on,
                }),

                new UIText(() => game.scrapUpgrades.betterBarrels.getPriceDisplay(), 0.125, 0.76, 0.035, "black", { bold: true }),
                new UIText(() => "Better Barrels (" + game.scrapUpgrades.betterBarrels.level.toFixed(0) + "/" + game.scrapUpgrades.betterBarrels.maxLevel + "):\nBarrels spawn 1 Tier higher", 0.225, 0.74, 0.03, "black", { halign: "left", valign: "middle" }),
                new UIText(() => game.scrapUpgrades.fasterBarrels.getPriceDisplay(), 0.125, 0.84, 0.035, "black", { bold: true }),
                new UIText(() => "Faster Barrels:\nBarrels spawn faster\n" + game.scrapUpgrades.fasterBarrels.getEffectDisplay(), 0.225, 0.82, 0.03, "black", { halign: "left", valign: "middle" }),

                new UIText(() => "+" + formatNumber(Barrel.getGlobalIncome()) + "/s", 0.3, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.settings.beamTimer == true) { return getBeamTime() } else { return " " } }, 0.725, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0 && timeMode == false) { return "Next Storm Chance In " + (60 - gsStormTime.toFixed(0)) + "s" } else { return " " } }, 0.725, 0.0775, 0.03, "white", { bold: true }),
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
                    draggedBarrel.scale = 1.1;
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
                            draggedBarrel = undefined;
                            // no need to change freeSpots
                        }
                    }
                    else { // put it back man
                        barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                        barrels[draggedBarrel.originPos].scale = 0.7;
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
                new UIMagnetUpgrade(game.magnetUpgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "Get More Scrap"),
                new UIMagnetUpgrade(game.magnetUpgrades.moreGoldenScrap, images.upgrades.goldenScrapBoost, 0.5, "Get More Golden Scrap", "table2"),
                new UIMagnetUpgrade(game.magnetUpgrades.magnetMergeChance, images.upgrades.magnetChance, 0.6, "Increase the Chance to\nget Magnets by merging"),
                new UIGroup(
                    [
                        new UIMagnetUpgrade(game.magnetUpgrades.autoMerger, images.upgrades.fasterAutoMerge, 0.7, "Increase Auto Merge Speed", "table2")
                    ], () => game.ms.includes(7)),
                new UIMagnetUpgrade(game.magnetUpgrades.brickSpeed, images.upgrades.brickSpeed, 0.8, "Less Merges are needed\nto double Brick\nproduction.", "table", () => applyUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed)),
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
                        if (!game.settings.resetConfirmation || confirm("Do you want to reset for " + formatNumber(game.goldenScrap.getResetAmount()) + " Golden Scrap?")) {
                            game.goldenScrap.reset();
                        }
                    }
                }, { quadratic: true }),
                new UIText("Golden Scrap", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => "Reset your Scrap Upgrades\nand current Scrap to get \n+" + formatNumber(game.goldenScrap.getResetAmount(), game.settings.numberFormatType, { namesAfter: 1e10 }) + " Golden Scrap\n" +
                    "Each Golden Scrap yields +" + formatPercent(applyUpgrade(game.solarSystem.upgrades.mercury), 0) + " more Scrap.\n" +
                    "Click the Button below to reset.\n\n", 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.goldenScrap$" + formatNumber(game.goldenScrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }) +
                    " → +" + formatPercent(game.goldenScrap.getBoost().sub(1), game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "Get More Scrap"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.75, "Get More Magnets", "table2"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "Get More GS"),
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
                new UIText("Race Against Time", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => "Race against the time\nDon't let the entire field fill up! Earn cogwheels\nDaily attempts left: " + game.cogwheels.timeModeAttempts, 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.cogwheel$" + formatNumber(game.cogwheels.amount), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),
                new UICogwheelUpgrade(game.cogwheels.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "Get More Scrap"),
                new UICogwheelUpgrade(game.cogwheels.upgrades.darkScrapBoost, images.upgrades.moreDarkScrap, 0.75, "Get More Dark Scrap", "table2"),
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
                            alert("You need at least " + formatNumber(new Decimal(1e20)) + " Golden Scrap to enter!");
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
                new UIText("Second Dimension", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return "Sacrifice your Golden Scrap and enter the Second Dimension\n you will keep it until you return\n" +
                            "Click the Button below to enter the Second Dimension.\n\n";
                    }
                    else {
                        return "Progress to get Dark Scrap and destroy to get Dark Fragments.\n" +
                            "Merging increases your scrap production. Merge to reach higher barrels.\n" +
                            "Click the Button below to leave the Second Dimension.\n\n" +
                            "Earn: " + formatNumber(getDarkScrap(calculateCurrentHighest()));
                    }
                }, 0.5, 0.2, 0.025, "black"),

                new UIText(() => "You get " + formatNumber(applyUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap).toFixed(2)) + "% more Golden Scrap for every Dark Scrap you have.\n" +
                    "You get a total boost of x" + formatNumber(((applyUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap).add(1).mul(game.darkscrap.amount)))) + "!", 0.5, 0.3, 0.025, "black"),

                new UIText(() => "$images.darkscrap$" + formatNumber(game.darkscrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIDarkScrapUpgrade(game.darkscrap.upgrades.darkScrapBoost, images.upgrades.moreDarkScrap, 0.65, "Get More Dark Scrap"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.mergeTokenBoost, images.upgrades.moreMergeTokens, 0.75, "Get More Merge Tokens", "table2"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap, images.upgrades.moreGS, 0.85, "GS Boost from Dark Scrap"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.strongerTiers, images.upgrades.strongerBarrelTiers, 0.95, "Stronger Barrel Tiers", "table2"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("Fragment",
            [
                new UIText("Barrel Fragments", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return "Fragments can be earned by destroying barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + formatNumber(new Decimal(0.1 + game.scrapUpgrades.betterBarrels.level / 10).mul(getFragmentBaseValue())) + " fragments."
                    }
                    if (game.dimension == 1) {
                        return "Dark Fragments can be earned by destroying dark barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + formatNumber(new Decimal(0.1 + game.scrapUpgrades.betterBarrels.level / 10).mul(getDarkFragmentBaseValue())) + " dark fragments."
                    }
                }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.fragment$ Barrel Fragments: " + formatNumber(game.fragment.amount), 0.5, 0.3, 0.04, "yellow"),
                new UIFragmentUpgrade(game.fragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.45, "Get More Scrap"),
                new UIFragmentUpgrade(game.fragment.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.55, "Get More Magnets", "table2"),

                new UIText(() => {
                    if (game.darkfragment.isUnlocked()) {
                        return "$images.darkfragment$ Dark Fragments: " + formatNumber(game.darkfragment.amount);
                    }
                    else {
                        return "";
                    }
                }, 0.5, 0.65, 0.04, "yellow"),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.75, "Get More Scrap in 2. Dim.", 0,
                    () => { return game.darkfragment.isUnlocked() }),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.moreFragments, images.upgrades.moreFragments, 0.85, "Get More Fragments", "table2",
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
                    let GoTo = parseInt(prompt("Which barrel do you want to go to?"));
                    GoTo = Math.floor(GoTo);
                    if (GoTo < 1) GoTo = 1;
                    if (GoTo == game.scrapUpgrades.betterBarrels.level + 1) {
                        if (game.ms.includes(120) == false) {
                            game.ms.push(120);
                            GameNotification.create(new MilestoneNotificaion(121));
                        }
                    }
                    game.settings.barrelGalleryPage = Math.floor((GoTo - 1) / 20);
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
                new UIText("Barrels", 0.5, 0.05, 0.1, "white", {
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
                new UIText("Mastery Upgrades", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "Get More Scrap for L1 barrels", "table", () => getTotalLevels(1) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.goldenScrapBoost, images.upgrades.moreGS, 0.525, "Get More GS for L2 barrels", "table2", () => getTotalLevels(2) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.brickBoost, images.upgrades.brickBoost, 0.65, "Get More Bricks for L3 barrels", "table", () => getTotalLevels(3) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.fragmentBoost, images.upgrades.moreFragments, 0.775, "Get More Fragments for L4 barrels", "table2", () => getTotalLevels(4) > 9),
                new UIMasteryUpgrade(game.barrelMastery.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.9, "Get More Magnets for L5 barrels", "table", () => getTotalLevels(5) > 9),
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
                new UIButton(0.9, 0.8, 0.07, 0.07, images.scenes.statistics, () => Scene.loadScene("Statistics"), {
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

                new UIPlanet(0.5, 0.5, "Sun\nIncrease Scrap production", game.solarSystem.upgrades.sun, "$images.magnet$", images.solarSystem.sun, 0.13),
                new UIPlanet(0.7, 0.7, "Mercury\nIncrease Golden\nScrap Boost", game.solarSystem.upgrades.mercury, "$images.magnet$", images.solarSystem.mercury, 0.035),
                new UIPlanet(0.3, 0.325, "Venus\nIncrease Double\nSpawn Chance", game.solarSystem.upgrades.venus, "$images.scrap$", images.solarSystem.venus, 0.055),
                new UIPlanet(0.65, 0.2, "Earth\nUnlock new Stuff", game.solarSystem.upgrades.earth, "$images.goldenScrap$", images.solarSystem.earth, 0.055),
                new UIPlanet(0.2, 0.825, () => "Mars\nFalling Magnets\n" + formatNumber(fallingMagnetWorth()) + " each", game.solarSystem.upgrades.mars, "$images.fragment$", images.solarSystem.mars, 0.04, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS), //whoever did not put a , there before I hate U!!!

                new UIButton(0.6, 0.5, 0.05, 0.05, images.buttonMaxAll, () => maxSunUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.sun.level >= 250
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
                new UIPlanet(0.4, 0.6, "Jupiter\nCheaper Magnet Upgrades", game.solarSystem.upgrades.jupiter, "$images.mergeToken$", images.solarSystem.jupiter, 0.075, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER),
                new UIPlanet(0.8, 0.7, "Saturn\nAuto Merge", game.solarSystem.upgrades.saturn, "$images.scrap$", images.solarSystem.saturn, 0.07, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_SATURN),
                new UIPlanet(0.8, 0.25, "Uranus\nStronger Merge Mastery\nScrap Boost", game.solarSystem.upgrades.uranus, "$images.magnet$", images.solarSystem.uranus, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_URANUS),
                new UIPlanet(0.25, 0.3, "Neptune\nPassive Magnet income", game.solarSystem.upgrades.neptune, "$images.tire$", images.solarSystem.neptune, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NEPTUNE),

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
                new UIPlanet(0.4, 0.6, "Astro\nAuto Convert speed", game.solarSystem.upgrades.astro, "$images.goldenScrap$", images.solarSystem.astro, 0.075, () => game.solarSystem.upgrades.neptune.level > 4),
                new UIPlanet(0.8, 0.7, "Mythus\nBetter Barrels max.", game.solarSystem.upgrades.mythus, "$images.scrap$", images.solarSystem.mythus, 0.07, () => game.solarSystem.upgrades.neptune.level > 4),
                new UIPlanet(0.8, 0.15, "Posus\nMore Fragments", game.solarSystem.upgrades.posus, "$images.magnet$", images.solarSystem.posus, 0.12, () => game.solarSystem.upgrades.neptune.level > 4),
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
                new UIText("Merge Mastery", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup(
                    [
                        new UIButton(0.5, 0.9, 0.3, 0.07, images.buttonEmpty, () => game.mergeMastery.prestige.reset()),
                        new UIText("Prestige", 0.5, 0.9, 0.06, "white", { bold: true, valign: "middle" })
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
                    ctx.fillText("Scrap income", w * 0.3, h * 0.45);
                    ctx.fillText("Magnets on Level Up", w * 0.3, h * 0.525);
                    ctx.fillText("Screws on Level Up", w * 0.3, h * 0.6);
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
                    ctx.fillText("Scrap income", w * 0.3, h * 0.495);
                    ctx.fillText("Magnets on Level Up", w * 0.3, h * 0.62);
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
                        ctx.fillText("Prestige", w * 0.5, h * 0.69);
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
                new UIText("Bricks", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.9, 0.42, 0.05, 0.05, images.buttonMaxAll, () => game.bricks.maxUpgrades(), { quadratic: true, isVisible: () => game.bricks.amount >= (1e100) }),
                new UIBrickUpgrade(game.bricks.upgrades.scrapBoost, images.upgrades.moreScrap, 0.5, "Get More Scrap"),
                new UIBrickUpgrade(game.bricks.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.6, "Get More Magnets", "table2"),
                new UIBrickUpgrade(game.bricks.upgrades.brickBoost, images.upgrades.brickBoost, 0.7, "Get More Bricks", "table2"),
                new UIBrickUpgrade(game.bricks.upgrades.questSpeed, images.upgrades.questSpeed, 0.8, "Complete and refresh\nMerge Quests faster"),
                new UIBrickUpgrade(game.bricks.upgrades.questLevels, images.upgrades.questLevels, 0.9, "Merge Quest Upgrades\nhave more Levels")
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
                ctx.fillText(formatNumber(game.bricks.getCurrentProduction()) + " x" + formatNumber(Math.pow(2, getBrickIncrease())) + "/s → " + formatNumber(game.bricks.getProduction(game.bricks.productionLevel + getBrickIncrease())) + "/s", w * 0.5, h * 0.36);
            }),
        new Scene("Tires",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIButton(0.1, 0.125, 0.07, 0.07, images.scenes.tires, () => Scene.loadScene("Tire Club"), {
                    isVisible: () => game.tires.amount.gte(new Decimal("1e1000000000")),
                    quadratic: true,
                }),
                new UIText("Tires", 0.5, 0.1, 0.12, "white", {
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
                        new UITireUpgrade(game.tires.upgrades[0][0], images.upgrades.fasterBarrels, "Faster Barrels", 0.5 / 3, 0.4),
                        new UITireUpgrade(game.tires.upgrades[0][1], images.upgrades.brickSpeed, "Faster Brick\nLevel Up", 1.5 / 3, 0.4),
                        new UITireUpgrade(game.tires.upgrades[0][2], images.upgrades.fasterMastery, "Faster\nMerge Mastery", 2.5 / 3, 0.4),
                        new UIButton(0.5 / 3 + 0.11, 0.4, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[0][0].buyToTarget(game.tires.upgrades[0][0].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[0][1].level == game.tires.upgrades[0][1].maxLevel && game.tires.upgrades[0][2].level == game.tires.upgrades[0][2].maxLevel }),
                    ]),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[1][0], images.upgrades.tireBoost, "Tire Value\nper Collect", 0.5 / 3, 0.6, "table2"),
                        new UITireUpgrade(game.tires.upgrades[1][1], images.upgrades.tireChance, "Tire Chance\nper Merge", 1.5 / 3, 0.6, "table2"),
                        new UITireUpgrade(game.tires.upgrades[1][2], images.upgrades.questSpeed, "Faster\nMerge Quests", 2.5 / 3, 0.6, "table2"),
                        new UIButton(0.5 / 3 + 0.11, 0.6, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[1][0].buyToTarget(game.tires.upgrades[1][0].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[1][1].level == game.tires.upgrades[1][1].maxLevel && game.tires.upgrades[1][2].level == game.tires.upgrades[1][2].maxLevel }),
                    ], () => game.tires.amount.gt(game.tires.milestones[1])),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[2][0], images.upgrades.fasterFallingMagnets, "Faster\nFalling Magnets", 0.5 / 3, 0.8),
                        new UITireUpgrade(game.tires.upgrades[2][1], images.upgrades.fasterAutoMerge, "Faster\nAuto Merge", 1.5 / 3, 0.8),
                        new UITireUpgrade(game.tires.upgrades[2][2], images.upgrades.goldenScrapBoost, "More\nGolden Scrap", 2.5 / 3, 0.8),
                        new UIButton(2.5 / 3 + 0.11, 0.8, 0.05, 0.05, images.buttonMaxAll, () => {
                            game.tires.upgrades[2][2].buyToTarget(game.tires.upgrades[2][2].level + 15000);
                        }, { quadratic: true, isVisible: () => game.tires.upgrades[2][0].level == game.tires.upgrades[2][0].maxLevel && game.tires.upgrades[2][1].level == game.tires.upgrades[2][1].maxLevel }),
                    ], () => game.tires.amount.gt(game.tires.milestones[2])),
                    new UIGroup([
                        new UITireUpgrade(game.tires.upgrades[3][0], images.upgrades.higherNeptuneMax, "More\nPassive Magnets", 0.5 / 3, 1.0, "table2"),
                        new UITireUpgrade(game.tires.upgrades[3][1], images.upgrades.beamValue, "More Beams\n(All types)", 1.5 / 3, 1.0, "table2"),
                        new UITireUpgrade(game.tires.upgrades[3][2], images.upgrades.doublePlasticBags, "Cheaper\nPlastic Bags", 2.5 / 3, 1.0, "table2"),
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
                new UIText("Steel Beams", 0.5, 0.1, 0.08, "white", {
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
                new UIButton(0.2, 0.97, 0.15, 0.06, images.scenes.aerobeams, () => Scene.loadScene("Aerobeams"), {
                    quadraticMin: true,
                    isVisible: () => game.aerobeams.isUnlocked(),
                }),
                new UIButton(0.4, 0.97, 0.15, 0.06, images.scenes.convert, () => Scene.loadScene("Beamconvert"), {
                    quadraticMin: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockBeamConverter),
                }),
                new UIButton(0.6, 0.97, 0.15, 0.06, images.scenes.angelbeams, () => Scene.loadScene("AngelBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.angelbeams.isUnlocked(),
                }),
                new UIButton(0.8, 0.97, 0.15, 0.06, images.scenes.reinforcedbeams, () => Scene.loadScene("ReinforcedBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.reinforcedbeams.isUnlocked(),
                }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.glitchbeams, () => Scene.loadScene("GlitchBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.glitchbeams.isUnlocked(),
                    anchor: [1, 0.5]
                }),

                new UIText(() => { return "Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of a beam storm\noccuring instead of a single beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + formatNumber(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIScrollContainerY([
                    new UIBeamUpgrade(game.beams.upgrades.fasterBeams, images.upgrades.beamChance, 0.4, "All Beams spawn more often"),
                    new UIBeamUpgrade(game.beams.upgrades.beamValue, images.upgrades.beamValue, 0.5, "Beams are worth more", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.slowerBeams, images.upgrades.slowerBeams, 0.6, "Beams fall slower"),
                    new UIBeamUpgrade(game.beams.upgrades.beamStormChance, images.upgrades.beamStormChance, 0.7, "Beam storms occur more often", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.beamStormValue, images.upgrades.beamStormValue, 0.8, "Beam storms are longer"),
                    new UIBeamUpgrade(game.beams.upgrades.moreScrap, images.upgrades.moreScrap, 0.9, "Get more Scrap", "table2"),
                    new UIBeamUpgrade(game.beams.upgrades.moreMagnets, images.upgrades.magnetBoost, 1.0, "Get more Magnets", "table", () => { return game.beams.upgrades.moreScrap.level > 9 }),

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
                new UIText("Beam Selection", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText("Select which beam type you want to get!\nYou can change this at any time", 0.5, 0.15, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + formatNumber(game.beams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "$images.aerobeam$ Aerobeams: " + formatNumber(game.aerobeams.amount), 0.5, 0.24, 0.06, "yellow"),
                new UIText(() => "$images.angelbeam$ Angel Beams: " + formatNumber(game.angelbeams.amount), 0.5, 0.28, 0.06, "yellow", { isVisible: () => game.angelbeams.isUnlocked() }),
                new UIText(() => "$images.reinforcedbeam$ Reinforced Beams: " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.32, 0.06, "yellow", { isVisible: () => game.reinforcedbeams.isUnlocked() }),
                new UIText(() => "$images.glitchbeam$ Glitch Beams: " + formatNumber(game.glitchbeams.amount), 0.5, 0.36, 0.06, "yellow", { isVisible: () => game.glitchbeams.isUnlocked() }),
                new UIText(() => "Selected: " + ["Beams", "Aerobeams", "Angel Beams", "Reinforced Beams", "Glitch Beams"][game.beams.selected], 0.5, 0.4, 0.06, "yellow"),


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
                        return "(ON) " + getBeamTime();
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
                new UIText("Beam Converter", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText("Select which beam type you want to convert!", 0.5, 0.15, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + formatNumber(game.beams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "$images.aerobeam$ Aerobeams: " + formatNumber(game.aerobeams.amount), 0.5, 0.24, 0.06, "yellow"),
                new UIText(() => "$images.angelbeam$ Angel Beams: " + formatNumber(game.angelbeams.amount), 0.5, 0.28, 0.06, "yellow"),
                new UIText(() => "$images.reinforcedbeam$ Reinforced Beams: " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.32, 0.06, "yellow"),
                new UIText(() => "$images.glitchbeam$ Glitch Beams: " + formatNumber(game.glitchbeams.amount), 0.5, 0.36, 0.06, "yellow"),
                new UIText(() => "Selected: " + ["Beams", "Aerobeams", "Angel Beams", "Reinforced Beams", "Glitch Beams"][selectedConvert] + " to " + ["Beams", "Aerobeams", "Angel Beams", "Reinforced Beams", "Glitch Beams"][selectedConvertTo], 0.5, 0.4, 0.04, "yellow"),
                new UIText(() => worth1 + " is worth " + worth2, 0.5, 0.425, 0.04, "yellow"),


                new UIButton(0.1, 0.5, 0.1, 0.1, images.beam, () => selectedConvert = 0, { quadratic: true }),
                new UIButton(0.3, 0.5, 0.1, 0.1, images.aerobeam, () => selectedConvert = 1, { quadratic: true }),
                new UIButton(0.5, 0.5, 0.1, 0.1, images.angelbeam, () => selectedConvert = 2, { quadratic: true }),
                new UIButton(0.7, 0.5, 0.1, 0.1, images.reinforcedbeam, () => selectedConvert = 3, { quadratic: true }),
                new UIButton(0.9, 0.5, 0.1, 0.1, images.glitchbeam, () => selectedConvert = 4, { quadratic: true }),

                new UIButton(0.1, 0.6, 0.1, 0.1, images.beam, () => selectedConvertTo = 0, { quadratic: true }),
                new UIButton(0.3, 0.6, 0.1, 0.1, images.aerobeam, () => selectedConvertTo = 1, { quadratic: true }),
                new UIButton(0.5, 0.6, 0.1, 0.1, images.angelbeam, () => selectedConvertTo = 2, { quadratic: true }),
                new UIButton(0.7, 0.6, 0.1, 0.1, images.reinforcedbeam, () => selectedConvertTo = 3, { quadratic: true }),
                new UIButton(0.9, 0.6, 0.1, 0.1, images.glitchbeam, () => selectedConvertTo = 4, { quadratic: true }),



                new UIButton(0.5, 0.775, 0.4, 0.1, images.convertbutton, () => {
                    if (convertButtonCheck(selectedConvert, worth1)) {
                        convertButtonConvert(selectedConvert, worth1, selectedConvertTo, worth2);
                    }
                }, { quadratic: false }),
                new UIButton(0.5, 0.9, 0.4, 0.1, images.multibuybutton, () => {
                    switch (multiConvert) {
                        case 1:
                            multiConvert = 5;
                            break;
                        case 5:
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
                            multiConvert = 1;
                            break;
                    }
                }, { quadratic: false }),
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
                new UIText("Aerodynamic Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Aerobeams fall every " + (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)) + " seconds and are worth " + getAeroBeamValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an aerobeam storm\noccuring instead of a single aerobeam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.aerobeam$ Aerobeams: " + formatNumber(game.aerobeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIAerobeamUpgrade(game.aerobeams.upgrades.fasterBeams, images.upgrades.aerobeamChance, 0.45, "Aerobeams spawn more often"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.slowerFallingMagnets, images.upgrades.magnetBoost, 0.55, "Falling Magnets are slower", "table2"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.betterFallingMagnets, images.upgrades.magnetBoost, 0.65, "Falling Magnets are worth more"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.tireCloneChance, images.upgrades.tireChance, 0.75, "Chance to spawn another tire\nwhen collecting one", "table2"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.unlockGoldenScrapStorms, images.upgrades.beamStormChance, 0.85, "Unlock a new type of storm!"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.moreTires, images.upgrades.tireBoost, 0.95, "Get more Tire Value", "table2", () => { return game.beams.upgrades.moreMagnets.level > 9 }),
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
                new UIText("Angel Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Angel Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)) + " seconds and are worth " + getAngelBeamValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an Angel Beam storm\noccuring instead of a single Angel Beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.angelbeam$ Angel Beams: " + formatNumber(game.angelbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIAngelBeamUpgrade(game.angelbeams.upgrades.beamValue, images.upgrades.angelBeamValue, 0.45, "Angel Beams are worth more"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.fasterBeams, images.upgrades.angelBeamChance, 0.55, "Angel Beams spawn more often", "table2"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.moreMasteryGS, images.upgrades.goldenScrapBoost, 0.65, "Get more GS from Mastery"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.goldenScrapStormChance, images.upgrades.goldenScrapBoost, 0.75, "Increase chance for a GS storm", "table2",
                    () => { return game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0 }),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "Get more Golden Scrap", "", () => { return game.aerobeams.upgrades.moreTires.level > 9 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("ReinforcedBeams",
            [
                new UIText("Reinforced Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => {
                    return "Reinforced Beams fall every " + (45 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getReinforcedBeamValue() + ".\n" + getReinforcedTapsNeeded() + " taps/beam.\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an Reinforced Beam storm\noccuring instead of a single Reinforced Beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams."
                }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.reinforcedbeam$ Reinforced Beams: " + formatNumber(game.reinforcedbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforce, images.upgrades.reinforcedBeamValue, 0.45, "Reinforced Beams are worth more,\nbut are harder to collect"),
                new UIButton(0.775, 0.475, 0.05, 0.05, images.buttonReset, () => {
                    if (confirm("Do you really want to reduce this upgrade by 1 level and get 50% back?") && game.reinforcedbeams.upgrades.reinforce.level > 0) {
                        game.reinforcedbeams.amount = game.reinforcedbeams.amount.add(Decimal.floor(game.reinforcedbeams.upgrades.reinforce.getPrice(game.reinforcedbeams.upgrades.reinforce.level).div(2)))
                        game.reinforcedbeams.upgrades.reinforce.level -= 1;
                    }
                }, { quadratic: true }),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.strength, images.upgrades.reinforcedBeamPower, 0.55, "Reinforced Beams are easier\nto collect (Min. 2)", "table2"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.powerpunch, images.upgrades.reinforcedBeamCrit, 0.65, "Chance to collect Reinforced\nBeams 3x faster"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforcedbricks, images.upgrades.reinforcedBricks, 0.75, "x2 Bricks, but 75% more merges", "table2"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.fragmentBoost, images.upgrades.moreFragments, 0.85, "Get More Fragments", "table", () => { return game.angelbeams.upgrades.gsBoost.level > 9 }),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.darkFragmentBoost, images.upgrades.moreFragments, 0.95, "Get More Dark Fragments", "table2", () => { return game.reinforcedbeams.upgrades.fragmentBoost.level > 9 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("GlitchBeams",
            [
                new UIText("Glitch Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => {
                    return "Glitch Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + applyUpgrade(game.glitchbeams.upgrades.minimumValue) + " to " + getGlitchBeamValue() + ".\n 3 taps/beam.\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an Glitch Beam storm\noccuring instead of a single Glitch Beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams."
                }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.glitchbeam$ Glitch Beams: " + formatNumber(game.glitchbeams.amount), 0.5, 0.3, 0.06, "yellow"),

                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.beamValue, images.upgrades.glitchBeamValue, 0.45, "Glitch Beams can be worth more"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.repeat, images.upgrades.repeatUpgrade, 0.55, "Chance to repeat a beam when\nit falls out of the screen", "table2"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.valueGlitch, images.upgrades.valueGlitchUpgrade, 0.65, "Chance to get more beams\n(all types)"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.goldenbeam, images.upgrades.goldenBeams, 0.75, "Chance to get a golden beam\ninstead of any beam\nwhich gives all beams", "table2"),
                new UIGlitchBeamUpgrade(game.glitchbeams.upgrades.minimumValue, images.upgrades.glitchBeamValue, 0.85, "Increases the min. worth of\nGlitch Beams"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("PlasticBags",
            [
                new UIText("Plastic Bags", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "Buy a Plastic Bag and save the crabs!", 0.575, 0.3, 0.04, "yellow"),
                new UIText(() => "Costs: " + getResourceImage(game.plasticBags.currentResource) + formatNumber(game.plasticBags.currentCosts), 0.5, 0.34, 0.06, "yellow"),
                new UIButton(0.15, 0.325, 0.1, 0.1, images.plasticBag, () => {
                    if (getUpgradeResource(game.plasticBags.currentResource).gte(game.plasticBags.currentCosts)) {
                        let amount = 1 + game.skillTree.upgrades.doublePlasticBags.level + game.supernova.fairyDustUpgrades.cancer.level;
                        game.plasticBags.amount = game.plasticBags.amount.add(amount);
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
                        let pbt = game.stats.totalplasticbags.sub(Math.min(game.stats.totalplasticbags, applyUpgrade(game.tires.upgrades[3][2])));

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

                new UIText(() => "$images.plasticBag$ Plastic Bags: " + Math.round(game.plasticBags.amount), 0.5, 0.4, 0.06, "yellow"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.moreScrap, images.upgrades.moreScrap, 0.55, "Get more Scrap"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.moreTires, images.upgrades.tireBoost, 0.65, "Tire Value per Collect", "table2"),
                new UIPlasticBagUpgrade(game.plasticBags.upgrades.higherEasierReinforced, images.upgrades.reinforcedBeamPower, 0.75, "Higher max. level for\n2nd upgrade"),

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
                new UIText("Screws", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText("Earn screws by leveling up in the Merge Mastery, tires or screws!", 0.5, 0.2, 0.03, "black"),

                new UIText(() => "Screws from level ups: +" + formatNumber(game.screws.getScrews(game.mergeMastery.level)), 0.5, 0.3, 0.04, "white"),
                new UIText("Screws from tires: +1", 0.5, 0.325, 0.04, "white"),
                new UIText("Screws from falling screws: +1", 0.5, 0.35, 0.04, "white"),

                new UIText(() => "$images.screw$ Screws: " + Math.round(game.screws.amount), 0.5, 0.4, 0.06, "yellow"),
                new UIScrewUpgrade(game.screws.upgrades.fallingScrews, images.upgrades.unlockScrews, 0.55, "Chance for falling screws to appear\nfrom autos"),
                new UIScrewUpgrade(game.screws.upgrades.higherMoreReinforced, images.upgrades.reinforcedBeamValue, 0.65, "Higher max. level for \nfirst upgrade", "table2"),
                new UIScrewUpgrade(game.screws.upgrades.fasterBricks, images.upgrades.brickSpeed, 0.75, "Earn Bricks faster"),

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
                new UIText("Daily", 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIButton(0.1, 0.15, 0.07, 0.07, images.scenes.timemode, () => Scene.loadScene("TimeMode"), {
                    quadratic: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockTimeMode)
                }),

                new UIText(() => "Current Time: " + timeDisplay, 0.5, 0.2, 0.06, "yellow"),

                new UIButton(0.84, 0.435, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.dailyQuest.active) {
                        if (game.mergeQuests.dailyQuest.barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            let buyTo = game.mergeQuests.dailyQuest.barrelLvl;
                            if (applyUpgrade(game.skillTree.upgrades.starDaily)) buyTo = (Math.floor(game.highestBarrelReached / BARRELS) - 1) * BARRELS + game.mergeQuests.dailyQuest.barrelLvl;
                            game.scrapUpgrades.betterBarrels.buyToTarget(buyTo);

                            while (applyUpgrade(game.skillTree.upgrades.starDaily) && game.scrapUpgrades.betterBarrels.level != buyTo) {
                                // If star daily tree upg: Go down 1 star every time and keep trying to buy it
                                buyTo = Math.max(buyTo - BARRELS, 0);
                                game.scrapUpgrades.betterBarrels.buyToTarget(buyTo);
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
                    let year = currentTime.getUTCFullYear();
                    let month = currentTime.getUTCMonth();
                    let puremonth = month;
                    month += 1;
                    if (month < 10) month = "0" + month;
                    let day = currentTime.getUTCDate();
                    let tomorrow = day + 1;
                    if (day < 10) day = "0" + day;
                    if (tomorrow < 10) tomorrow = "0" + tomorrow;
                    let hour = currentTime.getUTCHours();
                    if (hour.length == 1) hour = "0" + month;
                    calcTime2 = year + "" + (month) + tomorrow;
                    if (calcTime == "") {
                        calcTime = year + "" + (month) + day;
                    }
                    timeDisplay = "" + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][puremonth] + " " + day + ". " + Math.min(12, Math.floor(hour / 12)) + [" AM", " PM"][Math.floor(hour / 12)];
                    futureTimeDisplay = "" + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][puremonth] + " " + tomorrow + ". " + "0 AM (UTC)";

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

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                game.mergeQuests.dailyQuest.render(ctx, w * 0.15, h * (0.225 + 0.13));
            }),
        new Scene("Gifts",
            [
                new UIText("Gifts", 0.5, 0.05, 0.08, "white", {
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

                new UIText(() => "Friend Code: " + game.code, 0.5, 0.1, 0.08, "lightgreen"),
                new UIText(() => "Share it with someone so they can send you a gift!\n(If they like you, but they don't)", 0.5, 0.15, 0.03),

                new UIText(() => "Scissors left (to open gifts): " + game.gifts.openLimit, 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "Stamps left (to send gifts): " + game.gifts.sendLimit, 0.5, 0.25, 0.06, "yellow"),

                // Send Gift
                new UIText(() => "Send Gift (" + giftNames[giftType] + ")", 0.5, 0.325, 0.07),
                new UIText(() => (giftType == "magnets" ? "Up to " : "") + formatNumber(giftAmount), 0.5, 0.37, 0.04, "white", { isVisible: () => giftType != "none" }),
                new UIText("(based on your current amount)", 0.5, 0.39, 0.03, "white", { isVisible: () => giftType != "none" }),

                new UIButton(0.1, 0.525, 0.05, 0.05, images.setmessage, () => {
                    giftMsg = prompt("Message? (Max. 80 characters)").substr(0, 80);

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
                    sendTo = prompt("What is the friend code of the player you want to send it to?");
                }, { quadratic: true }),
                new UIText(() => giftMsg.substr(0, 40), 0.5, 0.525, 0.02),
                new UIText(() => giftMsg.substr(40, 40), 0.5, 0.55, 0.02),

                new UIText(() => "To: " + sendTo, 0.8, 0.45, 0.05),

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

                new UIText(() => "Select Gift Content", 0.5, 0.595, 0.04),
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
                new UIText(() => "Open Gift", 0.5, 0.725, 0.07),

                new UIButton(0.5, 0.825, 0.1, 0.1, images.gift, () => {
                    if (game.gifts.openLimit > 0) {
                        let giftCode = prompt("Enter the gift code your friend sent to you");
                        giftCode = atob(giftCode);
                        let giftContent = JSON.parse(giftCode);

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

                                GameNotification.create(new TextNotification("+" + formatNumber(giftContent.amount) + " " + giftNames[giftContent.content], "Gift opened successfully!"));
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

                new UIText(() => "How to send gifts:", 0.01, 0.85, 0.03, "white", {halign: "left"}),
                new UIText(() => "1. Make sure you have enough stamps", 0.01, 0.875, 0.025, "white", {halign: "left"}),
                new UIText(() => "2. Select the currency to send (gift content)", 0.01, 0.9, 0.025, "white", {halign: "left"}),
                new UIText(() => "3. Enter the friend code of", 0.01, 0.925, 0.025, "white", {halign: "left"}),
                new UIText(() => "the person you want to send the gift to (not yours!)", 0.01, 0.95, 0.025, "white", {halign: "left"}),
                new UIText(() => "4. Click the gift and send the code to the friend", 0.01, 0.975, 0.025, "white", { halign: "left" }),

                new UIText(() => "How to open gifts:", 0.99, 0.85, 0.03, "white", { halign: "right" }),
                new UIText(() => "1. Make sure you have enough scissors", 0.99, 0.875, 0.025, "white", { halign: "right" }),
                new UIText(() => "2. Click the gift", 0.99, 0.9, 0.025, "white", { halign: "right" }),
                new UIText(() => "3. Enter the gift code your friend gave you", 0.99, 0.925, 0.025, "white", { halign: "right" }),
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
                new UIText("Friend List", 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Gifts"), { quadratic: true }),

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
        new Scene("Wrenches",
            [
                new UIText("Wrenches", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "$images.wrench$ Wrenches: " + game.wrenches.amount.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => {
                    if (isMobile()) {
                        return "You get 1 wrench for every merge!";
                    }
                    else {
                        return "As a PC player, you get 3 wrenches for every merge!";
                    }
                }, 0.5, 0.3, 0.03, "black"),

                //new UIText(() => "Total Scrap Boost: x" + formatNumber(game.wrenches.amount.pow(((1 + game.wrenches.upgrades.wrenchScrapBoost.level / 100) * (100 / (1 + Math.pow(2.71828, (-0.000003 * game.wrenches.amount))) - 50))) )/*.toFixed(1)*/, 0.5, 0.7, 0.03, "black"),

                new UIText(() => "Total Merges: " + game.totalMerges + "\nSelf Merges: " + game.selfMerges, 0.5, 0.8, 0.06, "black"),
                new UIText(() => "Self merges -> Merges done by the player!", 0.5, 0.9, 0.03, "black"),

                new UIWrenchUpgrade(game.wrenches.upgrades.doubleMergeMastery, images.upgrades.fasterAutoMerge, 0.35, "x2 Merge Mastery progress\nfrom self merges", "table", game.mergeMastery.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.instantBricksChance, images.upgrades.brickBoost, 0.45, "x16 brick progress\nfrom self merges", "table2", game.bricks.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.wrenchScrapBoost, images.upgrades.moreScrap, 0.55, "Scrap Boost"),
                new UIWrenchUpgrade(game.wrenches.upgrades.fasterBeamChance, images.upgrades.beamChance, 0.65, "Reduce the beam timer\nby 0.25s every self merge", "table2", game.beams.isUnlocked),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.06);
            }),
        new Scene("Statistics",
            [
                new UIText("Statistics", 0.5, 0.05, 0.08, "white", {
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
                new UIText(() => "Play Time: " + formatNumber(game.stats.playtime), 0.5, 0.675, 0.04, "black"),
                new UIText(() => "Total Daily Quests completed: " + game.stats.totaldailyquests.toFixed(0), 0.5, 0.7, 0.04, "black"),

                new UIText(() => "Total Merges: " + game.totalMerges, 0.5, 0.75, 0.04, "black"),
                new UIText(() => "Self Merges: " + game.selfMerges, 0.5, 0.775, 0.04, "black"),


                new UIText(() => "Please note: Many of these stats were not\ntracked prior to update 2.2!", 0.5, 0.825, 0.04, "black"),

                new UIButton(0.8, 0.95, 0.3, 0.07, images.buttonEmpty, () => Scene.loadScene("StatCompare")),
                new UIText("Compare", 0.8, 0.95, 0.06, "white", {
                    bold: true, valign: "middle",
                }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),

        new Scene("StatCompare",
            [
                new UIText("Statistics", 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Statistics"), { quadratic: true }),


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
                    var textDisplays = [
                        "Highest Merge Mastery Level", "Highest Barrel Reached", "Highest Scrap Reached", "Total Wrenches", "Total Beams", "Total Aerobeams", "Total Angel Beams", "Total Reinforced Beams", "Total Glitch Beams", "Total Beams Collected", "Total Aerobeams Collected", "Total Angel Beams Collected", "Total Reinforced Collected", "Total Glitch Beams Collected", "Total quests completed", "Total Merge Tokens", "Total Dark Scrap", "Total Fragments", "Total Dark Fragments", "Total Tires Collected", "Total GS Resets", "Play Time", "Total Daily Quests completed", "Total Mastery Tokens", "Total Plastic Bags", "Total Screws", "Total Screws Collected", "Gifts Sent", "Gifts Received", "Total Merges", "Self Merges"
                    ];
                }
                else {
                    var compareIDs = [
                        "totallegendaryscrap", "totalsteelmagnets", "totalbluebricks", "totalfishingnets", "totalbuckets", "totaltanks", "totalstardust", "totalaliendust", "totalfairydust"
                    ];
                    var compareNums = [game.stats.totallegendaryscrap, game.stats.totalsteelmagnets, game.stats.totalbluebricks, game.stats.totalfishingnets, game.stats.totalbuckets, game.stats.totaltanks, game.stats.totalstardust, game.stats.totalaliendust, game.stats.totalfairydust];
                    var textDisplays = ["Total Legendary Scrap", "Total Steel Magnets", "Total Blue Bricks", "Total Fishing Nets", "Total Buckets", "Total Tank Fills", "Total Star Dust", "Total Alien Dust", "Total Fairy Dust"];
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
                    ctx.fillText(formatNumber(game.stats[compareIDs[i]]), w * 0.01, h * (0.2 + (0.025 * i)));
                }

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
                    ctx.fillText(formatNumber(compareStats[compareIDs[i]]), w * 0.99, h * (0.2 + (0.025 * i)));
                }

                ctx.textAlign = "center";

                for (i = 0; i < compareNums.length; i++) {
                    ctx.fillStyle = compareNums
                    [i].gte(compareStats[compareIDs2[i]]) ? "lightgreen" : colors[C]["text"];
                    ctx.fillText(textDisplays[i], w * 0.5, h * (0.125 + (0.025 * i) + (comparePage > 0 ? 0.075 : 0)));
                }
            }
        ),
        new Scene("Options",
            [
                new UIText("Options", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIScrollContainerY([
                    new UIText("General Options", 0.5, tabYs[0], 0.075, "white", {
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
                        return "Switch Number format\n" + fmtnmb.join(", ");
                    }, "table"),

                    // Theme
                    new UIOption(tabYs[0] + 0.2, images.options.barrelQuality, () => {
                        game.settings.C = (++game.settings.C) % 4;
                        C = ["default", "darkblue", "dark", "pink"][game.settings.C];
                    }, () => "Theme: " + ["Default light blue", "Dark Blue", "Dark Theme", "Square Pink"][game.settings.C], "table2"),

                    // Convert / destroy barrels
                    new UIToggleOption(tabYs[0] + 0.3, "game.settings.destroyBarrels", "Double Click Barrels to remove them", "table"),

                    // Barrel Spawn
                    new UIToggleOption(tabYs[0] + 0.4, "game.settings.barrelSpawn", "Barrel Spawn", "table2"),

                    // Reset confirmation dialogue
                    new UIToggleOption(tabYs[0] + 0.5, "game.settings.resetConfirmation", "Reset Confirmation", "table"),


                    new UIText("Performance", 0.5, tabYs[1], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    // Barrel Shadows
                    new UIToggleOption(tabYs[1] + 0.1, "game.settings.barrelShadows", "Toggle Barrel Shadows\n(can slow down Game)", "table"),

                    // Cache Images
                    new UIToggleOption(tabYs[1] + 0.2, "game.settings.useCachedBarrels", "Cache some Barrel Images\n(may slow down\nor speed up Game)", "table2"),

                    // Quality
                    new UIOption(tabYs[1] + 0.3, images.options.barrelQuality, () => {
                        game.settings.barrelQuality = (++game.settings.barrelQuality) % 3;
                        setBarrelQuality(game.settings.barrelQuality, "Options");
                    }, () => "Barrel Quality: " + ["High", "Low", "Ultra Low"][game.settings.barrelQuality], "table"),

                    // Low Performance Mode
                    new UIToggleOption(tabYs[1] + 0.4, "game.settings.lowPerformance", "Low performance Mode", "table2"),

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
                        if (FPS != 9999) return "FPS: " + FPS;
                        else return "FPS: Unlimited";
                    }, "table"),

                    // Coconut
                    new UIToggleOption(tabYs[1] + 0.6, "game.settings.coconut", "Coconut", "table"),

                    // No Barrels
                    new UIToggleOption(tabYs[1] + 0.7, "game.settings.nobarrels", "Hide barrels entirely", "table2"),

                    // FPS
                    new UIToggleOption(tabYs[1] + 0.8, "game.settings.displayFPS", "Show FPS"),


                    new UIText("Audio", 0.5, tabYs[2], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    // Enable or disable music
                    new UIToggleOption(tabYs[2] + 0.1, "game.settings.musicOnOff", "Music", "table"),

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
                    }, () => "Current: " + ["Newerwave\nKevin MacLeod", "Getting It Done\nKevin MacLeod", "Power Beams\nSchrottii", "Voltaic\nKevin MacLeod"][game.settings.musicSelect], "table2"),

                    // Volume
                    new UIOption(tabYs[2] + 0.3, images.options.numberFormat, () => {
                        game.settings.musicVolume += 10;
                        if (game.settings.musicVolume > 100) game.settings.musicVolume = 0;
                        playMusic();
                    }, () => "Volume: " + game.settings.musicVolume + "%", "table"),

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


                    new UIText("Credits", 0.5, tabYs[3], 0.075, "white", {
                        bold: 600,
                        borderSize: 0.003,
                        font: fonts.title
                    }),

                    new UIText("Original Scrap Clicker 2 by Schrott Games ©2017" +
                        "\nMod of VeproGames' Scrap 2 Fanmade ©2019" +
                        "\nMod SC2FMFR created by Schrottii ©2021", 0.5, tabYs[3] + 0.1, 0.035, "white"),
                    new UIText("Unauthorized mods of this mod are prohibited!", 0.5, tabYs[3] + 0.2, 0.035, "white"),

                    new UIText("Special credit to all barrel makers,\nidea givers, bug finders, beta testers\nand whoever made the coconut image", 0.5, tabYs[3] + 0.3, 0.035, "white"),
                    new UIText(gameVersionText, 0.5, tabYs[3] + 0.4, 0.05, "white"),

                    new UIText("Libraries used:\nbreak_infinity\ngrapheme-splitter", 0.5, tabYs[3] + 0.5, 0.04, "white"),

            ], 0, 0.2, 1, 0.5, () => true, { ymin: 0, ymax: tabYs[3] + 0.6 }),
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
                new UIButton(0.8, 0.89, 0.1, 0.1, images.logos.schrottii, () => {
                    GameNotification.create(new TextNotification("You have found me", "Schrottii"))
                    if (game.ms.includes(206) == false) {
                        game.ms.push(206);
                        GameNotification.create(new MilestoneNotificaion(207));
                    }
                }, { quadratic: true }),
                new UIButton(0.1, 0.89, 0.05, 0.05, images.logos.discord, () => location.href = "https://discord.gg/3T4CBmh", { quadratic: true }),
                new UIText("My Discord Server", 0.18, 0.89, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIButton(0.1, 0.96, 0.05, 0.05, images.logos.youtube, () => location.href = "https://www.youtube.com/channel/UC7qnN9M1_PUqmrgOHQipC2Q", { quadratic: true }),
                new UIText("My Youtube Channel", 0.18, 0.96, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIText("Export and Import", 0.3, 0.825, 0.035, "black"),
                new UIButton(0.3, 0.775, 0.09, 0.09, images.exportImport, () => { importType = 0; document.querySelector("div.absolute").style.display = "block" }, { quadratic: true }),
                new UIText("Play the Original SC2", 0.7, 0.825, 0.035, "black"),
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
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.scrapBoost, images.upgrades.moreScrap, 0.63, "Get More Scrap"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.goldenScrapBoost, images.upgrades.goldenScrapBoost, 0.73, "Get More Golden Scrap", "table2"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.83, "Get More Magnets"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, 0.93, "Falling Magnets are\nworth more", "table2", () => applyUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet)),


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
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) || game.supernova.cosmicUpgrades.keepEZ.level > 0 }),
                new UIButton(0.84, 0.385, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[1].active) {
                        if (game.mergeQuests.quests[1].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[1].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) || game.supernova.cosmicUpgrades.keepEZ.level > 0 }),
                new UIButton(0.84, 0.515, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[2].active) {
                        if (game.mergeQuests.quests[2].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[2].barrelLvl);
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
                new UIText("Scrapyard", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("MergeQuests"), { quadratic: true }),

                new UIText(() => "$images.mergeToken$ Tokens: " + game.mergeQuests.mergeTokens.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "Every level reduces the merges needed for Merge Mastery\nby 1%! Current Boost: " + (game.mergeQuests.scrapyard - 1) + "%!\nCosts to next level: " + (10 - game.mergeQuests.scrapyardProgress) + "x " + game.mergeQuests.scrapyard + "!", 0.5, 0.3, 0.03, "black"),

                new UIText(() => "Level: " + game.mergeQuests.scrapyard + "\n Progress to next: " + game.mergeQuests.scrapyardProgress * 10 + "%!", 0.5, 0.8, 0.06, "black"),
                new UIButton(0.5, 0.6, 0.4, 0.4, images.scrapyard, () => {
                    // Scrapyard
                    if (game.mergeQuests.mergeTokens.gte(new Decimal(game.mergeQuests.scrapyard))) { // AAAAAH
                        game.mergeQuests.mergeTokens = game.mergeQuests.mergeTokens.sub(game.mergeQuests.scrapyard);
                        currentScene.popupTexts.push(new PopUpText("-" + game.mergeQuests.scrapyard, w / 2, h * 0.5, { color: "#bbbbbb", bold: true, size: 0.1, border: h * 0.005 }));

                        game.mergeQuests.scrapyardProgress += 1;
                        if (game.mergeQuests.scrapyardProgress == 10) {
                            game.mergeQuests.scrapyardProgress = 0;
                            game.mergeQuests.scrapyard += 1;
                        }
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Tire Club",
            [
                new UIText("Tire Club", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Tires"), { quadratic: true }),
                new UIText(() => "We worship the tires", 0.5, 0.2, 0.06),
                new UIText(() => {
                    if (game.tires.time >= 0) return "Time to next tire shower: " + (game.tires.time).toFixed(1);
                    if (game.tires.time >= -800) return "Tire shower is ready!";
                    else return "Big tire shower is ready!";
                }, 0.5, 0.3, 0.035),

                new UIButton(0.5, 0.5, 0.25, 0.25, images.tire, () => {
                    if (game.tires.time <= 0) {
                        game.tires.time = 600;
                        let amount = 10;
                        if (game.tires.time <= -800) amount = 20;

                        for (i = 0; i < amount; i++) {
                            setTimeout("movingItemFactory.jumpingTire()", 500 * i);
                        }
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
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
                new UIText("Achievements", 0.5, 0.09, 0.12, "white", {
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
                    ctx.fillText(game.milestones.achievements[game.milestones.tooltip].title, cx, y + w * 0.02);
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
                new UIText("Mythic Shrine", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UISkillTreeUpgradeNoBG(game.shrine.generatorUnlock, images.upgrades.unlockGenerator, "Unlock the generator building", 0.5, 0.3, "white"),
                new UISkillTreeUpgradeNoBG(game.shrine.factoryUnlock, images.upgrades.unlockFactory, "Unlock the factory building", 0.5, 0.525, "white"),
                new UISkillTreeUpgradeNoBG(game.shrine.autosUnlock, images.upgrades.unlockAutos, "Unlock the auto buyer building", 0.5, 0.75, "white"),
            ],
            function () {
                ctx.fillStyle = "gray";
                ctx.fillRect(0, 0, w, h);

                ctx.drawImage(images.shrine, 0, 0, w, h);
            }),
        new Scene("Factory",
            [
                new UIText("Scrap Factory", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),

                new UIText(() => "Use 2 currencies and some energy from the generator\n to craft new currencies here!", 0.5, 0.8, 0.03, "black"),

                new UIText(() => "$images.legendaryScrap$" + Math.round(game.factory.legendaryScrap), 0.2, 0.15, 0.06, "yellow"),
                new UIText(() => "$images.steelMagnet$" + Math.round(game.factory.steelMagnets), 0.2, 0.175, 0.06, "yellow"),
                new UIText(() => "$images.blueBrick$" + Math.round(game.factory.blueBricks), 0.2, 0.2, 0.06, "yellow"),

                new UIText(() => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors) ? "$images.bucket$" + Math.round(game.factory.buckets) : "", 0.8, 0.15, 0.06, "yellow"),
                new UIText(() => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors) ? "$images.fishingNet$" + Math.round(game.factory.fishingNets) : "", 0.8, 0.175, 0.06, "yellow"),


                new UIFactoryUpgrade(game.factory.upgrades.legendaryScrap, images.legendaryScrap, 0.3, "Produce Legendary Scrap"),
                new UIFactoryUpgrade(game.factory.upgrades.steelMagnets, images.steelMagnet, 0.4, "Produce Steel Magnets", "table2"),
                new UIFactoryUpgrade(game.factory.upgrades.blueBricks, images.blueBrick, 0.5, "Produce Blue Bricks"),
                new UIFactoryUpgrade(game.factory.upgrades.buckets, images.bucket, 0.6, "Produce Buckets", "table2", () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)),
                new UIFactoryUpgrade(game.factory.upgrades.fishingNets, images.fishingNet, 0.7, "Produce Fishing Nets", "", () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Generator",
            [
                new UIText("Generator", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),

                new UIButton(0.5, 0.5, 0.07, 0.07, images.fillthetank, () => {
                    if (game.factory.tank.lt(getTankSize())) {
                        if (game.glitchbeams.amount.gte(new Decimal(5))) {
                            game.glitchbeams.amount = game.glitchbeams.amount.sub(new Decimal(5));
                            let amount = 20;
                            game.factory.tank = game.factory.tank.add(20);
                            if (game.factory.tank.gt(getTankSize())) {
                                amount -= game.factory.tank.sub(getTankSize());
                                game.stats.totaltanks = game.stats.totaltanks.add(new Decimal(amount));
                                game.factory.tank = getTankSize();
                            }
                        }
                    }
                }, { quadratic: true }),

                new UIText(() => "$images.glitchbeam$ Glitch Beams: " + formatNumber(game.glitchbeams.amount), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "Use 5 Glitch Beams to\nfill up the energy tank a bit!", 0.6, 0.4, 0.04, "black"),
                new UIText(() => Math.round(game.factory.tank) + "/" + Math.round(getTankSize()), 0.15, 0.5, 0.033, "orange"),

                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.factoryTankSize, images.upgrades.reinforcedBricks, 0.8, "Increase tank size"),
                new UIBrickUpgrade(game.bricks.upgrades.fasterCrafting, images.upgrades.reinforcedBricks, 0.9, "Faster crafting", "table2"),

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
                new UIText("Auto Buyers", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UIText(() => "Auto Buyers need energy to run!\nOne upgrade costs 2 energy.", 0.5, 0.2, 0.04, "white"),

                new UIAutoUpgrade(game.autos.autoBetterBarrels, images.legendaryScrap, 0.3, "Auto: Better Barrels"),
                new UIAutoUpgrade(game.autos.autoFasterBarrels, images.legendaryScrap, 0.4, "Auto: Faster Barrels", "table2"),
                new UIAutoUpgrade(game.autos.autoScrapBoost, images.steelMagnet, 0.5, "Auto: More Scrap\n(Magnet upgrade)"),
                new UIAutoUpgrade(game.autos.autoMoreGoldenScrap, images.steelMagnet, 0.6, "Auto: More GS\n(Magnet upgrade)", "table2"),
                new UIAutoUpgrade(game.autos.autoBrickUpgrades, images.blueBrick, 0.7, "Auto: All Brick upgrades"),
                new UIAutoUpgrade(game.autos.autoGetMoreMagnets, images.blueBrick, 0.8, "Auto: Get More Magnets\n(GS upgrade)", "table2"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Autocollectors",
            [
                new UIText("Auto Collector Garage", 0.5, 0.1, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.1, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("ScrapFactory"), { quadratic: true }),
                new UIText(() => "Auto Collectors need energy to run!\nOne collect costs 1 energy.", 0.5, 0.2, 0.04, "white"),

                new UIAutoUpgrade(game.collectors.beams, images.beam, 0.3, "Auto: Normal Beams"),
                new UIAutoUpgrade(game.collectors.aerobeams, images.aerobeam, 0.4, "Auto: Aerobeams", "table2"),
                new UIAutoUpgrade(game.collectors.angelbeams, images.angelbeam, 0.5, "Auto: Angel Beams"),
                new UIAutoUpgrade(game.collectors.reinforcedbeams, images.reinforcedbeam, 0.6, "Auto: Reinforced Beams", "table2"),
                new UIAutoUpgrade(game.collectors.glitchbeams, images.glitchbeam, 0.7, "Auto: Glitch Beams"),
                new UIAutoUpgrade(game.collectors.tires, images.tire, 0.8, "Auto: Tires", "table2"),
                new UIAutoUpgrade(game.collectors.gold, images.movingItems.goldenBeam, 0.9, "Auto: Golden Beams"),
            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("SkillTree",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText("Skill Tree", 0.5, 0.09, 0.12, "white", {
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

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost, images.upgrades.moreScrap, "More Scrap", 0.5, 0.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.xplustwo, images.upgrades.xplustwo, "x + 2", 0.5, 0.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockbeamtypes, images.upgrades.unlockbeamtypes, "Unlock Beam Types", 0.5, 0.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.brickBoost, images.upgrades.brickBoost, "More Bricks", 0.2, 1.25, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet, images.upgrades.fasterFallingMagnets, "Merge Quests\nUpgrade:\nFalling Magnets", 0.8, 1.25, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost, images.upgrades.tireBoost, "Get more\nxTires per\ncollect", 0.2, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed, images.upgrades.brickSpeed, "Magnet\nUpgrade:\nBrick Speed", 0.5, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreFragments, images.upgrades.moreFragments, "More\nFragments", 0.8, 1.55),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost2, images.upgrades.moreScrap2, "More Scrap 2", 0.2, 1.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.ezUpgraderQuests, images.ezUpgrade, "EZ Upgrader\nfor Merge\nQuests", 0.5, 1.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterAutoMerge, images.upgrades.brickSpeed, "Faster\nAuto Merge", 0.8, 1.85, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherAstroMax, images.upgrades.moreFragments, "Increased\nAstro Max.", 0.2, 2.15),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireValue, images.upgrades.tireBoost, "Double\nTire Worth", 0.8, 2.15),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreMergeTokens, images.upgrades.moreMergeTokens, "Double\nMerge Tokens", 0.5, 2.45, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockScrapyard, images.upgrades.unlockscrapyard, "Unlock Scrapyard", 0.2, 2.75),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.superEzUpgrader, images.ezUpgrade, "Unlock Super\nEZ Upgrader", 0.8, 2.75),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterBricks, images.ezUpgrade, "+1% Faster\nBricks", 0.2, 3.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherBeamValueMax, images.upgrades.unlockscrapyard, "Higher\nMore Beams\nMax. level", 0.8, 3.05, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.speedBoostsFragments, images.upgrades.moreFragments, "Barrel spawn speed and Venus\nboost fragment gain", 0.5, 3.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockMastery, images.upgrades.unlockMastery, "Unlock\nBarrel Mastery", 0.5, 3.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.efficientEnergy, images.upgrades.efficientenergy, "Efficient Energy\nAuto buyers\nconsume less", 0.2, 3.95),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.fourthMaxLevel, images.upgrades.fourthUpgrades, "Increases max. level\nof the 4th upgrade\nof every beam type", 0.8, 3.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.renewableEnergy, images.upgrades.renewableenergy, "Renewable Energy\nGet energy every time\na beam falls", 0.2, 4.25, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockBeamConverter, images.upgrades.unlockConverter, "Unlock\nBeam Converter", 0.8, 4.25, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockPlasticBags, images.upgrades.unlockPlasticBags, "Unlock\nPlastic Bags", 0.5, 4.55, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.strongerMasteryGS, images.upgrades.strongerMasteryScrap, "Stronger Merge\nMastery GS boost", 0.2, 4.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost2, images.upgrades.tireBoost, "Get more\nxTires per\ncollect", 0.5, 4.85, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.shortGSStorms, images.upgrades.shorterGSStorms, "Short GS storms", 0.8, 4.85, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.strongerMasteryMagnets, images.upgrades.strongerMasteryMagnets, "Stronger\nMerge Mastery\nMagnet boost", 0.2, 5.15, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.doublePlasticBags, images.upgrades.doublePlasticBags, "Double\nPlastic Bags", 0.5, 5.15, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherNeptuneMax, images.upgrades.higherNeptuneMax, "Higher\nNeptune Max.", 0.8, 5.15, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterMergeMastery, images.upgrades.fasterMaster, "Faster\nMerge Mastery", 0.2, 5.45, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.cheaperMythus, images.upgrades.cheaperMythus, "Cheaper\nMythus", 0.5, 5.45, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockAutoCollectors, images.upgrades.unlockAutoCollectors, "Unlock\nAuto Collectors", 0.8, 5.45, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockScrews, images.upgrades.unlockScrews, "Unlock Screws", 0.5, 5.75, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetBoost, images.upgrades.magnetBoost, "More Magnets", 0.2, 6.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.newTireUpgrades, images.upgrades.tireBoost, "Unlock new\nTire Upgrades", 0.5, 6.05, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.posusAffectsDark, images.upgrades.posusDarkFragments, "Posus affects\nDark Fragments", 0.8, 6.05, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, "Falling Magnets\nare worth more", 0.2, 6.35, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockTimeMode, images.upgrades.unlockTimeMode, "Unlock\nTime Mode", 0.5, 6.35, "table"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.starDaily, images.upgrades.starDaily, "Star barrels count\nfor daily quests", 0.8, 6.35, "table"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.veryFastCrafting, images.upgrades.fasterFactory, "Faster Crafting", 0.2, 6.65, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.funnyGlitchBeams, images.upgrades.funnyGlitchBeams, "Funny Glitch Beams\n(& x2 worth)", 0.5, 6.65, "table2"),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherDarkScrapTokenMax, images.upgrades.moreDarkScrap, "Higher max. for\n2nd Dark Scrap upg.", 0.8, 6.65, "table2"),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockSupernova, images.solarSystem.sun, "Unlock Supernova", 0.5, 6.95, "table"),
                    
                ], 0, 0.2, 1, 0.8, () => true, {ymin: 0, ymax: 7.15})
            ],
            function ()
            {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Supernova",
                [
                    new UIText("Supernova", 0.5, 0.05, 0.08, "white", {
                        bold: 900,
                        borderSize: 0.005,
                        font: fonts.title
                    }),
                    new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                    new UIText("You have gathered enough power from Glitch Beams and built\na laser powerful enough to destroy the sun,\ncausing a Supernova, destroying the entire\nsolar system and everything in it.\n" +
                        "Press the button below to learn more.", 0.5, 0.175, 0.03, "black", { isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA }),

                    new UIButton(0.5, 0.4, 0.15, 0.15, images.solarSystem.destroyer, () => Scene.loadScene("Supernova2"), { quadratic: true, isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NOVA }),

                    new UIText(() => "Stars: " + formatNumber(game.supernova.stars) + "\nx" + formatNumber(new Decimal(1000).pow(game.supernova.stars)) + " Golden Scrap", 0.5, 0.6, 0.04, "black"),

                    new UIText(() => "$images.stardust$ Star Dust: " + formatNumber(game.supernova.starDust), 0.5, 0.7, 0.05, "black"),
                    new UIText(() => "$images.aliendust$ Alien Dust: " + formatNumber(game.supernova.alienDust), 0.5, 0.75, 0.05, "black"),
                    new UIText(() => "$images.fairydust$ Fairy Dust: " + formatNumber(game.supernova.fairyDust), 0.5, 0.8, 0.05, "black"),

                    new UIText(() => "$images.cosmicemblem$ Cosmic Emblems: " + formatNumber(game.supernova.cosmicEmblems), 0.5, 0.85, 0.04, "black"),


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
                new UIText("Supernova", 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "You will lose everything except stats, achievements, wrenches,\nBarrel Mastery, settings and things earned from Supernovas.", 0.5, 0.175, 0.03, "black"),

                new UIText(() => "You will earn:\n+" + formatNumber(game.supernova.getEmblems()) + " Cosmic Emblems" +
                    "\n+" + formatNumber(game.supernova.getStarDust()) + " Star Dust" +
                    "\n+" + formatNumber(game.supernova.getAlienDust()) + " Alien Dust" +
                    "\n+" + formatNumber(game.supernova.getFairyDust()) + " Fairy Dust" +
                    "\n+1 Star" +
                    "\n Click the button below to do a Supernova.", 0.5, 0.3, 0.04, "black"),

                new UIButton(0.5, 0.8, 0.15, 0.15, images.supernovabutton, () => {
                    if (confirm("Do you really want to do a Supernova?")) {
                        game.supernova.reset();
                    }
                }, { quadratic: true }),
            ],

            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("EmblemUpgrades",
            [
                new UIText("Cosmic Emblems", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Supernova"), { quadratic: true }),

                new UIText(() => "$images.glitchbeam$ Cosmic Emblems: " + formatNumber(game.supernova.cosmicEmblems), 0.5, 0.2, 0.06, "yellow"),

                new UIScrollContainerY([
                    new UIRect(0.5, 0.5, 1, 0.4, "table"),
                    new UIRect(0.5, 0.8, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.1, 1, 0.3, "table"),
                    new UIRect(0.5, 1.4, 1, 0.3, "table2"),
                    new UIRect(0.5, 1.7, 1, 0.3, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.autoBuyerMax, images.upgrades.moreMergeTokens, "Auto Buyers\nbuy max.", 0.2, 0.45, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.strongerMagnetGS, images.upgrades.goldenScrapBoost, "Stronger More GS\n(Magnet Upgrade)", 0.5, 0.45, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.keepEZ, images.upgrades.goldenScrapBoost, "Keep EZ\nUpgrader", 0.8, 0.45, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.fasterMergeQuests, images.upgrades.moreScrap, "Merge Quests\nappear faster", 0.2, 0.75, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.doubleBeams, images.upgrades.beamValue, "2x Beams", 0.5, 0.75, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.moreScrapMax, images.upgrades.moreScrap, "Higher Get More\nScrap max.\n(GS upgrade)", 0.8, 0.75, "table2"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.keepAutoBuyers, images.upgrades.unlockAutos, "Keep Auto Buyers\nafter Supernova", 0.2, 1.05, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.startScrap, images.upgrades.moreScrap, "Start Scrap\nafter Supernova", 0.5, 1.05, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.startBeams, images.upgrades.beamValue, "Start Beams\nafter Supernova", 0.8, 1.05, "table"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.moreQuestLevelsMax, images.upgrades.moreMergeTokens, "Higher 5th Brick\nupgrade max.", 0.2, 1.35, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.strongerCollectors, images.upgrades.unlockAutoCollectors, "Stronger\nAuto Collectors", 0.5, 1.35, "table2"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.fasterAutoMerge, images.upgrades.fasterAutoMerge, "Faster Auto Merge", 0.8, 1.35, "table2"),

                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.faster2ndDim, images.upgrades.moreDarkScrap, "Faster\n2nd Dim", 0.2, 1.65, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.hyperBuy, images.checkbox.hyperbuy.on, "Hyper Buy", 0.5, 1.65, "table"),
                    new UIEmblemUpgrade(game.supernova.cosmicUpgrades.mythusMultiBuy, images.upgrades.cheaperMythus, "Get 10 Mythus\nLevels at once", 0.8, 1.65, "table"),
                ], 0, 0.3, 1, 0.7, () => true, { ymin: 0, ymax: 1.85 })

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
                    if (confirm("Do you really want to reset your Star Dust Upgrades? (100% refund)")) {
                        game.supernova.starDust = new Decimal(game.stats.totalstardust);
                        for (u in game.supernova.starDustUpgrades) {
                            game.supernova.starDustUpgrades[u].level = 0;
                        }
                    }
                }, { quadratic: true }),

                new UIPlanet(0.4, 0.6, "Ara\nMore GS", game.supernova.starDustUpgrades.ara, "$images.stardust$", images.constellations.ara, 0.075),
                new UIPlanet(0.15, 0.7, "Aries\nMore Magnets", game.supernova.starDustUpgrades.aries, "$images.stardust$", images.constellations.aries, 0.075),
                new UIPlanet(0.75, 0.5, "Corvus\nMore Tires", game.supernova.starDustUpgrades.corvus, "$images.stardust$", images.constellations.corvus, 0.075),
                new UIPlanet(0.85, 0.2, "Volans\nMore Fragments", game.supernova.starDustUpgrades.volans, "$images.stardust$", images.constellations.volans, 0.075),
                new UIPlanet(0.8, 0.8, "Vulpecula\nFaster Merge Mastery", game.supernova.starDustUpgrades.vulpecula, "$images.stardust$", images.constellations.vulpecula, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("AlienDustUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("Supernova"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.buttonBack, () => {
                    if (confirm("Do you really want to reset your Alien Dust Upgrades? (100% refund)")) {
                        game.supernova.alienDust = new Decimal(game.stats.totalaliendust);
                        for (u in game.supernova.alienDustUpgrades) {
                            game.supernova.alienDustUpgrades[u].level = 0;
                        }
                        updateBetterBarrels();
                    }
                }, { quadratic: true }),

                new UIPlanet(0.2, 0.8, "Cetus\nFaster Crafting", game.supernova.alienDustUpgrades.cetus, "$images.aliendust$", images.constellations.cetus, 0.075),
                new UIPlanet(0.8, 0.2, "Triangulum\nMore Merge Tokens", game.supernova.alienDustUpgrades.triangulum, "$images.aliendust$", images.constellations.triangulum, 0.075),
                new UIPlanet(0.5, 0.6, "Volans 2\nMore Dark Fragments", game.supernova.alienDustUpgrades.volans2, "$images.aliendust$", images.constellations.volans, 0.075),
                new UIPlanet(0.7, 0.85, "Aquila\nHigher Better Barrels max.", game.supernova.alienDustUpgrades.aquila, "$images.aliendust$", images.constellations.aquila, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("FairyDustUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("Supernova"), { quadratic: true }),
                new UIButton(0.1, 0.15, 0.07, 0.07, images.buttonBack, () => {
                    if (confirm("Do you really want to reset your Fairy Dust Upgrades? (100% refund)")) {
                        game.supernova.fairyDust = new Decimal(game.stats.totalfairydust);
                        for (u in game.supernova.fairyDustUpgrades) {
                            game.supernova.fairyDustUpgrades[u].level = 0;
                        }
                    }
                }, { quadratic: true }),

                new UIPlanet(0.4, 0.6, "Cancer\nMore Plastic Bags", game.supernova.fairyDustUpgrades.cancer, "$images.fairydust$", images.constellations.cancer, 0.075),
                new UIPlanet(0.85, 0.2, "Pyxis\nMore Beams", game.supernova.fairyDustUpgrades.pyxis, "$images.fairydust$", images.constellations.pyxis, 0.075),
                new UIPlanet(0.3, 0.4, "Antlia\nMore Aerobeams", game.supernova.fairyDustUpgrades.antlia, "$images.fairydust$", images.constellations.antlia, 0.075),
                new UIPlanet(0.6, 0.45, "Phoenix\nMore Angel Beams", game.supernova.fairyDustUpgrades.phoenix, "$images.fairydust$", images.constellations.phoenix, 0.075),
                new UIPlanet(0.35, 0.8, "Orion\nMore Reinforced Beams", game.supernova.fairyDustUpgrades.orion, "$images.fairydust$", images.constellations.orion, 0.075),
                new UIPlanet(0.7, 0.85, "Puppis\nMore Glitch Beams", game.supernova.fairyDustUpgrades.puppis, "$images.fairydust$", images.constellations.puppis, 0.075),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
    ];
