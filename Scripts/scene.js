var myMusic;
var isPlaying = 0;
var hePlayed = 0;
var compareStats = {};

var C = "default";
var calcTime = "";
var calcTime2 = "";
var timeDisplay = "";

var barrelsDisplayMode = 0;
var selectedConvert = 0;
var selectedConvertTo = 0;

var worth1, worth2;
var multiConvert = 1;

const BARRELS = 850;

var characters = [[0.4, 0.6, 1, 0, () => applyUpgrade(game.shrine.factoryUnlock)], [0.6, 0.75, 1, 0.5, () => applyUpgrade(game.skillTree.upgrades.unlockAutoCollectors)]];

function getTotalLevels(x) {
    return 0;
}

function playmusic(x = 0) {
    if (game.settings.musicSelect != hePlayed) {
        x = 50;
    }
    if (isPlaying == 0) {
        // Define myMusic. Set which song will be played depending on the player progess
        if (game.settings.musicSelect == 0) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("NewerWave.mp3");
        }
        else if (game.settings.musicSelect == 1) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("GettingitDone.mp3");
        }
        else if (game.settings.musicSelect == 2) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("Spellbound.mp3");
        }
        else if (game.settings.musicSelect == 3) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("Voltaic.mp3");
        }
    }

    // playmusic(50) will stop the music
    if (x == 50) {
        isPlaying = 0;
        myMusic.pause();
    }
    // music turned off? get the hell outta here!
    if (game.settings.musicOnOff == 0) {
        isPlaying = 0;
        return;
    }

    if (game.settings.musicSelect != hePlayed) {
        hePlayed = game.settings.musicSelect;
        playmusic();
    }

    // for repeating music... code kinda complicated
    if (x == 5) {
        isPlaying = 0;
    }

    // play the music and repeat it
    if (isPlaying != 1) {
        myMusic.play();
        isPlaying = 1;

        if (game.settings.musicSelect == 0) {
            setTimeout(repeatmusic, 175000);
        }
        else if (game.settings.musicSelect == 1) {
            setTimeout(repeatmusic, 210000);
        }
        else if (game.settings.musicSelect == 2) {
            setTimeout(repeatmusic, 230000);
        }
        else if (game.settings.musicSelect == 3) {
            setTimeout(repeatmusic, 200000);
        }
    } //^Wonder what those values are? Duration of the song in ms!
}

function repeatmusic() {
    if (game.settings.musicOnOff == 1) playmusic(5);
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

        
        if (game.settings.musicOnOff == 0) {
            playmusic(50);
        }
        else {
            playmusic();
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
            if(element.isVisible())
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

function getStonks(swit) {
    let worth;
    switch (swit) {
        case 0:
            worth = getBeamBaseValue() / (30 - applyUpgrade(game.beams.upgrades.fasterBeams));
            break;
        case 1:
            worth = getBeamBaseValue() / (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams));
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
                ctx.fillText("v2.9 (v3.6)", w * 0.99, h - w * 0.01);

                ctx.textAlign = "center";
                ctx.font = "300 px " + fonts.default;
                ctx.fillText("Is for me?", w * 0.49, h - w * 0.1);

            }),
        new Scene("Barrels",
            [
                new UIButton(0.125, 0.73, 0.05, 0.05, images.upgrades.betterBarrels, function () {
                    game.scrapUpgrades.betterBarrels.buy();
                }, { quadratic: true }),
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
                    isVisible: () => game.skillTree.upgrades.superEzUpgrader.level > 0,
                    quadratic: true
                }),
                new UIButton(0.125, 0.81, 0.05, 0.05, images.upgrades.fasterBarrels, function () {
                    game.scrapUpgrades.fasterBarrels.buy();
                }, { quadratic: true }),



                new UIButton(0, 0.97, 0.15, 0.06, images.scenes.dimension, () => Scene.loadScene("SecondDimension"), {
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SECOND_DIMENSION,
                    quadraticMin: true, anchor: [0, 0.5]
                }),
                new UIButton(0.2, 0.97, 0.15, 0.06, images.scenes.barrelGallery, () => Scene.loadScene("BarrelGallery"), { quadraticMin: true }),
                new UIButton(0.35, 0.97, 0.15, 0.06, images.scenes.steelBeams, () => Scene.loadScene("Beams"), {
                    isVisible: () => game.beams.isUnlocked(),
                    quadraticMin: true
                }),
                new UIButton(0.5, 0.97, 0.15, 0.06, images.scenes.factory, () => Scene.loadScene("ScrapFactory"), {
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SCRAP_FACTORY,
                    quadraticMin: true
                }),
                new UIButton(0.65, 0.97, 0.15, 0.06, images.scenes.fragment, () => Scene.loadScene("Fragment"),
                    {
                        isVisible: () => game.highestBarrelReached >= 100,
                        quadraticMin: true
                    }),
                new UIButton(0.8, 0.97, 0.15, 0.06, images.scenes.goldenScrap, () => Scene.loadScene("GoldenScrap"),
                    {
                        isVisible: () => game.highestScrapReached.gte(1e15),
                        quadraticMin: true
                    }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.solarSystem, () => Scene.loadScene("SolarSystem"),
                    {
                        isVisible: function () {
                            return game.goldenScrap.upgrades.scrapBoost.level >= 8;
                        },
                        quadraticMin: true,
                        anchor: [1, 0.5]
                    }),


                new UIButton(0.125, 0.9, 0.05, 0.05, images.scenes.magnet, () => Scene.loadScene("MagnetUpgrades"), { quadratic: true }),
                new UIButton(0.275, 0.9, 0.05, 0.05, images.scenes.options, () => Scene.loadScene("Options"), { quadratic: true }),
                new UIButton(0.425, 0.9, 0.05, 0.05, images.scenes.milestones, () => Scene.loadScene("Milestones"), { quadratic: true }),
                new UIButton(0.575, 0.9, 0.05, 0.05, images.buttonMaxAll, () => maxScrapUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.earth.level >= 1
                    }),
                new UICheckbox(0.875, 0.9, 0.05, 0.05, "game.settings.autoConvert", {
                    isVisible: () => game.highestBarrelReached >= 300,
                    quadratic: true,
                    off: images.checkbox.autoConvert.off,
                    on: images.checkbox.autoConvert.on,
                }),
                new UICheckbox(0.725, 0.9, 0.05, 0.05, "game.settings.autoMerge", {
                    isVisible: () => game.ms.includes(5),
                    quadratic: true,
                    off: images.checkbox.autoMerge.off,
                    on: images.checkbox.autoMerge.on,
                }),


                new UIText(() => game.scrapUpgrades.betterBarrels.getPriceDisplay(), 0.125, 0.76, 0.035, "black", { bold: true }),
                new UIText(() => "Better Barrels (" + game.scrapUpgrades.betterBarrels.level.toFixed(0) + "/" + game.scrapUpgrades.betterBarrels.maxLevel + "):\nBarrels spawn 1 Tier higher", 0.225, 0.74, 0.03, "black", { halign: "left", valign: "middle" }),
                new UIText(() => game.scrapUpgrades.fasterBarrels.getPriceDisplay(), 0.125, 0.84, 0.035, "black", { bold: true }),
                new UIText(() => "Faster Barrels:\nBarrels spawn faster\n" + game.scrapUpgrades.fasterBarrels.getEffectDisplay(), 0.225, 0.82, 0.03, "black", { halign: "left", valign: "middle" }),

                new UIText(() => "+" + formatNumber(Barrel.getGlobalIncome()) + "/s", 0.3, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.settings.beamTimer == true) { return getBeamTime() } else { return " " } }, 0.725, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0) { return "Next Storm Chance In " + (60 - gsStormTime.toFixed(0)) + "s" } else { return " " } }, 0.725, 0.0775, 0.03, "white", { bold: true }),
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
                        draggedBarrel = b;
                        if (timeSinceLastBarrelClick <= 0.2 && lastClickedBarrel === i && game.settings.destroyBarrels) {
                            if (game.fragment.isUnlocked() == true) {
                                if (game.dimension == 0) {
                                    let Amount = new Decimal(barrels[i].level / 10).mul(getFragmentBaseValue());
                                    game.fragment.amount = game.fragment.amount.add(Amount);
                                    game.stats.totalfragments = game.stats.totalfragments.add(Amount);
                                }
                                else if (game.dimension == 1) {
                                    game.darkfragment.amount = game.darkfragment.amount.add(((barrels[i].level / 10)));
                                    game.stats.totaldarkfragments = game.stats.totaldarkfragments.add(((barrels[i].level / 10)));
                                }
                            }
                            barrels[i] = undefined;
                            draggedBarrel = undefined;
                            lastClickedBarrel = -1;
                            freeSpots += 1;
                        }
                        else {
                            lastClickedBarrel = i;
                            timeSinceLastBarrelClick = 0;
                            draggedBarrel.originPos = i;
                            barrels[i] = undefined;
                        }
                    }
                }
            },
            function () {
                if (draggedBarrel != null) {
                    let index = draggedBarrel.getDropIndex();
                    if (index !== -1) {
                        let b = barrels[index];
                        if (b !== undefined) {
                            let lvl = barrels[index].level;
                            if (Math.round(lvl) === Math.round(draggedBarrel.level)) {
                                tempDrawnBarrels[index] = draggedBarrel.level;
                                barrels[index] = new Barrel(draggedBarrel.level + 1);
                                freeSpots += 1;
                                onBarrelMerge(false, Math.round(draggedBarrel.level));
                                draggedBarrel = undefined;
                            }
                            else {
                                barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                                barrels[draggedBarrel.originPos].scale = 0.7;
                                draggedBarrel = undefined;
                            }
                        }
                        else {
                            barrels[index] = draggedBarrel;
                            draggedBarrel = undefined;
                        }
                    }
                    else {
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
                    ], () => game.milestones.achievements[6].isUnlocked()),
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
                        game.goldenScrap.reset();
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

                        game.darkscrap.amount = game.darkscrap.amount.add(new Decimal(getDarkScrap(calculateCurrentHighest())));
                        game.stats.totaldarkscrap = game.stats.totaldarkscrap.add(new Decimal(getDarkScrap(calculateCurrentHighest())));

                        setBarrelQuality(game.settings.barrelQuality);
                        for (let i = 0; i < barrels.length; i++) {
                            barrels[i] = undefined;
                        }
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
                    "You get a total boost of x" + formatNumber((1 + (applyUpgrade(game.darkscrap.upgrades.darkScrapGoldenScrap) * game.darkscrap.amount))) + "!", 0.5, 0.3, 0.025, "black"),

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
                        return "Fragments can be earned by destroying barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + formatNumber(new Decimal(game.scrapUpgrades.betterBarrels.level / 10).mul(getFragmentBaseValue())) + " fragments."
                    }
                    if (game.dimension == 1) {
                        return "Dark Fragments can be earned by destroying dark barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + formatNumber(((parseInt(game.scrapUpgrades.betterBarrels.level) / 10))) + " dark fragments."
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
                            GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[120]));
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
                        if(barrelsDisplayMode == 0) ctx.fillText(i + 1, x, y - h * 0.065, w * 0.15);
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
                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("OuterSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER
                }),

                new UIPlanet(0.5, 0.5, "Sun\nIncrease Scrap production", game.solarSystem.upgrades.sun, "$images.magnet$", images.solarSystem.sun, 0.13),
                new UIPlanet(0.7, 0.7, "Mercury\nIncrease Golden\nScrap Boost", game.solarSystem.upgrades.mercury, "$images.magnet$", images.solarSystem.mercury, 0.035),
                new UIPlanet(0.3, 0.325, "Venus\nIncrease Double\nSpawn Chance", game.solarSystem.upgrades.venus, "$images.scrap$", images.solarSystem.venus, 0.055),
                new UIPlanet(0.65, 0.2, "Earth\nUnlock new Stuff", game.solarSystem.upgrades.earth, "$images.goldenScrap$", images.solarSystem.earth, 0.055),
                new UIPlanet(0.2, 0.825, () => "Mars\nFalling Magnets\n" + formatNumber(getMagnetBaseValue()
                    .mul(5)) + " each", game.solarSystem.upgrades.mars, "$images.fragment$", images.solarSystem.mars, 0.04, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS), //whoever did not put a , there before I hate U!!!

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
                    new UITireUpgrade(game.tires.upgrades[0][2], images.upgrades.fasterMastery, "Faster\nMerge Mastery", 2.5 / 3, 0.4)
                ]),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[1][0], images.upgrades.tireBoost, "Tire Value\nper Collect", 0.5 / 3, 0.6, "table2"),
                    new UITireUpgrade(game.tires.upgrades[1][1], images.upgrades.tireChance, "Tire Chance\nper Merge", 1.5 / 3, 0.6, "table2"),
                    new UITireUpgrade(game.tires.upgrades[1][2], images.upgrades.questSpeed, "Faster\nMerge Quests", 2.5 / 3, 0.6, "table2")
                ], () => game.tires.amount.gt(game.tires.milestones[1])),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[2][0], images.upgrades.fasterFallingMagnets, "Faster\nFalling Magnets", 0.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][1], images.upgrades.fasterAutoMerge, "Faster\nAuto Merge", 1.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][2], images.upgrades.goldenScrapBoost, "More\nGolden Scrap", 2.5 / 3, 0.8)
                ], () => game.tires.amount.gt(game.tires.milestones[2]))
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
                new UIButton(0.35, 0.97, 0.15, 0.06, images.scenes.beamboosts, () => Scene.loadScene("Beamboosts"), { quadraticMin: true }),
                new UIButton(0.5, 0.97, 0.15, 0.06, images.scenes.convert, () => Scene.loadScene("Beamconvert"), {
                    quadraticMin: true,
                    isVisible: () => applyUpgrade(game.skillTree.upgrades.unlockBeamConverter),
                }),
                new UIButton(0.65, 0.97, 0.15, 0.06, images.scenes.angelbeams, () => Scene.loadScene("AngelBeams"), {
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
                new UIBeamUpgrade(game.beams.upgrades.fasterBeams, images.upgrades.beamChance, 0.45, "All Beams spawn more often"),
                new UIBeamUpgrade(game.beams.upgrades.beamValue, images.upgrades.beamValue, 0.55, "Beams are worth more", "table2"),
                new UIBeamUpgrade(game.beams.upgrades.slowerBeams, images.upgrades.slowerBeams, 0.65, "Beams fall slower"),
                new UIBeamUpgrade(game.beams.upgrades.beamStormChance, images.upgrades.beamStormChance, 0.75, "Beam storms occur more often", "table2"),
                new UIBeamUpgrade(game.beams.upgrades.beamStormValue, images.upgrades.beamStormValue, 0.85, "Beams storms are longer"),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);

                ctx.fillStyle = colors[C]["bgFront"];
                ctx.fillRect(0, h * 0.94, w, h * 0.06);
            }),
        new Scene("Beamboosts",
            [
                new UIText("Steel Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of a beam storm\noccuring instead of a single beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + Math.round(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),
                new UIBeamUpgrade(game.beams.upgrades.moreScrap, images.upgrades.moreScrap, 0.45, "Get more Scrap"),
                new UIBeamUpgrade(game.beams.upgrades.moreMagnets, images.upgrades.magnetBoost, 0.55, "Get more Magnets", "table2", () => { return game.beams.upgrades.moreScrap.level > 9 }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C]["table"];
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
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

                new UIText(() => { return "Aerobeams fall every " + (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an aerobeam storm\noccuring instead of a single aerobeam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

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
                        let amount = 1 + game.skillTree.upgrades.doublePlasticBags.level;
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

                        if (rand > 87.5) {
                            game.plasticBags.currentResource = RESOURCE_SCRAP;
                            game.plasticBags.currentCosts = game.highestScrapReached.div(100000 * sin).round();
                        }
                        else if (rand > 75) {
                            game.plasticBags.currentResource = RESOURCE_MAGNET;
                            game.plasticBags.currentCosts = new Decimal(1e50 * sin).mul(new Decimal(1.4).pow(game.stats.totalplasticbags.add(1)));
                            // game.magnets.mul(1000 * Math.random());
                        }
                        else if (rand > 62.5) {
                            game.plasticBags.currentResource = RESOURCE_GS;
                            game.plasticBags.currentCosts = new Decimal(1e60 * sin).mul(new Decimal(1.8).pow(game.stats.totalplasticbags.add(1)));
                        }
                        else if (rand > 50) {
                            game.plasticBags.currentResource = RESOURCE_MERGE_TOKEN;
                            game.plasticBags.currentCosts = new Decimal(25 + Math.floor(500 * sin * Math.random() * (1 + (game.stats.totalplasticbags / 200))));
                        }
                        else if (rand > 37.5) {
                            game.plasticBags.currentResource = RESOURCE_FRAGMENT;
                            game.plasticBags.currentCosts = new Decimal(1000000 * sin).mul(new Decimal(1.03).pow(game.stats.totalplasticbags.add(1)));
                        }
                        else if (rand > 25) {
                            game.plasticBags.currentResource = RESOURCE_ANGELBEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(250 * sin * Math.random() * (1 + (game.stats.totalplasticbags / 150))));
                        }
                        else if (rand > 12.5) {
                            game.plasticBags.currentResource = RESOURCE_AEROBEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(250 * sin * Math.random() * (1 + (game.stats.totalplasticbags / 100))));
                        }
                        else {
                            game.plasticBags.currentResource = RESOURCE_BEAM;
                            game.plasticBags.currentCosts = new Decimal(5 + Math.floor(100 * sin * Math.random() * (1 + (game.stats.totalplasticbags / 200))));
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

                new UIText(() => "Current Time: " + timeDisplay, 0.5, 0.2, 0.06, "yellow"),

                new UIButton(0.84, 0.435, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.dailyQuest.active) {
                        if (game.mergeQuests.dailyQuest.barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.dailyQuest.barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.superEzUpgrader) }),

            ],
            function () {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);

                if (calcTime == "" || calcTime >= game.mergeQuests.nextDaily) {

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
                        timeDisplay = "" + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][puremonth] + " " + day + ". " + Math.min(12, Math.floor(hour / 12)) + [" AM", " PM"][Math.floor(hour / 12)];
                        futureTimeDisplay = "" + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][puremonth] + " " + tomorrow + ". " + "0 AM (UTC)";
                    }
                    if (calcTime >= game.mergeQuests.nextDaily) {
                        let dq = game.mergeQuests.dailyQuest;
                        dq.generateQuest(dq.possibleTiers[Math.floor(dq.possibleTiers.length * Math.random())]);
                        dq.currentMerges = 0;
                        game.mergeQuests.nextDaily = calcTime2;
                    }
                }

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                game.mergeQuests.dailyQuest.render(ctx, w * 0.15, h * (0.225 + 0.13));
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
                for (i = 0; i < 3; i++) {
                    ctx.fillText(formatNumber([game.highestMasteryLevel, game.highestBarrelReached, game.highestScrapReached][i]), w * 0.01, h * (0.125 + (0.025 * i)));
                }
                for (i = 0; i < 2; i++) {
                    ctx.fillText(formatNumber([game.totalMerges, game.selfMerges][i]), w * 0.01, h * (0.75 + (0.025 * i)));
                }
                for (i = 0; i < 20; i++) {
                    ctx.fillText(formatNumber(game.stats[[
                    "totalwrenches", "totalbeams", "totalaerobeams", "totalangelbeams", "totalreinforcedbeams", "totalglitchbeams", "totalbeamscollected", "totalaerobeamscollected", "totalangelbeamscollected", "totalreinforcedbeamscollected", "totalglitchbeamscollected", "totalquests", "totalmergetokens", "totaldarkscrap", "totalfragments", "totaldarkfragments", "totaltirescollected", "totalgsresets", "playtime", "totaldailyquests"
                    ][i]]), w * 0.01, h * (0.2 + (0.025 * i)));
                }
                ctx.fillText(formatNumber(game.stats["totaldailyquests"]), w * 0.01, h * (0.7 + (0.025 * i)));

                ctx.textAlign = "right";

                for (i = 0; i < 3; i++) {
                    ctx.fillText(formatNumber([compareStats.highestMasteryLevel, compareStats.highestBarrelReached, compareStats.highestScrapReached][i]), w * 0.99, h * (0.125 + (0.025 * i)));
                }
                for (i = 0; i < 2; i++) {
                    ctx.fillText(formatNumber([compareStats.totalMerges, compareStats.selfMerges][i]), w * 0.99, h * (0.75 + (0.025 * i)));
                }
                for (i = 0; i < 20; i++) {
                    ctx.fillText(formatNumber(compareStats[[
                    "totalwrenches", "totalbeams", "totalaerobeams", "totalangelbeams", "totalreinforcedbeams", "totalglitchbeams", "totalbeamscollected", "totalaerobeamscollected", "totalangelbeamscollected", "totalreinforcedbeamscollected", "totalglitchbeamscollected", "totalquests", "totalmergetokens", "totaldarkscrap", "totalfragments", "totaldarkfragments", "totaltirescollected", "totalgsresets", "playtime", "totaldailyquests"
                    ][i]]), w * 0.99, h * (0.2 + (0.025 * i)));
                }
                ctx.fillText(formatNumber(game.stats["totaldailyquests"]), w * 0.99, h * (0.7 + (0.025 * i)));

                ctx.textAlign = "center";

                for (i = 0; i < 27; i++) {
                    ctx.fillStyle = [new Decimal(game.highestMasteryLevel), new Decimal(game.highestBarrelReached), new Decimal(game.highestScrapReached), game.stats.totalwrenches, game.stats.totalbeams, game.stats.totalaerobeams, game.stats.totalangelbeams, game.stats.totalreinforcedbeams, game.stats.totalglitchbeams, game.stats.totalbeamscollected, game.stats.totalaerobeamscollected, game.stats.totalangelbeamscollected, game.stats.totalreinforcedbeamscollected, game.stats.totalglitchbeamscollected, game.stats.totalquests, game.stats.totalmergetokens, game.stats.totaldarkscrap, game.stats.totalfragments, game.stats.totaldarkfragments, game.stats.totaltirescollected, game.stats.totalgsresets, game.stats.playtime, game.stats.totaldailyquests, new Decimal(0), new Decimal(0), new Decimal(game.totalMerges), new Decimal(game.selfMerges)]
                    [i].gte(compareStats[[
                        "highestMasteryLevel", "highestBarrelReached", "highestScrapReached", "totalwrenches", "totalbeams", "totalaerobeams", "totalangelbeams", "totalreinforcedbeams", "totalglitchbeams", "totalbeamscollected", "totalaerobeamscollected", "totalangelbeamscollected", "totalreinforcedbeamscollected", "totalglitchbeamscollected", "totalquests", "totalmergetokens", "totaldarkscrap", "totalfragments", "totaldarkfragments", "totaltirescollected", "totalgsresets", "playtime", "totaldailyquests", "totaldailyquests", "totaldailyquests", "totalMerges", "selfMerges"
                        ][i]]) ? "lightgreen" : colors[C]["text"];
                    ctx.fillText([
                        "Highest Merge Mastery Level", "Highest Barrel Reached", "Highest Scrap Reached", "Total Wrenches", "Total Beams", "Total Aerobeams", "Total Angel Beams", "Total Reinforced Beams", "Total Glitch Beams", "Total Beams Collected", "Total Aerobeams Collected", "Total Angel Beams Collected", "Total Reinforced Collected", "Total Glitch Beams Collected", "Total quests completed", "Total Merge Tokens", "Total Dark Scrap", "Total Fragments", "Total Dark Fragments", "Total Tires Collected", "Total GS Resets", "Play Time", "Total Daily Quests completed", "", "", "Total Merges", "Self Merges"
                    ][i], w * 0.5, h * (0.125 + (0.025 * i)));
                }
            }
        ),
        new Scene("Options",
            [
                new UIText("Options", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.barrelShadows", "Toggle Barrel Shadows\n(can slow down Game)", "table"),
                    new UIToggleOption(0.35, "game.settings.useCachedBarrels", "Cache some Barrel Images\n(may slow down\nor speed up Game)", "bg"),
                    new UIOption(0.45, images.options.barrelQuality, () => {
                        game.settings.barrelQuality = (++game.settings.barrelQuality) % 3;
                        setBarrelQuality(game.settings.barrelQuality, "Options");
                    }, () => "Barrel Quality: " + ["High", "Low", "Ultra Low"][game.settings.barrelQuality], "table"),
                    new UIOption(0.55, images.options.numberFormat, () => {
                        game.settings.numberFormatType = (++game.settings.numberFormatType) % NUM_FORMAT_TYPES;
                    }, () => {
                        let fmtnmb = [];
                        for (let i = 6, j = 0; j < 4; i = (i + 3) * 1.25, j++) {
                            fmtnmb.push(formatNumber(Decimal.pow(10, i)));
                        }
                        return "Switch Number format\n" + fmtnmb.join(", ");
                    }, "bg"),
                    new UIOption(0.65, images.options.barrelQuality, () => {
                        game.settings.C = (++game.settings.C) % 4;
                        C = ["default", "darkblue", "dark", "pink"][game.settings.C];
                    }, () => "Theme: " + ["Default light blue", "Dark Blue", "Dark Theme", "Square Pink"][game.settings.C], "table"),
                ], () => game.settings.optionsPage === 0),
                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.destroyBarrels", "Double Click Barrels to remove them", "table"),
                    new UIToggleOption(0.35, "game.settings.resetConfirmation", "Reset Confirmation", "bg"),
                    new UIToggleOption(0.45, "game.settings.lowPerformance", "Low performance Mode", "table"),
                    new UIToggleOption(0.55, "game.settings.barrelSpawn", "Barrel Spawn", "bg"),
                ], () => game.settings.optionsPage === 1),
                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.musicOnOff", "Music", "bg"),
                    new UIOption(0.35, images.options.numberFormat, () => {
                        if (game.ms.length > [-1, 9, 24, 49][game.settings.musicSelect]) {
                            game.settings.musicSelect = game.settings.musicSelect + 1;
                        }
                        else {
                            game.settings.musicSelect = 0;
                        }
                        if (game.settings.musicSelect == 4) game.settings.musicSelect = 0;
                    }, () => "Current: " + ["Newerwave", "Getting It Done", "Spellbound", "Voltaic"][game.settings.musicSelect] + "\nKevin MacLeod"),
                    new UIOption(0.45, images.scenes.options, () => {
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
                    }, "Reset Second Dimension Progress", "bg"),
                    new UIOption(0.55, images.options.barrelQuality, () => {
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
                ], () => game.settings.optionsPage === 2),
                new UIButton(0.25, 0.65, 0.075, 0.075, images.arrows.left, () => game.settings.changeOptionsPage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage > 0
                    }),
                new UIButton(0.75, 0.65, 0.075, 0.075, images.arrows.right, () => game.settings.changeOptionsPage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage < 2
                    }),
                new UIButton(0.1, 0.89, 0.05, 0.05, images.logos.discord, () => location.href = "https://discord.gg/3T4CBmh", { quadratic: true }),
                new UIText("My Discord Server", 0.18, 0.89, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIButton(0.1, 0.96, 0.05, 0.05, images.logos.youtube, () => location.href = "https://www.youtube.com/channel/UC7qnN9M1_PUqmrgOHQipC2Q", { quadratic: true }),
                new UIText("My Youtube Channel", 0.18, 0.96, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIText("Unauthorized mods of this mod are prohibited!", 0.95, 0.88, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Original Scrap Clicker 2 by Schrott Games ©2017", 0.95, 0.92, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Mod of VeproGames' Scrap 2 Fanmade ©2019", 0.95, 0.93, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Mod SC2FMFR created by Schrottii ©2021", 0.95, 0.94, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Libraries used:\nbreak_infinity\ngrapheme-splitter", 0.95, 0.99, 0.025, "black", { halign: "right", valign: "bottom" }),
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
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) }),
                new UIButton(0.84, 0.385, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[1].active) {
                        if (game.mergeQuests.quests[1].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[1].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) }),
                new UIButton(0.84, 0.515, 0.05, 0.05, images.ezUpgrade, () => {
                    if (game.mergeQuests.quests[2].active) {
                        if (game.mergeQuests.quests[2].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[2].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, { quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests) })
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

                new UIText(() => "Use 2 currencies and some energy from the generator\n to craft new currencies here!\nOnly available in the first dimension.", 0.5, 0.8, 0.03, "black"),

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
                new UIText("Autobuyers", 0.5, 0.1, 0.08, "white", {
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
                    
                ], 0, 0.2, 1, 0.8, () => true, {ymin: 0, ymax: 6.05})
            ],
            function ()
            {
                ctx.fillStyle = colors[C]["bg"];
                ctx.fillRect(0, 0, w, h);
            })
    ];
