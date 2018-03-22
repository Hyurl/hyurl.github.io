"use strict";

String.byteLength = function (str) {
    var b = 0,
        l = str.length;
    if (l) {
        for (var i = 0; i < l; i++) {
            if (str.charCodeAt(i) > 255) {
                b += 2;
            } else {
                b++;
            }
        }
        return b;
    }
    
    return 0;
}

var path = location.pathname,
    hash = location.hash,
    match = location.search.match(/lang=(.*)[&]*/),
    lang = match ? match[1] : navigator.language,
    pin = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

location.hash = "";

$(function () {
    var navbar = $(".navbar>ul"),
        sidebar = $(".sidebar"),
        content = $("article.content"),
        renderer = new marked.Renderer(),
        pin = $("#anchor-pin").html(),
        navbarToggle = $(".navbar-toggle");

    //Render markdown headings.
    renderer.heading = function (text, level) {
        var isLatin = String.byteLength(text) == text.length,
            _text = text.replace(/\s/g, '-'),
            re = /[~`!@#\$%\^&\*\(\)\+=\{\}\[\]\|:"'<>,\.\?\/]/g,
            id;

        if (isLatin) {
            let matches = _text.match(/[\-0-9a-zA-Z]+/g);
            id = matches ? matches.join("_") : _text.replace(re, "_");
        } else {
            id = _text.replace(re, "_");
        }

        id = StringTrimmer.trim(id, "_");

        return `<h${level} id="${id}"><a class="heading-anchor" href="#${id}">${pin}</a>${text}</h${level}>\n`;
    };

    //Render markdown codes to be highlighted.
    renderer.code = function (code, lang, escaped) {
        return '<pre><code class="lang-' + lang + ' hljs">' +
            hljs.highlightAuto(code).value + '</code></pre>';
    }

    /** Parse markdown to HTML. */
    var parseMarkdown = function (text) {
        return marked(text, { renderer: renderer });
    };

    navbarToggle.click(function () {
        navbar.parent().slideToggle();
    });

    //Highlight navbar tab.
    navbar.children().each(function () {
        var $this = $(this),
            link = $this.children("a").attr("href"),
            i = path.lastIndexOf("/") + 1,
            cat = i ? path.substr(0, i) : path;
        link == cat ? $this.addClass("active") : $this.removeClass("active");
    });

    //Highlight sidebar tab
    sidebar.find("a").each(function () {
        var href = $(this).attr("href");
        if (href == path) {
            $(this).addClass("active");
        }
    });

    //Hide user dropdown menu when click areas outer the menu.
    $(document).on('click', function (event) {
        var target = $(event.target);
        if (target.closest(".user-dropdown").length === 0 &&
            !target.is("#user-btn")) { }
    });

    //Handle anchor clicking.
    $(document).on("click", "a", function (event) {
        var link = $(this).attr("href");
        if (link.indexOf("#") === 0) {
            event.preventDefault();
            var target = $(link)[0],
                navbarHeight = $("header")[0].offsetHeight + 20;
            //Scroll the body.
            $("html,body").animate({
                scrollTop: target.offsetTop - navbarHeight
            });
        }
    });

    //Show ICP in china area.
    if (lang == 'zh-CN') {
        $("#icp").show();
    }

    //Scroll the document.
    if (hash) {
        $('a[href="' + hash + '"]').click();
    }

    $.fn.typeIn = function (speed, placeholder, callback) {
        speed = speed || 100;
        switch (speed) {
            case "slow":
                speed = 150;
                break;
            case "normal":
                speed = 100;
                break;
            case "fast":
                speed = 50;
                break;
        }
        placeholder = placeholder || '_';
        if (typeof placeholder == 'function') {
            callback = placeholder;
            placeholder = '_';
        }
        var $this = $(this),
            html = $this.html().trim(),
            i = 0;
        $(this).html('');
        $(this).each(function () {
            var int = setInterval(function () {
                if (html.substr(i, 1) == '<') {
                    i = html.indexOf('>', i) + 1;
                } else {
                    i++;
                }
                $this.html(html.substring(0, i) + (i & 1 ? placeholder : ''));
                if (i >= html.length) {
                    clearInterval(int);
                    if (typeof callback == 'function') {
                        callback.call($this, $this);
                    }
                }
            }, speed);
        });
        return this;
    };


    var command = $(".command>pre"),
        type = function () {
            command.typeIn("slow", function () {
                setTimeout(type, 1500);
            });
        };
    if (command.length)
        setTimeout(type, 1500);

    // Add ?lang=[lang] in the URL
    var replaceLink = function (target) {
        if (match) {
            target = target || $("body");
            target.find("a").each(function () {
                var href = $(this).attr("href");
                if (href.indexOf("javascript:") !== 0 &&
                    href.indexOf("http") !== 0 &&
                    href.indexOf("#") !== 0 &&
                    href != "?lang=zh" &&
                    href != "?lang=en") {
                    $(this).attr("href", href.split("?")[0] + "?lang=" + lang);
                }
            })
        }
    };
    replaceLink();

    if (content.length) {
        var Title = document.title,
            getContent = function (src, title) {
                $.get(src + ".md", function (data) {
                    content.removeClass("fadeOut").addClass("fadeIn");
                    var path = src.replace("Docs/zh", "Docs");
                    if (lang)
                        path += "?lang=" + lang;
                    SoftLoader.replaceWith(parseMarkdown(data), title, path);
                    replaceLink(content);
                });
            },
            src = isZh ? path.replace("Docs", "Docs/zh") : path;
        SoftLoader.bind(content[0]);
        getContent(src, Title);
        sidebar.find("a").click(function (event) {
            var $this = $(this),
                href = $this.attr("href"),
                text = $this[0].innerText || $this[0].textContent,
                title = Title.replace(/:\s([\S\s]+)\s\|/, function (match) {
                    return ": " + text + " |";
                });
            if (href != "javascript:;") {
                event.preventDefault();
                var src = isZh ? href.replace("Docs", "Docs/zh") : href;
                src = src.split("?")[0];
                getContent(src, title);
                sidebar.find("a").removeClass("active");
                $this.addClass("active");
                content.removeClass("fadeIn").addClass("fadeOut");
            }
        });
    }
});