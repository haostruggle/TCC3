var Kinetic = {};
(function () {
    Kinetic.version = "4.3.3";
    Kinetic.Filters = {};
    Kinetic.Plugins = {};
    Kinetic.Global = {stages: [], idCounter: 0, ids: {}, names: {}, shapes: {}, warn: function (a) {
        window.console && console.warn && console.warn("Kinetic warning: " + a)
    }, extend: function (a, c) {
        for (var d in c.prototype)d in a.prototype || (a.prototype[d] = c.prototype[d])
    }, _addId: function (a, c) {
        void 0 !== c && (this.ids[c] = a)
    }, _removeId: function (a) {
        void 0 !== a && delete this.ids[a]
    }, _addName: function (a, c) {
        void 0 !== c && (void 0 === this.names[c] && (this.names[c] = []),
            this.names[c].push(a))
    }, _removeName: function (a, c) {
        if (void 0 !== a) {
            var d = this.names[a];
            if (void 0 !== d) {
                for (var b = 0; b < d.length; b++)d[b]._id === c && d.splice(b, 1);
                0 === d.length && delete this.names[a]
            }
        }
    }}
})();
(function (a, c) {
    "object" === typeof exports ? module.exports = c() : "function" === typeof define && define.amd ? define(c) : a.returnExports = c()
})(this, function () {
    return Kinetic
});
(function () {
    Kinetic.Type = {_isElement: function (a) {
        return!!(a && 1 == a.nodeType)
    }, _isFunction: function (a) {
        return!(!a || !a.constructor || !a.call || !a.apply)
    }, _isObject: function (a) {
        return!!a && a.constructor == Object
    }, _isArray: function (a) {
        return"[object Array]" == Object.prototype.toString.call(a)
    }, _isNumber: function (a) {
        return"[object Number]" == Object.prototype.toString.call(a)
    }, _isString: function (a) {
        return"[object String]" == Object.prototype.toString.call(a)
    }, _hasMethods: function (a) {
        var c = [], d;
        for (d in a)this._isFunction(a[d]) &&
        c.push(d);
        return 0 < c.length
    }, _isInDocument: function (a) {
        for (; a = a.parentNode;)if (a == document)return!0;
        return!1
    }, _getXY: function (a) {
        if (this._isNumber(a))return{x: a, y: a};
        if (this._isArray(a))if (1 === a.length) {
            a = a[0];
            if (this._isNumber(a))return{x: a, y: a};
            if (this._isArray(a))return{x: a[0], y: a[1]};
            if (this._isObject(a))return a
        } else {
            if (2 <= a.length)return{x: a[0], y: a[1]}
        } else if (this._isObject(a))return a;
        return null
    }, _getSize: function (a) {
        if (this._isNumber(a))return{width: a, height: a};
        if (this._isArray(a))if (1 ===
            a.length) {
            a = a[0];
            if (this._isNumber(a))return{width: a, height: a};
            if (this._isArray(a)) {
                if (4 <= a.length)return{width: a[2], height: a[3]};
                if (2 <= a.length)return{width: a[0], height: a[1]}
            } else if (this._isObject(a))return a
        } else {
            if (4 <= a.length)return{width: a[2], height: a[3]};
            if (2 <= a.length)return{width: a[0], height: a[1]}
        } else if (this._isObject(a))return a;
        return null
    }, _getPoints: function (a) {
        if (void 0 === a)return[];
        if (this._isArray(a[0])) {
            for (var c = [], d = 0; d < a.length; d++)c.push({x: a[d][0], y: a[d][1]});
            return c
        }
        if (this._isObject(a[0]))return a;
        c = [];
        for (d = 0; d < a.length; d += 2)c.push({x: a[d], y: a[d + 1]});
        return c
    }, _getImage: function (a, c) {
        if (a)if (this._isElement(a))c(a); else if (this._isString(a)) {
            var d = new Image;
            d.onload = function () {
                c(d)
            };
            d.src = a
        } else if (a.data) {
            var b = document.createElement("canvas");
            b.width = a.width;
            b.height = a.height;
            b.getContext("2d").putImageData(a, 0, 0);
            b = b.toDataURL();
            d = new Image;
            d.onload = function () {
                c(d)
            };
            d.src = b
        } else c(null); else c(null)
    }, _rgbToHex: function (a, c, d) {
        return(16777216 + (a << 16) + (c << 8) + d).toString(16).slice(1)
    }, _hexToRgb: function (a) {
        a =
            parseInt(a, 16);
        return{r: a >> 16 & 255, g: a >> 8 & 255, b: a & 255}
    }, _getRandomColorKey: function () {
        var a = Math.round(255 * Math.random()), c = Math.round(255 * Math.random()), d = Math.round(255 * Math.random());
        return this._rgbToHex(a, c, d)
    }, _merge: function (a, c) {
        var d = this._clone(c), b;
        for (b in a)this._isObject(a[b]) ? d[b] = this._merge(a[b], d[b]) : d[b] = a[b];
        return d
    }, _clone: function (a) {
        var c = {}, d;
        for (d in a)this._isObject(a[d]) ? c[d] = this._clone(a[d]) : c[d] = a[d];
        return c
    }, _degToRad: function (a) {
        return a * Math.PI / 180
    }, _radToDeg: function (a) {
        return 180 *
            a / Math.PI
    }}
})();
(function () {
    var a = document.createElement("canvas").getContext("2d"), c = (window.devicePixelRatio || 1) / (a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1);
    Kinetic.Canvas = function (a, b, f) {
        this.pixelRatio = f || c;
        this.width = a;
        this.height = b;
        this.element = document.createElement("canvas");
        this.context = this.element.getContext("2d");
        this.setSize(a || 0, b || 0)
    };
    Kinetic.Canvas.prototype = {clear: function () {
        var a = this.getContext(),
            b = this.getElement();
        a.clearRect(0, 0, b.width, b.height)
    }, getElement: function () {
        return this.element
    }, getContext: function () {
        return this.context
    }, setWidth: function (a) {
        this.width = a;
        this.element.width = a * this.pixelRatio;
        this.element.style.width = a + "px"
    }, setHeight: function (a) {
        this.height = a;
        this.element.height = a * this.pixelRatio;
        this.element.style.height = a + "px"
    }, getWidth: function () {
        return this.width
    }, getHeight: function () {
        return this.height
    }, setSize: function (a, b) {
        this.setWidth(a);
        this.setHeight(b)
    }, toDataURL: function (a, b) {
        try {
            return this.element.toDataURL(a, b)
        } catch (f) {
            try {
                return this.element.toDataURL()
            } catch (c) {
                return Kinetic.Global.warn("Unable to get data URL. " + c.message), ""
            }
        }
    }, fill: function (a) {
        a.getFillEnabled() && this._fill(a)
    }, stroke: function (a) {
        a.getStrokeEnabled() && this._stroke(a)
    }, fillStroke: function (a) {
        var b = a.getFillEnabled();
        b && this._fill(a);
        a.getStrokeEnabled() && this._stroke(a, a.hasShadow() && a.hasFill() && b)
    }, applyShadow: function (a, b) {
        var f = this.context;
        f.save();
        this._applyShadow(a);
        b();
        f.restore();
        b()
    }, _applyLineCap: function (a) {
        if (a = a.getLineCap())this.context.lineCap = a
    }, _applyOpacity: function (a) {
        a = a.getAbsoluteOpacity();
        1 !== a && (this.context.globalAlpha = a)
    }, _applyLineJoin: function (a) {
        if (a = a.getLineJoin())this.context.lineJoin = a
    }, _applyAncestorTransforms: function (a) {
        var b = this.context;
        a._eachAncestorReverse(function (a) {
            a = a.getTransform().getMatrix();
            b.transform(a[0], a[1], a[2], a[3], a[4], a[5])
        }, !0)
    }};
    Kinetic.SceneCanvas = function (a, b, c) {
        Kinetic.Canvas.call(this, a, b, c)
    };
    Kinetic.SceneCanvas.prototype =
    {setWidth: function (a) {
        var b = this.pixelRatio;
        Kinetic.Canvas.prototype.setWidth.call(this, a);
        this.context.scale(b, b)
    }, setHeight: function (a) {
        var b = this.pixelRatio;
        Kinetic.Canvas.prototype.setHeight.call(this, a);
        this.context.scale(b, b)
    }, _fillColor: function (a) {
        var b = this.context, c = a.getFill();
        b.fillStyle = c;
        a._fillFunc(b)
    }, _fillPattern: function (a) {
        var b = this.context, c = a.getFillPatternImage(), e = a.getFillPatternX(), g = a.getFillPatternY(), h = a.getFillPatternScale(), l = a.getFillPatternRotation(), k = a.getFillPatternOffset();
        a = a.getFillPatternRepeat();
        if (e || g)b.translate(e || 0, g || 0);
        l && b.rotate(l);
        h && b.scale(h.x, h.y);
        k && b.translate(-1 * k.x, -1 * k.y);
        b.fillStyle = b.createPattern(c, a || "repeat");
        b.fill()
    }, _fillLinearGradient: function (a) {
        var b = this.context, c = a.getFillLinearGradientStartPoint(), e = a.getFillLinearGradientEndPoint();
        a = a.getFillLinearGradientColorStops();
        c = b.createLinearGradient(c.x, c.y, e.x, e.y);
        for (e = 0; e < a.length; e += 2)c.addColorStop(a[e], a[e + 1]);
        b.fillStyle = c;
        b.fill()
    }, _fillRadialGradient: function (a) {
        var b = this.context,
            c = a.getFillRadialGradientStartPoint(), e = a.getFillRadialGradientEndPoint(), g = a.getFillRadialGradientStartRadius(), h = a.getFillRadialGradientEndRadius();
        a = a.getFillRadialGradientColorStops();
        c = b.createRadialGradient(c.x, c.y, g, e.x, e.y, h);
        for (e = 0; e < a.length; e += 2)c.addColorStop(a[e], a[e + 1]);
        b.fillStyle = c;
        b.fill()
    }, _fill: function (a, b) {
        var c = this.context, e = a.getFill(), g = a.getFillPatternImage(), h = a.getFillLinearGradientStartPoint(), l = a.getFillRadialGradientStartPoint(), k = a.getFillPriority();
        c.save();
        !b && a.hasShadow() &&
        this._applyShadow(a);
        e && "color" === k ? this._fillColor(a) : g && "pattern" === k ? this._fillPattern(a) : h && "linear-gradient" === k ? this._fillLinearGradient(a) : l && "radial-gradient" === k ? this._fillRadialGradient(a) : e ? this._fillColor(a) : g ? this._fillPattern(a) : h ? this._fillLinearGradient(a) : l && this._fillRadialGradient(a);
        c.restore();
        !b && a.hasShadow() && this._fill(a, !0)
    }, _stroke: function (a, b) {
        var c = this.context, e = a.getStroke(), g = a.getStrokeWidth(), h = a.getDashArray();
        if (e || g)c.save(), this._applyLineCap(a), h && a.getDashArrayEnabled() &&
            (c.setLineDash ? c.setLineDash(h) : "mozDash"in c ? c.mozDash = h : "webkitLineDash"in c && (c.webkitLineDash = h)), !b && a.hasShadow() && this._applyShadow(a), c.lineWidth = g || 2, c.strokeStyle = e || "black", a._strokeFunc(c), c.restore(), !b && a.hasShadow() && this._stroke(a, !0)
    }, _applyShadow: function (a) {
        var b = this.context;
        if (a.hasShadow() && a.getShadowEnabled()) {
            var c = a.getAbsoluteOpacity(), e = a.getShadowColor() || "black", g = a.getShadowBlur() || 5, h = a.getShadowOffset() || {x: 0, y: 0};
            a.getShadowOpacity() && (b.globalAlpha = a.getShadowOpacity() *
                c);
            b.shadowColor = e;
            b.shadowBlur = g;
            b.shadowOffsetX = h.x;
            b.shadowOffsetY = h.y
        }
    }};
    Kinetic.Global.extend(Kinetic.SceneCanvas, Kinetic.Canvas);
    Kinetic.HitCanvas = function (a, b, c) {
        Kinetic.Canvas.call(this, a, b, c)
    };
    Kinetic.HitCanvas.prototype = {_fill: function (a) {
        var b = this.context;
        b.save();
        b.fillStyle = "#" + a.colorKey;
        a._fillFuncHit(b);
        b.restore()
    }, _stroke: function (a) {
        var b = this.context, c = a.getStroke(), e = a.getStrokeWidth();
        if (c || e)this._applyLineCap(a), b.save(), b.lineWidth = e || 2, b.strokeStyle = "#" + a.colorKey, a._strokeFuncHit(b),
            b.restore()
    }};
    Kinetic.Global.extend(Kinetic.HitCanvas, Kinetic.Canvas)
})();
(function () {
    Kinetic.Tween = function (a, c, d, b, f, e) {
        this._listeners = [];
        this.addListener(this);
        this.obj = a;
        this.propFunc = c;
        this._pos = this.begin = b;
        this.setDuration(e);
        this.isPlaying = !1;
        this.prevPos = this.prevTime = this._change = 0;
        this.looping = !1;
        this._finish = this._startTime = this._position = this._time = 0;
        this.name = "";
        this.func = d;
        this.setFinish(f)
    };
    Kinetic.Tween.prototype = {setTime: function (a) {
        this.prevTime = this._time;
        a > this.getDuration() ? this.looping ? (this.rewind(a - this._duration), this.update(), this.broadcastMessage("onLooped",
            {target: this, type: "onLooped"})) : (this._time = this._duration, this.update(), this.stop(), this.broadcastMessage("onFinished", {target: this, type: "onFinished"})) : (0 > a ? this.rewind() : this._time = a, this.update())
    }, getTime: function () {
        return this._time
    }, setDuration: function (a) {
        this._duration = null === a || 0 >= a ? 1E5 : a
    }, getDuration: function () {
        return this._duration
    }, setPosition: function (a) {
        this.prevPos = this._pos;
        this.propFunc(a);
        this._pos = a;
        this.broadcastMessage("onChanged", {target: this, type: "onChanged"})
    }, getPosition: function (a) {
        void 0 ===
            a && (a = this._time);
        return this.func(a, this.begin, this._change, this._duration)
    }, setFinish: function (a) {
        this._change = a - this.begin
    }, getFinish: function () {
        return this.begin + this._change
    }, start: function () {
        this.rewind();
        this.startEnterFrame();
        this.broadcastMessage("onStarted", {target: this, type: "onStarted"})
    }, rewind: function (a) {
        this.stop();
        this._time = void 0 === a ? 0 : a;
        this.fixTime();
        this.update()
    }, fforward: function () {
        this._time = this._duration;
        this.fixTime();
        this.update()
    }, update: function () {
        this.setPosition(this.getPosition(this._time))
    },
        startEnterFrame: function () {
            this.stopEnterFrame();
            this.isPlaying = !0;
            this.onEnterFrame()
        }, onEnterFrame: function () {
            this.isPlaying && this.nextFrame()
        }, nextFrame: function () {
            this.setTime((this.getTimer() - this._startTime) / 1E3)
        }, stop: function () {
            this.stopEnterFrame();
            this.broadcastMessage("onStopped", {target: this, type: "onStopped"})
        }, stopEnterFrame: function () {
            this.isPlaying = !1
        }, continueTo: function (a, c) {
            this.begin = this._pos;
            this.setFinish(a);
            void 0 !== this._duration && this.setDuration(c);
            this.start()
        }, resume: function () {
            this.fixTime();
            this.startEnterFrame();
            this.broadcastMessage("onResumed", {target: this, type: "onResumed"})
        }, yoyo: function () {
            this.continueTo(this.begin, this._time)
        }, addListener: function (a) {
            this.removeListener(a);
            return this._listeners.push(a)
        }, removeListener: function (a) {
            for (var c = this._listeners, d = c.length; d--;)if (c[d] == a)return c.splice(d, 1), !0;
            return!1
        }, broadcastMessage: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a.push(arguments[c]);
            for (var d = a.shift(), b = this._listeners, f = b.length, c = 0; c < f; c++)b[c][d] && b[c][d].apply(b[c],
                a)
        }, fixTime: function () {
            this._startTime = this.getTimer() - 1E3 * this._time
        }, getTimer: function () {
            return(new Date).getTime() - this._time
        }};
    Kinetic.Tweens = {"back-ease-in": function (a, c, d, b, f, e) {
        return d * (a /= b) * a * (2.70158 * a - 1.70158) + c
    }, "back-ease-out": function (a, c, d, b, f, e) {
        return d * ((a = a / b - 1) * a * (2.70158 * a + 1.70158) + 1) + c
    }, "back-ease-in-out": function (a, c, d, b, f, e) {
        f = 1.70158;
        return 1 > (a /= b / 2) ? d / 2 * a * a * (((f *= 1.525) + 1) * a - f) + c : d / 2 * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + c
    }, "elastic-ease-in": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 ===
            a)return c;
        if (1 == (a /= b))return c + d;
        e || (e = 0.3 * b);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return-(f * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e)) + c
    }, "elastic-ease-out": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 === a)return c;
        if (1 == (a /= b))return c + d;
        e || (e = 0.3 * b);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return f * Math.pow(2, -10 * a) * Math.sin((a * b - g) * 2 * Math.PI / e) + d + c
    }, "elastic-ease-in-out": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 === a)return c;
        if (2 == (a /= b / 2))return c + d;
        e ||
        (e = b * 0.3 * 1.5);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return 1 > a ? -0.5 * f * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e) + c : 0.5 * f * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e) + d + c
    }, "bounce-ease-out": function (a, c, d, b) {
        return(a /= b) < 1 / 2.75 ? d * 7.5625 * a * a + c : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
    }, "bounce-ease-in": function (a, c, d, b) {
        return d - Kinetic.Tweens["bounce-ease-out"](b - a, 0, d, b) +
            c
    }, "bounce-ease-in-out": function (a, c, d, b) {
        return a < b / 2 ? 0.5 * Kinetic.Tweens["bounce-ease-in"](2 * a, 0, d, b) + c : 0.5 * Kinetic.Tweens["bounce-ease-out"](2 * a - b, 0, d, b) + 0.5 * d + c
    }, "ease-in": function (a, c, d, b) {
        return d * (a /= b) * a + c
    }, "ease-out": function (a, c, d, b) {
        return-d * (a /= b) * (a - 2) + c
    }, "ease-in-out": function (a, c, d, b) {
        return 1 > (a /= b / 2) ? d / 2 * a * a + c : -d / 2 * (--a * (a - 2) - 1) + c
    }, "strong-ease-in": function (a, c, d, b) {
        return d * (a /= b) * a * a * a * a + c
    }, "strong-ease-out": function (a, c, d, b) {
        return d * ((a = a / b - 1) * a * a * a * a + 1) + c
    }, "strong-ease-in-out": function (a, c, d, b) {
        return 1 > (a /= b / 2) ? d / 2 * a * a * a * a * a + c : d / 2 * ((a -= 2) * a * a * a * a + 2) + c
    }, linear: function (a, c, d, b) {
        return d * a / b + c
    }}
})();
(function () {
    Kinetic.Transform = function () {
        this.m = [1, 0, 0, 1, 0, 0]
    };
    Kinetic.Transform.prototype = {translate: function (a, c) {
        this.m[4] += this.m[0] * a + this.m[2] * c;
        this.m[5] += this.m[1] * a + this.m[3] * c
    }, scale: function (a, c) {
        this.m[0] *= a;
        this.m[1] *= a;
        this.m[2] *= c;
        this.m[3] *= c
    }, rotate: function (a) {
        var c = Math.cos(a);
        a = Math.sin(a);
        var d = this.m[1] * c + this.m[3] * a, b = this.m[0] * -a + this.m[2] * c, f = this.m[1] * -a + this.m[3] * c;
        this.m[0] = this.m[0] * c + this.m[2] * a;
        this.m[1] = d;
        this.m[2] = b;
        this.m[3] = f
    }, getTranslation: function () {
        return{x: this.m[4],
            y: this.m[5]}
    }, multiply: function (a) {
        var c = this.m[1] * a.m[0] + this.m[3] * a.m[1], d = this.m[0] * a.m[2] + this.m[2] * a.m[3], b = this.m[1] * a.m[2] + this.m[3] * a.m[3], f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4], e = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
        this.m[0] = this.m[0] * a.m[0] + this.m[2] * a.m[1];
        this.m[1] = c;
        this.m[2] = d;
        this.m[3] = b;
        this.m[4] = f;
        this.m[5] = e
    }, invert: function () {
        var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), c = -this.m[1] * a, d = -this.m[2] * a, b = this.m[0] * a, f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
            e = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = this.m[3] * a;
        this.m[1] = c;
        this.m[2] = d;
        this.m[3] = b;
        this.m[4] = f;
        this.m[5] = e
    }, getMatrix: function () {
        return this.m
    }}
})();
(function () {
    Kinetic.Collection = function () {
        var a = [].slice.call(arguments), c = a.length, d = 0;
        for (this.length = c; d < c; d++)this[d] = a[d];
        return this
    };
    Kinetic.Collection.prototype = [];
    Kinetic.Collection.prototype.apply = function (a) {
        args = [].slice.call(arguments);
        args.shift();
        for (var c = 0; c < this.length; c++)Kinetic.Type._isFunction(this[c][a]) && this[c][a].apply(this[c], args)
    };
    Kinetic.Collection.prototype.each = function (a) {
        for (var c = 0; c < this.length; c++)a.call(this[c], c, this[c])
    }
})();
(function () {
    Kinetic.Filters.Grayscale = function (a, c) {
        for (var d = a.data, b = 0; b < d.length; b += 4) {
            var f = 0.34 * d[b] + 0.5 * d[b + 1] + 0.16 * d[b + 2];
            d[b] = f;
            d[b + 1] = f;
            d[b + 2] = f
        }
    }
})();
(function () {
    Kinetic.Filters.Brighten = function (a, c) {
        for (var d = c.val || 0, b = a.data, f = 0; f < b.length; f += 4)b[f] += d, b[f + 1] += d, b[f + 2] += d
    }
})();
(function () {
    Kinetic.Filters.Invert = function (a, c) {
        for (var d = a.data, b = 0; b < d.length; b += 4)d[b] = 255 - d[b], d[b + 1] = 255 - d[b + 1], d[b + 2] = 255 - d[b + 2]
    }
})();
(function () {
    Kinetic.Node = function (a) {
        this._nodeInit(a)
    };
    Kinetic.Node.prototype = {_nodeInit: function (a) {
        this._id = Kinetic.Global.idCounter++;
        this.defaultNodeAttrs = {visible: !0, listening: !0, name: void 0, opacity: 1, x: 0, y: 0, scale: {x: 1, y: 1}, rotation: 0, offset: {x: 0, y: 0}, draggable: !1, dragOnTop: !0};
        this.setDefaultAttrs(this.defaultNodeAttrs);
        this.eventListeners = {};
        this.setAttrs(a)
    }, on: function (a, b) {
        for (var c = a.split(" "), e = c.length, g = 0; g < e; g++) {
            var h = c[g].split("."), l = h[0], h = 1 < h.length ? h[1] : "";
            this.eventListeners[l] ||
            (this.eventListeners[l] = []);
            this.eventListeners[l].push({name: h, handler: b})
        }
    }, off: function (a) {
        a = a.split(" ");
        for (var b = a.length, c = 0; c < b; c++) {
            var e = a[c], g = e.split("."), h = g[0];
            if (1 < g.length)if (h)this.eventListeners[h] && this._off(h, g[1]); else for (e in this.eventListeners)this._off(e, g[1]); else delete this.eventListeners[h]
        }
    }, remove: function () {
        var a = this.getParent();
        a && a.children && (a.children.splice(this.index, 1), a._setChildrenIndices());
        delete this.parent
    }, destroy: function () {
        this.getParent();
        this.getStage();
        for (var a = Kinetic.DD, b = Kinetic.Global; this.children && 0 < this.children.length;)this.children[0].destroy();
        b._removeId(this.getId());
        b._removeName(this.getName(), this._id);
        a && (a.node && a.node._id === this._id) && node._endDrag();
        this.trans && this.trans.stop();
        this.remove()
    }, getAttrs: function () {
        return this.attrs
    }, setDefaultAttrs: function (a) {
        void 0 === this.attrs && (this.attrs = {});
        if (a)for (var b in a)void 0 === this.attrs[b] && (this.attrs[b] = a[b])
    }, setAttrs: function (a) {
        if (a)for (var b in a) {
            var c = "set" + b.charAt(0).toUpperCase() +
                b.slice(1);
            if (Kinetic.Type._isFunction(this[c]))this[c](a[b]); else this.setAttr(b, a[b])
        }
    }, getVisible: function () {
        var a = this.attrs.visible, b = this.getParent();
        return a && b && !b.getVisible() ? !1 : a
    }, getListening: function () {
        var a = this.attrs.listening, b = this.getParent();
        return a && b && !b.getListening() ? !1 : a
    }, show: function () {
        this.setVisible(!0)
    }, hide: function () {
        this.setVisible(!1)
    }, getZIndex: function () {
        return this.index
    }, getAbsoluteZIndex: function () {
        function a(g) {
            for (var h = [], l = g.length, k = 0; k < l; k++) {
                var m = g[k];
                e++;
                "Shape" !== m.nodeType && (h = h.concat(m.getChildren()));
                m._id === c._id && (k = l)
            }
            0 < h.length && h[0].getLevel() <= b && a(h)
        }

        var b = this.getLevel();
        this.getStage();
        var c = this, e = 0;
        "Stage" !== c.nodeType && a(c.getStage().getChildren());
        return e
    }, getLevel: function () {
        for (var a = 0, b = this.parent; b;)a++, b = b.parent;
        return a
    }, setPosition: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments));
        this.setAttr("x", a.x);
        this.setAttr("y", a.y)
    }, getPosition: function () {
        var a = this.attrs;
        return{x: a.x, y: a.y}
    }, getAbsolutePosition: function () {
        var a =
            this.getAbsoluteTransform(), b = this.getOffset();
        a.translate(b.x, b.y);
        return a.getTranslation()
    }, setAbsolutePosition: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments)), b = this._clearTransform();
        this.attrs.x = b.x;
        this.attrs.y = b.y;
        delete b.x;
        delete b.y;
        var c = this.getAbsoluteTransform();
        c.invert();
        c.translate(a.x, a.y);
        a = {x: this.attrs.x + c.getTranslation().x, y: this.attrs.y + c.getTranslation().y};
        this.setPosition(a.x, a.y);
        this._setTransform(b)
    }, move: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments)),
            b = this.getX(), c = this.getY();
        void 0 !== a.x && (b += a.x);
        void 0 !== a.y && (c += a.y);
        this.setPosition(b, c)
    }, _eachAncestorReverse: function (a, b) {
        var c = [], e = this.getParent();
        for (b && c.unshift(this); e;)c.unshift(e), e = e.parent;
        for (var e = c.length, g = 0; g < e; g++)a(c[g])
    }, rotate: function (a) {
        this.setRotation(this.getRotation() + a)
    }, rotateDeg: function (a) {
        this.setRotation(this.getRotation() + Kinetic.Type._degToRad(a))
    }, moveToTop: function () {
        this.parent.children.splice(this.index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
        return!0
    }, moveUp: function () {
        var a = this.index, b = this.parent.getChildren().length;
        if (a < b - 1)return this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices(), !0
    }, moveDown: function () {
        var a = this.index;
        if (0 < a)return this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices(), !0
    }, moveToBottom: function () {
        var a = this.index;
        if (0 < a)return this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(),
            !0
    }, setZIndex: function (a) {
        this.parent.children.splice(this.index, 1);
        this.parent.children.splice(a, 0, this);
        this.parent._setChildrenIndices()
    }, getAbsoluteOpacity: function () {
        var a = this.getOpacity();
        this.getParent() && (a *= this.getParent().getAbsoluteOpacity());
        return a
    }, moveTo: function (a) {
        Kinetic.Node.prototype.remove.call(this);
        a.add(this)
    }, toObject: function () {
        var a = Kinetic.Type, b = {}, c = this.attrs;
        b.attrs = {};
        for (var e in c) {
            var g = c[e];
            if (!a._isFunction(g) && !a._isElement(g) && (!a._isObject(g) || !a._hasMethods(g)))b.attrs[e] =
                g
        }
        b.nodeType = this.nodeType;
        b.shapeType = this.shapeType;
        return b
    }, toJSON: function () {
        return JSON.stringify(this.toObject())
    }, getParent: function () {
        return this.parent
    }, getLayer: function () {
        return this.getParent().getLayer()
    }, getStage: function () {
        if (this.getParent())return this.getParent().getStage()
    }, simulate: function (a, b) {
        this._handleEvent(a, b || {})
    }, fire: function (a, b) {
        this._executeHandlers(a, b || {})
    }, getAbsoluteTransform: function () {
        var a = new Kinetic.Transform;
        this._eachAncestorReverse(function (b) {
            b = b.getTransform();
            a.multiply(b)
        }, !0);
        return a
    }, getTransform: function () {
        var a = new Kinetic.Transform, b = this.attrs, c = b.x, e = b.y, g = b.rotation, h = b.scale, l = h.x, h = h.y, k = b.offset, b = k.x, k = k.y;
        (0 !== c || 0 !== e) && a.translate(c, e);
        0 !== g && a.rotate(g);
        (1 !== l || 1 !== h) && a.scale(l, h);
        (0 !== b || 0 !== k) && a.translate(-1 * b, -1 * k);
        return a
    }, clone: function (a) {
        var b = new Kinetic[this.shapeType || this.nodeType](this.attrs), c;
        for (c in this.eventListeners)for (var e = this.eventListeners[c], g = e.length, h = 0; h < g; h++) {
            var l = e[h];
            0 > l.name.indexOf("kinetic") &&
            (b.eventListeners[c] || (b.eventListeners[c] = []), b.eventListeners[c].push(l))
        }
        b.setAttrs(a);
        return b
    }, toDataURL: function (a) {
        a = a || {};
        var b = a.mimeType || null, c = a.quality || null, e, g = a.x || 0, h = a.y || 0;
        a.width && a.height ? a = new Kinetic.SceneCanvas(a.width, a.height, 1) : (a = this.getStage().bufferCanvas, a.clear());
        e = a.getContext();
        e.save();
        (g || h) && e.translate(-1 * g, -1 * h);
        this.drawScene(a);
        e.restore();
        return a.toDataURL(b, c)
    }, toImage: function (a) {
        Kinetic.Type._getImage(this.toDataURL(a), function (b) {
            a.callback(b)
        })
    }, setSize: function () {
        var a =
            Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setWidth(a.width);
        this.setHeight(a.height)
    }, getSize: function () {
        return{width: this.getWidth(), height: this.getHeight()}
    }, getWidth: function () {
        return this.attrs.width || 0
    }, getHeight: function () {
        return this.attrs.height || 0
    }, _get: function (a) {
        return this.nodeType === a ? [this] : []
    }, _off: function (a, b) {
        for (var c = 0; c < this.eventListeners[a].length; c++)if (this.eventListeners[a][c].name === b) {
            this.eventListeners[a].splice(c, 1);
            if (0 === this.eventListeners[a].length) {
                delete this.eventListeners[a];
                break
            }
            c--
        }
    }, _clearTransform: function () {
        var a = this.attrs, b = a.scale, c = a.offset, a = {x: a.x, y: a.y, rotation: a.rotation, scale: {x: b.x, y: b.y}, offset: {x: c.x, y: c.y}};
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scale = {x: 1, y: 1};
        this.attrs.offset = {x: 0, y: 0};
        return a
    }, _setTransform: function (a) {
        for (var b in a)this.attrs[b] = a[b]
    }, _fireBeforeChangeEvent: function (a, b, c) {
        this._handleEvent("before" + a.toUpperCase() + "Change", {oldVal: b, newVal: c})
    }, _fireChangeEvent: function (a, b, c) {
        this._handleEvent(a + "Change",
            {oldVal: b, newVal: c})
    }, setId: function (a) {
        var b = this.getId();
        this.getStage();
        var c = Kinetic.Global;
        c._removeId(b);
        c._addId(this, a);
        this.setAttr("id", a)
    }, setName: function (a) {
        var b = this.getName();
        this.getStage();
        var c = Kinetic.Global;
        c._removeName(b, this._id);
        c._addName(this, a);
        this.setAttr("name", a)
    }, setAttr: function (a, b) {
        if (void 0 !== b) {
            var c = this.attrs[a];
            this._fireBeforeChangeEvent(a, c, b);
            this.attrs[a] = b;
            this._fireChangeEvent(a, c, b)
        }
    }, _handleEvent: function (a, b, c) {
        b && "Shape" === this.nodeType && (b.shape =
            this);
        this.getStage();
        var e = this.eventListeners, g = !0;
        "mouseenter" === a && c && this._id === c._id ? g = !1 : "mouseleave" === a && (c && this._id === c._id) && (g = !1);
        g && (e[a] && this.fire(a, b), b && (!b.cancelBubble && this.parent) && (c && c.parent ? this._handleEvent.call(this.parent, a, b, c.parent) : this._handleEvent.call(this.parent, a, b)))
    }, _executeHandlers: function (a, b) {
        for (var c = this.eventListeners[a], e = c.length, g = 0; g < e; g++)c[g].handler.apply(this, [b])
    }};
    Kinetic.Node.addSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addSetter(a,
            b[e])
    };
    Kinetic.Node.addPointSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addPointSetter(a, b[e])
    };
    Kinetic.Node.addRotationSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addRotationSetter(a, b[e])
    };
    Kinetic.Node.addGetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addGetter(a, b[e])
    };
    Kinetic.Node.addRotationGetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addRotationGetter(a, b[e])
    };
    Kinetic.Node.addGettersSetters = function (a, b) {
        this.addSetters(a, b);
        this.addGetters(a,
            b)
    };
    Kinetic.Node.addPointGettersSetters = function (a, b) {
        this.addPointSetters(a, b);
        this.addGetters(a, b)
    };
    Kinetic.Node.addRotationGettersSetters = function (a, b) {
        this.addRotationSetters(a, b);
        this.addRotationGetters(a, b)
    };
    Kinetic.Node._addSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            this.setAttr(b, a)
        }
    };
    Kinetic.Node._addPointSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function () {
            var a = Kinetic.Type._getXY([].slice.call(arguments));
            a && void 0 === a.x && (a.x = this.attrs[b].x);
            a && void 0 === a.y && (a.y = this.attrs[b].y);
            this.setAttr(b, a)
        }
    };
    Kinetic.Node._addRotationSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            this.setAttr(b, a)
        };
        a.prototype[c + "Deg"] = function (a) {
            this.setAttr(b, Kinetic.Type._degToRad(a))
        }
    };
    Kinetic.Node._addGetter = function (a, b) {
        var c = "get" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            return this.attrs[b]
        }
    };
    Kinetic.Node._addRotationGetter = function (a, b) {
        var c =
            "get" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function () {
            return this.attrs[b]
        };
        a.prototype[c + "Deg"] = function () {
            return Kinetic.Type._radToDeg(this.attrs[b])
        }
    };
    Kinetic.Node.create = function (a, b) {
        return this._createNode(JSON.parse(a), b)
    };
    Kinetic.Node._createNode = function (a, b) {
        var c;
        c = "Shape" === a.nodeType ? void 0 === a.shapeType ? "Shape" : a.shapeType : a.nodeType;
        b && (a.attrs.container = b);
        c = new Kinetic[c](a.attrs);
        if (a.children)for (var e = a.children.length, g = 0; g < e; g++)c.add(this._createNode(a.children[g]));
        return c
    };
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["x", "y", "opacity"]);
    Kinetic.Node.addGetters(Kinetic.Node, ["name", "id"]);
    Kinetic.Node.addRotationGettersSetters(Kinetic.Node, ["rotation"]);
    Kinetic.Node.addPointGettersSetters(Kinetic.Node, ["scale", "offset"]);
    Kinetic.Node.addSetters(Kinetic.Node, ["width", "height", "listening", "visible"]);
    Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening;
    Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;
    for (var a = ["on", "off"],
             c = 0; 2 > c; c++)(function (d) {
        var b = a[d];
        Kinetic.Collection.prototype[b] = function () {
            var a = [].slice.call(arguments);
            a.unshift(b);
            this.apply.apply(this, a)
        }
    })(c)
})();
(function () {
    Kinetic.Animation = function (a, d) {
        this.func = a;
        this.node = d;
        this.id = Kinetic.Animation.animIdCounter++;
        this.frame = {time: 0, timeDiff: 0, lastTime: (new Date).getTime()}
    };
    Kinetic.Animation.prototype = {isRunning: function () {
        for (var a = Kinetic.Animation.animations, d = 0; d < a.length; d++)if (a[d].id === this.id)return!0;
        return!1
    }, start: function () {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = (new Date).getTime();
        Kinetic.Animation._addAnimation(this)
    }, stop: function () {
        Kinetic.Animation._removeAnimation(this)
    },
        _updateFrameObject: function (a) {
            this.frame.timeDiff = a - this.frame.lastTime;
            this.frame.lastTime = a;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1E3 / this.frame.timeDiff
        }};
    Kinetic.Animation.animations = [];
    Kinetic.Animation.animIdCounter = 0;
    Kinetic.Animation.animRunning = !1;
    Kinetic.Animation.fixedRequestAnimFrame = function (a) {
        window.setTimeout(a, 1E3 / 60)
    };
    Kinetic.Animation._addAnimation = function (a) {
        this.animations.push(a);
        this._handleAnimation()
    };
    Kinetic.Animation._removeAnimation = function (a) {
        a =
            a.id;
        for (var d = this.animations, b = d.length, f = 0; f < b; f++)if (d[f].id === a) {
            this.animations.splice(f, 1);
            break
        }
    };
    Kinetic.Animation._runFrames = function () {
        for (var a = {}, d = this.animations, b = 0; b < d.length; b++) {
            var f = d[b], e = f.node, g = f.func;
            f._updateFrameObject((new Date).getTime());
            e && void 0 !== e._id && (a[e._id] = e);
            g && g(f.frame)
        }
        for (var h in a)a[h].draw()
    };
    Kinetic.Animation._animationLoop = function () {
        var a = this;
        0 < this.animations.length ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function () {
            a._animationLoop()
        })) :
            this.animRunning = !1
    };
    Kinetic.Animation._handleAnimation = function () {
        this.animRunning || (this.animRunning = !0, this._animationLoop())
    };
    RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Kinetic.Animation.fixedRequestAnimFrame;
    Kinetic.Animation.requestAnimFrame = function (a) {
        (Kinetic.DD && Kinetic.DD.moving ? this.fixedRequestAnimFrame : RAF)(a)
    };
    var a = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo =
        function (c) {
            a.call(this, c)
        }
})();
(function () {
    Kinetic.DD = {anim: new Kinetic.Animation, moving: !1, offset: {x: 0, y: 0}};
    Kinetic.getNodeDragging = function () {
        return Kinetic.DD.node
    };
    Kinetic.DD._setupDragLayerAndGetContainer = function (a) {
        var d = a.getStage(), b, f;
        a._eachAncestorReverse(function (a) {
            "Layer" === a.nodeType ? (d.dragLayer.setAttrs(a.getAttrs()), b = d.dragLayer, d.add(d.dragLayer)) : "Group" === a.nodeType && (f = new Kinetic.Group(a.getAttrs()), b.add(f), b = f)
        });
        return b
    };
    Kinetic.DD._initDragLayer = function (a) {
        a.dragLayer = new Kinetic.Layer;
        a.dragLayer.getCanvas().getElement().className =
            "kinetic-drag-and-drop-layer"
    };
    Kinetic.DD._drag = function (a) {
        var d = Kinetic.DD, b = d.node;
        if (b) {
            var f = b.getStage().getUserPosition(), e = b.attrs.dragBoundFunc, f = {x: f.x - d.offset.x, y: f.y - d.offset.y};
            void 0 !== e && (f = e.call(b, f, a));
            b.setAbsolutePosition(f);
            d.moving || (d.moving = !0, b.setListening(!1), b._handleEvent("dragstart", a));
            b._handleEvent("dragmove", a)
        }
    };
    Kinetic.DD._endDrag = function (a) {
        var d = Kinetic.DD, b = d.node;
        if (b) {
            var f = b.nodeType;
            b.getStage();
            b.setListening(!0);
            if ("Stage" === f)b.draw(); else {
                if (("Group" ===
                    f || "Shape" === f) && b.getDragOnTop() && d.prevParent)b.moveTo(d.prevParent), b.getStage().dragLayer.remove(), d.prevParent = null;
                b.getLayer().draw()
            }
            delete d.node;
            d.anim.stop();
            d.moving && (d.moving = !1, b._handleEvent("dragend", a))
        }
    };
    Kinetic.Node.prototype._startDrag = function (a) {
        var d = Kinetic.DD, b = this, f = this.getStage();
        if (a = f.getUserPosition()) {
            this.getTransform().getTranslation();
            var e = this.getAbsolutePosition(), g = this.nodeType, h;
            d.node = this;
            d.offset.x = a.x - e.x;
            d.offset.y = a.y - e.y;
            "Stage" === g || "Layer" === g ? (d.anim.node =
                this, d.anim.start()) : this.getDragOnTop() ? (h = d._setupDragLayerAndGetContainer(this), d.anim.node = f.dragLayer, d.prevParent = this.getParent(), setTimeout(function () {
                d.node && (b.moveTo(h), d.prevParent.getLayer().draw(), f.dragLayer.draw(), d.anim.start())
            }, 0)) : (d.anim.node = this.getLayer(), d.anim.start())
        }
    };
    Kinetic.Node.prototype.setDraggable = function (a) {
        this.setAttr("draggable", a);
        this._dragChange()
    };
    Kinetic.Node.prototype.getDraggable = function () {
        return this.attrs.draggable
    };
    Kinetic.Node.prototype.isDragging =
        function () {
            var a = Kinetic.DD;
            return a.node && a.node._id === this._id && a.moving
        };
    Kinetic.Node.prototype._listenDrag = function () {
        this._dragCleanup();
        var a = this;
        this.on("mousedown.kinetic touchstart.kinetic", function (d) {
            Kinetic.getNodeDragging() || a._startDrag(d)
        })
    };
    Kinetic.Node.prototype._dragChange = function () {
        if (this.attrs.draggable)this._listenDrag(); else {
            this._dragCleanup();
            var a = this.getStage(), d = Kinetic.DD;
            a && (d.node && d.node._id === this._id) && d._endDrag()
        }
    };
    Kinetic.Node.prototype._dragCleanup = function () {
        this.off("mousedown.kinetic");
        this.off("touchstart.kinetic")
    };
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["dragBoundFunc", "dragOnTop"]);
    var a = document.getElementsByTagName("html")[0];
    a.addEventListener("mouseup", Kinetic.DD._endDrag, !0);
    a.addEventListener("touchend", Kinetic.DD._endDrag, !0)
})();
(function () {
    Kinetic.Transition = function (a, c) {
        function d(a, c, f, l) {
            for (var k in a)"duration" !== k && ("easing" !== k && "callback" !== k) && (Kinetic.Type._isObject(a[k]) ? (f[k] = {}, d(a[k], c[k], f[k], l)) : b._add(b._getTween(c, k, a[k], f, l)))
        }

        var b = this, f = {};
        this.node = a;
        this.config = c;
        this.tweens = [];
        d(c, a.attrs, f, f);
        this.tweens[0].onStarted = function () {
        };
        this.tweens[0].onStopped = function () {
            a.transAnim.stop()
        };
        this.tweens[0].onResumed = function () {
            a.transAnim.start()
        };
        this.tweens[0].onLooped = function () {
        };
        this.tweens[0].onChanged =
            function () {
            };
        this.tweens[0].onFinished = function () {
            var b = {}, d;
            for (d in c)"duration" !== d && ("easing" !== d && "callback" !== d) && (b[d] = c[d]);
            a.transAnim.stop();
            a.setAttrs(b);
            c.callback && c.callback()
        }
    };
    Kinetic.Transition.prototype = {start: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].start()
    }, stop: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].stop()
    }, resume: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].resume()
    }, _onEnterFrame: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].onEnterFrame()
    },
        _add: function (a) {
            this.tweens.push(a)
        }, _getTween: function (a, c, d, b, f) {
            var e = this.config, g = this.node, h = e.easing;
            void 0 === h && (h = "linear");
            return new Kinetic.Tween(g, function (a) {
                b[c] = a;
                g.setAttrs(f)
            }, Kinetic.Tweens[h], a[c], d, e.duration)
        }};
    Kinetic.Node.prototype.transitionTo = function (a) {
        var c = new Kinetic.Transition(this, a);
        this.transAnim || (this.transAnim = new Kinetic.Animation);
        this.transAnim.func = function () {
            c._onEnterFrame()
        };
        this.transAnim.node = "Stage" === this.nodeType ? this : this.getLayer();
        c.start();
        this.transAnim.start();
        return this.trans = c
    }
})();
(function () {
    Kinetic.Container = function (a) {
        this._containerInit(a)
    };
    Kinetic.Container.prototype = {_containerInit: function (a) {
        this.children = [];
        Kinetic.Node.call(this, a)
    }, getChildren: function () {
        return this.children
    }, removeChildren: function () {
        for (; 0 < this.children.length;)this.children[0].remove()
    }, add: function (a) {
        var c = this.children;
        a.index = c.length;
        a.parent = this;
        c.push(a);
        return this
    }, get: function (a) {
        var c = new Kinetic.Collection;
        if ("#" === a.charAt(0))(a = this._getNodeById(a.slice(1))) && c.push(a); else if ("." ===
            a.charAt(0))a = this._getNodesByName(a.slice(1)), Kinetic.Collection.apply(c, a); else {
            for (var d = [], b = this.getChildren(), f = b.length, e = 0; e < f; e++)d = d.concat(b[e]._get(a));
            Kinetic.Collection.apply(c, d)
        }
        return c
    }, _getNodeById: function (a) {
        this.getStage();
        a = Kinetic.Global.ids[a];
        return void 0 !== a && this.isAncestorOf(a) ? a : null
    }, _getNodesByName: function (a) {
        return this._getDescendants(Kinetic.Global.names[a] || [])
    }, _get: function (a) {
        for (var c = Kinetic.Node.prototype._get.call(this, a), d = this.getChildren(), b = d.length,
                 f = 0; f < b; f++)c = c.concat(d[f]._get(a));
        return c
    }, toObject: function () {
        var a = Kinetic.Node.prototype.toObject.call(this);
        a.children = [];
        for (var c = this.getChildren(), d = c.length, b = 0; b < d; b++)a.children.push(c[b].toObject());
        return a
    }, _getDescendants: function (a) {
        for (var c = [], d = a.length, b = 0; b < d; b++) {
            var f = a[b];
            this.isAncestorOf(f) && c.push(f)
        }
        return c
    }, isAncestorOf: function (a) {
        for (a = a.getParent(); a;) {
            if (a._id === this._id)return!0;
            a = a.getParent()
        }
        return!1
    }, clone: function (a) {
        a = Kinetic.Node.prototype.clone.call(this,
            a);
        for (var c in this.children)a.add(this.children[c].clone());
        return a
    }, getIntersections: function () {
        for (var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), c = [], d = this.get("Shape"), b = d.length, f = 0; f < b; f++) {
            var e = d[f];
            e.isVisible() && e.intersects(a) && c.push(e)
        }
        return c
    }, _setChildrenIndices: function () {
        for (var a = this.children, c = a.length, d = 0; d < c; d++)a[d].index = d
    }, draw: function () {
        this.drawScene();
        this.drawHit()
    }, drawScene: function (a) {
        if (this.isVisible())for (var c = this.children, d = c.length, b =
            0; b < d; b++)c[b].drawScene(a)
    }, drawHit: function () {
        if (this.isVisible() && this.isListening())for (var a = this.children, c = a.length, d = 0; d < c; d++)a[d].drawHit()
    }};
    Kinetic.Global.extend(Kinetic.Container, Kinetic.Node)
})();
(function () {
    function a(a) {
        a.fill()
    }

    function c(a) {
        a.stroke()
    }

    function d(a) {
        a.fill()
    }

    function b(a) {
        a.stroke()
    }

    Kinetic.Shape = function (a) {
        this._initShape(a)
    };
    Kinetic.Shape.prototype = {_initShape: function (f) {
        this.setDefaultAttrs({fillEnabled: !0, strokeEnabled: !0, shadowEnabled: !0, dashArrayEnabled: !0, fillPriority: "color"});
        this.nodeType = "Shape";
        this._fillFunc = a;
        this._strokeFunc = c;
        this._fillFuncHit = d;
        this._strokeFuncHit = b;
        for (var e = Kinetic.Global.shapes, g; !(g = Kinetic.Type._getRandomColorKey()) || g in e;);
        this.colorKey =
            g;
        e[g] = this;
        Kinetic.Node.call(this, f)
    }, getContext: function () {
        return this.getLayer().getContext()
    }, getCanvas: function () {
        return this.getLayer().getCanvas()
    }, hasShadow: function () {
        return!(!this.getShadowColor() && !this.getShadowBlur() && !this.getShadowOffset())
    }, hasFill: function () {
        return!(!this.getFill() && !this.getFillPatternImage() && !this.getFillLinearGradientStartPoint() && !this.getFillRadialGradientStartPoint())
    }, _get: function (a) {
        return this.nodeType === a || this.shapeType === a ? [this] : []
    }, intersects: function () {
        var a =
            Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = this.getStage().hitCanvas;
        b.clear();
        this.drawScene(b);
        return 0 < b.context.getImageData(Math.round(a.x), Math.round(a.y), 1, 1).data[3]
    }, enableFill: function () {
        this.setAttr("fillEnabled", !0)
    }, disableFill: function () {
        this.setAttr("fillEnabled", !1)
    }, enableStroke: function () {
        this.setAttr("strokeEnabled", !0)
    }, disableStroke: function () {
        this.setAttr("strokeEnabled", !1)
    }, enableShadow: function () {
        this.setAttr("shadowEnabled", !0)
    }, disableShadow: function () {
        this.setAttr("shadowEnabled",
            !1)
    }, enableDashArray: function () {
        this.setAttr("dashArrayEnabled", !0)
    }, disableDashArray: function () {
        this.setAttr("dashArrayEnabled", !1)
    }, remove: function () {
        Kinetic.Node.prototype.remove.call(this);
        delete Kinetic.Global.shapes[this.colorKey]
    }, drawScene: function (a) {
        var b = this.attrs.drawFunc;
        a = a || this.getLayer().getCanvas();
        var d = a.getContext();
        b && this.isVisible() && (d.save(), a._applyOpacity(this), a._applyLineJoin(this), a._applyAncestorTransforms(this), b.call(this, a), d.restore())
    }, drawHit: function () {
        var a =
            this.attrs, a = a.drawHitFunc || a.drawFunc, b = this.getLayer().hitCanvas, d = b.getContext();
        a && (this.isVisible() && this.isListening()) && (d.save(), b._applyLineJoin(this), b._applyAncestorTransforms(this), a.call(this, b), d.restore())
    }, _setDrawFuncs: function () {
        !this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc);
        !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
    }};
    Kinetic.Global.extend(Kinetic.Shape, Kinetic.Node);
    Kinetic.Node.addGettersSetters(Kinetic.Shape, "stroke lineJoin lineCap strokeWidth drawFunc drawHitFunc dashArray shadowColor shadowBlur shadowOpacity fillPatternImage fill fillPatternX fillPatternY fillLinearGradientColorStops fillRadialGradientStartRadius fillRadialGradientEndRadius fillRadialGradientColorStops fillPatternRepeat fillEnabled strokeEnabled shadowEnabled dashArrayEnabled fillPriority".split(" "));
    Kinetic.Node.addPointGettersSetters(Kinetic.Shape, "fillPatternOffset fillPatternScale fillLinearGradientStartPoint fillLinearGradientEndPoint fillRadialGradientStartPoint fillRadialGradientEndPoint shadowOffset".split(" "));
    Kinetic.Node.addRotationGettersSetters(Kinetic.Shape, ["fillPatternRotation"])
})();
(function () {
    Kinetic.Stage = function (a) {
        this._initStage(a)
    };
    Kinetic.Stage.prototype = {_initStage: function (a) {
        var c = Kinetic.DD;
        this.setDefaultAttrs({width: 400, height: 200});
        Kinetic.Container.call(this, a);
        this._setStageDefaultProperties();
        this._id = Kinetic.Global.idCounter++;
        this._buildDOM();
        this._bindContentEvents();
        Kinetic.Global.stages.push(this);
        c && c._initDragLayer(this)
    }, setContainer: function (a) {
        "string" === typeof a && (a = document.getElementById(a));
        this.setAttr("container", a)
    }, setHeight: function (a) {
        Kinetic.Node.prototype.setHeight.call(this,
            a);
        this._resizeDOM()
    }, setWidth: function (a) {
        Kinetic.Node.prototype.setWidth.call(this, a);
        this._resizeDOM()
    }, clear: function () {
        for (var a = this.children, c = 0; c < a.length; c++)a[c].clear()
    }, remove: function () {
        var a = this.content;
        Kinetic.Node.prototype.remove.call(this);
        a && Kinetic.Type._isInDocument(a) && this.attrs.container.removeChild(a)
    }, reset: function () {
        this.removeChildren();
        this._setStageDefaultProperties();
        this.setAttrs(this.defaultNodeAttrs)
    }, getMousePosition: function () {
        return this.mousePos
    }, getTouchPosition: function () {
        return this.touchPos
    },
        getUserPosition: function () {
            return this.getTouchPosition() || this.getMousePosition()
        }, getStage: function () {
            return this
        }, getContent: function () {
            return this.content
        }, toDataURL: function (a) {
            function c(f) {
                var e = l[f].toDataURL(), p = new Image;
                p.onload = function () {
                    h.drawImage(p, 0, 0);
                    f < l.length - 1 ? c(f + 1) : a.callback(g.toDataURL(d, b))
                };
                p.src = e
            }

            a = a || {};
            var d = a.mimeType || null, b = a.quality || null, f = a.x || 0, e = a.y || 0, g = new Kinetic.SceneCanvas(a.width || this.getWidth(), a.height || this.getHeight()), h = g.getContext(), l = this.children;
            (f || e) && h.translate(-1 * f, -1 * e);
            c(0)
        }, toImage: function (a) {
            var c = a.callback;
            a.callback = function (a) {
                Kinetic.Type._getImage(a, function (a) {
                    c(a)
                })
            };
            this.toDataURL(a)
        }, getIntersection: function (a) {
            for (var c = this.getChildren(), d = c.length - 1; 0 <= d; d--) {
                var b = c[d];
                if (b.isVisible() && b.isListening()) {
                    b = b.hitCanvas.context.getImageData(Math.round(a.x), Math.round(a.y), 1, 1).data;
                    if (255 === b[3])return a = Kinetic.Type._rgbToHex(b[0], b[1], b[2]), a = Kinetic.Global.shapes[a], {shape: a, pixel: b};
                    if (0 < b[0] || 0 < b[1] || 0 < b[2] || 0 < b[3])return{pixel: b}
                }
            }
            return null
        },
        _resizeDOM: function () {
            if (this.content) {
                var a = this.attrs.width, c = this.attrs.height;
                this.content.style.width = a + "px";
                this.content.style.height = c + "px";
                this.bufferCanvas.setSize(a, c, 1);
                this.hitCanvas.setSize(a, c);
                for (var d = this.children, b = 0; b < d.length; b++) {
                    var f = d[b];
                    f.getCanvas().setSize(a, c);
                    f.hitCanvas.setSize(a, c);
                    f.draw()
                }
            }
        }, add: function (a) {
            Kinetic.Container.prototype.add.call(this, a);
            a.canvas.setSize(this.attrs.width, this.attrs.height);
            a.hitCanvas.setSize(this.attrs.width, this.attrs.height);
            a.draw();
            this.content.appendChild(a.canvas.element);
            return this
        }, getDragLayer: function () {
            return this.dragLayer
        }, _setUserPosition: function (a) {
            a || (a = window.event);
            this._setMousePosition(a);
            this._setTouchPosition(a)
        }, _bindContentEvents: function () {
            for (var a = this, c = "mousedown mousemove mouseup mouseout touchstart touchmove touchend".split(" "), d = 0; d < c.length; d++) {
                var b = c[d];
                (function () {
                    var d = b;
                    a.content.addEventListener(d, function (b) {
                        a["_" + d](b)
                    }, !1)
                })()
            }
        }, _mouseout: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD,
                d = this.targetShape;
            if (d && (!c || !c.moving))d._handleEvent("mouseout", a), d._handleEvent("mouseleave", a), this.targetShape = null;
            this.mousePos = void 0
        }, _mousemove: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD, d = this.getIntersection(this.getUserPosition());
            if (d) {
                var b = d.shape;
                b && ((!c || !c.moving) && 255 === d.pixel[3] && (!this.targetShape || this.targetShape._id !== b._id) ? (this.targetShape && (this.targetShape._handleEvent("mouseout", a, b), this.targetShape._handleEvent("mouseleave", a, b)), b._handleEvent("mouseover",
                    a, this.targetShape), b._handleEvent("mouseenter", a, this.targetShape), this.targetShape = b) : b._handleEvent("mousemove", a))
            } else if (this.targetShape && (!c || !c.moving))this.targetShape._handleEvent("mouseout", a), this.targetShape._handleEvent("mouseleave", a), this.targetShape = null;
            c && c._drag(a)
        }, _mousedown: function (a) {
            var c, d = Kinetic.DD;
            this._setUserPosition(a);
            if ((c = this.getIntersection(this.getUserPosition())) && c.shape)c = c.shape, this.clickStart = !0, c._handleEvent("mousedown", a);
            d && (this.attrs.draggable && !d.node) && this._startDrag(a)
        }, _mouseup: function (a) {
            this._setUserPosition(a);
            var c = this, d = Kinetic.DD, b = this.getIntersection(this.getUserPosition());
            if (b && b.shape && (b = b.shape, b._handleEvent("mouseup", a), this.clickStart && (!d || !d.moving || !d.node)))b._handleEvent("click", a), this.inDoubleClickWindow && b._handleEvent("dblclick", a), this.inDoubleClickWindow = !0, setTimeout(function () {
                c.inDoubleClickWindow = !1
            }, this.dblClickWindow);
            this.clickStart = !1
        }, _touchstart: function (a) {
            var c, d = Kinetic.DD;
            this._setUserPosition(a);
            a.preventDefault();
            if ((c = this.getIntersection(this.getUserPosition())) && c.shape)c = c.shape, this.tapStart = !0, c._handleEvent("touchstart", a);
            d && (this.attrs.draggable && !d.node) && this._startDrag(a)
        }, _touchend: function (a) {
            this._setUserPosition(a);
            var c = this, d = Kinetic.DD, b = this.getIntersection(this.getUserPosition());
            if (b && b.shape && (b = b.shape, b._handleEvent("touchend", a), this.tapStart && (!d || !d.moving || !d.node)))b._handleEvent("tap", a), this.inDoubleClickWindow && b._handleEvent("dbltap", a), this.inDoubleClickWindow = !0, setTimeout(function () {
                c.inDoubleClickWindow = !1
            }, this.dblClickWindow);
            this.tapStart = !1
        }, _touchmove: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD;
            a.preventDefault();
            var d = this.getIntersection(this.getUserPosition());
            d && d.shape && d.shape._handleEvent("touchmove", a);
            c && c._drag(a)
        }, _setMousePosition: function (a) {
            var c = a.clientX - this._getContentPosition().left;
            a = a.clientY - this._getContentPosition().top;
            this.mousePos = {x: c, y: a}
        }, _setTouchPosition: function (a) {
            if (void 0 !== a.touches && 1 === a.touches.length) {
                var c =
                    a.touches[0];
                a = c.clientX - this._getContentPosition().left;
                c = c.clientY - this._getContentPosition().top;
                this.touchPos = {x: a, y: c}
            }
        }, _getContentPosition: function () {
            var a = this.content.getBoundingClientRect();
            return{top: a.top, left: a.left}
        }, _buildDOM: function () {
            this.content = document.createElement("div");
            this.content.style.position = "relative";
            this.content.style.display = "inline-block";
            this.content.className = "kineticjs-content";
            this.attrs.container.appendChild(this.content);
            this.bufferCanvas = new Kinetic.SceneCanvas;
            this.hitCanvas = new Kinetic.HitCanvas;
            this._resizeDOM()
        }, _onContent: function (a, c) {
            for (var d = a.split(" "), b = 0; b < d.length; b++)this.content.addEventListener(d[b], c, !1)
        }, _setStageDefaultProperties: function () {
            this.nodeType = "Stage";
            this.dblClickWindow = 400;
            this.targetShape = null;
            this.mousePos = void 0;
            this.clickStart = !1;
            this.touchPos = void 0;
            this.tapStart = !1
        }};
    Kinetic.Global.extend(Kinetic.Stage, Kinetic.Container);
    Kinetic.Node.addGetters(Kinetic.Stage, ["container"])
})();
(function () {
    Kinetic.Layer = function (a) {
        this._initLayer(a)
    };
    Kinetic.Layer.prototype = {_initLayer: function (a) {
        this.setDefaultAttrs({clearBeforeDraw: !0});
        this.nodeType = "Layer";
        this.afterDrawFunc = this.beforeDrawFunc = void 0;
        this.canvas = new Kinetic.SceneCanvas;
        this.canvas.getElement().style.position = "absolute";
        this.hitCanvas = new Kinetic.HitCanvas;
        Kinetic.Container.call(this, a)
    }, draw: function () {
        this.getContext();
        void 0 !== this.beforeDrawFunc && this.beforeDrawFunc.call(this);
        Kinetic.Container.prototype.draw.call(this);
        void 0 !== this.afterDrawFunc && this.afterDrawFunc.call(this)
    }, drawHit: function () {
        this.hitCanvas.clear();
        Kinetic.Container.prototype.drawHit.call(this)
    }, drawScene: function (a) {
        a = a || this.getCanvas();
        this.attrs.clearBeforeDraw && a.clear();
        Kinetic.Container.prototype.drawScene.call(this, a)
    }, toDataURL: function (a) {
        a = a || {};
        var c = a.mimeType || null, d = a.quality || null;
        return a.width || a.height || a.x || a.y ? Kinetic.Node.prototype.toDataURL.call(this, a) : this.getCanvas().toDataURL(c, d)
    }, beforeDraw: function (a) {
        this.beforeDrawFunc =
            a
    }, afterDraw: function (a) {
        this.afterDrawFunc = a
    }, getCanvas: function () {
        return this.canvas
    }, getContext: function () {
        return this.canvas.context
    }, clear: function () {
        this.getCanvas().clear()
    }, setVisible: function (a) {
        Kinetic.Node.prototype.setVisible.call(this, a);
        a ? (this.canvas.element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.canvas.element.style.display = "none", this.hitCanvas.element.style.display = "none")
    }, setZIndex: function (a) {
        Kinetic.Node.prototype.setZIndex.call(this, a);
        var c =
            this.getStage();
        c && (c.content.removeChild(this.canvas.element), a < c.getChildren().length - 1 ? c.content.insertBefore(this.canvas.element, c.getChildren()[a + 1].canvas.element) : c.content.appendChild(this.canvas.element))
    }, moveToTop: function () {
        Kinetic.Node.prototype.moveToTop.call(this);
        var a = this.getStage();
        a && (a.content.removeChild(this.canvas.element), a.content.appendChild(this.canvas.element))
    }, moveUp: function () {
        if (Kinetic.Node.prototype.moveUp.call(this)) {
            var a = this.getStage();
            a && (a.content.removeChild(this.canvas.element),
                this.index < a.getChildren().length - 1 ? a.content.insertBefore(this.canvas.element, a.getChildren()[this.index + 1].canvas.element) : a.content.appendChild(this.canvas.element))
        }
    }, moveDown: function () {
        if (Kinetic.Node.prototype.moveDown.call(this)) {
            var a = this.getStage();
            if (a) {
                var c = a.getChildren();
                a.content.removeChild(this.canvas.element);
                a.content.insertBefore(this.canvas.element, c[this.index + 1].canvas.element)
            }
        }
    }, moveToBottom: function () {
        if (Kinetic.Node.prototype.moveToBottom.call(this)) {
            var a = this.getStage();
            if (a) {
                var c = a.getChildren();
                a.content.removeChild(this.canvas.element);
                a.content.insertBefore(this.canvas.element, c[1].canvas.element)
            }
        }
    }, getLayer: function () {
        return this
    }, remove: function () {
        var a = this.getStage(), c = this.canvas, d = c.element;
        Kinetic.Node.prototype.remove.call(this);
        a && (c && Kinetic.Type._isInDocument(d)) && a.content.removeChild(d)
    }};
    Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container);
    Kinetic.Node.addGettersSetters(Kinetic.Layer, ["clearBeforeDraw"])
})();
(function () {
    Kinetic.Group = function (a) {
        this._initGroup(a)
    };
    Kinetic.Group.prototype = {_initGroup: function (a) {
        this.nodeType = "Group";
        Kinetic.Container.call(this, a)
    }};
    Kinetic.Global.extend(Kinetic.Group, Kinetic.Container)
})();
(function () {
    Kinetic.Rect = function (a) {
        this._initRect(a)
    };
    Kinetic.Rect.prototype = {_initRect: function (a) {
        this.setDefaultAttrs({width: 0, height: 0, cornerRadius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Rect";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        var d = this.getCornerRadius(), b = this.getWidth(), f = this.getHeight();
        0 === d ? c.rect(0, 0, b, f) : (c.moveTo(d, 0), c.lineTo(b - d, 0), c.arc(b - d, d, d, 3 * Math.PI / 2, 0, !1), c.lineTo(b, f - d), c.arc(b - d, f - d, d, 0, Math.PI / 2, !1), c.lineTo(d, f), c.arc(d,
            f - d, d, Math.PI / 2, Math.PI, !1), c.lineTo(0, d), c.arc(d, d, d, Math.PI, 3 * Math.PI / 2, !1));
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Rect, ["cornerRadius"])
})();
(function () {
    Kinetic.Circle = function (a) {
        this._initCircle(a)
    };
    Kinetic.Circle.prototype = {_initCircle: function (a) {
        this.setDefaultAttrs({radius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Circle";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        c.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, !0);
        c.closePath();
        a.fillStroke(this)
    }, getWidth: function () {
        return 2 * this.getRadius()
    }, getHeight: function () {
        return 2 * this.getRadius()
    }, setWidth: function (a) {
        Kinetic.Node.prototype.setWidth.call(this,
            a);
        this.setRadius(a / 2)
    }, setHeight: function (a) {
        Kinetic.Node.prototype.setHeight.call(this, a);
        this.setRadius(a / 2)
    }};
    Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Circle, ["radius"])
})();
(function () {
    Kinetic.Wedge = function (a) {
        this._initWedge(a)
    };
    Kinetic.Wedge.prototype = {_initWedge: function (a) {
        this.setDefaultAttrs({radius: 0, angle: 0, clockwise: !1});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Wedge";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        c.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
        c.lineTo(0, 0);
        c.closePath();
        a.fillStroke(this)
    }, setAngleDeg: function (a) {
        this.setAngle(Kinetic.Type._degToRad(a))
    }, getAngleDeg: function () {
        return Kinetic.Type._radToDeg(this.getAngle())
    }};
    Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Wedge, ["radius", "angle", "clockwise"])
})();
(function () {
    Kinetic.Ellipse = function (a) {
        this._initEllipse(a)
    };
    Kinetic.Ellipse.prototype = {_initEllipse: function (a) {
        this.setDefaultAttrs({radius: {x: 0, y: 0}});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Ellipse";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.getRadius();
        c.beginPath();
        c.save();
        d.x !== d.y && c.scale(1, d.y / d.x);
        c.arc(0, 0, d.x, 0, 2 * Math.PI, !0);
        c.restore();
        c.closePath();
        a.fillStroke(this)
    }, getWidth: function () {
        return 2 * this.getRadius().x
    }, getHeight: function () {
        return 2 * this.getRadius().y
    },
        setWidth: function (a) {
            Kinetic.Node.prototype.setWidth.call(this, a);
            this.setRadius({x: a / 2})
        }, setHeight: function (a) {
            Kinetic.Node.prototype.setHeight.call(this, a);
            this.setRadius({y: a / 2})
        }};
    Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);
    Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse, ["radius"])
})();
(function () {
    Kinetic.Image = function (a) {
        this._initImage(a)
    };
    Kinetic.Image.prototype = {_initImage: function (a) {
        Kinetic.Shape.call(this, a);
        this.shapeType = "Image";
        this._setDrawFuncs();
        var c = this;
        this.on("imageChange", function (a) {
            c._syncSize()
        });
        this._syncSize()
    }, drawFunc: function (a) {
        var c = this.getWidth(), d = this.getHeight(), b, f = this, e = a.getContext();
        e.beginPath();
        e.rect(0, 0, c, d);
        e.closePath();
        a.fillStroke(this);
        this.attrs.image && (b = this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height ? [this.attrs.image,
            this.attrs.crop.x || 0, this.attrs.crop.y || 0, this.attrs.crop.width, this.attrs.crop.height, 0, 0, c, d] : [this.attrs.image, 0, 0, c, d], this.hasShadow() ? a.applyShadow(this, function () {
            f._drawImage(e, b)
        }) : this._drawImage(e, b))
    }, drawHitFunc: function (a) {
        var c = this.getWidth(), d = this.getHeight(), b = this.imageHitRegion, f = a.getContext();
        b ? (f.drawImage(b, 0, 0, c, d), f.beginPath(), f.rect(0, 0, c, d), f.closePath(), a.stroke(this)) : (f.beginPath(), f.rect(0, 0, c, d), f.closePath(), a.fillStroke(this))
    }, applyFilter: function (a, c, d) {
        var b =
            new Kinetic.Canvas(this.attrs.image.width, this.attrs.image.height), f = b.getContext();
        f.drawImage(this.attrs.image, 0, 0);
        try {
            var e = f.getImageData(0, 0, b.getWidth(), b.getHeight());
            a(e, c);
            var g = this;
            Kinetic.Type._getImage(e, function (a) {
                g.setImage(a);
                d && d()
            })
        } catch (h) {
            Kinetic.Global.warn("Unable to apply filter. " + h.message)
        }
    }, setCrop: function () {
        var a = [].slice.call(arguments), c = Kinetic.Type._getXY(a), a = Kinetic.Type._getSize(a), c = Kinetic.Type._merge(c, a);
        this.setAttr("crop", Kinetic.Type._merge(c, this.getCrop()))
    },
        createImageHitRegion: function (a) {
            var c = new Kinetic.Canvas(this.attrs.width, this.attrs.height), d = c.getContext();
            d.drawImage(this.attrs.image, 0, 0);
            try {
                for (var b = d.getImageData(0, 0, c.getWidth(), c.getHeight()), f = b.data, e = Kinetic.Type._hexToRgb(this.colorKey), c = 0, g = f.length; c < g; c += 4)f[c] = e.r, f[c + 1] = e.g, f[c + 2] = e.b;
                var h = this;
                Kinetic.Type._getImage(b, function (b) {
                    h.imageHitRegion = b;
                    a && a()
                })
            } catch (l) {
                Kinetic.Global.warn("Unable to create image hit region. " + l.message)
            }
        }, clearImageHitRegion: function () {
            delete this.imageHitRegion
        },
        _syncSize: function () {
            this.attrs.image && (this.attrs.width || this.setWidth(this.attrs.image.width), this.attrs.height || this.setHeight(this.attrs.image.height))
        }, _drawImage: function (a, c) {
            5 === c.length ? a.drawImage(c[0], c[1], c[2], c[3], c[4]) : 9 === c.length && a.drawImage(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8])
        }};
    Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Image, ["image"]);
    Kinetic.Node.addGetters(Kinetic.Image, ["crop"])
})();
(function () {
    Kinetic.Polygon = function (a) {
        this._initPolygon(a)
    };
    Kinetic.Polygon.prototype = {_initPolygon: function (a) {
        this.setDefaultAttrs({points: []});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Polygon";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.getPoints(), b = d.length;
        c.beginPath();
        c.moveTo(d[0].x, d[0].y);
        for (var f = 1; f < b; f++)c.lineTo(d[f].x, d[f].y);
        c.closePath();
        a.fillStroke(this)
    }, setPoints: function (a) {
        this.setAttr("points", Kinetic.Type._getPoints(a))
    }};
    Kinetic.Global.extend(Kinetic.Polygon,
        Kinetic.Shape);
    Kinetic.Node.addGetters(Kinetic.Polygon, ["points"])
})();
(function () {
    function a(a) {
        a.fillText(this.partialText, 0, 0)
    }

    function c(a) {
        a.strokeText(this.partialText, 0, 0)
    }

    var d = "fontFamily fontSize fontStyle padding align lineHeight text width height".split(" "), b = d.length;
    Kinetic.Text = function (a) {
        this._initText(a)
    };
    Kinetic.Text.prototype = {_initText: function (f) {
        this.setDefaultAttrs({fontFamily: "Calibri", text: "", fontSize: 12, align: "left", verticalAlign: "top", fontStyle: "normal", padding: 0, width: "auto", height: "auto", lineHeight: 1});
        this.dummyCanvas = document.createElement("canvas");
        Kinetic.Shape.call(this, f);
        this._fillFunc = a;
        this._strokeFunc = c;
        this.shapeType = "Text";
        this._setDrawFuncs();
        for (f = 0; f < b; f++)this.on(d[f] + "Change.kinetic", this._setTextData);
        this._setTextData()
    }, drawFunc: function (a) {
        var b = a.getContext(), d = this.getPadding(), c = this.getFontStyle(), l = this.getFontSize(), k = this.getFontFamily(), m = this.getTextHeight(), p = this.getLineHeight() * m, q = this.textArr, r = q.length, s = this.getWidth();
        b.font = c + " " + l + "px " + k;
        b.textBaseline = "middle";
        b.textAlign = "left";
        b.save();
        b.translate(d,
            0);
        b.translate(0, d + m / 2);
        for (c = 0; c < r; c++)k = q[c], l = k.text, k = k.width, b.save(), "right" === this.getAlign() ? b.translate(s - k - 2 * d, 0) : "center" === this.getAlign() && b.translate((s - k - 2 * d) / 2, 0), this.partialText = l, a.fillStroke(this), b.restore(), b.translate(0, p);
        b.restore()
    }, drawHitFunc: function (a) {
        var b = a.getContext(), d = this.getWidth(), c = this.getHeight();
        b.beginPath();
        b.rect(0, 0, d, c);
        b.closePath();
        a.fillStroke(this)
    }, setText: function (a) {
        a = Kinetic.Type._isString(a) ? a : a.toString();
        this.setAttr("text", a)
    }, getWidth: function () {
        return"auto" ===
            this.attrs.width ? this.getTextWidth() + 2 * this.getPadding() : this.attrs.width
    }, getHeight: function () {
        return"auto" === this.attrs.height ? this.getTextHeight() * this.textArr.length * this.attrs.lineHeight + 2 * this.attrs.padding : this.attrs.height
    }, getTextWidth: function () {
        return this.textWidth
    }, getTextHeight: function () {
        return this.textHeight
    }, _getTextSize: function (a) {
        var b = this.dummyCanvas.getContext("2d"), d = this.getFontSize();
        b.save();
        b.font = this.getFontStyle() + " " + d + "px " + this.getFontFamily();
        a = b.measureText(a);
        b.restore();
        return{width: a.width, height: parseInt(d, 10)}
    }, _expandTextData: function (a) {
        var b = a.length;
        n = 0;
        text = "";
        newArr = [];
        for (n = 0; n < b; n++)text = a[n], newArr.push({text: text, width: this._getTextSize(text).width});
        return newArr
    }, _setTextData: function () {
        var a = this.getText().split(""), b = [], d = 0;
        addLine = !0;
        lineHeightPx = 0;
        padding = this.getPadding();
        this.textWidth = 0;
        this.textHeight = this._getTextSize(this.getText()).height;
        for (lineHeightPx = this.getLineHeight() * this.textHeight; 0 < a.length && addLine && ("auto" === this.attrs.height ||
            lineHeightPx * (d + 1) < this.attrs.height - 2 * padding);) {
            var c = 0, l = void 0;
            for (addLine = !1; c < a.length;) {
                if (a.indexOf("\n") === c) {
                    a.splice(c, 1);
                    l = a.splice(0, c).join("");
                    break
                }
                var k = a.slice(0, c);
                if ("auto" !== this.attrs.width && this._getTextSize(k.join("")).width > this.attrs.width - 2 * padding) {
                    if (0 == c)break;
                    l = k.lastIndexOf(" ");
                    k = k.lastIndexOf("\n");
                    k = Math.max(l, k);
                    if (0 <= k) {
                        l = a.splice(0, 1 + k).join("");
                        break
                    }
                    l = a.splice(0, c).join("");
                    break
                }
                c++;
                c === a.length && (l = a.splice(0, c).join(""))
            }
            this.textWidth = Math.max(this.textWidth,
                this._getTextSize(l).width);
            void 0 !== l && (b.push(l), addLine = !0);
            d++
        }
        this.textArr = this._expandTextData(b)
    }};
    Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Text, "fontFamily fontSize fontStyle padding align lineHeight".split(" "));
    Kinetic.Node.addGetters(Kinetic.Text, ["text"])
})();
(function () {
    Kinetic.Line = function (a) {
        this._initLine(a)
    };
    Kinetic.Line.prototype = {_initLine: function (a) {
        this.setDefaultAttrs({points: [], lineCap: "butt"});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Line";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = this.getPoints(), d = c.length, b = a.getContext();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        for (var f = 1; f < d; f++) {
            var e = c[f];
            b.lineTo(e.x, e.y)
        }
        a.stroke(this)
    }, setPoints: function (a) {
        this.setAttr("points", Kinetic.Type._getPoints(a))
    }};
    Kinetic.Global.extend(Kinetic.Line,
        Kinetic.Shape);
    Kinetic.Node.addGetters(Kinetic.Line, ["points"])
})();
(function () {
    Kinetic.Spline = function (a) {
        this._initSpline(a)
    };
    Kinetic.Spline._getControlPoints = function (a, c, d, b) {
        var f = a.x;
        a = a.y;
        var e = c.x;
        c = c.y;
        var g = d.x;
        d = d.y;
        var h = Math.sqrt(Math.pow(e - f, 2) + Math.pow(c - a, 2)), l = Math.sqrt(Math.pow(g - e, 2) + Math.pow(d - c, 2)), k = b * h / (h + l);
        b = b * l / (h + l);
        return[
            {x: e - k * (g - f), y: c - k * (d - a)},
            {x: e + b * (g - f), y: c + b * (d - a)}
        ]
    };
    Kinetic.Spline.prototype = {_initSpline: function (a) {
        this.setDefaultAttrs({tension: 1});
        Kinetic.Line.call(this, a);
        this.shapeType = "Spline"
    }, drawFunc: function (a) {
        var c = this.getPoints(),
            d = c.length, b = a.getContext(), f = this.getTension();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        if (0 !== f && 2 < d) {
            var e = this.allPoints, g = e.length;
            b.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y);
            for (f = 2; f < g - 1;)b.bezierCurveTo(e[f].x, e[f++].y, e[f].x, e[f++].y, e[f].x, e[f++].y);
            b.quadraticCurveTo(e[g - 1].x, e[g - 1].y, c[d - 1].x, c[d - 1].y)
        } else for (f = 1; f < d; f++)e = c[f], b.lineTo(e.x, e.y);
        a.stroke(this)
    }, setPoints: function (a) {
        Kinetic.Line.prototype.setPoints.call(this, a);
        this._setAllPoints()
    }, setTension: function (a) {
        this.setAttr("tension",
            a);
        this._setAllPoints()
    }, _setAllPoints: function () {
        for (var a = this.getPoints(), c = a.length, d = this.getTension(), b = [], f = 1; f < c - 1; f++) {
            var e = Kinetic.Spline._getControlPoints(a[f - 1], a[f], a[f + 1], d);
            b.push(e[0]);
            b.push(a[f]);
            b.push(e[1])
        }
        this.allPoints = b
    }};
    Kinetic.Global.extend(Kinetic.Spline, Kinetic.Line);
    Kinetic.Node.addGetters(Kinetic.Spline, ["tension"])
})();
(function () {
    Kinetic.Blob = function (a) {
        this._initBlob(a)
    };
    Kinetic.Blob.prototype = {_initBlob: function (a) {
        Kinetic.Spline.call(this, a);
        this.shapeType = "Blob"
    }, drawFunc: function (a) {
        var c = this.getPoints(), d = c.length, b = a.getContext(), f = this.getTension();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        if (0 !== f && 2 < d) {
            c = this.allPoints;
            d = c.length;
            for (f = 0; f < d - 1;)b.bezierCurveTo(c[f].x, c[f++].y, c[f].x, c[f++].y, c[f].x, c[f++].y)
        } else for (f = 1; f < d; f++) {
            var e = c[f];
            b.lineTo(e.x, e.y)
        }
        b.closePath();
        a.fillStroke(this)
    }, _setAllPoints: function () {
        var a =
            this.getPoints(), c = a.length, d = this.getTension(), b = Kinetic.Spline._getControlPoints(a[c - 1], a[0], a[1], d), d = Kinetic.Spline._getControlPoints(a[c - 2], a[c - 1], a[0], d);
        Kinetic.Spline.prototype._setAllPoints.call(this);
        this.allPoints.unshift(b[1]);
        this.allPoints.push(d[0]);
        this.allPoints.push(a[c - 1]);
        this.allPoints.push(d[1]);
        this.allPoints.push(b[0]);
        this.allPoints.push(a[0])
    }};
    Kinetic.Global.extend(Kinetic.Blob, Kinetic.Spline)
})();
(function () {
    Kinetic.Sprite = function (a) {
        this._initSprite(a)
    };
    Kinetic.Sprite.prototype = {_initSprite: function (a) {
        this.setDefaultAttrs({index: 0, frameRate: 17});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Sprite";
        this._setDrawFuncs();
        this.anim = new Kinetic.Animation;
        var c = this;
        this.on("animationChange", function () {
            c.setIndex(0)
        })
    }, drawFunc: function (a) {
        var c = this.attrs.animations[this.attrs.animation][this.attrs.index];
        a = a.getContext();
        var d = this.attrs.image;
        d && a.drawImage(d, c.x, c.y, c.width, c.height, 0, 0, c.width,
            c.height)
    }, drawHitFunc: function (a) {
        var c = this.attrs.animations[this.attrs.animation][this.attrs.index], d = a.getContext();
        d.beginPath();
        d.rect(0, 0, c.width, c.height);
        d.closePath();
        a.fill(this)
    }, start: function () {
        var a = this, c = this.getLayer();
        this.anim.node = c;
        this.interval = setInterval(function () {
            var d = a.attrs.index;
            a._updateIndex();
            a.afterFrameFunc && d === a.afterFrameIndex && (a.afterFrameFunc(), delete a.afterFrameFunc, delete a.afterFrameIndex)
        }, 1E3 / this.attrs.frameRate);
        this.anim.start()
    }, stop: function () {
        this.anim.stop();
        clearInterval(this.interval)
    }, afterFrame: function (a, c) {
        this.afterFrameIndex = a;
        this.afterFrameFunc = c
    }, _updateIndex: function () {
        this.attrs.index < this.attrs.animations[this.attrs.animation].length - 1 ? this.attrs.index++ : this.attrs.index = 0
    }};
    Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Sprite, ["animation", "animations", "index"])
})();
(function () {
    Kinetic.Star = function (a) {
        this._initStar(a)
    };
    Kinetic.Star.prototype = {_initStar: function (a) {
        this.setDefaultAttrs({numPoints: 0, innerRadius: 0, outerRadius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Star";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.attrs.innerRadius, b = this.attrs.outerRadius, f = this.attrs.numPoints;
        c.beginPath();
        c.moveTo(0, 0 - this.attrs.outerRadius);
        for (var e = 1; e < 2 * f; e++) {
            var g = 0 === e % 2 ? b : d, h = g * Math.sin(e * Math.PI / f), g = -1 * g * Math.cos(e * Math.PI / f);
            c.lineTo(h,
                g)
        }
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Star, ["numPoints", "innerRadius", "outerRadius"])
})();
(function () {
    Kinetic.RegularPolygon = function (a) {
        this._initRegularPolygon(a)
    };
    Kinetic.RegularPolygon.prototype = {_initRegularPolygon: function (a) {
        this.setDefaultAttrs({radius: 0, sides: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "RegularPolygon";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.attrs.sides, b = this.attrs.radius;
        c.beginPath();
        c.moveTo(0, 0 - b);
        for (var f = 1; f < d; f++) {
            var e = b * Math.sin(2 * f * Math.PI / d), g = -1 * b * Math.cos(2 * f * Math.PI / d);
            c.lineTo(e, g)
        }
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ["radius", "sides"])
})();
(function () {
    Kinetic.Path = function (a) {
        this._initPath(a)
    };
    Kinetic.Path.prototype = {_initPath: function (a) {
        this.dataArray = [];
        var c = this;
        Kinetic.Shape.call(this, a);
        this.shapeType = "Path";
        this._setDrawFuncs();
        this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
        this.on("dataChange", function () {
            c.dataArray = Kinetic.Path.parsePathData(c.attrs.data)
        })
    }, drawFunc: function (a) {
        var c = this.dataArray, d = a.getContext();
        d.beginPath();
        for (var b = 0; b < c.length; b++) {
            var f = c[b].points;
            switch (c[b].command) {
                case "L":
                    d.lineTo(f[0],
                        f[1]);
                    break;
                case "M":
                    d.moveTo(f[0], f[1]);
                    break;
                case "C":
                    d.bezierCurveTo(f[0], f[1], f[2], f[3], f[4], f[5]);
                    break;
                case "Q":
                    d.quadraticCurveTo(f[0], f[1], f[2], f[3]);
                    break;
                case "A":
                    var e = f[0], g = f[1], h = f[2], l = f[3], k = f[4], m = f[5], p = f[6], f = f[7], q = h > l ? h : l, r = h > l ? 1 : h / l, h = h > l ? l / h : 1;
                    d.translate(e, g);
                    d.rotate(p);
                    d.scale(r, h);
                    d.arc(0, 0, q, k, k + m, 1 - f);
                    d.scale(1 / r, 1 / h);
                    d.rotate(-p);
                    d.translate(-e, -g);
                    break;
                case "z":
                    d.closePath()
            }
        }
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
    Kinetic.Path.getLineLength =
        function (a, c, d, b) {
            return Math.sqrt((d - a) * (d - a) + (b - c) * (b - c))
        };
    Kinetic.Path.getPointOnLine = function (a, c, d, b, f, e, g) {
        void 0 === e && (e = c);
        void 0 === g && (g = d);
        var h = (f - d) / (b - c + 1E-8), l = Math.sqrt(a * a / (1 + h * h));
        b < c && (l *= -1);
        var k = h * l;
        if ((g - d) / (e - c + 1E-8) === h)c = {x: e + l, y: g + k}; else {
            k = this.getLineLength(c, d, b, f);
            if (1E-8 > k)return;
            l = ((e - c) * (b - c) + (g - d) * (f - d)) / (k * k);
            k = c + l * (b - c);
            d += l * (f - d);
            e = this.getLineLength(e, g, k, d);
            a = Math.sqrt(a * a - e * e);
            l = Math.sqrt(a * a / (1 + h * h));
            b < c && (l *= -1);
            c = {x: k + l, y: d + h * l}
        }
        return c
    };
    Kinetic.Path.getPointOnCubicBezier =
        function (a, c, d, b, f, e, g, h, l) {
            return{x: h * a * a * a + e * 3 * a * a * (1 - a) + b * 3 * a * (1 - a) * (1 - a) + c * (1 - a) * (1 - a) * (1 - a), y: l * a * a * a + g * 3 * a * a * (1 - a) + f * 3 * a * (1 - a) * (1 - a) + d * (1 - a) * (1 - a) * (1 - a)}
        };
    Kinetic.Path.getPointOnQuadraticBezier = function (a, c, d, b, f, e, g) {
        return{x: e * a * a + b * 2 * a * (1 - a) + c * (1 - a) * (1 - a), y: g * a * a + f * 2 * a * (1 - a) + d * (1 - a) * (1 - a)}
    };
    Kinetic.Path.getPointOnEllipticalArc = function (a, c, d, b, f, e) {
        var g = Math.cos(e);
        e = Math.sin(e);
        d *= Math.cos(f);
        b *= Math.sin(f);
        return{x: a + (d * g - b * e), y: c + (d * e + b * g)}
    };
    Kinetic.Path.parsePathData = function (a) {
        if (!a)return[];
        var c, d = "mMlLvVhHzZcCqQtTsSaA".split("");
        c = a.replace(/ /g, ",");
        for (a = 0; a < d.length; a++)c = c.replace(RegExp(d[a], "g"), "|" + d[a]);
        d = c.split("|");
        c = [];
        var b = 0, f = 0;
        for (a = 1; a < d.length; a++) {
            var e = d[a], g = e.charAt(0), e = e.slice(1), e = e.replace(/,-/g, "-"), e = e.replace(/-/g, ",-"), e = e.replace(/e,-/g, "e-"), e = e.split(",");
            0 < e.length && "" === e[0] && e.shift();
            for (var h = 0; h < e.length; h++)e[h] = parseFloat(e[h]);
            for (; 0 < e.length && !isNaN(e[0]);) {
                var l = null, k = [], h = b, m = f;
                switch (g) {
                    case "l":
                        b += e.shift();
                        f += e.shift();
                        l = "L";
                        k.push(b,
                            f);
                        break;
                    case "L":
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "m":
                        b += e.shift();
                        f += e.shift();
                        l = "M";
                        k.push(b, f);
                        g = "l";
                        break;
                    case "M":
                        b = e.shift();
                        f = e.shift();
                        l = "M";
                        k.push(b, f);
                        g = "L";
                        break;
                    case "h":
                        b += e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "H":
                        b = e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "v":
                        f += e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "V":
                        f = e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "C":
                        k.push(e.shift(), e.shift(), e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "c":
                        k.push(b + e.shift(), f + e.shift(),
                            b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "S":
                        var p = b, q = f, l = c[c.length - 1];
                        "C" === l.command && (p = b + (b - l.points[2]), q = f + (f - l.points[3]));
                        k.push(p, q, e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "s":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "C" === l.command && (p = b + (b - l.points[2]), q = f + (f - l.points[3]));
                        k.push(p, q, b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "Q":
                        k.push(e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "q":
                        k.push(b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "Q";
                        k.push(b, f);
                        break;
                    case "T":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "Q" === l.command && (p = b + (b - l.points[0]), q = f + (f - l.points[1]));
                        b = e.shift();
                        f = e.shift();
                        l = "Q";
                        k.push(p, q, b, f);
                        break;
                    case "t":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "Q" === l.command && (p = b + (b - l.points[0]), q = f + (f - l.points[1]));
                        b += e.shift();
                        f += e.shift();
                        l = "Q";
                        k.push(p, q, b, f);
                        break;
                    case "A":
                        var k = e.shift(), p = e.shift(), q = e.shift(), r = e.shift(), s = e.shift(), u = b, v = f, b = e.shift(), f = e.shift(), l = "A", k = this.convertEndpointToCenterParameterization(u,
                            v, b, f, r, s, k, p, q);
                        break;
                    case "a":
                        k = e.shift(), p = e.shift(), q = e.shift(), r = e.shift(), s = e.shift(), u = b, v = f, b += e.shift(), f += e.shift(), l = "A", k = this.convertEndpointToCenterParameterization(u, v, b, f, r, s, k, p, q)
                }
                c.push({command: l || g, points: k, start: {x: h, y: m}, pathLength: this.calcLength(h, m, l || g, k)})
            }
            ("z" === g || "Z" === g) && c.push({command: "z", points: [], start: void 0, pathLength: 0})
        }
        return c
    };
    Kinetic.Path.calcLength = function (a, c, d, b) {
        var f, e, g = Kinetic.Path;
        switch (d) {
            case "L":
                return g.getLineLength(a, c, b[0], b[1]);
            case "C":
                d =
                    0;
                f = g.getPointOnCubicBezier(0, a, c, b[0], b[1], b[2], b[3], b[4], b[5]);
                for (t = 0.01; 1 >= t; t += 0.01)e = g.getPointOnCubicBezier(t, a, c, b[0], b[1], b[2], b[3], b[4], b[5]), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                return d;
            case "Q":
                d = 0;
                f = g.getPointOnQuadraticBezier(0, a, c, b[0], b[1], b[2], b[3]);
                for (t = 0.01; 1 >= t; t += 0.01)e = g.getPointOnQuadraticBezier(t, a, c, b[0], b[1], b[2], b[3]), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                return d;
            case "A":
                d = 0;
                e = b[4];
                var h = b[5];
                a = b[4] + h;
                c = Math.PI / 180;
                Math.abs(e - a) < c && (c = Math.abs(e - a));
                f = g.getPointOnEllipticalArc(b[0],
                    b[1], b[2], b[3], e, 0);
                if (0 > h)for (t = e - c; t > a; t -= c)e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], t, 0), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e; else for (t = e + c; t < a; t += c)e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], t, 0), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], a, 0);
                return d += g.getLineLength(f.x, f.y, e.x, e.y)
        }
        return 0
    };
    Kinetic.Path.convertEndpointToCenterParameterization = function (a, c, d, b, f, e, g, h, l) {
        l *= Math.PI / 180;
        var k = Math.cos(l) * (a - d) / 2 + Math.sin(l) * (c - b) /
            2, m = -1 * Math.sin(l) * (a - d) / 2 + Math.cos(l) * (c - b) / 2, p = k * k / (g * g) + m * m / (h * h);
        1 < p && (g *= Math.sqrt(p), h *= Math.sqrt(p));
        p = Math.sqrt((g * g * h * h - g * g * m * m - h * h * k * k) / (g * g * m * m + h * h * k * k));
        f == e && (p *= -1);
        isNaN(p) && (p = 0);
        f = p * g * m / h;
        p = p * -h * k / g;
        a = (a + d) / 2 + Math.cos(l) * f - Math.sin(l) * p;
        c = (c + b) / 2 + Math.sin(l) * f + Math.cos(l) * p;
        var q = function (a, b) {
            return(a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]))
        }, r = function (a, b) {
            return(a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(q(a, b))
        };
        b = r([1, 0], [(k - f) / g, (m - p) / h]);
        d = [(k - f) / g, (m - p) / h];
        k = [(-1 * k - f) / g, (-1 * m - p) / h];
        m = r(d, k);
        -1 >= q(d, k) && (m = Math.PI);
        1 <= q(d, k) && (m = 0);
        0 === e && 0 < m && (m -= 2 * Math.PI);
        1 == e && 0 > m && (m += 2 * Math.PI);
        return[a, c, g, h, b, m, l, e]
    };
    Kinetic.Node.addGettersSetters(Kinetic.Path, ["data"])
})();
(function () {
    function a(a) {
        a.fillText(this.partialText, 0, 0)
    }

    function c(a) {
        a.strokeText(this.partialText, 0, 0)
    }

    Kinetic.TextPath = function (a) {
        this._initTextPath(a)
    };
    Kinetic.TextPath.prototype = {_initTextPath: function (d) {
        this.setDefaultAttrs({fontFamily: "Calibri", fontSize: 12, fontStyle: "normal", text: ""});
        this.dummyCanvas = document.createElement("canvas");
        this.dataArray = [];
        var b = this;
        Kinetic.Shape.call(this, d);
        this._fillFunc = a;
        this._strokeFunc = c;
        this.shapeType = "TextPath";
        this._setDrawFuncs();
        this.dataArray =
            Kinetic.Path.parsePathData(this.attrs.data);
        this.on("dataChange", function () {
            b.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
        });
        d = ["text", "textStroke", "textStrokeWidth"];
        for (var f = 0; f < d.length; f++)this.on(d[f] + "Change", b._setTextData);
        b._setTextData()
    }, drawFunc: function (a) {
        var b = a.getContext();
        b.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
        b.textBaseline = "middle";
        b.textAlign = "left";
        b.save();
        for (var c = this.glyphInfo, e = 0; e < c.length; e++) {
            b.save();
            var g = c[e].p0;
            parseFloat(this.attrs.fontSize);
            b.translate(g.x, g.y);
            b.rotate(c[e].rotation);
            this.partialText = c[e].text;
            a.fillStroke(this);
            b.restore()
        }
        b.restore()
    }, getTextWidth: function () {
        return this.textWidth
    }, getTextHeight: function () {
        return this.textHeight
    }, setText: function (a) {
        Kinetic.Text.prototype.setText.call(this, a)
    }, _getTextSize: function (a) {
        var b = this.dummyCanvas.getContext("2d");
        b.save();
        b.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
        a = b.measureText(a);
        b.restore();
        return{width: a.width,
            height: parseInt(this.attrs.fontSize, 10)}
    }, _setTextData: function () {
        var a = this._getTextSize(this.attrs.text);
        this.textWidth = a.width;
        this.textHeight = a.height;
        this.glyphInfo = [];
        for (var a = this.attrs.text.split(""), b, c, e, g = -1, h = 0, l = 0; l < a.length; l++) {
            var k = this._getTextSize(a[l]).width, m = 0, p = 0;
            for (c = void 0; 0.01 < Math.abs(k - m) / k && 25 > p;) {
                p++;
                for (var q = m; void 0 === e;) {
                    a:{
                        h = 0;
                        e = this.dataArray;
                        for (var r = g + 1; r < e.length; r++)if (0 < e[r].pathLength) {
                            g = r;
                            e = e[r];
                            break a
                        } else"M" == e[r].command && (b = {x: e[r].points[0], y: e[r].points[1]});
                        e = {}
                    }
                    e && q + e.pathLength < k && (q += e.pathLength, e = void 0)
                }
                if (e === {} || void 0 === b)break;
                q = !1;
                switch (e.command) {
                    case "L":
                        Kinetic.Path.getLineLength(b.x, b.y, e.points[0], e.points[1]) > k ? c = Kinetic.Path.getPointOnLine(k, b.x, b.y, e.points[0], e.points[1], b.x, b.y) : e = void 0;
                        break;
                    case "A":
                        c = e.points[4];
                        var r = e.points[5], s = e.points[4] + r, h = 0 === h ? c + 1E-8 : k > m ? h + Math.PI / 180 * r / Math.abs(r) : h - Math.PI / 360 * r / Math.abs(r);
                        Math.abs(h) > Math.abs(s) && (h = s, q = !0);
                        c = Kinetic.Path.getPointOnEllipticalArc(e.points[0], e.points[1], e.points[2],
                            e.points[3], h, e.points[6]);
                        break;
                    case "C":
                        h = 0 === h ? k > e.pathLength ? 1E-8 : k / e.pathLength : k > m ? h + (k - m) / e.pathLength : h - (m - k) / e.pathLength;
                        1 < h && (h = 1, q = !0);
                        c = Kinetic.Path.getPointOnCubicBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3], e.points[4], e.points[5]);
                        break;
                    case "Q":
                        h = 0 === h ? k / e.pathLength : k > m ? h + (k - m) / e.pathLength : h - (m - k) / e.pathLength, 1 < h && (h = 1, q = !0), c = Kinetic.Path.getPointOnQuadraticBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3])
                }
                void 0 !== c &&
                (m = Kinetic.Path.getLineLength(b.x, b.y, c.x, c.y));
                q && (e = void 0)
            }
            if (void 0 === b || void 0 === c)break;
            k = Kinetic.Path.getLineLength(b.x, b.y, c.x, c.y);
            k = Kinetic.Path.getPointOnLine(0 + k / 2, b.x, b.y, c.x, c.y);
            m = Math.atan2(c.y - b.y, c.x - b.x);
            this.glyphInfo.push({transposeX: k.x, transposeY: k.y, text: a[l], rotation: m, p0: b, p1: c});
            b = c
        }
    }};
    Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.TextPath, ["fontFamily", "fontSize", "fontStyle"]);
    Kinetic.Node.addGetters(Kinetic.TextPath, ["text"])
})();
var subway = window.subway || {};
subway.version = "0.94";
subway.build = "2012/11/12";
subway.author = "yudg";
subway.comments = "";
subway.init = function (a) {
    subway.functions.init(a)
};
subway.namespace = function (a) {
    if (!a || !a.length)return null;
    a = a.split(".");
    for (var c = subway, d = "subway" == a[0] ? 1 : 0; d < a.length; ++d)c[a[d]] = c[a[d]] || {}, c = c[a[d]];
    return c
};
function debug(a) {
    var c;
    c = "OBJECT->; " + (a + "; ");
    for (var d in a)c += d + "=" + a[d] + "; ";
    return alert(c)
}
subway.namespace("functions");
subway.functions.init = function (a) {
    subway.global.div = a;
    subway.global.stage = subway.functions.stage(a);
    subway.functions.canZoom(subway.global.stage);
    subway.functions.fitScreen(subway.global.stage);
    subway.global.stage.draw()
};
subway.functions.stage = function (a) {
    subway.global.stage = new Kinetic.Stage({container: a, width: subway.constant.stageWidth, height: subway.constant.stageHeight, draggable: subway.constant.draggable});
    for (a = 0; a < subway.functions.layers.length; a++)subway.global.stage.add(subway.functions.layers[a].apply());
    return subway.global.stage
};
subway.functions.layers = [];
subway.functions.drawingLayer = function () {
    for (var a = new Kinetic.Layer, c = 0; 71 > c; c++) {
        var d = new Kinetic.Line({points: [30 * c, 0, 30 * c, 1500], stroke: "#BABABA", strokeWidth: 0.2});
        a.add(d)
    }
    for (c = 0; 51 > c; c++)d = new Kinetic.Line({points: [0, 30 * c, 2100, 30 * c], stroke: "#BABABA", strokeWidth: 0.2}), a.add(d);
    return a
};
subway.functions.layers[0] = function () {
    var a = new Kinetic.Layer({id: "imagesLayer"});
    subway.functions.drawImages(subway.data.pictures, a);
    subway.functions.drawImages(subway.data.lineNameImgs, a);
    subway.functions.drawImages(subway.data.carDepotImgs, a);
    return a
};
subway.functions.layers[1] = function () {
    var a = new Kinetic.Layer({id: "linesLayer"});
    subway.constant.drawSectionFlag ? subway.functions.drawSections(a) : subway.functions.drawLines(a);
    return a
};
subway.functions.layers[2] = function () {
    var a = new Kinetic.Layer, c = new Image;
    c.src = subway.constant.imageFolder + subway.constant.stationNames;
    c = new Kinetic.Image({x: 0, y: 0, width: subway.constant.stageWidth, height: subway.constant.stageHeight, image: c, opacity: 1});
    a.add(c);
    a.drawScene();
    return a
};
subway.functions.layers[3] = function () {
    var a = new Kinetic.Layer({id: "stationsLayer"});
    0 == subway.constant.stationDisplayModel ? subway.functions.loopStations(a) : subway.functions.drawDiffStations(subway.constant.stationDisplayModel, a);
    return a
};
subway.functions.layers[4] = function () {
    return new Kinetic.Layer({id: "circleLayer"})
};
subway.functions.drawLines = function (a) {
    for (var c = subway.constant.lineTypeModel, d = subway.data.lines.length - 1; 0 <= d; d--) {
        var b = subway.data.lines[d];
        b.display && subway.functions.drawLine(b, a, c)
    }
    return a
};
subway.functions.drawLine = function (a, c, d) {
    switch (d) {
        case 0:
            linePath = a.path.single;
            lineWidth = subway.constant.singleLineThickness;
            break;
        case 1:
            linePath = a.path.doubleup;
            lineWidth = subway.constant.doubleLineThickness;
            d = {id: a.id, name: a.name, stroke: subway.constant.isDefaultLineColor ? a.valid ? a.color : subway.constant.invalidColor : subway.constant.customizedLineColor, strokeWidth: lineWidth, data: linePath, isValid: a.valid};
            d = subway.functions.drawSolidLine(d);
            c.add(d);
            linePath = a.path.doubledown;
            break;
        case 2:
            linePath =
                a.path.doubleup;
            lineWidth = subway.constant.doubleLineThickness;
            break;
        case 3:
            linePath = a.path.doubledown;
            lineWidth = subway.constant.doubleLineThickness;
            break;
        default:
            linePath = a.path.single, lineWidth = subway.constant.singleLineThickness
    }
    d = {id: a.id, name: a.name, stroke: subway.constant.isDefaultLineColor ? a.valid ? a.color : subway.constant.invalidColor : subway.constant.customizedLineColor, strokeWidth: lineWidth, data: linePath, isValid: a.valid};
    a = subway.functions.drawSolidLine(d);
    c.add(a);
    return c
};
subway.functions.drawSolidLine = function (a) {
    return new Kinetic.Path(a)
};
subway.functions.drawSections = function (a) {
    var c = subway.data.sectionData[0].sections, d;
    for (d in c) {
        var b = subway.functions.drawSolidLine({id: "section" + (c[d].startstationid ? c[d].startstationid : "") + (c[d].endstationid ? c[d].endstationid : ""), stroke: subway.constant.isDefaultSectionColor ? c[d].color : subway.constant.defaultSectionColor, orgStroke: c[d].color, strokeWidth: c[d].width, data: c[d].path, isValid: !1 == c[d].valid ? !1 : !0, custId: c[d].id});
        a.add(b)
    }
    return a
};
subway.functions.loopStations = function (a) {
    for (var c = subway.data.stations.length - 1; 0 <= c; c--) {
        var d = subway.data.stations[c];
        d.display && subway.functions.drawStations(d, a)
    }
};
subway.functions.drawStations = function (a, c) {
    switch (a.type) {
        case 0:
            subway.functions.drawTerminalStation(a, c);
            break;
        case 1:
            0 == subway.constant.stationShapModel ? subway.functions.drawRectStation(a, c) : 1 == subway.constant.stationShapModel ? subway.functions.drawCircleStation(a, c) : subway.functions.drawRectStation(a, c);
            break;
        case 2:
            subway.constant.isCustomizedStation ? subway.functions.drawCustomizedStation(a, c) : subway.functions.drawTransferStation2(a, c);
            break;
        case 3:
            subway.constant.isCustomizedStation ? subway.functions.drawCustomizedStation(a,
                c) : subway.functions.drawTransferStation3(a, c);
            break;
        case 4:
            subway.constant.isCustomizedStation ? subway.functions.drawCustomizedStation(a, c) : subway.functions.drawTransferStation4(a, c);
            break;
        default:
            alert("DATA ERROR!")
    }
};
subway.functions.drawDiffStations = function (a, c) {
    for (var d = subway.data.stations.length - 1; 0 <= d; d--) {
        var b = subway.data.stations[d];
        if (b.display)switch (a) {
            case 0:
                subway.functions.loopStations(c);
                break;
            case 1:
                0 == b.type ? subway.functions.drawTerminalStation(b, c) : 1 == b.type && 0 == subway.constant.stationShapModel ? subway.functions.drawRectStation(b, c) : 1 == b.type && 1 == subway.constant.stationShapModel && subway.functions.drawCircleStation(b, c);
                break;
            case 2:
                0 == b.type ? subway.functions.drawTerminalStation(b, c) : 2 == b.type ?
                    subway.functions.drawTransferStation2(b, c) : 3 == b.type ? subway.functions.drawTransferStation3(b, c) : 4 == b.type && subway.functions.drawTransferStation4(b, c);
                break;
            default:
                subway.functions.loopStations(c)
        }
    }
};
subway.functions.drawTerminalStation = function (a, c) {
    var d, b, f, e, g;
    switch (a.angle) {
        case 1:
            d = f = a.coord.x;
            b = a.coord.y - 10;
            e = a.coord.y + 10;
            break;
        case 2:
            d = a.coord.x - 10;
            f = a.coord.x + 10;
            b = e = a.coord.y;
            break;
        case 3:
            d = a.coord.x + 7;
            f = a.coord.x - 7;
            b = a.coord.y + 7;
            e = a.coord.y - 7;
            break;
        case 4:
            d = a.coord.x - 7;
            f = a.coord.x + 7;
            b = a.coord.y + 7;
            e = a.coord.y - 7;
            break;
        default:
            alert("DATA ERROR!")
    }
    var h = new Kinetic.Group({id: "station" + a.id, coordx: a.coord.x, coordy: a.coord.y, custId: a.id, name: a.name, type: a.type});
    g = subway.constant.isCustomizedStation ?
        subway.constant.animateNormalStation ? subway.constant.customizedStationColor : subway.constant.invalidColor : a.valid ? a.colors[0] : subway.constant.invalidColor;
    var l = new Kinetic.Line({name: a.name, points: [d, b, f, e], stroke: g, strokeWidth: subway.constant.singleLineThickness});
    h.add(l);
    if (a.valid) {
        if (subway.constant.animateNormalStation && 2 != subway.constant.stationDisplayModel && a.valid) {
            var k = subway.functions.drawCircle({x: a.coord.x, y: a.coord.y, radius: 7, name: a.name, fill: g, stroke: subway.constant.isCustomizedStation ?
                subway.constant.customizedStationStrokeColor : "#FFFFFF", strokeWidth: 2});
            h.add(k);
            k.setVisible(!1);
            h.on("mouseover", function () {
                l.hide();
                k.setVisible(!0);
                k.transitionTo({
                    scale: {x: 1.3, y: 1.3},
                    duration: 1,
                    easing: "elastic-ease-out"
                });
                document.body.style.cursor = "pointer";
                subway.functions.mouseoverStation(this, a)
            });
            h.on("mouseout", function () {
                k.transitionTo({
                    scale: {x: 1, y: 1},
                    duration: 1, easing: "elastic-ease-out"
                });
                k.setVisible(!1);
                l.show();
                document.body.style.cursor = "default";
                subway.functions.mouseoutStation(this, a)
            });
            h.on("click", function () {
                    subway.functions.clickStation(this, a)
                }
            )
        }
    } else l.attrs.fill = subway.constant.invalidColor, l.attrs.stroke = subway.constant.invalidColor;
    c.add(h)
};
subway.functions.drawCircle = function (a) {
    var c = null;
    return c = new Kinetic.Circle(a)
};
subway.functions.drawCustomizedStation = function (a, c) {
    var d = subway.functions.drawCircle({id: "station" + a.id, custId: a.id, x: a.coord.x, y: a.coord.y, name: a.name, radius: 2 == a.type ? 11 : 14, stroke: subway.constant.customizedStationStrokeColor, fill: subway.constant.customizedStationColor, strokeWidth: 3, type: a.type});
    subway.constant.animateTransferStation ? a.valid && (

        d.on("mouseover", function () {
            this.transitionTo({
                scale: {x: 1.3, y: 1.3},
                duration: 1,
                easing: "elastic-ease-out"
            });
            document.body.style.cursor = "pointer";
            subway.functions.mouseoverStation(this, a);
        }),
            d.on("mouseout", function () {
                this.transitionTo({
                    scale: {x: 1, y: 1},
                    duration: 1,
                    easing: "elastic-ease-out"
                });
                document.body.style.cursor = "default";
                subway.functions.mouseoutStation(this, a);
            }),
            d.on("click", function () {
                    subway.functions.clickStation(this, a)
                }
            )) : (d.attrs.fill = subway.constant.invalidColor, d.attrs.stroke = subway.constant.customizedStationStrokeColor);
    c.add(d)
};
subway.functions.drawCircleStation = function (a, c) {
    var d = subway.functions.drawCircle({id: "station" + a.id, custId: a.id, x: a.coord.x, y: a.coord.y, radius: 7, name: a.name, stroke: subway.constant.isCustomizedStation ? subway.constant.customizedStationStrokeColor : subway.constant.customizedStationStrokeColor ? subway.constant.customizedStationStrokeColor : "#FFFFFF", fill: subway.constant.isCustomizedStation ? subway.constant.customizedStationColor : a.valid ? a.colors[0] : subway.constant.invalidColor, strokeWidth: 2, type: a.type});
    !subway.constant.animateNormalStation || !a.valid ? (d.attrs.fill = subway.constant.invalidColor, d.attrs.stroke = subway.constant.customizedStationStrokeColor) : a.valid && (

        d.on("mouseover", function () {
            this.transitionTo({
                scale: {x: 1.3, y: 1.3},
                duration: 1,
                easing: "elastic-ease-out"
            });
            document.body.style.cursor = "pointer";
            subway.functions.mouseoverStation(this, a);
        }),
            d.on("mouseout", function () {
                this.transitionTo({
                    scale: {x: 1, y: 1},
                    duration: 1,
                    easing: "elastic-ease-out"
                });
                document.body.style.cursor = "default";
                subway.functions.mouseoutStation(this, a);
            }),
            d.on("click", function () {
                subway.functions.clickStation(this, a)
            }));
    c.add(d)
};
subway.functions.drawTransferStation2 = function (a, c) {
    var d = new Kinetic.Group({id: "station" + a.id, custId: a.id, name: a.name, x: a.coord.x, y: a.coord.y, type: a.type}), b = subway.functions.drawCircle({radius: 11, stroke: subway.constant.isCustomizedStation ? subway.constant.customizedStationStrokeColor : subway.constant.customizedStationStrokeColor ? subway.constant.customizedStationStrokeColor : "#FFFFFF", strokeWidth: 3});
    d.add(b);
    b = new Kinetic.Path({data: "M0,0L10,0A10,10,0,0,1,-10,0z", fill: a.colors[0]});
    d.add(b);
    b = new Kinetic.Path({data: "M0,0L-10,0A10,10,0,0,1,10,0z",
        fill: a.colors[1]});
    d.add(b);
    subway.constant.animateTransferStation && a.valid && (

        d.on("mouseover", function () {
            this.transitionTo({
                scale: {x: 1.5, y: 1.5},
                duration: 1,
                easing: "elastic-ease-out"
            });
            document.body.style.cursor = "pointer";
            subway.functions.mouseoverStation(this, a);
        }),
            d.on("mouseout", function () {
                this.transitionTo({
                    scale: {x: 1, y: 1},
                    duration: 1,
                    easing: "elastic-ease-out"
                });
                document.body.style.cursor = "default";
                subway.functions.mouseoutStation(this, a)
            }),
            d.on("click", function () {
                    subway.functions.clickStation(this, a)
                }
            ));
    c.add(d)
};
subway.functions.drawTransferStation3 = function (a, c) {
    var d = new Kinetic.Group({id: "station" + a.id, custId: a.id, name: a.name, x: a.coord.x, y: a.coord.y, scale: 1.3, type: a.type}), b = subway.functions.drawCircle({radius: 11, stroke: subway.constant.isCustomizedStation ? subway.constant.customizedStationStrokeColor : subway.constant.customizedStationStrokeColor ? subway.constant.customizedStationStrokeColor : "#FFFFFF", strokeWidth: 3});
    d.add(b);
    b = new Kinetic.Path({data: "M0,0L8,-6A10,10,0,0,1,0,10z", fill: a.colors[0]});
    d.add(b);
    b = new Kinetic.Path({data: "M0,0L0,10A10,10,0,0,1,-8,-6z", fill: a.colors[1]});
    d.add(b);
    b = new Kinetic.Path({data: "M0,0L-8,-6A10,10,0,0,1,8,-6z", fill: a.colors[2]});
    d.add(b);
    subway.constant.animateTransferStation && a.valid && (

        d.on("mouseover", function () {
            this.transitionTo({
                scale: {x: 1.8, y: 1.8},
                duration: 1,
                easing: "elastic-ease-out"
            });
            document.body.style.cursor = "pointer";
            subway.functions.mouseoverStation(this, a);
        }),
            d.on("mouseout", function () {
                this.transitionTo({
                    scale: {x: 1.3, y: 1.3},
                    duration: 1,
                    easing: "elastic-ease-out"
                });
                document.body.style.cursor = "default";
                subway.functions.mouseoutStation(this, a);
            }),
            d.on("click", function () {
                    subway.functions.clickStation(this, a)
                }
            ));
    c.add(d)
};
subway.functions.drawImages = function (a, c) {
    for (var d = 0; d < a.length; d++) {
        var b = a[d];
        if (b.display) {
            var f = new Image;
            f.src = subway.constant.imageFolder + b.url;
            b = new Kinetic.Image({x: b.coord.x, y: b.coord.y, width: b.size.width, height: b.size.height, image: f});
            c.add(b)
        }
    }
};
subway.functions.canZoom = function (a) {
    subway.constant.zoomable && (a.getContainer().onmousewheel = function (c) {
        var d = a.getScale().x + c.wheelDelta * subway.constant.zoomFactor;
        c = a.getScale().y + c.wheelDelta * subway.constant.zoomFactor;
        d >= subway.constant.minScale && d <= subway.constant.maxScale && (c >= subway.constant.minScale && c <= subway.constant.maxScale) && a.transitionTo({scale: {x: d, y: c}, duration: 0.4, easing: "ease-out"})
    })
};
subway.functions.fitScreen = function (a) {
    a.setOffset(subway.constant.stageWidth / 2, subway.constant.stageHeight / 2);
    subway.constant.scale || (subway.constant.scale = Math.min(document.documentElement.clientWidth / subway.constant.stageWidth, document.documentElement.clientHeight / subway.constant.stageHeight));
    a.setScale(subway.constant.scale);
    a.move(document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2)
};

subway.functions.clickStation = function (a, c) {
    //getStationId(a.attrs.custId)
    onMapClickStation(a.attrs.custId);
    return a.attrs.custId;
};
subway.functions.mouseoutStation = function (a, c) {
    //getStationId(a.attrs.custId)
    onMapMouseOutStation(a.attrs.custId);
    return a.attrs.custId;
};
subway.functions.mouseoverStation = function (a, c) {
    //getStationId(a.attrs.custId)
    onMapMouseOverStation(a.attrs.custId);
    return a.attrs.custId;
};

subway.functions.getObjectById = function (a) {
    return subway.global.stage.get("#" + a)[0]
};
subway.namespace("constant");
subway.constant.draggable = !0;
subway.constant.zoomable = !0;
subway.constant.zoomFactor = 0.0010;
subway.constant.minScale = 0.4;
subway.constant.maxScale = 2;
subway.constant.stationColor = "#FFFFFF";
subway.constant.invalidColor = "#C1C1C1";
subway.constant.singleLineThickness = 6;
subway.constant.stageWidth = 2100;
subway.constant.stageHeight = 1500;
subway.constant.imageFolder = "./img/linemap/";
subway.constant.stationNames = "stationNames.png";
subway.constant.lineTypeModel = 1;
subway.constant.doubleLineThickness = 4;
subway.constant.stationShapModel = 1;
subway.constant.stationDisplayModel = 0;
subway.constant.isDefaultLineColor = !0;
subway.constant.customizedLineColor = "#00FF00";
subway.constant.isCustomizedStation = !1;
subway.constant.customizedStationColor = "#00FF00";
subway.constant.customizedStationStrokeColor = "#D1D1D1";
subway.constant.animateTransferStation = !0;
subway.constant.animateNormalStation = !0;
subway.constant.drawSectionFlag = !1;
subway.constant.isDefaultSectionColor = !0;
subway.namespace("global");
subway.global.div = "map";
subway.global.stage = null;
subway.namespace("data");
subway.data.lines = [
    {id: "01", name: "地铁1号线", color: "#C23A30", display: !0, valid: !0, path: {single: "M355,720v70A20,20,0,0,0,375,810h1185", doubleup: "M360,720v60A25,25,0,0,0,375,805h1185", doubledown: "M350,720v60A35,35,0,0,0,375,815h1185"}},
    {id: "02", name: "地铁2号线", color: "#006098", display: !0, valid: !0, path: {single: "M870,750v-100A20,20,0,0,1,890,630h320A20,20,0,0,1,1230,650v170A15,15,0,0,1,1225,830L1205,850A15,15,0,0,1,1195,855h-290A15,15,0,0,1,895,850L875,830A15,15,0,0,1,870,820Z", doubleup: "M865,750v-100A25,25,0,0,1,885,625h325A25,25,0,0,1,1235,655v170A15,15,0,0,1,1230,835L1210,855A15,15,0,0,1,1200,860h-295A25,25,0,0,1,885,850L870,832A15,15,0,0,1,865,820Z",
        doubledown: "M875,750v-100A20,20,0,0,1,895,635h315A20,20,0,0,1,1225,645v170A15,15,0,0,1,1220,830L1205,845A20,20,0,0,1,1190,850h-285A20,20,0,0,1,890,840L882,830A25,25,0,0,1,875,815Z"}},
    {id: "04", name: "地铁4号线", color: "#008E9C", display: !0, valid: !0, path: {single: "M570,460h130A20,20,0,0,1,720,480v175A20,20,0,0,0,740,675h170A20,20,0,0,1,930,695v430v25A20,20,0,0,1,910,1170h-20A20,20,0,0,0,870,1190v265", doubleup: "M570,455h130A25,25,0,0,1,725,480v175A20,20,0,0,0,740,670h170A25,25,0,0,1,935,695v430v25A25,25,0,0,1,910,1175h-20A20,20,0,0,0,875,1190v265",
        doubledown: "M570,465h130A20,20,0,0,1,715,480v175A25,25,0,0,0,740,680h170A20,20,0,0,1,925,695v430v25A20,20,0,0,1,910,1165h-20A25,25,0,0,0,865,1190v265"}},
    {id: "05", name: "地铁5号线", color: "#A6217F", display: !0, valid: !0, path: {single: "M1170,210v860A20,20,0,0,0,1190,1090h10", doubleup: "M1175,210v860A15,15,0,0,0,1190,1085h10", doubledown: "M1165,210v865A23,23,0,0,0,1190,1095h10"}},
    {id: "06", name: "地铁6号线(S1)", color: "#D29700", display: !0, valid: !0, path: {single: "M555,720h580A15,15,0,0,1,1145,725L1165,745A15,15,0,0,0,1175,750h460",
        doubleup: "M1635,745h75A25,25,0,0,1,1730,750L1775,800A15,15,0,0,0,1785,805h165M555,715h580A20,20,0,0,1,1150,720L1170,740A20,20,0,0,0,1175,745h460", doubledown: "M1635,755h75A20,20,0,0,1,1725,760L1770,810A20,15,0,0,0,1785,815h165M555,725h580A15,15,0,0,1,1145,730L1165,750A15,15,0,0,0,1175,755h460"}},
    {id: "07", name: "7号线", color: "#E46022", display: !0, valid: !0, path: {single: "M720,855v35A10,10,0,0,0,730,900h820A10,10,0,0,1,1560,910v75A15,15,0,0,0,1565,995L1635,1065", 
        	doubleup: "M716,855v35A15,10,0,0,0,730,895h820A15,15,0,0,1,1565,910v75A15,15,0,0,0,1570,995L1638,1059", 
        	doubledown: "M705,855v35A21,15,0,0,0,730,905h820A10,10,0,0,1,1555,910v75A15,15,0,0,0,1560,1000L1631,1066"}},
    {id: "08", name: "地铁8号线(S1)", color: "#009B6B", display: !0, valid: !0, path: {single: "M990,240v130A20,20,0,0,0,1010,390h20A20,20,0,0,1,1050,410v220",
        		doubleup: "M1055,630v70A20,20,0,0,0,1070,715h20M850,205h120A25,25,0,0,1,995,230v10M995,240v130A15,15,0,0,0,1010,385h20A25,25,0,0,1,1055,410v220",
        		doubledown: "M1045,630v70A25,25,0,0,0,1070,725h20M850,215h120A20,20,0,0,1,985,230v10M985,240v130A25,25,0,0,0,1010,395h20A20,20,0,0,1,1045,410v220"}},
    {id: "09", name: "地铁9号线", color: "#8FC31F", display: !0, valid: !0, path: {single: "M710,630v220A15,15,0,0,1,705,860L605,950A15,15,0,0,0,600,960v180", doubleup: "M715,630v220A15,15,0,0,1,710,860L615,950A25,25,0,0,0,605,965v175",
        doubledown: "M705,630v210A25,25,0,0,1,695,860L603,945A45,35,0,0,0,595,960v180"}},
    {id: "10", name: "地铁10号线(S1)", color: "#009BC0", display: !0, valid: !0, path: {single: "M720,1080h-40A20,20,0,0,1,660,1060v-260A15,15,0,0,0,655,790L605,740A15,15,0,0,1,600,730v-170A20,20,0,0,1,620,540h640A15,15,0,0,1,1270,545L1375,650A15,15,0,0,1,1380,660v300A15,15,0,0,1,1375,970L1260,1075A15,15,0,0,1,1250,1080h-530", doubleup: "M720,1075h-40A15,15,0,0,1,665,1060v-260A15,15,0,0,0,660,788L610,738A15,15,0,0,1,605,730v-170A20,20,0,0,1,620,545h640A15,15,0,0,1,1265,547L1370,652A15,15,0,0,1,1375,660v300A15,15,0,0,1,1373,965L1255,1073A15,15,0,0,1,1250,1075h-530",
        doubledown: "M720,1085h-40A25,25,0,0,1,655,1060v-260A15,15,0,0,0,650,792L600,742A15,15,0,0,1,595,730v-170A25,25,0,0,1,620,535h640A20,20,0,0,1,1275,543L1375,643A30,30,0,0,1,1385,660v300A20,20,0,0,1,1377,975L1265,1077A20,20,0,0,1,1250,1085h-530"}},
    {id: "13", name: "地铁13号线", color: "#F9E700", display: !0, valid: !0, path: {single: "M860,675v-160A15,15,0,0,0,855,505L815,465A15,15,0,0,1,810,455v-165A20,20,0,0,1,830,270h290A15,15,0,0,1,1130,275L1255,400A15,15,0,0,1,1260,410v50A15,15,0,0,1,1255,470L1245,480A15,15,0,0,0,1240,490v170",
        doubleup: "M855,675v-160A15,15,0,0,0,850,507L810,467A15,15,0,0,1,805,455v-165A25,25,0,0,1,830,265h290A20,20,0,0,1,1135,273L1260,398A15,15,0,0,1,1265,410v50A15,15,0,0,1,1260,472L1250,482A15,15,0,0,0,1245,490v170", doubledown: "M865,675v-160A15,15,0,0,0,860,503L820,463A15,15,0,0,1,815,455v-165A20,20,0,0,1,830,275h290A15,15,0,0,1,1125,277L1250,402A15,15,0,0,1,1255,410v50A15,15,0,0,1,1250,468L1240,478A15,15,0,0,0,1235,490v170"}},
    {id: "14", name: "地铁14号线", color: "#D05F8D", display: !0, valid: !0, path: {single: "M375,990h1045A20,20,0,0,0,1440,970v-395A15,15,0,0,0,1435,565L1340,470A15,15,0,0,1,1335,460v-80A15,15,0,0,1,1340,370L1365,345",
//          doubleup: "M375,985h1045A20,20,0,0,0,1435,970v-395A15,15,0,0,0,1430,567L1333,470A15,15,0,0,1,1330,460v-73A20,20,0,0,1,1335,370L1360,343M375,985h290", 
//        	doubledown: "M375,995h1045A25,25,0,0,0,1445,970v-395A15,15,0,0,0,1440,563L1347,470A15,15,0,0,1,1340,460v-75A15,15,0,0,1,1345,375L1368,348M375,995h290"}},
        	/* 原来的 （M 起始点   V竖着画 V-20 往上20   V20 往下         h横着画 h-20 向左   h20 向右 ）   L1333,470 拉一条到X=1333，Y=470的线段
        	 * （A25,25,0,0,0,1430,567）--> 七个参数 A半径X，半径Y，开始角度，结束角度，是否逆时针，结束坐标X，结束坐标Y  
        	 * doubleup: "M1435,640v100-150A25,25,0,0,0,1430,567L1333,470A15,15,0,0,1,1330,460v-73A20,20,0,0,1,1335,370L1360,343M375,985h290", 
        doubledown: "M1445,640v100-150A30,30,0,0,0,1440,563L1347,470A15,15,0,0,1,1340,460v-75A15,15,0,0,1,1345,375L1368,348M375,995h290"}},
        	 */
         /*   十四号线全线贯通
          *  doubleup: "M1435,640v100-150A25,25,0,0,0,1430,567L1333,470A15,15,0,0,1,1330,460v-73A20,20,0,0,1,1335,370L1360,343M375,985h1040A25,25,0,0,0,1435,960L1435,750", 
        doubledown: "M1445,640v100-150A30,30,0,0,0,1440,563L1347,470A15,15,0,0,1,1340,460v-75A15,15,0,0,1,1345,375L1368,348M375,995h1041A25,25,0,0,0,1445,970L1445,750"}},*/
       //西局到北京南未开通 
        doubleup: "M1435,640v100-150A25,25,0,0,0,1430,567L1333,470A15,15,0,0,1,1330,460v-73A20,20,0,0,1,1335,370L1360,343M375,985h285,M930,985h475A25,25,0,0,0,1435,960L1435,750", 
      doubledown: "M1445,640v100-150A30,30,0,0,0,1440,563L1347,470A15,15,0,0,1,1340,460v-75A15,15,0,0,1,1345,375L1368,348M375,995h285,M930,995h480A27,27,0,0,0,1445,970L1445,750"}},
    {id: "15", name: "地铁15号线(S1)", color: "#6A357D", display: !0, valid: !0, path: {single: "M1260,450h145A20,20,0,0,0,1425,430v-35A15,15,0,0,1,1430,385L1600,215A15,15,0,0,1,1610,210h160",
        	  doubleup: "M835,445h550M1260,445h145A20,20,0,0,0,1420,425v-35A15,15,0,0,1,1425,380L1593,215A20,20,0,0,1,1610,205h160", 
        	doubledown: "M835,455h550M1260,455h143A30,30,0,0,0,1430,433v-30A25,25,0,0,1,1435,388L1603,223A25,25,0,0,1,1615,215h155"}},
    {id: "97", name: "八通线", color: "#C23A30", display: !0, valid: !0, path: {single: "M1500,820h230A15,15,0,0,1,1740,825L1905,990",
        doubleup: "M1500,820h235A20,20,0,0,1,1748,825L1910,987", doubledown: "M1500,830h230A15,15,0,0,1,1743,835L1903,995"}},
    {id: "94", name: "昌平线(S1)", color: "#D47DAA", display: !0, valid: !0, path: {single: "M765,105L845,185A15,15,0,0,1,850,195v30A15,15,0,0,1,845,235L805,275A15,15,0,0,0,800,285v30", 
        	
        /*	doubleup: "M770,102L850,180A25,25,0,0,1,855,195v30A25,25,0,0,1,850,235L817,275A25,25,0,0,0,810,285v30", 
        	doubledown: "M760,108L838,185A20,20,0,0,1,843,195v20A20,20,0,0,1,838,230L800,275A20,20,0,0,0,798,285v30"}},*/
        	
        	doubleup: "M500,90L720,90L770,102L850,180A25,25,0,0,1,855,195v30A25,25,0,0,1,850,235L817,275A25,25,0,0,0,810,285v30", 
        	doubledown: "M500,100L720,100L765,112LL838,185A20,20,0,0,1,843,195v20A20,20,0,0,1,838,230L800,275A20,20,0,0,0,798,285v30"}},
        	
    {id: "93", name: "大兴线",
        color: "#008E9C", display: !0, valid: !0, path: {single: "M930,1125v25A20,20,0,0,1,910,1170h-20A20,20,0,0,0,870,1190v265", doubleup: "M935,1125v25A25,25,0,0,1,910,1175h-20A20,20,0,0,0,875,1190v265", doubledown: "M925,1125v25A20,20,0,0,1,910,1165h-20A25,25,0,0,0,865,1190v265"}},
    {id: "95", name: "房山线", color: "#D85F26", display: !0, valid: !0, path: {single: "M600,1140L515,1225A15,15,0,0,0,510,1235v65A20,20,0,0,1,490,1320h-125", 
        																    doubleup: "M606,1140L521,1225A15,15,0,0,0,515,1235v65A25,25,0,0,1,490,1325h-125", 
        																  doubledown: "M594,1140L509,1225A15,15,0,0,0,505,1235v65A20,20,0,0,1,490,1315h-125"}},
    {id: "96", name: "亦庄线", color: "#F20084", display: !0, valid: !0, path: {single: "M1200,1080v15A20,20,0,0,0,1220,1115h50A20,20,0,0,1,1290,1135v30A20,20,0,0,0,1310,1185h65A15,15,0,0,1,1385,1190L1470,1275A20,20,0,0,0,1500,1275L1585,1190", doubleup: "M1205,1080v15A20,20,0,0,0,1220,1110h50A25,25,0,0,1,1295,1135v30A15,15,0,0,0,1310,1180h60A20,20,0,0,1,1385,1185L1475,1270A15,15,0,0,0,1495,1275L1582,1185", doubledown: "M1195,1080v15A25,25,0,0,0,1220,1120h50A20,20,0,0,1,1285,1135v30A25,25,0,0,0,1310,1190h65A15,15,0,0,1,1383,1195L1470,1280A25,25,0,0,0,1505,1280L1587,1195"}},
    {id: "98", name: "机场专线", color: "#A29BBB", display: !0, valid: !0, path: {single: "M1235,660L1440,455A15,15,0,0,1,1450,450h110A30,30,0,0,0,1590,420v-40m0,40A30,30,0,0,0,1620,450A30,30,0,0,0,1650,420v-30m-90,60h60", doubleup: "M1235,653L1435,453A20,20,0,0,1,1450,445h110A30,30,0,0,0,1585,420v-40m0,30", doubledown: "M1235,667L1317,585L1445,457A20,20,0,0,1,1455,455h170A30,30,0,0,0,1655,425v-35M1645,390v38A25,25,0,0,1,1615,445A25,25,0,0,1,1595,420v-40"}}
];
subway.data.linesColor = {line01: "#C23A30", line02: "#006098", line04: "#008E9C", line05: "#A6217F", line06: "#D29700", line07: "#E46022", line08: "#009B6B", line09: "#8FC31F", line10: "#009BC0", line13: "#F9E700", line14: "#D05F8D", line15: "#6A357D", line97: "#C23A30", line94: "#D47DAA", line93: "#008E9C", line95: "#D85F26", line96: "#F20084", line98: "#A29BBB"};
subway.data.carDepotImgs = [
    {id: "0001", url: "guduan.png", size: {width: 36, height: 20}, coord: {x: 295, y: 755}, display: !0},
    {id: "0002", url: "sihuiduan.png", size: {width: 57, height: 16}, coord: {x: 1500, y: 773}, display: !0},
    {id: "0003", url: "zhuxinzhuangduan.png", size: {width: 76, height: 20}, coord: {x: 700, y: 180}, display: !0},
    {id: "0004", url: "huilongguanduan.png", size: {width: 76, height: 20}, coord: {x: 1010, y: 200}, display: !0},
    {id: "0005", url: "taipingzhuangduan.png", size: {width: 76, height: 20}, coord: {x: 1200, y: 190}, display: !0},
    {id: "0006",
        url: "xiangjiangbeiluduan.png", size: {width: 95, height: 20}, coord: {x: 1460, y: 385}, display: !0},
    {id: "0007", url: "fengbochangduan.png", size: {width: 76, height: 20}, coord: {x: 1730, y: 240}, display: !0},
    {id: "0008", url: "tianlanduan.png", size: {width: 44, height: 14}, coord: {x: 1597, y: 410}, display: !0},
    {id: "0009", url: "wanliuduan.png", size: {width: 57, height: 20}, coord: {x: 615, y: 490}, display: !0},
    {id: "0010", url: "taipinghuduan.png", size: {width: 66, height: 16}, coord: {x: 870, y: 600}, display: !0},
    {id: "0011", url: "tuqiaoduan.png", size: {width: 57,
        height: 20}, coord: {x: 1965, y: 1E3}, display: !0},
    {id: "0012", url: "guogongzhuangduan.png", size: {width: 76, height: 20}, coord: {x: 480, y: 1120}, display: !0},
    {id: "0013", url: "yanchunduan.png", size: {width: 57, height: 20}, coord: {x: 280, y: 1310}, display: !0}
];
subway.data.lineNameImgs = [
    {id: "01", url: "01.png", size: {width: 40, height: 20}, coord: {x: 335, y: 680}, display: !0},
    {id: "02", url: "02.png", size: {width: 40, height: 20}, coord: {x: 970, y: 640}, display: !0},
    {id: "03", url: "03.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "04", url: "04.png", size: {width: 40, height: 20}, coord: {x: 520, y: 450}, display: !0},
    {id: "05", url: "05.png", size: {width: 40, height: 20}, coord: {x: 1150, y: 180}, display: !0},
    {id: "06", url: "06.png", size: {width: 40, height: 20}, coord: {x: 505, y: 710}, display: !0},
    {id: "07",
        url: "07.png", size: {width: 40, height: 20}, coord: {x: 1645, y: 1075}, display: !1},
    {id: "08", url: "08.png", size: {width: 40, height: 20}, coord: {x: 930, y: 150}, display: !0},
    {id: "09", url: "09.png", size: {width: 40, height: 20}, coord: {x: 655, y: 650}, display: !0},
    {id: "10", url: "10.png", size: {width: 40, height: 20}, coord: {x: 550, y: 680}, display: !0},
    {id: "12", url: "12.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "13", url: "13.png", size: {width: 40, height: 20}, coord: {x: 810, y: 615}, display: !0},
    {id: "14", url: "14.png", size: {width: 40, height: 20},
        coord: {x: 325, y: 980}, display: !0},
    {id: "15", url: "15.png", size: {width: 40, height: 20}, coord: {x: 1780, y: 200}, display: !0},
    {id: "16", url: "16.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "17", url: "17.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "93", url: "93.png", size: {width: 40, height: 20}, coord: {x: 890, y: 1185}, display: !0},
    {id: "94", url: "94.png", size: {width: 40, height: 20}, coord: {x: 600, y: 120}, display: !0},
    {id: "95", url: "95.png", size: {width: 40, height: 20}, coord: {x: 630, y: 1130}, display: !0},
    {id: "97",
        url: "97.png", size: {width: 40, height: 20}, coord: {x: 1915, y: 1E3}, display: !0},
    {id: "", url: "01.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "", url: "01.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "", url: "01.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "", url: "01.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "", url: "01.png", size: {width: 40, height: 20}, coord: {}, display: !1},
    {id: "96", url: "96.png", size: {width: 40, height: 20}, coord: {x: 1160, y: 1125}, display: !0},
    {id: "98", url: "98.png",
        size: {width: 40, height: 20}, coord: {x: 1600, y: 465}, display: !0}
];
subway.data.stations = [
                        //一号线
                        
    {id: "0103", name: "苹果园",     type: 0, belong: ["01"], display: !0, valid: !0, angle: 2, textInd: 1, textOst: 10, colors: ["#C23A30"], coord: {x: 355, y: 720}},
    {id: "0104", name: "古城",       type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 375, y: 810}},
    {id: "0105", name: "八角游乐园", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 1, colors: ["#C23A30"], coord: {x: 420, y: 810}},
    {id: "0106", name: "八宝山",     type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2,colors: ["#C23A30"], coord: {x: 465, y: 810}},
    {id: "0107", name: "玉泉路",     type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 1, colors: ["#C23A30"], coord: {x: 510, y: 810}},
    {id: "0108", name: "五棵松",     type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 555, y: 810}},
    {id: "0109", name: "万寿路",     type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 1, colors: ["#C23A30"], coord: {x: 600, y: 810}},
    {id: "0110", name: "公主坟",     type: 2, belong: ["01", "10"], display: !0, valid: !0, textInd: 7,colors: ["#C23A30", "#009BC0"], coord: {x: 660, y: 810}},
    {id: "0111", name: "军事博物馆", type: 1, belong: ["01"], display: !0, valid: !0, colors: ["#C23A30", "#8FC31F"], coord: {x: 710, y: 810}, textPos: {x: 720, y: 787}},
    {id: "0112", name: "木樨地",     type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 780, y: 810}},
    {id: "0113", name: "南礼士路", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 1, colors: ["#C23A30"], coord: {x: 825, y: 810}},
    {id: "0114", name: "复兴门", type: 2, belong: ["01", "02"], display: !0,valid: !0, textInd: 6, colors: ["#C23A30", "#006098"], coord: {x: 870, y: 810}},
    {id: "0115", name: "西单", type: 2, belong: ["01", "04"], display: !0, valid: !0, textInd: 6, colors: ["#C23A30", "#008E9C"], coord: {x: 930, y: 810}},
    {id: "0116", name: "天安门西", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 990, y: 810}},
    {id: "0117", name: "天安门东", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 1050, y: 810}},
    {id: "0118", name: "王府井", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 1110, y: 810}},
    {id: "0119", name: "东单", type: 2, belong: ["01", "05"], display: !0, valid: !0, textInd: 7, colors: ["#C23A30", "#A6217F"], coord: {x: 1170, y: 810}},
    {id: "0120", name: "建国门", type: 2, belong: ["01", "02"], display: !0, valid: !0, textInd: 8, colors: ["#C23A30", "#006098"], coord: {x: 1230, y: 810}},
    {id: "0121", name: "永安里", type: 1, belong: ["01"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 1320, y: 810}},
    {id: "0122", name: "国贸",   type: 2,belong: ["01", "10"], display: !0, valid: !0, textInd: 8, colors: ["#C23A30", "#009BC0"], coord: {x: 1380, y: 810}},
    {id: "0123", name: "大望路", type: 2, belong: ["01", "14"], display: !0, valid: !0, textInd: 8, colors: ["#D05F8D","#C23A30"], coord: {x: 1440, y: 810}},
    {id: "0124", name: "四惠", type: 2, belong: ["01", "97"], display: !0, valid: !0, textInd: 1, colors: ["#C23A30", "#C23A30"], coord: {x: 1500, y: 815}},
    {id: "0125", name: "四惠东", type: 2, belong: ["01", "97"], display: !0, valid: !0, textInd: 1, colors: ["#C23A30", "#C23A30"], coord: {x: 1560, y: 815}},
   
                       //二号线
    
    {id: "0201", name: "西直门",type: 3, belong: ["02", "04", "13"], display: !0, valid: !0, textInd: 8, colors: ["#006098", "#008E9C", "#F9E700"], coord: {x: 865, y: 675}},
    {id: "0202", name: "车公庄", type: 2, belong: ["02", "06"], display: !0, valid: !0, textInd: 8, colors: ["#D29700", "#006098"], coord: {x: 870, y: 720}},
    {id: "0203", name: "阜成门", type: 1, belong: ["02"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#006098"], coord: {x: 870, y: 765}},
    {id: "0205", name: "长椿街", type: 1, belong: ["02"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#006098"], coord: {x: 885,y: 840}},
    {id: "0206", name: "宣武门", type: 2, belong: ["02", "04"], display: !0, valid: !0, textInd: 7, colors: ["#006098", "#008E9C"], coord: {x: 930, y: 855}},
    {id: "0207", name: "和平门", type: 1, belong: ["02"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#006098"], coord: {x: 990, y: 855}},
    {id: "0208", name: "前门", type: 1, belong: ["02"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#006098"], coord: {x: 1080, y: 855}},
    {id: "0209", name: "崇文门", type: 2, belong: ["02", "05"], display: !0, valid: !0, textInd: 7, colors: ["#006098", "#A6217F"],coord: {x: 1170, y: 855}},
    {id: "0210", name: "北京站", type: 1, belong: ["02"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#006098"], coord: {x: 1215, y: 840}},
    {id: "0212", name: "朝阳门", type: 2, belong: ["02", "06"], display: !0, valid: !0, textInd: 8, colors: ["#D29700", "#006098"], coord: {x: 1230, y: 750}},
    {id: "0213", name: "东四十条", type: 1, belong: ["02"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#006098"], coord: {x: 1230, y: 705}},
    {id: "0214", name: "东直门", type: 3, belong: ["02", "13", "98"], display: !0, valid: !0, textInd: 8,colors: ["#A29BBB", "#006098", "#F9E700"], coord: {x: 1235, y: 660}},
    {id: "0215", name: "雍和宫", type: 2, belong: ["02", "05"], display: !0, valid: !0, textInd: 8, colors: ["#006098", "#A6217F"], coord: {x: 1170, y: 630}},
    {id: "0216", name: "安定门", type: 1, belong: ["02"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#006098"], coord: {x: 1110, y: 630}},
    {id: "0217", name: "鼓楼大街", type: 2, belong: ["02", "08"], display: !0, valid: !0, textInd: 2, colors: ["#006098", "#009B6B"], coord: {x: 1050, y: 630}},
    {id: "0218", name: "积水潭", type: 1, belong: ["02"], display: !0,valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#006098"], coord: {x: 960, y: 630}},
        
                    //四号线
        
    {id: "0421", name: "安河桥北", type: 0, belong: ["04"], display: !0, valid: !0, angle: 1, textInd: 1, colors: ["#008E9C"], coord: {x: 570, y: 460}},
    {id: "0423", name: "北宫门", type: 1, belong: ["04"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 2, colors: ["#008E9C"], coord: {x: 615, y: 460}},
    {id: "0425", name: "西苑", type: 1, belong: ["04"], display: !0, valid: !0, textInd: 1, colors: ["#008E9C", "#808080"], coord: {x: 660, y: 460}},
    {id: "0427", name: "圆明园", type: 1, belong: ["04"], display: !0,valid: !0, textInd: 1, colors: ["#008E9C", "#808080"], coord: {x: 705, y: 460}},
    {id: "0429", name: "北京大学东门", type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 720, y: 475}},
    {id: "0431", name: "中关村", type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 720, y: 495}},
    {id: "0433", name: "海淀黄庄", type: 2, belong: ["04", "10"], display: !0, valid: !0, textInd: 6, colors: ["#009BC0", "#008E9C"], coord: {x: 720, y: 540}},
    {id: "0435", name: "人民大学", type: 1, belong: ["04"],display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 720, y: 575}},
    {id: "0437", name: "魏公村", type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 720, y: 602}},
    {id: "0439", name: "国家图书馆", type: 2, belong: ["04", "09"], display: !0, valid: !0, textInd: 8, colors: ["#8FC31F", "#008E9C"], coord: {x: 715, y: 630}},
    {id: "0441", name: "动物园", type: 1, belong: ["04"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#008E9C"], coord: {x: 810, y: 675}},
    {id: "0445", name: "新街口", type: 1, belong: ["04"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 6, colors: ["#008E9C"], coord: {x: 915, y: 675}},
    {id: "0447", name: "平安里", type: 2, belong: ["04", "06"], display: !0, valid: !0, textInd: 6, colors: ["#D29700", "#008E9C"], coord: {x: 930, y: 720}},
    {id: "0449", name: "西四",   type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 930, y: 755}},
    {id: "0451", name: "灵境胡同", type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 930, y: 780}},
    {id: "0457", name: "菜市口",   type: 2, belong: ["04", "07"], display: !0, valid: !0, textInd: 7, colors: ["#E46022","#008E9C"], coord: {x: 930, y: 900}},
    {id: "0459", name: "陶然亭",   type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 930, y: 945}},
    {id: "0461", name: "北京南站", type: 2, belong: ["04", "14"], display: !0, valid: !0, textInd: 8, colors: ["#D05F8D","#008E9C"], coord: {x: 930, y: 990}},
    {id: "0463", name: "马家堡",   type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 930, y: 1035}},
    {id: "0465", name: "角门西",   type: 2, belong: ["04", "10"], display: !0, valid: !0, textInd: 7, colors: ["#009BC0", "#008E9C"], coord: {x: 930, y: 1080}},
    {id: "0467", name: "公益西桥", type: 1, belong: ["04"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 4, colors: ["#008E9C", "#008E9C"], coord: {x: 930, y: 1125}},
   
    
                //五号线
    
    {id: "0521", name: "天通苑北", type: 0, belong: ["05"], display: !0, valid: !0, angle: 2, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 210}},
    {id: "0523", name: "天通苑", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 240}},
    {id: "0525", name: "天通苑南", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 1,textInd: 4, colors: ["#A6217F"], coord: {x: 1170, y: 270}},
    {id: "0527", name: "立水桥", type: 2, belong: ["05", "13"], display: !0, valid: !0, textInd: 4, colors: ["#F9E700", "#A6217F"], coord: {x: 1170, y: 315}},
    {id: "0529", name: "立水桥南", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 360}},
    {id: "0531", name: "北苑路北", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 405}},
    {id: "0533", name: "大屯路东", type: 2, belong: ["05", "15"], display: !0, valid: !0,textInd: 7, colors: ["#6A357D","#A6217F"], coord: {x: 1170, y: 450}},
    {id: "0535", name: "惠新西街北口", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 495}},
    {id: "0537", name: "惠新西街南口", type: 2, belong: ["05", "10"], display: !0, valid: !0, textInd: 7, colors: ["#009BC0", "#A6217F"], coord: {x: 1170, y: 540}},
    {id: "0539", name: "和平西桥", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 575}},
    {id: "0541", name: "和平里北街", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 602}},
    {id: "0545", name: "北新桥", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 660}},
    {id: "0547", name: "张自忠路", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 690}},
    {id: "0549", name: "东四", type: 2, belong: ["05", "06"], display: !0, valid: !0, textInd: 6, colors: ["#D29700", "#A6217F"], coord: {x: 1170, y: 750}},
    {id: "0551", name: "灯市口", type: 1, belong: ["05"],display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#A6217F"], coord: {x: 1170, y: 780}},
    {id: "0557", name: "磁器口", type: 2, belong: ["05", "07"], display: !0, valid: !0, textInd: 8, colors: ["#E46022","#A6217F"], coord: {x: 1170, y: 900}},
    {id: "0559", name: "天坛东门", type: 1, belong: ["05"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#A6217F"], coord: {x: 1170, y: 945}},
    {id: "0561", name: "蒲黄榆", type: 2, belong: ["05", "14"], display: !0, valid: !0, textInd: 8, colors: ["#D05F8D","#A6217F"], coord: {x: 1170, y: 990}},
    {id: "0563", name: "刘家窑", type: 1, belong: ["05"],display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#A6217F"], coord: {x: 1170, y: 1035}},
    {id: "0565", name: "宋家庄", type: 3, belong: ["05", "10", "96"], display: !0, valid: !0, textInd: 7, textOst: 12, colors: ["#F20084", "#A6217F", "#009BC0"], coord: {x: 1200, y: 1085}},
  
                 //六号线
    
    {id: "0621", name: "海淀五路居", type: 0, belong: ["06"], display: !0, valid: !0, angle: 1, textInd: 2, colors: ["#D29700"], coord: {x: 555, y: 720}},
    {id: "0623", name: "慈寿寺", type: 2, belong: ["06", "10"], display: !0, valid: !0, textInd: 6, colors: ["#D29700", "#009BC0"], coord: {x: 600, y: 720}},
    {id: "0625", name: "花园桥", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 660, y: 720}},
    {id: "0627", name: "白石桥南", type: 2, belong: ["06", "09"], display: !0, valid: !0, textInd: 6, colors: ["#D29700", "#8FC31F"], coord: {x: 710, y: 720}},
    {id: "0629", name: "二里沟", type: 1, belong: ["06"], display: !1, valid: !1, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 780, y: 720}},
    {id: "0631", name: "车公庄西", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 820, y: 720}},
    {id: "0637", name: "北海北", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1020, y: 720}},
    {id: "0639", name: "南锣鼓巷", type: 2, belong: ["06","08"], display: !0, valid: !0, textInd: 1, colors: ["#D29700", "#009B6B"], coord: {x: 1080, y: 720}},
    {id: "0645", name: "东大桥", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1320, y: 750}},
    {id: "0647", name: "呼家楼", type: 2, belong: ["06", "10"], display: !0, valid: !0, textInd: 5, colors: ["#D29700", "#009BC0"],coord: {x: 1380, y: 750}},
    {id: "0649", name: "金台路", type: 2, belong: ["06","14"], display: !0, valid: !0, textInd: 1, colors: ["#D05F8D","#D29700", ], coord: {x: 1440, y: 750}},
    {id: "0651", name: "十里堡", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D29700"], coord: {x: 1485, y: 750}},
    {id: "0653", name: "青年路", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1515, y: 750}},
    {id: "0655", name: "褡裢坡", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D29700"],coord: {x: 1545, y: 750}},
    {id: "0657", name: "黄渠", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1575, y: 750}},
    {id: "0659", name: "常营", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D29700"], coord: {x: 1605, y: 750}},
    {id: "0661", name: "草房", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, textInd: 4, colors: ["#D29700"], coord: {x: 1635, y: 750}},
    {id: "0663", name: "物资学院", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D29700"],coord: {x: 1665, y: 750}},
    {id: "0665", name: "北关", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1695, y: 750}},
    {id: "0667", name: "新华大街", type: 1, belong: ["06"], display: !1, valid: !1, angle: 4, direct: 1, textInd: 6, textOst: 10, colors: ["#D29700"], coord: {x: 1735, y: 765}},
    {id: "0669", name: "玉带河大街", type: 1, belong: ["06"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 10, colors: ["#D29700"], coord: {x: 1765, y: 795}},
    {id: "0671", name: "郝家府", type: 1, belong: ["06"], display: !0, valid: !0,angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1830, y: 810}},
    {id: "0673", name: "东部新城", type: 1, belong: ["06"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1890, y: 810}},
    {id: "0675", name: "东小营", type: 0, belong: ["06"], display: !0, valid: !0, angle: 1, textInd: 2, colors: ["#D29700"], coord: {x: 1950, y: 810}},
 
                //七号线
    {id: "0721", name: "北京西站", type: 2, belong: ["07", "09"], display: !0, valid: !0, textInd: 4, colors: ["#E46022","#8FC31F"], coord: {x: 710, y: 855}},
    {id: "0723", name: "湾子", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 735, y: 900}},
    {id: "0725", name: "达官营", type: 1, belong: ["07"], display: !0,valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 780, y: 900}},
    {id: "0727", name: "广安门内", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 855, y: 900}},
    {id: "0731", name: "虎坊桥", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 990, y: 900}},
    {id: "0733", name: "珠市口", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 1050, y: 900}},
    {id: "0735", name: "崇文三里河", type: 1, belong: ["07"],display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 1110, y: 900}},
    {id: "0739", name: "广渠门内", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 1245, y: 900}},
    {id: "0741", name: "广渠门外", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#E46022"], coord: {x: 1320, y: 900}},
    {id: "0745", name: "九龙山", type: 2, belong: ["07", "14"], display: !0, valid: !0, textInd: 5, colors: ["#E46022","#D05F8D"], coord: {x: 1440, y: 900}},
    {id: "0747", name: "大郊亭",type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#E46022"], coord: {x: 1485, y: 900}},
    {id: "0749", name: "百子湾", type: 1, belong: ["07"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#E46022"], coord: {x: 1530, y: 900}},
    {id: "0751", name: "化工", type: 1, belong: ["07"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#E46022"], coord: {x: 1560, y: 915}},
    {id: "0753", name: "南楼梓庄", type: 1, belong: ["07"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#E46022"], coord: {x: 1560, y: 945}},
    {id: "0755", name: "欢乐谷景区", type: 1, belong: ["07"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#E46022"], coord: {x: 1560, y: 975}},
    {id: "0757", name: "垡头", type: 1, belong: ["07"], display: !1, valid: !1, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#E46022"], coord: {x: 1573, y: 1005}},
    {id: "0759", name: "双合村", type: 1, belong: ["07"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#E46022"], coord: {x: 1605, y: 1035}},
    {id: "0761", name: "焦化厂", type: 0, belong: ["07"], display: !0, valid: !0, angle: 4, textInd: 7, textOst: 12,colors: ["#E46022"], coord: {x: 1636, y: 1065}},

               //八号线
        
    {id: "0805", name: "朱辛庄", type: 2, belong: ["94","08"], display: !0, valid: !0, textInd: 7, colors: ["#D47DAA", "#009B6B"], coord: {x: 850, y: 210}},
    {id: "0807", name: "育知路", type: 1, belong: ["08"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009B6B"], coord: {x: 900, y: 210}},
    {id: "0809", name: "平西府", type: 1, belong: ["08"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009B6B"], coord: {x: 960, y: 210}},
    {id: "0811", name: "回龙观东大街", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, textInd: 4,colors: ["#009B6B"], coord: {x: 990, y: 240}},
    {id: "0813", name: "霍营", type: 2, belong: ["08", "13"], display: !0, valid: !0, textInd: 8, colors: ["#F9E700", "#009B6B"], coord: {x: 990, y: 270}},
    {id: "0815", name: "育新", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 990, y: 300}},
    {id: "0817", name: "西小口", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 990, y: 330}},
    {id: "0819", name: "永泰庄", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0,textInd: 3, colors: ["#009B6B"], coord: {x: 990, y: 360}},
    {id: "0821", name: "林萃桥", type: 1, belong: ["08"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 6, colors: ["#009B6B"], coord: {x: 1020, y: 390}},
    {id: "0823", name: "森林公园南门", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 1050, y: 420}},
    {id: "0825", name: "奥林匹克公园", type: 2, belong: ["08", "15"], display: !0, valid: !0, textInd: 7, colors: ["#6A357D","#009B6B"], coord: {x: 1050, y: 450}},
    {id: "0827", name: "奥体中心", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2,direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 1050, y: 495}},
    {id: "0829", name: "北土城", type: 2, belong: ["08", "10"], display: !0, valid: !0, textInd: 7, colors: ["#009BC0", "#009B6B"], coord: {x: 1050, y: 540}},
    {id: "0831", name: "安华桥", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 1050, y: 575}},
    {id: "0833", name: "安德里北街", type: 1, belong: ["08"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 1050, y: 602}},
    {id: "0837", name: "什刹海", type: 1, belong: ["08"], display: !0,valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009B6B"], coord: {x: 1050, y: 675}},
    {id: "0841", name: "中国美术馆", type: 0, belong: ["08"], display: !1, valid: !1, angle: 2, textInd: 3, colors: ["#009B6B"], coord: {x: 1110, y: 750}},
   
    
                   //九号线
    
    {id: "9321", name: "新宫", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#008E9C"], coord: {x: 930, y: 1155}},
    {id: "9323", name: "西红门", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1185}},
    {id: "9325", name: "高米店北", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1215}},
    {id: "9327", name: "高米店南", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1245}},
    {id: "9329", name: "枣园", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1275}},
    {id: "9331", name: "清源路", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"],coord: {x: 870, y: 1305}},
    {id: "9333", name: "黄村西大街", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1335}},
    {id: "9335", name: "黄村火车站", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1365}},
    {id: "9337", name: "义和庄", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1395}},
    {id: "9339", name: "生物医药基地", type: 1, belong: ["93"], display: !0, valid: !0, angle: 2, direct: 0,textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1425}},
    {id: "9341", name: "天宫院", type: 0, belong: ["93"], display: !0, valid: !0, angle: 2, textInd: 3, colors: ["#008E9C"], coord: {x: 870, y: 1455}},
    {id: "0925", name: "白堆子", type: 1, belong: ["09"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#8FC31F"], coord: {x: 710, y: 765}},
    {id: "0931", name: "六里桥东", type: 1, belong: ["09"], display: !0,valid: !0, angle: 3, direct: 0, colors: ["#8FC31F"], coord: {x: 690, y: 875}, textPos: {x: 695, y: 885}},
    {id: "0933", name: "六里桥", type: 2, belong: ["09", "10"], display: !0, valid: !0, textInd: 8, colors: ["#8FC31F", "#009BC0"], coord: {x: 660, y: 900}},
    {id: "0935", name: "七里庄", type: 2, belong: ["09", "14"], display: !0, valid: !0, textInd: 3, colors: ["#D05F8D","#8FC31F"], coord: {x: 600, y: 990}},
    {id: "0937", name: "丰台东大街", type: 1, belong: ["09"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#8FC31F"], coord: {x: 600, y: 1020}},
    {id: "0939", name: "丰台南路", type: 1, belong: ["09"],display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#8FC31F"], coord: {x: 600, y: 1050}},
    {id: "0941", name: "科怡路", type: 1, belong: ["09"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#8FC31F"], coord: {x: 600, y: 1080}},
    {id: "0943", name: "丰台科技园", type: 1, belong: ["09"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#8FC31F"], coord: {x: 600, y: 1110}},
    {id: "0945", name: "郭公庄", type: 2, belong: ["09", "95"], display: !0, valid: !0, textInd: 8, colors: ["#D85F26", "#8FC31F"], coord: {x: 600, y: 1140}},
    {id: "9055", name: "莲花桥", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009BC0"], coord: {x: 660, y: 855}},
    {id: "9059", name: "西钓鱼台", type: 1, belong: ["10"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 3, textOst: 12, colors: ["#009BC0"], coord: {x: 630, y: 765}},
    {id: "9063", name: "车道沟", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009BC0"], coord: {x: 600,y: 660}},
    {id: "9065", name: "长春桥", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009BC0"], coord: {x: 600, y: 615}},
    {id: "9067", name: "火器营", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#009BC0"], coord: {x: 600, y: 570}},
    
 
                    //十号线
    
    {id: "1073", name: "西局",type: 2, belong: ["10", "14"], display: !0, valid: !0, angle: 2, textInd: 8, colors: ["#D05F8D", "#009BC0"], coord: {x: 660, y: 990}},   
    {id: "1001", name: "巴沟", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"], coord: {x: 615, y: 540}},
    {id: "1003", name: "苏州街", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"],coord: {x: 660, y: 540}},
    {id: "1007", name: "知春里", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 795, y: 540}},
    {id: "1009", name: "知春路", type: 2, belong: ["10", "13"], display: !0, valid: !0, textInd: 8, colors: ["#009BC0", "#F9E700"], coord: {x: 860, y: 540}},
    {id: "1011", name: "西土城", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"], coord: {x: 915, y: 540}},
    {id: "1013", name: "牡丹园", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"],coord: {x: 960, y: 540}},
    {id: "1015", name: "健德门", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"], coord: {x: 1005, y: 540}},
    {id: "1019", name: "安贞门", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#009BC0"], coord: {x: 1110, y: 540}},
    {id: "1023", name: "芍药居", type: 2, belong: ["10", "13"], display: !0, valid: !0, textInd: 6, colors: ["#009BC0", "#F9E700"], coord: {x: 1240, y: 540}},
    {id: "1025", name: "太阳宫", type: 1, belong: ["10"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6,textOst: 12, colors: ["#009BC0"], coord: {x: 1280, y: 555}},
    {id: "1027", name: "三元桥", type: 2, belong: ["10", "98"], display: !0, valid: !0, textInd: 4, textOst: 25, colors: ["#A29BBB", "#009BC0"], coord: {x: 1310, y: 585}},
    {id: "1029", name: "亮马桥", type: 1, belong: ["10"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#009BC0"], coord: {x: 1355, y: 630}},
    {id: "1031", name: "农业展览馆", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, textOst: 12, colors: ["#009BC0"], coord: {x: 1380, y: 660}},
    {id: "1033", name: "团结湖", type: 1,belong: ["10"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#009BC0"], coord: {x: 1380, y: 705}},
    {id: "1037", name: "金台夕照", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#009BC0"], coord: {x: 1380, y: 780}},
    {id: "1041", name: "双井", type: 2, belong: ["10", "07"], display: !0, valid: !0, textInd: 5, colors: ["#E46022","#009BC0"], coord: {x: 1380, y: 900}},
    {id: "1043", name: "劲松", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#009BC0"], coord: {x: 1380, y: 930}},
    {id: "1045", name: "潘家园",type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#009BC0"], coord: {x: 1380, y: 960}},
    {id: "1047", name: "十里河", type: 2, belong: ["10", "14"], display: !0, valid: !0, textInd: 8, colors: ["#D05F8D","#009BC0"], coord: {x: 1350, y: 990}},
    {id: "1051", name: "分钟寺", type: 1, belong: ["10"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#009BC0"], coord: {x: 1305, y: 1035}},
    {id: "9029", name: "成寿寺", type: 1, belong: ["10"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#009BC0"], coord: {x: 1273,y: 1064}},
    {id: "9033", name: "石榴庄", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 1110, y: 1080}},
    {id: "9035", name: "大红门", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 1050, y: 1080}},
    {id: "9037", name: "角门东", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 990, y: 1080}},
    {id: "9041", name: "草桥", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"],coord: {x: 855, y: 1080}},
    {id: "9043", name: "纪家庙", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 780, y: 1080}},
    {id: "9045", name: "首经贸", type: 1, belong: ["10"], display: !0, valid: !0, angle: 1, textInd: 2, colors: ["#009BC0"], coord: {x: 720, y: 1080}},
    {id: "9047", name: "丰台火车站", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, textOst: 12, colors: ["#009BC0"], coord: {x: 660, y: 1050}},
    {id: "9049", name: "前泥洼", type: 1, belong: ["10"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3,colors: ["#009BC0"], coord: {x: 660, y: 1020}},
   
            //十三号线    
        
    {id: "1323", name: "大钟寺", type: 1, belong: ["13"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#F9E700"], coord: {x: 860, y: 585}},
    {id: "1327", name: "五道口", type: 1, belong: ["13"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 6, textOst: 10, colors: ["#F9E700"], coord: {x: 845, y: 495}},
    {id: "1329", name: "上地", type: 1, belong: ["13"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#F9E700"], coord: {x: 810, y: 360}},
    {id: "1331", name: "西二旗", type: 2, belong: ["13", "94"], display: !0, valid: !0,textInd: 3, colors: ["#F9E700", "#D47DAA"], coord: {x: 805, y: 315}},
    {id: "1333", name: "龙泽", type: 1, belong: ["13"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#F9E700"], coord: {x: 855, y: 270}},
    {id: "1335", name: "回龙观", type: 1, belong: ["13"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#F9E700"], coord: {x: 915, y: 270}},
    {id: "1341", name: "北苑", type: 1, belong: ["13"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#F9E700"], coord: {x: 1215, y: 360}},
    {id: "1343", name: "望京西", type: 2, belong: ["13","15"], display: !0, valid: !0, textInd: 3, colors: ["#6A357D", "#F9E700"], coord: {x: 1260, y: 450}},
    {id: "1347", name: "光熙门", type: 1, belong: ["13"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#F9E700"], coord: {x: 1240, y: 575}},
    {id: "1349", name: "柳芳", type: 1, belong: ["13"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#F9E700"], coord: {x: 1240, y: 602}},
    
           //十四号线
    
    {id: "1421", name: "张郭庄", type: 0, belong: ["14"], display: !0, valid: !0, angle: 1, textInd: 1, colors: ["#D05F8D"], coord: {x: 375, y: 990}},
    {id: "1423", name: "园博园", type: 1, belong: ["14"],display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 420, y: 990}},
    {id: "1425", name: "大瓦窑", type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 465, y: 990}},
    {id: "1427", name: "郭庄子", type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 510, y: 990}},
    {id: "1429", name: "大井",       type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 555, y: 990}},
    {id: "1435", name: "东管头",     type: 1,belong: ["14"], display: !1, valid: !1, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 720, y: 990}},
    {id: "1437", name: "丽泽商务区", type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 1, textInd: 2, colors: ["#D05F8D"], coord: {x: 780, y: 990}},
    {id: "1439", name: "菜户营",   type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 825, y: 990}},
    {id: "1441", name: "西铁营",   type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 1, textInd: 2, colors: ["#D05F8D"], coord: {x: 855, y: 990}},
    {id: "1443", name: "景风门", type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 885, y: 990}},
    {id: "1447", name: "陶然桥",   type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 990, y: 990}},
    {id: "1449", name: "永定门外", type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D05F8D"], coord: {x: 1050, y: 990}},
    {id: "1451", name: "景泰",   type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 1110,y: 990}},
    {id: "1455", name: "方庄",     type: 1, belong: ["14"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D05F8D"], coord: {x: 1260, y: 990}},
    {id: "1459", name: "南八里庄", type: 1, belong: ["14"], display: !1, valid: !1, angle: 1, direct: 1, textInd: 2, colors: ["#D05F8D"], coord: {x: 1410, y: 990}},
    {id: "1461", name: "北工大西门", type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"], coord: {x: 1440, y: 960}},
    {id: "1463", name: "平乐园",   type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"],coord: {x: 1440, y: 930}},
    {id: "1469", name: "红庙",     type: 1, belong: ["14"], display: !1, valid: !1, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"], coord: {x: 1440, y: 780}},
    {id: "1473", name: "朝阳公园", type: 1, belong: ["14"], display: !1, valid: !1, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"], coord: {x: 1440, y: 705}},
    {id: "1475", name: "枣营",     type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"], coord: {x: 1440, y: 660}},
    {id: "1477", name: "东风北桥", type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4,colors: ["#D05F8D"], coord: {x: 1440, y: 630}},
    {id: "1479", name: "将台路", type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D05F8D"], coord: {x: 1440, y: 600}},
    {id: "1481", name: "高家园", type: 1, belong: ["14"], display: !1, valid: !1, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#D05F8D"], coord: {x: 1425, y: 555}},
    {id: "1483", name: "望京南", type: 1, belong: ["14"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#D05F8D"], coord: {x: 1410, y: 540}},
    {id: "1485", name: "阜通", type: 1, belong: ["14"], display: !0,valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#D05F8D"], coord: {x: 1350, y: 480}},
    {id: "1487", name: "望京",   type: 2, belong: ["14", "15"], display: !0, valid: !0, textInd: 7, colors: ["#6A357D", "#D05F8D"], coord: {x: 1335, y: 450}},
    {id: "1489", name: "东湖渠", type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#D05F8D"], coord: {x: 1335, y: 420}},
    {id: "1491", name: "来广营", type: 1, belong: ["14"], display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#D05F8D"], coord: {x: 1335, y: 390}},
    {id: "1493", name: "善各庄", type: 0, belong: ["14"], display: !0, valid: !0, angle: 3, textInd: 3, colors: ["#D05F8D"], coord: {x: 1365, y: 345}},
     
    
                //十五号线
    
    {id: "1525", name: "双清路", type: 1, belong: ["13"], display: !1, valid: !1, textInd: 5, colors: ["#F9E700"], coord: {x: 810, y: 450}},
    {id: "1525", name: "清华东路西口站", type: 0, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 830, y: 450}},
    {id: "1527", name: "六道口", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 870, y: 450}},
    {id: "1529", name: "北沙滩", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 930, y: 450}},
    {id: "1533", name: "大屯", type: 1, belong: ["15"],display: !1, valid: !1, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1110, y: 450}},
    {id: "1533", name: "安立路", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1110, y: 450}},
    {id: "1537", name: "关庄", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1215, y: 450}},

    {id: "1543", name: "望京东", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1395, y: 450}},
    {id: "1545", name: "崔各庄", type: 1, belong: ["15"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#6A357D"], coord: {x: 1425, y: 420}},
    {id: "1547", name: "马泉营",type: 1, belong: ["15"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#6A357D"], coord: {x: 1440, y: 375}},
    {id: "1549", name: "孙河", type: 1, belong: ["15"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#6A357D"], coord: {x: 1480, y: 335}},
    {id: "1551", name: "国展", type: 1, belong: ["15"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#6A357D"], coord: {x: 1520, y: 295}},
    {id: "1553", name: "花梨坎", type: 1, belong: ["15"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12,colors: ["#6A357D"], coord: {x: 1560, y: 255}},
    {id: "1555", name: "后沙峪", type: 1, belong: ["15"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#6A357D"], coord: {x: 1600, y: 215}},
    {id: "1557", name: "南法信", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1635, y: 210}},
    {id: "1559", name: "石门", type: 1, belong: ["15"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1680, y: 210}},
    {id: "1561", name: "顺义", type: 1, belong: ["15"], display: !0, valid: !0,angle: 1, direct: 0, textInd: 1, colors: ["#6A357D"], coord: {x: 1725, y: 210}},
    {id: "1563", name: "俸伯", type: 0, belong: ["15"], display: !0, valid: !0, angle: 1, textInd: 1, colors: ["#6A357D"], coord: {x: 1770, y: 210}},
    
                  //昌平线
    
    {id: "9419", name: "昌平西山口", type: 0, belong: ["94"], display: !0, valid: !0, angle: 1, textInd: 5,textOst: 12, colors: ["#D47DAA"], coord: {x: 500, y: 95}},
    {id: "9421", name: "十三陵景区", type: 1, belong: ["94"], display: !0, valid: !0, angle: 1, textInd: 5, textOst: 12,colors: ["#D47DAA"], coord: {x: 555, y: 95}},
    {id: "9423", name: "昌平", type: 1, belong: ["94"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 5,textOst: 12, colors: ["#D47DAA"], coord: {x: 615, y: 95}},
    {id: "9425", name: "昌平东关", type: 1, belong: ["94"], display: !0, valid: !0,angle: 1, direct: 1, textInd: 1,textOst: 12, colors: ["#D47DAA"], coord: {x: 660, y: 95}},
    {id: "9427", name: "北邵洼", type: 1, belong: ["94"], display: !0, valid: !0, angle: 1,  direct: 1, textInd: 1,textOst: 12, colors: ["#D47DAA"], coord: {x: 720, y: 95}},
    {id: "9429", name: "南邵",   type: 1, belong: ["94"], display: !0, valid: !0, angle: 4, textInd: 6, textOst: 12, colors: ["#D47DAA"], coord: {x: 765, y: 105}},
    {id: "9431", name: "沙河高教园", type: 1, belong: ["94"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#D47DAA"], coord: {x: 790, y: 130}},
    {id: "9433", name: "沙河", type: 1, belong: ["94"],display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#D47DAA"], coord: {x: 815, y: 155}},
    {id: "9435", name: "巩华城", type: 1, belong: ["94"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 6, textOst: 12, colors: ["#D47DAA"], coord: {x: 840, y: 180}},
    {id: "9439", name: "生命科学园", type: 1, belong: ["94"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 10, colors: ["#D47DAA"], coord: {x: 825, y: 255}},
    
    
                 //良乡线
    
    {id: "9523", name: "大葆台", type: 1, belong: ["95"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#D85F26"],coord: {x: 570, y: 1170}},
    {id: "9525", name: "稻田", type: 1, belong: ["95"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#D85F26"], coord: {x: 540, y: 1200}},
    {id: "9527", name: "长阳", type: 1, belong: ["95"], display: !0, valid: !0, angle: 3, direct: 1, textInd: 5, textOst: 12, colors: ["#D85F26"], coord: {x: 520, y: 1220}},
    {id: "9529", name: "篱笆房", type: 1, belong: ["95"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D85F26"], coord: {x: 510, y: 1245}},
    {id: "9531", name: "广阳城", type: 1, belong: ["95"], display: !0, valid: !0, angle: 2,direct: 1, textInd: 4, colors: ["#D85F26"], coord: {x: 510, y: 1275}},
    {id: "9533", name: "良乡大学城北", type: 1, belong: ["95"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#D85F26"], coord: {x: 510, y: 1305}},
    {id: "9535", name: "良乡大学城", type: 1, belong: ["95"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D85F26"], coord: {x: 495, y: 1320}},
    {id: "9537", name: "良乡大学城西", type: 1, belong: ["95"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#D85F26"], coord: {x: 465, y: 1320}},
    {id: "9539", name: "良乡南关", type: 1, belong: ["95"],display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#D85F26"], coord: {x: 435, y: 1320}},
    {id: "9541", name: "苏庄", type: 1, belong: ["95"], display: !0, valid: !0, angle: 1, textInd: 1, colors: ["#D85F26"], coord: {x: 400, y: 1320}},
    {id: "9237", name: "阎村东", type: 0, belong: ["95"], display: !0, valid: !0, angle: 1, textInd: 1, colors: ["#D85F26"], coord: {x: 365, y: 1320}},
    
               //亦庄线
    
    {id: "9623", name: "肖村", type: 1, belong: ["96"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#F20084"], coord: {x: 1245, y: 1115}},
    {id: "9625", name: "小红门", type: 1, belong: ["96"], display: !0, valid: !0, angle: 2, direct: 1, textInd: 4, colors: ["#F20084"], coord: {x: 1290, y: 1140}},
    {id: "9627", name: "旧宫", type: 1, belong: ["96"],display: !0, valid: !0, angle: 2, direct: 0, textInd: 3, colors: ["#F20084"], coord: {x: 1290, y: 1170}},
    {id: "9629", name: "亦庄桥", type: 1, belong: ["96"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 2, colors: ["#F20084"], coord: {x: 1320, y: 1185}},
    {id: "9631", name: "亦庄文化园", type: 1, belong: ["96"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 1, colors: ["#F20084"], coord: {x: 1350, y: 1185}},
    {id: "9633", name: "万源街", type: 1, belong: ["96"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 7, textOst: 12, colors: ["#F20084"], coord: {x: 1395, y: 1200}},
    {id: "9635", name: "荣京东街", type: 1, belong: ["96"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 7, textOst: 12, colors: ["#F20084"], coord: {x: 1425, y: 1230}},
    {id: "9637", name: "荣昌东街", type: 1, belong: ["96"], display: !0, valid: !0, angle: 4, direct: 1, textInd: 7, textOst: 12, colors: ["#F20084"], coord: {x: 1455, y: 1260}},
    {id: "9639", name: "同济南路", type: 1, belong: ["96"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#F20084"], coord: {x: 1505, y: 1270}},
    {id: "9641", name: "经海路", type: 1, belong: ["96"], display: !0, valid: !0, angle: 3, direct: 0,textInd: 8, textOst: 12, colors: ["#F20084"], coord: {x: 1525, y: 1250}},
    {id: "9643", name: "次渠南", type: 1, belong: ["96"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#F20084"], coord: {x: 1545, y: 1230}},
    {id: "9645", name: "次渠", type: 1, belong: ["96"], display: !0, valid: !0, angle: 3, direct: 0, textInd: 8, textOst: 12, colors: ["#F20084"], coord: {x: 1565, y: 1210}},
    {id: "9647", name: "亦庄火车站", type: 0, belong: ["96"], display: !0, valid: !0, angle: 3, textInd: 8, textOst: 12, colors: ["#F20084"], coord: {x: 1585, y: 1190}},
    
              //八通线
    
    {id: "9703", name: "高碑店", type: 1, belong: ["97"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#C23A30"], coord: {x: 1605, y: 825}},
    {id: "9704", name: "传媒大学", type: 1, belong: ["97"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 1635, y: 825}},
    {id: "9705", name: "双桥", type: 1, belong: ["97"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#C23A30"], coord: {x: 1665, y: 825}},
    {id: "9706", name: "管庄", type: 1, belong: ["97"], display: !0, valid: !0, angle: 1, direct: 1, textInd: 2, colors: ["#C23A30"], coord: {x: 1695, y: 825}},
    {id: "9707", name: "八里桥", type: 1, belong: ["97"], display: !0, valid: !0, angle: 1, direct: 0, textInd: 1, colors: ["#C23A30"], coord: {x: 1725, y: 825}},
    {id: "9708", name: "通州北苑", type: 1, belong: ["97"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#C23A30"], coord: {x: 1755, y: 840}},
    {id: "9709", name: "果园", type: 1, belong: ["97"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#C23A30"], coord: {x: 1785, y: 870}},
    {id: "9710", name: "九棵树", type: 1, belong: ["97"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7,textOst: 12, colors: ["#C23A30"], coord: {x: 1815, y: 900}},
    {id: "9711", name: "梨园", type: 1, belong: ["97"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#C23A30"], coord: {x: 1845, y: 930}},
    {id: "9712", name: "临河里", type: 1, belong: ["97"], display: !0, valid: !0, angle: 4, direct: 0, textInd: 7, textOst: 12, colors: ["#C23A30"], coord: {x: 1875, y: 960}},
    {id: "9713", name: "土桥", type: 0, belong: ["97"], display: !0, valid: !0, angle: 4, textInd: 7, textOst: 12, colors: ["#C23A30"], coord: {x: 1905, y: 990}},
    
    //机场线
    
    {id: "9825", name: "T2航站楼", type: 1, belong: ["98"], display: !0, valid: !0, angle: 2, textInd: 1, textOst: 12, colors: ["#A29BBB"], coord: {x: 1590, y: 380}},
    {id: "9827", name: "T3航站楼", type: 1, belong: ["98"], display: !0, valid: !0, angle: 2, textInd: 1, textOst: 12, colors: ["#A29BBB"], coord: {x: 1650, y: 390}}
    
];
subway.data.pictures = [
    {id: 1, display: !0, url: "tam.png", size: {width: 50, height: 15}, coord: {x: 995, y: 783}},
    {id: 2, display: !0, url: "hcz.png", size: {width: 15, height: 15}, coord: {x: 1215, y: 860}},
    {id: 3, display: !0, url: "hcz.png", size: {width: 15, height: 15}, coord: {x: 735, y: 865}},
    {id: 4, display: !1, url: "hcz.png", size: {width: 15, height: 15}, coord: {x: 630, y: 1060}},
    {id: 5, display: !0, url: "hcz.png", size: {width: 15, height: 15}, coord: {x: 1595, y: 1170}},
    {id: 6, display: !0, url: "fjc.png", size: {width: 32, height: 32}, coord: {x: 1608, y: 320}}
];
subway.data.transferstations = [
    {id: "0110", name: "公主坟", type: 2, belong: ["01", "10"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "10", up: "wn", down: "s"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "10", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#009BC0"], coord: {x: 660, y: 810}},
    {id: "0111", name: "军事博物馆", type: 1, belong: ["01"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "09", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 5, textPosition: [
        {lineid: "01", up: "ne", down: "sw"},
        {lineid: "09", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#8FC31F"], coord: {x: 710, y: 810}, textPos: {x: 665, y: 830}},
    {id: "0114", name: "复兴门", type: 2, belong: ["01", "02"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "02", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "01", up: "ne", down: "sw"},
        {lineid: "02", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#006098"], coord: {x: 870, y: 810}},
    {id: "0115", name: "西单", type: 2, belong: ["01", "04"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "04", up: "n", down: "s"}
    ],
        display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "04", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#008E9C"], coord: {x: 930, y: 810}},
    {id: "0119", name: "东单", type: 2, belong: ["01", "05"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "05", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "05", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#A6217F"], coord: {x: 1170, y: 810}},
    {id: "0120", name: "建国门", type: 2, belong: ["01", "02"], direction: [
        {lineid: "01",
            up: "e", down: "w"},
        {lineid: "02", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "01", up: "e", down: "wn"},
        {lineid: "02", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#006098"], coord: {x: 1230, y: 810}},
    {id: "0122", name: "国贸", type: 2, belong: ["01", "10"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "10", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "10", up: "ne", down: "sw"}
    ], colors: ["#C23A30", "#009BC0"], coord: {x: 1380, y: 810}},
    {id: "0124", name: "四惠",
        type: 2, belong: ["01", "97"], direction: [
        {lineid: "01", up: "e", down: "w"},
        {lineid: "97", up: "e", down: ""}
    ], display: !0, valid: !0, textInd: 1, textPosition: [
        {lineid: "01", up: "ne", down: "sw"},
        {lineid: "97", up: "ne", down: ""}
    ], textOst: 12, colors: ["#C23A30", "#C23A30"], coord: {x: 1500, y: 815}},
    {id: "0125", name: "四惠东", type: 2, belong: ["01", "97"], direction: [
        {lineid: "01", up: "", down: "w"},
        {lineid: "97", up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 1, textPosition: [
        {lineid: "01", up: "ne", down: "sw"},
        {lineid: "97", up: "es", down: "sw"}
    ], textOst: 12,
        colors: ["#C23A30", "#C23A30"], coord: {x: 1560, y: 815}},
    {id: "0201", name: "西直门", type: 3, belong: ["02", "04", "13"], direction: [
        {lineid: "02", up: "s", down: "ne"},
        {lineid: "04", up: "w", down: "e"},
        {lineid: "13", up: "", down: "n"}
    ], display: !0, valid: !0, textInd: 6, textPosition: [
        {lineid: "02", up: "sw", down: "ne"},
        {lineid: "04", up: "w", down: "e"},
        {lineid: "13", up: "", down: "wn"}
    ], colors: ["#006098", "#008E9C", "#F9E700"], coord: {x: 865, y: 675}},
    {id: "0202", name: "车公庄", type: 2, belong: ["02", "06"], direction: [
        {lineid: "02", up: "n", down: "s"},
        {lineid: "06",
            up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "02", up: "ne", down: "sw"},
        {lineid: "06", up: "ne", down: "sw"}
    ], colors: ["#D29700", "#006098"], coord: {x: 870, y: 720}},
    {id: "0206", name: "宣武门", type: 2, belong: ["02", "04"], direction: [
        {lineid: "02", up: "e", down: "w"},
        {lineid: "04", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "02", up: "es", down: "sw"},
        {lineid: "04", up: "e", down: "sw"}
    ], colors: ["#006098", "#008E9C"], coord: {x: 930, y: 855}},
    {id: "0209", name: "崇文门", type: 2, belong: ["02", "05"],
        direction: [
            {lineid: "02", up: "e", down: "w"},
            {lineid: "05", up: "n", down: "s"}
        ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "02", up: "es", down: "sw"},
        {lineid: "05", up: "w", down: "sw"}
    ], colors: ["#006098", "#A6217F"], coord: {x: 1170, y: 855}},
    {id: "0212", name: "朝阳门", type: 2, belong: ["02", "06"], direction: [
        {lineid: "02", up: "n", down: "s"},
        {lineid: "06", up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "02", up: "ne", down: "sw"},
        {lineid: "06", up: "ne", down: "wn"}
    ], colors: ["#D29700", "#006098"], coord: {x: 1230,
        y: 750}},
    {id: "0214", name: "东直门", type: 3, belong: ["02", "13", "98"], direction: [
        {lineid: "02", up: "wn", down: "s"},
        {lineid: "13", up: "n", down: ""},
        {lineid: "98", up: "ne", down: ""}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "02", up: "w", down: "sw"},
        {lineid: "13", up: "wn", down: ""},
        {lineid: "98", up: "e", down: ""}
    ], colors: ["#A29BBB", "#006098", "#F9E700"], coord: {x: 1235, y: 660}},
    {id: "0215", name: "雍和宫", type: 2, belong: ["02", "05"], direction: [
        {lineid: "02", up: "w", down: "e"},
        {lineid: "05", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 8,
        textPosition: [
            {lineid: "02", up: "w", down: "e"},
            {lineid: "05", up: "ne", down: "w"}
        ], colors: ["#006098", "#A6217F"], coord: {x: 1170, y: 630}},
    {id: "0217", name: "鼓楼大街", type: 2, belong: ["02", "08"], direction: [
        {lineid: "02", up: "e", down: "w"},
        {lineid: "08", up: "n", down: ""}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "02", up: "e", down: "w"},
        {lineid: "08", up: "ne", down: ""}
    ], textOst: 12, colors: ["#006098", "#009B6B"], coord: {x: 1050, y: 630}},
    {id: "0433", name: "海淀黄庄", type: 2, belong: ["04", "10"], direction: [
        {lineid: "04", up: "n", down: "s"},
        {lineid: "10", up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 6, textPosition: [
        {lineid: "04", up: "ne", down: "sw"},
        {lineid: "10", up: "ne", down: "wn"}
    ], colors: ["#009BC0", "#008E9C"], coord: {x: 720, y: 540}},
    {id: "0439", name: "国家图书馆", type: 2, belong: ["04", "09"], direction: [
        {lineid: "04", up: "n", down: "s"},
        {lineid: "09", up: "", down: "s"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "04", up: "ne", down: "w"},
        {lineid: "09", up: "", down: "sw"}
    ], colors: ["#8FC31F", "#008E9C"], coord: {x: 715, y: 630}},
    {id: "0447", name: "平安里", type: 2, belong: ["04",
        "06"], direction: [
        {lineid: "04", up: "n", down: "s"},
        {lineid: "06", up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "04", up: "ne", down: "sw"},
        {lineid: "06", up: "ne", down: "s"}
    ], colors: ["#D29700", "#008E9C"], coord: {x: 930, y: 720}},
    {id: "0465", name: "角门西", type: 2, belong: ["04", "10"], direction: [
        {lineid: "04", up: "n", down: "s"},
        {lineid: "10", up: "e", down: "w"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "04", up: "ne", down: "sw"},
        {lineid: "10", up: "ne", down: "wn"}
    ], colors: ["#009BC0", "#008E9C"], coord: {x: 930,
        y: 1080}},
    {id: "0527", name: "立水桥", type: 2, belong: ["05", "13"], direction: [
        {lineid: "05", up: "n", down: "s"},
        {lineid: "13", up: "wn", down: "es"}
    ], display: !0, valid: !0, textInd: 3, textPosition: [
        {lineid: "05", up: "ne", down: "w"},
        {lineid: "13", up: "wn", down: "es"}
    ], colors: ["#F9E700", "#A6217F"], coord: {x: 1170, y: 315}},
    {id: "0537", name: "惠新西街南口", type: 2, belong: ["05", "10"], direction: [
        {lineid: "05", up: "n", down: "s"},
        {lineid: "10", up: "w", down: "e"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "05", up: "ne", down: "sw"},
        {lineid: "10",
            up: "wn", down: "e"}
    ], colors: ["#009BC0", "#A6217F"], coord: {x: 1170, y: 540}},
    {id: "0549", name: "东四", type: 2, belong: ["05", "06"], direction: [
        {lineid: "05", up: "n", down: "s"},
        {lineid: "06", up: "e", down: "wn"}
    ], display: !0, valid: !0, textInd: 3, textPosition: [
        {lineid: "05", up: "ne", down: "sw"},
        {lineid: "06", up: "ne", down: "w"}
    ], colors: ["#D29700", "#A6217F"], coord: {x: 1170, y: 750}},
    {id: "0565", name: "宋家庄", type: 3, belong: ["05", "10", "96"], direction: [
        {lineid: "05", up: "wn", down: ""},
        {lineid: "10", up: "e", down: "w"},
        {lineid: "96", up: "", down: "es"}
    ],
        display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "05", up: "ne", down: "sw"},
        {lineid: "10", up: "ne", down: "sw"},
        {lineid: "96", up: "", down: "s"}
    ], textOst: 12, colors: ["#F20084", "#A6217F", "#009BC0"], coord: {x: 1200, y: 1085}},
    {id: "0623", name: "慈寿寺", type: 2, belong: ["06", "10"], direction: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "10", up: "n", down: "es"}
    ], display: !0, valid: !0, textInd: 6, textPosition: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "10", up: "ne", down: "sw"}
    ], colors: ["#D29700", "#009BC0"], coord: {x: 600, y: 720}},
    {id: "0627", name: "白石桥南",
        type: 2, belong: ["06", "09"], direction: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "09", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 6, textPosition: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "09", up: "ne", down: "sw"}
    ], colors: ["#D29700", "#8FC31F"], coord: {x: 710, y: 720}},
    {id: "0647", name: "呼家楼", type: 2, belong: ["06", "10"], direction: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "10", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 5, textPosition: [
        {lineid: "06", up: "e", down: "w"},
        {lineid: "10", up: "ne", down: "sw"}
    ], colors: ["#D29700", "#009BC0"],
        coord: {x: 1380, y: 750}},
    {id: "0745", name: "九龙山", type: 2, belong: ["07", "14"], direction: [
        {lineid: "07", up: "e", down: "w"},
        {lineid: "14", up: "wn", down: "s"}
    ], display: !1, valid: !1, textInd: 5, textPosition: [
        {lineid: "07", up: "ne", down: "sw"},
        {lineid: "14", up: "ne", down: "sw"}
    ], colors: ["#808080", "#808080"], coord: {x: 1440, y: 900}},
    {id: "0813", name: "霍营", type: 2, belong: ["08", "13"], direction: [
        {lineid: "08", up: "n", down: "s"},
        {lineid: "13", up: "w", down: "e"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "08", up: "ne", down: "sw"},
        {lineid: "13",
            up: "w", down: "e"}
    ], colors: ["#F9E700", "#009B6B"], coord: {x: 990, y: 270}},
    {id: "0829", name: "北土城", type: 2, belong: ["08", "10"], direction: [
        {lineid: "08", up: "n", down: "s"},
        {lineid: "10", up: "w", down: "e"}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "08", up: "ne", down: "sw"},
        {lineid: "10", up: "w", down: "e"}
    ], colors: ["#009BC0", "#009B6B"], coord: {x: 1050, y: 540}},
    {id: "0933", name: "六里桥", type: 2, belong: ["09", "10"], direction: [
        {lineid: "09", up: "ne", down: "sw"},
        {lineid: "10", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 3, textPosition: [
        {lineid: "09",
            up: "e", down: "sw"},
        {lineid: "10", up: "wn", down: "sw"}
    ], colors: ["#8FC31F", "#009BC0"], coord: {x: 660, y: 900}},
    {id: "0945", name: "郭公庄", type: 2, belong: ["09", "95"], direction: [
        {lineid: "09", up: "n", down: ""},
        {lineid: "95", up: "", down: "sw"}
    ], display: !0, valid: !0, textInd: 8, textPosition: [
        {lineid: "09", up: "ne", down: ""},
        {lineid: "95", up: "", down: "sw"}
    ], colors: ["#D85F26", "#8FC31F"], coord: {x: 600, y: 1140}},
    {id: "1009", name: "知春路", type: 2, belong: ["10", "13"], direction: [
        {lineid: "10", up: "w", down: "e"},
        {lineid: "13", up: "s", down: "n"}
    ], display: !0,
        valid: !0, textInd: 8, textPosition: [
        {lineid: "10", up: "w", down: "ne"},
        {lineid: "13", up: "sw", down: "ne"}
    ], colors: ["#009BC0", "#F9E700"], coord: {x: 860, y: 540}},
    {id: "1023", name: "芍药居", type: 2, belong: ["10", "13"], direction: [
        {lineid: "10", up: "w", down: "e"},
        {lineid: "13", up: "n", down: "s"}
    ], display: !0, valid: !0, textInd: 6, textPosition: [
        {lineid: "10", up: "wn", down: "ne"},
        {lineid: "13", up: "ne", down: "sw"}
    ], colors: ["#009BC0", "#F9E700"], coord: {x: 1240, y: 540}},
    {id: "1027", name: "三元桥", type: 2, belong: ["10", "98"], direction: [
        {lineid: "10", up: "wn",
            down: "es"},
        {lineid: "98", up: "ne", down: "sw"}
    ], display: !0, valid: !0, textInd: 4, textPosition: [
        {lineid: "10", up: "ne", down: "sw"},
        {lineid: "98", up: "ne", down: "sw"}
    ], textOst: 25, colors: ["#A29BBB", "#009BC0"], coord: {x: 1310, y: 585}},
    {id: "1331", name: "西二旗", type: 2, belong: ["13", "94"], direction: [
        {lineid: "13", up: "s", down: "n"},
        {lineid: "94", up: "n", down: ""}
    ], display: !0, valid: !0, textInd: 3, textPosition: [
        {lineid: "13", up: "sw", down: "wn"},
        {lineid: "94", up: "ne", down: ""}
    ], colors: ["#F9E700", "#D47DAA"], coord: {x: 805, y: 315}},
    {id: "1343",
        name: "望京西", type: 2, belong: ["13", "15"], direction: [
        {lineid: "13", up: "n", down: "s"},
        {lineid: "15", up: "e", down: ""}
    ], display: !0, valid: !0, textInd: 7, textPosition: [
        {lineid: "13", up: "ne", down: "sw"},
        {lineid: "15", up: "ne", down: ""}
    ], colors: ["#6A357D", "#F9E700"], coord: {x: 1260, y: 450}}
];
subway.namespace("methods");
subway.methods.getObj = function (a) {
    return subway.global.stage.get("#" + a)[0]
};


subway.methods.renderStations = function (a, aaRadius, aaStrokeWidth, aaStrokeColor) {
    aaRadius = ( aaRadius == null || typeof(aaRadius) == undefined ) ? 5 : aaRadius;
    aaStrokeWidth = ( aaStrokeWidth == null || typeof(aaStrokeWidth) == undefined ) ? 3 : aaStrokeWidth;
    aaStrokeColor = ( aaStrokeColor == null || typeof(aaStrokeColor) == undefined ) ? "white" : aaStrokeColor;
    var c = subway.global.stage.get("#circleLayer")[0], d = "", b = "", f;
    for (f in a) {
        b = subway.functions.getObjectById("station" + a[f].id);
        void 0 != b && (0 == b.attrs.type ? (d = b.attrs.coordx, b = b.attrs.coordy) : (d = b.attrs.x, b = b.attrs.y), d = new Kinetic.Circle({x: d, y: b, radius: aaRadius, stroke: aaStrokeColor, strokeWidth: aaStrokeWidth, fill: a[f].color, custId: a[f].id}), c.add(d),
            d.on("mouseout", function () {
                document.body.style.cursor = "pointer";
                subway.functions.mouseoutStation(this, a[f]);
            }),

            d.on("mouseover", function () {
                document.body.style.cursor = "pointer";
                subway.functions.mouseoverStation(this, a[f]);
            }),
            d.on("click", function () {
                subway.functions.clickStation(this, a[f]);
            }));
        subway.methods.addArrowAnimation(d, c);
    }
    c.drawScene()
};
subway.methods.addArrowAnimation = function (pathObj, _layer) {
    var anim = new Kinetic.Animation(function (frame) {
        var scale = Math.sin(frame.time * 2 * Math.PI / 2000) + 0.2;
        pathObj.setScale(scale);
    }, _layer);
    anim.start();
};
subway.methods.renderStationShape = function (a) {
    subway.interface.restoreStationShape();
    a = subway.functions.getObjectById("station" + a);
    void 0 != a && (a.attrs.scale.x = 1.3, a.attrs.scale.y = 1.3, subway.global.stage.get("#stationsLayer")[0].drawScene())
};
subway.methods.restoreStationShape = function () {
    var a = subway.data.stations, c;
    for (c in a) {
        var d = subway.functions.getObjectById("station" + a[c].id);
        void 0 != d && (1 != d.attrs.scale.x && 1 != d.attrs.scale.y) && (d.attrs.scale.x = 1, d.attrs.scale.y = 1)
    }
    subway.global.stage.get("#stationsLayer")[0].drawScene()
};
subway.namespace("interface");
subway.interface.renderStations = function (a, aRadius, aStrokeWidth, aStrokeColor) {
    subway.methods.renderStations(a, aRadius, aStrokeWidth, aStrokeColor)
};
subway.interface.clearStations = function () {
    var a = subway.global.stage.get("#circleLayer")[0];
    a.children = [];
    a.drawScene()
};
subway.interface.renderStationShape = function (a) {
    subway.methods.renderStationShape(a)
};
subway.interface.restoreStationShape = function () {
    subway.methods.restoreStationShape()
};
Kinetic = {};
(function () {
    Kinetic.version = "4.3.3";
    Kinetic.Filters = {};
    Kinetic.Plugins = {};
    Kinetic.Global = {stages: [], idCounter: 0, ids: {}, names: {}, shapes: {}, warn: function (a) {
        window.console && console.warn && console.warn("Kinetic warning: " + a)
    }, extend: function (a, c) {
        for (var d in c.prototype)d in a.prototype || (a.prototype[d] = c.prototype[d])
    }, _addId: function (a, c) {
        void 0 !== c && (this.ids[c] = a)
    }, _removeId: function (a) {
        void 0 !== a && delete this.ids[a]
    }, _addName: function (a, c) {
        void 0 !== c && (void 0 === this.names[c] && (this.names[c] = []),
            this.names[c].push(a))
    }, _removeName: function (a, c) {
        if (void 0 !== a) {
            var d = this.names[a];
            if (void 0 !== d) {
                for (var b = 0; b < d.length; b++)d[b]._id === c && d.splice(b, 1);
                0 === d.length && delete this.names[a]
            }
        }
    }}
})();
(function (a, c) {
    "object" === typeof exports ? module.exports = c() : "function" === typeof define && define.amd ? define(c) : a.returnExports = c()
})(this, function () {
    return Kinetic
});
(function () {
    Kinetic.Type = {_isElement: function (a) {
        return!!(a && 1 == a.nodeType)
    }, _isFunction: function (a) {
        return!(!a || !a.constructor || !a.call || !a.apply)
    }, _isObject: function (a) {
        return!!a && a.constructor == Object
    }, _isArray: function (a) {
        return"[object Array]" == Object.prototype.toString.call(a)
    }, _isNumber: function (a) {
        return"[object Number]" == Object.prototype.toString.call(a)
    }, _isString: function (a) {
        return"[object String]" == Object.prototype.toString.call(a)
    }, _hasMethods: function (a) {
        var c = [], d;
        for (d in a)this._isFunction(a[d]) &&
        c.push(d);
        return 0 < c.length
    }, _isInDocument: function (a) {
        for (; a = a.parentNode;)if (a == document)return!0;
        return!1
    }, _getXY: function (a) {
        if (this._isNumber(a))return{x: a, y: a};
        if (this._isArray(a))if (1 === a.length) {
            a = a[0];
            if (this._isNumber(a))return{x: a, y: a};
            if (this._isArray(a))return{x: a[0], y: a[1]};
            if (this._isObject(a))return a
        } else {
            if (2 <= a.length)return{x: a[0], y: a[1]}
        } else if (this._isObject(a))return a;
        return null
    }, _getSize: function (a) {
        if (this._isNumber(a))return{width: a, height: a};
        if (this._isArray(a))if (1 ===
            a.length) {
            a = a[0];
            if (this._isNumber(a))return{width: a, height: a};
            if (this._isArray(a)) {
                if (4 <= a.length)return{width: a[2], height: a[3]};
                if (2 <= a.length)return{width: a[0], height: a[1]}
            } else if (this._isObject(a))return a
        } else {
            if (4 <= a.length)return{width: a[2], height: a[3]};
            if (2 <= a.length)return{width: a[0], height: a[1]}
        } else if (this._isObject(a))return a;
        return null
    }, _getPoints: function (a) {
        if (void 0 === a)return[];
        if (this._isArray(a[0])) {
            for (var c = [], d = 0; d < a.length; d++)c.push({x: a[d][0], y: a[d][1]});
            return c
        }
        if (this._isObject(a[0]))return a;
        c = [];
        for (d = 0; d < a.length; d += 2)c.push({x: a[d], y: a[d + 1]});
        return c
    }, _getImage: function (a, c) {
        if (a)if (this._isElement(a))c(a); else if (this._isString(a)) {
            var d = new Image;
            d.onload = function () {
                c(d)
            };
            d.src = a
        } else if (a.data) {
            var b = document.createElement("canvas");
            b.width = a.width;
            b.height = a.height;
            b.getContext("2d").putImageData(a, 0, 0);
            b = b.toDataURL();
            d = new Image;
            d.onload = function () {
                c(d)
            };
            d.src = b
        } else c(null); else c(null)
    }, _rgbToHex: function (a, c, d) {
        return(16777216 + (a << 16) + (c << 8) + d).toString(16).slice(1)
    }, _hexToRgb: function (a) {
        a =
            parseInt(a, 16);
        return{r: a >> 16 & 255, g: a >> 8 & 255, b: a & 255}
    }, _getRandomColorKey: function () {
        var a = Math.round(255 * Math.random()), c = Math.round(255 * Math.random()), d = Math.round(255 * Math.random());
        return this._rgbToHex(a, c, d)
    }, _merge: function (a, c) {
        var d = this._clone(c), b;
        for (b in a)this._isObject(a[b]) ? d[b] = this._merge(a[b], d[b]) : d[b] = a[b];
        return d
    }, _clone: function (a) {
        var c = {}, d;
        for (d in a)this._isObject(a[d]) ? c[d] = this._clone(a[d]) : c[d] = a[d];
        return c
    }, _degToRad: function (a) {
        return a * Math.PI / 180
    }, _radToDeg: function (a) {
        return 180 *
            a / Math.PI
    }}
})();
(function () {
    var a = document.createElement("canvas").getContext("2d"), c = (window.devicePixelRatio || 1) / (a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1);
    Kinetic.Canvas = function (a, b, f) {
        this.pixelRatio = f || c;
        this.width = a;
        this.height = b;
        this.element = document.createElement("canvas");
        this.context = this.element.getContext("2d");
        this.setSize(a || 0, b || 0)
    };
    Kinetic.Canvas.prototype = {clear: function () {
        var a = this.getContext(),
            b = this.getElement();
        a.clearRect(0, 0, b.width, b.height)
    }, getElement: function () {
        return this.element
    }, getContext: function () {
        return this.context
    }, setWidth: function (a) {
        this.width = a;
        this.element.width = a * this.pixelRatio;
        this.element.style.width = a + "px"
    }, setHeight: function (a) {
        this.height = a;
        this.element.height = a * this.pixelRatio;
        this.element.style.height = a + "px"
    }, getWidth: function () {
        return this.width
    }, getHeight: function () {
        return this.height
    }, setSize: function (a, b) {
        this.setWidth(a);
        this.setHeight(b)
    }, toDataURL: function (a, b) {
        try {
            return this.element.toDataURL(a, b)
        } catch (c) {
            try {
                return this.element.toDataURL()
            } catch (e) {
                return Kinetic.Global.warn("Unable to get data URL. " + e.message), ""
            }
        }
    }, fill: function (a) {
        a.getFillEnabled() && this._fill(a)
    }, stroke: function (a) {
        a.getStrokeEnabled() && this._stroke(a)
    }, fillStroke: function (a) {
        var b = a.getFillEnabled();
        b && this._fill(a);
        a.getStrokeEnabled() && this._stroke(a, a.hasShadow() && a.hasFill() && b)
    }, applyShadow: function (a, b) {
        var c = this.context;
        c.save();
        this._applyShadow(a);
        b();
        c.restore();
        b()
    }, _applyLineCap: function (a) {
        if (a = a.getLineCap())this.context.lineCap = a
    }, _applyOpacity: function (a) {
        a = a.getAbsoluteOpacity();
        1 !== a && (this.context.globalAlpha = a)
    }, _applyLineJoin: function (a) {
        if (a = a.getLineJoin())this.context.lineJoin = a
    }, _applyAncestorTransforms: function (a) {
        var b = this.context;
        a._eachAncestorReverse(function (a) {
            a = a.getTransform().getMatrix();
            b.transform(a[0], a[1], a[2], a[3], a[4], a[5])
        }, !0)
    }};
    Kinetic.SceneCanvas = function (a, b, c) {
        Kinetic.Canvas.call(this, a, b, c)
    };
    Kinetic.SceneCanvas.prototype =
    {setWidth: function (a) {
        var b = this.pixelRatio;
        Kinetic.Canvas.prototype.setWidth.call(this, a);
        this.context.scale(b, b)
    }, setHeight: function (a) {
        var b = this.pixelRatio;
        Kinetic.Canvas.prototype.setHeight.call(this, a);
        this.context.scale(b, b)
    }, _fillColor: function (a) {
        var b = this.context, c = a.getFill();
        b.fillStyle = c;
        a._fillFunc(b)
    }, _fillPattern: function (a) {
        var b = this.context, c = a.getFillPatternImage(), e = a.getFillPatternX(), g = a.getFillPatternY(), h = a.getFillPatternScale(), l = a.getFillPatternRotation(), k = a.getFillPatternOffset();
        a = a.getFillPatternRepeat();
        if (e || g)b.translate(e || 0, g || 0);
        l && b.rotate(l);
        h && b.scale(h.x, h.y);
        k && b.translate(-1 * k.x, -1 * k.y);
        b.fillStyle = b.createPattern(c, a || "repeat");
        b.fill()
    }, _fillLinearGradient: function (a) {
        var b = this.context, c = a.getFillLinearGradientStartPoint(), e = a.getFillLinearGradientEndPoint();
        a = a.getFillLinearGradientColorStops();
        c = b.createLinearGradient(c.x, c.y, e.x, e.y);
        for (e = 0; e < a.length; e += 2)c.addColorStop(a[e], a[e + 1]);
        b.fillStyle = c;
        b.fill()
    }, _fillRadialGradient: function (a) {
        var b = this.context,
            c = a.getFillRadialGradientStartPoint(), e = a.getFillRadialGradientEndPoint(), g = a.getFillRadialGradientStartRadius(), h = a.getFillRadialGradientEndRadius();
        a = a.getFillRadialGradientColorStops();
        c = b.createRadialGradient(c.x, c.y, g, e.x, e.y, h);
        for (e = 0; e < a.length; e += 2)c.addColorStop(a[e], a[e + 1]);
        b.fillStyle = c;
        b.fill()
    }, _fill: function (a, b) {
        var c = this.context, e = a.getFill(), g = a.getFillPatternImage(), h = a.getFillLinearGradientStartPoint(), l = a.getFillRadialGradientStartPoint(), k = a.getFillPriority();
        c.save();
        !b && a.hasShadow() &&
        this._applyShadow(a);
        e && "color" === k ? this._fillColor(a) : g && "pattern" === k ? this._fillPattern(a) : h && "linear-gradient" === k ? this._fillLinearGradient(a) : l && "radial-gradient" === k ? this._fillRadialGradient(a) : e ? this._fillColor(a) : g ? this._fillPattern(a) : h ? this._fillLinearGradient(a) : l && this._fillRadialGradient(a);
        c.restore();
        !b && a.hasShadow() && this._fill(a, !0)
    }, _stroke: function (a, b) {
        var c = this.context, e = a.getStroke(), g = a.getStrokeWidth(), h = a.getDashArray();
        if (e || g)c.save(), this._applyLineCap(a), h && a.getDashArrayEnabled() &&
            (c.setLineDash ? c.setLineDash(h) : "mozDash"in c ? c.mozDash = h : "webkitLineDash"in c && (c.webkitLineDash = h)), !b && a.hasShadow() && this._applyShadow(a), c.lineWidth = g || 2, c.strokeStyle = e || "black", a._strokeFunc(c), c.restore(), !b && a.hasShadow() && this._stroke(a, !0)
    }, _applyShadow: function (a) {
        var b = this.context;
        if (a.hasShadow() && a.getShadowEnabled()) {
            var c = a.getAbsoluteOpacity(), e = a.getShadowColor() || "black", g = a.getShadowBlur() || 5, h = a.getShadowOffset() || {x: 0, y: 0};
            a.getShadowOpacity() && (b.globalAlpha = a.getShadowOpacity() *
                c);
            b.shadowColor = e;
            b.shadowBlur = g;
            b.shadowOffsetX = h.x;
            b.shadowOffsetY = h.y
        }
    }};
    Kinetic.Global.extend(Kinetic.SceneCanvas, Kinetic.Canvas);
    Kinetic.HitCanvas = function (a, b, c) {
        Kinetic.Canvas.call(this, a, b, c)
    };
    Kinetic.HitCanvas.prototype = {_fill: function (a) {
        var b = this.context;
        b.save();
        b.fillStyle = "#" + a.colorKey;
        a._fillFuncHit(b);
        b.restore()
    }, _stroke: function (a) {
        var b = this.context, c = a.getStroke(), e = a.getStrokeWidth();
        if (c || e)this._applyLineCap(a), b.save(), b.lineWidth = e || 2, b.strokeStyle = "#" + a.colorKey, a._strokeFuncHit(b),
            b.restore()
    }};
    Kinetic.Global.extend(Kinetic.HitCanvas, Kinetic.Canvas)
})();
(function () {
    Kinetic.Tween = function (a, c, d, b, f, e) {
        this._listeners = [];
        this.addListener(this);
        this.obj = a;
        this.propFunc = c;
        this._pos = this.begin = b;
        this.setDuration(e);
        this.isPlaying = !1;
        this.prevPos = this.prevTime = this._change = 0;
        this.looping = !1;
        this._finish = this._startTime = this._position = this._time = 0;
        this.name = "";
        this.func = d;
        this.setFinish(f)
    };
    Kinetic.Tween.prototype = {setTime: function (a) {
        this.prevTime = this._time;
        a > this.getDuration() ? this.looping ? (this.rewind(a - this._duration), this.update(), this.broadcastMessage("onLooped",
            {target: this, type: "onLooped"})) : (this._time = this._duration, this.update(), this.stop(), this.broadcastMessage("onFinished", {target: this, type: "onFinished"})) : (0 > a ? this.rewind() : this._time = a, this.update())
    }, getTime: function () {
        return this._time
    }, setDuration: function (a) {
        this._duration = null === a || 0 >= a ? 1E5 : a
    }, getDuration: function () {
        return this._duration
    }, setPosition: function (a) {
        this.prevPos = this._pos;
        this.propFunc(a);
        this._pos = a;
        this.broadcastMessage("onChanged", {target: this, type: "onChanged"})
    }, getPosition: function (a) {
        void 0 ===
            a && (a = this._time);
        return this.func(a, this.begin, this._change, this._duration)
    }, setFinish: function (a) {
        this._change = a - this.begin
    }, getFinish: function () {
        return this.begin + this._change
    }, start: function () {
        this.rewind();
        this.startEnterFrame();
        this.broadcastMessage("onStarted", {target: this, type: "onStarted"})
    }, rewind: function (a) {
        this.stop();
        this._time = void 0 === a ? 0 : a;
        this.fixTime();
        this.update()
    }, fforward: function () {
        this._time = this._duration;
        this.fixTime();
        this.update()
    }, update: function () {
        this.setPosition(this.getPosition(this._time))
    },
        startEnterFrame: function () {
            this.stopEnterFrame();
            this.isPlaying = !0;
            this.onEnterFrame()
        }, onEnterFrame: function () {
            this.isPlaying && this.nextFrame()
        }, nextFrame: function () {
            this.setTime((this.getTimer() - this._startTime) / 1E3)
        }, stop: function () {
            this.stopEnterFrame();
            this.broadcastMessage("onStopped", {target: this, type: "onStopped"})
        }, stopEnterFrame: function () {
            this.isPlaying = !1
        }, continueTo: function (a, c) {
            this.begin = this._pos;
            this.setFinish(a);
            void 0 !== this._duration && this.setDuration(c);
            this.start()
        }, resume: function () {
            this.fixTime();
            this.startEnterFrame();
            this.broadcastMessage("onResumed", {target: this, type: "onResumed"})
        }, yoyo: function () {
            this.continueTo(this.begin, this._time)
        }, addListener: function (a) {
            this.removeListener(a);
            return this._listeners.push(a)
        }, removeListener: function (a) {
            for (var c = this._listeners, d = c.length; d--;)if (c[d] == a)return c.splice(d, 1), !0;
            return!1
        }, broadcastMessage: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a.push(arguments[c]);
            for (var d = a.shift(), b = this._listeners, f = b.length, c = 0; c < f; c++)b[c][d] && b[c][d].apply(b[c],
                a)
        }, fixTime: function () {
            this._startTime = this.getTimer() - 1E3 * this._time
        }, getTimer: function () {
            return(new Date).getTime() - this._time
        }};
    Kinetic.Tweens = {"back-ease-in": function (a, c, d, b, f, e) {
        return d * (a /= b) * a * (2.70158 * a - 1.70158) + c
    }, "back-ease-out": function (a, c, d, b, f, e) {
        return d * ((a = a / b - 1) * a * (2.70158 * a + 1.70158) + 1) + c
    }, "back-ease-in-out": function (a, c, d, b, f, e) {
        f = 1.70158;
        return 1 > (a /= b / 2) ? d / 2 * a * a * (((f *= 1.525) + 1) * a - f) + c : d / 2 * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + c
    }, "elastic-ease-in": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 ===
            a)return c;
        if (1 == (a /= b))return c + d;
        e || (e = 0.3 * b);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return-(f * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e)) + c
    }, "elastic-ease-out": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 === a)return c;
        if (1 == (a /= b))return c + d;
        e || (e = 0.3 * b);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return f * Math.pow(2, -10 * a) * Math.sin((a * b - g) * 2 * Math.PI / e) + d + c
    }, "elastic-ease-in-out": function (a, c, d, b, f, e) {
        var g = 0;
        if (0 === a)return c;
        if (2 == (a /= b / 2))return c + d;
        e ||
        (e = b * 0.3 * 1.5);
        !f || f < Math.abs(d) ? (f = d, g = e / 4) : g = e / (2 * Math.PI) * Math.asin(d / f);
        return 1 > a ? -0.5 * f * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e) + c : 0.5 * f * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * b - g) * 2 * Math.PI / e) + d + c
    }, "bounce-ease-out": function (a, c, d, b) {
        return(a /= b) < 1 / 2.75 ? d * 7.5625 * a * a + c : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
    }, "bounce-ease-in": function (a, c, d, b) {
        return d - Kinetic.Tweens["bounce-ease-out"](b - a, 0, d, b) +
            c
    }, "bounce-ease-in-out": function (a, c, d, b) {
        return a < b / 2 ? 0.5 * Kinetic.Tweens["bounce-ease-in"](2 * a, 0, d, b) + c : 0.5 * Kinetic.Tweens["bounce-ease-out"](2 * a - b, 0, d, b) + 0.5 * d + c
    }, "ease-in": function (a, c, d, b) {
        return d * (a /= b) * a + c
    }, "ease-out": function (a, c, d, b) {
        return-d * (a /= b) * (a - 2) + c
    }, "ease-in-out": function (a, c, d, b) {
        return 1 > (a /= b / 2) ? d / 2 * a * a + c : -d / 2 * (--a * (a - 2) - 1) + c
    }, "strong-ease-in": function (a, c, d, b) {
        return d * (a /= b) * a * a * a * a + c
    }, "strong-ease-out": function (a, c, d, b) {
        return d * ((a = a / b - 1) * a * a * a * a + 1) + c
    }, "strong-ease-in-out": function (a, c, d, b) {
        return 1 > (a /= b / 2) ? d / 2 * a * a * a * a * a + c : d / 2 * ((a -= 2) * a * a * a * a + 2) + c
    }, linear: function (a, c, d, b) {
        return d * a / b + c
    }}
})();
(function () {
    Kinetic.Transform = function () {
        this.m = [1, 0, 0, 1, 0, 0]
    };
    Kinetic.Transform.prototype = {translate: function (a, c) {
        this.m[4] += this.m[0] * a + this.m[2] * c;
        this.m[5] += this.m[1] * a + this.m[3] * c
    }, scale: function (a, c) {
        this.m[0] *= a;
        this.m[1] *= a;
        this.m[2] *= c;
        this.m[3] *= c
    }, rotate: function (a) {
        var c = Math.cos(a);
        a = Math.sin(a);
        var d = this.m[1] * c + this.m[3] * a, b = this.m[0] * -a + this.m[2] * c, f = this.m[1] * -a + this.m[3] * c;
        this.m[0] = this.m[0] * c + this.m[2] * a;
        this.m[1] = d;
        this.m[2] = b;
        this.m[3] = f
    }, getTranslation: function () {
        return{x: this.m[4],
            y: this.m[5]}
    }, multiply: function (a) {
        var c = this.m[1] * a.m[0] + this.m[3] * a.m[1], d = this.m[0] * a.m[2] + this.m[2] * a.m[3], b = this.m[1] * a.m[2] + this.m[3] * a.m[3], f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4], e = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
        this.m[0] = this.m[0] * a.m[0] + this.m[2] * a.m[1];
        this.m[1] = c;
        this.m[2] = d;
        this.m[3] = b;
        this.m[4] = f;
        this.m[5] = e
    }, invert: function () {
        var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), c = -this.m[1] * a, d = -this.m[2] * a, b = this.m[0] * a, f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
            e = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = this.m[3] * a;
        this.m[1] = c;
        this.m[2] = d;
        this.m[3] = b;
        this.m[4] = f;
        this.m[5] = e
    }, getMatrix: function () {
        return this.m
    }}
})();
(function () {
    Kinetic.Collection = function () {
        var a = [].slice.call(arguments), c = a.length, d = 0;
        for (this.length = c; d < c; d++)this[d] = a[d];
        return this
    };
    Kinetic.Collection.prototype = [];
    Kinetic.Collection.prototype.apply = function (a) {
        args = [].slice.call(arguments);
        args.shift();
        for (var c = 0; c < this.length; c++)Kinetic.Type._isFunction(this[c][a]) && this[c][a].apply(this[c], args)
    };
    Kinetic.Collection.prototype.each = function (a) {
        for (var c = 0; c < this.length; c++)a.call(this[c], c, this[c])
    }
})();
(function () {
    Kinetic.Filters.Grayscale = function (a, c) {
        for (var d = a.data, b = 0; b < d.length; b += 4) {
            var f = 0.34 * d[b] + 0.5 * d[b + 1] + 0.16 * d[b + 2];
            d[b] = f;
            d[b + 1] = f;
            d[b + 2] = f
        }
    }
})();
(function () {
    Kinetic.Filters.Brighten = function (a, c) {
        for (var d = c.val || 0, b = a.data, f = 0; f < b.length; f += 4)b[f] += d, b[f + 1] += d, b[f + 2] += d
    }
})();
(function () {
    Kinetic.Filters.Invert = function (a, c) {
        for (var d = a.data, b = 0; b < d.length; b += 4)d[b] = 255 - d[b], d[b + 1] = 255 - d[b + 1], d[b + 2] = 255 - d[b + 2]
    }
})();
(function () {
    Kinetic.Node = function (a) {
        this._nodeInit(a)
    };
    Kinetic.Node.prototype = {_nodeInit: function (a) {
        this._id = Kinetic.Global.idCounter++;
        this.defaultNodeAttrs = {visible: !0, listening: !0, name: void 0, opacity: 1, x: 0, y: 0, scale: {x: 1, y: 1}, rotation: 0, offset: {x: 0, y: 0}, draggable: !1, dragOnTop: !0};
        this.setDefaultAttrs(this.defaultNodeAttrs);
        this.eventListeners = {};
        this.setAttrs(a)
    }, on: function (a, b) {
        for (var c = a.split(" "), e = c.length, g = 0; g < e; g++) {
            var h = c[g].split("."), l = h[0], h = 1 < h.length ? h[1] : "";
            this.eventListeners[l] ||
            (this.eventListeners[l] = []);
            this.eventListeners[l].push({name: h, handler: b})
        }
    }, off: function (a) {
        a = a.split(" ");
        for (var b = a.length, c = 0; c < b; c++) {
            var e = a[c], g = e.split("."), h = g[0];
            if (1 < g.length)if (h)this.eventListeners[h] && this._off(h, g[1]); else for (e in this.eventListeners)this._off(e, g[1]); else delete this.eventListeners[h]
        }
    }, remove: function () {
        var a = this.getParent();
        a && a.children && (a.children.splice(this.index, 1), a._setChildrenIndices());
        delete this.parent
    }, destroy: function () {
        this.getParent();
        this.getStage();
        for (var a = Kinetic.DD, b = Kinetic.Global; this.children && 0 < this.children.length;)this.children[0].destroy();
        b._removeId(this.getId());
        b._removeName(this.getName(), this._id);
        a && (a.node && a.node._id === this._id) && node._endDrag();
        this.trans && this.trans.stop();
        this.remove()
    }, getAttrs: function () {
        return this.attrs
    }, setDefaultAttrs: function (a) {
        void 0 === this.attrs && (this.attrs = {});
        if (a)for (var b in a)void 0 === this.attrs[b] && (this.attrs[b] = a[b])
    }, setAttrs: function (a) {
        if (a)for (var b in a) {
            var c = "set" + b.charAt(0).toUpperCase() +
                b.slice(1);
            if (Kinetic.Type._isFunction(this[c]))this[c](a[b]); else this.setAttr(b, a[b])
        }
    }, getVisible: function () {
        var a = this.attrs.visible, b = this.getParent();
        return a && b && !b.getVisible() ? !1 : a
    }, getListening: function () {
        var a = this.attrs.listening, b = this.getParent();
        return a && b && !b.getListening() ? !1 : a
    }, show: function () {
        this.setVisible(!0)
    }, hide: function () {
        this.setVisible(!1)
    }, getZIndex: function () {
        return this.index
    }, getAbsoluteZIndex: function () {
        function a(g) {
            for (var h = [], l = g.length, k = 0; k < l; k++) {
                var m = g[k];
                e++;
                "Shape" !== m.nodeType && (h = h.concat(m.getChildren()));
                m._id === c._id && (k = l)
            }
            0 < h.length && h[0].getLevel() <= b && a(h)
        }

        var b = this.getLevel();
        this.getStage();
        var c = this, e = 0;
        "Stage" !== c.nodeType && a(c.getStage().getChildren());
        return e
    }, getLevel: function () {
        for (var a = 0, b = this.parent; b;)a++, b = b.parent;
        return a
    }, setPosition: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments));
        this.setAttr("x", a.x);
        this.setAttr("y", a.y)
    }, getPosition: function () {
        var a = this.attrs;
        return{x: a.x, y: a.y}
    }, getAbsolutePosition: function () {
        var a =
            this.getAbsoluteTransform(), b = this.getOffset();
        a.translate(b.x, b.y);
        return a.getTranslation()
    }, setAbsolutePosition: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments)), b = this._clearTransform();
        this.attrs.x = b.x;
        this.attrs.y = b.y;
        delete b.x;
        delete b.y;
        var c = this.getAbsoluteTransform();
        c.invert();
        c.translate(a.x, a.y);
        a = {x: this.attrs.x + c.getTranslation().x, y: this.attrs.y + c.getTranslation().y};
        this.setPosition(a.x, a.y);
        this._setTransform(b)
    }, move: function () {
        var a = Kinetic.Type._getXY([].slice.call(arguments)),
            b = this.getX(), c = this.getY();
        void 0 !== a.x && (b += a.x);
        void 0 !== a.y && (c += a.y);
        this.setPosition(b, c)
    }, _eachAncestorReverse: function (a, b) {
        var c = [], e = this.getParent();
        for (b && c.unshift(this); e;)c.unshift(e), e = e.parent;
        for (var e = c.length, g = 0; g < e; g++)a(c[g])
    }, rotate: function (a) {
        this.setRotation(this.getRotation() + a)
    }, rotateDeg: function (a) {
        this.setRotation(this.getRotation() + Kinetic.Type._degToRad(a))
    }, moveToTop: function () {
        this.parent.children.splice(this.index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
        return!0
    }, moveUp: function () {
        var a = this.index, b = this.parent.getChildren().length;
        if (a < b - 1)return this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices(), !0
    }, moveDown: function () {
        var a = this.index;
        if (0 < a)return this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices(), !0
    }, moveToBottom: function () {
        var a = this.index;
        if (0 < a)return this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(),
            !0
    }, setZIndex: function (a) {
        this.parent.children.splice(this.index, 1);
        this.parent.children.splice(a, 0, this);
        this.parent._setChildrenIndices()
    }, getAbsoluteOpacity: function () {
        var a = this.getOpacity();
        this.getParent() && (a *= this.getParent().getAbsoluteOpacity());
        return a
    }, moveTo: function (a) {
        Kinetic.Node.prototype.remove.call(this);
        a.add(this)
    }, toObject: function () {
        var a = Kinetic.Type, b = {}, c = this.attrs;
        b.attrs = {};
        for (var e in c) {
            var g = c[e];
            if (!a._isFunction(g) && !a._isElement(g) && (!a._isObject(g) || !a._hasMethods(g)))b.attrs[e] =
                g
        }
        b.nodeType = this.nodeType;
        b.shapeType = this.shapeType;
        return b
    }, toJSON: function () {
        return JSON.stringify(this.toObject())
    }, getParent: function () {
        return this.parent
    }, getLayer: function () {
        return this.getParent().getLayer()
    }, getStage: function () {
        if (this.getParent())return this.getParent().getStage()
    }, simulate: function (a, b) {
        this._handleEvent(a, b || {})
    }, fire: function (a, b) {
        this._executeHandlers(a, b || {})
    }, getAbsoluteTransform: function () {
        var a = new Kinetic.Transform;
        this._eachAncestorReverse(function (b) {
            b = b.getTransform();
            a.multiply(b)
        }, !0);
        return a
    }, getTransform: function () {
        var a = new Kinetic.Transform, b = this.attrs, c = b.x, e = b.y, g = b.rotation, h = b.scale, l = h.x, h = h.y, k = b.offset, b = k.x, k = k.y;
        (0 !== c || 0 !== e) && a.translate(c, e);
        0 !== g && a.rotate(g);
        (1 !== l || 1 !== h) && a.scale(l, h);
        (0 !== b || 0 !== k) && a.translate(-1 * b, -1 * k);
        return a
    }, clone: function (a) {
        var b = new Kinetic[this.shapeType || this.nodeType](this.attrs), c;
        for (c in this.eventListeners)for (var e = this.eventListeners[c], g = e.length, h = 0; h < g; h++) {
            var l = e[h];
            0 > l.name.indexOf("kinetic") &&
            (b.eventListeners[c] || (b.eventListeners[c] = []), b.eventListeners[c].push(l))
        }
        b.setAttrs(a);
        return b
    }, toDataURL: function (a) {
        a = a || {};
        var b = a.mimeType || null, c = a.quality || null, e, g = a.x || 0, h = a.y || 0;
        a.width && a.height ? a = new Kinetic.SceneCanvas(a.width, a.height, 1) : (a = this.getStage().bufferCanvas, a.clear());
        e = a.getContext();
        e.save();
        (g || h) && e.translate(-1 * g, -1 * h);
        this.drawScene(a);
        e.restore();
        return a.toDataURL(b, c)
    }, toImage: function (a) {
        Kinetic.Type._getImage(this.toDataURL(a), function (b) {
            a.callback(b)
        })
    }, setSize: function () {
        var a =
            Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setWidth(a.width);
        this.setHeight(a.height)
    }, getSize: function () {
        return{width: this.getWidth(), height: this.getHeight()}
    }, getWidth: function () {
        return this.attrs.width || 0
    }, getHeight: function () {
        return this.attrs.height || 0
    }, _get: function (a) {
        return this.nodeType === a ? [this] : []
    }, _off: function (a, b) {
        for (var c = 0; c < this.eventListeners[a].length; c++)if (this.eventListeners[a][c].name === b) {
            this.eventListeners[a].splice(c, 1);
            if (0 === this.eventListeners[a].length) {
                delete this.eventListeners[a];
                break
            }
            c--
        }
    }, _clearTransform: function () {
        var a = this.attrs, b = a.scale, c = a.offset, a = {x: a.x, y: a.y, rotation: a.rotation, scale: {x: b.x, y: b.y}, offset: {x: c.x, y: c.y}};
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scale = {x: 1, y: 1};
        this.attrs.offset = {x: 0, y: 0};
        return a
    }, _setTransform: function (a) {
        for (var b in a)this.attrs[b] = a[b]
    }, _fireBeforeChangeEvent: function (a, b, c) {
        this._handleEvent("before" + a.toUpperCase() + "Change", {oldVal: b, newVal: c})
    }, _fireChangeEvent: function (a, b, c) {
        this._handleEvent(a + "Change",
            {oldVal: b, newVal: c})
    }, setId: function (a) {
        var b = this.getId();
        this.getStage();
        var c = Kinetic.Global;
        c._removeId(b);
        c._addId(this, a);
        this.setAttr("id", a)
    }, setName: function (a) {
        var b = this.getName();
        this.getStage();
        var c = Kinetic.Global;
        c._removeName(b, this._id);
        c._addName(this, a);
        this.setAttr("name", a)
    }, setAttr: function (a, b) {
        if (void 0 !== b) {
            var c = this.attrs[a];
            this._fireBeforeChangeEvent(a, c, b);
            this.attrs[a] = b;
            this._fireChangeEvent(a, c, b)
        }
    }, _handleEvent: function (a, b, c) {
        b && "Shape" === this.nodeType && (b.shape =
            this);
        this.getStage();
        var e = this.eventListeners, g = !0;
        "mouseenter" === a && c && this._id === c._id ? g = !1 : "mouseleave" === a && (c && this._id === c._id) && (g = !1);
        g && (e[a] && this.fire(a, b), b && (!b.cancelBubble && this.parent) && (c && c.parent ? this._handleEvent.call(this.parent, a, b, c.parent) : this._handleEvent.call(this.parent, a, b)))
    }, _executeHandlers: function (a, b) {
        for (var c = this.eventListeners[a], e = c.length, g = 0; g < e; g++)c[g].handler.apply(this, [b])
    }};
    Kinetic.Node.addSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addSetter(a,
            b[e])
    };
    Kinetic.Node.addPointSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addPointSetter(a, b[e])
    };
    Kinetic.Node.addRotationSetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addRotationSetter(a, b[e])
    };
    Kinetic.Node.addGetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addGetter(a, b[e])
    };
    Kinetic.Node.addRotationGetters = function (a, b) {
        for (var c = b.length, e = 0; e < c; e++)this._addRotationGetter(a, b[e])
    };
    Kinetic.Node.addGettersSetters = function (a, b) {
        this.addSetters(a, b);
        this.addGetters(a,
            b)
    };
    Kinetic.Node.addPointGettersSetters = function (a, b) {
        this.addPointSetters(a, b);
        this.addGetters(a, b)
    };
    Kinetic.Node.addRotationGettersSetters = function (a, b) {
        this.addRotationSetters(a, b);
        this.addRotationGetters(a, b)
    };
    Kinetic.Node._addSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            this.setAttr(b, a)
        }
    };
    Kinetic.Node._addPointSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function () {
            var a = Kinetic.Type._getXY([].slice.call(arguments));
            a && void 0 === a.x && (a.x = this.attrs[b].x);
            a && void 0 === a.y && (a.y = this.attrs[b].y);
            this.setAttr(b, a)
        }
    };
    Kinetic.Node._addRotationSetter = function (a, b) {
        var c = "set" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            this.setAttr(b, a)
        };
        a.prototype[c + "Deg"] = function (a) {
            this.setAttr(b, Kinetic.Type._degToRad(a))
        }
    };
    Kinetic.Node._addGetter = function (a, b) {
        var c = "get" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function (a) {
            return this.attrs[b]
        }
    };
    Kinetic.Node._addRotationGetter = function (a, b) {
        var c =
            "get" + b.charAt(0).toUpperCase() + b.slice(1);
        a.prototype[c] = function () {
            return this.attrs[b]
        };
        a.prototype[c + "Deg"] = function () {
            return Kinetic.Type._radToDeg(this.attrs[b])
        }
    };
    Kinetic.Node.create = function (a, b) {
        return this._createNode(JSON.parse(a), b)
    };
    Kinetic.Node._createNode = function (a, b) {
        var c;
        c = "Shape" === a.nodeType ? void 0 === a.shapeType ? "Shape" : a.shapeType : a.nodeType;
        b && (a.attrs.container = b);
        c = new Kinetic[c](a.attrs);
        if (a.children)for (var e = a.children.length, g = 0; g < e; g++)c.add(this._createNode(a.children[g]));
        return c
    };
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["x", "y", "opacity"]);
    Kinetic.Node.addGetters(Kinetic.Node, ["name", "id"]);
    Kinetic.Node.addRotationGettersSetters(Kinetic.Node, ["rotation"]);
    Kinetic.Node.addPointGettersSetters(Kinetic.Node, ["scale", "offset"]);
    Kinetic.Node.addSetters(Kinetic.Node, ["width", "height", "listening", "visible"]);
    Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening;
    Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;
    for (var a = ["on", "off"],
             c = 0; 2 > c; c++)(function (c) {
        var b = a[c];
        Kinetic.Collection.prototype[b] = function () {
            var a = [].slice.call(arguments);
            a.unshift(b);
            this.apply.apply(this, a)
        }
    })(c)
})();
(function () {
    Kinetic.Animation = function (a, d) {
        this.func = a;
        this.node = d;
        this.id = Kinetic.Animation.animIdCounter++;
        this.frame = {time: 0, timeDiff: 0, lastTime: (new Date).getTime()}
    };
    Kinetic.Animation.prototype = {isRunning: function () {
        for (var a = Kinetic.Animation.animations, d = 0; d < a.length; d++)if (a[d].id === this.id)return!0;
        return!1
    }, start: function () {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = (new Date).getTime();
        Kinetic.Animation._addAnimation(this)
    }, stop: function () {
        Kinetic.Animation._removeAnimation(this)
    },
        _updateFrameObject: function (a) {
            this.frame.timeDiff = a - this.frame.lastTime;
            this.frame.lastTime = a;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1E3 / this.frame.timeDiff
        }};
    Kinetic.Animation.animations = [];
    Kinetic.Animation.animIdCounter = 0;
    Kinetic.Animation.animRunning = !1;
    Kinetic.Animation.fixedRequestAnimFrame = function (a) {
        window.setTimeout(a, 1E3 / 60)
    };
    Kinetic.Animation._addAnimation = function (a) {
        this.animations.push(a);
        this._handleAnimation()
    };
    Kinetic.Animation._removeAnimation = function (a) {
        a =
            a.id;
        for (var d = this.animations, b = d.length, f = 0; f < b; f++)if (d[f].id === a) {
            this.animations.splice(f, 1);
            break
        }
    };
    Kinetic.Animation._runFrames = function () {
        for (var a = {}, d = this.animations, b = 0; b < d.length; b++) {
            var f = d[b], e = f.node, g = f.func;
            f._updateFrameObject((new Date).getTime());
            e && void 0 !== e._id && (a[e._id] = e);
            g && g(f.frame)
        }
        for (var h in a)a[h].draw()
    };
    Kinetic.Animation._animationLoop = function () {
        var a = this;
        0 < this.animations.length ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function () {
            a._animationLoop()
        })) :
            this.animRunning = !1
    };
    Kinetic.Animation._handleAnimation = function () {
        this.animRunning || (this.animRunning = !0, this._animationLoop())
    };
    RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Kinetic.Animation.fixedRequestAnimFrame;
    Kinetic.Animation.requestAnimFrame = function (a) {
        (Kinetic.DD && Kinetic.DD.moving ? this.fixedRequestAnimFrame : RAF)(a)
    };
    var a = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo =
        function (c) {
            a.call(this, c)
        }
})();
(function () {
    Kinetic.DD = {anim: new Kinetic.Animation, moving: !1, offset: {x: 0, y: 0}};
    Kinetic.getNodeDragging = function () {
        return Kinetic.DD.node
    };
    Kinetic.DD._setupDragLayerAndGetContainer = function (a) {
        var d = a.getStage(), b, f;
        a._eachAncestorReverse(function (a) {
            "Layer" === a.nodeType ? (d.dragLayer.setAttrs(a.getAttrs()), b = d.dragLayer, d.add(d.dragLayer)) : "Group" === a.nodeType && (f = new Kinetic.Group(a.getAttrs()), b.add(f), b = f)
        });
        return b
    };
    Kinetic.DD._initDragLayer = function (a) {
        a.dragLayer = new Kinetic.Layer;
        a.dragLayer.getCanvas().getElement().className =
            "kinetic-drag-and-drop-layer"
    };
    Kinetic.DD._drag = function (a) {
        var d = Kinetic.DD, b = d.node;
        if (b) {
            var f = b.getStage().getUserPosition(), e = b.attrs.dragBoundFunc, f = {x: f.x - d.offset.x, y: f.y - d.offset.y};
            void 0 !== e && (f = e.call(b, f, a));
            b.setAbsolutePosition(f);
            d.moving || (d.moving = !0, b.setListening(!1), b._handleEvent("dragstart", a));
            b._handleEvent("dragmove", a)
        }
    };
    Kinetic.DD._endDrag = function (a) {
        var d = Kinetic.DD, b = d.node;
        if (b) {
            var f = b.nodeType;
            b.getStage();
            b.setListening(!0);
            if ("Stage" === f)b.draw(); else {
                if (("Group" ===
                    f || "Shape" === f) && b.getDragOnTop() && d.prevParent)b.moveTo(d.prevParent), b.getStage().dragLayer.remove(), d.prevParent = null;
                b.getLayer().draw()
            }
            delete d.node;
            d.anim.stop();
            d.moving && (d.moving = !1, b._handleEvent("dragend", a))
        }
    };
    Kinetic.Node.prototype._startDrag = function (a) {
        var d = Kinetic.DD, b = this, f = this.getStage();
        if (a = f.getUserPosition()) {
            this.getTransform().getTranslation();
            var e = this.getAbsolutePosition(), g = this.nodeType, h;
            d.node = this;
            d.offset.x = a.x - e.x;
            d.offset.y = a.y - e.y;
            "Stage" === g || "Layer" === g ? (d.anim.node =
                this, d.anim.start()) : this.getDragOnTop() ? (h = d._setupDragLayerAndGetContainer(this), d.anim.node = f.dragLayer, d.prevParent = this.getParent(), setTimeout(function () {
                d.node && (b.moveTo(h), d.prevParent.getLayer().draw(), f.dragLayer.draw(), d.anim.start())
            }, 0)) : (d.anim.node = this.getLayer(), d.anim.start())
        }
    };
    Kinetic.Node.prototype.setDraggable = function (a) {
        this.setAttr("draggable", a);
        this._dragChange()
    };
    Kinetic.Node.prototype.getDraggable = function () {
        return this.attrs.draggable
    };
    Kinetic.Node.prototype.isDragging =
        function () {
            var a = Kinetic.DD;
            return a.node && a.node._id === this._id && a.moving
        };
    Kinetic.Node.prototype._listenDrag = function () {
        this._dragCleanup();
        var a = this;
        this.on("mousedown.kinetic touchstart.kinetic", function (d) {
            Kinetic.getNodeDragging() || a._startDrag(d)
        })
    };
    Kinetic.Node.prototype._dragChange = function () {
        if (this.attrs.draggable)this._listenDrag(); else {
            this._dragCleanup();
            var a = this.getStage(), d = Kinetic.DD;
            a && (d.node && d.node._id === this._id) && d._endDrag()
        }
    };
    Kinetic.Node.prototype._dragCleanup = function () {
        this.off("mousedown.kinetic");
        this.off("touchstart.kinetic")
    };
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;
    Kinetic.Node.addGettersSetters(Kinetic.Node, ["dragBoundFunc", "dragOnTop"]);
    var a = document.getElementsByTagName("html")[0];
    a.addEventListener("mouseup", Kinetic.DD._endDrag, !0);
    a.addEventListener("touchend", Kinetic.DD._endDrag, !0)
})();
(function () {
    Kinetic.Transition = function (a, c) {
        function d(a, c, f, l) {
            for (var k in a)"duration" !== k && ("easing" !== k && "callback" !== k) && (Kinetic.Type._isObject(a[k]) ? (f[k] = {}, d(a[k], c[k], f[k], l)) : b._add(b._getTween(c, k, a[k], f, l)))
        }

        var b = this, f = {};
        this.node = a;
        this.config = c;
        this.tweens = [];
        d(c, a.attrs, f, f);
        this.tweens[0].onStarted = function () {
        };
        this.tweens[0].onStopped = function () {
            a.transAnim.stop()
        };
        this.tweens[0].onResumed = function () {
            a.transAnim.start()
        };
        this.tweens[0].onLooped = function () {
        };
        this.tweens[0].onChanged =
            function () {
            };
        this.tweens[0].onFinished = function () {
            var b = {}, d;
            for (d in c)"duration" !== d && ("easing" !== d && "callback" !== d) && (b[d] = c[d]);
            a.transAnim.stop();
            a.setAttrs(b);
            c.callback && c.callback()
        }
    };
    Kinetic.Transition.prototype = {start: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].start()
    }, stop: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].stop()
    }, resume: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].resume()
    }, _onEnterFrame: function () {
        for (var a = 0; a < this.tweens.length; a++)this.tweens[a].onEnterFrame()
    },
        _add: function (a) {
            this.tweens.push(a)
        }, _getTween: function (a, c, d, b, f) {
            var e = this.config, g = this.node, h = e.easing;
            void 0 === h && (h = "linear");
            return new Kinetic.Tween(g, function (a) {
                b[c] = a;
                g.setAttrs(f)
            }, Kinetic.Tweens[h], a[c], d, e.duration)
        }};
    Kinetic.Node.prototype.transitionTo = function (a) {
        var c = new Kinetic.Transition(this, a);
        this.transAnim || (this.transAnim = new Kinetic.Animation);
        this.transAnim.func = function () {
            c._onEnterFrame()
        };
        this.transAnim.node = "Stage" === this.nodeType ? this : this.getLayer();
        c.start();
        this.transAnim.start();
        return this.trans = c
    }
})();
(function () {
    Kinetic.Container = function (a) {
        this._containerInit(a)
    };
    Kinetic.Container.prototype = {_containerInit: function (a) {
        this.children = [];
        Kinetic.Node.call(this, a)
    }, getChildren: function () {
        return this.children
    }, removeChildren: function () {
        for (; 0 < this.children.length;)this.children[0].remove()
    }, add: function (a) {
        var c = this.children;
        a.index = c.length;
        a.parent = this;
        c.push(a);
        return this
    }, get: function (a) {
        var c = new Kinetic.Collection;
        if ("#" === a.charAt(0))(a = this._getNodeById(a.slice(1))) && c.push(a); else if ("." ===
            a.charAt(0))a = this._getNodesByName(a.slice(1)), Kinetic.Collection.apply(c, a); else {
            for (var d = [], b = this.getChildren(), f = b.length, e = 0; e < f; e++)d = d.concat(b[e]._get(a));
            Kinetic.Collection.apply(c, d)
        }
        return c
    }, _getNodeById: function (a) {
        this.getStage();
        a = Kinetic.Global.ids[a];
        return void 0 !== a && this.isAncestorOf(a) ? a : null
    }, _getNodesByName: function (a) {
        return this._getDescendants(Kinetic.Global.names[a] || [])
    }, _get: function (a) {
        for (var c = Kinetic.Node.prototype._get.call(this, a), d = this.getChildren(), b = d.length,
                 f = 0; f < b; f++)c = c.concat(d[f]._get(a));
        return c
    }, toObject: function () {
        var a = Kinetic.Node.prototype.toObject.call(this);
        a.children = [];
        for (var c = this.getChildren(), d = c.length, b = 0; b < d; b++)a.children.push(c[b].toObject());
        return a
    }, _getDescendants: function (a) {
        for (var c = [], d = a.length, b = 0; b < d; b++) {
            var f = a[b];
            this.isAncestorOf(f) && c.push(f)
        }
        return c
    }, isAncestorOf: function (a) {
        for (a = a.getParent(); a;) {
            if (a._id === this._id)return!0;
            a = a.getParent()
        }
        return!1
    }, clone: function (a) {
        a = Kinetic.Node.prototype.clone.call(this,
            a);
        for (var c in this.children)a.add(this.children[c].clone());
        return a
    }, getIntersections: function () {
        for (var a = Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), c = [], d = this.get("Shape"), b = d.length, f = 0; f < b; f++) {
            var e = d[f];
            e.isVisible() && e.intersects(a) && c.push(e)
        }
        return c
    }, _setChildrenIndices: function () {
        for (var a = this.children, c = a.length, d = 0; d < c; d++)a[d].index = d
    }, draw: function () {
        this.drawScene();
        this.drawHit()
    }, drawScene: function (a) {
        if (this.isVisible())for (var c = this.children, d = c.length, b =
            0; b < d; b++)c[b].drawScene(a)
    }, drawHit: function () {
        if (this.isVisible() && this.isListening())for (var a = this.children, c = a.length, d = 0; d < c; d++)a[d].drawHit()
    }};
    Kinetic.Global.extend(Kinetic.Container, Kinetic.Node)
})();
(function () {
    function a(a) {
        a.fill()
    }

    function c(a) {
        a.stroke()
    }

    function d(a) {
        a.fill()
    }

    function b(a) {
        a.stroke()
    }

    Kinetic.Shape = function (a) {
        this._initShape(a)
    };
    Kinetic.Shape.prototype = {_initShape: function (f) {
        this.setDefaultAttrs({fillEnabled: !0, strokeEnabled: !0, shadowEnabled: !0, dashArrayEnabled: !0, fillPriority: "color"});
        this.nodeType = "Shape";
        this._fillFunc = a;
        this._strokeFunc = c;
        this._fillFuncHit = d;
        this._strokeFuncHit = b;
        for (var e = Kinetic.Global.shapes, g; !(g = Kinetic.Type._getRandomColorKey()) || g in e;);
        this.colorKey =
            g;
        e[g] = this;
        Kinetic.Node.call(this, f)
    }, getContext: function () {
        return this.getLayer().getContext()
    }, getCanvas: function () {
        return this.getLayer().getCanvas()
    }, hasShadow: function () {
        return!(!this.getShadowColor() && !this.getShadowBlur() && !this.getShadowOffset())
    }, hasFill: function () {
        return!(!this.getFill() && !this.getFillPatternImage() && !this.getFillLinearGradientStartPoint() && !this.getFillRadialGradientStartPoint())
    }, _get: function (a) {
        return this.nodeType === a || this.shapeType === a ? [this] : []
    }, intersects: function () {
        var a =
            Kinetic.Type._getXY(Array.prototype.slice.call(arguments)), b = this.getStage().hitCanvas;
        b.clear();
        this.drawScene(b);
        return 0 < b.context.getImageData(Math.round(a.x), Math.round(a.y), 1, 1).data[3]
    }, enableFill: function () {
        this.setAttr("fillEnabled", !0)
    }, disableFill: function () {
        this.setAttr("fillEnabled", !1)
    }, enableStroke: function () {
        this.setAttr("strokeEnabled", !0)
    }, disableStroke: function () {
        this.setAttr("strokeEnabled", !1)
    }, enableShadow: function () {
        this.setAttr("shadowEnabled", !0)
    }, disableShadow: function () {
        this.setAttr("shadowEnabled",
            !1)
    }, enableDashArray: function () {
        this.setAttr("dashArrayEnabled", !0)
    }, disableDashArray: function () {
        this.setAttr("dashArrayEnabled", !1)
    }, remove: function () {
        Kinetic.Node.prototype.remove.call(this);
        delete Kinetic.Global.shapes[this.colorKey]
    }, drawScene: function (a) {
        var b = this.attrs.drawFunc;
        a = a || this.getLayer().getCanvas();
        var c = a.getContext();
        b && this.isVisible() && (c.save(), a._applyOpacity(this), a._applyLineJoin(this), a._applyAncestorTransforms(this), b.call(this, a), c.restore())
    }, drawHit: function () {
        var a =
            this.attrs, a = a.drawHitFunc || a.drawFunc, b = this.getLayer().hitCanvas, c = b.getContext();
        a && (this.isVisible() && this.isListening()) && (c.save(), b._applyLineJoin(this), b._applyAncestorTransforms(this), a.call(this, b), c.restore())
    }, _setDrawFuncs: function () {
        !this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc);
        !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
    }};
    Kinetic.Global.extend(Kinetic.Shape, Kinetic.Node);
    Kinetic.Node.addGettersSetters(Kinetic.Shape, "stroke lineJoin lineCap strokeWidth drawFunc drawHitFunc dashArray shadowColor shadowBlur shadowOpacity fillPatternImage fill fillPatternX fillPatternY fillLinearGradientColorStops fillRadialGradientStartRadius fillRadialGradientEndRadius fillRadialGradientColorStops fillPatternRepeat fillEnabled strokeEnabled shadowEnabled dashArrayEnabled fillPriority".split(" "));
    Kinetic.Node.addPointGettersSetters(Kinetic.Shape, "fillPatternOffset fillPatternScale fillLinearGradientStartPoint fillLinearGradientEndPoint fillRadialGradientStartPoint fillRadialGradientEndPoint shadowOffset".split(" "));
    Kinetic.Node.addRotationGettersSetters(Kinetic.Shape, ["fillPatternRotation"])
})();
(function () {
    Kinetic.Stage = function (a) {
        this._initStage(a)
    };
    Kinetic.Stage.prototype = {_initStage: function (a) {
        var c = Kinetic.DD;
        this.setDefaultAttrs({width: 400, height: 200});
        Kinetic.Container.call(this, a);
        this._setStageDefaultProperties();
        this._id = Kinetic.Global.idCounter++;
        this._buildDOM();
        this._bindContentEvents();
        Kinetic.Global.stages.push(this);
        c && c._initDragLayer(this)
    }, setContainer: function (a) {
        "string" === typeof a && (a = document.getElementById(a));
        this.setAttr("container", a)
    }, setHeight: function (a) {
        Kinetic.Node.prototype.setHeight.call(this,
            a);
        this._resizeDOM()
    }, setWidth: function (a) {
        Kinetic.Node.prototype.setWidth.call(this, a);
        this._resizeDOM()
    }, clear: function () {
        for (var a = this.children, c = 0; c < a.length; c++)a[c].clear()
    }, remove: function () {
        var a = this.content;
        Kinetic.Node.prototype.remove.call(this);
        a && Kinetic.Type._isInDocument(a) && this.attrs.container.removeChild(a)
    }, reset: function () {
        this.removeChildren();
        this._setStageDefaultProperties();
        this.setAttrs(this.defaultNodeAttrs)
    }, getMousePosition: function () {
        return this.mousePos
    }, getTouchPosition: function () {
        return this.touchPos
    },
        getUserPosition: function () {
            return this.getTouchPosition() || this.getMousePosition()
        }, getStage: function () {
            return this
        }, getContent: function () {
            return this.content
        }, toDataURL: function (a) {
            function c(e) {
                var f = l[e].toDataURL(), p = new Image;
                p.onload = function () {
                    h.drawImage(p, 0, 0);
                    e < l.length - 1 ? c(e + 1) : a.callback(g.toDataURL(d, b))
                };
                p.src = f
            }

            a = a || {};
            var d = a.mimeType || null, b = a.quality || null, f = a.x || 0, e = a.y || 0, g = new Kinetic.SceneCanvas(a.width || this.getWidth(), a.height || this.getHeight()), h = g.getContext(), l = this.children;
            (f || e) && h.translate(-1 * f, -1 * e);
            c(0)
        }, toImage: function (a) {
            var c = a.callback;
            a.callback = function (a) {
                Kinetic.Type._getImage(a, function (a) {
                    c(a)
                })
            };
            this.toDataURL(a)
        }, getIntersection: function (a) {
            for (var c = this.getChildren(), d = c.length - 1; 0 <= d; d--) {
                var b = c[d];
                if (b.isVisible() && b.isListening()) {
                    b = b.hitCanvas.context.getImageData(Math.round(a.x), Math.round(a.y), 1, 1).data;
                    if (255 === b[3])return a = Kinetic.Type._rgbToHex(b[0], b[1], b[2]), a = Kinetic.Global.shapes[a], {shape: a, pixel: b};
                    if (0 < b[0] || 0 < b[1] || 0 < b[2] || 0 < b[3])return{pixel: b}
                }
            }
            return null
        },
        _resizeDOM: function () {
            if (this.content) {
                var a = this.attrs.width, c = this.attrs.height;
                this.content.style.width = a + "px";
                this.content.style.height = c + "px";
                this.bufferCanvas.setSize(a, c, 1);
                this.hitCanvas.setSize(a, c);
                for (var d = this.children, b = 0; b < d.length; b++) {
                    var f = d[b];
                    f.getCanvas().setSize(a, c);
                    f.hitCanvas.setSize(a, c);
                    f.draw()
                }
            }
        }, add: function (a) {
            Kinetic.Container.prototype.add.call(this, a);
            a.canvas.setSize(this.attrs.width, this.attrs.height);
            a.hitCanvas.setSize(this.attrs.width, this.attrs.height);
            a.draw();
            this.content.appendChild(a.canvas.element);
            return this
        }, getDragLayer: function () {
            return this.dragLayer
        }, _setUserPosition: function (a) {
            a || (a = window.event);
            this._setMousePosition(a);
            this._setTouchPosition(a)
        }, _bindContentEvents: function () {
            for (var a = this, c = "mousedown mousemove mouseup mouseout touchstart touchmove touchend".split(" "), d = 0; d < c.length; d++) {
                var b = c[d];
                (function () {
                    var c = b;
                    a.content.addEventListener(c, function (b) {
                        a["_" + c](b)
                    }, !1)
                })()
            }
        }, _mouseout: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD,
                d = this.targetShape;
            if (d && (!c || !c.moving))d._handleEvent("mouseout", a), d._handleEvent("mouseleave", a), this.targetShape = null;
            this.mousePos = void 0
        }, _mousemove: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD, d = this.getIntersection(this.getUserPosition());
            if (d) {
                var b = d.shape;
                b && ((!c || !c.moving) && 255 === d.pixel[3] && (!this.targetShape || this.targetShape._id !== b._id) ? (this.targetShape && (this.targetShape._handleEvent("mouseout", a, b), this.targetShape._handleEvent("mouseleave", a, b)), b._handleEvent("mouseover",
                    a, this.targetShape), b._handleEvent("mouseenter", a, this.targetShape), this.targetShape = b) : b._handleEvent("mousemove", a))
            } else if (this.targetShape && (!c || !c.moving))this.targetShape._handleEvent("mouseout", a), this.targetShape._handleEvent("mouseleave", a), this.targetShape = null;
            c && c._drag(a)
        }, _mousedown: function (a) {
            var c, d = Kinetic.DD;
            this._setUserPosition(a);
            if ((c = this.getIntersection(this.getUserPosition())) && c.shape)c = c.shape, this.clickStart = !0, c._handleEvent("mousedown", a);
            d && (this.attrs.draggable && !d.node) && this._startDrag(a)
        }, _mouseup: function (a) {
            this._setUserPosition(a);
            var c = this, d = Kinetic.DD, b = this.getIntersection(this.getUserPosition());
            if (b && b.shape && (b = b.shape, b._handleEvent("mouseup", a), this.clickStart && (!d || !d.moving || !d.node)))b._handleEvent("click", a), this.inDoubleClickWindow && b._handleEvent("dblclick", a), this.inDoubleClickWindow = !0, setTimeout(function () {
                c.inDoubleClickWindow = !1
            }, this.dblClickWindow);
            this.clickStart = !1
        }, _touchstart: function (a) {
            var c, d = Kinetic.DD;
            this._setUserPosition(a);
            a.preventDefault();
            if ((c = this.getIntersection(this.getUserPosition())) && c.shape)c = c.shape, this.tapStart = !0, c._handleEvent("touchstart", a);
            d && (this.attrs.draggable && !d.node) && this._startDrag(a)
        }, _touchend: function (a) {
            this._setUserPosition(a);
            var c = this, d = Kinetic.DD, b = this.getIntersection(this.getUserPosition());
            if (b && b.shape && (b = b.shape, b._handleEvent("touchend", a), this.tapStart && (!d || !d.moving || !d.node)))b._handleEvent("tap", a), this.inDoubleClickWindow && b._handleEvent("dbltap", a), this.inDoubleClickWindow = !0, setTimeout(function () {
                c.inDoubleClickWindow = !1
            }, this.dblClickWindow);
            this.tapStart = !1
        }, _touchmove: function (a) {
            this._setUserPosition(a);
            var c = Kinetic.DD;
            a.preventDefault();
            var d = this.getIntersection(this.getUserPosition());
            d && d.shape && d.shape._handleEvent("touchmove", a);
            c && c._drag(a)
        }, _setMousePosition: function (a) {
            var c = a.clientX - this._getContentPosition().left;
            a = a.clientY - this._getContentPosition().top;
            this.mousePos = {x: c, y: a}
        }, _setTouchPosition: function (a) {
            if (void 0 !== a.touches && 1 === a.touches.length) {
                var c =
                    a.touches[0];
                a = c.clientX - this._getContentPosition().left;
                c = c.clientY - this._getContentPosition().top;
                this.touchPos = {x: a, y: c}
            }
        }, _getContentPosition: function () {
            var a = this.content.getBoundingClientRect();
            return{top: a.top, left: a.left}
        }, _buildDOM: function () {
            this.content = document.createElement("div");
            this.content.style.position = "relative";
            this.content.style.display = "inline-block";
            this.content.className = "kineticjs-content";
            this.attrs.container.appendChild(this.content);
            this.bufferCanvas = new Kinetic.SceneCanvas;
            this.hitCanvas = new Kinetic.HitCanvas;
            this._resizeDOM()
        }, _onContent: function (a, c) {
            for (var d = a.split(" "), b = 0; b < d.length; b++)this.content.addEventListener(d[b], c, !1)
        }, _setStageDefaultProperties: function () {
            this.nodeType = "Stage";
            this.dblClickWindow = 400;
            this.targetShape = null;
            this.mousePos = void 0;
            this.clickStart = !1;
            this.touchPos = void 0;
            this.tapStart = !1
        }};
    Kinetic.Global.extend(Kinetic.Stage, Kinetic.Container);
    Kinetic.Node.addGetters(Kinetic.Stage, ["container"])
})();
(function () {
    Kinetic.Layer = function (a) {
        this._initLayer(a)
    };
    Kinetic.Layer.prototype = {_initLayer: function (a) {
        this.setDefaultAttrs({clearBeforeDraw: !0});
        this.nodeType = "Layer";
        this.afterDrawFunc = this.beforeDrawFunc = void 0;
        this.canvas = new Kinetic.SceneCanvas;
        this.canvas.getElement().style.position = "absolute";
        this.hitCanvas = new Kinetic.HitCanvas;
        Kinetic.Container.call(this, a)
    }, draw: function () {
        this.getContext();
        void 0 !== this.beforeDrawFunc && this.beforeDrawFunc.call(this);
        Kinetic.Container.prototype.draw.call(this);
        void 0 !== this.afterDrawFunc && this.afterDrawFunc.call(this)
    }, drawHit: function () {
        this.hitCanvas.clear();
        Kinetic.Container.prototype.drawHit.call(this)
    }, drawScene: function (a) {
        a = a || this.getCanvas();
        this.attrs.clearBeforeDraw && a.clear();
        Kinetic.Container.prototype.drawScene.call(this, a)
    }, toDataURL: function (a) {
        a = a || {};
        var c = a.mimeType || null, d = a.quality || null;
        return a.width || a.height || a.x || a.y ? Kinetic.Node.prototype.toDataURL.call(this, a) : this.getCanvas().toDataURL(c, d)
    }, beforeDraw: function (a) {
        this.beforeDrawFunc =
            a
    }, afterDraw: function (a) {
        this.afterDrawFunc = a
    }, getCanvas: function () {
        return this.canvas
    }, getContext: function () {
        return this.canvas.context
    }, clear: function () {
        this.getCanvas().clear()
    }, setVisible: function (a) {
        Kinetic.Node.prototype.setVisible.call(this, a);
        a ? (this.canvas.element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.canvas.element.style.display = "none", this.hitCanvas.element.style.display = "none")
    }, setZIndex: function (a) {
        Kinetic.Node.prototype.setZIndex.call(this, a);
        var c =
            this.getStage();
        c && (c.content.removeChild(this.canvas.element), a < c.getChildren().length - 1 ? c.content.insertBefore(this.canvas.element, c.getChildren()[a + 1].canvas.element) : c.content.appendChild(this.canvas.element))
    }, moveToTop: function () {
        Kinetic.Node.prototype.moveToTop.call(this);
        var a = this.getStage();
        a && (a.content.removeChild(this.canvas.element), a.content.appendChild(this.canvas.element))
    }, moveUp: function () {
        if (Kinetic.Node.prototype.moveUp.call(this)) {
            var a = this.getStage();
            a && (a.content.removeChild(this.canvas.element),
                this.index < a.getChildren().length - 1 ? a.content.insertBefore(this.canvas.element, a.getChildren()[this.index + 1].canvas.element) : a.content.appendChild(this.canvas.element))
        }
    }, moveDown: function () {
        if (Kinetic.Node.prototype.moveDown.call(this)) {
            var a = this.getStage();
            if (a) {
                var c = a.getChildren();
                a.content.removeChild(this.canvas.element);
                a.content.insertBefore(this.canvas.element, c[this.index + 1].canvas.element)
            }
        }
    }, moveToBottom: function () {
        if (Kinetic.Node.prototype.moveToBottom.call(this)) {
            var a = this.getStage();
            if (a) {
                var c = a.getChildren();
                a.content.removeChild(this.canvas.element);
                a.content.insertBefore(this.canvas.element, c[1].canvas.element)
            }
        }
    }, getLayer: function () {
        return this
    }, remove: function () {
        var a = this.getStage(), c = this.canvas, d = c.element;
        Kinetic.Node.prototype.remove.call(this);
        a && (c && Kinetic.Type._isInDocument(d)) && a.content.removeChild(d)
    }};
    Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container);
    Kinetic.Node.addGettersSetters(Kinetic.Layer, ["clearBeforeDraw"])
})();
(function () {
    Kinetic.Group = function (a) {
        this._initGroup(a)
    };
    Kinetic.Group.prototype = {_initGroup: function (a) {
        this.nodeType = "Group";
        Kinetic.Container.call(this, a)
    }};
    Kinetic.Global.extend(Kinetic.Group, Kinetic.Container)
})();
(function () {
    Kinetic.Rect = function (a) {
        this._initRect(a)
    };
    Kinetic.Rect.prototype = {_initRect: function (a) {
        this.setDefaultAttrs({width: 0, height: 0, cornerRadius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Rect";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        var d = this.getCornerRadius(), b = this.getWidth(), f = this.getHeight();
        0 === d ? c.rect(0, 0, b, f) : (c.moveTo(d, 0), c.lineTo(b - d, 0), c.arc(b - d, d, d, 3 * Math.PI / 2, 0, !1), c.lineTo(b, f - d), c.arc(b - d, f - d, d, 0, Math.PI / 2, !1), c.lineTo(d, f), c.arc(d,
            f - d, d, Math.PI / 2, Math.PI, !1), c.lineTo(0, d), c.arc(d, d, d, Math.PI, 3 * Math.PI / 2, !1));
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Rect, ["cornerRadius"])
})();
(function () {
    Kinetic.Circle = function (a) {
        this._initCircle(a)
    };
    Kinetic.Circle.prototype = {_initCircle: function (a) {
        this.setDefaultAttrs({radius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Circle";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        c.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, !0);
        c.closePath();
        a.fillStroke(this)
    }, getWidth: function () {
        return 2 * this.getRadius()
    }, getHeight: function () {
        return 2 * this.getRadius()
    }, setWidth: function (a) {
        Kinetic.Node.prototype.setWidth.call(this,
            a);
        this.setRadius(a / 2)
    }, setHeight: function (a) {
        Kinetic.Node.prototype.setHeight.call(this, a);
        this.setRadius(a / 2)
    }};
    Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Circle, ["radius"])
})();
(function () {
    Kinetic.Wedge = function (a) {
        this._initWedge(a)
    };
    Kinetic.Wedge.prototype = {_initWedge: function (a) {
        this.setDefaultAttrs({radius: 0, angle: 0, clockwise: !1});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Wedge";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext();
        c.beginPath();
        c.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
        c.lineTo(0, 0);
        c.closePath();
        a.fillStroke(this)
    }, setAngleDeg: function (a) {
        this.setAngle(Kinetic.Type._degToRad(a))
    }, getAngleDeg: function () {
        return Kinetic.Type._radToDeg(this.getAngle())
    }};
    Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Wedge, ["radius", "angle", "clockwise"])
})();
(function () {
    Kinetic.Ellipse = function (a) {
        this._initEllipse(a)
    };
    Kinetic.Ellipse.prototype = {_initEllipse: function (a) {
        this.setDefaultAttrs({radius: {x: 0, y: 0}});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Ellipse";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.getRadius();
        c.beginPath();
        c.save();
        d.x !== d.y && c.scale(1, d.y / d.x);
        c.arc(0, 0, d.x, 0, 2 * Math.PI, !0);
        c.restore();
        c.closePath();
        a.fillStroke(this)
    }, getWidth: function () {
        return 2 * this.getRadius().x
    }, getHeight: function () {
        return 2 * this.getRadius().y
    },
        setWidth: function (a) {
            Kinetic.Node.prototype.setWidth.call(this, a);
            this.setRadius({x: a / 2})
        }, setHeight: function (a) {
            Kinetic.Node.prototype.setHeight.call(this, a);
            this.setRadius({y: a / 2})
        }};
    Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);
    Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse, ["radius"])
})();
(function () {
    Kinetic.Image = function (a) {
        this._initImage(a)
    };
    Kinetic.Image.prototype = {_initImage: function (a) {
        Kinetic.Shape.call(this, a);
        this.shapeType = "Image";
        this._setDrawFuncs();
        var c = this;
        this.on("imageChange", function (a) {
            c._syncSize()
        });
        this._syncSize()
    }, drawFunc: function (a) {
        var c = this.getWidth(), d = this.getHeight(), b, f = this, e = a.getContext();
        e.beginPath();
        e.rect(0, 0, c, d);
        e.closePath();
        a.fillStroke(this);
        this.attrs.image && (b = this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height ? [this.attrs.image,
            this.attrs.crop.x || 0, this.attrs.crop.y || 0, this.attrs.crop.width, this.attrs.crop.height, 0, 0, c, d] : [this.attrs.image, 0, 0, c, d], this.hasShadow() ? a.applyShadow(this, function () {
            f._drawImage(e, b)
        }) : this._drawImage(e, b))
    }, drawHitFunc: function (a) {
        var c = this.getWidth(), d = this.getHeight(), b = this.imageHitRegion, f = a.getContext();
        b ? (f.drawImage(b, 0, 0, c, d), f.beginPath(), f.rect(0, 0, c, d), f.closePath(), a.stroke(this)) : (f.beginPath(), f.rect(0, 0, c, d), f.closePath(), a.fillStroke(this))
    }, applyFilter: function (a, c, d) {
        var b =
            new Kinetic.Canvas(this.attrs.image.width, this.attrs.image.height), f = b.getContext();
        f.drawImage(this.attrs.image, 0, 0);
        try {
            var e = f.getImageData(0, 0, b.getWidth(), b.getHeight());
            a(e, c);
            var g = this;
            Kinetic.Type._getImage(e, function (a) {
                g.setImage(a);
                d && d()
            })
        } catch (h) {
            Kinetic.Global.warn("Unable to apply filter. " + h.message)
        }
    }, setCrop: function () {
        var a = [].slice.call(arguments), c = Kinetic.Type._getXY(a), a = Kinetic.Type._getSize(a), c = Kinetic.Type._merge(c, a);
        this.setAttr("crop", Kinetic.Type._merge(c, this.getCrop()))
    },
        createImageHitRegion: function (a) {
            var c = new Kinetic.Canvas(this.attrs.width, this.attrs.height), d = c.getContext();
            d.drawImage(this.attrs.image, 0, 0);
            try {
                for (var b = d.getImageData(0, 0, c.getWidth(), c.getHeight()), f = b.data, e = Kinetic.Type._hexToRgb(this.colorKey), c = 0, g = f.length; c < g; c += 4)f[c] = e.r, f[c + 1] = e.g, f[c + 2] = e.b;
                var h = this;
                Kinetic.Type._getImage(b, function (b) {
                    h.imageHitRegion = b;
                    a && a()
                })
            } catch (l) {
                Kinetic.Global.warn("Unable to create image hit region. " + l.message)
            }
        }, clearImageHitRegion: function () {
            delete this.imageHitRegion
        },
        _syncSize: function () {
            this.attrs.image && (this.attrs.width || this.setWidth(this.attrs.image.width), this.attrs.height || this.setHeight(this.attrs.image.height))
        }, _drawImage: function (a, c) {
            5 === c.length ? a.drawImage(c[0], c[1], c[2], c[3], c[4]) : 9 === c.length && a.drawImage(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8])
        }};
    Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Image, ["image"]);
    Kinetic.Node.addGetters(Kinetic.Image, ["crop"])
})();
(function () {
    Kinetic.Polygon = function (a) {
        this._initPolygon(a)
    };
    Kinetic.Polygon.prototype = {_initPolygon: function (a) {
        this.setDefaultAttrs({points: []});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Polygon";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.getPoints(), b = d.length;
        c.beginPath();
        c.moveTo(d[0].x, d[0].y);
        for (var f = 1; f < b; f++)c.lineTo(d[f].x, d[f].y);
        c.closePath();
        a.fillStroke(this)
    }, setPoints: function (a) {
        this.setAttr("points", Kinetic.Type._getPoints(a))
    }};
    Kinetic.Global.extend(Kinetic.Polygon,
        Kinetic.Shape);
    Kinetic.Node.addGetters(Kinetic.Polygon, ["points"])
})();
(function () {
    function a(a) {
        a.fillText(this.partialText, 0, 0)
    }

    function c(a) {
        a.strokeText(this.partialText, 0, 0)
    }

    var d = "fontFamily fontSize fontStyle padding align lineHeight text width height".split(" "), b = d.length;
    Kinetic.Text = function (a) {
        this._initText(a)
    };
    Kinetic.Text.prototype = {_initText: function (f) {
        this.setDefaultAttrs({fontFamily: "Calibri", text: "", fontSize: 12, align: "left", verticalAlign: "top", fontStyle: "normal", padding: 0, width: "auto", height: "auto", lineHeight: 1});
        this.dummyCanvas = document.createElement("canvas");
        Kinetic.Shape.call(this, f);
        this._fillFunc = a;
        this._strokeFunc = c;
        this.shapeType = "Text";
        this._setDrawFuncs();
        for (f = 0; f < b; f++)this.on(d[f] + "Change.kinetic", this._setTextData);
        this._setTextData()
    }, drawFunc: function (a) {
        var b = a.getContext(), c = this.getPadding(), d = this.getFontStyle(), l = this.getFontSize(), k = this.getFontFamily(), m = this.getTextHeight(), p = this.getLineHeight() * m, q = this.textArr, r = q.length, s = this.getWidth();
        b.font = d + " " + l + "px " + k;
        b.textBaseline = "middle";
        b.textAlign = "left";
        b.save();
        b.translate(c,
            0);
        b.translate(0, c + m / 2);
        for (d = 0; d < r; d++)k = q[d], l = k.text, k = k.width, b.save(), "right" === this.getAlign() ? b.translate(s - k - 2 * c, 0) : "center" === this.getAlign() && b.translate((s - k - 2 * c) / 2, 0), this.partialText = l, a.fillStroke(this), b.restore(), b.translate(0, p);
        b.restore()
    }, drawHitFunc: function (a) {
        var b = a.getContext(), c = this.getWidth(), d = this.getHeight();
        b.beginPath();
        b.rect(0, 0, c, d);
        b.closePath();
        a.fillStroke(this)
    }, setText: function (a) {
        a = Kinetic.Type._isString(a) ? a : a.toString();
        this.setAttr("text", a)
    }, getWidth: function () {
        return"auto" ===
            this.attrs.width ? this.getTextWidth() + 2 * this.getPadding() : this.attrs.width
    }, getHeight: function () {
        return"auto" === this.attrs.height ? this.getTextHeight() * this.textArr.length * this.attrs.lineHeight + 2 * this.attrs.padding : this.attrs.height
    }, getTextWidth: function () {
        return this.textWidth
    }, getTextHeight: function () {
        return this.textHeight
    }, _getTextSize: function (a) {
        var b = this.dummyCanvas.getContext("2d"), c = this.getFontSize();
        b.save();
        b.font = this.getFontStyle() + " " + c + "px " + this.getFontFamily();
        a = b.measureText(a);
        b.restore();
        return{width: a.width, height: parseInt(c, 10)}
    }, _expandTextData: function (a) {
        var b = a.length;
        n = 0;
        text = "";
        newArr = [];
        for (n = 0; n < b; n++)text = a[n], newArr.push({text: text, width: this._getTextSize(text).width});
        return newArr
    }, _setTextData: function () {
        var a = this.getText().split(""), b = [], c = 0;
        addLine = !0;
        lineHeightPx = 0;
        padding = this.getPadding();
        this.textWidth = 0;
        this.textHeight = this._getTextSize(this.getText()).height;
        for (lineHeightPx = this.getLineHeight() * this.textHeight; 0 < a.length && addLine && ("auto" === this.attrs.height ||
            lineHeightPx * (c + 1) < this.attrs.height - 2 * padding);) {
            var d = 0, l = void 0;
            for (addLine = !1; d < a.length;) {
                if (a.indexOf("\n") === d) {
                    a.splice(d, 1);
                    l = a.splice(0, d).join("");
                    break
                }
                var k = a.slice(0, d);
                if ("auto" !== this.attrs.width && this._getTextSize(k.join("")).width > this.attrs.width - 2 * padding) {
                    if (0 == d)break;
                    l = k.lastIndexOf(" ");
                    k = k.lastIndexOf("\n");
                    k = Math.max(l, k);
                    if (0 <= k) {
                        l = a.splice(0, 1 + k).join("");
                        break
                    }
                    l = a.splice(0, d).join("");
                    break
                }
                d++;
                d === a.length && (l = a.splice(0, d).join(""))
            }
            this.textWidth = Math.max(this.textWidth,
                this._getTextSize(l).width);
            void 0 !== l && (b.push(l), addLine = !0);
            c++
        }
        this.textArr = this._expandTextData(b)
    }};
    Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Text, "fontFamily fontSize fontStyle padding align lineHeight".split(" "));
    Kinetic.Node.addGetters(Kinetic.Text, ["text"])
})();
(function () {
    Kinetic.Line = function (a) {
        this._initLine(a)
    };
    Kinetic.Line.prototype = {_initLine: function (a) {
        this.setDefaultAttrs({points: [], lineCap: "butt"});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Line";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = this.getPoints(), d = c.length, b = a.getContext();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        for (var f = 1; f < d; f++) {
            var e = c[f];
            b.lineTo(e.x, e.y)
        }
        a.stroke(this)
    }, setPoints: function (a) {
        this.setAttr("points", Kinetic.Type._getPoints(a))
    }};
    Kinetic.Global.extend(Kinetic.Line,
        Kinetic.Shape);
    Kinetic.Node.addGetters(Kinetic.Line, ["points"])
})();
(function () {
    Kinetic.Spline = function (a) {
        this._initSpline(a)
    };
    Kinetic.Spline._getControlPoints = function (a, c, d, b) {
        var f = a.x;
        a = a.y;
        var e = c.x;
        c = c.y;
        var g = d.x;
        d = d.y;
        var h = Math.sqrt(Math.pow(e - f, 2) + Math.pow(c - a, 2)), l = Math.sqrt(Math.pow(g - e, 2) + Math.pow(d - c, 2)), k = b * h / (h + l);
        b = b * l / (h + l);
        return[
            {x: e - k * (g - f), y: c - k * (d - a)},
            {x: e + b * (g - f), y: c + b * (d - a)}
        ]
    };
    Kinetic.Spline.prototype = {_initSpline: function (a) {
        this.setDefaultAttrs({tension: 1});
        Kinetic.Line.call(this, a);
        this.shapeType = "Spline"
    }, drawFunc: function (a) {
        var c = this.getPoints(),
            d = c.length, b = a.getContext(), f = this.getTension();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        if (0 !== f && 2 < d) {
            var e = this.allPoints, g = e.length;
            b.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y);
            for (f = 2; f < g - 1;)b.bezierCurveTo(e[f].x, e[f++].y, e[f].x, e[f++].y, e[f].x, e[f++].y);
            b.quadraticCurveTo(e[g - 1].x, e[g - 1].y, c[d - 1].x, c[d - 1].y)
        } else for (f = 1; f < d; f++)e = c[f], b.lineTo(e.x, e.y);
        a.stroke(this)
    }, setPoints: function (a) {
        Kinetic.Line.prototype.setPoints.call(this, a);
        this._setAllPoints()
    }, setTension: function (a) {
        this.setAttr("tension",
            a);
        this._setAllPoints()
    }, _setAllPoints: function () {
        for (var a = this.getPoints(), c = a.length, d = this.getTension(), b = [], f = 1; f < c - 1; f++) {
            var e = Kinetic.Spline._getControlPoints(a[f - 1], a[f], a[f + 1], d);
            b.push(e[0]);
            b.push(a[f]);
            b.push(e[1])
        }
        this.allPoints = b
    }};
    Kinetic.Global.extend(Kinetic.Spline, Kinetic.Line);
    Kinetic.Node.addGetters(Kinetic.Spline, ["tension"])
})();
(function () {
    Kinetic.Blob = function (a) {
        this._initBlob(a)
    };
    Kinetic.Blob.prototype = {_initBlob: function (a) {
        Kinetic.Spline.call(this, a);
        this.shapeType = "Blob"
    }, drawFunc: function (a) {
        var c = this.getPoints(), d = c.length, b = a.getContext(), f = this.getTension();
        b.beginPath();
        b.moveTo(c[0].x, c[0].y);
        if (0 !== f && 2 < d) {
            c = this.allPoints;
            d = c.length;
            for (f = 0; f < d - 1;)b.bezierCurveTo(c[f].x, c[f++].y, c[f].x, c[f++].y, c[f].x, c[f++].y)
        } else for (f = 1; f < d; f++) {
            var e = c[f];
            b.lineTo(e.x, e.y)
        }
        b.closePath();
        a.fillStroke(this)
    }, _setAllPoints: function () {
        var a =
            this.getPoints(), c = a.length, d = this.getTension(), b = Kinetic.Spline._getControlPoints(a[c - 1], a[0], a[1], d), d = Kinetic.Spline._getControlPoints(a[c - 2], a[c - 1], a[0], d);
        Kinetic.Spline.prototype._setAllPoints.call(this);
        this.allPoints.unshift(b[1]);
        this.allPoints.push(d[0]);
        this.allPoints.push(a[c - 1]);
        this.allPoints.push(d[1]);
        this.allPoints.push(b[0]);
        this.allPoints.push(a[0])
    }};
    Kinetic.Global.extend(Kinetic.Blob, Kinetic.Spline)
})();
(function () {
    Kinetic.Sprite = function (a) {
        this._initSprite(a)
    };
    Kinetic.Sprite.prototype = {_initSprite: function (a) {
        this.setDefaultAttrs({index: 0, frameRate: 17});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Sprite";
        this._setDrawFuncs();
        this.anim = new Kinetic.Animation;
        var c = this;
        this.on("animationChange", function () {
            c.setIndex(0)
        })
    }, drawFunc: function (a) {
        var c = this.attrs.animations[this.attrs.animation][this.attrs.index];
        a = a.getContext();
        var d = this.attrs.image;
        d && a.drawImage(d, c.x, c.y, c.width, c.height, 0, 0, c.width,
            c.height)
    }, drawHitFunc: function (a) {
        var c = this.attrs.animations[this.attrs.animation][this.attrs.index], d = a.getContext();
        d.beginPath();
        d.rect(0, 0, c.width, c.height);
        d.closePath();
        a.fill(this)
    }, start: function () {
        var a = this, c = this.getLayer();
        this.anim.node = c;
        this.interval = setInterval(function () {
            var c = a.attrs.index;
            a._updateIndex();
            a.afterFrameFunc && c === a.afterFrameIndex && (a.afterFrameFunc(), delete a.afterFrameFunc, delete a.afterFrameIndex)
        }, 1E3 / this.attrs.frameRate);
        this.anim.start()
    }, stop: function () {
        this.anim.stop();
        clearInterval(this.interval)
    }, afterFrame: function (a, c) {
        this.afterFrameIndex = a;
        this.afterFrameFunc = c
    }, _updateIndex: function () {
        this.attrs.index < this.attrs.animations[this.attrs.animation].length - 1 ? this.attrs.index++ : this.attrs.index = 0
    }};
    Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Sprite, ["animation", "animations", "index"])
})();
(function () {
    Kinetic.Star = function (a) {
        this._initStar(a)
    };
    Kinetic.Star.prototype = {_initStar: function (a) {
        this.setDefaultAttrs({numPoints: 0, innerRadius: 0, outerRadius: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "Star";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.attrs.innerRadius, b = this.attrs.outerRadius, f = this.attrs.numPoints;
        c.beginPath();
        c.moveTo(0, 0 - this.attrs.outerRadius);
        for (var e = 1; e < 2 * f; e++) {
            var g = 0 === e % 2 ? b : d, h = g * Math.sin(e * Math.PI / f), g = -1 * g * Math.cos(e * Math.PI / f);
            c.lineTo(h,
                g)
        }
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.Star, ["numPoints", "innerRadius", "outerRadius"])
})();
(function () {
    Kinetic.RegularPolygon = function (a) {
        this._initRegularPolygon(a)
    };
    Kinetic.RegularPolygon.prototype = {_initRegularPolygon: function (a) {
        this.setDefaultAttrs({radius: 0, sides: 0});
        Kinetic.Shape.call(this, a);
        this.shapeType = "RegularPolygon";
        this._setDrawFuncs()
    }, drawFunc: function (a) {
        var c = a.getContext(), d = this.attrs.sides, b = this.attrs.radius;
        c.beginPath();
        c.moveTo(0, 0 - b);
        for (var f = 1; f < d; f++) {
            var e = b * Math.sin(2 * f * Math.PI / d), g = -1 * b * Math.cos(2 * f * Math.PI / d);
            c.lineTo(e, g)
        }
        c.closePath();
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ["radius", "sides"])
})();
(function () {
    Kinetic.Path = function (a) {
        this._initPath(a)
    };
    Kinetic.Path.prototype = {_initPath: function (a) {
        this.dataArray = [];
        var c = this;
        Kinetic.Shape.call(this, a);
        this.shapeType = "Path";
        this._setDrawFuncs();
        this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
        this.on("dataChange", function () {
            c.dataArray = Kinetic.Path.parsePathData(c.attrs.data)
        })
    }, drawFunc: function (a) {
        var c = this.dataArray, d = a.getContext();
        d.beginPath();
        for (var b = 0; b < c.length; b++) {
            var f = c[b].points;
            switch (c[b].command) {
                case "L":
                    d.lineTo(f[0],
                        f[1]);
                    break;
                case "M":
                    d.moveTo(f[0], f[1]);
                    break;
                case "C":
                    d.bezierCurveTo(f[0], f[1], f[2], f[3], f[4], f[5]);
                    break;
                case "Q":
                    d.quadraticCurveTo(f[0], f[1], f[2], f[3]);
                    break;
                case "A":
                    var e = f[0], g = f[1], h = f[2], l = f[3], k = f[4], m = f[5], p = f[6], f = f[7], q = h > l ? h : l, r = h > l ? 1 : h / l, h = h > l ? l / h : 1;
                    d.translate(e, g);
                    d.rotate(p);
                    d.scale(r, h);
                    d.arc(0, 0, q, k, k + m, 1 - f);
                    d.scale(1 / r, 1 / h);
                    d.rotate(-p);
                    d.translate(-e, -g);
                    break;
                case "z":
                    d.closePath()
            }
        }
        a.fillStroke(this)
    }};
    Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
    Kinetic.Path.getLineLength =
        function (a, c, d, b) {
            return Math.sqrt((d - a) * (d - a) + (b - c) * (b - c))
        };
    Kinetic.Path.getPointOnLine = function (a, c, d, b, f, e, g) {
        void 0 === e && (e = c);
        void 0 === g && (g = d);
        var h = (f - d) / (b - c + 1E-8), l = Math.sqrt(a * a / (1 + h * h));
        b < c && (l *= -1);
        var k = h * l;
        if ((g - d) / (e - c + 1E-8) === h)c = {x: e + l, y: g + k}; else {
            k = this.getLineLength(c, d, b, f);
            if (1E-8 > k)return;
            l = ((e - c) * (b - c) + (g - d) * (f - d)) / (k * k);
            k = c + l * (b - c);
            d += l * (f - d);
            e = this.getLineLength(e, g, k, d);
            a = Math.sqrt(a * a - e * e);
            l = Math.sqrt(a * a / (1 + h * h));
            b < c && (l *= -1);
            c = {x: k + l, y: d + h * l}
        }
        return c
    };
    Kinetic.Path.getPointOnCubicBezier =
        function (a, c, d, b, f, e, g, h, l) {
            return{x: h * a * a * a + e * 3 * a * a * (1 - a) + b * 3 * a * (1 - a) * (1 - a) + c * (1 - a) * (1 - a) * (1 - a), y: l * a * a * a + g * 3 * a * a * (1 - a) + f * 3 * a * (1 - a) * (1 - a) + d * (1 - a) * (1 - a) * (1 - a)}
        };
    Kinetic.Path.getPointOnQuadraticBezier = function (a, c, d, b, f, e, g) {
        return{x: e * a * a + b * 2 * a * (1 - a) + c * (1 - a) * (1 - a), y: g * a * a + f * 2 * a * (1 - a) + d * (1 - a) * (1 - a)}
    };
    Kinetic.Path.getPointOnEllipticalArc = function (a, c, d, b, f, e) {
        var g = Math.cos(e);
        e = Math.sin(e);
        d *= Math.cos(f);
        b *= Math.sin(f);
        return{x: a + (d * g - b * e), y: c + (d * e + b * g)}
    };
    Kinetic.Path.parsePathData = function (a) {
        if (!a)return[];
        var c, d = "mMlLvVhHzZcCqQtTsSaA".split("");
        c = a.replace(/ /g, ",");
        for (a = 0; a < d.length; a++)c = c.replace(RegExp(d[a], "g"), "|" + d[a]);
        d = c.split("|");
        c = [];
        var b = 0, f = 0;
        for (a = 1; a < d.length; a++) {
            var e = d[a], g = e.charAt(0), e = e.slice(1), e = e.replace(/,-/g, "-"), e = e.replace(/-/g, ",-"), e = e.replace(/e,-/g, "e-"), e = e.split(",");
            0 < e.length && "" === e[0] && e.shift();
            for (var h = 0; h < e.length; h++)e[h] = parseFloat(e[h]);
            for (; 0 < e.length && !isNaN(e[0]);) {
                var l = null, k = [], h = b, m = f;
                switch (g) {
                    case "l":
                        b += e.shift();
                        f += e.shift();
                        l = "L";
                        k.push(b,
                            f);
                        break;
                    case "L":
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "m":
                        b += e.shift();
                        f += e.shift();
                        l = "M";
                        k.push(b, f);
                        g = "l";
                        break;
                    case "M":
                        b = e.shift();
                        f = e.shift();
                        l = "M";
                        k.push(b, f);
                        g = "L";
                        break;
                    case "h":
                        b += e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "H":
                        b = e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "v":
                        f += e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "V":
                        f = e.shift();
                        l = "L";
                        k.push(b, f);
                        break;
                    case "C":
                        k.push(e.shift(), e.shift(), e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "c":
                        k.push(b + e.shift(), f + e.shift(),
                            b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "S":
                        var p = b, q = f, l = c[c.length - 1];
                        "C" === l.command && (p = b + (b - l.points[2]), q = f + (f - l.points[3]));
                        k.push(p, q, e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "s":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "C" === l.command && (p = b + (b - l.points[2]), q = f + (f - l.points[3]));
                        k.push(p, q, b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "C";
                        k.push(b, f);
                        break;
                    case "Q":
                        k.push(e.shift(), e.shift());
                        b = e.shift();
                        f = e.shift();
                        k.push(b, f);
                        break;
                    case "q":
                        k.push(b + e.shift(), f + e.shift());
                        b += e.shift();
                        f += e.shift();
                        l = "Q";
                        k.push(b, f);
                        break;
                    case "T":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "Q" === l.command && (p = b + (b - l.points[0]), q = f + (f - l.points[1]));
                        b = e.shift();
                        f = e.shift();
                        l = "Q";
                        k.push(p, q, b, f);
                        break;
                    case "t":
                        p = b;
                        q = f;
                        l = c[c.length - 1];
                        "Q" === l.command && (p = b + (b - l.points[0]), q = f + (f - l.points[1]));
                        b += e.shift();
                        f += e.shift();
                        l = "Q";
                        k.push(p, q, b, f);
                        break;
                    case "A":
                        var k = e.shift(), p = e.shift(), q = e.shift(), r = e.shift(), s = e.shift(), u = b, v = f, b = e.shift(), f = e.shift(), l = "A", k = this.convertEndpointToCenterParameterization(u,
                            v, b, f, r, s, k, p, q);
                        break;
                    case "a":
                        k = e.shift(), p = e.shift(), q = e.shift(), r = e.shift(), s = e.shift(), u = b, v = f, b += e.shift(), f += e.shift(), l = "A", k = this.convertEndpointToCenterParameterization(u, v, b, f, r, s, k, p, q)
                }
                c.push({command: l || g, points: k, start: {x: h, y: m}, pathLength: this.calcLength(h, m, l || g, k)})
            }
            ("z" === g || "Z" === g) && c.push({command: "z", points: [], start: void 0, pathLength: 0})
        }
        return c
    };
    Kinetic.Path.calcLength = function (a, c, d, b) {
        var f, e, g = Kinetic.Path;
        switch (d) {
            case "L":
                return g.getLineLength(a, c, b[0], b[1]);
            case "C":
                d =
                    0;
                f = g.getPointOnCubicBezier(0, a, c, b[0], b[1], b[2], b[3], b[4], b[5]);
                for (t = 0.01; 1 >= t; t += 0.01)e = g.getPointOnCubicBezier(t, a, c, b[0], b[1], b[2], b[3], b[4], b[5]), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                return d;
            case "Q":
                d = 0;
                f = g.getPointOnQuadraticBezier(0, a, c, b[0], b[1], b[2], b[3]);
                for (t = 0.01; 1 >= t; t += 0.01)e = g.getPointOnQuadraticBezier(t, a, c, b[0], b[1], b[2], b[3]), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                return d;
            case "A":
                d = 0;
                e = b[4];
                var h = b[5];
                a = b[4] + h;
                c = Math.PI / 180;
                Math.abs(e - a) < c && (c = Math.abs(e - a));
                f = g.getPointOnEllipticalArc(b[0],
                    b[1], b[2], b[3], e, 0);
                if (0 > h)for (t = e - c; t > a; t -= c)e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], t, 0), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e; else for (t = e + c; t < a; t += c)e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], t, 0), d += g.getLineLength(f.x, f.y, e.x, e.y), f = e;
                e = g.getPointOnEllipticalArc(b[0], b[1], b[2], b[3], a, 0);
                return d += g.getLineLength(f.x, f.y, e.x, e.y)
        }
        return 0
    };
    Kinetic.Path.convertEndpointToCenterParameterization = function (a, c, d, b, f, e, g, h, l) {
        l *= Math.PI / 180;
        var k = Math.cos(l) * (a - d) / 2 + Math.sin(l) * (c - b) /
            2, m = -1 * Math.sin(l) * (a - d) / 2 + Math.cos(l) * (c - b) / 2, p = k * k / (g * g) + m * m / (h * h);
        1 < p && (g *= Math.sqrt(p), h *= Math.sqrt(p));
        p = Math.sqrt((g * g * h * h - g * g * m * m - h * h * k * k) / (g * g * m * m + h * h * k * k));
        f == e && (p *= -1);
        isNaN(p) && (p = 0);
        f = p * g * m / h;
        p = p * -h * k / g;
        a = (a + d) / 2 + Math.cos(l) * f - Math.sin(l) * p;
        c = (c + b) / 2 + Math.sin(l) * f + Math.cos(l) * p;
        var q = function (a, b) {
            return(a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]))
        }, r = function (a, b) {
            return(a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(q(a, b))
        };
        b = r([1, 0], [(k - f) / g, (m - p) / h]);
        d = [(k - f) / g, (m - p) / h];
        k = [(-1 * k - f) / g, (-1 * m - p) / h];
        m = r(d, k);
        -1 >= q(d, k) && (m = Math.PI);
        1 <= q(d, k) && (m = 0);
        0 === e && 0 < m && (m -= 2 * Math.PI);
        1 == e && 0 > m && (m += 2 * Math.PI);
        return[a, c, g, h, b, m, l, e]
    };
    Kinetic.Node.addGettersSetters(Kinetic.Path, ["data"])
})();
(function () {
    function a(a) {
        a.fillText(this.partialText, 0, 0)
    }

    function c(a) {
        a.strokeText(this.partialText, 0, 0)
    }

    Kinetic.TextPath = function (a) {
        this._initTextPath(a)
    };
    Kinetic.TextPath.prototype = {_initTextPath: function (d) {
        this.setDefaultAttrs({fontFamily: "Calibri", fontSize: 12, fontStyle: "normal", text: ""});
        this.dummyCanvas = document.createElement("canvas");
        this.dataArray = [];
        var b = this;
        Kinetic.Shape.call(this, d);
        this._fillFunc = a;
        this._strokeFunc = c;
        this.shapeType = "TextPath";
        this._setDrawFuncs();
        this.dataArray =
            Kinetic.Path.parsePathData(this.attrs.data);
        this.on("dataChange", function () {
            b.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
        });
        d = ["text", "textStroke", "textStrokeWidth"];
        for (var f = 0; f < d.length; f++)this.on(d[f] + "Change", b._setTextData);
        b._setTextData()
    }, drawFunc: function (a) {
        var b = a.getContext();
        b.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
        b.textBaseline = "middle";
        b.textAlign = "left";
        b.save();
        for (var c = this.glyphInfo, e = 0; e < c.length; e++) {
            b.save();
            var g = c[e].p0;
            parseFloat(this.attrs.fontSize);
            b.translate(g.x, g.y);
            b.rotate(c[e].rotation);
            this.partialText = c[e].text;
            a.fillStroke(this);
            b.restore()
        }
        b.restore()
    }, getTextWidth: function () {
        return this.textWidth
    }, getTextHeight: function () {
        return this.textHeight
    }, setText: function (a) {
        Kinetic.Text.prototype.setText.call(this, a)
    }, _getTextSize: function (a) {
        var b = this.dummyCanvas.getContext("2d");
        b.save();
        b.font = this.attrs.fontStyle + " " + this.attrs.fontSize + "pt " + this.attrs.fontFamily;
        a = b.measureText(a);
        b.restore();
        return{width: a.width,
            height: parseInt(this.attrs.fontSize, 10)}
    }, _setTextData: function () {
        var a = this._getTextSize(this.attrs.text);
        this.textWidth = a.width;
        this.textHeight = a.height;
        this.glyphInfo = [];
        for (var a = this.attrs.text.split(""), b, c, e, g = -1, h = 0, l = 0; l < a.length; l++) {
            var k = this._getTextSize(a[l]).width, m = 0, p = 0;
            for (c = void 0; 0.01 < Math.abs(k - m) / k && 25 > p;) {
                p++;
                for (var q = m; void 0 === e;) {
                    a:{
                        h = 0;
                        e = this.dataArray;
                        for (var r = g + 1; r < e.length; r++)if (0 < e[r].pathLength) {
                            g = r;
                            e = e[r];
                            break a
                        } else"M" == e[r].command && (b = {x: e[r].points[0], y: e[r].points[1]});
                        e = {}
                    }
                    e && q + e.pathLength < k && (q += e.pathLength, e = void 0)
                }
                if (e === {} || void 0 === b)break;
                q = !1;
                switch (e.command) {
                    case "L":
                        Kinetic.Path.getLineLength(b.x, b.y, e.points[0], e.points[1]) > k ? c = Kinetic.Path.getPointOnLine(k, b.x, b.y, e.points[0], e.points[1], b.x, b.y) : e = void 0;
                        break;
                    case "A":
                        c = e.points[4];
                        var r = e.points[5], s = e.points[4] + r, h = 0 === h ? c + 1E-8 : k > m ? h + Math.PI / 180 * r / Math.abs(r) : h - Math.PI / 360 * r / Math.abs(r);
                        Math.abs(h) > Math.abs(s) && (h = s, q = !0);
                        c = Kinetic.Path.getPointOnEllipticalArc(e.points[0], e.points[1], e.points[2],
                            e.points[3], h, e.points[6]);
                        break;
                    case "C":
                        h = 0 === h ? k > e.pathLength ? 1E-8 : k / e.pathLength : k > m ? h + (k - m) / e.pathLength : h - (m - k) / e.pathLength;
                        1 < h && (h = 1, q = !0);
                        c = Kinetic.Path.getPointOnCubicBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3], e.points[4], e.points[5]);
                        break;
                    case "Q":
                        h = 0 === h ? k / e.pathLength : k > m ? h + (k - m) / e.pathLength : h - (m - k) / e.pathLength, 1 < h && (h = 1, q = !0), c = Kinetic.Path.getPointOnQuadraticBezier(h, e.start.x, e.start.y, e.points[0], e.points[1], e.points[2], e.points[3])
                }
                void 0 !== c &&
                (m = Kinetic.Path.getLineLength(b.x, b.y, c.x, c.y));
                q && (e = void 0)
            }
            if (void 0 === b || void 0 === c)break;
            k = Kinetic.Path.getLineLength(b.x, b.y, c.x, c.y);
            k = Kinetic.Path.getPointOnLine(0 + k / 2, b.x, b.y, c.x, c.y);
            m = Math.atan2(c.y - b.y, c.x - b.x);
            this.glyphInfo.push({transposeX: k.x, transposeY: k.y, text: a[l], rotation: m, p0: b, p1: c});
            b = c
        }
    }};
    Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.TextPath, ["fontFamily", "fontSize", "fontStyle"]);
    Kinetic.Node.addGetters(Kinetic.TextPath, ["text"])
})();
