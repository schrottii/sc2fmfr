class UIElement
{
    constructor(x, y, width, height, config)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offset = [0, 0];
        this.isVisible = config && config.isVisible ? config.isVisible : this.isVisible;
        this.quadratic = config && config.quadratic ? config.quadratic : false;
        this.quadraticMin = config && config.quadraticMin ? config.quadraticMin : false;
        this.anchor = config && config.anchor ? config.anchor : [0.5, 0.5]; //x, y
        this.name = config && config.name ? config.name : null;
        this.isGroup = false;
    }

    absCoords()
    {
        let anchor;

        let normAnchor = [-this.anchor[0], -this.anchor[1]];

        let x = this.x + this.offset[0];
        let y = this.y + this.offset[1];

        if (!this.quadratic && !this.quadraticMin)
        {
            anchor = {
                x: this.width * w * normAnchor[0],
                y: this.height * h * normAnchor[1]
            }
        }
        else if(this.quadraticMin)
        {
            let max = Math.min(this.width, this.height);
            anchor = {
                x: max * h * normAnchor[0],
                y: max * h * normAnchor[1]
            }
        }
        else
        {
            let max = Math.max(this.width, this.height);
            anchor = {
                x: max * h * normAnchor[0],
                y: max * h * normAnchor[1]
            }
        }

        let rect = {
            x: x * w + anchor.x,
            y: y * h + anchor.y,
            width: this.width * w,
            height: this.height * h
        };

        if (this.quadratic)
        {
            rect.width = Math.max(rect.width, rect.height);
            rect.height = Math.max(rect.width, rect.height);
        }
        else if (this.quadraticMin)
        {
            rect.width = Math.min(rect.width, rect.height);
            rect.height = Math.min(rect.width, rect.height);
        }

        return rect;
    }

    isHovered()
    {
        let coord = this.absCoords();
        return this.isVisible() && (mouseX > coord.x && mouseX < coord.x + coord.width &&
            mouseY > coord.y && mouseY < coord.y + coord.height);
    }

    isVisible()
    {
        return true;
    }

    onclick()
    {
    }

    onrelease()
    {
    }

    update()
    {
    }

    render()
    {
        ctx.fillStyle = "aqua";
        ctx.fillRect(coord.x, coord.y, coord.width, coord.height);
    }
}

class UIGroup
{
    constructor(elements, isVisible)
    {
        this.uiElements = elements;
        this.isVisible = isVisible ? isVisible : this.isVisible;
        this.isGroup = true;
        this.offset = [0, 0];
    }

    isVisible()
    {
        return true;
    }

    isHovered()
    {
        return false;
    }

    update()
    {
        for(let el of this.uiElements)
        {
            el.offset = this.offset;
        }
    }

    render()
    {
        if (this.isVisible())
        {
            for (let el of this.uiElements)
            {
                el.update();
                el.render(ctx);
            }
        }
    }
}

class UIScrollContainer2D extends UIGroup
{
    constructor(elements, x, y, w, h, isVisisble, customBounds)
    {
        super(elements, isVisisble);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.axis = {
            x: true,
            y: true
        };
        this.padding = 0.1;
        this.scrollSpeed = 2;
        this.scrollBounds = customBounds ? customBounds : this.getScrollBounds();
        if(customBounds)
        {
            this.scrollBounds.xmax -= this.w + this.x;
            this.scrollBounds.ymax -= this.h + this.y;
        }
        this.scrollX = this.scrollBounds.xmin;
        this.scrollY = this.scrollBounds.ymin;
    }

    getScrollBounds()
    {
        return{
            xmin: this.x - this.padding,
            xmax: this.uiElements.sort((el, el2) => el2.x - el.x)[0].x + this.padding - this.w - this.x, //this.x/y might be buggy
            ymin: this.y - this.padding,
            ymax: this.uiElements.sort((el, el2) => el2.y - el.y)[0].y + this.padding - this.h - this.y,
        }
    }

    update()
    {
        for(let ui of this.uiElements)
        {
            ui.update();
        }
        if(mousePressed)
        {
            let mx = Math.abs(mouseMoveX) > 1 ? mouseMoveX : 0;
            let my = Math.abs(mouseMoveY) > 1 ? mouseMoveY : 0;
            this.scrollX -= this.axis.x ? mx / (innerWidth * devicePixelRatio) * this.scrollSpeed : 0;
            this.scrollY -= this.axis.y ? my / (innerWidth * devicePixelRatio) * this.scrollSpeed : 0;
            if(this.axis.x)
            {
                this.scrollX = Utils.clamp(this.scrollX, this.scrollBounds.xmin, this.scrollBounds.xmax);
            }
            if(this.axis.y)
            {
                this.scrollY = Utils.clamp(this.scrollY, this.scrollBounds.ymin, this.scrollBounds.ymax);
            }
        }
    }

    render()
    {
        let nx = this.x * w;
        let ny = this.y * h;
        let nw = this.w * w;
        let nh = this.h * h;
        ctx.save();
        let path = new Path2D();
        path.moveTo(nx, ny);
        path.lineTo(nx + nw, ny);
        path.lineTo(nx + nw, ny + nh);
        path.lineTo(nx, ny + nh);
        ctx.clip(path);
        for(let ui of this.uiElements)
        {
            ui.offset = [-this.scrollX, -this.scrollY];
            ui.render(ctx);
        }
        let barSizeMod = this.axis.x && this.axis.y ? w * -0.03 : 0; //if bottom right square is drawn, dont let bars flow into that square
        if(this.axis.x)
        {
            ctx.fillStyle = colors[C]["scrollTrackbg"];
            ctx.fillRect(nx, ny + nh - w * 0.03, nw, w * 0.03);
            ctx.fillStyle = colors[C]["scrollTrack"];
            let barHeight = w * (this.w / (this.scrollBounds.xmax + (this.w + this.x) - this.scrollBounds.xmin)); //(this.w + this.x) correct from constructor custombounds
            //we don't need min, just the delta height, scrollX/Y is in the delta => 0 to 1
            ctx.fillRect(nx + (nw - barHeight + barSizeMod) * ((this.scrollX - this.scrollBounds.xmin) / (this.scrollBounds.xmax - this.scrollBounds.xmin)), ny + nh - w * 0.03, barHeight, w * 0.03);
        }
        if(this.axis.y)
        {
            ctx.fillStyle = colors[C]["scrollTrackbg"];
            ctx.fillRect(nx + nw - w * 0.03, ny, w * 0.03, nh);
            ctx.fillStyle = colors[C]["scrollTrack"];
            let barHeight = h * (this.h / (this.scrollBounds.ymax + (this.h + this.y) - this.scrollBounds.ymin));
            ctx.fillRect(nx + nw - w * 0.03, ny + (nh - barHeight + barSizeMod) * ((this.scrollY - this.scrollBounds.ymin) / (this.scrollBounds.ymax - this.scrollBounds.ymin)), w * 0.03, barHeight);
        }
        if(this.axis.x && this.axis.y)
        {
            ctx.fillStyle = "rgb(96,124,166)";
            ctx.fillRect(nx + nw - w * 0.03, ny + nh - w * 0.03, w * 0.03, w * 0.03);
        }
        ctx.restore();
    }
}

class UIScrollContainerX extends UIScrollContainer2D
{
    constructor(ui, x, y, w, h, isVisible, customBounds)
    {
        super(ui ,x, y, w, h, isVisible, customBounds);
        this.axis.y = false;
        this.scrollX = this.scrollBounds.xmin;
        this.scrollY = 0;
    }
}

class UIScrollContainerY extends UIScrollContainer2D
{
    constructor(ui, x, y, w, h, isVisible, customBounds)
    {
        super(ui ,x, y, w, h, isVisible, customBounds);
        this.axis.x = false;
        this.scrollX = 0;
        this.scrollY = this.scrollBounds.ymin;
    }
}

class UIButton extends UIElement
{
    constructor(x, y, width, height, img, onclick, config)
    {
        super(x, y, width, height, config);
        this.img = img;
        this.onrelease = onclick;
    }

    render(ctx)
    {
        if (this.isVisible())
        {
            let coord = this.absCoords();
            if (this.isHovered() && mousePressed)
            {
                ctx.filter = "brightness(0.75)";
            }
            ctx.drawImage(this.img ? this.img : images.buttonEmpty, coord.x, coord.y, coord.width, coord.height);
            ctx.filter = "none";
        }
    }
}

function autoToggle(upg) {
    if (upg.time == "b") return false;
    if (upg.time != false) {
        upg.time = false;
    }
    else {
        upg.time = applyUpgrade(upg);
    }
}

class UIText extends UIElement
{
    constructor(updateText, x, y, size, color, cfg)
    {
        super(x, y, 0, 0, cfg);
        this.size = size;
        this.color = color;
        this.halign = cfg && cfg.halign ? cfg.halign : "center";
        this.valign = cfg && cfg.valign ? cfg.valign : "top";
        this.bold = cfg && cfg.bold ? cfg.bold : false;
        this.borderSize = cfg && cfg.borderSize !== undefined ? cfg.borderSize : 0;
        this.borderColor = cfg && cfg.borderColor ? cfg.borderColor : "black";
        this.font = cfg && cfg.font ? cfg.font : fonts.default;
        this.updateText = updateText ? updateText : function ()
        {
            return "";
        }; //used to set text
    }

    updateText()
    {
        return "";
    }

    update()
    {
        if (typeof this.updateText == "function")
        {
            this.text = this.updateText();
        }
        else if (typeof this.updateText == "string")
        {
            this.text = this.updateText;
        }
    }

    isHovered()
    {
        return false;
    }

    render(ctx)
    {
        if (this.isVisible()) Utils.drawRichText(ctx, this.text, this.x + this.offset[0], this.y + this.offset[1], this.size,
            {
                color: (C == "dark" && (this.color == "black" || this.color == "#000000")) ? "white" : this.color,
                halign: this.halign,
                valign: this.valign,
                bold: this.bold,
                font: this.font,
                borderSize: this.borderSize,
                borderColor: this.borderColor
            });
    }
}

class UIImage extends UIElement
{
    constructor(image, x, y, w, h, config)
    {
        super(x, y, w, h, config);
        this.image = image;
    }

    render(ctx)
    {
        if(this.isVisible())
        {
            let coords = this.absCoords();
            ctx.drawImage(this.image, coords.x, coords.y, coords.width, coords.height);
        }
    }
}

class UICheckbox extends UIElement
{
    constructor(x, y, width, height, prop, config)
    {
        super(x, y, width, height, config);
        this.prop = prop;
        this.customClick = config && config.onclick ? config.onclick : this.customClick;

        this.imgUnchecked = config && config.off ? config.off : images.checkbox.off;
        this.imgChecked = config && config.on ? config.on : images.checkbox.on;
    }

    customClick() //defined click event to be executed
    {

    }

    update()
    {
        this.checked = eval(this.prop);
    }

    onclick()
    {
        if (this.isVisible())
        {
            eval(this.prop + " = !" + this.prop);
            this.customClick();
        }
    }

    render(ctx)
    {
        if (this.isVisible())
        {
            let coords = this.absCoords();

            ctx.drawImage(this.checked ? this.imgChecked : this.imgUnchecked, coords.x, coords.y, coords.width, coords.height);
        }
    }
}

class UIRect extends UIElement
{
    constructor(x, y, w, h, color)
    {
        super(x, y, w, h, {});
        this.color = color;
    }

    render(ctx)
    {
        ctx.fillStyle = colors[C][this.color];

        let coords = this.absCoords();

        ctx.fillRect(coords.x, coords.y, coords.width, coords.height);
    }
}

class UIPath extends UIElement
{
    constructor(points, width, color, cfg)
    {
        super(0, 0, 0, 0, cfg);
        this.width = width;
        this.points = points;
        this.x = this.points[0][0];
        this.y = this.points[0][1];
        this.color = color;
    }

    render(ctx)
    {
        if(this.isVisible())
        {
            ctx.beginPath();
            for(let i = 0; i < this.points.length; i++)
            {
                let p = this.points[i];
                let x = (p[0] + this.offset[0]) * w;
                let y = (p[1] + this.offset[1]) * h;
                let width = this.width * h;
                ctx.strokeStyle = colors[C][this.color];
                ctx.lineWidth = width;
                if(i === 0) ctx.moveTo(x, y);
                else
                {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}

class UISkillTreePath extends UIPath
{
    constructor(x1, y1, x2, y2, width, color, fromUpg)
    {
        let p = [];
        p.push([x1, y1]);
        if(x1 !== x2)
        {
            p.push([x2, y1 + Math.abs(x1 - x2) / 2.5]);
        }
        p.push([x2, y2]);
        super(p, width, color);
        this.isVisible = function ()
        {
            if(fromUpg.length === undefined)
            {
                return fromUpg.level > 0;
            }
            else
            {
                for(let upg of fromUpg)
                {
                    if(upg.level === 0) return false;
                }
                return true;
            }
        }
    }
}

class UIUpgrade extends UIGroup
{
    constructor(upg, img, priceSuffix, y, desc, priceSize, col, isVisible, displayLevel, doround=true)
    {
        super(
            [
                new UIRect(0.5, y, 1, 0.1, col ? col : "table"),
                new UIButton(0.1, y, 0.07, 0.07, img, () => upg.buy(doround), {quadratic: true}),
                new UIText(() => displayLevel ? (upg.level + "/" + (upg.getMaxLevel() === Infinity ? "∞" : upg.getMaxLevel().toLocaleString("en-us"))) : "", 0.975, y - 0.04, 0.04, "#000000", {halign: "right"}),
                new UIText(() => upg.getPriceDisplay(priceSuffix, "", false), 0.975, y, priceSize, "#000000", {halign: "right", valign: "middle", bold: true}),
                new UIText(() => desc + "\n" +
                    upg.getEffectDisplay(), 0.2, y, 0.04, "#000000", {halign: "left", valign: "middle"})
            ], isVisible);
    }
}

class UIUpgrade2 extends UIGroup {
    constructor(upg, img, priceSuffix, y, desc, priceSize, col, isVisible, displayLevel, doround = true) {
        super(
            [
                new UIRect(0.5, y, 1, 0.1, col ? col : "table"),
                new UIButton(0.1, y, 0.07, 0.07, img, () => upg.buy(doround), { quadratic: true }),
                new UIText(() => displayLevel ? (upg.level + "/" + (upg.getMaxLevel() === Infinity ? "∞" : upg.getMaxLevel().toLocaleString("en-us"))) : "", 0.975, y - 0.04, 0.04, "#000000", { halign: "right" }),
                new UIText(() => upg.getPriceDisplay(priceSuffix, "", false), 0.975, y + 0.025, priceSize, "#000000", { halign: "right", valign: "middle", bold: true }),
                new UIText(() => {
                    if (game.factory.time < 0) {
                        return desc + "\n" + upg.getEffectDisplay();
                    }
                    else {
                        return "Cooldown: " + game.factory.time.toFixed(1);
                    }
                }, 0.2, y, 0.04, "#000000", { halign: "left", valign: "middle" })
            ], isVisible);
    }
}


class UIUpgrade3 extends UIGroup {
    constructor(upg, img, priceSuffix, y, desc, priceSize, col, isVisible, displayLevel, doround = true) {
        super(
            [
                new UIRect(0.5, y, 1, 0.1, col ? col : "table"),
                new UIButton(0.1, y, 0.07, 0.07, img, () => upg.buy(doround), { quadratic: true }),
                new UIText(() => displayLevel ? (upg.level + "/" + (upg.getMaxLevel() === Infinity ? "∞" : upg.getMaxLevel().toLocaleString("en-us"))) : "", 0.975, y - 0.04, 0.04, "#000000", { halign: "right" }),
                new UIText(() => upg.getPriceDisplay(priceSuffix, "", false), 0.975, y, priceSize, "#000000", { halign: "right", valign: "middle", bold: true }),
                new UIText(() => desc + "\n" +
                    upg.getEffectDisplay(), 0.2, y, 0.04, "#000000", { halign: "left", valign: "middle" }),
                new UIText(() => upg.time == "b" ? "" : Math.round(upg.time) + "", 0.8, y + 0.04, 0.04, "#000000", { halign: "right", valign: "bottom" }),
                new UIButton(0.88, y + 0.03, 0.04, 0.04, images.onoffbutton, () => autoToggle(upg), { quadratic: true, isVisible: () => upg.level > 0 && upg.time != "b" }),
            ], isVisible);
    }
}

class UIMagnetUpgrade extends UIUpgrade
{
    constructor(upg, img, y, desc, col, isVisible)
    {
        super(upg, img, "$images.magnet$", y, desc, 0.05, col, isVisible, true);
    }
}

class UIGoldenScrapUpgrade extends UIUpgrade
{
    constructor(upg, img, y, desc, col)
    {
        super(upg, img, "$images.goldenScrap$", y, desc, 0.05, col, () => true, true);
    }
}

class UIMergeTokenUpgrade extends UIGroup
{
    constructor(upg, img, y, desc, col, isVisible)
    {
        super([
            new UIRect(0.5, y, 1, 0.1, col ? col : "table"),
            new UIButton(0.1, y, 0.07, 0.07, img, () => upg.buy(true), {quadratic: true}),
            new UIText(() => upg.getPriceDisplay("$images.mergeToken$", "", false), 0.975, y + 0.0125, 0.065, "black", {bold: true, halign: "right", valign: "middle"}),
            new UIText(() => desc + "\n" + upg.getEffectDisplay(), 0.2, y, 0.04, "black", {halign: "left", valign: "middle"}),
            new UIText(() => upg.getLevelDisplay(), 0.975, y - 0.045, 0.04, "black", {
                halign: "right",
                bold: true
            })
        ], isVisible);
    }
}

class UIBrickUpgrade extends UIUpgrade
{
    constructor(upg, img, y, desc, col, doround)
    {
        super(upg, img, "$images.brick$", y, desc, 0.05, col, false);
    }
}

class UITireUpgrade extends UIGroup{
    constructor(upg, img, title, x, y, col) {
        super([
            new UIRect(x, y, 1 / 3, 0.225, col ? col : "table"),
            new UIText(title, x, y - 0.075, 0.04, "black", {bold: true, valign: "middle"}),
            new UIButton(x, y, 0.06, 0.06, img, () => upg.buy(), {quadratic: true}),
            new UIText(() => upg.getPriceDisplay("", "$images.tire$", false), x, y + 0.04, 0.05, "black"),
            new UIText(() => upg.getEffectDisplay(), x, y + 0.07, 0.03, "black")
        ]);
    }
}

class UIFragmentUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.fragment$", y, desc, 0.05, col, isVisible, true, true);
    }
}

class UIDarkFragmentUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.darkfragment$", y, desc, 0.05, col, isVisible, true, true);
    }
}

class UIDarkScrapUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.darkscrap$", y, desc, 0.05, col, isVisible, true, true);
    }
}

class UIBeamUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.beam$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIAerobeamUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.aerobeam$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIWrenchUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.wrench$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIAngelBeamUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.angelbeam$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIReinforcedBeamUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.reinforcedbeam$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIGlitchBeamUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.glitchbeam$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIPlasticBagUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.plasticBag$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIScrewUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.screw$", y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIFactoryUpgrade extends UIUpgrade2 {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.steelMagnet$", y, desc, 0.05, col, isVisible, false, true);
    }
}
class UIAutoUpgrade extends UIUpgrade3 {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, getResourceImage(upg.currency), y, desc, 0.05, col, isVisible, true, true);
    }
}
class UIMasteryUpgrade extends UIUpgrade {
    constructor(upg, img, y, desc, col, isVisible) {
        super(upg, img, "$images.masteryToken$", y, desc, 0.05, col, isVisible, true, true);
    }
}

class UISkillTreeUpgrade extends UIGroup{
    constructor(upg, img, title, x, y, col)
    {
        super([
            new UIRect(x, y + 0.04, 0.25, 0.25, col ? col : "table"),
            new UIButton(x, y + 0.04, 0.075, 0.075, img, () => upg.buy(), {quadratic: true}),
            new UIText(title, x, y - 0.04, title.split("\n").length < 3 ? 0.035 : 0.03, "black", {bold: true, valign: "middle"}),
            new UIText(() => upg.getPriceDisplay(), x, y + 0.085, 0.035, "black", {bold: true, valign: "top"}),
            new UIText(() => upg.getEffectDisplay(), x, y + 0.14, 0.03, "black", {valign: "top"}),
        ], () => upg.isUnlocked());
    }
}

class UISkillTreeUpgradeNoBG extends UIGroup{
    constructor(upg, img, title, x, y, col)
    {
        super([
            new UIButton(x, y + 0.04, 0.075, 0.075, img, () => upg.buy(), {quadratic: true}),
            new UIText(title, x, y - 0.04, title.split("\n").length < 3 ? 0.045 : 0.035, col ? col : "black", {bold: true, valign: "middle"}),
            new UIText(() => upg.getPriceDisplay(), x, y + 0.085, 0.035, "black", {bold: true, valign: "top"}),
            new UIText(() => upg.getEffectDisplay(), x, y + 0.14, 0.03, "black", {valign: "top"}),
        ], () => upg.isUnlocked());
    }
}

class UIPlanet extends UIGroup
{
    constructor(x, y, title, upg, suffix, image, size, isVisible)
    {
        let s = size ? size : 0.05;
        super([
            new UIText(title, x, y - 0.005 - size / 2, 0.0325, "white", {valign: "bottom"}),
            new UIButton(x, y, s, s, image, () => upg.buy(), {quadratic: true}),
            new UIText(() => upg.getPriceDisplay(suffix, "", false), x, y + size / 2, 0.04, "white"),
            new UIText(() => upg.getEffectDisplay(), x, y + 0.0225 + size / 2, 0.0275, "white"),
        ], isVisible !== undefined ? isVisible : () => true);
    }
}

class UIToggleOption extends UIGroup
{
    constructor(y, prop, desc, color)
    {
        super([
            new UIRect(0.5, y, 1, 0.1, color ? color : "table"),
            new UICheckbox(0.1, y, 0.07, 0.07, prop, {
                quadratic: true
            }),
            new UIText(desc, 0.2, y, 0.04, "black", {
                halign: "left",
                valign: "middle"
            }),
        ]);
    }
}

class UIOption extends UIGroup
{
    constructor(y, image, onclick, desc, color)
    {
        super([
            new UIRect(0.5, y, 1, 0.1, color ? color : "table"),
            new UIButton(0.1, y, 0.07, 0.07, image, onclick, {quadratic: true}),
            new UIText(desc, 0.2, y, 0.04, "black", {
                halign: "left",
                valign: "middle"
            })
        ])
    }
}
