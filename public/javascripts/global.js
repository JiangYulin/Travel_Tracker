    /**
     * Created by jiangyulin on 14-1-8.
     */

    function showMessage(parameters) {
        var title = parameters.title;
        var msg = parameters.msg;
        var ms = parameters.ms;
        /*信息区域的布局
        div(id=notification
            h5(id=noti-title)
            p(id=noti-content)
         */
        $("#noti-title").text(title);
        $("#noti-content").text(msg);
        $("#notification").css("display","block");
        $("#notification").animate({
            opacity:1
        }, {
                duration:500,
                complete: setTimeout(function(){
                    $("#notification").animate({
                        opacity:0
                    }, {
                        duration: 500,
                        complete:function(){
                            $("#notification").css("display","none");
                            $("#noti-content").text("");
                            $("#noti-title").text("");
                        }
                    })
                }, ms)
            }
        );
    }

    //令href类元素，点击后跳转到本身的href元素制定的位置
    //<input href="google.com" class="href" />
    //跳转到google.com
    function btn_href() {
        //遍历href类，找到带有链接的button标签。
        var ele = document.getElementsByClassName("href");
        if(ele.length>0) {
            for(var i = 0;i<ele.length;i++)
            {
                ele[i].onclick = function(){load_page(this.getAttribute("href"),function(response,href){
                    var inactive = document.createElement("div");
                    inactive.innerHTML = response;//插入页面内容
                    inactive.setAttribute("id","inactive");
                    inactive.setAttribute("class","inactive");

                    document.getElementsByClassName("page")[0].appendChild(inactive);
                    inactive = $("#inactive");
                    /*
                    进行inactive元素的渐入效果

                     */

                    $("#inactive").css({
                        "display":"block"
                    });
                    inactive.css({
                        "left":"50%", //下面变换left时，需要参考此处
                        "opacity": "0"
                    })
                    inactive.removeClass("inactive");
                    inactive.addClass("main");
                    inactive.animate({
                        "opacity":1
                    }, {
                        duration: 500,
                        step:function(now,mx){
                            console.log("now :"+now); //now是opacity现在的值，由0到1
                            $("#active").css("opacity",1-now);
                            $("#active").css("transform","scale("+(1-now)+")");
                            $(this).css("left",(1-now)*50+"%");
                        },
                        complete: function() {
                            /*
                            修改id和类
                            另在上面的为active，
                            隐藏的为inactive
                             */
                            $(this).addClass("active");
                            $(this).removeClass("inactive");
                            $(this).attr("id","next_active");
                            $("#active").attr("style","");
                            $("#active").removeClass("active");
                            $("#active").addClass("inactive");
                            //清除动画中使用的css参数
                            $("#active").attr("style","");

                            histories.push($("#active"));
                            console.log($("#active"));
                            /*
                            我也不知道为什么要在$("#active")后面加0
                             */
                            $(".page")[0].removeChild($("#active")[0]);
                            histories[histories.length-1].attr("id","");
                            console.log("run");
                            $("#next_active").attr("id","active");
                            /*这里要加载js文件，
                             如果加载的页面为 page，
                             那么加载的js文件应该名为 page.js
                             并且在“/javascripts”目录下。
                             注意*
                             在layout模板中，用于临时加载js文件的element的id是:"temp_js"
                             */
                            if(href)
                            {
                                var js = document.createElement("script");
                                js.setAttribute("src","/javascripts/"+href+".js");
                                js.setAttribute("type","text/javascript");
                                var head = document.getElementsByTagName("head")[0];
                                if(document.getElementById("temp_js")){
                                    head.removeChild(document.getElementById("temp_js"));
                                }
                                js.setAttribute("id","temp_js");
                                head.appendChild(js);
                            }
                        }
                    })

                })}
            }
        }
    }


    var xmlhttp_load_page = false;
    //加载远端的网页资料，并把返回的信息传送给callback函数，
    //连同远端加载的url一并传送过来，为的是callback中加载js
    function load_page(url,callback) {
        xmlhttp_load_page = new XMLHttpRequest();
        xmlhttp_load_page.onreadystatechange = function() {
            if(xmlhttp_load_page.readyState == 4 && xmlhttp_load_page.status == 200 ) {
                console.log(xmlhttp_load_page.responseText);
                var response = xmlhttp_load_page.responseText;
                setTimeout(callback(response,url),0);
            }
            if(xmlhttp_load_page.readyState == 4 && xmlhttp_load_page.status == 404 ) {
                var err = "页面未找到";
                setTimeout(callback(err),0);
            }
        }
        xmlhttp_load_page.open("GET", url, true);
        xmlhttp_load_page.send();
    }

/*
下面是关于后退操作的函数
利用一个数组来提供历史记录
数组有一个pop函数，你懂的
 */

    var histories = new Array();
    function go_back(){
        var container = document.getElementsByClassName("page")[0];
        container.appendChild(histories.pop()[0]);
        console.log(container);
        $(".inactive").last().attr("id","slide_element");
        $("#slide_element").removeClass("inactive");
        var inactive = $("#slide_element");

        inactive.css("display","block");
        inactive.css({
            "transform":"scale(0)",
            "opacity": "0"
        })
        inactive.addClass("active");
        inactive.animate({
            "opacity":1
        }, {
            duration: 500,
            step:function(now,mx){
                console.log("now :"+now); //now是opacity现在的值，由0到1
                $("#active").css("opacity",1-now);
                $(this).css("transform","scale("+now+")");
                $("#active").css("left",(now)*50+"%");
            },
            complete: function() {
                /*
                 修改id和类
                 另在上面的为active，
                 隐藏的为inactive
                 */
                $(this).addClass("active");
                $(this).attr("id","next_active");
                document.getElementsByClassName("page")[0].removeChild(document.getElementById("active"));
                $("#next_active").attr("id","active");
                //清除动画中使用的css参数
                $("#active").attr("style","");
            }
        })
    }


    /*!
     * Joseph Myer's md5() algorithm wrapped in a self-invoked function to prevent
     * global namespace polution, modified to hash unicode characters as UTF-8.
     *
     * Copyright 1999-2010, Joseph Myers, Paul Johnston, Greg Holt, Will Bond <will@wbond.net>
     * http://www.myersdaily.org/joseph/javascript/md5-text.html
     * http://pajhome.org.uk/crypt/md5
     *
     * Released under the BSD license
     * http://www.opensource.org/licenses/bsd-license
     */
    (function() {
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }

        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function md51(s) {
            // Converts the string to UTF-8 "bytes" when necessary
            if (/[\x80-\xFF]/.test(s)) {
                s = unescape(encodeURI(s));
            }
            txt = '';
            var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++)
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        function md5blk(s) { /* I figured global was faster.   */
            var md5blks = [], i; /* Andy King said do it this way. */
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) +
                    (s.charCodeAt(i + 1) << 8) +
                    (s.charCodeAt(i + 2) << 16) +
                    (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        var hex_chr = '0123456789abcdef'.split('');

        function rhex(n) {
            var s = '', j = 0;
            for (; j < 4; j++)
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                    hex_chr[(n >> (j * 8)) & 0x0F];
            return s;
        }

        function hex(x) {
            for (var i = 0; i < x.length; i++)
                x[i] = rhex(x[i]);
            return x.join('');
        }

        md5 = function (s) {
            return hex(md51(s));
        }

        /* this function is much faster, so if possible we use it. Some IEs are the
         only ones I know of that need the idiotic second function, generated by an
         if clause.  */
        function add32(a, b) {
            return (a + b) & 0xFFFFFFFF;
        }

        if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
            function add32(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }
        }
    })();




/*
登陆界面
触摸滑动后退

    window.onload = function() {
    var touchesStartPosition;
    var touchesEndPosition;
    var page = document.getElementsByClassName("page")[0];
    page.addEventListener('touchstart', function(e) {
        touchesStartPosition = e.changedTouches;

    },false);
    page.addEventListener('touchend', function(e) {
            touchesEndPosition = e.changedTouches;
        console.log(touchesStartPosition[0].pageX+" "+touchesEndPosition[0].pageX);
        if((touchesEndPosition[0].pageX-touchesStartPosition[0].pageX)>150){
            go_back();
        }
        },false);
}
*/


