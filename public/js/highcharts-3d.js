/*
 Highcharts JS v8.0.0 (2019-12-10)

 3D features for Highcharts JS

 License: www.highcharts.com/license
*/
(function (r) {
    "object" === typeof module && module.exports
        ? ((r["default"] = r), (module.exports = r))
        : "function" === typeof define && define.amd
        ? define("highcharts/highcharts-3d", ["highcharts"], function (A) {
              r(A);
              r.Highcharts = A;
              return r;
          })
        : r("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (r) {
    function A(b, l, z, r) {
        b.hasOwnProperty(l) || (b[l] = r.apply(null, z));
    }
    r = r ? r._modules : {};
    A(
        r,
        "parts-3d/Math.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            var z = l.pick,
                r = b.deg2rad;
            b.perspective3D = function (b, l, v) {
                l =
                    0 < v && v < Number.POSITIVE_INFINITY
                        ? v / (b.z + l.z + v)
                        : 1;
                return { x: b.x * l, y: b.y * l };
            };
            b.perspective = function (l, x, v) {
                var h = x.options.chart.options3d,
                    w = v ? x.inverted : !1,
                    q = {
                        x: x.plotWidth / 2,
                        y: x.plotHeight / 2,
                        z: h.depth / 2,
                        vd: z(h.depth, 1) * z(h.viewDistance, 0),
                    },
                    B = x.scale3d || 1,
                    p = r * h.beta * (w ? -1 : 1);
                h = r * h.alpha * (w ? -1 : 1);
                var a = Math.cos(h),
                    d = Math.cos(-p),
                    k = Math.sin(h),
                    g = Math.sin(-p);
                v || ((q.x += x.plotLeft), (q.y += x.plotTop));
                return l.map(function (c) {
                    var e = (w ? c.y : c.x) - q.x;
                    var m = (w ? c.x : c.y) - q.y;
                    c = (c.z || 0) - q.z;
                    e = {
                        x: d * e - g * c,
                        y: -k * g * e + a * m - d * k * c,
                        z: a * g * e + k * m + a * d * c,
                    };
                    m = b.perspective3D(e, q, q.vd);
                    m.x = m.x * B + q.x;
                    m.y = m.y * B + q.y;
                    m.z = e.z * B + q.z;
                    return { x: w ? m.y : m.x, y: w ? m.x : m.y, z: m.z };
                });
            };
            b.pointCameraDistance = function (b, l) {
                var q = l.options.chart.options3d,
                    h = l.plotWidth / 2;
                l = l.plotHeight / 2;
                q = z(q.depth, 1) * z(q.viewDistance, 0) + q.depth;
                return Math.sqrt(
                    Math.pow(h - b.plotX, 2) +
                        Math.pow(l - b.plotY, 2) +
                        Math.pow(q - b.plotZ, 2)
                );
            };
            b.shapeArea = function (b) {
                var l = 0,
                    q;
                for (q = 0; q < b.length; q++) {
                    var h = (q + 1) % b.length;
                    l += b[q].x * b[h].y - b[h].x * b[q].y;
                }
                return l / 2;
            };
            b.shapeArea3d = function (l, x, v) {
                return b.shapeArea(b.perspective(l, x, v));
            };
        }
    );
    A(
        r,
        "parts-3d/SVGRenderer.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            function r(a, c, f, F, C, d, m, b) {
                var n = [],
                    G = d - C;
                return d > C && d - C > Math.PI / 2 + 0.0001
                    ? ((n = n.concat(r(a, c, f, F, C, C + Math.PI / 2, m, b))),
                      (n = n.concat(r(a, c, f, F, C + Math.PI / 2, d, m, b))))
                    : d < C && C - d > Math.PI / 2 + 0.0001
                    ? ((n = n.concat(r(a, c, f, F, C, C - Math.PI / 2, m, b))),
                      (n = n.concat(r(a, c, f, F, C - Math.PI / 2, d, m, b))))
                    : [
                          "C",
                          a + f * Math.cos(C) - f * e * G * Math.sin(C) + m,
                          c + F * Math.sin(C) + F * e * G * Math.cos(C) + b,
                          a + f * Math.cos(d) + f * e * G * Math.sin(d) + m,
                          c + F * Math.sin(d) - F * e * G * Math.cos(d) + b,
                          a + f * Math.cos(d) + m,
                          c + F * Math.sin(d) + b,
                      ];
            }
            var u = l.animObject,
                q = l.defined,
                x = l.extend,
                v = l.objectEach,
                h = l.pick,
                w = Math.cos,
                y = Math.PI,
                B = Math.sin,
                p = b.charts,
                a = b.color,
                d = b.deg2rad,
                k = b.merge,
                g = b.perspective,
                c = b.SVGElement;
            l = b.SVGRenderer;
            var e = (4 * (Math.sqrt(2) - 1)) / 3 / (y / 2);
            l.prototype.toLinePath = function (a, c) {
                var f = [];
                a.forEach(function (a) {
                    f.push("L", a.x, a.y);
                });
                a.length && ((f[0] = "M"), c && f.push("Z"));
                return f;
            };
            l.prototype.toLineSegments = function (a) {
                var c = [],
                    f = !0;
                a.forEach(function (a) {
                    c.push(f ? "M" : "L", a.x, a.y);
                    f = !f;
                });
                return c;
            };
            l.prototype.face3d = function (a) {
                var e = this,
                    f = this.createElement("path");
                f.vertexes = [];
                f.insidePlotArea = !1;
                f.enabled = !0;
                f.attr = function (a) {
                    if (
                        "object" === typeof a &&
                        (q(a.enabled) || q(a.vertexes) || q(a.insidePlotArea))
                    ) {
                        this.enabled = h(a.enabled, this.enabled);
                        this.vertexes = h(a.vertexes, this.vertexes);
                        this.insidePlotArea = h(
                            a.insidePlotArea,
                            this.insidePlotArea
                        );
                        delete a.enabled;
                        delete a.vertexes;
                        delete a.insidePlotArea;
                        var f = g(
                                this.vertexes,
                                p[e.chartIndex],
                                this.insidePlotArea
                            ),
                            n = e.toLinePath(f, !0);
                        f = b.shapeArea(f);
                        f = this.enabled && 0 < f ? "visible" : "hidden";
                        a.d = n;
                        a.visibility = f;
                    }
                    return c.prototype.attr.apply(this, arguments);
                };
                f.animate = function (a) {
                    if (
                        "object" === typeof a &&
                        (q(a.enabled) || q(a.vertexes) || q(a.insidePlotArea))
                    ) {
                        this.enabled = h(a.enabled, this.enabled);
                        this.vertexes = h(a.vertexes, this.vertexes);
                        this.insidePlotArea = h(
                            a.insidePlotArea,
                            this.insidePlotArea
                        );
                        delete a.enabled;
                        delete a.vertexes;
                        delete a.insidePlotArea;
                        var f = g(
                                this.vertexes,
                                p[e.chartIndex],
                                this.insidePlotArea
                            ),
                            n = e.toLinePath(f, !0);
                        f = b.shapeArea(f);
                        f = this.enabled && 0 < f ? "visible" : "hidden";
                        a.d = n;
                        this.attr("visibility", f);
                    }
                    return c.prototype.animate.apply(this, arguments);
                };
                return f.attr(a);
            };
            l.prototype.polyhedron = function (a) {
                var e = this,
                    f = this.g(),
                    n = f.destroy;
                this.styledMode || f.attr({ "stroke-linejoin": "round" });
                f.faces = [];
                f.destroy = function () {
                    for (var a = 0; a < f.faces.length; a++)
                        f.faces[a].destroy();
                    return n.call(this);
                };
                f.attr = function (a, n, d, m) {
                    if ("object" === typeof a && q(a.faces)) {
                        for (; f.faces.length > a.faces.length; )
                            f.faces.pop().destroy();
                        for (; f.faces.length < a.faces.length; )
                            f.faces.push(e.face3d().add(f));
                        for (var b = 0; b < a.faces.length; b++)
                            e.styledMode && delete a.faces[b].fill,
                                f.faces[b].attr(a.faces[b], null, d, m);
                        delete a.faces;
                    }
                    return c.prototype.attr.apply(this, arguments);
                };
                f.animate = function (a, n, d) {
                    if (a && a.faces) {
                        for (; f.faces.length > a.faces.length; )
                            f.faces.pop().destroy();
                        for (; f.faces.length < a.faces.length; )
                            f.faces.push(e.face3d().add(f));
                        for (var m = 0; m < a.faces.length; m++)
                            f.faces[m].animate(a.faces[m], n, d);
                        delete a.faces;
                    }
                    return c.prototype.animate.apply(this, arguments);
                };
                return f.attr(a);
            };
            var m = {
                initArgs: function (a) {
                    var c = this,
                        f = c.renderer,
                        e = f[c.pathType + "Path"](a),
                        n = e.zIndexes;
                    c.parts.forEach(function (a) {
                        c[a] = f
                            .path(e[a])
                            .attr({
                                class: "highcharts-3d-" + a,
                                zIndex: n[a] || 0,
                            })
                            .add(c);
                    });
                    c.attr({ "stroke-linejoin": "round", zIndex: n.group });
                    c.originalDestroy = c.destroy;
                    c.destroy = c.destroyParts;
                },
                singleSetterForParts: function (a, c, f, e, d, m) {
                    var n = {};
                    e = [null, null, e || "attr", d, m];
                    var b = f && f.zIndexes;
                    f
                        ? (v(f, function (c, e) {
                              n[e] = {};
                              n[e][a] = c;
                              b && (n[e].zIndex = f.zIndexes[e] || 0);
                          }),
                          (e[1] = n))
                        : ((n[a] = c), (e[0] = n));
                    return this.processParts.apply(this, e);
                },
                processParts: function (a, c, f, e, d) {
                    var n = this;
                    n.parts.forEach(function (m) {
                        c && (a = h(c[m], !1));
                        if (!1 !== a) n[m][f](a, e, d);
                    });
                    return n;
                },
                destroyParts: function () {
                    this.processParts(null, null, "destroy");
                    return this.originalDestroy();
                },
            };
            var t = b.merge(m, {
                parts: ["front", "top", "side"],
                pathType: "cuboid",
                attr: function (a, e, f, d) {
                    if ("string" === typeof a && "undefined" !== typeof e) {
                        var n = a;
                        a = {};
                        a[n] = e;
                    }
                    return a.shapeArgs || q(a.x)
                        ? this.singleSetterForParts(
                              "d",
                              null,
                              this.renderer[this.pathType + "Path"](
                                  a.shapeArgs || a
                              )
                          )
                        : c.prototype.attr.call(this, a, void 0, f, d);
                },
                animate: function (a, e, f) {
                    q(a.x) && q(a.y)
                        ? ((a = this.renderer[this.pathType + "Path"](a)),
                          this.singleSetterForParts(
                              "d",
                              null,
                              a,
                              "animate",
                              e,
                              f
                          ),
                          this.attr({ zIndex: a.zIndexes.group }))
                        : c.prototype.animate.call(this, a, e, f);
                    return this;
                },
                fillSetter: function (c) {
                    this.singleSetterForParts("fill", null, {
                        front: c,
                        top: a(c).brighten(0.1).get(),
                        side: a(c).brighten(-0.1).get(),
                    });
                    this.color = this.fill = c;
                    return this;
                },
            });
            l.prototype.elements3d = { base: m, cuboid: t };
            l.prototype.element3d = function (a, c) {
                var f = this.g();
                x(f, this.elements3d[a]);
                f.initArgs(c);
                return f;
            };
            l.prototype.cuboid = function (a) {
                return this.element3d("cuboid", a);
            };
            b.SVGRenderer.prototype.cuboidPath = function (a) {
                function c(a) {
                    return q[a];
                }
                var f = a.x,
                    e = a.y,
                    d = a.z,
                    m = a.height,
                    n = a.width,
                    t = a.depth,
                    k = p[this.chartIndex],
                    l = k.options.chart.options3d.alpha,
                    B = 0,
                    q = [
                        { x: f, y: e, z: d },
                        { x: f + n, y: e, z: d },
                        { x: f + n, y: e + m, z: d },
                        { x: f, y: e + m, z: d },
                        { x: f, y: e + m, z: d + t },
                        { x: f + n, y: e + m, z: d + t },
                        { x: f + n, y: e, z: d + t },
                        { x: f, y: e, z: d + t },
                    ];
                q = g(q, k, a.insidePlotArea);
                var h = function (a, f) {
                    var e = [[], -1];
                    a = a.map(c);
                    f = f.map(c);
                    0 > b.shapeArea(a)
                        ? (e = [a, 0])
                        : 0 > b.shapeArea(f) && (e = [f, 1]);
                    return e;
                };
                var w = h([3, 2, 1, 0], [7, 6, 5, 4]);
                a = w[0];
                n = w[1];
                w = h([1, 6, 7, 0], [4, 5, 2, 3]);
                m = w[0];
                t = w[1];
                w = h([1, 2, 5, 6], [0, 7, 4, 3]);
                h = w[0];
                w = w[1];
                1 === w ? (B += 1e4 * (1e3 - f)) : w || (B += 1e4 * f);
                B +=
                    10 *
                    (!t || (0 <= l && 180 >= l) || (360 > l && 357.5 < l)
                        ? k.plotHeight - e
                        : 10 + e);
                1 === n ? (B += 100 * d) : n || (B += 100 * (1e3 - d));
                return {
                    front: this.toLinePath(a, !0),
                    top: this.toLinePath(m, !0),
                    side: this.toLinePath(h, !0),
                    zIndexes: { group: Math.round(B) },
                    isFront: n,
                    isTop: t,
                };
            };
            b.SVGRenderer.prototype.arc3d = function (e) {
                function m(a) {
                    var f = !1,
                        e = {},
                        c;
                    a = k(a);
                    for (c in a)
                        -1 !== t.indexOf(c) &&
                            ((e[c] = a[c]), delete a[c], (f = !0));
                    return f ? e : !1;
                }
                var f = this.g(),
                    n = f.renderer,
                    t = "x y r innerR start end".split(" ");
                e = k(e);
                e.alpha = (e.alpha || 0) * d;
                e.beta = (e.beta || 0) * d;
                f.top = n.path();
                f.side1 = n.path();
                f.side2 = n.path();
                f.inn = n.path();
                f.out = n.path();
                f.onAdd = function () {
                    var a = f.parentGroup,
                        c = f.attr("class");
                    f.top.add(f);
                    ["out", "inn", "side1", "side2"].forEach(function (e) {
                        f[e].attr({ class: c + " highcharts-3d-side" }).add(a);
                    });
                };
                ["addClass", "removeClass"].forEach(function (a) {
                    f[a] = function () {
                        var c = arguments;
                        ["top", "out", "inn", "side1", "side2"].forEach(
                            function (e) {
                                f[e][a].apply(f[e], c);
                            }
                        );
                    };
                });
                f.setPaths = function (a) {
                    var e = f.renderer.arc3dPath(a),
                        c = 100 * e.zTop;
                    f.attribs = a;
                    f.top.attr({ d: e.top, zIndex: e.zTop });
                    f.inn.attr({ d: e.inn, zIndex: e.zInn });
                    f.out.attr({ d: e.out, zIndex: e.zOut });
                    f.side1.attr({ d: e.side1, zIndex: e.zSide1 });
                    f.side2.attr({ d: e.side2, zIndex: e.zSide2 });
                    f.zIndex = c;
                    f.attr({ zIndex: c });
                    a.center &&
                        (f.top.setRadialReference(a.center), delete a.center);
                };
                f.setPaths(e);
                f.fillSetter = function (e) {
                    var c = a(e).brighten(-0.1).get();
                    this.fill = e;
                    this.side1.attr({ fill: c });
                    this.side2.attr({ fill: c });
                    this.inn.attr({ fill: c });
                    this.out.attr({ fill: c });
                    this.top.attr({ fill: e });
                    return this;
                };
                ["opacity", "translateX", "translateY", "visibility"].forEach(
                    function (a) {
                        f[a + "Setter"] = function (a, e) {
                            f[e] = a;
                            ["out", "inn", "side1", "side2", "top"].forEach(
                                function (c) {
                                    f[c].attr(e, a);
                                }
                            );
                        };
                    }
                );
                f.attr = function (a) {
                    var e;
                    "object" === typeof a &&
                        (e = m(a)) &&
                        (x(f.attribs, e), f.setPaths(f.attribs));
                    return c.prototype.attr.apply(f, arguments);
                };
                f.animate = function (a, e, d) {
                    var n = this.attribs,
                        t =
                            "data-" +
                            Math.random().toString(26).substring(2, 9);
                    delete a.center;
                    delete a.z;
                    delete a.depth;
                    delete a.alpha;
                    delete a.beta;
                    var p = u(h(e, this.renderer.globalAnimation));
                    if (p.duration) {
                        var g = m(a);
                        f[t] = 0;
                        a[t] = 1;
                        f[t + "Setter"] = b.noop;
                        g &&
                            (p.step = function (a, e) {
                                function c(a) {
                                    return (
                                        n[a] + (h(g[a], n[a]) - n[a]) * e.pos
                                    );
                                }
                                e.prop === t &&
                                    e.elem.setPaths(
                                        k(n, {
                                            x: c("x"),
                                            y: c("y"),
                                            r: c("r"),
                                            innerR: c("innerR"),
                                            start: c("start"),
                                            end: c("end"),
                                        })
                                    );
                            });
                        e = p;
                    }
                    return c.prototype.animate.call(this, a, e, d);
                };
                f.destroy = function () {
                    this.top.destroy();
                    this.out.destroy();
                    this.inn.destroy();
                    this.side1.destroy();
                    this.side2.destroy();
                    return c.prototype.destroy.call(this);
                };
                f.hide = function () {
                    this.top.hide();
                    this.out.hide();
                    this.inn.hide();
                    this.side1.hide();
                    this.side2.hide();
                };
                f.show = function (a) {
                    this.top.show(a);
                    this.out.show(a);
                    this.inn.show(a);
                    this.side1.show(a);
                    this.side2.show(a);
                };
                return f;
            };
            l.prototype.arc3dPath = function (a) {
                function e(a) {
                    a %= 2 * Math.PI;
                    a > Math.PI && (a = 2 * Math.PI - a);
                    return a;
                }
                var c = a.x,
                    d = a.y,
                    m = a.start,
                    b = a.end - 0.00001,
                    n = a.r,
                    t = a.innerR || 0,
                    p = a.depth || 0,
                    g = a.alpha,
                    k = a.beta,
                    l = Math.cos(m),
                    q = Math.sin(m);
                a = Math.cos(b);
                var h = Math.sin(b),
                    v = n * Math.cos(k);
                n *= Math.cos(g);
                var x = t * Math.cos(k),
                    u = t * Math.cos(g);
                t = p * Math.sin(k);
                var z = p * Math.sin(g);
                p = ["M", c + v * l, d + n * q];
                p = p.concat(r(c, d, v, n, m, b, 0, 0));
                p = p.concat(["L", c + x * a, d + u * h]);
                p = p.concat(r(c, d, x, u, b, m, 0, 0));
                p = p.concat(["Z"]);
                var A = 0 < k ? Math.PI / 2 : 0;
                k = 0 < g ? 0 : Math.PI / 2;
                A = m > -A ? m : b > -A ? -A : m;
                var D = b < y - k ? b : m < y - k ? y - k : b,
                    E = 2 * y - k;
                g = ["M", c + v * w(A), d + n * B(A)];
                g = g.concat(r(c, d, v, n, A, D, 0, 0));
                b > E && m < E
                    ? ((g = g.concat([
                          "L",
                          c + v * w(D) + t,
                          d + n * B(D) + z,
                      ])),
                      (g = g.concat(r(c, d, v, n, D, E, t, z))),
                      (g = g.concat(["L", c + v * w(E), d + n * B(E)])),
                      (g = g.concat(r(c, d, v, n, E, b, 0, 0))),
                      (g = g.concat(["L", c + v * w(b) + t, d + n * B(b) + z])),
                      (g = g.concat(r(c, d, v, n, b, E, t, z))),
                      (g = g.concat(["L", c + v * w(E), d + n * B(E)])),
                      (g = g.concat(r(c, d, v, n, E, D, 0, 0))))
                    : b > y - k &&
                      m < y - k &&
                      ((g = g.concat([
                          "L",
                          c + v * Math.cos(D) + t,
                          d + n * Math.sin(D) + z,
                      ])),
                      (g = g.concat(r(c, d, v, n, D, b, t, z))),
                      (g = g.concat([
                          "L",
                          c + v * Math.cos(b),
                          d + n * Math.sin(b),
                      ])),
                      (g = g.concat(r(c, d, v, n, b, D, 0, 0))));
                g = g.concat([
                    "L",
                    c + v * Math.cos(D) + t,
                    d + n * Math.sin(D) + z,
                ]);
                g = g.concat(r(c, d, v, n, D, A, t, z));
                g = g.concat(["Z"]);
                k = ["M", c + x * l, d + u * q];
                k = k.concat(r(c, d, x, u, m, b, 0, 0));
                k = k.concat([
                    "L",
                    c + x * Math.cos(b) + t,
                    d + u * Math.sin(b) + z,
                ]);
                k = k.concat(r(c, d, x, u, b, m, t, z));
                k = k.concat(["Z"]);
                l = [
                    "M",
                    c + v * l,
                    d + n * q,
                    "L",
                    c + v * l + t,
                    d + n * q + z,
                    "L",
                    c + x * l + t,
                    d + u * q + z,
                    "L",
                    c + x * l,
                    d + u * q,
                    "Z",
                ];
                c = [
                    "M",
                    c + v * a,
                    d + n * h,
                    "L",
                    c + v * a + t,
                    d + n * h + z,
                    "L",
                    c + x * a + t,
                    d + u * h + z,
                    "L",
                    c + x * a,
                    d + u * h,
                    "Z",
                ];
                h = Math.atan2(z, -t);
                d = Math.abs(b + h);
                a = Math.abs(m + h);
                m = Math.abs((m + b) / 2 + h);
                d = e(d);
                a = e(a);
                m = e(m);
                m *= 1e5;
                b = 1e5 * a;
                d *= 1e5;
                return {
                    top: p,
                    zTop: 1e5 * Math.PI + 1,
                    out: g,
                    zOut: Math.max(m, b, d),
                    inn: k,
                    zInn: Math.max(m, b, d),
                    side1: l,
                    zSide1: 0.99 * d,
                    side2: c,
                    zSide2: 0.99 * b,
                };
            };
        }
    );
    A(
        r,
        "parts-3d/Chart.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            function r(b, p) {
                var a = b.plotLeft,
                    d = b.plotWidth + a,
                    k = b.plotTop,
                    g = b.plotHeight + k,
                    c = a + b.plotWidth / 2,
                    e = k + b.plotHeight / 2,
                    m = Number.MAX_VALUE,
                    t = -Number.MAX_VALUE,
                    n = Number.MAX_VALUE,
                    l = -Number.MAX_VALUE,
                    f = 1;
                var h = [
                    { x: a, y: k, z: 0 },
                    { x: a, y: k, z: p },
                ];
                [0, 1].forEach(function (a) {
                    h.push({ x: d, y: h[a].y, z: h[a].z });
                });
                [0, 1, 2, 3].forEach(function (a) {
                    h.push({ x: h[a].x, y: g, z: h[a].z });
                });
                h = w(h, b, !1);
                h.forEach(function (a) {
                    m = Math.min(m, a.x);
                    t = Math.max(t, a.x);
                    n = Math.min(n, a.y);
                    l = Math.max(l, a.y);
                });
                a > m &&
                    (f = Math.min(f, 1 - (Math.abs((a + c) / (m + c)) % 1)));
                d < t && (f = Math.min(f, (d - c) / (t - c)));
                k > n &&
                    (f =
                        0 > n
                            ? Math.min(f, (k + e) / (-n + k + e))
                            : Math.min(f, 1 - (((k + e) / (n + e)) % 1)));
                g < l && (f = Math.min(f, Math.abs((g - e) / (l - e))));
                return f;
            }
            var u = l.isArray,
                q = l.pick;
            l = l.wrap;
            var x = b.addEvent,
                v = b.Chart,
                h = b.merge,
                w = b.perspective;
            v.prototype.is3d = function () {
                return (
                    this.options.chart.options3d &&
                    this.options.chart.options3d.enabled
                );
            };
            v.prototype.propsRequireDirtyBox.push("chart.options3d");
            v.prototype.propsRequireUpdateSeries.push("chart.options3d");
            x(v, "afterInit", function () {
                var b = this.options;
                this.is3d() &&
                    (b.series || []).forEach(function (p) {
                        "scatter" ===
                            (p.type ||
                                b.chart.type ||
                                b.chart.defaultSeriesType) &&
                            (p.type = "scatter3d");
                    });
            });
            x(v, "addSeries", function (b) {
                this.is3d() &&
                    "scatter" === b.options.type &&
                    (b.options.type = "scatter3d");
            });
            l(b.Chart.prototype, "isInsidePlot", function (b) {
                return (
                    this.is3d() || b.apply(this, [].slice.call(arguments, 1))
                );
            });
            var y = b.getOptions();
            h(!0, y, {
                chart: {
                    options3d: {
                        enabled: !1,
                        alpha: 0,
                        beta: 0,
                        depth: 100,
                        fitToPlot: !0,
                        viewDistance: 25,
                        axisLabelPosition: null,
                        frame: {
                            visible: "default",
                            size: 1,
                            bottom: {},
                            top: {},
                            left: {},
                            right: {},
                            back: {},
                            front: {},
                        },
                    },
                },
            });
            x(v, "afterGetContainer", function () {
                this.styledMode &&
                    (this.renderer.definition({
                        tagName: "style",
                        textContent:
                            ".highcharts-3d-top{filter: url(#highcharts-brighter)}\n.highcharts-3d-side{filter: url(#highcharts-darker)}\n",
                    }),
                    [
                        { name: "darker", slope: 0.6 },
                        { name: "brighter", slope: 1.4 },
                    ].forEach(function (b) {
                        this.renderer.definition({
                            tagName: "filter",
                            id: "highcharts-" + b.name,
                            children: [
                                {
                                    tagName: "feComponentTransfer",
                                    children: [
                                        {
                                            tagName: "feFuncR",
                                            type: "linear",
                                            slope: b.slope,
                                        },
                                        {
                                            tagName: "feFuncG",
                                            type: "linear",
                                            slope: b.slope,
                                        },
                                        {
                                            tagName: "feFuncB",
                                            type: "linear",
                                            slope: b.slope,
                                        },
                                    ],
                                },
                            ],
                        });
                    }, this));
            });
            l(v.prototype, "setClassName", function (b) {
                b.apply(this, [].slice.call(arguments, 1));
                this.is3d() &&
                    (this.container.className += " highcharts-3d-chart");
            });
            x(b.Chart, "afterSetChartSize", function () {
                var b = this.options.chart.options3d;
                if (this.is3d()) {
                    var p = this.inverted,
                        a = this.clipBox,
                        d = this.margin;
                    a[p ? "y" : "x"] = -(d[3] || 0);
                    a[p ? "x" : "y"] = -(d[0] || 0);
                    a[p ? "height" : "width"] =
                        this.chartWidth + (d[3] || 0) + (d[1] || 0);
                    a[p ? "width" : "height"] =
                        this.chartHeight + (d[0] || 0) + (d[2] || 0);
                    this.scale3d = 1;
                    !0 === b.fitToPlot && (this.scale3d = r(this, b.depth));
                    this.frame3d = this.get3dFrame();
                }
            });
            x(v, "beforeRedraw", function () {
                this.is3d() && (this.isDirtyBox = !0);
            });
            x(v, "beforeRender", function () {
                this.is3d() && (this.frame3d = this.get3dFrame());
            });
            l(v.prototype, "renderSeries", function (b) {
                var p = this.series.length;
                if (this.is3d())
                    for (; p--; )
                        (b = this.series[p]), b.translate(), b.render();
                else b.call(this);
            });
            x(v, "afterDrawChartBox", function () {
                if (this.is3d()) {
                    var l = this.renderer,
                        p = this.options.chart.options3d,
                        a = this.get3dFrame(),
                        d = this.plotLeft,
                        k = this.plotLeft + this.plotWidth,
                        g = this.plotTop,
                        c = this.plotTop + this.plotHeight;
                    p = p.depth;
                    var e = d - (a.left.visible ? a.left.size : 0),
                        m = k + (a.right.visible ? a.right.size : 0),
                        t = g - (a.top.visible ? a.top.size : 0),
                        n = c + (a.bottom.visible ? a.bottom.size : 0),
                        h = 0 - (a.front.visible ? a.front.size : 0),
                        f = p + (a.back.visible ? a.back.size : 0),
                        q = this.hasRendered ? "animate" : "attr";
                    this.frame3d = a;
                    this.frameShapes ||
                        (this.frameShapes = {
                            bottom: l.polyhedron().add(),
                            top: l.polyhedron().add(),
                            left: l.polyhedron().add(),
                            right: l.polyhedron().add(),
                            back: l.polyhedron().add(),
                            front: l.polyhedron().add(),
                        });
                    this.frameShapes.bottom[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-bottom",
                        zIndex: a.bottom.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b
                                    .color(a.bottom.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: n, z: h },
                                    { x: m, y: n, z: h },
                                    { x: m, y: n, z: f },
                                    { x: e, y: n, z: f },
                                ],
                                enabled: a.bottom.visible,
                            },
                            {
                                fill: b
                                    .color(a.bottom.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: d, y: c, z: p },
                                    { x: k, y: c, z: p },
                                    { x: k, y: c, z: 0 },
                                    { x: d, y: c, z: 0 },
                                ],
                                enabled: a.bottom.visible,
                            },
                            {
                                fill: b
                                    .color(a.bottom.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: n, z: h },
                                    { x: e, y: n, z: f },
                                    { x: d, y: c, z: p },
                                    { x: d, y: c, z: 0 },
                                ],
                                enabled: a.bottom.visible && !a.left.visible,
                            },
                            {
                                fill: b
                                    .color(a.bottom.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: n, z: f },
                                    { x: m, y: n, z: h },
                                    { x: k, y: c, z: 0 },
                                    { x: k, y: c, z: p },
                                ],
                                enabled: a.bottom.visible && !a.right.visible,
                            },
                            {
                                fill: b.color(a.bottom.color).get(),
                                vertexes: [
                                    { x: m, y: n, z: h },
                                    { x: e, y: n, z: h },
                                    { x: d, y: c, z: 0 },
                                    { x: k, y: c, z: 0 },
                                ],
                                enabled: a.bottom.visible && !a.front.visible,
                            },
                            {
                                fill: b.color(a.bottom.color).get(),
                                vertexes: [
                                    { x: e, y: n, z: f },
                                    { x: m, y: n, z: f },
                                    { x: k, y: c, z: p },
                                    { x: d, y: c, z: p },
                                ],
                                enabled: a.bottom.visible && !a.back.visible,
                            },
                        ],
                    });
                    this.frameShapes.top[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-top",
                        zIndex: a.top.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b.color(a.top.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: e, y: t, z: f },
                                    { x: m, y: t, z: f },
                                    { x: m, y: t, z: h },
                                    { x: e, y: t, z: h },
                                ],
                                enabled: a.top.visible,
                            },
                            {
                                fill: b.color(a.top.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: d, y: g, z: 0 },
                                    { x: k, y: g, z: 0 },
                                    { x: k, y: g, z: p },
                                    { x: d, y: g, z: p },
                                ],
                                enabled: a.top.visible,
                            },
                            {
                                fill: b.color(a.top.color).brighten(-0.1).get(),
                                vertexes: [
                                    { x: e, y: t, z: f },
                                    { x: e, y: t, z: h },
                                    { x: d, y: g, z: 0 },
                                    { x: d, y: g, z: p },
                                ],
                                enabled: a.top.visible && !a.left.visible,
                            },
                            {
                                fill: b.color(a.top.color).brighten(-0.1).get(),
                                vertexes: [
                                    { x: m, y: t, z: h },
                                    { x: m, y: t, z: f },
                                    { x: k, y: g, z: p },
                                    { x: k, y: g, z: 0 },
                                ],
                                enabled: a.top.visible && !a.right.visible,
                            },
                            {
                                fill: b.color(a.top.color).get(),
                                vertexes: [
                                    { x: e, y: t, z: h },
                                    { x: m, y: t, z: h },
                                    { x: k, y: g, z: 0 },
                                    { x: d, y: g, z: 0 },
                                ],
                                enabled: a.top.visible && !a.front.visible,
                            },
                            {
                                fill: b.color(a.top.color).get(),
                                vertexes: [
                                    { x: m, y: t, z: f },
                                    { x: e, y: t, z: f },
                                    { x: d, y: g, z: p },
                                    { x: k, y: g, z: p },
                                ],
                                enabled: a.top.visible && !a.back.visible,
                            },
                        ],
                    });
                    this.frameShapes.left[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-left",
                        zIndex: a.left.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b.color(a.left.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: e, y: n, z: h },
                                    { x: d, y: c, z: 0 },
                                    { x: d, y: c, z: p },
                                    { x: e, y: n, z: f },
                                ],
                                enabled: a.left.visible && !a.bottom.visible,
                            },
                            {
                                fill: b.color(a.left.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: e, y: t, z: f },
                                    { x: d, y: g, z: p },
                                    { x: d, y: g, z: 0 },
                                    { x: e, y: t, z: h },
                                ],
                                enabled: a.left.visible && !a.top.visible,
                            },
                            {
                                fill: b
                                    .color(a.left.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: n, z: f },
                                    { x: e, y: t, z: f },
                                    { x: e, y: t, z: h },
                                    { x: e, y: n, z: h },
                                ],
                                enabled: a.left.visible,
                            },
                            {
                                fill: b
                                    .color(a.left.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: d, y: g, z: p },
                                    { x: d, y: c, z: p },
                                    { x: d, y: c, z: 0 },
                                    { x: d, y: g, z: 0 },
                                ],
                                enabled: a.left.visible,
                            },
                            {
                                fill: b.color(a.left.color).get(),
                                vertexes: [
                                    { x: e, y: n, z: h },
                                    { x: e, y: t, z: h },
                                    { x: d, y: g, z: 0 },
                                    { x: d, y: c, z: 0 },
                                ],
                                enabled: a.left.visible && !a.front.visible,
                            },
                            {
                                fill: b.color(a.left.color).get(),
                                vertexes: [
                                    { x: e, y: t, z: f },
                                    { x: e, y: n, z: f },
                                    { x: d, y: c, z: p },
                                    { x: d, y: g, z: p },
                                ],
                                enabled: a.left.visible && !a.back.visible,
                            },
                        ],
                    });
                    this.frameShapes.right[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-right",
                        zIndex: a.right.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b
                                    .color(a.right.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: n, z: f },
                                    { x: k, y: c, z: p },
                                    { x: k, y: c, z: 0 },
                                    { x: m, y: n, z: h },
                                ],
                                enabled: a.right.visible && !a.bottom.visible,
                            },
                            {
                                fill: b
                                    .color(a.right.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: t, z: h },
                                    { x: k, y: g, z: 0 },
                                    { x: k, y: g, z: p },
                                    { x: m, y: t, z: f },
                                ],
                                enabled: a.right.visible && !a.top.visible,
                            },
                            {
                                fill: b
                                    .color(a.right.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: k, y: g, z: 0 },
                                    { x: k, y: c, z: 0 },
                                    { x: k, y: c, z: p },
                                    { x: k, y: g, z: p },
                                ],
                                enabled: a.right.visible,
                            },
                            {
                                fill: b
                                    .color(a.right.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: n, z: h },
                                    { x: m, y: t, z: h },
                                    { x: m, y: t, z: f },
                                    { x: m, y: n, z: f },
                                ],
                                enabled: a.right.visible,
                            },
                            {
                                fill: b.color(a.right.color).get(),
                                vertexes: [
                                    { x: m, y: t, z: h },
                                    { x: m, y: n, z: h },
                                    { x: k, y: c, z: 0 },
                                    { x: k, y: g, z: 0 },
                                ],
                                enabled: a.right.visible && !a.front.visible,
                            },
                            {
                                fill: b.color(a.right.color).get(),
                                vertexes: [
                                    { x: m, y: n, z: f },
                                    { x: m, y: t, z: f },
                                    { x: k, y: g, z: p },
                                    { x: k, y: c, z: p },
                                ],
                                enabled: a.right.visible && !a.back.visible,
                            },
                        ],
                    });
                    this.frameShapes.back[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-back",
                        zIndex: a.back.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b.color(a.back.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: m, y: n, z: f },
                                    { x: e, y: n, z: f },
                                    { x: d, y: c, z: p },
                                    { x: k, y: c, z: p },
                                ],
                                enabled: a.back.visible && !a.bottom.visible,
                            },
                            {
                                fill: b.color(a.back.color).brighten(0.1).get(),
                                vertexes: [
                                    { x: e, y: t, z: f },
                                    { x: m, y: t, z: f },
                                    { x: k, y: g, z: p },
                                    { x: d, y: g, z: p },
                                ],
                                enabled: a.back.visible && !a.top.visible,
                            },
                            {
                                fill: b
                                    .color(a.back.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: n, z: f },
                                    { x: e, y: t, z: f },
                                    { x: d, y: g, z: p },
                                    { x: d, y: c, z: p },
                                ],
                                enabled: a.back.visible && !a.left.visible,
                            },
                            {
                                fill: b
                                    .color(a.back.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: t, z: f },
                                    { x: m, y: n, z: f },
                                    { x: k, y: c, z: p },
                                    { x: k, y: g, z: p },
                                ],
                                enabled: a.back.visible && !a.right.visible,
                            },
                            {
                                fill: b.color(a.back.color).get(),
                                vertexes: [
                                    { x: d, y: g, z: p },
                                    { x: k, y: g, z: p },
                                    { x: k, y: c, z: p },
                                    { x: d, y: c, z: p },
                                ],
                                enabled: a.back.visible,
                            },
                            {
                                fill: b.color(a.back.color).get(),
                                vertexes: [
                                    { x: e, y: n, z: f },
                                    { x: m, y: n, z: f },
                                    { x: m, y: t, z: f },
                                    { x: e, y: t, z: f },
                                ],
                                enabled: a.back.visible,
                            },
                        ],
                    });
                    this.frameShapes.front[q]({
                        class: "highcharts-3d-frame highcharts-3d-frame-front",
                        zIndex: a.front.frontFacing ? -1e3 : 1e3,
                        faces: [
                            {
                                fill: b
                                    .color(a.front.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: n, z: h },
                                    { x: m, y: n, z: h },
                                    { x: k, y: c, z: 0 },
                                    { x: d, y: c, z: 0 },
                                ],
                                enabled: a.front.visible && !a.bottom.visible,
                            },
                            {
                                fill: b
                                    .color(a.front.color)
                                    .brighten(0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: t, z: h },
                                    { x: e, y: t, z: h },
                                    { x: d, y: g, z: 0 },
                                    { x: k, y: g, z: 0 },
                                ],
                                enabled: a.front.visible && !a.top.visible,
                            },
                            {
                                fill: b
                                    .color(a.front.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: e, y: t, z: h },
                                    { x: e, y: n, z: h },
                                    { x: d, y: c, z: 0 },
                                    { x: d, y: g, z: 0 },
                                ],
                                enabled: a.front.visible && !a.left.visible,
                            },
                            {
                                fill: b
                                    .color(a.front.color)
                                    .brighten(-0.1)
                                    .get(),
                                vertexes: [
                                    { x: m, y: n, z: h },
                                    { x: m, y: t, z: h },
                                    { x: k, y: g, z: 0 },
                                    { x: k, y: c, z: 0 },
                                ],
                                enabled: a.front.visible && !a.right.visible,
                            },
                            {
                                fill: b.color(a.front.color).get(),
                                vertexes: [
                                    { x: k, y: g, z: 0 },
                                    { x: d, y: g, z: 0 },
                                    { x: d, y: c, z: 0 },
                                    { x: k, y: c, z: 0 },
                                ],
                                enabled: a.front.visible,
                            },
                            {
                                fill: b.color(a.front.color).get(),
                                vertexes: [
                                    { x: m, y: n, z: h },
                                    { x: e, y: n, z: h },
                                    { x: e, y: t, z: h },
                                    { x: m, y: t, z: h },
                                ],
                                enabled: a.front.visible,
                            },
                        ],
                    });
                }
            });
            v.prototype.retrieveStacks = function (b) {
                var p = this.series,
                    a = {},
                    d,
                    k = 1;
                this.series.forEach(function (g) {
                    d = q(g.options.stack, b ? 0 : p.length - 1 - g.index);
                    a[d]
                        ? a[d].series.push(g)
                        : ((a[d] = { series: [g], position: k }), k++);
                });
                a.totalStacks = k + 1;
                return a;
            };
            v.prototype.get3dFrame = function () {
                var h = this,
                    p = h.options.chart.options3d,
                    a = p.frame,
                    d = h.plotLeft,
                    k = h.plotLeft + h.plotWidth,
                    g = h.plotTop,
                    c = h.plotTop + h.plotHeight,
                    e = p.depth,
                    m = function (a) {
                        a = b.shapeArea3d(a, h);
                        return 0.5 < a ? 1 : -0.5 > a ? -1 : 0;
                    },
                    t = m([
                        { x: d, y: c, z: e },
                        { x: k, y: c, z: e },
                        { x: k, y: c, z: 0 },
                        { x: d, y: c, z: 0 },
                    ]),
                    n = m([
                        { x: d, y: g, z: 0 },
                        { x: k, y: g, z: 0 },
                        { x: k, y: g, z: e },
                        { x: d, y: g, z: e },
                    ]),
                    l = m([
                        { x: d, y: g, z: 0 },
                        { x: d, y: g, z: e },
                        { x: d, y: c, z: e },
                        { x: d, y: c, z: 0 },
                    ]),
                    f = m([
                        { x: k, y: g, z: e },
                        { x: k, y: g, z: 0 },
                        { x: k, y: c, z: 0 },
                        { x: k, y: c, z: e },
                    ]),
                    v = m([
                        { x: d, y: c, z: 0 },
                        { x: k, y: c, z: 0 },
                        { x: k, y: g, z: 0 },
                        { x: d, y: g, z: 0 },
                    ]);
                m = m([
                    { x: d, y: g, z: e },
                    { x: k, y: g, z: e },
                    { x: k, y: c, z: e },
                    { x: d, y: c, z: e },
                ]);
                var r = !1,
                    x = !1,
                    y = !1,
                    u = !1;
                [].concat(h.xAxis, h.yAxis, h.zAxis).forEach(function (a) {
                    a &&
                        (a.horiz
                            ? a.opposite
                                ? (x = !0)
                                : (r = !0)
                            : a.opposite
                            ? (u = !0)
                            : (y = !0));
                });
                var z = function (a, c, e) {
                    for (
                        var f = ["size", "color", "visible"], d = {}, b = 0;
                        b < f.length;
                        b++
                    )
                        for (var m = f[b], g = 0; g < a.length; g++)
                            if ("object" === typeof a[g]) {
                                var n = a[g][m];
                                if ("undefined" !== typeof n && null !== n) {
                                    d[m] = n;
                                    break;
                                }
                            }
                    a = e;
                    !0 === d.visible || !1 === d.visible
                        ? (a = d.visible)
                        : "auto" === d.visible && (a = 0 < c);
                    return {
                        size: q(d.size, 1),
                        color: q(d.color, "none"),
                        frontFacing: 0 < c,
                        visible: a,
                    };
                };
                a = {
                    axes: {},
                    bottom: z([a.bottom, a.top, a], t, r),
                    top: z([a.top, a.bottom, a], n, x),
                    left: z([a.left, a.right, a.side, a], l, y),
                    right: z([a.right, a.left, a.side, a], f, u),
                    back: z([a.back, a.front, a], m, !0),
                    front: z([a.front, a.back, a], v, !1),
                };
                "auto" === p.axisLabelPosition
                    ? ((f = function (a, c) {
                          return (
                              a.visible !== c.visible ||
                              (a.visible &&
                                  c.visible &&
                                  a.frontFacing !== c.frontFacing)
                          );
                      }),
                      (p = []),
                      f(a.left, a.front) &&
                          p.push({
                              y: (g + c) / 2,
                              x: d,
                              z: 0,
                              xDir: { x: 1, y: 0, z: 0 },
                          }),
                      f(a.left, a.back) &&
                          p.push({
                              y: (g + c) / 2,
                              x: d,
                              z: e,
                              xDir: { x: 0, y: 0, z: -1 },
                          }),
                      f(a.right, a.front) &&
                          p.push({
                              y: (g + c) / 2,
                              x: k,
                              z: 0,
                              xDir: { x: 0, y: 0, z: 1 },
                          }),
                      f(a.right, a.back) &&
                          p.push({
                              y: (g + c) / 2,
                              x: k,
                              z: e,
                              xDir: { x: -1, y: 0, z: 0 },
                          }),
                      (t = []),
                      f(a.bottom, a.front) &&
                          t.push({
                              x: (d + k) / 2,
                              y: c,
                              z: 0,
                              xDir: { x: 1, y: 0, z: 0 },
                          }),
                      f(a.bottom, a.back) &&
                          t.push({
                              x: (d + k) / 2,
                              y: c,
                              z: e,
                              xDir: { x: -1, y: 0, z: 0 },
                          }),
                      (n = []),
                      f(a.top, a.front) &&
                          n.push({
                              x: (d + k) / 2,
                              y: g,
                              z: 0,
                              xDir: { x: 1, y: 0, z: 0 },
                          }),
                      f(a.top, a.back) &&
                          n.push({
                              x: (d + k) / 2,
                              y: g,
                              z: e,
                              xDir: { x: -1, y: 0, z: 0 },
                          }),
                      (l = []),
                      f(a.bottom, a.left) &&
                          l.push({
                              z: (0 + e) / 2,
                              y: c,
                              x: d,
                              xDir: { x: 0, y: 0, z: -1 },
                          }),
                      f(a.bottom, a.right) &&
                          l.push({
                              z: (0 + e) / 2,
                              y: c,
                              x: k,
                              xDir: { x: 0, y: 0, z: 1 },
                          }),
                      (c = []),
                      f(a.top, a.left) &&
                          c.push({
                              z: (0 + e) / 2,
                              y: g,
                              x: d,
                              xDir: { x: 0, y: 0, z: -1 },
                          }),
                      f(a.top, a.right) &&
                          c.push({
                              z: (0 + e) / 2,
                              y: g,
                              x: k,
                              xDir: { x: 0, y: 0, z: 1 },
                          }),
                      (d = function (a, c, e) {
                          if (0 === a.length) return null;
                          if (1 === a.length) return a[0];
                          for (
                              var d = 0, f = w(a, h, !1), b = 1;
                              b < f.length;
                              b++
                          )
                              e * f[b][c] > e * f[d][c]
                                  ? (d = b)
                                  : e * f[b][c] === e * f[d][c] &&
                                    f[b].z < f[d].z &&
                                    (d = b);
                          return a[d];
                      }),
                      (a.axes = {
                          y: { left: d(p, "x", -1), right: d(p, "x", 1) },
                          x: { top: d(n, "y", -1), bottom: d(t, "y", 1) },
                          z: { top: d(c, "y", -1), bottom: d(l, "y", 1) },
                      }))
                    : (a.axes = {
                          y: {
                              left: { x: d, z: 0, xDir: { x: 1, y: 0, z: 0 } },
                              right: { x: k, z: 0, xDir: { x: 0, y: 0, z: 1 } },
                          },
                          x: {
                              top: { y: g, z: 0, xDir: { x: 1, y: 0, z: 0 } },
                              bottom: {
                                  y: c,
                                  z: 0,
                                  xDir: { x: 1, y: 0, z: 0 },
                              },
                          },
                          z: {
                              top: {
                                  x: y ? k : d,
                                  y: g,
                                  xDir: y
                                      ? { x: 0, y: 0, z: 1 }
                                      : { x: 0, y: 0, z: -1 },
                              },
                              bottom: {
                                  x: y ? k : d,
                                  y: c,
                                  xDir: y
                                      ? { x: 0, y: 0, z: 1 }
                                      : { x: 0, y: 0, z: -1 },
                              },
                          },
                      });
                return a;
            };
            b.Fx.prototype.matrixSetter = function () {
                if (1 > this.pos && (u(this.start) || u(this.end))) {
                    var b = this.start || [1, 0, 0, 1, 0, 0],
                        h = this.end || [1, 0, 0, 1, 0, 0];
                    var a = [];
                    for (var d = 0; 6 > d; d++)
                        a.push(this.pos * h[d] + (1 - this.pos) * b[d]);
                } else a = this.end;
                this.elem.attr(this.prop, a, null, !0);
            };
            ("");
        }
    );
    A(
        r,
        "parts-3d/Axis.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            function r(a, e, b) {
                if (!a.chart.is3d() || "colorAxis" === a.coll) return e;
                var c = a.chart,
                    m = y * c.options.chart.options3d.alpha,
                    g = y * c.options.chart.options3d.beta,
                    f = q(
                        b && a.options.title.position3d,
                        a.options.labels.position3d
                    );
                b = q(b && a.options.title.skew3d, a.options.labels.skew3d);
                var h = c.frame3d,
                    k = c.plotLeft,
                    l = c.plotWidth + k,
                    w = c.plotTop,
                    v = c.plotHeight + w;
                c = !1;
                var r = 0,
                    x = 0,
                    u = { x: 0, y: 1, z: 0 };
                e = a.swapZ({ x: e.x, y: e.y, z: 0 });
                if (a.isZAxis)
                    if (a.opposite) {
                        if (null === h.axes.z.top) return {};
                        x = e.y - w;
                        e.x = h.axes.z.top.x;
                        e.y = h.axes.z.top.y;
                        k = h.axes.z.top.xDir;
                        c = !h.top.frontFacing;
                    } else {
                        if (null === h.axes.z.bottom) return {};
                        x = e.y - v;
                        e.x = h.axes.z.bottom.x;
                        e.y = h.axes.z.bottom.y;
                        k = h.axes.z.bottom.xDir;
                        c = !h.bottom.frontFacing;
                    }
                else if (a.horiz)
                    if (a.opposite) {
                        if (null === h.axes.x.top) return {};
                        x = e.y - w;
                        e.y = h.axes.x.top.y;
                        e.z = h.axes.x.top.z;
                        k = h.axes.x.top.xDir;
                        c = !h.top.frontFacing;
                    } else {
                        if (null === h.axes.x.bottom) return {};
                        x = e.y - v;
                        e.y = h.axes.x.bottom.y;
                        e.z = h.axes.x.bottom.z;
                        k = h.axes.x.bottom.xDir;
                        c = !h.bottom.frontFacing;
                    }
                else if (a.opposite) {
                    if (null === h.axes.y.right) return {};
                    r = e.x - l;
                    e.x = h.axes.y.right.x;
                    e.z = h.axes.y.right.z;
                    k = h.axes.y.right.xDir;
                    k = { x: k.z, y: k.y, z: -k.x };
                } else {
                    if (null === h.axes.y.left) return {};
                    r = e.x - k;
                    e.x = h.axes.y.left.x;
                    e.z = h.axes.y.left.z;
                    k = h.axes.y.left.xDir;
                }
                "chart" !== f &&
                    ("flap" === f
                        ? a.horiz
                            ? ((g = Math.sin(m)),
                              (m = Math.cos(m)),
                              a.opposite && (g = -g),
                              c && (g = -g),
                              (u = { x: k.z * g, y: m, z: -k.x * g }))
                            : (k = { x: Math.cos(g), y: 0, z: Math.sin(g) })
                        : "ortho" === f
                        ? a.horiz
                            ? ((u = Math.cos(m)),
                              (f = Math.sin(g) * u),
                              (m = -Math.sin(m)),
                              (g = -u * Math.cos(g)),
                              (u = {
                                  x: k.y * g - k.z * m,
                                  y: k.z * f - k.x * g,
                                  z: k.x * m - k.y * f,
                              }),
                              (m =
                                  1 /
                                  Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z)),
                              c && (m = -m),
                              (u = { x: m * u.x, y: m * u.y, z: m * u.z }))
                            : (k = { x: Math.cos(g), y: 0, z: Math.sin(g) })
                        : a.horiz
                        ? (u = {
                              x: Math.sin(g) * Math.sin(m),
                              y: Math.cos(m),
                              z: -Math.cos(g) * Math.sin(m),
                          })
                        : (k = { x: Math.cos(g), y: 0, z: Math.sin(g) }));
                e.x += r * k.x + x * u.x;
                e.y += r * k.y + x * u.y;
                e.z += r * k.z + x * u.z;
                c = p([e], a.chart)[0];
                b &&
                    (0 >
                        d(
                            p(
                                [
                                    e,
                                    {
                                        x: e.x + k.x,
                                        y: e.y + k.y,
                                        z: e.z + k.z,
                                    },
                                    {
                                        x: e.x + u.x,
                                        y: e.y + u.y,
                                        z: e.z + u.z,
                                    },
                                ],
                                a.chart
                            )
                        ) && (k = { x: -k.x, y: -k.y, z: -k.z }),
                    (a = p(
                        [
                            { x: e.x, y: e.y, z: e.z },
                            { x: e.x + k.x, y: e.y + k.y, z: e.z + k.z },
                            { x: e.x + u.x, y: e.y + u.y, z: e.z + u.z },
                        ],
                        a.chart
                    )),
                    (c.matrix = [
                        a[1].x - a[0].x,
                        a[1].y - a[0].y,
                        a[2].x - a[0].x,
                        a[2].y - a[0].y,
                        c.x,
                        c.y,
                    ]),
                    (c.matrix[4] -= c.x * c.matrix[0] + c.y * c.matrix[2]),
                    (c.matrix[5] -= c.x * c.matrix[1] + c.y * c.matrix[3]));
                return c;
            }
            var u = l.extend,
                q = l.pick,
                x = l.splat;
            l = l.wrap;
            var v = b.addEvent,
                h = b.Axis,
                w = b.Chart,
                y = b.deg2rad,
                B = b.merge,
                p = b.perspective,
                a = b.perspective3D,
                d = b.shapeArea,
                k = b.Tick;
            B(!0, h.prototype.defaultOptions, {
                labels: { position3d: "offset", skew3d: !1 },
                title: { position3d: null, skew3d: null },
            });
            v(h, "afterSetOptions", function () {
                if (
                    this.chart.is3d &&
                    this.chart.is3d() &&
                    "colorAxis" !== this.coll
                ) {
                    var a = this.options;
                    a.tickWidth = q(a.tickWidth, 0);
                    a.gridLineWidth = q(a.gridLineWidth, 1);
                }
            });
            l(h.prototype, "getPlotLinePath", function (a) {
                var c = a.apply(this, [].slice.call(arguments, 1));
                if (
                    !this.chart.is3d() ||
                    "colorAxis" === this.coll ||
                    null === c
                )
                    return c;
                var d = this.chart,
                    b = d.options.chart.options3d;
                b = this.isZAxis ? d.plotWidth : b.depth;
                d = d.frame3d;
                c = [
                    this.swapZ({ x: c[1], y: c[2], z: 0 }),
                    this.swapZ({ x: c[1], y: c[2], z: b }),
                    this.swapZ({ x: c[4], y: c[5], z: 0 }),
                    this.swapZ({ x: c[4], y: c[5], z: b }),
                ];
                b = [];
                this.horiz
                    ? (this.isZAxis
                          ? (d.left.visible && b.push(c[0], c[2]),
                            d.right.visible && b.push(c[1], c[3]))
                          : (d.front.visible && b.push(c[0], c[2]),
                            d.back.visible && b.push(c[1], c[3])),
                      d.top.visible && b.push(c[0], c[1]),
                      d.bottom.visible && b.push(c[2], c[3]))
                    : (d.front.visible && b.push(c[0], c[2]),
                      d.back.visible && b.push(c[1], c[3]),
                      d.left.visible && b.push(c[0], c[1]),
                      d.right.visible && b.push(c[2], c[3]));
                b = p(b, this.chart, !1);
                return this.chart.renderer.toLineSegments(b);
            });
            l(h.prototype, "getLinePath", function (a) {
                return this.chart.is3d() && "colorAxis" !== this.coll
                    ? []
                    : a.apply(this, [].slice.call(arguments, 1));
            });
            l(h.prototype, "getPlotBandPath", function (a) {
                if (!this.chart.is3d() || "colorAxis" === this.coll)
                    return a.apply(this, [].slice.call(arguments, 1));
                var c = arguments,
                    d = c[2],
                    b = [];
                c = this.getPlotLinePath({ value: c[1] });
                d = this.getPlotLinePath({ value: d });
                if (c && d)
                    for (var g = 0; g < c.length; g += 6)
                        b.push(
                            "M",
                            c[g + 1],
                            c[g + 2],
                            "L",
                            c[g + 4],
                            c[g + 5],
                            "L",
                            d[g + 4],
                            d[g + 5],
                            "L",
                            d[g + 1],
                            d[g + 2],
                            "Z"
                        );
                return b;
            });
            l(k.prototype, "getMarkPath", function (a) {
                var c = a.apply(this, [].slice.call(arguments, 1));
                c = [
                    r(this.axis, { x: c[1], y: c[2], z: 0 }),
                    r(this.axis, { x: c[4], y: c[5], z: 0 }),
                ];
                return this.axis.chart.renderer.toLineSegments(c);
            });
            v(k, "afterGetLabelPosition", function (a) {
                u(a.pos, r(this.axis, a.pos));
            });
            l(h.prototype, "getTitlePosition", function (a) {
                var c = a.apply(this, [].slice.call(arguments, 1));
                return r(this, c, !0);
            });
            v(h, "drawCrosshair", function (a) {
                this.chart.is3d() &&
                    "colorAxis" !== this.coll &&
                    a.point &&
                    (a.point.crosshairPos = this.isXAxis
                        ? a.point.axisXpos
                        : this.len - a.point.axisYpos);
            });
            v(h, "destroy", function () {
                ["backFrame", "bottomFrame", "sideFrame"].forEach(function (a) {
                    this[a] && (this[a] = this[a].destroy());
                }, this);
            });
            w.prototype.addZAxis = function (a) {
                return new g(this, a);
            };
            w.prototype.collectionsWithUpdate.push("zAxis");
            w.prototype.collectionsWithInit.zAxis = [w.prototype.addZAxis];
            h.prototype.swapZ = function (a, d) {
                return this.isZAxis
                    ? ((d = d ? 0 : this.chart.plotLeft),
                      { x: d + a.z, y: a.y, z: a.x - d })
                    : a;
            };
            var g = (b.ZAxis = function () {
                this.init.apply(this, arguments);
            });
            u(g.prototype, h.prototype);
            u(g.prototype, {
                isZAxis: !0,
                setOptions: function (a) {
                    a = B({ offset: 0, lineWidth: 0 }, a);
                    h.prototype.setOptions.call(this, a);
                    this.coll = "zAxis";
                },
                setAxisSize: function () {
                    h.prototype.setAxisSize.call(this);
                    this.width = this.len =
                        this.chart.options.chart.options3d.depth;
                    this.right = this.chart.chartWidth - this.width - this.left;
                },
                getSeriesExtremes: function () {
                    var a = this,
                        d = a.chart;
                    a.hasVisibleSeries = !1;
                    a.dataMin =
                        a.dataMax =
                        a.ignoreMinPadding =
                        a.ignoreMaxPadding =
                            null;
                    a.buildStacks && a.buildStacks();
                    a.series.forEach(function (c) {
                        if (c.visible || !d.options.chart.ignoreHiddenSeries)
                            (a.hasVisibleSeries = !0),
                                (c = c.zData),
                                c.length &&
                                    ((a.dataMin = Math.min(
                                        q(a.dataMin, c[0]),
                                        Math.min.apply(null, c)
                                    )),
                                    (a.dataMax = Math.max(
                                        q(a.dataMax, c[0]),
                                        Math.max.apply(null, c)
                                    )));
                    });
                },
            });
            v(w, "afterGetAxes", function () {
                var a = this,
                    d = this.options;
                d = d.zAxis = x(d.zAxis || {});
                a.is3d() &&
                    ((this.zAxis = []),
                    d.forEach(function (c, d) {
                        c.index = d;
                        c.isX = !0;
                        a.addZAxis(c).setScale();
                    }));
            });
            l(h.prototype, "getSlotWidth", function (c, d) {
                if (
                    this.chart.is3d() &&
                    d &&
                    d.label &&
                    this.categories &&
                    this.chart.frameShapes
                ) {
                    var b = this.chart,
                        e = this.ticks,
                        g = this.gridGroup.element.childNodes[0].getBBox(),
                        h = b.frameShapes.left.getBBox(),
                        f = b.options.chart.options3d;
                    b = {
                        x: b.plotWidth / 2,
                        y: b.plotHeight / 2,
                        z: f.depth / 2,
                        vd: q(f.depth, 1) * q(f.viewDistance, 0),
                    };
                    var k, p;
                    f = d.pos;
                    var l = e[f - 1];
                    e = e[f + 1];
                    0 !== f &&
                        l &&
                        l.label.xy &&
                        (k = a(
                            { x: l.label.xy.x, y: l.label.xy.y, z: null },
                            b,
                            b.vd
                        ));
                    e &&
                        e.label.xy &&
                        (p = a(
                            { x: e.label.xy.x, y: e.label.xy.y, z: null },
                            b,
                            b.vd
                        ));
                    e = { x: d.label.xy.x, y: d.label.xy.y, z: null };
                    e = a(e, b, b.vd);
                    return Math.abs(k ? e.x - k.x : p ? p.x - e.x : g.x - h.x);
                }
                return c.apply(this, [].slice.call(arguments, 1));
            });
        }
    );
    A(
        r,
        "parts-3d/Series.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            var r = l.pick;
            l = b.addEvent;
            var u = b.perspective;
            l(b.Series, "afterTranslate", function () {
                this.chart.is3d() && this.translate3dPoints();
            });
            b.Series.prototype.translate3dPoints = function () {
                var b = this.chart,
                    l = r(this.zAxis, b.options.zAxis[0]),
                    v = [],
                    h;
                for (h = 0; h < this.data.length; h++) {
                    var w = this.data[h];
                    if (l && l.translate) {
                        var y = l.isLog && l.val2lin ? l.val2lin(w.z) : w.z;
                        w.plotZ = l.translate(y);
                        w.isInside = w.isInside ? y >= l.min && y <= l.max : !1;
                    } else w.plotZ = 0;
                    w.axisXpos = w.plotX;
                    w.axisYpos = w.plotY;
                    w.axisZpos = w.plotZ;
                    v.push({ x: w.plotX, y: w.plotY, z: w.plotZ });
                }
                b = u(v, b, !0);
                for (h = 0; h < this.data.length; h++)
                    (w = this.data[h]),
                        (l = b[h]),
                        (w.plotX = l.x),
                        (w.plotY = l.y),
                        (w.plotZ = l.z);
            };
        }
    );
    A(
        r,
        "parts-3d/Column.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            function r(b) {
                var a = b.apply(this, [].slice.call(arguments, 1));
                this.chart.is3d &&
                    this.chart.is3d() &&
                    ((a.stroke = this.options.edgeColor || a.fill),
                    (a["stroke-width"] = x(this.options.edgeWidth, 1)));
                return a;
            }
            function u(b, a, d) {
                var k = this.chart.is3d && this.chart.is3d();
                k && (this.options.inactiveOtherPoints = !0);
                b.call(this, a, d);
                k && (this.options.inactiveOtherPoints = !1);
            }
            function q(b) {
                for (var a = [], d = 1; d < arguments.length; d++)
                    a[d - 1] = arguments[d];
                return this.series.chart.is3d()
                    ? this.graphic && "g" !== this.graphic.element.nodeName
                    : b.apply(this, a);
            }
            var x = l.pick;
            l = l.wrap;
            var v = b.addEvent,
                h = b.perspective,
                w = b.Series,
                y = b.seriesTypes,
                B = b.svg;
            l(y.column.prototype, "translate", function (b) {
                b.apply(this, [].slice.call(arguments, 1));
                this.chart.is3d() && this.translate3dShapes();
            });
            l(b.Series.prototype, "alignDataLabel", function (b) {
                arguments[3].outside3dPlot = arguments[1].outside3dPlot;
                b.apply(this, [].slice.call(arguments, 1));
            });
            l(b.Series.prototype, "justifyDataLabel", function (b) {
                return arguments[2].outside3dPlot
                    ? !1
                    : b.apply(this, [].slice.call(arguments, 1));
            });
            y.column.prototype.translate3dPoints = function () {};
            y.column.prototype.translate3dShapes = function () {
                var b = this,
                    a = b.chart,
                    d = b.options,
                    k = d.depth || 25,
                    g =
                        (d.stacking ? d.stack || 0 : b.index) *
                        (k + (d.groupZPadding || 1)),
                    c = b.borderWidth % 2 ? 0.5 : 0;
                a.inverted && !b.yAxis.reversed && (c *= -1);
                !1 !== d.grouping && (g = 0);
                g += d.groupZPadding || 1;
                b.data.forEach(function (d) {
                    d.outside3dPlot = null;
                    if (null !== d.y) {
                        var e = d.shapeArgs,
                            l = d.tooltipPos,
                            n;
                        [
                            ["x", "width"],
                            ["y", "height"],
                        ].forEach(function (a) {
                            n = e[a[0]] - c;
                            0 > n &&
                                ((e[a[1]] += e[a[0]] + c),
                                (e[a[0]] = -c),
                                (n = 0));
                            n + e[a[1]] > b[a[0] + "Axis"].len &&
                                0 !== e[a[1]] &&
                                (e[a[1]] = b[a[0] + "Axis"].len - e[a[0]]);
                            if (
                                0 !== e[a[1]] &&
                                (e[a[0]] >= b[a[0] + "Axis"].len ||
                                    e[a[0]] + e[a[1]] <= c)
                            ) {
                                for (var f in e) e[f] = 0;
                                d.outside3dPlot = !0;
                            }
                        });
                        "rect" === d.shapeType && (d.shapeType = "cuboid");
                        e.z = g;
                        e.depth = k;
                        e.insidePlotArea = !0;
                        l = h([{ x: l[0], y: l[1], z: g }], a, !0)[0];
                        d.tooltipPos = [l.x, l.y];
                    }
                });
                b.z = g;
            };
            l(y.column.prototype, "animate", function (b) {
                if (this.chart.is3d()) {
                    var a = arguments[1],
                        d = this.yAxis,
                        k = this,
                        g = this.yAxis.reversed;
                    B &&
                        (a
                            ? k.data.forEach(function (a) {
                                  null !== a.y &&
                                      ((a.height = a.shapeArgs.height),
                                      (a.shapey = a.shapeArgs.y),
                                      (a.shapeArgs.height = 1),
                                      g ||
                                          (a.shapeArgs.y = a.stackY
                                              ? a.plotY + d.translate(a.stackY)
                                              : a.plotY +
                                                (a.negative
                                                    ? -a.height
                                                    : a.height)));
                              })
                            : (k.data.forEach(function (a) {
                                  null !== a.y &&
                                      ((a.shapeArgs.height = a.height),
                                      (a.shapeArgs.y = a.shapey),
                                      a.graphic &&
                                          a.graphic.animate(
                                              a.shapeArgs,
                                              k.options.animation
                                          ));
                              }),
                              this.drawDataLabels(),
                              (k.animate = null)));
                } else b.apply(this, [].slice.call(arguments, 1));
            });
            l(y.column.prototype, "plotGroup", function (b, a, d, k, g, c) {
                "dataLabelsGroup" !== a &&
                    this.chart.is3d() &&
                    (this[a] && delete this[a],
                    c &&
                        (this.chart.columnGroup ||
                            (this.chart.columnGroup = this.chart.renderer
                                .g("columnGroup")
                                .add(c)),
                        (this[a] = this.chart.columnGroup),
                        this.chart.columnGroup.attr(this.getPlotBox()),
                        (this[a].survive = !0),
                        "group" === a || "markerGroup" === a)) &&
                    (arguments[3] = "visible");
                return b.apply(this, Array.prototype.slice.call(arguments, 1));
            });
            l(y.column.prototype, "setVisible", function (b, a) {
                var d = this,
                    k;
                d.chart.is3d() &&
                    d.data.forEach(function (b) {
                        k = (b.visible =
                            b.options.visible =
                            a =
                                "undefined" === typeof a
                                    ? !x(d.visible, b.visible)
                                    : a)
                            ? "visible"
                            : "hidden";
                        d.options.data[d.data.indexOf(b)] = b.options;
                        b.graphic && b.graphic.attr({ visibility: k });
                    });
                b.apply(this, Array.prototype.slice.call(arguments, 1));
            });
            y.column.prototype.handle3dGrouping = !0;
            v(w, "afterInit", function () {
                if (this.chart.is3d() && this.handle3dGrouping) {
                    var b = this.options,
                        a = b.grouping,
                        d = b.stacking,
                        k = x(this.yAxis.options.reversedStacks, !0),
                        g = 0;
                    if ("undefined" === typeof a || a) {
                        a = this.chart.retrieveStacks(d);
                        g = b.stack || 0;
                        for (
                            d = 0;
                            d < a[g].series.length && a[g].series[d] !== this;
                            d++
                        );
                        g = 10 * (a.totalStacks - a[g].position) + (k ? d : -d);
                        this.xAxis.reversed || (g = 10 * a.totalStacks - g);
                    }
                    b.zIndex = g;
                }
            });
            l(y.column.prototype, "pointAttribs", r);
            l(y.column.prototype, "setState", u);
            l(y.column.prototype.pointClass.prototype, "hasNewShapeType", q);
            y.columnrange &&
                (l(y.columnrange.prototype, "pointAttribs", r),
                l(y.columnrange.prototype, "setState", u),
                l(
                    y.columnrange.prototype.pointClass.prototype,
                    "hasNewShapeType",
                    q
                ),
                (y.columnrange.prototype.plotGroup =
                    y.column.prototype.plotGroup),
                (y.columnrange.prototype.setVisible =
                    y.column.prototype.setVisible));
            l(w.prototype, "alignDataLabel", function (b) {
                if (this.chart.is3d() && this instanceof y.column) {
                    var a = arguments,
                        d = a[4];
                    a = a[1];
                    var k = { x: d.x, y: d.y, z: this.z };
                    k = h([k], this.chart, !0)[0];
                    d.x = k.x;
                    d.y = a.outside3dPlot ? -9e9 : k.y;
                }
                b.apply(this, [].slice.call(arguments, 1));
            });
            l(b.StackItem.prototype, "getStackBox", function (h, a) {
                var d = h.apply(this, [].slice.call(arguments, 1));
                if (a.is3d()) {
                    var k = { x: d.x, y: d.y, z: 0 };
                    k = b.perspective([k], a, !0)[0];
                    d.x = k.x;
                    d.y = k.y;
                }
                return d;
            });
        }
    );
    A(
        r,
        "parts-3d/Pie.js",
        [r["parts/Globals.js"], r["parts/Utilities.js"]],
        function (b, l) {
            var r = l.pick;
            l = l.wrap;
            var u = b.deg2rad,
                q = b.seriesTypes,
                x = b.svg;
            l(q.pie.prototype, "translate", function (b) {
                b.apply(this, [].slice.call(arguments, 1));
                if (this.chart.is3d()) {
                    var h = this,
                        l = h.options,
                        q = l.depth || 0,
                        r = h.chart.options.chart.options3d,
                        p = r.alpha,
                        a = r.beta,
                        d = l.stacking ? (l.stack || 0) * q : h._i * q;
                    d += q / 2;
                    !1 !== l.grouping && (d = 0);
                    h.data.forEach(function (b) {
                        var g = b.shapeArgs;
                        b.shapeType = "arc3d";
                        g.z = d;
                        g.depth = 0.75 * q;
                        g.alpha = p;
                        g.beta = a;
                        g.center = h.center;
                        g = (g.end + g.start) / 2;
                        b.slicedTranslation = {
                            translateX: Math.round(
                                Math.cos(g) * l.slicedOffset * Math.cos(p * u)
                            ),
                            translateY: Math.round(
                                Math.sin(g) * l.slicedOffset * Math.cos(p * u)
                            ),
                        };
                    });
                }
            });
            l(q.pie.prototype.pointClass.prototype, "haloPath", function (b) {
                var h = arguments;
                return this.series.chart.is3d() ? [] : b.call(this, h[1]);
            });
            l(q.pie.prototype, "pointAttribs", function (b, h, l) {
                b = b.call(this, h, l);
                l = this.options;
                this.chart.is3d() &&
                    !this.chart.styledMode &&
                    ((b.stroke = l.edgeColor || h.color || this.color),
                    (b["stroke-width"] = r(l.edgeWidth, 1)));
                return b;
            });
            l(q.pie.prototype, "drawDataLabels", function (b) {
                if (this.chart.is3d()) {
                    var h = this.chart.options.chart.options3d;
                    this.data.forEach(function (b) {
                        var l = b.shapeArgs,
                            q = l.r,
                            p = (l.start + l.end) / 2;
                        b = b.labelPosition;
                        var a = b.connectorPosition,
                            d =
                                -q *
                                (1 - Math.cos((l.alpha || h.alpha) * u)) *
                                Math.sin(p),
                            k =
                                q *
                                (Math.cos((l.beta || h.beta) * u) - 1) *
                                Math.cos(p);
                        [b.natural, a.breakAt, a.touchingSliceAt].forEach(
                            function (a) {
                                a.x += k;
                                a.y += d;
                            }
                        );
                    });
                }
                b.apply(this, [].slice.call(arguments, 1));
            });
            l(q.pie.prototype, "addPoint", function (b) {
                b.apply(this, [].slice.call(arguments, 1));
                this.chart.is3d() && this.update(this.userOptions, !0);
            });
            l(q.pie.prototype, "animate", function (b) {
                if (this.chart.is3d()) {
                    var h = arguments[1],
                        l = this.options.animation,
                        q = this.center,
                        r = this.group,
                        p = this.markerGroup;
                    x &&
                        (!0 === l && (l = {}),
                        h
                            ? ((r.oldtranslateX = r.translateX),
                              (r.oldtranslateY = r.translateY),
                              (h = {
                                  translateX: q[0],
                                  translateY: q[1],
                                  scaleX: 0.001,
                                  scaleY: 0.001,
                              }),
                              r.attr(h),
                              p && ((p.attrSetters = r.attrSetters), p.attr(h)))
                            : ((h = {
                                  translateX: r.oldtranslateX,
                                  translateY: r.oldtranslateY,
                                  scaleX: 1,
                                  scaleY: 1,
                              }),
                              r.animate(h, l),
                              p && p.animate(h, l),
                              (this.animate = null)));
                } else b.apply(this, [].slice.call(arguments, 1));
            });
        }
    );
    A(r, "parts-3d/Scatter.js", [r["parts/Globals.js"]], function (b) {
        var l = b.Point,
            r = b.seriesType,
            u = b.seriesTypes;
        r(
            "scatter3d",
            "scatter",
            {
                tooltip: {
                    pointFormat:
                        "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>",
                },
            },
            {
                pointAttribs: function (l) {
                    var q = u.scatter.prototype.pointAttribs.apply(
                        this,
                        arguments
                    );
                    this.chart.is3d() &&
                        l &&
                        (q.zIndex = b.pointCameraDistance(l, this.chart));
                    return q;
                },
                axisTypes: ["xAxis", "yAxis", "zAxis"],
                pointArrayMap: ["x", "y", "z"],
                parallelArrays: ["x", "y", "z"],
                directTouch: !0,
            },
            {
                applyOptions: function () {
                    l.prototype.applyOptions.apply(this, arguments);
                    "undefined" === typeof this.z && (this.z = 0);
                    return this;
                },
            }
        );
        ("");
    });
    A(r, "parts-3d/VMLRenderer.js", [r["parts/Globals.js"]], function (b) {
        var l = b.addEvent,
            r = b.Axis,
            u = b.SVGRenderer,
            q = b.VMLRenderer;
        q &&
            (b.setOptions({ animate: !1 }),
            (q.prototype.face3d = u.prototype.face3d),
            (q.prototype.polyhedron = u.prototype.polyhedron),
            (q.prototype.elements3d = u.prototype.elements3d),
            (q.prototype.element3d = u.prototype.element3d),
            (q.prototype.cuboid = u.prototype.cuboid),
            (q.prototype.cuboidPath = u.prototype.cuboidPath),
            (q.prototype.toLinePath = u.prototype.toLinePath),
            (q.prototype.toLineSegments = u.prototype.toLineSegments),
            (q.prototype.arc3d = function (b) {
                b = u.prototype.arc3d.call(this, b);
                b.css({ zIndex: b.zIndex });
                return b;
            }),
            (b.VMLRenderer.prototype.arc3dPath =
                b.SVGRenderer.prototype.arc3dPath),
            l(r, "render", function () {
                this.sideFrame &&
                    (this.sideFrame.css({ zIndex: 0 }),
                    this.sideFrame.front.attr({ fill: this.sideFrame.color }));
                this.bottomFrame &&
                    (this.bottomFrame.css({ zIndex: 1 }),
                    this.bottomFrame.front.attr({
                        fill: this.bottomFrame.color,
                    }));
                this.backFrame &&
                    (this.backFrame.css({ zIndex: 0 }),
                    this.backFrame.front.attr({ fill: this.backFrame.color }));
            }));
    });
    A(r, "masters/highcharts-3d.src.js", [], function () {});
});
//# sourceMappingURL=highcharts-3d.js.map
