class Utils
{
    static roundN(n, digits)
    {
        return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
    }

    static roundBase(d, digits)
    {
        let mantissa = d.m;
        let newD = new Decimal(Utils.roundN(mantissa, digits)).mul(Decimal.pow(10, d.e));
        return newD;
    }

    static clamp(v, min, max)
    {
        return Math.max(min, Math.min(max, v));
    }

    static drawEscapedText(ctx, text, x, y, textSize, maxWidth) //supports \n, \t etc.
    {
        let lines = text.split("\n");
        ctx.font = (w * textSize) + "px " + fonts.default;
        for (let [i, l] of lines.entries())
        {
            l = l.replace("\t", "    ");
            ctx.fillText(l, x, y + i * textSize * w, maxWidth);
        }
    }

    static drawRichTextLine(ctx, text, x, y, size, config)
    {
        let font = config && config.font ? config.font : fonts.default;

        if(config && config.bold)
        {
            if(typeof config.bold === "boolean")
            {
                ctx.font = (config.bold === true ? "bold " : "") + (size * w) + "px " + font;
            }
            else
            {
                ctx.font = config.bold + " " + (size * w) + "px " + font;
            }
        }
        else
        {
            ctx.font = (size * w) + "px " + font;
        }

        ctx.fillStyle = config && config.color ? config.color : ctx.fillStyle;
        ctx.strokeStyle = config && config.borderColor ? config.borderColor : "black";
        ctx.textAlign = "left";
        let align = config && config.halign ? config.halign : "left";
        let alignV =  config && config.valign ? config.valign : "top";
        ctx.textBaseline = "top";

        let bSize = config && config.borderSize !== undefined ? config.borderSize * w : 0;
        ctx.lineWidth = config && config.borderSize !== undefined && bSize > 0 ? config.borderSize * w : 0;

        let xOff = 0;
        let yOff = 0;

        let tags = {
            images: text.match(/\$.*?\$/g) !== null ? text.match(/\$.*?\$/g).map(s => s.replace(/\$/g, "")) : []
        };

        x = x * w;
        y = y * h;

        let inTag = false;
        let tagIdx = 0;
        let drawnTags = 0;

        let width = 0;
        for(let c of gSplitter.splitGraphemes(text.replace(/\$.*?\$/g, "")))
        {
            width += ctx.measureText(c).width;
        }
        width += size * w * tags.images.length;

        if(align === "center")
        {
            xOff -= width / 2;
        }
        else if(align === "right")
        {
            xOff -= width;
        }

        if(alignV === "middle")
        {
            yOff -= 0;
        }
        else if(alignV === "bottom")
        {
            yOff -= size * w;
        }

        if(/\$/g.test(text))
        {
            for (let c of gSplitter.splitGraphemes(text))
            {
                if (c === "$")
                {
                    if (inTag)
                    {
                        tagIdx++;
                    }
                    inTag = !inTag;
                }
                else if (!inTag)
                {
                    ctx.fillText(c, x + xOff, y);
                    if(bSize > 0)
                    {
                        ctx.strokeText(c, x + xOff, y);
                    }
                    xOff += ctx.measureText(c).width;
                }
                else if (drawnTags <= tagIdx)
                {
                    let img = eval(tags.images[tagIdx]);
                    if(img !== undefined)
                    {
                        let s = size * w * 0.75;
                        ctx.drawImage(img, x + xOff, y + yOff - s / 2 + size * w / 2, s, s); //center the image to the text
                        xOff += s;
                    }
                    drawnTags++;
                }
            }
        }
        else
        {
            for(let line of text.split("\n"))
            {
                ctx.fillText(line, x + xOff, y);
                if(bSize > 0)
                {
                    ctx.strokeText(line, x + xOff, y);
                }
            }
        }

        ctx.lineWidth = 0;
    }

    static drawRichText(ctx, text, x, y, size, config)
    {
        let lines = text.split("\n");
        let l = 0;
        let yOffBase = config.valign === "top" ? 0 : (config.valign === "middle" ? -0.5 : -1);
        let yOff = size * (w / h) * lines.length * yOffBase;
        for(let line of lines)
        {
            Utils.drawRichTextLine(ctx, line, x, y + size * (w / h) * l + yOff, size, config);
            l++;
        }
    }

    static setCanvasShadow(ctx, color, radius, x, y)
    {
        ctx.shadowColor = color;
        ctx.shadowBlur = radius;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }

    static removeCanvasShadow()
    {
        ctx.shadowColor = "#00000000";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    static filterObject(obj, fn)
    {
        let arr = [];
        for(let k in obj)
        {
            arr.push(obj[k]);
        }
        return arr.filter(fn);
    }

    static copyToClipboard(text)
    {
        let area = document.body.appendChild(document.createElement("textarea"));
        area.value = text;
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    }
}
