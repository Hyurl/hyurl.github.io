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