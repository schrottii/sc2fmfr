var barrelsLoaded = false;
var BARREL_SPRITE_SIZE = 64;


var imageURLs = [];

function loadImage(path, onload) {
    let img = new Image();
    img.src = path;
    if (onload) {
        img.onload = onload;
    }
    imageURLs.push(path);
    return img;
}

var images =
{
    barrels1: undefined,
    barrels2: undefined,
    barrels3: undefined,
    barrels4: undefined,
    barrels5: undefined,
    barrels6: undefined,
    barrels7: undefined,
    barrels8: undefined,
    barrels9: undefined,
    barrels10: undefined,
    shadowBarrels: [],
    previewBarrels: [],
    appIcon: loadImage("Images/app-icon-large.png"),
    scrap: loadImage("Images/Currencies/scrap.png"),
    barrelTemplate: loadImage("Images/barrel_template.png"),
    magnet: loadImage("Images/Currencies/magnet.png"),
    goldenScrap: loadImage("Images/Currencies/goldenscrap.png"),
    brick: loadImage("Images/Currencies/brick.png"),
    tire: loadImage("Images/Currencies/tire.png"),
    fragment: loadImage("Images/Currencies/fragment.png"),
    starSmall: loadImage("Images/star_small.png"),
    mergeToken: loadImage("Images/Currencies/mergetoken.png"),
    container: loadImage("Images/container.png"),
    buttonEmpty: loadImage("Images/Buttons/button_empty.png"),
    buttonBack: loadImage("Images/Buttons/button_back.png"),
    buttonMaxAll: loadImage("Images/Buttons/maxall.png"),
    buttonReset: loadImage("Images/Buttons/button_reset.png"),
    scrap2logo: loadImage("Images/scrap2logo.png"),
    gameNotifaction: loadImage("Images/gamenotification.png"),
    clock: loadImage("Images/clock.png"),
    coconut: loadImage("Images/coconut.jpg"),
    trophy: loadImage("Images/trophies.png"),
    exportGame: loadImage("Images/Buttons/export_game.png"),
    importGame: loadImage("Images/Buttons/import_game.png"),
    setTimeButton: loadImage("Images/Buttons/settime.png"),
    exportImport: loadImage("Images/Buttons/export_import.png"),
    zoomOut: loadImage("Images/Buttons/button_zoom_out.png"),
    zoomIn: loadImage("Images/Buttons/button_zoom_in.png"),
    ezUpgrade: loadImage("Images/Buttons/ez_upgrade.png"),
    highlightedSlot: loadImage("Images/highlighted_slot.png"),
    nextSlot: loadImage("Images/highlighted_slot2.png"),
    locked: loadImage("Images/locked.png"),
    darkscrap: loadImage("Images/Currencies/darkscrap.png"),
    darkfragment: loadImage("Images/Currencies/darkfragment.png"),
    beam: loadImage("Images/Currencies/steelbeam.png"),
    aerobeam: loadImage("Images/Currencies/aerobeam.png"),
    angelbeam: loadImage("Images/Currencies/angelbeam.png"),
    reinforcedbeam: loadImage("Images/Currencies/reinforcedbeam.png"),
    glitchbeam: loadImage("Images/Currencies/glitchbeam.png"),
    wrench: loadImage("Images/Currencies/wrench.png"),
    scrapyard: loadImage("Images/Scrapyard.png"),
    searchbutton: loadImage("Images/Buttons/search.png"),
    glitch: loadImage("Images/h.png"),
    legendaryScrap: loadImage("Images/Currencies/legendary.png"),
    steelMagnet: loadImage("Images/Currencies/steelMagnet.png"),
    blueBrick: loadImage("Images/Currencies/bluebrick.png"),
    fillthetank: loadImage("Images/Buttons/fillthetank.png"),
    onoffbutton: loadImage("Images/Buttons/onoff.png"),
    shrine: loadImage("Images/shrinebydec.png"),
    club: loadImage("Images/clubbyfrank.png"),
    masteryToken: loadImage("Images/Currencies/masterytoken.png"),
    plasticBag: loadImage("Images/Currencies/plasticbag.png"),
    bucket: loadImage("Images/Currencies/bucket.png"),
    fishingNet: loadImage("Images/Currencies/fishingnet.png"),
    masteryIcon: loadImage("Images/mastery.png"),
    convertbutton: loadImage("Images/Buttons/convertbutton.png"),
    multibuybutton: loadImage("Images/Buttons/multibuybutton.png"),
    screw: loadImage("Images/Currencies/screw.png"),
    factoryguy: loadImage("Images/Buildings/factoryguy.png"),
    cogwheel: loadImage("Images/Currencies/cogwheel.png"),
    storm: loadImage("Images/storm.png"),
    gift: loadImage("Images/gift.png"),
    setmessage: loadImage("Images/Buttons/setmsg.png"),
    setcode: loadImage("Images/Buttons/setcode.png"),
    addfriend: loadImage("Images/Buttons/add_friend.png"),
    change: loadImage("Images/Buttons/change.png"),
    supernovabutton: loadImage("Images/Buttons/supernova.png"),
    cosmicemblem: loadImage("Images/Currencies/cosmicemblem.png"),
    stardust: loadImage("Images/Currencies/stardust.png"),
    aliendust: loadImage("Images/Currencies/aliendust.png"),
    fairydust: loadImage("Images/Currencies/fairydust.png"),
    language: loadImage("Images/Buttons/language.png"),
    hyperbuyLevel: loadImage("Images/Buttons/hyperbuy_level.png"),
    hyperbuyPercent: loadImage("Images/Buttons/hyperbuy_percent.png"),
    masterytoggle: loadImage("Images/Buttons/masterytoggle.png"),
    pins: loadImage("Images/pins.png"),
    alienPin: loadImage("Images/alienpin.png"),
    fairyPin: loadImage("Images/fairypin.png"),
    starPin: loadImage("Images/starpin.png"),
    logos:
    {
        scrap2: loadImage("Images/scrap2logo.png"),
        discord: loadImage("Images/discord.png"),
        youtube: loadImage("Images/youtube.png"),
        schrottii: loadImage("Images/schrottii.png")
    },
    options:
    {
        barrelQuality: loadImage("Images/Buttons/barrel_quality.png"),
        numberFormat: loadImage("Images/Buttons/number_format.png")
    },
    arrows:
    {
        left: loadImage("Images/Buttons/arrow_left.png"),
        left_2: loadImage("Images/Buttons/arrow_left_2.png"),
        right: loadImage("Images/Buttons/arrow_right.png"),
        right_2: loadImage("Images/Buttons/arrow_right_2.png"),
    },
    buildings:
    {
        shrine: loadImage("Images/Buildings/shrine.png"),
        factory: loadImage("Images/Buildings/factory.png"),
        factorylocked: loadImage("Images/Buildings/factorylocked.png"),
        generator: loadImage("Images/Buildings/generator.png"),
        bluestacks: loadImage("Images/Buildings/autos.png"),
        collectors: loadImage("Images/Buildings/collectors.png"),
    },
    checkbox:
    {
        off: loadImage("Images/Checkbox/checkbox_off.png"),
        on: loadImage("Images/Checkbox/checkbox_on.png"),
        autoMerge:
        {
            off: loadImage("Images/Checkbox/automerge_off.png"),
            on: loadImage("Images/Checkbox/automerge_on.png")
        },
        autoConvert:
        {
            off: loadImage("Images/Checkbox/autoconvert_off.png"),
            on: loadImage("Images/Checkbox/autoconvert_on.png")
        },
        hyperbuy:
        {
            off: loadImage("Images/Checkbox/hyperbuy_off.png"),
            on: loadImage("Images/Checkbox/hyperbuy_on.png")
        }
    },
    upgrades:
    {
        betterBarrels: loadImage("Images/Upgrades/betterbarrels.png"),
        fasterBarrels: loadImage("Images/Upgrades/fasterbarrels.png"),
        moreScrap: loadImage("Images/Upgrades/scrapboost.png"),
        moreScrap2: loadImage("Images/Upgrades/scrapboost2.png"),
        magnetBoost: loadImage("Images/Upgrades/magnetboost.png"),
        magnetChance: loadImage("Images/Upgrades/magnetchance.png"),
        goldenScrapBoost: loadImage("Images/Upgrades/goldenscrapboost.png"),
        moreGS: loadImage("Images/Upgrades/moregs.png"),
        brickBoost: loadImage("Images/Upgrades/brickboost.png"),
        brickSpeed: loadImage("Images/Upgrades/brickspeed.png"),
        questSpeed: loadImage("Images/Upgrades/questspeed.png"),
        questLevels: loadImage("Images/Upgrades/questlevels.png"),
        tireBoost: loadImage("Images/Upgrades/tireamount.png"),
        tireChance: loadImage("Images/Upgrades/tirechance.png"),
        fasterMastery: loadImage("Images/Upgrades/fastermastery.png"),
        fasterFallingMagnets: loadImage("Images/Upgrades/fasterfallingmagnets.png"),
        fasterAutoMerge: loadImage("Images/Upgrades/fasterautomerge.png"),
        moreDarkScrap: loadImage("Images/Upgrades/darkscrapboost.png"),
        moreFragments: loadImage("Images/Upgrades/fragmentboost.png"),
        moreMergeTokens: loadImage("Images/Upgrades/moremergetokens.png"),
        beamChance: loadImage("Images/Upgrades/beamchance.png"),
        beamValue: loadImage("Images/Upgrades/beamvalue.png"),
        beamStormChance: loadImage("Images/Upgrades/beamstormchance.png"),
        beamStormValue: loadImage("Images/Upgrades/beamstormvalue.png"),
        slowerBeams: loadImage("Images/Upgrades/slowerbeams.png"),
        xplustwo: loadImage("Images/Upgrades/xplustwo.png"),
        unlockbeamtypes: loadImage("Images/Upgrades/unlockbeamtypes.png"),
        unlockscrapyard: loadImage("Images/Upgrades/unlockscrapyard.png"),
        aerobeamChance: loadImage("Images/Upgrades/aerobeamchance.png"),
        angelBeamChance: loadImage("Images/Upgrades/angelbeamchance.png"),
        angelBeamValue: loadImage("Images/Upgrades/angelbeamvalue.png"),
        reinforcedBeamValue: loadImage("Images/Upgrades/reinforcedbeamvalue.png"),
        reinforcedBeamPower: loadImage("Images/Upgrades/reinforcedbeameasier.png"),
        reinforcedBeamCrit: loadImage("Images/Upgrades/reinforcedbeamcrit.png"),
        reinforcedBricks: loadImage("Images/Upgrades/reinforcedbrick.png"),
        glitchBeamValue: loadImage("Images/Upgrades/glitchbeamvalue.png"),
        repeatUpgrade: loadImage("Images/Upgrades/repeat.png"),
        unlockFactory: loadImage("Images/Upgrades/unlockFactory.png"),
        unlockGenerator: loadImage("Images/Upgrades/unlockGenerator.png"),
        unlockAutos: loadImage("Images/Upgrades/unlockAutos.png"),
        goldenBeams: loadImage("Images/Upgrades/goldenbeams.png"),
        valueGlitchUpgrade: loadImage("Images/Upgrades/valueGlitchUpgrade.png"),
        unlockMastery: loadImage("Images/Upgrades/unlockmastery.png"),
        efficientenergy: loadImage("Images/Upgrades/efficientenergy.png"),
        renewableenergy: loadImage("Images/Upgrades/renewableenergy.png"),
        unlockConverter: loadImage("Images/Upgrades/unlockConverter.png"),
        fourthUpgrades: loadImage("Images/Upgrades/4thupgrades.png"),
        strongerBarrelTiers: loadImage("Images/Upgrades/barreltiers.png"),
        strongerMasteryMagnets: loadImage("Images/Upgrades/strongermasterymagnets.png"),
        strongerMasteryScrap: loadImage("Images/Upgrades/strongermasteryscrap.png"),
        fasterMaster: loadImage("Images/Upgrades/fastermaster.png"),
        shorterGSStorms: loadImage("Images/Upgrades/shorterGSStorms.png"),
        higherNeptuneMax: loadImage("Images/Upgrades/higherneptunemax.png"),
        unlockAutoCollectors: loadImage("Images/Upgrades/unlockautocollectors.png"),
        cheaperMythus: loadImage("Images/Upgrades/cheapermythus.png"),
        doublePlasticBags: loadImage("Images/Upgrades/doubleplasticbags.png"),
        unlockPlasticBags: loadImage("Images/Upgrades/unlockplasticbags.png"),
        unlockScrews: loadImage("Images/Upgrades/unlockscrews.png"),
        starDaily: loadImage("Images/Upgrades/stardaily.png"),
        unlockTimeMode: loadImage("Images/Upgrades/unlocktimemode.png"),
        funnyGlitchBeams: loadImage("Images/Upgrades/glitchbeams.png"),
        posusDarkFragments: loadImage("Images/Upgrades/posusdarkfragments.png"),
        fasterFactory: loadImage("Images/Upgrades/fasterfactory.png"),
    },
    scenes:
    {
        scrap: loadImage("Images/Scenes/scrap.png"),
        magnet: loadImage("Images/Scenes/magnet.png"),
        goldenScrap: loadImage("Images/Scenes/goldenscrap.png"),
        barrelGallery: loadImage("Images/Scenes/barrelgallery.png"),
        solarSystem: loadImage("Images/Scenes/solarsystem.png"),
        options: loadImage("Images/Scenes/options.png"),
        mergeQuests: loadImage("Images/Scenes/mergequests.png"),
        milestones: loadImage("Images/Scenes/milestones.png"),
        mergeMastery: loadImage("Images/Scenes/merge_mastery.png"),
        bricks: loadImage("Images/Scenes/bricks.png"),
        tires: loadImage("Images/Scenes/tires.png"),
        fragment: loadImage("Images/Scenes/fragment.png"),
        dimension: loadImage("Images/Scenes/dimension.png"),
        skillTree: loadImage("Images/Scenes/skilltree.png"),
        steelBeams: loadImage("Images/Scenes/steelbeams.png"),
        beamboosts: loadImage("Images/Scenes/beamboosts.png"),
        beamselection: loadImage("Images/Scenes/beamselection.png"),
        aerobeams: loadImage("Images/Scenes/aerobeams.png"),
        angelbeams: loadImage("Images/Scenes/angelbeams.png"),
        reinforcedbeams: loadImage("Images/Scenes/reinforcedbeams.png"),
        glitchbeams: loadImage("Images/Scenes/glitchbeams.png"),
        wrenches: loadImage("Images/Scenes/wrenches.png"),
        scrapyard: loadImage("Images/Scenes/scrapyard.png"),
        statistics: loadImage("Images/Scenes/stats.png"),
        daily: loadImage("Images/Scenes/daily.png"),
        factory: loadImage("Images/Scenes/factory.png"),
        convert: loadImage("Images/Scenes/convertscene.png"),
        plasticbags: loadImage("Images/Scenes/plasticbags.png"),
        screws: loadImage("Images/Scenes/screws.png"),
        timemode: loadImage("Images/Scenes/timemode.png"),
        gifts: loadImage("Images/Scenes/gifts.png"),
        stardustupgrades: loadImage("Images/Scenes/stardustupgrades.png"),
        aliendustupgrades: loadImage("Images/Scenes/aliendustupgrades.png"),
        fairydustupgrades: loadImage("Images/Scenes/fairydustupgrades.png"),
        cosmicupgrades: loadImage("Images/Scenes/cosmicupgrades.png"),
        unlocks: loadImage("Images/Scenes/unlocks.png"),
    },
    solarSystem:
    {
        inner: loadImage("Images/SolarSystem/inner.png"),
        third: loadImage("Images/SolarSystem/third.png"),
        sun: loadImage("Images/SolarSystem/sun.png"),
        mercury: loadImage("Images/SolarSystem/mercury.png"),
        venus: loadImage("Images/SolarSystem/venus.png"),
        earth: loadImage("Images/SolarSystem/earth.png"),
        mars: loadImage("Images/SolarSystem/mars.png"),
        jupiter: loadImage("Images/SolarSystem/jupiter.png"),
        saturn: loadImage("Images/SolarSystem/saturn.png"),
        uranus: loadImage("Images/SolarSystem/uranus.png"),
        neptune: loadImage("Images/SolarSystem/neptune.png"),
        astro: loadImage("Images/SolarSystem/astro.png"),
        mythus: loadImage("Images/SolarSystem/mythus.png"),
        posus: loadImage("Images/SolarSystem/posus.png"),
        destroyer: loadImage("Images/SolarSystem/destroyer.png"),
    },
    constellations:
    {
        ara: loadImage("Images/Constellations/ara.png"),
        aries: loadImage("Images/Constellations/aries.png"),
        corvus: loadImage("Images/Constellations/corvus.png"),
        volans: loadImage("Images/Constellations/volans.png"),
        vulpecula: loadImage("Images/Constellations/vulpecula.png"),
        cancer: loadImage("Images/Constellations/cancer.png"),
        pyxis: loadImage("Images/Constellations/pyxis.png"),
        antlia: loadImage("Images/Constellations/antlia.png"),
        phoenix: loadImage("Images/Constellations/phoenix.png"),
        orion: loadImage("Images/Constellations/orion.png"),
        puppis: loadImage("Images/Constellations/puppis.png"),
        cetus: loadImage("Images/Constellations/cetus.png"),
        triangulum: loadImage("Images/Constellations/triangulum.png"),
        aquila: loadImage("Images/Constellations/aquila.png"),
        caelum: loadImage("Images/Constellations/caelum.png"),
    },
    achievements:
    {
        locked: loadImage("Images/Achievements/locked.png"),
        unlocked: loadImage("Images/Achievements/unlocked.png")
    },
    movingItems:
    {
        magnet: loadImage("Images/MovingItems/magnet.png"),
        tire: loadImage("Images/MovingItems/tire.png"),
        tirebg: loadImage("Images/MovingItems/tirebg.png"),
        beam: loadImage("Images/MovingItems/steelbeam.png"),
        aerobeam: loadImage("Images/Currencies/aerobeam.png"),
        angelbeam: loadImage("Images/Currencies/angelbeam.png"),
        reinforcedbeam: loadImage("Images/Currencies/reinforcedbeam.png"),
        glitchbeam: loadImage("Images/Currencies/glitchbeam.png"),
        goldenBeam: loadImage("Images/Currencies/goldenbeam.png"),
    }
};

var colors = {
    default:
    {
        bg: "rgb(153, 197, 255)",
        bgFront: "rgb(0, 99, 230)",
        bgFrontD: "rgb(0, 79, 170)",
        table: "rgb(122, 180, 255)",
        table2: "rgb(181, 213, 255)",
        scrollTrack: "rgb(0,80,197)",
        scrollTrackbg: "rgb(118,152,203)",
        skillTreePath: "rgb(0,6,214)",
        skillTreePath2: "rgb(0,214,6)",
        text: "rgb(0, 0, 0)"
    },
    darkblue:
    {
        bg: "rgb(103, 147, 205)",
        bgFront: "rgb(0, 49, 180)",
        bgFrontD: "rgb(0, 39, 130)",
        table: "rgb(72, 130, 205)",
        table2: "rgb(131, 163, 205)",
        scrollTrack: "rgb(0,30,147)",
        scrollTrackbg: "rgb(68,102,153)",
        skillTreePath: "rgb(0,6,164)",
        skillTreePath2: "rgb(0,164,6)",
        text: "rgb(0, 0, 0)"
    },
    dark:
    {
        bg: "rgb(23, 47, 65)",
        bgFront: "rgb(0, 29, 60)",
        bgFrontD: "rgb(0, 19, 30)",
        table: "rgb(42, 60, 105)",
        table2: "rgb(32, 50, 95)",
        scrollTrack: "rgb(0,20,60)",
        scrollTrackbg: "rgb(40,62,72)",
        skillTreePath: "rgb(0,6,110)",
        skillTreePath2: "rgb(0,110,6)",
        text: "rgb(255, 255, 255)"
    },
    pink:
    {
        bg: "rgb(188, 63, 63)",
        bgFront: "rgb(221, 155, 155)",
        bgFrontD: "rgb(201, 135, 135)",
        table: "rgb(219, 96, 96)",
        table2: "rgb(188, 83, 83)",
        scrollTrack: "rgb(0,20,60)",
        scrollTrackbg: "rgb(40,62,72)",
        skillTreePath: "rgb(0,6,110)",
        skillTreePath2: "rgb(60,110,6)",
        text: "rgb(0, 0, 0)"
    }
};

var fonts =
{
    default: "Work Sans, Arial, sans-serif",
    title: "Work Sans, Semibold, sans-serif"
};

var songs =
{
    newerWave: "Sounds/NewerWave.mp3",
    gettingItDone: "Sounds/GettingitDone.mp3",
    powerBeams: "Sounds/powerbeams.mp3",
    voltaic: "Sounds/Voltaic.mp3",
};

var cacheCanvas = document.createElement("canvas");
document.body.appendChild(cacheCanvas);
cacheCanvas.style.appearance = "none";
cacheCanvas.style.webkitAppearance = "none";
cacheCanvas.classList.add("cache");
var cacheCanvasCtx = cacheCanvas.getContext("2d");

function cacheBarrel(id) {
    let shadowOffset = BARREL_SPRITE_SIZE / 20;

    let x = BARREL_SPRITE_SIZE * (id % Math.floor(images.barrels1.width / BARREL_SPRITE_SIZE));
    let y = BARREL_SPRITE_SIZE * Math.floor(id / Math.floor(images.barrels1.width / BARREL_SPRITE_SIZE));

    cacheCanvasCtx.clearRect(0, 0, BARREL_SPRITE_SIZE + shadowOffset, BARREL_SPRITE_SIZE + shadowOffset);

    cacheCanvas.width = BARREL_SPRITE_SIZE + shadowOffset;
    cacheCanvas.height = BARREL_SPRITE_SIZE + shadowOffset;
    Utils.setCanvasShadow(cacheCanvasCtx, "#00000060", 0, shadowOffset, shadowOffset);

    let section = Math.max((Math.max(1, Math.ceil((0.0001 + id % BARRELS) / 100))) % 11, 1); /* Change this when you add new BARRELS files */
    cacheCanvasCtx.drawImage(images["barrels" + section], x, y, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);

    let img = new Image();
    //img.src = cacheCanvas.toDataURL();

    images.shadowBarrels[id] = img;

    cacheCanvas.width = BARREL_SPRITE_SIZE;
    cacheCanvas.height = BARREL_SPRITE_SIZE;
    cacheCanvasCtx.clearRect(0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);
    Utils.setCanvasShadow(cacheCanvasCtx, "#00000060", 0, shadowOffset + 1000, 0);
    cacheCanvasCtx.translate(-1000, 0);
    cacheCanvasCtx.drawImage(images["barrels" + section], x, y, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);

    img = new Image();
    //img.src = cacheCanvas.toDataURL();
    cacheCanvasCtx.translate(1000, 0);
    images.previewBarrels[id] = img;
}
