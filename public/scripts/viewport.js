;(function(win, doc) {
    var docEl = doc.documentElement,
        ua = win.navigator.userAgent,
        metaEl = docEl.querySelector('meta[name="viewport"]'),
        dpr = 0,
        scale = 0,
        tid;
    // 一物理像素在不同屏幕的显示效果不一样。要根据devicePixelRatio来修改meta标签的scale
    //设置dpr
    if (!dpr && !scale) {
        var isAndroid = ua.match(/android/gi),
            isIOS = ua.match(/iphone/gi),
            devicePixelRatio = win.devicePixelRatio;
        if (isIOS) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
        win.isIOS = isIOS
        win.isAndroid = isAndroid
    }
    // 设置data-dpr属性
    docEl.setAttribute('data-dpr', dpr);
    //将根据已有的meta标签来设置缩放比例
    if (metaEl) {
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    }
    //无viewport则新增缩放的viewport，达到高清效果
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    };
    //设置html的font-size，20为基准在于比较好除，414为6p宽度
    var refreshRem = function() {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 20 * (clientWidth / 414) + 'px';
    };
    //绑定事件
    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    refreshRem();
})(window, document);
