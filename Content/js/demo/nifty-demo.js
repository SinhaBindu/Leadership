$(document).on("nifty.ready", function () {

    

    //var e = '<div id="demo-settings-load" class="demo-settings-load"><i class="text-main demo-pli-repeat-2 icon-3x fa-spin"></i><br><h4 id="demo-get-status" class="text-bold text-uppercase">Loading...</h4><p id="demo-get-status-text">Please wait while the content is loaded</p></div>',
    //    t = '<div id="demo-nifty-settings" class="demo-nifty-settings"><button id="demo-set-btn" class="btn"><i class="demo-psi-gear"></i></button><div id="demo-set-content" class="demo-set-content"></div></div>';

    $("#demo-set-btn").one("click", function () {
        $("#demo-nifty-settings").addClass("in");
        n();
    });

    //$("body").append(t), $("#demo-set-btn").one("click", function () {
    //    $("#demo-nifty-settings").addClass("in"), $("#demo-set-content").append(e), $.get("../../settings.html", function (e) {
    //        $("#demo-set-content").empty().append(e), n()
    //    }).fail(function (e) {
    //        $("#demo-get-status").html(e.status), $("#demo-get-status-text").html(e.statusText)
    //    })
    //});


    var a = function () {
        for (var e = window.location.search.substring(1), t = e.split("&"), a = 0; a < t.length; a++) {
            var n = t[a].split("=");
            if ("offcanvas" == n[0]) return n[1]
        }
        return !1
    }();
    "push" != a && "slide" != a && "reveal" != a || ($(".mainnav-toggle").removeClass("push slide reveal").addClass(a), $("#container").removeClass("mainnav-lg mainnav-sm").addClass("mainnav-out " + a));
    var n = function () {
        function e(e) {
            for (var t = "", a = 1; 17 > a; a++) t += '<a href="#" class="thumbnail box-inline"><img class="img-responsive" src="./premium/boxed-bg/' + e + "/thumbs/" + a + '.jpg" alt="Background Image"></a>';
            return t
        }

        function t() {
            f.append(e("blurred")), u.append(e("polygon")), g.append(e("abstract"));
            var t = m.find(".thumbnail");
            t.on("click", function () {
                t.removeClass("selected");
                var e = $(this).children("img").prop("src").replace("thumbs", "bg");
                $(this).addClass("selected"), s.css({
                    "background-image": "url(" + e + ")",
                    "background-repeat": "no-repeat",
                    "background-size": "cover",
                    "background-attachment": "fixed"
                })
            })
        }
        var n = $("#demo-nifty-settings"),
            s = $("#container"),
            d = $("#mainnav-container"),
            o = $("#aside-container"),
            c = $("#demo-set-btn"),
            l = document.getElementById("demo-box-lay"),
            h = document.getElementById("demo-box-img"),
            m = $("#demo-bg-boxed"),
            r = document.getElementById("demo-close-boxed-img"),
            f = $("#demo-blurred-bg"),
            u = $("#demo-polygon-bg"),
            g = $("#demo-abstract-bg");
        $("#demo-set-tooltip").tooltip(), s.hasClass("boxed-layout") ? (l.checked = !0, h.disabled = !1) : (l.checked = !1, h.disabled = !0), m.hasClass("open") ? h.checked = !0 : h.checked = !1, l.onchange = function () {
            l.checked ? (s.addClass("boxed-layout"), h.disabled = !1) : (s.removeClass("boxed-layout").removeAttr("style"), h.checked = !1, h.disabled = !0, m.removeClass("open").find(".thumbnail").removeClass("selected")), $(window).trigger("resize")
        }, h.onchange = function () {
            h.checked ? (m.addClass("open"), n.hasClass("hasbgthumbs") || (t(), n.addClass("hasbgthumbs"))) : m.removeClass("open")
        }, r.onclick = function () {
            m.removeClass("open"), h.disabled = !1, h.checked = !1
        };
        var v = "easeInQuart easeOutQuart easeInBack easeOutBack easeInOutBack steps jumping rubber",
            p = document.getElementById("demo-anim"),
            k = document.getElementById("demo-ease");
        s.hasClass("effect") ? (p.checked = !0, k.disabled = !1) : (p.checked = !1, k.disabled = !0), p.onchange = function () {
            p.checked ? (s.addClass("effect"), k.disabled = !1, k.value = "effect") : (s.removeClass("effect " + v), k.disabled = !0)
        };
        var b = v.split(" ");
        for (i = 0; i < b.length; i++)
            if (s.hasClass(b[i])) {
                k.value = b[i];
                break
            }
        k.onchange = function () {
            var e = ($("option:selected", this), this.options[this.selectedIndex].value);
            e && s.removeClass(v).addClass(e)
        };
        var C = document.getElementById("demo-navbar-fixed");
        s.hasClass("navbar-fixed") ? C.checked = !0 : C.checked = !1, C.onchange = function () {
            C.checked ? s.addClass("navbar-fixed") : s.removeClass("navbar-fixed"), d.niftyAffix("update"), o.niftyAffix("update")
        };
        var y = document.getElementById("demo-footer-fixed");
        s.hasClass("footer-fixed") ? y.checked = !0 : y.checked = !1, y.onchange = function () {
            y.checked ? s.addClass("footer-fixed") : s.removeClass("footer-fixed")
        };
        var x = document.getElementById("demo-nav-coll"),
            I = document.getElementById("demo-nav-fixed"),
            B = document.getElementById("demo-nav-profile"),
            E = document.getElementById("demo-nav-shortcut"),
            A = document.getElementById("demo-nav-offcanvas"),
            w = $("#mainnav-profile"),
            P = $("#mainnav-shortcut");
        s.hasClass("mainnav-fixed") ? I.checked = !0 : I.checked = !1, s.hasClass("mainnav-fixed") ? I.checked = !0 : I.checked = !1, I.onchange = function () {
            I.checked ? $.niftyNav("fixedPosition") : $.niftyNav("staticPosition")
        }, w.hasClass("hidden") ? B.checked = !1 : B.checked = !0, B.onchange = function () {
            w.toggleClass("hidden")
        }, P.hasClass("hidden") ? E.checked = !1 : E.checked = !0, E.onchange = function () {
            P.toggleClass("hidden")
        }, s.hasClass("mainnav-sm") ? x.checked = !0 : x.checked = !1, x.onchange = function () {
            x.checked ? ("none" != A.value && (A.value = "none", location.href = location.protocol + "//" + location.host + location.pathname), $.niftyNav("collapse")) : $.niftyNav("expand")
        }, A.onchange = function () {
            x.checked && (x.checked = !1), n.removeClass("in"), location.href = location.protocol + "//" + location.host + location.pathname + "?&offcanvas=" + this.options[this.selectedIndex].value
        }, "push" == a || "slide" == a || "reveal" == a ? ($(".mainnav-toggle").removeClass("push slide reveal").addClass(a), A.value = a) : s.hasClass("mainnav-sm") ? x.checked = !0 : x.checked = !1;
        var N = document.getElementById("demo-asd-vis"),
            z = document.getElementById("demo-asd-fixed"),
            O = document.getElementById("demo-asd-float"),
            T = document.getElementById("demo-asd-align"),
            j = document.getElementById("demo-asd-themes");
        s.hasClass("aside-in") ? N.checked = !0 : N.checked = !1, N.onchange = function () {
            N.checked ? $.niftyAside("show") : $.niftyAside("hide")
        }, s.hasClass("aside-fixed") ? z.checked = !0 : z.checked = !1, z.onchange = function () {
            z.checked ? $.niftyAside("fixedPosition") : $.niftyAside("staticPosition")
        }, s.hasClass("aside-float") ? O.checked = !0 : O.checked = !1, O.onchange = function () {
            O.checked ? s.addClass("aside-float") : s.removeClass("aside-float"), $(window).trigger("resize")
        }, s.hasClass("aside-left") ? T.checked = !0 : T.checked = !1, T.onchange = function () {
            T.checked ? $.niftyAside("alignLeft") : $.niftyAside("alignRight")
        }, s.hasClass("aside-bright") ? j.checked = !1 : j.checked = !0, j.onchange = function () {
            j.checked ? $.niftyAside("darkTheme") : $.niftyAside("brightTheme")
        };
        var L = $(".demo-theme"),
            Q = function (e, t) {
                var a = $("#theme"),
                    n = ".min.css",
                    s = "css/themes/type-" + t + "/" + e + n;
                a.length ? a.prop("href", s) : (a = '<link id="theme" href="' + s + '" rel="stylesheet">', $("head").append(a))
            };
        $("#demo-theme").on("click", ".demo-theme", function (e) {
            e.preventDefault();
            var t = $(this);
            return t.hasClass("disabled") || t.hasClass("active") ? !1 : (Q(t.attr("data-theme"), t.attr("data-type")), L.removeClass("active"), t.addClass("active").tooltip("hide"), !1)
        }), n.on("click", function (e) {
            n.hasClass("in") && $(e.target).is(n) && n.removeClass("in")
        }), c.on("click", function () {
            return n.toggleClass("in"), !1
        }), $("#demo-btn-close-settings").on("click", function () {
            c.trigger("click")
        })
    }
});