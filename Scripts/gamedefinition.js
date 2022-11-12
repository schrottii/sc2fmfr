var game =
    {
        scrap: new Decimal(0),
        scrapThisPrestige: new Decimal(0),
        highestScrapReached: new Decimal(0),
        highestBarrelReached: 0,
        magnets: new Decimal(0),
        remainderMagnets: 0,
        goldenScrap:
            {
                amount: new Decimal(0),
                upgrades:
                    {
                        scrapBoost: new GoldenScrapUpgrade(
                            level =>
                            {
                                let m = [500, 1000, 1500, 2000, 3000, 4500, 6000, 8000, 30e3, 100e3, 1e6, 10e6, 1e9];
                                return new Decimal(m[Math.min(level, m.length - 1)]).mul(Decimal.pow(10, Math.max(0, level - m.length + 1)))
                                                                                    .mul(Decimal.pow(2, Math.max(0, level - m.length - 1 + 1)))
                                                                                    .mul(Decimal.pow(2, Math.pow(Math.max(0, level - 17), 1.3)))
                                                                                    .mul(Decimal.pow(3, Math.pow(Math.max(0, level - 21), 1.3)));
                            },
                            level =>
                            {
                                let m = [1, 2, 5, 15, 40, 100, 300, 800, 2500, 10e3, 30e3, 75e3, 200e3, 1e6];
                                return new Decimal(m[Math.min(level, m.length - 1)]).mul(Decimal.pow(10, Math.max(0, level - m.length + 1)));
                            },
                            {
                                maxLevel: 50,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(0)
                            }),
                        magnetBoost: new GoldenScrapUpgrade(
                            level => Decimal.pow(1.1, level).mul(200).add(50 * level),
                            level => new Decimal(1 + 0.1 * level).mul(Decimal.pow(1.02, Math.max(0, level - 40))),
                            {
                               getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x", "", { namesAfter: 1e9 })
                            }),
                        gsBoost: new GoldenScrapUpgrade(
                            level => Decimal.pow(1.8, level).mul(200).add(50 * level),
                            level => new Decimal(1 + 0.2 * (Math.max(10, level)/10) * level),
                            {
                                maxLevel: 30,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x", "", { namesAfter: 1e9 })
                            })
                    },
                getResetAmount: function ()
                {
                    if (game.scrapThisPrestige.lte(new Decimal(1e15)))
                    {
                        return new Decimal(0);
                    }
                    let base = Decimal.floor(Decimal.pow(Decimal.log10(game.scrapThisPrestige) - 14, 1.5).mul(10))
                                      .add(25);
                    return base.mul(Decimal.pow(1.1, Math.max(0, Decimal.log10(game.scrapThisPrestige) - 27)))
                               .mul(applyUpgrade(game.magnetUpgrades.moreGoldenScrap))
                               .mul(applyUpgrade(game.mergeQuests.upgrades.goldenScrapBoost))
                               .mul(game.mergeMastery.prestige.currentGSBoost())
                               .mul(applyUpgrade(game.tires.upgrades[2][2])).add(55)
                               .mul(applyUpgrade(game.goldenScrap.upgrades.gsBoost));
                },
                reset: function ()
                {
                    if (!game.settings.resetConfirmation || confirm("Do you want to reset for " + formatNumber(game.goldenScrap.getResetAmount()) + " Golden Scrap?"))
                    {
                        game.goldenScrap.amount = game.goldenScrap.amount.add(game.goldenScrap.getResetAmount());
                        for (let i = 0; i < barrels.length; i++)
                        {
                            barrels[i] = undefined;
                        }
                        draggedBarrel = undefined;
                        game.scrap = new Decimal(0);
                        game.scrapThisPrestige = new Decimal(0);
                        for (let upg of Object.keys(game.scrapUpgrades))
                        {
                            game.scrapUpgrades[upg].level = 0;
                        }
                        game.settings.barrelGalleryPage = 0;
                        Scene.loadScene("Barrels");
                    }
                },
                getBoost: function ()
                {
                    return applyUpgrade(game.solarSystem.upgrades.mercury).mul(game.goldenScrap.amount).add(1);
                }
            },
        scrapUpgrades:
            {
                betterBarrels: new ScrapUpgrade(
                    level =>
                    {
                        let pow =
                            [
                                Decimal.pow(2, Math.min(10, level)),
                                Decimal.pow(4, Math.max(0, level - 10)),
                                Decimal.pow(2, Math.ceil(Math.max(0, level - 29) / 10)),
                                Decimal.pow(2, Math.ceil(Math.max(0, level - 54) / 10)),
                                Decimal.pow(1.2, Math.max(0, level - 500)),
                                Decimal.pow(1.2, Math.max(0, level - 1250)),
                                Decimal.pow(1.2, Math.max(0, level - 2500)),
                                Decimal.pow(1.2, Math.max(0, level - 5000))
                            ];

                        let result = new Decimal(25000);
                        for (let d of pow)
                        {
                            result = result.mul(d);
                        }
                        return result;
                    },
                    level => new Decimal(level),
                    {
                        onBuy: function ()
                        {
                            for (let i = 0; i < barrels.length; i++)
                            {
                                if (barrels[i] !== undefined && barrels[i].level < applyUpgrade(this).toNumber() + 1)
                                {
                                    barrels[i] = new Barrel(applyUpgrade(this).toNumber() + 1);
                                }
                            }
                        },
                        onLevelDown: function(level)
                        {
                            for (let i = 0; i < barrels.length; i++)
                            {
                                barrels[i] = new Barrel(level);
                            }
                        },
                        maxLevel: 5000
                    }),
                fasterBarrels: new ScrapUpgrade(
                    level =>
                    {
                        let pow = Decimal.pow(5, Math.max(0, level - 25));
                        let pow2 = Decimal.pow(5, Math.max(0, level - 100));
                        return Decimal.pow(5, level).mul(pow).mul(pow2).mul(10000)
                    },
                    level => new Decimal(2.5 / (1 + 0.1 * level)).mul(applyUpgrade(game.tires.upgrades[0][0])),
                    {
                        getEffectDisplay: function ()
                        {
                            let s = this.getEffect(this.level).toNumber();
                            if (s > 0.5)
                            {
                                return s.toFixed(2) + "s";
                            }
                            if (s > 0.01)
                            {
                                return (s * 1000).toFixed(0) + "ms";
                            }
                            if (s > 0.001)
                            {
                                return (s * 1000).toFixed(2) + "ms";
                            }
                            if (s > 0.00001)
                            {
                                return (s * 1000000).toFixed(0) + "µs";
                            }
                            return "Insanely fast!";
                        }
                    })
            },
        magnetUpgrades:
            {
                scrapBoost: new MagnetUpgrade(
                    level => Utils.roundBase(new Decimal(10 + 5 * level).mul(Decimal.pow(1.1, Math.max(0, level - 10))), 1)
                                  .mul(applyUpgrade(game.solarSystem.upgrades.jupiter)),
                    level => new Decimal(1 + 0.2 * level).mul(Decimal.pow(1.2, Math.max(0, level - 10))),
                    {
                        getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x")
                    }),
                moreGoldenScrap: new MagnetUpgrade(
                    level => Utils.roundBase(new Decimal(30 + 10 * level).mul(Decimal.pow(1.07, Math.max(0, level - 20))), 1)
                                  .mul(applyUpgrade(game.solarSystem.upgrades.jupiter)),
                    level => new Decimal(1 + 0.3 * level),
                    {
                        getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x")
                    }),
                magnetMergeChance: new MagnetUpgrade(
                    level => new Decimal(10 + level * level).mul(Decimal.pow(2, Math.max(0, level - 20)))
                                                            .mul(applyUpgrade(game.solarSystem.upgrades.jupiter)),
                    level => new Decimal(0.01 + 0.001 * level),
                    {
                        getEffectDisplay: effectDisplayTemplates.percentStandard(1),
                        maxLevel: () => 20 + (game.solarSystem.upgrades.earth.level >= EarthLevels.MAGNET_3_LEVELS ? 20 : 0)
                    }),
                autoMerger: new MagnetUpgrade(
                    level => new Decimal(100).mul(Decimal.pow(1.3, level))
                                             .mul(applyUpgrade(game.solarSystem.upgrades.jupiter)),
                    level => new Decimal(1 + 0.05 * level),
                    {
                        getEffectDisplay: effectDisplayTemplates.percentStandard(0),
                        maxLevel: 30
                    }),
                brickSpeed: new MagnetUpgrade(
                    level => new Decimal(1e12).mul(Decimal.pow(2, level))
                                  .mul(applyUpgrade(game.solarSystem.upgrades.jupiter)),
                    level => new Decimal(1 / (1 + 0.02 * level)),
                    {
                        getEffectDisplay: effectDisplayTemplates.percentStandard(1),
                        maxLevel: 75
                    })
            },
        solarSystem:
            {
                upgrades:
                    {
                        sun: new MagnetUpgrade(
                            level => new Decimal(100 + 50 * level).mul(Decimal.pow(1.25, Math.floor(level / 50))),
                            level => Decimal.pow(1 + 0.1 * level, 10),
                            {
                                maxLevel: 5000,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x", "", {namesAfter: 1e12})
                            }
                        ),
                        mercury: new MagnetUpgrade(
                            level => new Decimal(100 + 75 * level).mul(Decimal.pow(1.1, Math.max(0, level - 20))),
                            level => new Decimal(0.01 + 0.01 * level),
                            {
                                maxLevel: 999,
                                getEffectDisplay: effectDisplayTemplates.percentStandard(0)
                            }
                        ),
                        venus: new ScrapUpgrade(
                            level => Decimal.pow(10, 50 + level * 5),
                            level => new Decimal((1 - Math.pow(19 / 20, Math.max(0, level - 1))) * 0.3 + (level > 0 ? 0.2 : 0)),
                            {
                                getEffectDisplay: effectDisplayTemplates.percentStandard(1)
                            }
                        ),
                        earth: new GoldenScrapUpgrade(
                            level => new Decimal([1e5, 250e9, 2e12, 10e12, 50e12, 1e17, 1e24, 5e24, 7.7777e25][level]),
                            level => ["Nothing", "Buy Max", "Mars", "+20 Levels for\n3rd Magnet Upgrade",
                                "Jupiter", "Saturn", "Uranus", "Neptune", "The Skill Tree", "+200 Levels for\n3rd Brick Upgrade"][level],
                            {
                                maxLevel: 9,
                                getEffectDisplay: function ()
                                {
                                    if (this.level === this.maxLevel)
                                    {
                                        return "Unlocked everything!";
                                    }
                                    return "Unlock " + this.getEffect(this.level + 1);
                                }
                            }
                        ),
                        mars: new MagnetUpgrade(
                            level => new Decimal(50000).mul(Decimal.pow(2, level)),
                            level => new Decimal(180 / (1 + 0.2 * level)).mul(applyUpgrade(game.tires.upgrades[2][0])),
                            {
                                maxLevel: 10,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(0, "", "s")
                            }
                        ),
                        jupiter: new MergeTokenUpgrade(
                            level => Decimal.min(10, level + 3),
                            level => Decimal.pow(0.85, level),
                            {
                                maxLevel: 25,
                                getEffectDisplay: effectDisplayTemplates.percentStandard(1)
                            }
                        ),
                        saturn: new ScrapUpgrade(
                            level => Decimal.pow(64, Math.pow(level, 1.25)).mul(1e183),
                            level => Decimal.pow(0.9675, level).mul(2).mul(applyUpgrade(game.tires.upgrades[2][1]))
                                            .div(applyUpgrade(game.magnetUpgrades.autoMerger)),
                            {
                                maxLevel: 40,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(2, "", "s")
                            }
                        ),
                        uranus: new MagnetUpgrade(
                            level => Utils.roundBase(Decimal.pow(3, level).mul(1e9), 1),
                            level => new Decimal(1 + 0.25 * level),
                            {
                                maxLevel: 16,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(2, "x^")
                            }
                        ),
                        neptune: new TireUpgrade(
                            level => Decimal.pow(1e15, level * Math.pow(1.4, level)).mul(new Decimal("1e500")),
                            level => new Decimal(0.01 * level).mul(getMagnetBaseValue()), {
                                maxLevel: 10,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(0, "+", "/s")
                            }
                        )
                    }
            },
        mergeQuests:
            {
                isUnlocked: () => game.highestScrapReached.gte(1e93),
                quests: [new MergeQuest(300, [0, 1, 2]), new MergeQuest(450, [0, 1, 2, 3]), new MergeQuest(600, [2, 3, 4])],
                mergeTokens: new Decimal(0),
                upgrades:
                    {
                        scrapBoost: new MergeTokenUpgrade(level => Decimal.min(5, 1 + Math.floor(level / 4))
                                                                          .add(Utils.clamp(Math.floor(level / 100) - 1, 0, 5)),
                            level => Decimal.pow(1.2, level),
                            {
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1),
                                maxLevel: () => 100 + applyUpgrade(game.bricks.upgrades.questLevels)
                            }),
                        goldenScrapBoost: new MergeTokenUpgrade(level => Decimal.min(10, 2 + 2 * Math.floor(level / 4)),
                            level => new Decimal(1 + level * 0.3 + Math.max(level - 20, 0) * 0.4).mul(Decimal.pow(1.01, Math.max(0, level - 100))),
                            {
                                getEffectDisplay: effectDisplayTemplates.percentStandard(0),
                                maxLevel: () => 75 + applyUpgrade(game.bricks.upgrades.questLevels)
                            }),
                        magnetBoost: new MergeTokenUpgrade(level => Decimal.min(10, 3 + 2 * Math.floor(level / 4)),
                            level => Decimal.pow(1.05, Utils.clamp(level, 0, 150))
                                            .mul(Decimal.pow(1.02, Math.max(level - 150, 0))),
                            {
                                getEffectDisplay: effectDisplayTemplates.numberStandard(2),
                                maxLevel: () => 50 + applyUpgrade(game.bricks.upgrades.questLevels)
                            }),
                        fallingMagnetValue: new MergeTokenUpgrade(level => new Decimal(15),
                                level => new Decimal(1 * level), {
                                getEffectDisplay: effectDisplayTemplates.numberStandard(2),
                                maxLevel: 8
                            })
                    }
            },
        mergeMastery:
            {
                isUnlocked: () => game.highestScrapReached.gte(1e153),
                level: 0,
                currentMerges: 0,
                getNeededMerges: level => Math.round((100 + 10 * level) * applyUpgrade(game.tires.upgrades[0][2])
                    .toNumber()),
                getScrapBoost: level => new Decimal(1 + 0.05 * level).pow(applyUpgrade(game.solarSystem.upgrades.uranus)),
                getMagnetBonus: level => Decimal.round(getMagnetBaseValue().mul(2 + 0.25 * level)),
                check: () =>
                {
                    if (game.mergeMastery.currentMerges >= game.mergeMastery.getNeededMerges(game.mergeMastery.level))
                    {
                        game.mergeMastery.levelUp();
                    }
                },
                levelUp: () =>
                {
                    game.magnets = game.magnets.add(game.mergeMastery.getMagnetBonus(game.mergeMastery.level));
                    game.mergeMastery.currentMerges = 0;
                    if (game.mergeMastery.getNeededMerges(game.mergeMastery.level) >= 75)
                    {
                        GameNotification.create(new MasteryLevelUpNotification(game.mergeMastery.level));
                    }
                    game.mergeMastery.level++;
                },
                prestige:
                    {
                        level: 0,
                        reset: () =>
                        {
                            if (game.mergeMastery.level > 50)
                            {
                                game.mergeMastery.prestige.level += game.mergeMastery.level - 49;
                                game.mergeMastery.level = 0;
                                game.mergeMastery.currentMerges = 0;
                            }
                        },
                        getGoldenScrapBoost: level => new Decimal(1 + 0.02 * level),
                        currentGSBoost: () => game.mergeMastery.prestige.getGoldenScrapBoost(game.mergeMastery.prestige.level),
                        getMagnetBoost: level => new Decimal(1 + 0.01 * level),
                        currentMagnetBoost: () => game.mergeMastery.prestige.getMagnetBoost(game.mergeMastery.prestige.level)
                    }
            },
        bricks:
            {
                amount: new Decimal(0),
                productionLevel: 0,
                currentMergeProgress: 0,
                mergesPerLevel: () => Math.round(250 * applyUpgrade(game.tires.upgrades[0][1]).toNumber() * applyUpgrade(game.magnetUpgrades.brickSpeed).toNumber()),
                isUnlocked: () => game.highestScrapReached.gte(1e213),
                getProduction: level =>
                {
                    if (level === 0)
                    {
                        return new Decimal(0);
                    }
                    return Decimal.pow(2, level - 1)
                                  .mul(applyUpgrade(game.bricks.upgrades.brickBoost))
                                  .mul(applyUpgrade(game.skillTree.upgrades.brickBoost));
                },
                getCurrentProduction: () =>
                {
                    return game.bricks.getProduction(game.bricks.productionLevel);
                },
                check: function ()
                {
                    if (game.bricks.currentMergeProgress >= game.bricks.mergesPerLevel())
                    {
                        game.bricks.productionLevel++;
                        game.bricks.currentMergeProgress = 0;
                    }
                },
                onMerge: function ()
                {
                    game.bricks.currentMergeProgress++;
                    game.bricks.check();
                },
                upgrades:
                    {
                        scrapBoost: new BrickUpgrade(level => Decimal.pow(8, level + Math.pow(Math.max(0, level - 50), 1.2))
                                                                     .mul(100)
                                                                     .pow(1 + 0.001 * Math.max(0, level - 10000)),
                            level => Decimal.pow(1.1, level),
                            {
                                maxLevel: 100000,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1)
                            }),
                        magnetBoost: new BrickUpgrade(level => (Decimal.pow(32, level + Math.pow(0.75 * Math.max(0, level - 50), 1.25))
                                                                       .mul(100e3)).pow(Decimal.pow(1.01, Math.max(0, level - 250))),
                            level => Decimal.pow(1.025, level),
                            {
                                getEffectDisplay: effectDisplayTemplates.numberStandard(2)
                            }),
                        questLevels: new BrickUpgrade(level => Decimal.pow(1e6, level + Math.pow(Math.max(level - 100, 0), 1.2))
                                                                      .mul(1e9),
                            level => level,
                            {
                                maxLevel: () => 100 + (game.solarSystem.upgrades.earth.level >= EarthLevels.BRICK_3_LEVELS ? 200 : 0),
                                getEffectDisplay: effectDisplayTemplates.numberStandard(0, "+")
                            }),
                        brickBoost: new BrickUpgrade(level => Decimal.pow(64, Math.pow(level, 1.1)).mul(1e12),
                            level => Decimal.pow(4, level),
                            {
                                maxLevel: 100000,
                                getEffectDisplay: effectDisplayTemplates.numberStandard(0)
                            }),
                        questSpeed: new BrickUpgrade(level => Decimal.pow(1e10, level).mul(1e100),
                            level => new Decimal(1 - 0.01 * level),
                            {
                                maxLevel: 50,
                                afterBuy: function ()
                                {
                                    for (let q of game.mergeQuests.quests)
                                    {
                                        q.check(-1); //refresh to prevent overflow of merges
                                    }
                                },
                                getEffectDisplay: effectDisplayTemplates.percentStandard(0)
                            })
                    },
                maxUpgrades: function ()
                {
                    for (k in game.bricks.upgrades)
                    {
                        let upg = game.bricks.upgrades[k];
                        while (upg.currentPrice().lte(game.bricks.amount) && upg.level < upg.getMaxLevel())
                        {
                            upg.buy();
                        }
                    }
                }
            },
        tires:
            {
                amount: new Decimal(0),
                value: new Decimal(1),
                isUnlocked: () => game.highestBarrelReached >= 499,
                getCombinedRowLevel: arr =>
                {
                    let lvl = 0;
                    for (let upg of arr)
                    {
                        lvl += upg.level;
                    }
                    return lvl;
                },
                onMerge: () =>
                {
                    if (Math.random() < applyUpgrade(game.tires.upgrades[1][1])) {
                        movingItemFactory.jumpingTire();
                    }
                },
                milestones: [new Decimal(0), new Decimal(1e63), Decimal.pow(2, 1024)],
                getLevelBias: level => Math.pow(Math.max(level - 100, 0), 1.7),
                upgrades:
                    [
                        [ //faster barrels, faster Brick level up, faster Merge Mastery
                            new TireUpgrade(level => Decimal.pow(4, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[0]) / 2, 1.2) + game.tires.getLevelBias(level))
                                                            .mul(10),
                                level => new Decimal(1 / (1 + 0.03 * level)),
                                {
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1)
                                }),
                            new TireUpgrade(level => Decimal.pow(4, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[0]) / 2, 1.2) + game.tires.getLevelBias(level))
                                                            .mul(100),
                                level => new Decimal(1 / (1 + 0.01 * level)),
                                {
                                    maxLevel: 1000,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1),
                                    afterBuy: () => game.bricks.check()
                                }),
                            new TireUpgrade(level => Decimal.pow(4, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[0]) / 2, 1.2) + game.tires.getLevelBias(level))
                                                            .mul(1000),
                                level => new Decimal(1 / (1 + 0.01 * level)),
                                {
                                    maxLevel: 1000,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1),
                                    afterBuy: () => game.mergeMastery.check()
                                })
                        ],
                        [ //more xTires per collect, Tire chance, faster Merge Quests
                            new TireUpgrade(level => Decimal.pow(32, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[1]) / 2, 1.35) + game.tires.getLevelBias(level))
                                                            .mul(10e63),
                                level => new Decimal(1.3 + 0.05 * level + 0.01 * Math.pow(Math.max(level - 70, 0), 2)).pow(applyUpgrade(game.skillTree.upgrades.tireBoost)),
                                {
                                    getEffectDisplay: effectDisplayTemplates.numberStandard(2)
                                }),
                            new TireUpgrade(level => Decimal.pow(32, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[1]) / 2, 1.35) + game.tires.getLevelBias(level))
                                                            .mul(10e66),
                                level => new Decimal(0.005 * (1 + 0.02 * level)),
                                {
                                    maxLevel: 50,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(2)
                                }),
                            new TireUpgrade(level => Decimal.pow(32, Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[1]) / 2, 1.35) + game.tires.getLevelBias(level))
                                                            .mul(10e69),
                                level => new Decimal(1 / (1 + 0.005 * level)), {
                                    maxLevel: 100,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1),
                                    afterBuy: function ()
                                    {
                                        for (let q of game.mergeQuests.quests)
                                        {
                                            q.check(-1); //refresh to prevent overflow of merges
                                        }
                                    }
                                }),
                        ],
                        [ //faster falling Magnets, faster Auto Merge, more GS
                            new TireUpgrade(level => Decimal.pow(Math.pow(2, 15), Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[2]) / 2, 1.45) + game.tires.getLevelBias(level))
                                                            .mul(Decimal.pow(2, 1034)),
                                level => Decimal.pow(0.99, level), {
                                    maxLevel: 50,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1)
                                }),
                            new TireUpgrade(level => Decimal.pow(Math.pow(2, 15), Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[2]) / 2, 1.45) + game.tires.getLevelBias(level))
                                                            .mul(Decimal.pow(2, 1134)),
                                level => Decimal.pow(0.99, level),
                                {
                                    maxLevel: 50,
                                    getEffectDisplay: effectDisplayTemplates.percentStandard(1)
                                }),
                            new TireUpgrade(level => Decimal.pow(Math.pow(2, 15), Math.pow(level / 2 + game.tires.getCombinedRowLevel(game.tires.upgrades[2]) / 2, 1.45) + game.tires.getLevelBias(level))
                                                            .mul(Decimal.pow(2, 1234)),
                                level => new Decimal(1 + 0.1 * level + 0.01 * level * level),
                                {
                                    getEffectDisplay: effectDisplayTemplates.numberStandard(1)
                                }),
                        ]
                    ]
            },
        skillTree:
            {
                isUnlocked: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SKILL_TREE,
                upgrades:
                    {
                        scrapBoost: new SkillTreeUpgrade(level => Decimal.pow(10, 363 + 21 * level),
                            level => Utils.roundBase(Decimal.pow(24, level), 0),
                            {
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1),
                                maxLevel: 50
                            }),
                        brickBoost: new SkillTreeUpgradeFixed([
                                [[new Decimal("1e666"), RESOURCE_TIRE]],
                                [[new Decimal("1e1111"), RESOURCE_TIRE], [new Decimal("1e400"), RESOURCE_SCRAP]],
                                [[new Decimal("1e1666"), RESOURCE_TIRE], [new Decimal("1e420"), RESOURCE_SCRAP]],
                                [[new Decimal("1e2666"), RESOURCE_TIRE], [new Decimal("1e450"), RESOURCE_SCRAP]],
                                [[new Decimal("1e3666"), RESOURCE_TIRE], [new Decimal("1e490"), RESOURCE_SCRAP]],
                                [[new Decimal("1e4992"), RESOURCE_TIRE], [new Decimal("1e550"), RESOURCE_SCRAP], [new Decimal("2.424e24"), RESOURCE_GS]]
                            ],
                            [new Decimal(1), Decimal.pow(2, 127), Decimal.pow(2, 255), Decimal.pow(2, 511), Decimal.pow(2, 1024), Decimal.pow(2, 2048), Decimal.pow(2, 4096)],{
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1)
                            }, ["scrapBoost"]),
                        tireBoost: new SkillTreeUpgradeFixed([
                                [[new Decimal("1e2001"), RESOURCE_TIRE], [new Decimal("1e903"), RESOURCE_BRICK]],
                                [[new Decimal("1e4002"), RESOURCE_TIRE], [new Decimal("1e1503"), RESOURCE_BRICK]],
                                [[new Decimal("1e6003"), RESOURCE_TIRE], [new Decimal("1e2103"), RESOURCE_BRICK]],
                                [[new Decimal("1e10002"), RESOURCE_TIRE], [new Decimal("1e4002"), RESOURCE_BRICK]]
                            ],
                            [new Decimal(1), new Decimal(1.1), new Decimal(1.2), new Decimal(1.3), new Decimal(1.5)],{
                                getEffectDisplay: effectDisplayTemplates.numberStandard(1, "x^")
                            }, ["brickBoost"]),
                        mergeQuestUpgFallingMagnet: new SkillTreeUpgradeFixed([
                            [[new Decimal(20), RESOURCE_MERGE_TOKEN]]
                        ], [false, true], {
                            getEffectDisplay: effectDisplayTemplates.unlock()
                        }, ["scrapBoost"]),
                        magnetUpgBrickSpeed: new SkillTreeUpgradeFixed([
                            [[new Decimal(1e12), RESOURCE_MAGNET], [new Decimal(25), RESOURCE_MERGE_TOKEN]]
                        ], [false, true], {
                            getEffectDisplay: effectDisplayTemplates.unlock()
                        }, ["mergeQuestUpgFallingMagnet", "brickBoost"]),
                        ezUpgraderQuests: new SkillTreeUpgradeFixed([
                            [[new Decimal(30), RESOURCE_MERGE_TOKEN]]
                        ], [false, true], {
                            getEffectDisplay: effectDisplayTemplates.unlock()
                        }, ["magnetUpgBrickSpeed"]),
                    scrapBoost2: new SkillTreeUpgrade(level => Decimal.pow(10, 600 + 200 * level),/*[
                        [[new Decimal("10"), RESOURCE_MERGE_TOKEN], [new Decimal("1e1000"), RESOURCE_BRICK]],
                        [[new Decimal("15"), RESOURCE_MERGE_TOKEN], [new Decimal("1e1250"), RESOURCE_BRICK]],
                        [[new Decimal("20"), RESOURCE_MERGE_TOKEN], [new Decimal("1e1500"), RESOURCE_BRICK]],
                        [[new Decimal("25"), RESOURCE_MERGE_TOKEN], [new Decimal("1e1750"), RESOURCE_BRICK]],
                        [[new Decimal("50"), RESOURCE_MERGE_TOKEN], [new Decimal("1e2500"), RESOURCE_BRICK]],

                        [[new Decimal("1e2000"), RESOURCE_TIRE], [new Decimal("1e500"), RESOURCE_SCRAP]],
                        [[new Decimal("1e6000"), RESOURCE_TIRE], [new Decimal("1e600"), RESOURCE_SCRAP]],
                        [[new Decimal("1e10000"), RESOURCE_TIRE], [new Decimal("1e700"), RESOURCE_SCRAP]],
                        [[new Decimal("1e20000"), RESOURCE_TIRE], [new Decimal("1e800"), RESOURCE_SCRAP]],
                        [[new Decimal("1e30000"), RESOURCE_TIRE], [new Decimal("1e1000"), RESOURCE_SCRAP]]
                        ],*/
                        level => Utils.roundBase(Decimal.pow(1000, level+5), 0),/*
                        [new Decimal(1e1), new Decimal(1e2), new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e10), new Decimal(1e15), new Decimal(1e20), new Decimal(1e25), new Decimal(1e60)],
                        */
                        {
                            getEffectDisplay: effectDisplayTemplates.numberStandard(1),
                            maxLevel: 10
                        }, ["tireBoost"]),

                    }
            },
        milestones:
            {
                achievements:
                    [
                        new Milestone("Noob", 1, "Reach 1,000 Scrap", () => game.highestScrapReached.gte(1000)),
                        new Milestone("Magnet", 2, "Get your first Magnet", () => game.magnets.gte(1)),
                        new Milestone("OMG so rich", 1, "Reach 1,000,000,000 Scrap", () => game.highestScrapReached.gte(1000000000)),
                        new Milestone("Time to Retire!", 4, () => "Reach " + formatNumber(1e15) + " Scrap to be able to\nReset to get Golden Scrap.\nEach Golden Scrap Boosts Scrap\nProduction by 1%.", () => game.highestScrapReached.gte(1e15), "#ffff00"),
                        new Milestone("First Boosts", 3, "Buy your first Magnet Upgrade", () => Utils.filterObject(game.magnetUpgrades, upg => upg.level > 0).length > 0),

                        new Milestone("Doubled Scrap", 5, "Reach 100 Golden Scrap", () => game.goldenScrap.amount.gte(100)),
                        new Milestone("More Upgrades!", 4, "Buy your first \nGolden Scrap Upgrade", () => Utils.filterObject(game.goldenScrap.upgrades, upg => upg.level > 0).length > 0, "#b7b772"),
                        new Milestone("Automation", 6, "Reach " + formatThousands(1000) + " Golden Scrap to\nunlock auto-merging", () => game.goldenScrap.amount.gte(1000)),
                        new Milestone("Septillionaire", 7, () => "Reach " + formatNumber(1e24) + " Scrap", () => game.highestScrapReached.gte(1e24)),
                        new Milestone("Double Magnet", 8, "Get 2 Magnets each time you Merge", () => getMagnetBaseValue()
                            .gte(2)),

                        new Milestone("Apollo 21", 9, "Reach Level 8 on the \"More Scrap\"\nGolden Scrap Upgrade to\nexplore the Solar System!", () => game.goldenScrap.upgrades.scrapBoost.level >= 8, "#b0b0b0"),
                        new Milestone("Magnetism", 2, () => "Have " + formatNumber(1000) + " Magnets at once", () => game.magnets.gte(1000)),
                        new Milestone("BIG Scrap", 11, "Upgrade the Sun once", () => game.solarSystem.upgrades.sun.level > 0),
                        new Milestone("Palace of Gold", 12, "Reach 1,000,000 Golden Scrap", () => game.goldenScrap.amount.gte(1e6)),
                        new Milestone("AM go brrrrrr", 28, "Barrels spawn faster than 500ms", () => applyUpgrade(game.scrapUpgrades.fasterBarrels).toNumber() < 0.5, "#00ffff"),

                        new Milestone("It's musically", 37, "Enable music", () => game.settings.musicOnOff == 1),
                        new Milestone("So I can read my scrap", 38, "Switch to scientific notation", () => game.settings.numberFormatType == 3),
                        new Milestone("DESTROY THEM!!!", 1, "Fragments when???", () => game.settings.destroyBarrels == 1),
                        new Milestone("Magnets & Mayonnaise", 2, () => "Have " + formatNumber(10000) + " Magnets at once", () => game.magnets.gte(10000)),
                        new Milestone("Just a few", 11, "Upgrade the sun a few times", () => game.solarSystem.upgrades.sun.level >= 100),

                        new Milestone("Who needs\nUpgrades", 13, () => "Get " + formatNumber(1e15) + " Scrap without\nbuying Scrap Upgrades", () => game.scrap.gte(1e15) && game.scrapUpgrades.betterBarrels.level === 0 && game.scrapUpgrades.fasterBarrels.level === 0),
                        new Milestone("M.P. + W2ed", 8, "Have 69.420 magnets at once", () => game.magnets.gte(69420)),
                        new Milestone("RPG", 14, () => "Reach " + formatNumber(1e93) + " Scrap to\nunlock Merge Quests!", () => game.highestScrapReached.gte(1e93), "#5edc00"),
                        new Milestone("Best Barrels", 10, "Reach Better Barrels Upgrade Level 200", () => game.scrapUpgrades.betterBarrels.level >= 200),
                        new Milestone("Apollo 23", 15, "Unlock Mars by upgrading Earth!", () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS, "#a0a0a0"),

                        new Milestone("Reinforcements", 16, () => "Reach " + formatNumber(1e153) + " Scrap to\nunlock Merge Mastery!", () => game.highestScrapReached.gte(1e153), "#00e8e4"),
                        new Milestone("Speed of Sound", 28, "Barrels spawn faster than 250ms", () => applyUpgrade(game.scrapUpgrades.fasterBarrels).toNumber() < 0.25, "#00ffff"),
                        new Milestone("Merge Again", 17, "Prestige Merge Mastery", () => game.mergeMastery.prestige.level > 0),
                        new Milestone("Questing to\nthe Max", 14, "Have all Merge Quest\nUpgrades at least at Level 20", () => Utils.filterObject(game.mergeQuests.upgrades, upg => upg.level >= 20).length === 3),
                        new Milestone("Interesting Barrels", 10, "Reach Better Barrels Level 300", () => game.scrapUpgrades.betterBarrels.level >= 300),

                        new Milestone("Who needs\nUpgrades II", 13, () => "Get " + formatNumber(1e30) + " Scrap without\nbuying Scrap Upgrades", () => game.scrap.gte(1e30) && game.scrapUpgrades.betterBarrels.level === 0 && game.scrapUpgrades.fasterBarrels.level === 0),
                        new Milestone("Magnetism II", 2, () => "Have " + formatThousands(10e6) + " Magnets at once", () => game.magnets.gte(10e6)),
                        new Milestone("Building\nBlocks", 18, () => "Reach " + formatNumber(1e213) + " Scrap to\nunlock Bricks!", () => game.highestScrapReached.gte(1e213), "#feb329"),
                        new Milestone("Overproductive\nStart", 21, () => "First Barrel produces more than " + formatNumber(1e63) + " Scrap", () => Barrel.getIncomeForLevel(0).gte(1e63)),
                        new Milestone("HUGE Scrap", 11, () => "Upgrade the Sun to Level 1000\n(Currently: " + game.solarSystem.upgrades.sun.level.toFixed(0) + ")", () => game.solarSystem.upgrades.sun.level >= 1000),

                        new Milestone("Who needs\nUpgrades III", 13, () => "Get " + formatNumber(1e90) + " Scrap without\nbuying Scrap Upgrades", () => game.scrap.gte(1e90) && game.scrapUpgrades.betterBarrels.level === 0 && game.scrapUpgrades.fasterBarrels.level === 0),
                        new Milestone("Infinity", 19, () => "Reach " + formatNumber(Decimal.pow(2, 1024)) + " Scrap", () => game.highestScrapReached.gte(Decimal.pow(2, 1024)), "red"),
                        new Milestone("100%", 20, "Upgrade Mercury to Level 100", () => game.solarSystem.upgrades.mercury.level >= 100),
                        new Milestone("Millions\nat once", 22, () => "Get " + formatThousands(1e6) + " Magnets per Merge", () => getMagnetBaseValue()
                            .gte(1e6)),
                        new Milestone("Mega Mastery", 16, "Reach Merge Mastery Level 150", () => game.mergeMastery.level >= 150),

                        new Milestone("Tire", 26, "Get your first Tire\nReach Barrel 500 to unlock Tires", () => game.tires.amount.gt(0), "#00e57e"),
                        new Milestone("It is\npossible", 24, () => "Reach " + formatNumber(new Decimal("1e500")) + " Bricks", () => game.bricks.amount.gte(new Decimal("1e500"))),
                        new Milestone("COLOSSAL Scrap", 11, () => "Upgrade the Sun to Level 5000\n(Currently: " + game.solarSystem.upgrades.sun.level.toFixed(0) + ")", () => game.solarSystem.upgrades.sun.level >= 5000),
                        new Milestone("RPG v2", 32, "Unlock the Skill Tree", () => game.skillTree.isUnlocked(), "#98ff00"),
                        new Milestone("Apollo 99", 31, "Unlock the whole Solar System", () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NEPTUNE, "#909090"),

                        new Milestone("Ultra Mastery", 16, "Reach Merge Mastery Level 300", () => game.mergeMastery.level >= 300, "#e0e0e0"),
                        new Milestone("The Secret Upgrade", 34, "Unlock a new Upgrade...", () => game.skillTree.upgrades.mergeQuestUpgFallingMagnet.isUnlocked()),
                        new Milestone("Evolution\nof Tires", 27, "Unlock all Tire Upgrades", () => game.tires.amount.gte(game.tires.milestones[2])),
                        new Milestone("Speed\nof Light", 28, "Auto Merger is faster than 0.25s", () => applyUpgrade(game.solarSystem.upgrades.saturn)
                            .lte(0.25), "#00d7ff"),
                        new Milestone("Double every Dozen", 35, "Double Brick production every 12 Merges", () => game.bricks.mergesPerLevel() <= 12),

                        new Milestone("Very EZ", 33, "Unlock the EZ Upgrader\nand do Merge Quests\nmore easily", () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)),
                        new Milestone("It is indeed\npossible", 25, () => "Reach " + formatNumber(new Decimal("1e5000")) + " Tires", () => game.tires.amount.gte(new Decimal("1e5000"))),
                        new Milestone("Is this even\npossible??", 23, () => "Have " + formatThousands(1e15) + " Magnets at once", () => game.magnets.gte(1e15)),
                        new Milestone("Best Barrels III", 10, "Reach Better Barrels Upgrade Level 1000", () => game.scrapUpgrades.betterBarrels.level >= 1000),
                        new Milestone("Warp 9.9", 28, "Barrels spawn faster than 5ms", () => applyUpgrade(game.scrapUpgrades.fasterBarrels).toNumber() < 0.005, "#0092ff"),

                        new Milestone("Need more\nInfinities", 30, () => "First Barrel produces more than " + formatNumber(Decimal.pow(2, 1024)) + " Scrap", () => Barrel.getIncomeForLevel(0)
                            .gte(Decimal.pow(2, 1024))),
                        new Milestone("Need more\nInfinities II", 30, () => "First Barrel produces more than " + formatNumber(Decimal.pow(4, 1024)) + " Scrap", () => Barrel.getIncomeForLevel(0)
                            .gte(Decimal.pow(4, 1024))),
                        new Milestone("Need more\nInfinities III", 30, () => "First Barrel produces more than " + formatNumber(Decimal.pow(8, 1024)) + " Scrap", () => Barrel.getIncomeForLevel(0)
                            .gte(Decimal.pow(8, 1024))),
                        new Milestone("Are we\nthere yet?", 29, () => "Reach " + formatNumber(Decimal.pow(9.999, 1000)) + " Scrap", () => game.highestScrapReached.gte(Decimal.pow(9.999, 1000)), "red"),
                        new Milestone("Inf.^10", 36, () => "Reach " + formatNumber(Decimal.pow(2, 10240)) + " Scrap", () => game.highestScrapReached.gte(Decimal.pow(2, 10240)), "#b60045"),
                    ],
                highlighted: 0,
                tooltip: null,
                page: 0,
                maxPage: () => Math.floor(game.milestones.achievements.length / 25),
                changePage: d =>
                {
                    game.milestones.page += d;
                    game.milestones.page = Utils.clamp(game.milestones.page, 0, game.milestones.maxPage());
                    game.milestones.tooltip = null;
                },
                unlocked: [],
                getHighestUnlocked: function ()
                {
                    let highest = 0;
                    for (let i = 0; i < game.milestones.achievements.length; i++)
                    {
                        if (game.milestones.achievements[i].isUnlocked())
                        {
                            highest = i;
                        }
                    }
                    return highest;
                }
            },
        barrelGallery:
            {
                getMaxPage: () => Math.round(Math.round(Barrel.getMaxLevelBarrel()) / 20)
            },
        settings:
            {
                changeOptionsPage: d =>
                {
                    game.settings.optionsPage += d;
                    game.settings.optionsPage = Utils.clamp(game.settings.optionsPage, 0, 1);
                },
                numberFormatType: 0,
                barrelGalleryPage: 0,
                optionsPage: 0,
                barrelShadows: false,
                useCachedBarrels: false,
                barrelQuality: 1,
                destroyBarrels: false,
                autoMerge: false,
                resetConfirmation: true,
                lowPerformance: false,
                musicOnOff: false
            }
    };
