
export const _util = {
    param: function (parameter, _default) {
        return (typeof parameter !== 'undefined' ? parameter : _default);
    },
    // regexEscape: function (string) {
    //     return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // },
    isSet: function (value) {
        return typeof value !== "undefined";
    },
    isFunction: function (func) {
        return typeof func === "function";
    },
    isPlainObject: function (obj) {
        return typeof obj === "object" && obj != null && !(obj instanceof Array);
    },
    isArray: function (arr) {
        return typeof arr === "object" && arr instanceof Array;
    },
    isNumber: function (number, required) {
        return typeof number === "number" && (!_util.param(required, false) || number > 0);
    },
    isString: function (string, required) {
        return typeof string === "string" && (!_util.param(required, false) || string != '');
    },
    // getAttributeString: function ($object, attr) {
    //     var val = $object.attr(attr);
    //     return (typeof val === 'undefined' || val === false || val === '') ? '' : val;
    // },
    // indexOf: function (value, array, strict) {
    //     strict = strict || false;
    //     if (array instanceof Array) {
    //         for (var i = 0; i < array.length; i++) {
    //             if (strict) {
    //                 if (array[i] === value) {
    //                     return i;
    //                 }
    //             } else if (array[i] == value) {
    //                 return i;
    //             }
    //         }
    //     }
    //     return -1;
    // },
    // trim: function (string) {
    //     return (_util.isString(string)) ? string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : string;
    // },
    // applyDataToSettings: function ($object, settings, defaults, stage) {
    //     settings = _util.param(settings, {});
    //     defaults = _util.param(defaults, {});
    //     stage = _util.param(stage, '');
    //     for (var property in defaults) {
    //         if (defaults.hasOwnProperty(property)) {
    //             var data_property = stage + property.toLowerCase().replace('_', '-');
    //             if (typeof defaults[property] === 'object' && defaults[property] !== null) {
    //                 if (typeof settings[property] !== 'object' || settings[property] === null) settings[property] = {};
    //                 _util.applyDataToSettings($object, settings[property], defaults[property], data_property + '-');
    //             } else {
    //                 var data = $object.data(data_property);
    //                 if (typeof data !== 'undefined') {
    //                     var data_float = parseFloat(data);
    //                     if (data === 'true') data = !0;
    //                     else if (data === 'false') data = !1;
    //                     else if (data_float === data) data = data_float;
    //                     settings[property] = data;
    //                 }
    //             }
    //         }
    //     }
    //     return settings;
    // },
    elementExists: function ($element) {
        return (_util.isSet($element) && $element && $element.length > 0);
    },
    // getJustWidth: function ($element) {
    //     var element = (_util.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().width;
    //     return (cs.boxSizing === 'border-box') ? size - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth) : size;
    // },
    // getJustHeight: function ($element) {
    //     var element = (_util.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().height;
    //     return (cs.boxSizing === 'border-box') ? size - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth) : size;
    // },
    has3dSupport: (function () {
        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (transforms.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    })(),
    getTranslatePosition: function (obj, axis) {
        if (!window.getComputedStyle || (axis !== 'x' && axis !== 'y')) return 0;
        var style = getComputedStyle(obj),
            transform = style.transform || style.webkitTransform || style.mozTransform;
        if (transform) {
            var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
            if (matrix3d) return parseFloat(matrix3d[1].split(', ')[axis === 'x' ? 12 : 13]);
            var matrix = transform.match(/^matrix\((.+)\)$/);
            return matrix ? parseFloat(matrix[1].split(', ')[axis === 'x' ? 4 : 5]) : 0;
        }
        return 0;
    }
}
