/** ***** BEGIN LICENSE BLOCK *****
 * |------------------------------------------------------------------------------|
 * | O2OA 活力办公 创意无限    o2.js                                                 |
 * |------------------------------------------------------------------------------|
 * | Distributed under the AGPL license:                                          |
 * |------------------------------------------------------------------------------|
 * | Copyright © 2018, o2oa.net, o2server.io O2 Team                              |
 * | All rights reserved.                                                         |
 * |------------------------------------------------------------------------------|
 *
 *  This file is part of O2OA.
 *
 *  O2OA is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  O2OA is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ***** END LICENSE BLOCK ******/


/* load o2 Core
 * |------------------------------------------------------------------------------|
 * |addReady:     o2.addReady(fn),                                                |
 * |------------------------------------------------------------------------------|
 * |load:         o2.load(urls, callback, reload)                                 |
 * |loadCss:      o2.loadCss(urls, dom, callback, reload, doc)                    |
 * |------------------------------------------------------------------------------|
 * |typeOf:       o2.typeOf(o)                                                    |
 * |------------------------------------------------------------------------------|
 * |uuid:         o2.uuid()                                                       |
 * |------------------------------------------------------------------------------|
 */
//Element.firstElementChild Polyfill
(function(constructor) {
    if (constructor &&
        constructor.prototype &&
        constructor.prototype.firstElementChild == null) {
        Object.defineProperty(constructor.prototype, 'firstElementChild', {
            get: function() {
                var node, nodes = this.childNodes, i = 0;
                while (node = nodes[i++]) {
                    if (node.nodeType === 1) {
                        return node;
                    }
                }
                return null;
            }
        });
    }
})(window.Node || window.Element);

(function(){
    var _href = window.location.href;
    var _debug = (_href.indexOf("debugger")!==-1);
    var _par = _href.substr(_href.lastIndexOf("?")+1, _href.length);
    var _lp = "zh-cn";
    if (_par){
        var _parList = _par.split("&");
        for (var i=0; i<_parList.length; i++){
            var _v = _parList[i];
            var _kv = _v.split("=");
            if (_kv[0].toLowerCase()==="lg") _lp = _kv[1];
            if (_kv[0].toLowerCase()==="lp") _lp = _kv[1];
        }
    }
    this.o2 = window.o2 || {};
    this.o2.version = {
        "v": "5.1.1",
        "build": "2020.06.12",
        "info": "O2OA 活力办公 创意无限. Copyright © 2020, o2oa.net O2 Team All rights reserved."
    };
    if (!this.o2.session) this.o2.session ={
        "isDebugger": _debug,
        "path": "../o2_core/o2"
    };
    this.o2.language = _lp;
    this.o2.splitStr = /\s*(?:,|;)\s*/;

    //     this.o2 = {
    //     "version": {
    //         "v": "2.3.1",
    //         "build": "2019.07.31",
    //         "info": "O2OA 活力办公 创意无限. Copyright © 2018, o2oa.net O2 Team All rights reserved."
    //     },
    //     "session": {
    //         "isDebugger": _debug,
    //         "path": "../o2_core/o2"
    //     },
    //     "language": _lp,
    //     "splitStr": /\s*(?:,|;)\s*/
    // };

    this.wrdp = this.o2;

    var debug = function(reload){
        if (reload){
            window.location.assign(_href + ((_href.indexOf("?")==-1) ? "?" : "&")+"debugger");
        }else{
            if (!o2.session.isDebugger){
                o2.session.isDebugger = true;
                if (o2.session.isMobile || layout.mobile) o2.load("../o2_lib/eruda/eruda.js");
            }
        }
    };
    this.o2.debug = debug;

    var _attempt = function(){
        for (var i = 0, l = arguments.length; i < l; i++){
            try {
                arguments[i]();
                return arguments[i];
            } catch (e){}
        }
        return null;
    };
    var _typeOf = function(item){
        if (item == null) return 'null';
        if (item.$family != null) return item.$family();
        if (item.constructor == window.Array) return "array";

        if (item.nodeName){
            if (item.nodeType == 1) return 'element';
            if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
        } else if (typeof item.length == 'number'){
            if (item.callee) return 'arguments';
        }
        return typeof item;
    };
    this.o2.typeOf = _typeOf;

    var _addListener = function(dom, type, fn){
        if (type == 'unload'){
            var old = fn, self = this;
            fn = function(){
                _removeListener(dom, 'unload', fn);
                old();
            };
        }
        if (dom.addEventListener) dom.addEventListener(type, fn, !!arguments[2]);
        else dom.attachEvent('on' + type, fn);
    };
    var _removeListener = function(dom, type, fn){
        if (dom.removeEventListener) dom.removeEventListener(type, fn, !!arguments[2]);
        else dom.detachEvent('on' + type, fn);
    };

    //http request class
    var _request = (function(){
        var XMLHTTP = function(){ return new XMLHttpRequest(); };
        var MSXML2 = function(){ return new ActiveXObject('MSXML2.XMLHTTP'); };
        var MSXML = function(){ return new ActiveXObject('Microsoft.XMLHTTP'); };
        return _attempt(XMLHTTP, MSXML2, MSXML);
    })();
    this.o2.request = _request;

    var _returnBase = function(number, base) {
        return (number).toString(base).toUpperCase();
    };
    var _getIntegerBits = function(val, start, end){
        var base16 = _returnBase(val, 16);
        var quadArray = new Array();
        var quadString = '';
        var i = 0;
        for (i = 0; i < base16.length; i++) {
            quadArray.push(base16.substring(i, i + 1));
        }
        for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
            if (!quadArray[i] || quadArray[i] == '')
                quadString += '0';
            else
                quadString += quadArray[i];
        }
        return quadString;
    };
    var _rand = function(max) {
        return Math.floor(Math.random() * (max + 1));
    };
    this.o2.addListener = _addListener;
    this.o2.removeListener = _removeListener;

    //uuid
    var _uuid = function(){
        var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
        var dc = new Date();
        var t = dc.getTime() - dg.getTime();
        var tl = _getIntegerBits(t, 0, 31);
        var tm = _getIntegerBits(t, 32, 47);
        var thv = _getIntegerBits(t, 48, 59) + '1';
        var csar = _getIntegerBits(_rand(4095), 0, 7);
        var csl = _getIntegerBits(_rand(4095), 0, 7);

        var n = _getIntegerBits(_rand(8191), 0, 7)
            + _getIntegerBits(_rand(8191), 8, 15)
            + _getIntegerBits(_rand(8191), 0, 7)
            + _getIntegerBits(_rand(8191), 8, 15)
            + _getIntegerBits(_rand(8191), 0, 15);
        return tl + tm + thv + csar + csl + n;
    };
    this.o2.uuid = _uuid;


    var _runCallback = function(callback, key, par){
        if (typeOf(callback).toLowerCase() === 'function'){
            if (key.toLowerCase()==="success") callback.apply(callback, par);
        }else{
            if (typeOf(callback).toLowerCase()==='object'){
                var name = ("on-"+key).camelCase();
                if (callback[name]) callback[name].apply(callback, par);
            }
        }
    };
    this.o2.runCallback = _runCallback;


    //load js, css, html adn all.
    var _getAllOptions = function(options){
        var doc = (options && options.doc) || document;
        if (!doc.unid) doc.unid = _uuid();
        var type = (options && options.type) || "text/javascript";
        return {
            "noCache": !!(options && options.nocache),
            "reload": !!(options && options.reload),
            "sequence": !!(options && options.sequence),
            "type": type,
            "doc": doc,
            "dom": (options && options.dom) || document.body,
            "module": (options && options.module) || null,
            "noConflict": (options && options.noConflict) || false,
            "bind": (options && options.bind) || null,
            "position": (options && options.position) || "beforeend" //'beforebegin' 'afterbegin' 'beforeend' 'afterend'debugger
        }
    };
    var _getCssOptions = function(options){
        var doc = (options && options.doc) || document;
        if (!doc.unid) doc.unid = _uuid();
        return {
            "noCache": !!(options && options.nocache),
            "reload": !!(options && options.reload),
            "sequence": !!(options && options.sequence),
            "doc": doc,
            "dom": (options && options.dom) || null
        }
    };
    var _getJsOptions = function(options){
        var doc = (options && options.doc) || document;
        if (!doc.unid) doc.unid = _uuid();
        var type = (options && options.type) || "text/javascript";
        return {
            "noCache": !!(options && options.nocache),
            "reload": !!(options && options.reload),
            "sequence": (!(options && options.sequence == false)),
            "type": type,
            "doc": doc
        }
    };
    var _getHtmlOptions = function(options){
        var doc = (options && options.doc) || document;
        if (!doc.unid) doc.unid = _uuid();
        return {
            "noCache": !!(options && options.nocache),
            "reload": !!(options && options.reload),
            "sequence": !!(options && options.sequence),
            "doc": doc,
            "dom": (options && options.dom) || null,
            "module": (options && options.module) || null,
            "noConflict": (options && options.noConflict) || false,
            "bind": (options && options.bind) || null,
            "position": (options && options.position) || "beforeend" //'beforebegin' 'afterbegin' 'beforeend' 'afterend'
        }
    };
    _filterUrl = function(url){
        if (o2.base){
            if (url.indexOf(":")===-1){
                var s = url.substring(0, url.indexOf("/")+1);
                var r = url.substring(url.indexOf("/")+1, url.length);
                if ("../"===s || "./"===s || "/"===s){
                    return s+o2.base+r;
                }else{
                    return o2.base+url
                }
            }
        }

        // if (!window.layout) window.layout = {};
        // if (!window.layout.config){
        //     new Request.JSON({
        //         url: "../x_desktop/res/config/config.json",
        //         secure: false,
        //         method: "get",
        //         noCache: true,
        //         async: false,
        //         onSuccess: function(responseJSON, responseText){
        //             window.layout.config = responseJSON;
        //         }.bind(this),
        //     }).send();
        // }

        if (window.layout && layout.config && layout.config.urlMapping){
            for (var k in layout.config.urlMapping){
                var regex = new RegExp(k);
                if (regex.test(url)){
                    return url.replace(regex, layout.config.urlMapping[k]);
                }
            }
        }

        return url;
    };
    this.o2.filterUrl = _filterUrl;
    var _xhr_get = function(url, success, failure, completed){
        var xhr = new _request();
        url = _filterUrl(url);
        xhr.open("GET", url, true);

        var _checkCssLoaded= function(_, err){
            if (!(xhr.readyState == 4)) return;
            if (err){
                if (completed) completed(xhr);
                return;
            }

            _removeListener(xhr, 'readystatechange', _checkCssLoaded);
            _removeListener(xhr, 'load', _checkCssLoaded);
            _removeListener(xhr, 'error', _checkCssErrorLoaded);

            if (err) {if (failure) failure(xhr); return}
            var status = xhr.status;
            status = (status == 1223) ? 204 : status;
            if ((status >= 200 && status < 300))
                if (success) success(xhr);
                else if ((status >= 300 && status < 400))
                    if (failure) failure(xhr);
                    else
                        failure(xhr);
            if (completed) completed(xhr);
        };
        var _checkCssErrorLoaded= function(err){ _checkCssLoaded(err) };

        if ("load" in xhr) _addListener(xhr, "load", _checkCssLoaded);
        if ("error" in xhr) _addListener(xhr, "load", _checkCssErrorLoaded);
        _addListener(xhr, "readystatechange", _checkCssLoaded);
        xhr.send();
    };
    this.o2.xhr_get = _xhr_get;
    var _loadSequence = function(ms, cb, op, n, thisLoaded, loadSingle, uuid, fun){
        loadSingle(ms[n], function(module){
            if (module) thisLoaded.push(module);
            n++;
            if (fun) fun(module);
            if (n===ms.length){
                if (cb) cb(thisLoaded);
            }else{
                _loadSequence(ms, cb, op, n, thisLoaded, loadSingle, uuid, fun);
            }
        }, op, uuid);
    };
    var _loadDisarray = function(ms, cb, op, thisLoaded, loadSingle, uuid, fun){
        var count=0;
        for (var i=0; i<ms.length; i++){
            loadSingle(ms[i], function(module){
                if (module) thisLoaded.push(module);
                count++;
                if (fun) fun(module);
                if (count===ms.length) if (cb) cb(thisLoaded);
            }, op, uuid);
        }
    };

    //load js
    //use framework url
    var _frameworks = {
        "o2.core": ["../o2_core/o2/o2.core.js"],
        "o2.more": ["../o2_core/o2/o2.more.js"],
        "ie_adapter": ["../o2_core/o2/ie_adapter.js"],
        "jquery": ["../o2_lib/jquery/jquery.min.js"],
        "mootools": ["../o2_lib/mootools/mootools-1.6.0_all.js"],
        "ckeditor": ["../o2_lib/htmleditor/ckeditor4114/ckeditor.js"],
        "ckeditor5": ["../o2_lib/htmleditor/ckeditor5-12-1-0/ckeditor.js"],
        "raphael": ["../o2_lib/raphael/raphael.js"],
        "d3": ["../o2_lib/d3/d3.min.js"],
        "ace": ["../o2_lib/ace/src-min-noconflict/ace.js","../o2_lib/ace/src-min-noconflict/ext-language_tools.js"],
        "monaco": ["../o2_lib/vs/loader.js"],
        "JSBeautifier": ["../o2_lib/JSBeautifier/beautify.js"],
        "JSBeautifier_css": ["../o2_lib/JSBeautifier/beautify-css.js"],
        "JSBeautifier_html": ["../o2_lib/JSBeautifier/beautify-html.js"],
        "JSONTemplate": ["../o2_lib/mootools/plugin/Template.js"],
        "kity": ["../o2_lib/kityminder/kity/kity.js"],
        "kityminder": ["../o2_lib/kityminder/core/dist/kityminder.core.js"]
    };
    var _loaded = {};
    var _loadedCss = {};
    var _loadedHtml = {};
    var _loadCssRunning = {};
    var _loadCssQueue = [];
    var _loadingModules = {};

    var _loadSingle = function(module, callback, op){
        var url = module;
        var uuid = _uuid();
        if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uuid : addr_uri+"?v="+uuid;
        var key = encodeURIComponent(url+op.doc.unid);
        if (!op.reload) if (_loaded[key]){
            if (callback)callback(); return;
        }

        if (_loadingModules[key]){
            if (!_loadingModules[key].callbacks) _loadingModules[key].callbacks = [];
            _loadingModules[key].callbacks.push(callback);
        }else{
            _loadingModules[key] = { callbacks: [callback] };

            var head = (op.doc.head || op.doc.getElementsByTagName("head")[0] || op.doc.documentElement);
            var s = op.doc.createElement('script');
            s.type = op.type || "text/javascript";
            head.appendChild(s);
            s.id = uuid;
            s.src = this.o2.filterUrl(url);

            var _checkScriptLoaded = function(_, isAbort, err){
                if (isAbort || !s.readyState || s.readyState === "loaded" || s.readyState === "complete") {
                    var scriptObj = {"module": module, "id": uuid, "script": s, "doc": op.doc};
                    if (!err) _loaded[key] = scriptObj;
                    _removeListener(s, 'readystatechange', _checkScriptLoaded);
                    _removeListener(s, 'load', _checkScriptLoaded);
                    _removeListener(s, 'error', _checkScriptErrorLoaded);
                    if (!isAbort || err){
                        if (err){
                            if (s) head.removeChild(s);
                            while (_loadingModules[key].callbacks.length){
                                (_loadingModules[key].callbacks.shift())();
                            }
                            //if (callback)callback();
                        }else{
                            //head.removeChild(s);
                            while (_loadingModules[key].callbacks.length){
                                (_loadingModules[key].callbacks.shift())(scriptObj);
                            }
                            //if (callback)callback(scriptObj);
                        }
                    }
                }
            };
            var _checkScriptErrorLoaded = function(e, err){
                console.log("Error: load javascript module: "+module);
                _checkScriptLoaded(e, true, "error");
            };

            if ('onreadystatechange' in s) _addListener(s, 'readystatechange', _checkScriptLoaded);
            _addListener(s, 'load', _checkScriptLoaded);
            _addListener(s, 'error', _checkScriptErrorLoaded);
        }
    };

    var _load = function(urls, options, callback){
        var ms = (_typeOf(urls)==="array") ? urls : [urls];
        var op =  (_typeOf(options)==="object") ? _getJsOptions(options) : _getJsOptions(null);
        var cbk = (_typeOf(options)==="function") ? options : callback;

        var cb = cbk;
        if (typeof define === 'function' && define.amd){
            define.amd = false;
            cb = (cbk) ? function(){define.amd = true; cbk();} : function(){define.amd = true;}
        }

        var modules = [];
        for (var i=0; i<ms.length; i++){
            var url = ms[i];
            var module = _frameworks[url] || url;
            if (_typeOf(module)==="array"){
                modules = modules.concat(module)
            }else{
                modules.push(module)
            }
        }
        var thisLoaded = [];
        if (op.sequence){
            _loadSequence(modules, cb, op, 0, thisLoaded, _loadSingle);
        }else{
            _loadDisarray(modules, cb, op, thisLoaded, _loadSingle);
        }
    };
    this.o2.load = _load;

    //load css
    var _loadSingleCss = function(module, callback, op, uuid){
        var url = module;
        var uid = _uuid();
        if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uid : url+"?v="+uid;

        var key = encodeURIComponent(url+op.doc.unid);
        if (_loadCssRunning[key]){
            _loadCssQueue.push(function(){
                _loadSingleCss(module, callback, op, uuid);
            });
            return;
        }

        if (_loadedCss[key]) uuid = _loadedCss[key]["class"];
        if (op.dom) _parseDom(op.dom, function(node){ if (node.className.indexOf(uuid) == -1) node.className += ((node.className) ? " "+uuid : uuid);}, op.doc);

        var completed = function(){
            if (_loadCssRunning[key]){
                _loadCssRunning[key] = false;
                delete _loadCssRunning[key];
            }
            if (_loadCssQueue && _loadCssQueue.length){
                (_loadCssQueue.shift())();
            }
        };

        if (_loadedCss[key])if (!op.reload){
            if (callback)callback(_loadedCss[key]);
            completed();
            return;
        }

        var success = function(xhr){
            var cssText = xhr.responseText;
            try{
                if (cssText){
                    cssText = cssText.replace(/\/\*(\s|\S)*?\*\//g, "");
                    if (op.bind) cssText = cssText.bindJson(op.bind);
                    if (op.dom){

                        var rex = new RegExp("(.+)(?=\\{)", "g");
                        var match;
                        var prefix = "." + uuid + " ";
                        while ((match = rex.exec(cssText)) !== null) {
                            // var rule = prefix + match[0];
                            // cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                            // rex.lastIndex = rex.lastIndex + prefix.length;

                            var rulesStr = match[0];
                            if (rulesStr.substr(0,1)=="@" || rulesStr.indexOf("%")!=-1){
                                // var begin = 0;
                                // var end = 0;


                            }else{
                                if (rulesStr.indexOf(",")!=-1){
                                    var rules = rulesStr.split(/\s*,\s*/g);
                                    rules = rules.map(function(r){
                                        return prefix + r;
                                    });
                                    var rule = rules.join(", ");
                                    cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                                    rex.lastIndex = rex.lastIndex + (prefix.length*rules.length);

                                }else{
                                    var rule = prefix + match[0];
                                    cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                                    rex.lastIndex = rex.lastIndex + prefix.length;
                                }
                            }
                        }
                    }
                    var style = op.doc.createElement("style");
                    style.setAttribute("type", "text/css");
                    var head = (op.doc.head || op.doc.getElementsByTagName("head")[0] || op.doc.documentElement);
                    head.appendChild(style);
                    if(style.styleSheet){
                        var setFunc = function(){
                            style.styleSheet.cssText = cssText;
                        };
                        if(style.styleSheet.disabled){
                            setTimeout(setFunc, 10);
                        }else{
                            setFunc();
                        }
                    }else{
                        var cssTextNode = op.doc.createTextNode(cssText);
                        style.appendChild(cssTextNode);
                    }
                }
                style.id = uid;
                var styleObj = {"module": module, "id": uid, "style": style, "doc": op.doc, "class": uuid};
                _loadedCss[key] = styleObj;
                if (callback) callback(styleObj);
            }catch (e){
                if (callback) callback();
                return;
            }
        };
        var failure = function(xhr){
            console.log("Error: load css module: "+module);
            if (callback) callback();
        };

        _loadCssRunning[key] = true;

        _xhr_get(url, success, failure, completed);
    };

    var _parseDomString = function(dom, fn, sourceDoc){
        var doc = sourceDoc || document;
        var list = doc.querySelectorAll(dom);
        if (list.length) for (var i=0; i<list.length; i++) _parseDomElement(list[i], fn);
    };
    var _parseDomElement = function(dom, fn){
        if (fn) fn(dom);
    };
    var _parseDom = function(dom, fn, sourceDoc){
        var domType = _typeOf(dom);
        if (domType==="string") _parseDomString(dom, fn, sourceDoc);
        if (domType==="element") _parseDomElement(dom, fn);
        if (domType==="array") for (var i=0; i<dom.length; i++) _parseDom(dom[i], fn, sourceDoc);
    };
    var _loadCss = function(modules, options, callback){
        var ms = (_typeOf(modules)==="array") ? modules : [modules];
        var op =  (_typeOf(options)==="object") ? _getCssOptions(options) : _getCssOptions(null);
        var cb = (_typeOf(options)==="function") ? options : callback;

        var uuid = "css"+_uuid();
        var thisLoaded = [];
        if (op.sequence){
            _loadSequence(ms, cb, op, 0, thisLoaded, _loadSingleCss, uuid);
        }else{
            _loadDisarray(ms, cb, op, thisLoaded, _loadSingleCss, uuid);
        }
    };
    var _removeCss = function(modules, doc){
        var thisDoc = doc || document;
        var ms = (_typeOf(modules)==="array") ? modules : [modules];
        for (var i=0; i<ms.length; i++){
            var module = ms[i];

            var k = encodeURIComponent(module+(thisDoc.unid||""));
            var removeCss = _loadedCss[k];
            if (!removeCss) for (key in _loadedCss){
                if (_loadedCss[key].id==module){
                    removeCss = _loadedCss[key];
                    k = key;
                    break;
                }
            }
            if (removeCss){
                delete _loadedCss[k];
                var styleNode = removeCss.doc.getElementById(removeCss.id);
                if (styleNode) styleNode.parentNode.removeChild(styleNode);
                removeCss = null;
            }
        }
    };
    this.o2.loadCss = _loadCss;
    this.o2.removeCss = _removeCss;
    if (window.Element) Element.prototype.loadCss = function(modules, options, callback){
        var op =  (_typeOf(options)==="object") ? options : {};
        var cb = (_typeOf(options)==="function") ? options : callback;
        op.dom = this;
        _loadCss(modules, op, cb);
    };

    //load html
    _loadSingleHtml = function(module, callback, op){
        var url = module;
        var uid = _uuid();
        if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uid : url+"?v="+uid;
        var key = encodeURIComponent(url+op.doc.unid);
        if (!op.reload) if (_loadedHtml[key]){ if (callback)callback(_loadedHtml[key]); return; }

        var success = function(xhr){
            var htmlObj = {"module": module, "id": uid, "data": xhr.responseText, "doc": op.doc};
            _loadedHtml[key] = htmlObj;
            if (callback) callback(htmlObj);
        };
        var failure = function(){
            console.log("Error: load html module: "+module);
            if (callback) callback();
        };
        _xhr_get(url, success, failure);
    };

    var _injectHtml = function(op, data){
        if (op.bind) data = data.bindJson(op.bind);
        if (op.dom) _parseDom(op.dom, function(node){
            if (op.module){
                _parseModule(node, data, op);
                //node.insertAdjacentHTML(op.position, data);
            }else{
                node.insertAdjacentHTML(op.position, data);
            }
        }, op.doc);
    };
    var _parseModule = function(node, data, op){
        var dom = op.noConflict ? document.createElement("div") : node;
        if (op.noConflict){
            dom.insertAdjacentHTML("afterbegin", data);
        }else{
            dom.insertAdjacentHTML(op.position, data);
        }
        var els = dom.querySelectorAll("[data-o2-element]");
        for (var i=0; i<els.length; i++){
            var el = els.item(i);
            var name = el.getAttribute("data-o2-element").toString();
            if (name) _bindToModule(op.module, el, name);
            if (el.hasAttribute("data-o2-events")){
                var events = el.getAttribute("data-o2-events").toString();
                if (events) _bindToEvents(op.module, el, events);
            }
        }

        if (op.noConflict){
            var n = dom.firstElementChild;
            var newNode = node.insertAdjacentElement(op.position, n);
            nextNode = dom.firstElementChild;
            while (nextNode) {
                newNode = newNode.insertAdjacentElement("afterend", nextNode);
                nextNode = dom.firstElementChild;
            }
            dom.destroy();
        }
    };

    var _bindToEvents = function(m, node, events){
        var eventList = events.split(/\s*;\s*/);
        eventList.forEach(function(ev){
            var evs = ev.split(/\s*:\s*/);
            if (evs.length>1){
                node.addEventListener(evs[0], function(e){
                    if (m[evs[1]]) m[evs[1]].apply(m, [e]);
                }, false);
            }
        });
    }
    var _bindToModule = function(m, node, name){
        // if (m[name]){
        //     if (o2.typeOf(m[name])!=="array"){
        //         var tmp = m[name];
        //         m[name] = [];
        //         m[name].push(tmp);
        //     }
        //     m[name].push(node);
        // }else{
        m[name] = node;
        // }
    };
    var _loadHtml = function(modules, options, callback){
        var ms = (_typeOf(modules)==="array") ? modules : [modules];
        var op =  (_typeOf(options)==="object") ? _getHtmlOptions(options) : _getHtmlOptions(null);
        var cb = (_typeOf(options)==="function") ? options : callback;

        var thisLoaded = [];
        if (op.sequence){
            _loadSequence(ms, cb, op, 0, thisLoaded, _loadSingleHtml, null, function(html){ if (html) _injectHtml(op, html.data ); });
        }else{
            _loadDisarray(ms, cb, op, thisLoaded, _loadSingleHtml, null, function(html){ if (html) _injectHtml(op, html.data ); });
        }
    };
    this.o2.loadHtml = _loadHtml;
    if (window.Element) Element.prototype.loadHtml = function(modules, options, callback){
        var op =  (_typeOf(options)==="object") ? options : {};
        var cb = (_typeOf(options)==="function") ? options : callback;
        op.dom = this;
        _loadHtml(modules, op, cb);
    };
    this.o2.injectHtml = function(html, op){
        _injectHtml(op, html);
    };
    if (window.Element) Element.prototype.injectHtml = function(html, options){
        var op =  (_typeOf(options)==="object") ? options : {};
        op.dom = this;
        op.position = (options && options.position) || "beforeend"
        _injectHtml(op, html);
    };

    //load all
    _loadAll = function(modules, options, callback){
        //var ms = (_typeOf(modules)==="array") ? modules : [modules];
        var op =  (_typeOf(options)==="object") ? _getAllOptions(options) : _getAllOptions(null);
        var cb = (_typeOf(options)==="function") ? options : callback;

        var ms, htmls, styles, sctipts;
        var _htmlLoaded=(!modules.html), _cssLoaded=(!modules.css), _jsLoaded=(!modules.js);
        var _checkloaded = function(){
            if (_htmlLoaded && _cssLoaded && _jsLoaded) if (cb) cb(htmls, styles, sctipts);
        };
        if (modules.html){
            _loadHtml(modules.html, op, function(h){
                htmls = h;
                _htmlLoaded = true;
                _checkloaded();
            });
        }
        if (modules.css){
            _loadCss(modules.css, op, function(s){
                styles = s;
                _cssLoaded = true;
                _checkloaded();
            });
        }
        if (modules.js){
            _load(modules.js, op, function(s){
                sctipts = s;
                _jsLoaded = true;
                _checkloaded();
            });
        }
    };
    this.o2.loadAll = _loadAll;
    if (window.Element) Element.prototype.loadAll = function(modules, options, callback){
        var op =  (_typeOf(options)==="object") ? options : {};
        var cb = (_typeOf(options)==="function") ? options : callback;
        op.dom = this;
        _loadAll(modules, op, cb);
    };

    var _getIfBlockEnd = function(v){
        var rex = /(\{\{if\s+)|(\{\{\s*end if\s*\}\})/gmi;
        var rexEnd = /\{\{\s*end if\s*\}\}/gmi;
        var subs = 1;
        while ((match = rex.exec(v)) !== null) {
            var fullMatch = match[0];
            if (fullMatch.search(rexEnd)!==-1){
                subs--;
                if (subs==0) break;
            }else{
                subs++
            }
        }
        if (match) return {"codeIndex": match.index, "lastIndex": rex.lastIndex};
        return {"codeIndex": v.length-1, "lastIndex": v.length-1};
    }
    var _getEachBlockEnd = function(v){
        var rex = /(\{\{each\s+)|(\{\{\s*end each\s*\}\})/gmi;
        var rexEnd = /\{\{\s*end each\s*\}\}/gmi;
        var subs = 1;
        while ((match = rex.exec(v)) !== null) {
            var fullMatch = match[0];
            if (fullMatch.search(rexEnd)!==-1){
                subs--;
                if (subs==0) break;
            }else{
                subs++;
            }
        }
        if (match) return {"codeIndex": match.index, "lastIndex": rex.lastIndex};
        return {"codeIndex": v.length-1, "lastIndex": v.length-1};
    }

    var _parseHtml = function(str, json){
        var v = str;
        var rex = /(\{\{\s*)[\s\S]*?(\s*\}\})/gmi;

        var match;
        while ((match = rex.exec(v)) !== null) {
            var fullMatch = match[0];
            var offset = 0;

            //if statement begin
            if (fullMatch.search(/\{\{if\s+/i)!==-1){
                //找到对应的end if
                var condition = fullMatch.replace(/^\{\{if\s*/i, "");
                condition = condition.replace(/\s*\}\}$/i, "");
                var flag = _jsonText(json, condition, "boolean");

                var tmpStr = v.substring(rex.lastIndex, v.length);
                var endIfIndex = _getIfBlockEnd(tmpStr);
                if (flag){ //if 为 true
                    var parseStr = _parseHtml(tmpStr.substring(0, endIfIndex.codeIndex), json);
                    var vLeft = v.substring(0, match.index);
                    var vRight = v.substring(rex.lastIndex+endIfIndex.lastIndex, v.length);
                    v = vLeft + parseStr + vRight;
                    offset = parseStr.length - fullMatch.length;
                }else{
                    v = v.substring(0, match.index) + v.substring(rex.lastIndex+endIfIndex.lastIndex, v.length);
                    offset = 0-fullMatch.length;
                }
            }else  if (fullMatch.search(/\{\{each\s+/)!==-1) { //each statement
                var itemString = fullMatch.replace(/^\{\{each\s*/, "");
                itemString = itemString.replace(/\s*\}\}$/, "");
                var eachValue = _jsonText(json, itemString, "object");

                var tmpEachStr = v.substring(rex.lastIndex, v.length);
                var endEachIndex = _getEachBlockEnd(tmpEachStr);

                var parseEachStr = tmpEachStr.substring(0, endEachIndex.codeIndex);
                var eachResult = "";
                if (eachValue && _typeOf(eachValue)==="array"){
                    for (var i=0; i<eachValue.length; i++){
                        eachValue[i]._ = json;
                        eachResult += _parseHtml(parseEachStr, eachValue[i]);
                    }
                    var eLeft = v.substring(0, match.index);
                    var eRight = v.substring(rex.lastIndex+endEachIndex.lastIndex, v.length);
                    v = eLeft + eachResult + eRight;
                    offset = eachResult.length - fullMatch.length;
                }else{
                    v = v.substring(0, match.index) + v.substring(rex.lastIndex+endEachIndex.lastIndex, v.length);
                    offset = 0-fullMatch.length;
                }

            }else{ //text statement
                var text = fullMatch.replace(/^\{\{\s*/, "");
                text = text.replace(/\}\}\s*$/, "");
                var value = _jsonText(json, text);
                offset = value.length-fullMatch.length;
                v = v.substring(0, match.index) + value + v.substring(rex.lastIndex, v.length);
            }
            rex.lastIndex = rex.lastIndex + offset;
        }
        return v;
    };
    var _jsonText = function(json, text, type){
        try {
            var $ = json;
            var f = eval("(function($){\n return "+text+";\n})");
            returnValue = f.apply(json, [$]);
            if (returnValue===undefined) returnValue="";
            if (type==="boolean") return (!!returnValue);
            if (type==="object") return returnValue;
            returnValue = returnValue.toString();
            returnValue = returnValue.replace(/\&/g, "&amp;");
            returnValue = returnValue.replace(/>/g, "&gt;");
            returnValue = returnValue.replace(/</g, "&lt;");
            returnValue = returnValue.replace(/\"/g, "&quot;");
            return returnValue || "";
        }catch(e){
            if (type==="boolean") return false;
            if (type==="object") return null;
            return "";
        }
    };

    o2.bindJson = function(str, json){
        return _parseHtml(str, json);
    };
    String.prototype.bindJson = function(json){
        return _parseHtml(this, json);
    };
})();


/** ***** BEGIN LICENSE BLOCK *****
 * |------------------------------------------------------------------------------|
 * | O2OA 活力办公 创意无限    o2.core.js                                            |
 * |------------------------------------------------------------------------------|
 * | Distributed under the AGPL license:                                          |
 * |------------------------------------------------------------------------------|
 * | Copyright © 2018, o2oa.net, o2server.io O2 Team                              |
 * | All rights reserved.                                                         |
 * |------------------------------------------------------------------------------|
 *
 *  This file is part of O2OA.
 *
 *  O2OA is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  O2OA is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ***** END LICENSE BLOCK ******/
(function (){
    var _Class = {
        create: function(options) {
            var newClass = function() {
                this.initialize.apply(this, arguments);
            };
            _copyPrototype(newClass, options);
            return newClass;
        }
    };
    var _copyPrototype = function (currentNS, props){
        if (!props){return currentNS;}
        if (!currentNS){return currentNS;}
        if ((typeof currentNS).toLowerCase()==="object"){
            for (var prop in props){
                currentNS[prop] = props[prop];
            }
        }
        if ((typeof currentNS).toLowerCase()==="function"){
            for (var propfun in props){
                currentNS.prototype[propfun] = props[propfun];
            }
        }
        return currentNS;
    };

    var _loaded = {};

    var _requireJs = function(url, callback, async, compression, module){
        var key = encodeURIComponent(url);
        if (_loaded[key]){o2.runCallback(callback, "success", [module]); return "";}

        var jsPath = (compression || !this.o2.session.isDebugger) ? url.replace(/\.js/, ".min.js") : url;
        jsPath = (jsPath.indexOf("?")!==-1) ? jsPath+"&v="+this.o2.version.v : jsPath+"?v="+this.o2.version.v;

        var xhr = new Request({
            url: o2.filterUrl(jsPath), async: async, method: "get",
            onSuccess: function(){
                //try{
                _loaded[key] = true;
                o2.runCallback(callback, "success", [module]);
                //}catch (e){
                //    o2.runCallback(callback, "failure", [e]);
                //}
            },
            onFailure: function(r){
                var rex = /lp\/.+\.js/;
                if (rex.test(url)){
                    var zhcnUrl = url.replace(rex, "lp/zh-cn.js");
                    if (zhcnUrl!==url){
                        _requireJs(zhcnUrl, callback, async, compression, module)
                    }else{
                        o2.runCallback(callback, "failure", [r]);
                    }
                }else{
                    o2.runCallback(callback, "failure", [r]);
                }
            }
        });
        xhr.send();
    };
    var _requireSingle = function(module, callback, async, compression){
        if (o2.typeOf(module)==="array"){
            _requireAppSingle(module, callback, async, compression);
        }else{
            module = module.replace("MWF.", "o2.");
            var levels = module.split(".");
            if (levels[levels.length-1]==="*") levels[levels.length-1] = "package";
            levels.shift();
            var o = o2;
            var i = 0;
            while (o && i<levels.length){
                o = o[levels[i]];
                i++
            }
            if (!o){
                var jsPath = this.o2.session.path;
                jsPath +="/"+levels.join("/")+".js";
                var loadAsync = (async!==false);
                _requireJs(jsPath, callback, loadAsync, compression, module);
            }else{
                o2.runCallback(callback, "success", [module]);
            }
        }
    };
    var _requireSequence = function(fun, module, thisLoaded, thisErrorLoaded, callback, async, compression){
        var m = module.shift();
        fun(m, {
            "onSuccess": function(m){
                thisLoaded.push(m);
                o2.runCallback(callback, "every", [m]);
                if (module.length){
                    _requireSequence(fun, module, thisLoaded, thisErrorLoaded, callback, async, compression);
                }else{
                    if (thisErrorLoaded.length){
                        o2.runCallback(callback, "failure", [thisLoaded, thisErrorLoaded]);
                    }else{
                        o2.runCallback(callback, "success", [thisLoaded, thisErrorLoaded]);
                    }
                }
            },
            "onFailure": function(){
                thisErrorLoaded.push(module[i]);
                o2.runCallback(callback, "failure", [thisLoaded, thisErrorLoaded]);
            }
        }, async, compression);
    };
    var _requireDisarray = function(fun, module, thisLoaded, thisErrorLoaded, callback, async, compression){
        for (var i=0; i<module.length; i++){
            fun(module[i], {
                "onSuccess": function(m){
                    thisLoaded.push(m);
                    o2.runCallback(callback, "every", [m]);
                    if ((thisLoaded.length+thisErrorLoaded.length)===module.length){
                        if (thisErrorLoaded.length){
                            o2.runCallback(callback, "failure", [thisLoaded, thisErrorLoaded]);
                        }else{
                            o2.runCallback(callback, "success", [thisLoaded, thisErrorLoaded]);
                        }
                    }
                },
                "onFailure": function(){
                    thisErrorLoaded.push(module[i]);
                    o2.runCallback(callback, "failure", [thisLoaded, thisErrorLoaded]);
                }
            }, async, compression);
        }
    };
    var _require = function(module, callback, async, sequence, compression){
        var type = typeOf(module);
        if (type==="array"){
            var sql = !!sequence;
            var thisLoaded = [];
            var thisErrorLoaded = [];
            if (sql){
                _requireSequence(_requireSingle, module, thisLoaded, thisErrorLoaded, callback, async, compression);

            }else{
                _requireDisarray(_requireSingle, module, thisLoaded, thisErrorLoaded, callback, async, compression);
            }
        }
        if (type==="string"){
            _requireSingle(module, callback, async, compression);
        }
    };

    var _requireAppSingle = function(modules, callback, async, compression){
        var module = modules[0];
        var clazz = modules[1];
        var levels = module.split(".");

        var o = o2.xApplication;
        var i = 0;
        while (o && i<levels.length){
            o = o[levels[i]];
            i++
        }
        if (o) o = o[clazz || "Main"];

        if (!o){
            //levels.shift();
            var root = "x_component_"+levels.join("_");
            var clazzName = clazz || "Main";
            var path = "../"+root+"/"+clazzName.replace(/\./g, "/")+".js";
            var loadAsync = (async!==false);
            _requireJs(path, callback, loadAsync, compression);
        }else{
            o2.runCallback(callback, "success");
        }
    };
    var _requireApp = function(module, clazz, callback, async, sequence, compression){
        var type = typeOf(module);
        if (type==="array"){
            var sql = !!sequence;
            var thisLoaded = [];
            var thisErrorLoaded = [];
            if (sql){
                _requireSequence(_requireAppSingle, module, thisLoaded, thisErrorLoaded, callback, async, compression);

            }else{
                _requireDisarray(_requireAppSingle, module, thisLoaded, thisErrorLoaded, callback, async, compression);
            }
        }
        if (type==="string"){
            var modules = [module, clazz];
            _requireAppSingle(modules, callback, async, compression);
        }
    };

    JSON = window.JSON || {};
    var _json = JSON;
    _json.get = function(url, callback, async, nocache){
        var loadAsync = (async !== false);
        var noJsonCache = (nocache === true);

        url = (url.indexOf("?")!==-1) ? url+"&v="+o2.version.v : url+"?v="+o2.version.v;

        var json = null;
        var res = new Request.JSON({
            url: o2.filterUrl(url),
            secure: false,
            method: "get",
            noCache: noJsonCache,
            async: loadAsync,
            withCredentials: true,
            onSuccess: function(responseJSON, responseText){
                json = responseJSON;
                if (typeOf(callback).toLowerCase() === 'function'){
                    callback(responseJSON, responseText);
                }else{
                    o2.runCallback(callback, "success", [responseJSON, responseText]);
                }
            }.bind(this),
            onFailure: function(xhr){
                o2.runCallback(callback, "requestFailure", [xhr]);
            }.bind(this),
            onError: function(text, error){
                o2.runCallback(callback, "error", [text, error]);
            }.bind(this)
        });
        res.send();
        return json;
    };
    _json.getJsonp = function(url, callback, async, callbackKey){
        var loadAsync = (async !== false);

        var callbackKeyWord = callbackKey || "callback";

        url = (url.indexOf("?")!==-1) ? url+"&v="+o2.version.v : url+"?v="+o2.version.v;
        var res = new Request.JSONP({
            url: o2.filterUrl(url),
            secure: false,
            method: "get",
            noCache: true,
            async: loadAsync,
            callbackKey: callbackKeyWord,
            onSuccess: function(responseJSON, responseText){
                o2.runCallback(callback, "success",[responseJSON, responseText]);
            }.bind(this),
            onFailure: function(xhr){
                o2.runCallback(callback, "requestFailure",[xhr]);
            }.bind(this),
            onError: function(text, error){
                o2.runCallback(callback, "error",[text, error]);
            }.bind(this)
        });
        res.send();
    };


    var _loadLP = function(name){
        var jsPath = o2.session.path;
        jsPath = jsPath+"/lp/"+name+".js";
        var r = new Request({
            url: o2.filterUrl(jsPath),
            async: false,
            method: "get",
            onSuccess: function(responseText){
                try{
                    Browser.exec(responseText);
                }catch (e){}
            },
            onFailure: function(xhr){
                if (name!="zh-cn"){
                    _loadLP("zh-cn");
                }else{
                    throw "loadLP Error: "+xhr.responseText;
                }
            }
        });
        r.send();
    };

    var _cacheUrls = [
        /jaxrs\/form\/workorworkcompleted\/.+/ig,
        //    /jaxrs\/script/ig,
        /jaxrs\/script\/.+\/app\/.+\/imported/ig,
        /jaxrs\/script\/portal\/.+\/name\/.+\/imported/ig,
        /jaxrs\/script\/.+\/application\/.+\/imported/ig,
        /jaxrs\/page\/.+\/portal\/.+/ig
        // /jaxrs\/authentication/ig
        // /jaxrs\/statement\/.*\/execute\/page\/.*\/size\/.*/ig
    ];
    _restful = function(method, address, data, callback, async, withCredentials, cache){
        var loadAsync = (async !== false);
        var credentials = (withCredentials !== false);
        address = (address.indexOf("?")!==-1) ? address+"&v="+o2.version.v : address+"?v="+o2.version.v;
        //var noCache = cache===false;
        var noCache = !cache;


        //if (Browser.name == "ie")
        if (_cacheUrls.length){
            for (var i=0; i<_cacheUrls.length; i++){
                _cacheUrls[i].lastIndex = 0;
                if (_cacheUrls[i].test(address)){
                    noCache = false;
                    break;
                }
            }
        }
        //var noCache = false;
        var res = new Request.JSON({
            url: o2.filterUrl(address),
            secure: false,
            method: method,
            emulation: false,
            noCache: noCache,
            async: loadAsync,
            withCredentials: credentials,
            onSuccess: function(responseJSON, responseText){
                // var xToken = this.getHeader("authorization");
                // if (!xToken) xToken = this.getHeader("x-token");
                var xToken = this.getHeader("x-token");
                if (xToken){
                    if (window.layout){
                        if (!layout.session) layout.session = {};
                        layout.session.token = xToken;
                    }
                }
                o2.runCallback(callback, "success", [responseJSON]);
            },
            onFailure: function(xhr){
                o2.runCallback(callback, "requestFailure", [xhr]);
            }.bind(this),
            onError: function(text, error){
                o2.runCallback(callback, "error", [text, error]);
            }.bind(this)
        });

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Accept", "text/html,application/json,*/*");
        if (window.layout) {
            if (layout["debugger"]){
                res.setHeader("x-debugger", "true");
            }
            if (layout.session && layout.session.user){
                if (layout.session.user.token) {
                    res.setHeader("x-token", layout.session.user.token);
                    res.setHeader("authorization", layout.session.user.token);
                }
            }
        }
        //Content-Type	application/x-www-form-urlencoded; charset=utf-8
        res.send(data);
        return res;
    };

    var _release = function(o){
        var type = typeOf(o);
        switch (type){
            case "object":
                for (var k in o){
                    //if (o[k] && o[k].destroy) o[k].destroy();
                    o[k] = null;
                }
                break;
            case "array":
                for (var i=0; i< o.length; i++){
                    _release(o[i]);
                    if (o[i]) o[i] = null;
                }
                break;
        }
    };

    var _defineProperties = Object.defineProperties || function (obj, properties) {
        function convertToDescriptor(desc) {
            function hasProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
            function isCallable(v) {
                // NB: modify as necessary if other values than functions are callable.
                return typeof v === "function";
            }
            if (typeof desc !== "object" || desc === null)
                throw new TypeError("bad desc");
            var d = {};
            if (hasProperty(desc, "enumerable"))
                d.enumerable = !!desc.enumerable;
            if (hasProperty(desc, "configurable"))
                d.configurable = !!desc.configurable;
            if (hasProperty(desc, "value"))
                d.value = desc.value;
            if (hasProperty(desc, "writable"))
                d.writable = !!desc.writable;
            if (hasProperty(desc, "get")) {
                var g = desc.get;
                if (!isCallable(g) && typeof g !== "undefined")
                    throw new TypeError("bad get");
                d.get = g;
            }
            if (hasProperty(desc, "set")) {
                var s = desc.set;
                if (!isCallable(s) && typeof s !== "undefined")
                    throw new TypeError("bad set");
                d.set = s;
            }
            if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
                throw new TypeError("identity-confused descriptor");
            return d;
        }
        if (typeof obj !== "object" || obj === null)
            throw new TypeError("bad obj");
        properties = Object(properties);
        var keys = Object.keys(properties);
        var descs = [];
        for (var j = 0; j < keys.length; j++)
            descs.push([keys[j], convertToDescriptor(properties[keys[j]])]);
        for (var i = 0; i < descs.length; i++){
            if (Object.defineProperty && (Browser.name=="ie" && Browser.version!=8)){
                Object.defineProperty(obj, descs[i][0], descs[i][1]);
            }else{
                if (descs[i][1].value) obj[descs[i][0]] = descs[i][1].value;
                if (descs[i][1].get) obj["get"+descs[i][0].capitalize()] = descs[i][1].get;
                if (descs[i][1].set) obj["set"+descs[i][0].capitalize()] = descs[i][1].set;
            }
        }
        return obj;
    };
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                var len = o.length >>> 0;
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var thisArg = arguments[1];
                var k = 0;
                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    k++;
                }
                return -1;
            }
        });
    }
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function(predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                var len = o.length >>> 0;
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var thisArg = arguments[1];
                var k = 0;
                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    k++;
                }
                return undefined;
            }
        });
    }

    var _txt = function(v){
        var t = v.replace(/\</g, "&lt;");
        t = t.replace(/\</g, "&gt;");
        return t;
    };

    this.o2.Class = _Class;
    this.o2.require = _require;
    this.o2.requireApp = _requireApp;
    this.o2.JSON = _json;
    this.o2.loadLP = _loadLP;
    this.o2.restful = _restful;
    this.o2.release = _release;
    this.o2.defineProperties = _defineProperties;
    this.o2.txt = _txt;

    Object.repeatArray = function(o, count){
        var arr = [];
        for (var i=0; i<count; i++){
            arr.push(o)
        }
        return arr;
    }
    Date.implement({
        "getFromServer": function(){
            var d;
            o2.Actions.get("x_program_center").echo(function(json){
                d = Date.parse(json.data.serverTime);
            }, null, false);
            return d;
        }
    });

})();
o2.core = true;


/** ***** BEGIN LICENSE BLOCK *****
 * |------------------------------------------------------------------------------|
 * | O2OA 活力办公 创意无限    o2.more.js                                            |
 * |------------------------------------------------------------------------------|
 * | Distributed under the AGPL license:                                          |
 * |------------------------------------------------------------------------------|
 * | Copyright © 2018, o2oa.net, o2server.io O2 Team                              |
 * | All rights reserved.                                                         |
 * |------------------------------------------------------------------------------|
 *
 *  This file is part of O2OA.
 *
 *  O2OA is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  O2OA is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ***** END LICENSE BLOCK ******/
(function (){
    o2.getCenterPosition = function(el, width, height){
        var elPositon = $(el).getPosition();
        var elSize = $(el).getSize();
        var node = $("layout");
        var size = (node) ? $(node).getSize() : $(document.body).getSize();

        var top = (elPositon.y+elSize.y)/2 - (height/2);
        var left = (elPositon.x+elSize.x)/2-(width/2);
        if ((left+width)>size.x){
            left = size.x-width-10;
        }
        if ((top+height)>size.y){
            top = size.y-height-10;
        }

        return {"x": left, "y": top};
    };
    o2.getMarkSize = function(node){
        var size;
        if (!node){
            size = $(document.body).getSize();
            var winSize = $(window).getSize();

            var height = size.y;
            var width = size.x;

            if (height<winSize.y) height = winSize.y;
            if (width<winSize.x) width = winSize.x;

            return {x: size.x, y: height};
        }else{
            size = $(node).getSize();
            return {x: size.x, y: size.y};
        }
    };
    o2.json = function(jsonString, fun){
        var obj = JSON.decode(jsonString);
        var p = fun.split(".");
        var tmp = obj;
        p.each(function(item){
            if (item.indexOf("[")!==-1){
                var x = item.split("[");
                var i = parseInt(x[1].substr(0, x[1].indexOf("]")));
                tmp = tmp[x[0]][i];
            }else{
                tmp = tmp[item];
            }
        });
        return tmp;
    };
    o2.getHTMLTemplate = function(url, callback, async){
        var loadAsync = (async !== false);
        var res = new Request.HTML({
            url: url,
            async: loadAsync,
            method: "get",
            onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript){
                o2.runCallback(callback, "success", [responseTree, responseElements, responseHTML, responseJavaScript]);
            }.bind(this),
            onFailure: function(xhr){
                o2.runCallback(callback, "requestFailure", [xhr]);
            }
        });
        res.send();
    };

    o2.getRequestText = function(url, callback, async){
        var loadAsync = (async !== false);

        url = (url.indexOf("?")!==-1) ? url+"&v="+o2.version.v : url+"?v="+o2.version.v;
        var res = new Request({
            url: url,
            async: loadAsync,
            method: "get",
            onSuccess: function(responseText, responseXML){
                o2.runCallback(callback, "success",[responseText, responseXML]);
            }.bind(this),
            onFailure: function(xhr){
                o2.runCallback(callback, "requestFailure",[xhr]);
            }
        });
        res.send();
    };

    o2.encodeJsonString = function(str){
        var tmp = [str];
        var dataStr = (JSON.encode(tmp));
        return dataStr.substr(2, dataStr.length-4);
    };
    o2.decodeJsonString = function(str){
        var tmp = "[\""+str+"\"]";
        var dataObj = (JSON.decode(tmp));
        return dataObj[0];
    };

    o2.getTextSize = function(text, styles){
        var tmpSpan = new Element("span", {
            "text": text,
            "styles": styles
        }).inject($(document.body));
        var size = tmpSpan.getSize();
        tmpSpan.destroy();
        return size;
    };
    o2.getCenter = function(size, target, offset){
        if (!target) target = document.body;
        var targetSize = target.getSize();
        var targetPosition = target.getPosition(offset);
        var targetScroll = target.getScroll();

        var x = targetSize.x/2;
        var y = targetSize.y/2;

        x = x-(size.x/2);
        y = y-(size.y/2);
        x = x+targetPosition.x;
        y = y+targetPosition.y;
        x = x+targetScroll.x;
        y = y+targetScroll.y;

        return {"x": x, "y": y};
    };
    o2.getEPointer = function(e){
        var x = 0;
        var y = 0;
        if (typeOf(e)=="element"){
            var position = e.getPosition(this.content);
            x = position.x;
            y = position.y;
        }else{
            if (Browser.name=="firefox"){
                x = parseFloat(e.event.clientX || e.event.x);
                y = parseFloat(e.event.clientY || e.event.y);
            }else{
                x = parseFloat(e.event.x);
                y = parseFloat(e.event.y);
            }

            if (e.target){
                var position = e.target.getPosition(this.content);
                x = position.x;
                y = position.y;
            }
            //    }
        }
        return {"x": x, "y": y};
    };
    o2.getParent = function(node, tag){
        var pNode = node.parentElement;
        while(pNode && pNode.tagName.toString().toLowerCase() !== tag.toString().toLowerCase()){
            pNode = pNode.parentElement;
        }
        return pNode;
    };
    o2.getOffset = function(evt){
        if (Browser.name==="firefox"){
            return {
                "offsetX": evt.layerX,
                "offsetY": evt.layerY
            };
        }else{
            return {
                "offsetX": evt.offsetX,
                "offsetY": evt.offsetY
            }
        }
    };

    if (String.implement) String.implement({
        "getAllIndexOf": function(str){
            var idxs= [];
            var idx = this.indexOf(str);
            while (idx !== -1){
                idxs.push(idx);
                idx = this.indexOf(str, idx+1);
            }
            return idxs;
        }
    });
    if (Array.implement) Array.implement({
        "trim": function(){
            var arr = [];
            this.each(function(v){
                if (v) arr.push(v);
            });
            return arr;
        },
        "isIntersect": function(arr){
            return this.some(function(item){ return (arr.indexOf(item)!==-1); })
        }
    });
    if (window.Element && Element.implement) Element.implement({
        "isIntoView": function() {
            // var pNode = this.getParent();
            // while (pNode && ((pNode.getScrollSize().y-(pNode.getComputedSize().height+1)<=0) || pNode.getStyle("overflow")==="visible")) pNode = pNode.getParent();
            //
            var pNode = this.getParentSrcollNode();

            if (!pNode) pNode = document.body;
            var size = pNode.getSize();
            var srcoll = pNode.getScroll();
            var p = (pNode == window) ? {"x":0, "y": 0} : this.getPosition(pNode);
            var nodeSize = this.getSize();
            //return (p.x-srcoll.x>=0 && p.y-srcoll.y>=0) && (p.x+nodeSize.x<size.x+srcoll.x && p.y+nodeSize.y<size.y+srcoll.y);
            return (p.x-srcoll.x>=0 && p.y>=0) && (p.x+nodeSize.x<size.x+srcoll.x && p.y+nodeSize.y<size.y)
        },
        "appendHTML": function(html, where){
            if (this.insertAdjacentHTML){
                var whereText = "beforeEnd";
                if (where==="before") whereText = "beforeBegin";
                if (where==="after") whereText = "afterEnd";
                if (where==="bottom") whereText = "beforeEnd";
                if (where==="top") whereText = "afterBegin";
                this.insertAdjacentHTML(whereText, html);
            }else {
                if (where==="bottom") this.innerHTML = this.innerHTML+html;
                if (where==="top") this.innerHTML = html+this.innerHTML;
            }
        },
        "positionTo": function(x,y){
            var left = x.toFloat();
            var top = y.toFloat();
            var offsetNode = this.getOffsetParent();
            if (offsetNode){
                var offsetPosition = offsetNode.getPosition();
                left = left-offsetPosition.x;
                top = top-offsetPosition.y;
            }
            this.setStyles({"top": top, "left": left});
            return this;
        },
        "getBorder": function(){
            var positions = ["top", "left", "right", "bottom"];
            var styles = ["color", "style", "width"];

            var obj = {};
            positions.each(function (position){
                styles.each(function(style){
                    var key = "border-"+position+"-"+style;
                    obj[key] = this.getStyle(key);
                }.bind(this));
            }.bind(this));

            return obj;
        },
        "isOutside": function(e){
            var elementCoords = this.getCoordinates();
            var targetCoords  = this.getCoordinates();
            if(((e.page.x < elementCoords.left || e.page.x > (elementCoords.left + elementCoords.width)) ||
                (e.page.y < elementCoords.top || e.page.y > (elementCoords.top + elementCoords.height))) &&
                ((e.page.x < targetCoords.left || e.page.x > (targetCoords.left + targetCoords.width)) ||
                    (e.page.y < targetCoords.top || e.page.y > (targetCoords.top + targetCoords.height))) ) return true;

            return false;
        },
        "getAbsolutePosition":function(){
            var styleLeft = 0;
            var styleTop = 0;
            var node = this;

            styleLeft = node.offsetLeft;
            styleTop = node.offsetTop;

            node = node.parentElement;

            while (node && node.tagName.toString().toLowerCase()!=="body"){
                styleLeft += node.offsetLeft;
                styleTop += node.offsetTop;
                node = node.offsetParent;
            }
            return {x: styleLeft, y: styleTop};
        },
        "tweenScroll": function(to, time){
            if (!this.tweenScrollQueue){
                this.tweenScrollQueue = [];
            }
            if (this.tweenScrollQueue.length){
                this.tweenScrollQueue.push(to);
            }else{
                this.tweenScrollQueue.push(to);
                this.doTweenScrollQueue(time);
            }
        },
        "doTweenScrollQueue": function(time){
            if (this.tweenScrollQueue.length){
                var i = this.tweenScrollQueue.length;
                var to = this.tweenScrollQueue[this.tweenScrollQueue.length-1];

                var scroll = this.getScroll();
                var dy = to - scroll.y;
                var step = dy/time;
                var count = 0;
                var move = 0;

                var id = window.setInterval(function(){

                    this.scrollTo(0, scroll.y+count*step);
                    count++;
                    if (count>time){
                        window.clearInterval(id);
                        for (var x=1; x<=i; x++) this.tweenScrollQueue.shift();
                        if (this.tweenScrollQueue.length) this.doTweenScrollQueue(time);
                    }
                }.bind(this), 1);
            }
        },
        "isPointIn": function(px, py, offX, offY, el){
            if (!offX) offX = 0;
            if (!offY) offY = 0;
            var position = this.getPosition(el);
            var size = this.getSize();
            return (position.x-offX<=px && position.x+size.x+offX>=px && position.y-offY<=py && position.y+size.y+offY>=py);
        },
        "isInPointInRect": function(sx, sy, ex, ey){
            var position = this.getPosition();
            var size = this.getSize();

            var p1 = {"x": position.x, "y": position.y};
            var p2 = {"x": position.x+size.x, "y": position.y};
            var p3 = {"x": position.x+size.x, "y": position.y+size.y};
            var p4 = {"x": position.x, "y": position.y+size.y};

            var sp = {"x": Math.min(sx, ex), "y": Math.min(sy, ey)};
            var ep = {"x": Math.max(sx, ex), "y": Math.max(sy, ey)};

            if (p1.x>=sp.x && p1.y>=sp.y && p1.x<=ep.x && p1.y<=ep.y) return true;
            if (p2.x>=sp.x && p2.y>=sp.y && p2.x<=ep.x && p2.y<=ep.y) return true;
            if (p3.x>=sp.x && p3.y>=sp.y && p3.x<=ep.x && p3.y<=ep.y) return true;
            if (p4.x>=sp.x && p4.y>=sp.y && p4.x<=ep.x && p4.y<=ep.y) return true;
            if (p3.x>=sp.x && p3.y>=sp.y && p1.x<=sp.x && p1.y<=sp.y) return true;
            if (p3.x>=ep.x && p3.y>=ep.y && p1.x<=ep.x && p1.y<=ep.y) return true;
            if (p1.x<=sp.x && p2.x>=sp.x && p1.y>=sp.y && p4.y<=ep.y) return true;
            if (p1.y<=sp.y && p4.y>=sp.y && p1.x>=sp.x && p2.x<=ep.x) return true;

            return false;
        },
        "isOverlap": function(node){
            var p = node.getPosition();
            var s = node.getSize();
            return this.isInPointInRect(p.x, p.y, p.x+s.x, p.y+s.y);
        },

        "getUsefulSize": function(){
            var size = this.getSize();
            var borderLeft = this.getStyle("border-left").toInt();
            var borderBottom = this.getStyle("border-bottom").toInt();
            var borderTop = this.getStyle("border-top").toInt();
            var borderRight = this.getStyle("border-right").toInt();

            var paddingLeft = this.getStyle("padding-left").toInt();
            var paddingBottom = this.getStyle("padding-bottom").toInt();
            var paddingTop = this.getStyle("padding-top").toInt();
            var paddingRight = this.getStyle("padding-right").toInt();

            var x = size.x-paddingLeft-paddingRight;
            var y = size.y-paddingTop-paddingBottom;

            return {"x": x, "y": y};
        },
        "clearStyles": function(isChild){
            this.removeProperty("style");
            if (isChild){
                var subNode = this.getFirst();
                while (subNode){
                    subNode.clearStyles(isChild);
                    subNode = subNode.getNext();
                }
            }
        },
        "maskIf": function(styles, click){
            var style = {
                "background-color": "#666666",
                "opacity": 0.4,
                "z-index":100
            };
            if (styles){
                style = Object.merge(style, styles);
            }
            var position = this.getPosition(this.getOffsetParent());
            this.mask({
                "destroyOnHide": true,
                "style": style,
                "useIframeShim": true,
                "iframeShimOptions": {"browsers": true},
                "onShow": function(){
                    this.shim.shim.setStyles({
                        "opacity": 0,
                        "top": ""+position.y+"px",
                        "left": ""+position.x+"px"
                    });
                },
                "onClick": click
            });
        },
        "scrollIn": function(where){
            var wh = (where) ? where.toString().toLowerCase() : "center";

            if (Browser.name=="ie" || Browser.name=="safari"){
                var scrollNode = this.getParentSrcollNode();
                var scrollFx = new Fx.Scroll(scrollNode);
                var scroll = scrollNode.getScroll();
                var size = scrollNode.getSize();
                var thisSize = this.getComputedSize();
                var p = this.getPosition(scrollNode);

                if (wh=="start"){
                    var top = 0;
                    scrollFx.start(scroll.x, p.y-top+scroll.y);
                }else if (wh=="end"){
                    var bottom = size.y-thisSize.totalHeight;
                    scrollFx.start(scroll.x, p.y-bottom+scroll.y);
                }else{
                    var center = size.y/2-thisSize.totalHeight/2;
                    scrollFx.start(scroll.x, p.y-center+scroll.y);
                }
            }else{
                if (wh!=="start" && wh!=="end") wh = "center"
                this.scrollIntoView({"behavior": "smooth", "block": wh, "inline": "nearest"});
            }
        },
        scrollToNode: function(el, where){
            var scrollSize = this.getScrollSize();
            if (!scrollSize.y) return true;
            var wh = (where) ? where.toString().toLowerCase() : "bottom";
            var node = $(el);
            var size = node.getComputedSize();
            var p = node.getPosition(this);
            var thisSize = this.getComputedSize();
            var scroll = this.getScroll();
            if (wh==="top"){
                var n = (p.y-thisSize.computedTop);
                if (n<0) this.scrollTo(scroll.x, scroll.y+n);
                n = (size.totalHeight+p.y-thisSize.computedTop)-thisSize.height;
                if (n>0) this.scrollTo(scroll.x, scroll.y+n);

            }else{
                var n = (size.totalHeight+p.y-thisSize.computedTop)-thisSize.height;
                if (n>0) this.scrollTo(scroll.x, scroll.y+n);
                n = p.y-thisSize.computedTop;
                if (n<0) this.scrollTo(scroll.x, scroll.y+n);
            }
        },
        "getInnerStyles": function(){
            var styles = {};
            style = this.get("style");
            if (style){
                var styleArr = style.split(/\s*\;\s*/g);
                styleArr.each(function(s){
                    if (s){
                        var sarr = s.split(/\s*\:\s*/g);
                        styles[sarr[0]] = (sarr.length>1) ? sarr[1]: ""
                    }
                }.bind(this));
            }
            return styles;
        },
        "getInnerProperties": function(){
            var properties = {};
            if (this.attributes.length){
                for (var i=0; i<this.attributes.length; i++){
                    properties[this.attributes[i].nodeName] = this.attributes[i].nodeValue;
                }
            }
            return properties;
        },
        "getZIndex": function(){
            var n = this;
            var i=0;
            while (n){
                if (n.getStyle("position")==="absolute"){
                    var idx = n.getStyle("z-index");
                    i = (idx && idx.toFloat()>i) ? idx.toFloat()+1 : 0;
                    break;
                }
                n = n.getParent();
            }
            return i;
        },
        "getParentSrcollNode": function(){
            var node = this.getParent();
            while (node && (node.getScrollSize().y-2<=node.getSize().y || (node.getStyle("overflow")!=="auto" &&  node.getStyle("overflow-y")!=="auto"))){
                node = node.getParent();
            }
            return node || null;
        },
        "getEdgeHeight": function(notMargin){
            var h = 0;
            h += (this.getStyle("border-top-width").toFloat() || 0)+ (this.getStyle("border-bottom-width").toFloat() || 0);
            h += (this.getStyle("padding-top").toFloat() || 0)+ (this.getStyle("padding-bottom").toFloat() || 0);
            if (!notMargin) h += (this.getStyle("margin-top").toFloat() || 0)+ (this.getStyle("margin-bottom").toFloat() || 0);
            return h;
        },
        "getEdgeWidth": function(notMargin){
            var h = 0;
            h += (this.getStyle("border-left-width").toFloat() || 0)+ (this.getStyle("border-right-width").toFloat() || 0);
            h += (this.getStyle("padding-left").toFloat() || 0)+ (this.getStyle("padding-right").toFloat() || 0);
            if (!notMargin) h += (this.getStyle("margin-left").toFloat() || 0)+ (this.getStyle("margin-right").toFloat() || 0);
            return h;
        }
    });
    Object.copy = function(from, to){
        Object.each(from, function(value, key){
            switch (typeOf(value)){
                case "object":
                    if (!to[key]) to[key]={};
                    Object.copy(value, to[key]);
                    break;
                default:
                    to[key] = value;
            }
        });
    };

    if (window.JSON) JSON.format = JSON.encode;

    if (window.Slick) {
        Slick.definePseudo('src', function (value) {
            return Element.get(this, "src").indexOf(value) !== -1;
        });
        Slick.definePseudo('srcarr', function (value) {
            var vList = value.split(",");
            var src = Element.get(this, "src");
            var flag = false;
            for (var i = 0; i < vList.length; i++) {
                if (src.indexOf(vList[i]) !== -1) {
                    flag = true;
                    break;
                }
            }
            return flag;
        });
        Slick.definePseudo('ahref', function (value) {
            var href = Element.get(this, "href");
            if (!href) href = "";
            href = href.toString().toLowerCase();
            return (href.indexOf(value) !== -1);
        });

        Slick.definePseudo('rowspanBefore', function (line) {
            var tr = MWF.getParent(this, "tr");
            var rowspan = this.get("rowspan").toInt() || 1;
            var currentRowIndex = tr.rowIndex.toInt();

            return rowspan > 1 && currentRowIndex < line.toInt() && currentRowIndex + rowspan - 1 >= line;
        });
        Slick.definePseudo('rowspan', function () {
            var rowspan = this.get("rowspan").toInt() || 1;
            return rowspan > 1;
        });

        Slick.definePseudo('colspanBefore', function (col) {
            var tr = MWF.getParent(this, "tr");
            var colspan = this.get("colspan").toInt() || 1;
            var currentColIndex = this.cellIndex.toInt();

            return colspan > 1 && currentColIndex < col.toInt() && currentColIndex + colspan - 1 >= col.toInt();
        });

        Slick.definePseudo('colspan', function () {
            var colspan = this.get("colspan").toInt() || 1;
            return colspan > 1;
        });
    }

    o2.common = o2.common || {};

    o2.common.encodeHtml = function(str){
        str = str.toString();
        str = str.replace(/\&/g, "&amp;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/</g, "&lt;");
        return str.replace(/\"/g, "&quot;");
    };

    o2.common.getResponseTextPost = function(path, body, contentType){
        var returnText = "";
        var options = {
            url: path,
            async: false,
            data: body,
            method: "post",
            onSuccess: function(esponseTree, responseElements, responseHTML, responseJavaScript){
                returnText = responseHTML;
            }
        };
        var r = new Request.HTML(options);
        r.send();
        return returnText;
    };
    o2.common.getResponseText = function(path){
        var returnText = "";
        var options = {
            url: path,
            async: false,
            method: "get",
            onSuccess: function(esponseTree, responseElements, responseHTML, responseJavaScript){
                returnText = responseHTML;
            }
        };
        var r = new Request.HTML(options);
        r.send();
        return returnText;
    };
    o2.common.toDate = function(str){
        var tmpArr = str.split(" ");
        if (!tmpArr[1]) tmpArr.push("0:0:0");
        var dateArr = tmpArr[0].split("-");
        var timeArr = tmpArr[1].split(":");
        return new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2],timeArr[0],timeArr[1],timeArr[2]);
    };

    o2.common.toDate = function(str){
        var tmpArr = str.split(" ");
        if (!tmpArr[1]) tmpArr.push("0:0:0");
        var dateArr = tmpArr[0].split("-");
        var timeArr = tmpArr[1].split(":");
        return new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2],timeArr[0],timeArr[1],timeArr[2]);
    };

    o2.grayscale = function(src, width, height, callback){
        try {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var imgObj = new Image();
            imgObj.src = src;
            canvas.width = width || imgObj.width;
            canvas.height = height || imgObj.height;
            ctx.drawImage(imgObj, 0, 0);

            var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for(var y = 0; y < imgPixels.height; y++){
                for(var x = 0; x < imgPixels.width; x++){
                    var i = (y * 4) * imgPixels.width + x * 4;
                    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                    imgPixels.data[i] = avg;
                    imgPixels.data[i + 1] = avg;
                    imgPixels.data[i + 2] = avg;
                }
            }
            ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
            var src1 = canvas.toDataURL();
            //var blob = canvas.toBlob();
            canvas.destroy();
            return {"status": "success", "src": src1};
        }catch(e){
            return {"status": "error", "src": src}
        }
    };
    o2.eventPosition = function(e){
        var x = 0;
        var y = 0;
        if (Browser.name=="firefox"){
            x = parseFloat(e.event.clientX || e.event.x);
            y = parseFloat(e.event.clientY || e.event.y);
        }else{
            x = parseFloat(e.event.x);
            y = parseFloat(e.event.y);
        }
        return {"x": x, "y": y};
    };

    if (window.Browser){
        if (Browser.name==="ie" && Browser.version<9){
            Browser.ieuns = true;
        }else if(Browser.name==="ie" && Browser.version<10){
            Browser.iecomp = true;
        }
        if (Browser.iecomp){
            o2.load("ie_adapter", null, false);
            o2.session.isDebugger = true;
            //layout["debugger"] = true;
        }
        o2.session.isMobile = (["mac", "win", "linux"].indexOf(Browser.Platform.name)===-1);
    }
})();
o2.more = true;

//o2.addReady
(function(){
    //dom ready
    var _dom = {
        ready: false,
        loaded: false,
        checks: [],
        shouldPoll: false,
        timer: null,
        testElement: document.createElement('div'),
        readys: [],

        domready: function(){
            clearTimeout(_dom.timer);
            if (_dom.ready) return;
            _dom.loaded = _dom.ready = true;
            o2.removeListener(document, 'DOMContentLoaded', _dom.checkReady);
            o2.removeListener(document, 'readystatechange', _dom.check);
            _dom.onReady();
        },
        check: function(){
            for (var i = _dom.checks.length; i--;) if (_dom.checks[i]() && window.MooTools && o2.core && o2.more){
                _dom.domready();
                return true;
            }
            return false;
        },
        poll: function(){
            clearTimeout(_dom.timer);
            if (!_dom.check()) _dom.timer = setTimeout(_dom.poll, 10);
        },

        /*<ltIE8>*/
        // doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
        // testElement.doScroll() throws when the DOM is not ready, only in the top window
        doScrollWorks: function(){
            try {
                _dom.testElement.doScroll();
                return true;
            } catch (e){}
            return false;
        },
        /*</ltIE8>*/

        onReady: function(){
            for (var i=0; i<_dom.readys.length; i++){
                this.readys[i].apply(window);
            }
        },
        addReady: function(fn){
            if (_dom.loaded){
                if (fn) fn.apply(window);
            }else{
                if (fn) _dom.readys.push(fn);
            }
            return _dom;
        },
        checkReady: function(){
            _dom.checks.push(function(){return true});
            _dom.check();
        }
    };
    var _loadO2 = function(){
        (!o2.core) ? this.o2.load("o2.core", _dom.check) : _dom.check();
        (!o2.more) ? this.o2.load("o2.more", _dom.check) : _dom.check();
    };

    o2.addListener(document, 'DOMContentLoaded', _dom.checkReady);

    /*<ltIE8>*/
    // If doScroll works already, it can't be used to determine domready
    //   e.g. in an iframe
    if (_dom.testElement.doScroll && !_dom.doScrollWorks()){
        _dom.checks.push(_dom.doScrollWorks);
        _dom.shouldPoll = true;
    }
    /*</ltIE8>*/

    if (document.readyState) _dom.checks.push(function(){
        var state = document.readyState;
        return (state == 'loaded' || state == 'complete');
    });

    if ('onreadystatechange' in document) o2.addListener(document, 'readystatechange', _dom.check);
    else _dom.shouldPoll = true;

    if (_dom.shouldPoll) _dom.poll();

    if (!window.MooTools){
        this.o2.load("mootools", function(){ _loadO2(); _dom.check(); });
    }else{
        _loadO2();
    }
    this.o2.addReady = function(fn){ _dom.addReady.call(_dom, fn); };
})();

//compatible
COMMON = {
    "DOM":{},
    "setContentPath": function(path){
        COMMON.contentPath = path;
    },
    "JSON": o2.JSON,
    "Browser": Browser,
    "Class": o2.Class,
    "XML": o2.xml,
    "AjaxModule": {
        "load": function(urls, callback, async, reload){
            o2.load(urls, callback, reload, document);
        },
        "loadDom":  function(urls, callback, async, reload){
            o2.load(urls, callback, reload, document);
        },
        "loadCss":  function(urls, callback, async, reload, sourceDoc){
            o2.loadCss(urls, document.body, callback, reload, sourceDoc);
        }
    },
    "Request": Request,
    "typeOf": o2.typeOf
};
COMMON.Browser.Platform.isMobile = o2.session.isMobile;
COMMON.DOM.addReady = o2.addReady;
MWF = o2;
MWF.getJSON = o2.JSON.get;
MWF.getJSONP = o2.JSON.getJsonp;
MWF.defaultPath = o2.session.path;
