/**
 * twig.js
 * https://github.com/schmittjoh/twig.js
 *
 * (C) 2011 Johannes M. Schmitt <schmittjoh@gmail.com>
 * Licensed under the Apache 2.0 License.
 *
 * Portions of this code are from the Google Closure Library received
 * from the Closure Authors under the Apache 2.0 License.
 */
function strtr (str, from, to) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +      input by: uestla
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alan C
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Taras Bogach
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: jpfle
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -   depends on: krsort
    // -   depends on: ini_set
    // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
    // *     example 1: strtr('hi all, I said hello', $trans)
    // *     returns 1: 'hello all, I said hi'
    // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
    // *     returns 2: 'aaabaaccasdeooo'
    // *     example 3: strtr('ääääääää', 'ä', 'a');
    // *     returns 3: 'aaaaaaaa'
    // *     example 4: strtr('http', 'pthxyz','xyzpth');
    // *     returns 4: 'zyyx'
    // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
    // *     returns 5: 'http'
    // *     example 6: strtr('aa', {'a':1,'aa':2});
    // *     returns 6: '2'
    var fr = '',
        i = 0,
        j = 0,
        lenStr = 0,
        lenFrom = 0,
        tmpStrictForIn = false,
        fromTypeStr = '',
        toTypeStr = '',
        istr = '';
    var tmpFrom = [];
    var tmpTo = [];
    var ret = '';
    var match = false;

    // Received replace_pairs?
    // Convert to normal from->to chars
    if (typeof from === 'object') {
         for (fr in from) {
            if (from.hasOwnProperty(fr)) {
                tmpFrom.push(fr);
                tmpTo.push(from[fr]);
            }        }

        from = tmpFrom;
        to = tmpTo;
    }

    // Walk through subject and replace chars when needed
    lenStr = str.length;
    lenFrom = from.length;
    fromTypeStr = typeof from === 'string';
    toTypeStr = typeof to === 'string';

    for (i = 0; i < lenStr; i++) {
        match = false;
        if (fromTypeStr) {
            istr = str.charAt(i);
            for (j = 0; j < lenFrom; j++) {
                if (istr == from.charAt(j)) {
                    match = true;
                    break;
                }
            }
        } else {
            for (j = 0; j < lenFrom; j++) {
                if (str.substr(i, from[j].length) == from[j]) {
                    match = true;
                    // Fast forward
                    i = (i + from[j].length) - 1;
                    break;
                }
            }
        }
        if (match) {
            ret += toTypeStr ? to.charAt(j) : to[j];
        } else {
            ret += str.charAt(i);
        }
    }

    return ret;
}
(function() {var e=!0,h=null,i=!1;function j(a){return function(){return this[a]}}var k,m=this;function n(a,b,c){a=a.split(".");c=c||m;!(a[0]in c)&&c.execScript&&c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&void 0!==b?c[d]=b:c=c[d]?c[d]:c[d]={}}
function p(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function q(a){return"array"==p(a)}function r(a){return"string"==typeof a}function s(a){var b=typeof a;return"object"==b&&a!=h||"function"==b}var t="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),u=0;function v(a,b,c){return a.call.apply(a.bind,arguments)}
function w(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function x(a,b,c){x=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?v:w;return x.apply(h,arguments)}function y(a,b){n(a,b,void 0)};var z=/&/g,A=/</g,B=/>/g,C=/\"/g,D=/[&<>\"]/,E={"\x00":"\\0","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\"},F={"'":"\\'"};var G;(G="ScriptEngine"in m&&"JScript"==m.ScriptEngine())&&(m.ScriptEngineMajorVersion(),m.ScriptEngineMinorVersion(),m.ScriptEngineBuildVersion());function H(a,b){this.a=G?[]:"";a!=h&&this.append.apply(this,arguments)}G?(H.prototype.e=0,H.prototype.append=function(a,b,c){b==h?this.a[this.e++]=a:(this.a.push.apply(this.a,arguments),this.e=this.a.length);return this}):H.prototype.append=function(a,b,c){this.a+=a;if(b!=h)for(var d=1;d<arguments.length;d++)this.a+=arguments[d];return this};H.prototype.clear=function(){G?this.e=this.a.length=0:this.a=""};H.prototype.toString=function(){if(G){var a=this.a.join("");this.clear();a&&this.append(a);return a}return this.a};function I(a,b,c){for(var d in a)b.call(c,a[d],d,a)}function J(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return c}var K="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");function L(a,b){for(var c,d,f=1;f<arguments.length;f++){d=arguments[f];for(c in d)a[c]=d[c];for(var g=0;g<K.length;g++)c=K[g],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var M=Array.prototype,N=M.indexOf?function(a,b,c){return M.indexOf.call(a,b,c)}:function(a,b,c){c=c==h?0:0>c?Math.max(0,a.length+c):c;if(r(a))return!r(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},O=M.forEach?function(a,b,c){M.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=r(a)?a.split(""):a,g=0;g<d;g++)g in f&&b.call(c,f[g],g,a)};var P=x,t="twig_ui_"+Math.floor(2147483648*Math.random()).toString(36);function Q(a){return h===a||i===a||void 0===a||0===a?e:R(a)?0===S(a):i}function T(a,b){L.apply(h,Array.prototype.slice.call(arguments,0));return a}function R(a){return q(a)||r(a)||s(a)}function S(a){if(q(a))return a.length;if(r(a))return a.length;if(s(a)){var b=0,c;for(c in a)b++;return b}throw Error(typeof a+" is not countable.");}function U(a,b,c){q(a)?O(a,b,c):I(a,b,c)};function V(a){this.env_=a;this.c=[];this.m={}}k=V.prototype;k.r=j("c");k.C=function(a){this.c=a};k.I=function(a){this.m=a};k.getParent=function(a){a=this.getParent_(a);return i===a?i:this.env_.d(a)};k.B=function(a,b,c){if(a in this.m){var d=new H;this.m[a](d,b,c||{});return d.toString()}d=this.getParent(b);if(i!==d)return d.k(a,b,c);throw Error("The template '"+this.u()+"' has no parent, and no trait defining the block '"+a+"'.");};
k.k=function(a,b,c){if(c&&a in c){var d=new H,f=c[a];delete c[a];f(d,b,c);return d.toString()}if(a in this.c)return d=new H,this.c[a](d,b,c),d.toString();d=this.getParent(b);return i!==d?d.k(a,b,c):""};k.j=function(a,b){var c=new H;this.render_(c,a||{},b||{});return c.toString()};function W(){this.b={};this.g={};this.h={};this.l={};this.f={};this.o={};this.p=i}k=W.prototype;k.j=function(a,b){var c=this.d(a);return c.j.call(c,T({},this.o,b||{}))};k.filter=function(a,b,c){if(!(a in this.g))throw Error("The filter '"+a+"' does not exist.");return this.g[a].apply(h,Array.prototype.slice.call(arguments,1))};k.w=function(a,b,c){if(!(a in this.h))throw Error("The function '"+a+"' does not exist.");return this.h[a].apply(h,Array.prototype.slice.call(arguments,1))};
k.test=function(a,b,c){if(!(a in this.l))throw Error("The test '"+a+"' does not exist.");return this.l[a].apply(h,Array.prototype.slice.call(arguments,1))};k.z=function(a,b,c){var d=this.d(a),f=d["get"+b];if(!f)throw Error("The macro '"+b+"' does not exist on template '"+d.u()+"'.");return f.apply(d,Array.prototype.slice.call(arguments,2)).toString()};k.F=function(a,b){this.g[a]=b};k.G=function(a,b){this.h[a]=b};k.H=function(a,b){this.l[a]=b};k.t=j("o");
k.i=function(){this.p=e;I(this.b,function(a){a.i()},this)};k.v=function(a){return a in this.b};k.getExtension=function(a){if(!(a in this.b))throw Error('The "'+a+'" extension is not enabled.');return this.b[a]};k.n=function(a){this.b[a.getName()]=a};k.A=function(a){delete this.b[a]};k.D=function(a){I(a,function(a){this.n(a)})};k.s=j("b");k.d=function(a){var b=a[t]||(a[t]=++u);if(b in this.f)return this.f[b];i===this.p&&this.i();a=new a(this);return this.f[b]=a};function X(a){this.q=a}X.prototype.toString=j("q");window.Twig=new W;y("goog.provide",function(a){n(a)});y("twig.attr",function(a,b,c,d,f){d=d||"any";f=void 0!==f?f:i;if(!s(a)&&!q(a))return f?i:h;if(b in a){if("array"!==d&&"function"==p(a[b]))return f?e:a[b].apply(a,c||[]);if("method"!==d)return f?e:a[b]}if("array"===d||q(a))return f?i:h;var b=b.toLowerCase(),g="get"+b,l="is"+b;return(b=J(a,function(a,b){b=b.toLowerCase();return b===g||b===l}))&&"function"==p(a[b])?f?e:a[b].apply(a,c||[]):f?i:h});y("twig.bind",P);
y("twig.inherits",function(a,b){function c(){}c.prototype=b.prototype;a.J=b.prototype;a.prototype=new c});y("twig.extend",T);y("twig.spaceless",function(a){return a.replace(/>[\s\xa0]+</g,"><").replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")});y("twig.range",function(a,b){for(var c=[];a<=b;a+=1)c.push(a);return c});y("twig.contains",function(a,b){var c;if(q(a))c=0<=N(a,b);else if(r(a))c=-1!=a.indexOf(b);else a:{for(c in a)if(a[c]==b){c=e;break a}c=i}return c});y("twig.countable",R);y("twig.count",S);
y("twig.forEach",U);y("twig.empty",Q);y("twig.createObj",function(a){for(var b={},c=0;c<arguments.length;c+=2)b[arguments[c]]=arguments[c+1];return b});y("twig.filter.capitalize",function(a,b){return b.charAt(0).toUpperCase()+b.substring(1)});
y("twig.filter.escape",function(a,b,c,d,f){if(f&&b instanceof X)return b.toString();b=b==h?"":""+b;if("js"===c){a=""+b;if(a.quote)b=a.quote();else{b=['"'];for(c=0;c<a.length;c++){var g=a.charAt(c),l=g.charCodeAt(0),d=b,f=c+1,o;if(!(o=E[g])){if(!(31<l&&127>l))if(g in F)g=F[g];else if(g in E)g=F[g]=E[g];else{l=g;o=g.charCodeAt(0);if(31<o&&127>o)l=g;else{if(256>o){if(l="\\x",16>o||256<o)l+="0"}else l="\\u",4096>o&&(l+="0");l+=o.toString(16).toUpperCase()}g=F[g]=l}o=g}d[f]=o}b.push('"');b=b.join("")}return b.substring(1,
b.length-1)}if(!c||"html"===c)return a=b,D.test(a)&&(-1!=a.indexOf("&")&&(a=a.replace(z,"&amp;")),-1!=a.indexOf("<")&&(a=a.replace(A,"&lt;")),-1!=a.indexOf(">")&&(a=a.replace(B,"&gt;")),-1!=a.indexOf('"')&&(a=a.replace(C,"&quot;"))),a;throw Error("The type '"+c+"' is not supported.");});y("twig.filter.length",function(a,b){return S(b)});y("twig.filter.def",function(a,b){return Q(a)?b||"":a});y("twig.filter.replace",function(a,b){for(var c in b)a=a.replace(RegExp(c,"g"),b[c]);return a});
y("twig.filter.join",function(a,b){var c=b||"",d=new H,f=e;U(a,function(a){f||d.append(c);f=i;d.append(a)});return d.toString()});y("twig.filter.keys",function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b});y("twig.filter.upper",function(a,b){return b.toUpperCase()});y("twig.filter.lower",function(a,b){return b.toLowerCase()});y("twig.StringBuffer",H);H.prototype.append=H.prototype.append;H.prototype.toString=H.prototype.toString;W.prototype.createTemplate=W.prototype.d;W.prototype.filter=W.prototype.filter;
W.prototype.invoke=W.prototype.w;W.prototype.test=W.prototype.test;W.prototype.macro=W.prototype.z;W.prototype.setFilter=W.prototype.F;W.prototype.setFunction=W.prototype.G;W.prototype.setTest=W.prototype.H;W.prototype.render=W.prototype.j;W.prototype.getGlobals=W.prototype.t;W.prototype.initRuntime=W.prototype.i;W.prototype.hasExtension=W.prototype.v;W.prototype.getExtension=W.prototype.getExtension;W.prototype.addExtension=W.prototype.n;W.prototype.removeExtension=W.prototype.A;
W.prototype.setExtensions=W.prototype.D;W.prototype.getExtensions=W.prototype.s;y("twig.Template",V);V.prototype.setTraits=V.prototype.I;V.prototype.setBlocks=V.prototype.C;V.prototype.getBlocks=V.prototype.r;V.prototype.renderParentBlock=V.prototype.B;V.prototype.renderBlock=V.prototype.k;y("twig.Markup",X);})();
