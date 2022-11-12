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

var scenes =
    [
        new Scene("Loading",
            [],
            function()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors.table2;
                ctx.fillRect(0, h * 0.1, w, h);

                ctx.drawImage(images.appIcon, w * 0.3, h * 0.25, w * 0.4, w * 0.4);

                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.font = "300 " + (h * 0.06) + "px " + fonts.default;
                ctx.fillText("Scrap II Fanmade", w * 0.5, h * 0.02, w * 0.9);

                ctx.font = "300 " + (h * 0.05) + "px " + fonts.default;
                ctx.fillText("Loading...", w * 0.5, h * 0.6, w * 0.9);

                ctx.font = "300 " + (h * 0.03) + "px " + fonts.default;
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillText("v1.0", w * 0.99, h - w * 0.01);
            }),
        new Scene("Barrels",
            [
                new UIButton(0.125, 0.73, 0.05, 0.05, images.upgrades.betterBarrels, function ()
                {
                    game.scrapUpgrades.betterBarrels.buy();
                }, {quadratic: true}),
                new UIButton(0.125, 0.81, 0.05, 0.05, images.upgrades.fasterBarrels, function ()
                {
                    game.scrapUpgrades.fasterBarrels.buy();
                }, {quadratic: true}),
                new UIButton(0, 0.97, 0.15, 0.06, images.scenes.magnet, () => Scene.loadScene("MagnetUpgrades"), {quadraticMin: true, anchor: [0, 0.5]}),
                new UIButton(0.3, 0.97, 0.15, 0.06, images.scenes.barrelGallery, () => Scene.loadScene("BarrelGallery"), {quadraticMin: true}),
                new UIButton(0.7, 0.97, 0.15, 0.06, images.scenes.goldenScrap, () => Scene.loadScene("GoldenScrap"),
                    {
                        isVisible: () => game.highestScrapReached.gte(1e15),
                        quadraticMin: true
                    }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.solarSystem, () => Scene.loadScene("SolarSystem"),
                    {
                        isVisible: function ()
                        {
                            return game.goldenScrap.upgrades.scrapBoost.level >= 8;
                        },
                        quadraticMin: true,
                        anchor: [1, 0.5]
                    }),
                new UIButton(0.5, 0.97, 0.15, 0.06, images.scenes.options, () => Scene.loadScene("Options"), {
                    quadraticMin: true
                }),
                new UIButton(0.4, 0.9, 0.05, 0.05, images.buttonMaxAll, () => maxScrapUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.earth.level >= 1
                    }),
                new UICheckbox(0.25, 0.9, 0.05, 0.05, "game.settings.autoMerge", {
                    isVisible: () => game.milestones.unlocked.includes(6),
                    quadratic: true,
                    off: images.checkbox.autoMerge.off,
                    on: images.checkbox.autoMerge.on,
                }),
                new UIButton(0.1, 0.9, 0.05, 0.05, images.scenes.milestones, () => Scene.loadScene("Milestones"), {quadratic: true}),
                new UIText(() => game.scrapUpgrades.betterBarrels.getPriceDisplay(), 0.125, 0.76, 0.035, "black", {bold: true}),
                new UIText(() => "Better Barrels (" + game.scrapUpgrades.betterBarrels.level.toFixed(0) + "/" + game.scrapUpgrades.betterBarrels.maxLevel + "):\nBarrels spawn 1 Tier higher", 0.225, 0.74, 0.03, "black", {halign: "left", valign: "middle"}),
                new UIText(() => game.scrapUpgrades.fasterBarrels.getPriceDisplay(), 0.125, 0.84, 0.035, "black", {bold: true}),
                new UIText(() => "Faster Barrels:\nBarrels spawn faster\n" + game.scrapUpgrades.fasterBarrels.getEffectDisplay(), 0.225, 0.82, 0.03, "black", {halign: "left", valign: "middle"})
            ],
            function (delta)
            {
                for (let i = 0, l = barrels.length; i < l; i++)
                {
                    if (barrels[i] !== undefined)
                    {
                        barrels[i].tick(delta);
                    }
                }

                incomeTextTime.cooldown += delta;
                if (incomeTextTime.cooldown >= incomeTextTime.time)
                {
                    for (let b of barrels)
                    {
                        if (b !== undefined)
                        {
                            b.createIncomeText();
                        }
                    }
                    incomeTextTime.cooldown = 0;
                }

                if (draggedBarrel !== undefined)
                {
                    draggedBarrel.scale = 1.1;
                }

                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);
                ctx.lineWidth = 0;

                ctx.fillStyle = colors.bgFront;
                ctx.fillRect(0, 0, w, h * 0.1);
                ctx.fillRect(0, h * 0.94, w, h * 0.06);

                ctx.fillStyle = "#003E8F";
                ctx.fillRect(w * 0.1, h * 0.04, w / 2.5, h * 0.04);
                ctx.fillRect(w * 0.92, h * 0.04, -w / 2.75, h * 0.04);

                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillStyle = "white";

                ctx.drawImage(images.barrels, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, w * 0.1 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);
                ctx.fillText(formatNumber(game.scrap), w * 0.15, h * 0.043, w / 3);

                ctx.textAlign = "right";
                ctx.fillText(formatNumber(game.magnets, game.settings.numberFormatType, {namesAfter: 1e9}), w * 0.85, h * 0.043, w / 3.5);
                ctx.drawImage(images.magnet, w * 0.9 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);

                ctx.fillStyle = colors.table;
                ctx.fillRect(0, h * 0.7, w, h * 0.08);
                ctx.fillStyle = colors.table2;
                ctx.fillRect(0, h * 0.78, w, h * 0.08);

                for(let i = 0, l = barrels.length; i < l; i++)
                {
                    if(barrels[i] !== undefined && barrels[i].scale >= 1 || barrels[i] === undefined)
                    {
                        tempDrawnBarrels[i] = undefined;
                    }
                }

                let barrelSize = Barrel.getBarrelSize();
                for (let i = 0, l = barrels.length; i < l; i++)
                {
                    let x = w / 2 + (barrelSize * 1.1 * (i % 4)) - (barrelSize * 1.1 * 1.5);
                    let y = h / 2 + (barrelSize * 1.15 * Math.floor(i / 4)) - (barrelSize * 1.15 * 2.6) - h * 0.03;

                    ctx.fillStyle = "rgb(127, 127, 127)";

                    if (barrels[i] === undefined && tempDrawnBarrels[i] === undefined || (barrels[i] !== undefined && barrels[i].scale < 1) && tempDrawnBarrels[i] === undefined)
                    {
                        ctx.drawImage(images.barrelTemplate, x - barrelSize / 2, y - barrelSize / 2, barrelSize, barrelSize);
                    }
                    if(!game.settings.lowPerformance && tempDrawnBarrels[i] !== undefined && (barrels[i] !== undefined && barrels[i].scale < 1))
                    {
                        Barrel.renderBarrel(ctx, tempDrawnBarrels[i], x, y, barrelSize);
                    }
                    if (barrels[i] !== undefined)
                    {
                        barrels[i].setCoord(x, y);
                        barrels[i].render(ctx);
                    }
                }

                if (draggedBarrel != null)
                {
                    draggedBarrel.setCoord(mouseX, mouseY);
                    draggedBarrel.render(ctx);
                }

                ctx.fillStyle = "black";
            },
            function ()
            {
                for (let i = 0; i < barrels.length; i++)
                {
                    let b = barrels[i];
                    if (b != null && b.isClicked())
                    {
                        draggedBarrel = b;
                        if (timeSinceLastBarrelClick <= 0.2 && lastClickedBarrel === i && game.settings.destroyBarrels)
                        {
                            barrels[i] = undefined;
                            draggedBarrel = undefined;
                            lastClickedBarrel = -1;
                        }
                        else
                        {
                            lastClickedBarrel = i;
                            timeSinceLastBarrelClick = 0;
                            draggedBarrel.originPos = i;
                            barrels[i] = undefined;
                        }
                    }
                }
            },
            function ()
            {
                if (draggedBarrel != null)
                {
                    let index = draggedBarrel.getDropIndex();
                    if (index !== -1)
                    {
                        let b = barrels[index];
                        if (b !== undefined)
                        {
                            let lvl = barrels[index].level;
                            if (Math.round(lvl) === Math.round(draggedBarrel.level))
                            {
                                tempDrawnBarrels[index] = draggedBarrel.level;
                                barrels[index] = new Barrel(draggedBarrel.level + 1);
                                onBarrelMerge(Math.round(draggedBarrel.level));
                                draggedBarrel = undefined;
                            }
                            else
                            {
                                barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                                barrels[draggedBarrel.originPos].scale = 0.7;
                                draggedBarrel = undefined;
                            }
                        }
                        else
                        {
                            barrels[index] = draggedBarrel;
                            draggedBarrel = undefined;
                        }
                    }
                    else
                    {
                        barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                        barrels[draggedBarrel.originPos].scale = 0.7;
                        draggedBarrel = undefined;
                    }
                }
            }),
        new Scene("MagnetUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),
                new UIText("Magnet Upgrades", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIMagnetUpgrade(game.magnetUpgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "Get More Scrap"),
                new UIMagnetUpgrade(game.magnetUpgrades.moreGoldenScrap, images.upgrades.goldenScrapBoost, 0.5, "Get More Golden Scrap", colors.table2),
                new UIMagnetUpgrade(game.magnetUpgrades.magnetMergeChance, images.upgrades.magnetChance, 0.6, "Increase the Chance to\nget Magnets by merging"),
                new UIGroup(
                    [
                        new UIMagnetUpgrade(game.magnetUpgrades.autoMerger, images.upgrades.fasterAutoMerge, 0.7, "Increase Auto Merge Speed", colors.table2)
                    ], () => game.milestones.achievements[6].isUnlocked()),
                new UIMagnetUpgrade(game.magnetUpgrades.brickSpeed, images.upgrades.brickSpeed, 0.8, "Less Merges are needed\nto double Brick\nproduction.", colors.table, () => applyUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed)),
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.magnets, images.magnet);
            }),
        new Scene("GoldenScrap",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.goldenScrap, () =>
                {
                    if (game.goldenScrap.getResetAmount().gt(0))
                    {
                        game.goldenScrap.reset();
                    }
                }, {quadratic: true}),
                new UIText("Golden Scrap", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => "Reset your Scrap Upgrades\nand current Scrap to get \n+" + formatNumber(game.goldenScrap.getResetAmount(), game.settings.numberFormatType, {namesAfter: 1e10}) + " Golden Scrap\n" +
                    "Each Golden Scrap yields +" + formatPercent(applyUpgrade(game.solarSystem.upgrades.mercury), 0) + " more Scrap.\n" +
                    "Click the Button below to reset.\n\n", 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.goldenScrap$" + formatNumber(game.goldenScrap.amount, game.settings.numberFormatType, {namesAfter: 1e10}) +
                    " → +" + formatPercent(game.goldenScrap.getBoost().sub(1), game.settings.numberFormatType, {namesAfter: 1e10}), 0.1, 0.38, 0.05, "black", {halign: "left", valign: "middle"}),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "Get More Scrap"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.75, "Get More Magnets", colors.table2),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "Get More GS"),
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors.table;
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("BarrelGallery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),
                new UIButton(0.25, 0.9, 0.1, 0.1, images.arrows.left, () => game.settings.barrelGalleryPage = Math.max(0, game.settings.barrelGalleryPage - 1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.75, 0.9, 0.1, 0.1, images.arrows.right, () =>
                {
                    game.settings.barrelGalleryPage = Math.min(game.barrelGallery.getMaxPage(), game.settings.barrelGalleryPage + 1);
                }, {
                    quadratic: true,
                    isVisible: () => game.settings.barrelGalleryPage < game.barrelGallery.getMaxPage()
                }),
                new UIButton(0.1, 0.9, 0.1, 0.1, images.arrows.left_2, () => game.settings.barrelGalleryPage = 0,
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.9, 0.9, 0.1, 0.1, images.arrows.right_2, () =>
                {
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
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                for(let i = 0; i < 4; i++)
                {
                    ctx.fillStyle = [colors.table, colors.bg][i % 2];
                    ctx.fillRect(0, h * 0.1875 + h * 0.15 * i, w, h * 0.15);
                }

                let maxLvl = Math.min(20 * game.settings.barrelGalleryPage + 20, Math.round(Barrel.getMaxLevelBarrel()) + 1);
                for (let i = 20 * game.settings.barrelGalleryPage; i < 20 * game.settings.barrelGalleryPage + 20; i++)
                {
                    let c = i - 20 * game.settings.barrelGalleryPage; //used for coordinates
                    let x = (0.15 + 0.7 * (c % 5) / 4) * w;
                    let y = h * 0.15 * Math.floor(c / 5) + h * 0.25;

                    let drawPreview = maxLvl <= i;

                    let size = Math.min(w * 0.19, h * 0.1);
                    Barrel.renderBarrel(ctx, i, x, y, size, drawPreview);

                    ctx.fillStyle = "black";
                    ctx.font = "bold " + (h * 0.025) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    if (!drawPreview)
                    {
                        ctx.fillText(formatNumber(Barrel.getIncomeForLevel(i)), x, y + h * 0.06, w * 0.15);
                    }
                }
            }),
        new Scene("SolarSystem",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),

                new UIButton(0.9, 0.1, 0.07, 0.07, images.scenes.mergeQuests, () => Scene.loadScene("MergeQuests"), {
                    quadratic: true,
                    isVisible: game.mergeQuests.isUnlocked
                }),
                new UIButton(0.9, 0.2, 0.07, 0.07, images.scenes.mergeMastery, () => Scene.loadScene("MergeMastery"), {
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
                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("OuterSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER
                }),

                new UIPlanet(0.5, 0.5, "Increase Scrap production", game.solarSystem.upgrades.sun, "$images.magnet$", images.solarSystem.sun, 0.13),
                new UIPlanet(0.7, 0.675, "Increase Golden\nScrap Boost", game.solarSystem.upgrades.mercury, "$images.magnet$", images.solarSystem.mercury, 0.035),
                new UIPlanet(0.3, 0.325, "Increase Double\nSpawn Chance", game.solarSystem.upgrades.venus, "$images.scrap$", images.solarSystem.venus, 0.055),
                new UIPlanet(0.65, 0.2, "Unlock new Stuff", game.solarSystem.upgrades.earth, "$images.goldenScrap$", images.solarSystem.earth, 0.055),
                new UIPlanet(0.2, 0.825, () => "Falling Magnets\n" + formatNumber(getMagnetBaseValue()
                    .mul(5)) + " each", game.solarSystem.upgrades.mars, "$images.magnet$", images.solarSystem.mars, 0.04, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS)
            ],
            function ()
            {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);

                if(!game.settings.lowPerformance)
                {
                    drawStars(50, 1);
                }
            }),
        new Scene("OuterSolarSystem",
            [
                new UIButton(0.1, 0.1, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIPlanet(0.4, 0.6, "Cheaper Magnet Upgrades", game.solarSystem.upgrades.jupiter, "$images.mergeToken$", images.solarSystem.jupiter, 0.075, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER),
                new UIPlanet(0.8, 0.7, "Auto Merge", game.solarSystem.upgrades.saturn, "$images.scrap$", images.solarSystem.saturn, 0.07, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_SATURN),
                new UIPlanet(0.8, 0.25, "Stronger Merge Mastery\nScrap Boost", game.solarSystem.upgrades.uranus, "$images.magnet$", images.solarSystem.uranus, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_URANUS),
                new UIPlanet(0.25, 0.3, "Passive Magnet income", game.solarSystem.upgrades.neptune, "$images.tire$", images.solarSystem.neptune, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NEPTUNE)
            ],
            function ()
            {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if(!game.settings.lowPerformance)
                {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.inner, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("MergeMastery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText("Merge Mastery", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup(
                    [
                        new UIButton(0.5, 0.9, 0.3, 0.07, images.buttonEmpty, () => game.mergeMastery.prestige.reset()),
                        new UIText("Prestige", 0.5, 0.9, 0.06, "black", {bold: true, valign: "middle"})
                    ], () => game.mergeMastery.level > 49)
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);
                let lvl = game.mergeMastery.level;

                ctx.fillStyle = "rgb(122, 180, 255)";
                ctx.fillRect(0, h * 0.2, w, h * 0.19);

                ctx.fillStyle = "rgb(122, 180, 255)";
                ctx.fillRect(0, h * (0.39 + 0.125), w, h * 0.125);

                //main
                ctx.fillStyle = "#000000a0";
                ctx.fillRect(0, h * 0.32, w, h * 0.05);
                ctx.fillStyle = colors.bgFront;
                ctx.fillRect(0, h * 0.32, w * (game.mergeMastery.currentMerges / game.mergeMastery.getNeededMerges(lvl)), h * 0.05);

                ctx.fillStyle = "white";
                ctx.font = (h * 0.05) + "px " + fonts.default;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(formatThousands(game.mergeMastery.currentMerges) + "/" + formatThousands(game.mergeMastery.getNeededMerges(lvl)), w / 2, h * 0.32);

                ctx.fillStyle = "black";
                ctx.font = "bold " + (h * 0.075) + "px " + fonts.default;
                ctx.fillText("Level " + game.mergeMastery.level, w / 2, h * 0.225);

                ctx.font = (h * 0.07) + "px " + fonts.default;
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                Barrel.renderBarrel(ctx, 0, w * 0.05 + h * 0.05, h * 0.45, h * 0.1);
                ctx.fillText("+" + formatPercent(game.mergeMastery.getScrapBoost(lvl).sub(1), 0), w * 0.3, h * 0.45, w * 0.68);
                ctx.drawImage(images.magnet, w * 0.05, h * 0.525, h * 0.1, h * 0.1);
                ctx.fillText("+" + formatNumber(game.mergeMastery.getMagnetBonus(lvl), game.settings.numberFormatType, {namesAfter: 1e10}), w * 0.3, h * 0.58, w * 0.68);

                ctx.font = (h * 0.025) + "px " + fonts.default;
                ctx.fillText("Scrap income", w * 0.3, h * 0.495);
                ctx.fillText("Magnets on Level Up", w * 0.3, h * 0.62);

                if (game.mergeMastery.level > 20 || game.mergeMastery.prestige.level > 0)
                {
                    ctx.fillStyle = colors.table;
                    ctx.fillRect(w * 0.1, h * 0.65, w * 0.8, h * 0.3);
                    ctx.font = "bold " + (h * 0.07) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    if (game.mergeMastery.level < 50 && game.mergeMastery.prestige.level === 0)
                    {
                        Utils.drawEscapedText(ctx, "Reach Level 50 to\nunlock Prestige", w * 0.5, h * 0.79, 0.04, w * 0.7);
                    }
                    else
                    {
                        let nextLvl = game.mergeMastery.prestige.level + Math.max(0, game.mergeMastery.level - 49);
                        let displayNext = nextLvl - game.mergeMastery.prestige.level > 0;

                        ctx.fillStyle = colors.table2;
                        ctx.fillRect(w * 0.18, h * 0.73, w * 0.64, h * 0.13);

                        ctx.fillStyle = "black";
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
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText("Bricks", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.9, 0.38, 0.05, 0.05, images.buttonMaxAll, () => game.bricks.maxUpgrades(), {quadratic: true, isVisible: () => game.bricks.amount.gte(1e100)}),
                new UIBrickUpgrade(game.bricks.upgrades.scrapBoost, images.upgrades.moreScrap, 0.5, "Get More Scrap"),
                new UIBrickUpgrade(game.bricks.upgrades.magnetBoost, images.upgrades.magnetBoost,  0.6, "Get More Magnets", colors.table2),
                new UIBrickUpgrade(game.bricks.upgrades.questLevels, images.upgrades.questLevels,  0.7, "Merge Quest Upgrades\nhave more Levels"),
                new UIBrickUpgrade(game.bricks.upgrades.brickBoost, images.upgrades.brickBoost,  0.8, "Get More Bricks", colors.table2),
                new UIBrickUpgrade(game.bricks.upgrades.questSpeed, images.upgrades.questSpeed,  0.9, "Complete and refresh\nMerge Quests faster")
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.bricks.amount, images.brick, -h * 0.025, 1.2);

                ctx.fillStyle = colors.table;
                ctx.fillRect(0, h * 0.28, w, h * 0.14);

                ctx.fillStyle = "black";
                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textAlign = "center";


                ctx.fillStyle = "rgb(66, 66, 66)";
                ctx.fillRect(0, h * 0.295, w, h * 0.05);
                ctx.fillStyle = colors.bgFront;
                ctx.fillRect(0, h * 0.295, w * (game.bricks.currentMergeProgress / game.bricks.mergesPerLevel()), h * 0.05);
                ctx.fillStyle = "white";
                ctx.fillText(formatThousands(game.bricks.currentMergeProgress) + " / " + formatThousands(game.bricks.mergesPerLevel()), w * 0.5, h * 0.3);
                ctx.fillStyle = "black";
                ctx.font = (h * 0.03) + "px " + fonts.default;
                ctx.fillText(formatNumber(game.bricks.getCurrentProduction()) + "/s → " + formatNumber(game.bricks.getProduction(game.bricks.productionLevel + 1)) + "/s", w * 0.5, h * 0.36);
            }),
        new Scene("Tires",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText("Tires", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup([
                    new UIRect(0.5, 0.6, 1, 0.2, colors.table2),
                    new UIImage(images.locked, 0.5, 0.58, 0.125, 0.125, {quadratic: true}),
                    new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[1]), 0.5, 0.67, 0.09, "black", {bold: true, valign: "middle"}),
                ],() => game.tires.amount.lt(game.tires.milestones[1])),
                new UIGroup([
                    new UIRect(0.5, 0.8, 1, 0.2, colors.table),
                    new UIImage(images.locked, 0.5, 0.78, 0.125, 0.125, {quadratic: true}),
                    new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[2]), 0.5, 0.87, 0.09, "black", {bold: true, valign: "middle"}),
                ],() => game.tires.amount.lt(game.tires.milestones[2])),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[0][0], images.upgrades.fasterBarrels, "Faster Barrels", 0.5 / 3, 0.4),
                    new UITireUpgrade(game.tires.upgrades[0][1], images.upgrades.brickSpeed, "Faster Brick\nLevel Up", 1.5 / 3, 0.4),
                    new UITireUpgrade(game.tires.upgrades[0][2], images.upgrades.fasterMastery, "Faster\nMerge Mastery", 2.5 / 3, 0.4)
                ]),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[1][0], images.upgrades.tireBoost, "Tire Value\nper Collect", 0.5 / 3, 0.6, colors.table2),
                    new UITireUpgrade(game.tires.upgrades[1][1], images.upgrades.tireChance, "Tire Chance\nper Merge", 1.5 / 3, 0.6, colors.table2),
                    new UITireUpgrade(game.tires.upgrades[1][2], images.upgrades.questSpeed, "Faster\nMerge Quests", 2.5 / 3, 0.6, colors.table2)
                ], () => game.tires.amount.gte(game.tires.milestones[1])),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[2][0], images.upgrades.fasterFallingMagnets, "Faster\nFalling Magnets", 0.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][1], images.upgrades.fasterAutoMerge, "Faster\nAuto Merge", 1.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][2], images.upgrades.goldenScrapBoost, "More\nGolden Scrap", 2.5 / 3, 0.8)
                ],() => game.tires.amount.gte(game.tires.milestones[2]))
            ],
            function()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.tires.amount, images.tire, -h * 0.025, 1.2);
            }),
        new Scene("Options",
            [
                new UIText("Options", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),

                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.barrelShadows","Toggle Barrel Shadows\n(can slow down Game)", colors.table),
                    new UIToggleOption(0.35, "game.settings.useCachedBarrels","Cache some Barrel Images\n(may slow down\nor speed up Game)", colors.bg),
                    new UIOption(0.45, images.options.barrelQuality, () =>
                    {
                        game.settings.barrelQuality = (++game.settings.barrelQuality) % 3;
                        setBarrelQuality(game.settings.barrelQuality, "Options");
                    }, () => "Barrel Quality: " + ["High", "Low", "Ultra Low"][game.settings.barrelQuality], colors.table),
                    new UIOption(0.55, images.options.numberFormat,() =>
                    {
                        game.settings.numberFormatType = (++game.settings.numberFormatType) % NUM_FORMAT_TYPES;
                    }, () =>
                    {
                        let fmtnmb = [];
                        for (let i = 6, j = 0; j < 4; i = (i + 3) * 1.25, j++)
                        {
                            fmtnmb.push(formatNumber(Decimal.pow(10, i)));
                        }
                        return "Switch Number format\n" + fmtnmb.join(", ");
                    }, colors.bg)
                ], () => game.settings.optionsPage === 0),
                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.destroyBarrels","Double Click Barrels to remove them", colors.table),
                    new UIToggleOption(0.35, "game.settings.resetConfirmation","Reset Confirmation", colors.bg),
                    new UIToggleOption(0.45, "game.settings.lowPerformance","Low performance Mode", colors.table)
                ],() => game.settings.optionsPage === 1),
                new UIButton(0.25, 0.65, 0.075, 0.075, images.arrows.left, () => game.settings.changeOptionsPage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage > 0
                    }),
                new UIButton(0.75, 0.65, 0.075, 0.075, images.arrows.right, () => game.settings.changeOptionsPage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage < 1
                    }),
                new UIButton(0.1, 0.89, 0.05, 0.05, images.logos.discord, () => location.href = "https://discord.gg/3T4CBmh", {quadratic: true}),
                new UIText("My Discord Server", 0.18, 0.89, 0.045, "black", {halign: "left", valign: "middle"}),
                new UIButton(0.1, 0.96, 0.05, 0.05, images.logos.youtube, () => location.href = "https://www.youtube.com/channel/UC7qnN9M1_PUqmrgOHQipC2Q", {quadratic: true}),
                new UIText("My Youtube Channel", 0.18, 0.96, 0.045, "black", {halign: "left", valign: "middle"}),
                new UIText("Libraries used:\nbreak_infinity\ngrapheme-splitter", 0.95, 0.99, 0.025, "black", {halign: "right", valign: "bottom"}),
                new UIText("Export and Import", 0.3, 0.825, 0.035, "black"),
                new UIButton(0.3, 0.775, 0.09, 0.09, images.exportImport, () => document.querySelector("div.absolute").style.display = "block", {quadratic: true}),
                new UIText("Play the Original", 0.7, 0.825, 0.035, "black"),
                new UIButton(0.7, 0.775, 0.09, 0.09, images.logos.scrap2, () => location.href = "https://play.google.com/store/apps/details?id=com.scrap.clicker.android&hl=gsw", {quadratic: true}),
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = colors.table;
                ctx.fillRect(0, h * 0.85, w, h * 0.15);
            }),
        new Scene("MergeQuests",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.scrapBoost, images.upgrades.moreScrap, 0.63, "Get More Scrap"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.goldenScrapBoost, images.upgrades.goldenScrapBoost, 0.73, "Get More Golden Scrap", colors.table2),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.83, "Get More Magnets"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, 0.93, "Falling Magnets are\nworth more", colors.table2, () => applyUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet)),

                new UIButton(0.84, 0.255, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[0].active)
                    {
                        game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[0].barrelLvl);
                        Scene.loadScene("Barrels");
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)}),
                new UIButton(0.84, 0.385, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[1].active)
                    {
                        game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[1].barrelLvl);
                        Scene.loadScene("Barrels");
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)}),
                new UIButton(0.84, 0.515, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[2].active)
                    {
                        game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[2].barrelLvl);
                        Scene.loadScene("Barrels");
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)})
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                for (let [idx, q] of game.mergeQuests.quests.entries())
                {
                    q.render(ctx, w * 0.15, h * (0.225 + 0.13 * idx));
                }
            }, null, null),
        new Scene("Milestones",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),
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
                new UIText(() => game.milestones.unlocked.length + " / " + game.milestones.achievements.length, 0.5, 0.15, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.003,
                    font: fonts.title
                })
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);

                let perRow = 5; //achievements per row
                let maxTrophies = game.milestones.achievements.length;

                ctx.font = "bold " + (h * 0.06) + "px " + fonts.default;
                ctx.fillStyle = "black";

                ctx.fillStyle = colors.table;
                ctx.fillRect(0, h * 0.2, w, w);
                for (let i = 25 * game.milestones.page; i < Math.min(25 * game.milestones.page + 25, maxTrophies); i++)
                {
                    let tSize = w / perRow;
                    let x = tSize * (i % perRow);
                    let y = h * 0.2 + tSize * Math.floor((i - 25 * game.milestones.page) / perRow);
                    let iid = game.milestones.achievements[i].imageId;
                    let iX = 256 * (iid % 10);
                    let iY = 256 * Math.floor(iid / 10);
                    ctx.drawImage(game.milestones.unlocked.includes(i) ? images.achievements.unlocked : images.achievements.locked, iX, iY, 256, 256, x, y, tSize, tSize);
                    if(i === game.milestones.highlighted)
                    {
                        ctx.drawImage(images.highlightedSlot, x, y, tSize, tSize);
                    }
                    ctx.fillStyle = game.milestones.unlocked.includes(i) ? game.milestones.achievements[i].fontColor : "white";
                    ctx.lineWidth = 0;
                }

                if(game.milestones.tooltip !== null)
                {
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
            function ()
            {
                let perRow = 5;
                let clickedMileStone = Math.floor(mouseX / w * perRow) + perRow * Math.floor((mouseY - h * 0.2) / w * perRow) + 25 * game.milestones.page;
                if(clickedMileStone >= 25 * game.milestones.page && clickedMileStone < Math.min(25 * game.milestones.page + 25, game.milestones.achievements.length))
                {
                    game.milestones.highlighted = clickedMileStone;
                    if(game.milestones.tooltip === clickedMileStone)
                    {
                        game.milestones.tooltip = null;
                    }
                    else
                    {
                        game.milestones.tooltip = clickedMileStone;
                    }
                }
                else
                {
                    game.milestones.tooltip = null;
                }
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
                    new UIRect(0.5, 0.4, 1, 0.4, colors.table),
                    new UIRect(0.5, 0.7, 1, 0.3, colors.table2),
                    new UIRect(0.5, 1.0, 1, 0.3, colors.table),
                    new UIRect(0.5, 1.3, 1, 0.3, colors.table2),

                    new UISkillTreePath(0.5, 0.4, 0.2, 0.65, 0.01, colors.skillTreePath, game.skillTree.upgrades.scrapBoost),
                    new UISkillTreePath(0.5, 0.4, 0.8, 0.65, 0.01, colors.skillTreePath, game.skillTree.upgrades.scrapBoost),

                    new UISkillTreePath(0.2, 0.65, 0.2, 0.95, 0.01, colors.skillTreePath, game.skillTree.upgrades.brickBoost),
                    new UISkillTreePath(0.2, 0.65, 0.5, 0.95, 0.01, colors.skillTreePath, [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),
                    new UISkillTreePath(0.8, 0.65, 0.5, 0.95, 0.01, colors.skillTreePath, [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),

                    new UISkillTreePath(0.2, 0.95, 0.2, 1.25, 0.01, colors.skillTreePath, game.skillTree.upgrades.tireBoost),
                    new UISkillTreePath(0.5, 0.95, 0.5, 1.25, 0.01, colors.skillTreePath, game.skillTree.upgrades.magnetUpgBrickSpeed),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost, images.upgrades.moreScrap, "More Scrap", 0.5, 0.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.brickBoost, images.upgrades.brickBoost, "More Bricks", 0.2, 0.65, colors.table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet, images.upgrades.fasterFallingMagnets, "Merge Quests\nUpgrade:\nFalling Magnets", 0.8, 0.65, colors.table2),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost, images.upgrades.tireBoost, "Get more\nxTires per\ncollect", 0.2, 0.95),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed, images.upgrades.brickSpeed, "Magnet\nUpgrade:\nBrick Speed", 0.5, 0.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost2, images.upgrades.moreScrap2, "More Scrap 2", 0.2, 1.25, colors.table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.ezUpgraderQuests, images.ezUpgrade, "EZ Upgrader\nfor Merge\nQuests", 0.5, 1.25, colors.table2),
                ], 0, 0.2, 1, 0.8, () => true, {ymin: 0, ymax: 1.45})
            ],
            function ()
            {
                ctx.fillStyle = colors.bg;
                ctx.fillRect(0, 0, w, h);
            })
    ];
