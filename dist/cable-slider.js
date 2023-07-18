/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// CONCATENATED MODULE: ./src/static.js

var _static = {
  $document: external_jQuery_default()(document),
  $window: external_jQuery_default()(window),
  $html: external_jQuery_default()('html'),
  $body: external_jQuery_default()('body'),
  _event_namespace: 'CableSlider',
  _next_instance_id: 0,
  _next_transition_id: 0,
  _instances: {
    length: 0
  }
};
;// CONCATENATED MODULE: ./src/util.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _util = {
  param: function param(parameter, _default) {
    return typeof parameter !== 'undefined' ? parameter : _default;
  },
  // regexEscape: function (string) {
  //     return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // },
  isSet: function isSet(value) {
    return typeof value !== "undefined";
  },
  isFunction: function isFunction(func) {
    return typeof func === "function";
  },
  isPlainObject: function isPlainObject(obj) {
    return _typeof(obj) === "object" && obj != null && !(obj instanceof Array);
  },
  isArray: function isArray(arr) {
    return _typeof(arr) === "object" && arr instanceof Array;
  },
  isNumber: function isNumber(number, required) {
    return typeof number === "number" && (!_util.param(required, false) || number > 0);
  },
  isString: function isString(string, required) {
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
  elementExists: function elementExists($element) {
    return _util.isSet($element) && $element && $element.length > 0;
  },
  // getJustWidth: function ($element) {
  //     var element = (_util.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().width;
  //     return (cs.boxSizing === 'border-box') ? size - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth) : size;
  // },
  // getJustHeight: function ($element) {
  //     var element = (_util.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().height;
  //     return (cs.boxSizing === 'border-box') ? size - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth) : size;
  // },
  has3dSupport: function () {
    var el = document.createElement('p'),
        has3d,
        transforms = {
      'webkitTransform': '-webkit-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform',
      'MozTransform': '-moz-transform',
      'transform': 'transform'
    }; // Add it to the body to get the computed style

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
    return has3d !== undefined && has3d.length > 0 && has3d !== "none";
  }(),
  getTranslatePosition: function getTranslatePosition(obj, axis) {
    if (!window.getComputedStyle || axis !== 'x' && axis !== 'y') return 0;
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
};
;// CONCATENATED MODULE: ./src/private.js
function private_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { private_typeof = function _typeof(obj) { return typeof obj; }; } else { private_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return private_typeof(obj); }




var _private = function _private(core_self) {
  this.self = core_self;
};

_private.prototype.reset = function () {
  var self = this.self;
  self.cache = {
    images: {},
    interface_images_loading: 0,
    slide_images_loading: 0,
    thumb_images_loading: 0,
    window_width: -1
  };
  self.properties = {
    instance_id: self.properties.instance_id,
    events: self.properties.events,
    current_index: 0,
    new_index: 0,
    direction: 1,
    auto_play_timer: false,
    lazy_adjust_timer: false,
    slides_length: 0,
    container_height_easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    wrapper_transform_easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  };
  self.elements = {
    $root: null,
    $container: null,
    $wrapper: null,
    $slides: null,
    $next: null,
    $prev: null,
    $thumbs_root: null,
    $thumbs_container: null,
    $thumbs_wrapper: null,
    $thumbs: null,
    $thumbs_next: null,
    $thumbs_prev: null,
    $bullets_container: null,
    $bullets_wrapper: null,
    $bullets: null
  };
};

_private.prototype.resetAutoPlay = function () {
  var self = this.self;

  if (self.properties.auto_play_timer !== false) {
    self.play();
  }
};

_private.prototype.getValidIndex = function (slide) {
  var self = this.self;

  var index_range = self._private.getIndexRange();

  if (slide < index_range.min) {
    slide = index_range.min;
  } else if (slide > index_range.max) {
    slide = index_range.max;
  }

  return slide;
};

_private.prototype.getContainerSize = function ($container, orientation) {
  return orientation == 'vertical' ? $container.get(0).getBoundingClientRect().height : $container.get(0).getBoundingClientRect().width;
};

_private.prototype.getItemPosition = function ($item, $wrapper, container_size, orientation, align) {
  var pos = orientation == 'vertical' ? $item.offset().top - $wrapper.offset().top : $item.offset().left - $wrapper.offset().left;

  if (orientation == 'vertical') {
    if (align == 'bottom') {
      pos -= container_size - $item.get(0).getBoundingClientRect().height;
    } else if (align == 'center') {
      pos -= (container_size - $item.get(0).getBoundingClientRect().height) / 2;
    }
  } else {
    if (align == 'right') {
      pos -= container_size - $item.get(0).getBoundingClientRect().width;
    } else if (align == 'center') {
      pos -= (container_size - $item.get(0).getBoundingClientRect().width) / 2;
    }
  }

  return pos;
};

_private.prototype.getFurthestPosition = function ($last_item, $wrapper, container_size, orientation) {
  return orientation == 'vertical' ? $last_item.offset().top - $wrapper.offset().top + $last_item.get(0).getBoundingClientRect().height - container_size : $last_item.offset().left - $wrapper.offset().left + $last_item.get(0).getBoundingClientRect().width - container_size;
};

_private.prototype.getNearestPosition = function ($first_item, $wrapper, orientation) {
  return orientation == 'vertical' ? $first_item.offset().top - $wrapper.offset().top : $first_item.offset().left - $wrapper.offset().left;
};

_private.prototype.getNewCarouselPosition = function (type, new_index, container_width, container_height) {
  var self = this.self;
  new_index = _util.param(new_index, false);
  var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
      align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
      orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation,
      $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
      $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides;
  var container_size = orientation == 'vertical' ? container_height : container_width,
      new_position = 0,
      furthest_position = 0,
      nearest_position = 0;

  if (_util.elementExists($items)) {
    if ($items.length > shown) {
      new_position = self._private.getItemPosition($items.eq(new_index), $wrapper, container_size, orientation, align);
      furthest_position = self._private.getFurthestPosition($items.last(), $wrapper, container_size, orientation);
      nearest_position = self._private.getNearestPosition($items.first(), $wrapper, orientation);

      if (new_position < nearest_position) {
        new_position = nearest_position;
      }

      if (new_position > furthest_position) {
        new_position = furthest_position;
      }
    } else {
      if (align == 'bottom' || align == 'right') {
        new_position = self._private.getFurthestPosition($items.last(), $wrapper, container_size, orientation);
      } else if (align == 'center') {
        new_position = self._private.getFurthestPosition($items.last(), $wrapper, container_size, orientation) / 2;
      }
    }
  }

  if (orientation == 'vertical') {
    return {
      translate_x: 0,
      translate_y: new_position * -1
    };
  } else {
    return {
      translate_x: new_position * -1,
      translate_y: 0
    };
  }
};

_private.prototype.setCarouselPosition = function (type, translate_x, translate_y) {
  var self = this.self;
  var $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper;

  if (_util.has3dSupport) {
    $wrapper.css('transform', 'translate3d(' + translate_x + 'px,' + translate_y + 'px,0px)');
  } else {
    $wrapper.css('transform', 'translate(' + translate_x + 'px,' + translate_y + 'px)');
  }
};

_private.prototype.getRealMargin = function (margin, container_width) {
  var self = this.self;

  if (_util.isString(margin, true)) {
    var last_char = margin.slice(-1);

    if (last_char == '%') {
      var percent = parseInt(margin, 10);

      if (_util.isNumber(percent)) {
        margin = container_width * (percent / 100);
      }
    }
  }

  return margin;
};

_private.prototype.setCarouselItemsActive = function (type, new_index) {
  var self = this.self;
  new_index = _util.param(new_index, false);
  var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
      align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
      $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
      min_index = new_index,
      max_index = new_index + (shown - 1);

  if (_util.elementExists($items)) {
    $items.removeClass('active part-active first-active last-active');

    if (align == 'bottom' || align == 'right') {
      min_index = new_index - (shown - 1);
      max_index = new_index;
    } else if (align == 'center') {
      min_index = new_index - (shown - 1) / 2;
      max_index = new_index + (shown - 1) / 2;
    }

    if (min_index < 0) {
      min_index = 0;
      max_index = $items.length <= shown ? $items.length - 1 : shown - 1;
    } else if (max_index > $items.length - 1) {
      min_index = $items.length - shown;
      max_index = $items.length - 1;
    }

    $items.each(function (index) {
      var $item = external_jQuery_default()(this);

      if (index == max_index) {
        $item.addClass('last-active');
      }

      if (index == min_index) {
        $item.addClass('first-active');
      }

      if (index >= min_index && index <= max_index) {
        $item.addClass('active');
      } else {
        if (index != max_index && index == Math.ceil(max_index)) {
          $item.addClass('active last-active part-active');
        }

        if (index != min_index && index == Math.floor(min_index)) {
          $item.addClass('active first-active part-active');
        }
      }
    });
  }
};

_private.prototype.load = function () {
  var self = this.self;
};

_private.prototype.applySettings = function (force) {
  var self = this.self;
  force = force || false;

  var window_width = _static.$window.width(),
      responsive_width_keys = [],
      new_settings;

  if (force || window_width != self.cache.window_width) {
    new_settings = external_jQuery_default().extend(true, {}, self.base_settings);

    if (private_typeof(self.base_settings.responsive) === "object") {
      for (var responsive_key in self.base_settings.responsive) {
        if (self.base_settings.responsive.hasOwnProperty(responsive_key)) {
          responsive_width_keys.push(responsive_key);
        }
      }
    }

    responsive_width_keys.sort(function (a, b) {
      return a - b;
    });

    for (var i = responsive_width_keys.length; i >= 0; i--) {
      if (window_width > parseInt(responsive_width_keys[i], 10)) {
        external_jQuery_default().extend(true, new_settings, self.base_settings.responsive[responsive_width_keys[i]]);
        break;
      }
    }

    self.settings = new_settings;
  }

  self.cache.window_width = window_width;
};

_private.prototype.buildClones = function (type) {
  var self = this.self;
  var $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
      $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
      shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
      continuous = type == 'thumb' ? self.settings.thumbs_continuous : self.settings.continuous,
      min_clones = type == 'thumb' ? self.settings.thumbs_min_clones : self.settings.min_clones,
      i,
      clones_length,
      target_clones_length,
      limit;

  if (_util.elementExists($items)) {
    // remove existing clones
    $items.filter('.cable-slider-clone').remove(); // reset

    if (type == 'thumb') $items = self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');else $items = self.elements.$slides = $wrapper.find('>.cable-slider-slide');

    if (continuous) {
      if (shown + 1 > min_clones) min_clones = shown + 1; //todo should clones copy events?
      // fill

      if ($items.length < shown) {
        i = 0;
        clones_length = 0;
        target_clones_length = shown - $items.length;

        while (clones_length < target_clones_length) {
          $items.eq(i).clone(true, true).addClass('cable-slider-clone').appendTo($wrapper);
          i++;
          clones_length++;
        }

        if (type != 'thumb') {
          self.properties.slides_length = shown;
        }

        if (type == 'thumb') $items = self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');else $items = self.elements.$slides = $wrapper.find('>.cable-slider-slide');
      } // append


      i = 0;
      clones_length = 0;
      target_clones_length = min_clones;
      limit = target_clones_length > $items.length ? $items.length - 1 : target_clones_length - 1;

      while (clones_length < target_clones_length) {
        $items.eq(i).clone(true, true).addClass('cable-slider-clone').appendTo($wrapper);
        if (i >= limit) i = 0;else i++;
        clones_length++;
      } // prepend


      i = $items.length - 1;
      clones_length = 0;
      target_clones_length = min_clones;
      limit = target_clones_length > $items.length ? 0 : $items.length - target_clones_length;

      while (clones_length < target_clones_length) {
        $items.eq(i).clone(true, true).addClass('cable-slider-clone').prependTo($wrapper);
        if (i <= limit) i = $items.length - 1;else i--;
        clones_length++;
      } // reset


      if (type == 'thumb') self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');else self.elements.$slides = $wrapper.find('>.cable-slider-slide');
    }
  }
};

_private.prototype.convertIndex = function (to_type, index) {
  var self = this.self;

  if (to_type == 'thumb') {
    if (self.settings.continuous && !self.settings.thumbs_continuous) {
      index = self.elements.$slides.eq(index).data('cs-index');
    } else if (!self.settings.continuous && self.settings.thumbs_continuous) {
      self.elements.$thumbs.each(function (real_index) {
        var $item = external_jQuery_default()(this),
            cs_index = $item.data('cs-index');

        if (cs_index == index && !$item.hasClass('cable-slider-clone')) {
          index = real_index;
          return false;
        }
      });
    }
  } else {
    if (self.settings.continuous && !self.settings.thumbs_continuous) {
      var index_range = self._private.getIndexRange();

      self.elements.$slides.each(function (real_index) {
        var $item = external_jQuery_default()(this),
            cs_index = $item.data('cs-index');

        if (cs_index == index && !$item.hasClass('cable-slider-clone')) {
          index = real_index;
          return false;
        }
      });
    } else if (!self.settings.continuous && self.settings.thumbs_continuous) {
      index = self.elements.$thumbs.eq(index).data('cs-index');
    }
  }

  return index;
};

_private.prototype.getIndexRange = function () {
  var self = this.self;
  var extra_clone_count = self.elements.$slides.length > self.properties.slides_length ? Math.ceil((self.elements.$slides.length - self.settings.shown * 2 - self.properties.slides_length) / 2) : 0,
      min_index = 0,
      max_index = 0;

  if (self.elements.$slides.length > self.settings.shown) {
    min_index = extra_clone_count;
    max_index = self.elements.$slides.length - extra_clone_count - self.settings.shown;

    if (self.settings.continuous) {
      max_index -= self.settings.shown;
    }

    if (self.settings.align == 'bottom' || self.settings.align == 'right') {
      min_index = extra_clone_count + (self.settings.shown - 1);
      max_index = self.elements.$slides.length - extra_clone_count - 1;

      if (self.settings.continuous) {
        min_index += self.settings.shown;
      }
    } else if (self.settings.align == 'center') {
      min_index = extra_clone_count + Math.ceil((self.settings.shown - 1) / 2);
      max_index = self.elements.$slides.length - extra_clone_count - Math.ceil(self.settings.shown / 2);

      if (self.settings.continuous) {
        min_index += Math.ceil((self.settings.shown + 1) / 2);
        max_index -= Math.ceil((self.settings.shown - 1) / 2);
      }
    }
  } else {
    if (self.settings.align == 'bottom' || self.settings.align == 'right') {
      min_index = max_index = self.elements.$slides.length - 1;
    } else if (self.settings.align == 'center') {
      min_index = max_index = Math.floor((self.elements.$slides.length - 1) / 2);
    }
  }

  return {
    min: min_index,
    max: max_index
  };
};

_private.prototype.attachDragEvents = function () {
  var self = this.self;

  var disable_mouse = false,
      capture_space = 8,
      captured = false,
      start_x = 0,
      start_y = 0,
      move_x = 0,
      move_y = 0,
      wrapper_x = 0,
      wrapper_y = 0,
      new_position = 0,
      old_position = 0,
      start = function start(new_start_x, new_start_y, event, type) {
    start_x = new_start_x;
    start_y = new_start_y;
    move_x = start_x;
    move_y = start_y;
    wrapper_x = _util.getTranslatePosition(self.elements.$wrapper.get(0), 'x');
    wrapper_y = _util.getTranslatePosition(self.elements.$wrapper.get(0), 'y');
    captured = false;
    self.elements.$wrapper.css('transition', 'all 0s ease');

    self._private.setCarouselPosition('slide', wrapper_x, wrapper_y);

    self.pause();
    move(new_start_x, new_start_y, false, type);
  },
      move = function move(new_move_x, new_move_y, event, type) {
    move_x = new_move_x;
    move_y = new_move_y;
    var movement_x = Math.abs(move_x - start_x) - capture_space,
        movement_y = Math.abs(move_y - start_y) - capture_space;
    if (type != 'touch') captured = true;

    if (!captured) {
      if ((movement_x > 0 || movement_y > 0) && (movement_y >= movement_x && self.settings.orientation == 'vertical' || movement_x >= movement_y)) {
        captured = true;
      } else {
        if ((movement_x > 0 || movement_y > 0) && (movement_y < movement_x && self.settings.orientation == 'vertical' || movement_x < movement_y)) {
          end(event, type);
        }

        return;
      }
    }

    if (event) {
      event.preventDefault();
    }

    if (captured) {
      var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
          index_range = self._private.getIndexRange(),
          furthest_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.max), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1,
          nearest_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.min), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1;

      if (self.elements.$slides.length < self.settings.shown) {
        if (self.settings.align == 'bottom' || self.settings.align == 'right') {
          furthest_position = nearest_position = self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation) * -1;
        } else if (self.settings.align == 'center') {
          furthest_position = nearest_position = self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation) / 2 * -1;
        }
      }

      self.elements.$slides.removeClass('active part-active first-active last-active');

      if (self.settings.orientation == 'vertical') {
        old_position = wrapper_y;
        new_position = wrapper_y + (move_y - start_y);

        if (self.settings.continuous) {
          if (new_position < furthest_position) {
            start_y = move_y;
            wrapper_y = nearest_position;
            old_position = wrapper_y;
            new_position = wrapper_y;
            self.properties.current_index -= self.properties.slides_length;
          } else if (new_position > nearest_position) {
            start_y = move_y;
            wrapper_y = furthest_position;
            old_position = wrapper_y;
            new_position = wrapper_y;
            self.properties.current_index += self.properties.slides_length;
          }
        } else {
          if (new_position < furthest_position) new_position = furthest_position + (new_position - furthest_position) / 3;else if (new_position > nearest_position) new_position = nearest_position + (new_position - nearest_position) / 3;
        }

        if (new_position < furthest_position) new_position = furthest_position + (new_position - furthest_position) / 3;
        if (new_position > nearest_position) new_position = nearest_position + (new_position - nearest_position) / 3;

        self._private.setCarouselPosition('slide', 0, new_position);
      } else {
        old_position = wrapper_x;
        new_position = wrapper_x + (move_x - start_x);

        if (self.settings.continuous) {
          if (new_position < furthest_position) {
            start_x = move_x;
            wrapper_x = nearest_position;
            old_position = wrapper_x;
            new_position = wrapper_x;
            self.properties.current_index -= self.properties.slides_length;
          } else if (new_position > nearest_position) {
            start_x = move_x;
            wrapper_x = furthest_position;
            old_position = wrapper_x;
            new_position = wrapper_x;
            self.properties.current_index += self.properties.slides_length;
          }
        } else {
          if (new_position < furthest_position) new_position = furthest_position + (new_position - furthest_position) / 3;else if (new_position > nearest_position) new_position = nearest_position + (new_position - nearest_position) / 3;
        }

        self._private.setCarouselPosition('slide', new_position, 0);
      }
    }

    return false;
  },
      end = function end(event, type) {
    _static.$document.off('touchmove.' + _static._event_namespace);

    _static.$document.off('touchend.' + _static._event_namespace);

    _static.$document.off('mousemove.' + _static._event_namespace);

    _static.$document.off('mouseup.' + _static._event_namespace);

    disable_mouse = false;

    if (captured) {
      var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
          index_range = self._private.getIndexRange(),
          $check_item,
          item_position,
          j = -1,
          d = 0,
          j_difference = -1,
          n_position,
          n_difference;

      for (var i = 0; i < self.elements.$slides.length; i++) {
        $check_item = self.elements.$slides.eq(i);
        item_position = self._private.getItemPosition($check_item, self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align);
        n_position = new_position * -1;
        n_difference = Math.abs(item_position - n_position);

        if (j_difference < 0 || n_difference < j_difference) {
          j_difference = n_difference;
          j = i;
        }
      }

      if (j >= 0) {
        if (j == self.properties.current_index) {
          if (j_difference > capture_space) {
            if (old_position > new_position) {
              j++;
              d = 1;
            } else if (old_position < new_position) {
              j--;
              d = -1;
            }
          } else {
            captured = false;
          }
        }

        if (j < index_range.min) j = index_range.min;else if (j > index_range.max) j = index_range.max;
        self.goTo(j, d);
      }
    }

    if (self.settings.auto_play) {
      self.play();
    }

    if (captured) {
      var $target = external_jQuery_default()(event.target);

      if ($target.closest(self.elements.$container).length) {
        external_jQuery_default()(event.target).one('click', function (e) {
          //TODO need to test if this works on final level elements with click listeners.
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        });
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return !captured;
  };

  if (_util.elementExists(self.elements.$container)) {
    self.elements.$container.css('touch-action', 'manipulation');
    self.elements.$container.off('dragstart.' + _static._event_namespace).on('dragstart.' + _static._event_namespace, function (e) {
      e.preventDefault();
    });
    self.elements.$container.off('touchstart.' + _static._event_namespace).on('touchstart.' + _static._event_namespace, function (e) {
      disable_mouse = true;
      start(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e, 'touch');

      _static.$document.off('touchmove.' + _static._event_namespace).on('touchmove.' + _static._event_namespace, function (e) {
        move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e, 'touch');
      });

      _static.$document.off('touchend.' + _static._event_namespace).on('touchend.' + _static._event_namespace, function (e) {
        return end(e, 'touch');
      });
    });
    self.elements.$container.off('mousedown.' + _static._event_namespace).on('mousedown.' + _static._event_namespace, function (e) {
      if (!disable_mouse && e.which == 1) {
        start(e.pageX, e.pageY, e, 'mouse');

        _static.$document.off('mousemove.' + _static._event_namespace).on('mousemove.' + _static._event_namespace, function (e) {
          move(e.pageX, e.pageY, e, 'mouse');
        });

        _static.$document.off('mouseup.' + _static._event_namespace).on('mouseup.' + _static._event_namespace, function (e) {
          return end(e, 'mouse');
        });
      }
    });
    self.elements.$container.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
      if (captured) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    });
  }
};

_private.prototype.attachEvents = function () {
  var self = this.self;

  var pauseAutoPlay = function pauseAutoPlay() {
    self.pause();
  };

  var resumeAutoPlay = function resumeAutoPlay() {
    if (self.settings.auto_play) {
      self.play();
    }
  }; // attach listeners


  if (_util.elementExists(self.elements.$next)) {
    self.elements.$next.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
      e.preventDefault();
      self.next();
    });

    if (self.settings.hover_pause) {
      self.elements.$next.off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay).off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
    }
  }

  if (_util.elementExists(self.elements.$prev)) {
    self.elements.$prev.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
      e.preventDefault();
      self.prev();
    });

    if (self.settings.hover_pause) {
      self.elements.$prev.off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay).off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
    }
  }

  if (_util.elementExists(self.elements.$container)) {
    if (self.settings.hover_pause) {
      self.elements.$container.off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay).off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
    }
  }

  if (self.settings.draggable) {
    self._private.attachDragEvents();
  }

  if (_util.elementExists(self.elements.$thumbs_container)) {
    if (self.settings.hover_pause) {
      self.elements.$thumbs_container.off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay).off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
    }
  }

  if (_util.elementExists(self.elements.$thumbs)) {
    self.elements.$thumbs.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
      e.preventDefault();

      var $item = external_jQuery_default()(this),
          new_slide_index = self._private.convertIndex('slide', $item.data('cs-index'));

      self.shift(new_slide_index - self.properties.current_index);
    });
  }
};

_private.prototype.build = function () {
  var self = this.self;

  if (!_util.elementExists(self.elements.$container)) {
    var i,
        $root = external_jQuery_default()(self.settings.container).eq(0),
        $container,
        $wrapper,
        $slides,
        $tmp_slides;
    if ($root.length == 0) return;
    $tmp_slides = $root.find('>*');
    if ($tmp_slides.length == 0) return;
    $tmp_slides.wrapAll('<div class="cable-slider-container"><div class="cable-slider-wrapper"></div></div>');
    $tmp_slides.wrap('<div class="cable-slider-slide"></div>');
    $container = $root.find('>.cable-slider-container').eq(0);
    $wrapper = $container.find('>.cable-slider-wrapper').eq(0);
    $slides = $wrapper.find('>.cable-slider-slide');
    if (!_util.isNumber(self.settings.shown) || self.settings.shown < 1) self.settings.shown = 1;
    self.elements.$root = $root;
    self.elements.$container = $container;
    self.elements.$wrapper = $wrapper;
    self.elements.$slides = $slides;
    self.properties.slides_length = $slides.length;
    $slides.each(function (i) {
      external_jQuery_default()(this).data('cs-index', i);
    }); // thumbs

    var $thumbs_root = external_jQuery_default()(self.settings.thumbs_container).eq(0),
        $thumbs_container = null,
        $thumbs_wrapper = null,
        $thumbs = null,
        $tmp_thumbs = null;

    if ($thumbs_root.length) {
      if (self.settings.auto_thumbs) {
        $thumbs_root.html('<div class="cable-slider-thumbs-container"><div class="cable-slider-thumbs-wrapper"></div></div>');
        $thumbs_container = $thumbs_root.find('.cable-slider-thumbs-container');
        $thumbs_wrapper = $thumbs_container.find('.cable-slider-thumbs-wrapper');
        $slides.each(function () {
          var $slide_first_img = external_jQuery_default()(this).find('img').eq(0);

          if ($slide_first_img.length) {
            $thumbs_wrapper.append(external_jQuery_default()('<div class="cable-slider-thumb"></div>').append($slide_first_img.clone()));
          }
        });
        $thumbs = $thumbs_wrapper.find('>.cable-slider-thumb');
      } else {
        $tmp_thumbs = $thumbs_root.find('>*');

        if ($tmp_thumbs.length) {
          $tmp_thumbs.wrapAll('<div class="cable-slider-thumbs-container"><div class="cable-slider-thumbs-wrapper"></div></div>');
          $tmp_thumbs.wrap('<div class="cable-slider-thumb"></div>');
          $thumbs_container = $thumbs_root.find('>.cable-slider-thumbs-container').eq(0);
          $thumbs_wrapper = $thumbs_container.find('>.cable-slider-thumbs-wrapper').eq(0);
          $thumbs = $thumbs_wrapper.find('>.cable-slider-thumb');
        }
      }

      if (_util.elementExists($thumbs)) {
        $thumbs.each(function (i) {
          external_jQuery_default()(this).data('cs-index', i);
        });
      }
    }

    self.elements.$thumbs_root = $thumbs_root;
    self.elements.$thumbs_container = $thumbs_container;
    self.elements.$thumbs_wrapper = $thumbs_wrapper;
    self.elements.$thumbs = $thumbs;

    self._private.buildClones('slide');

    self._private.buildClones('thumb');

    self.elements.$next = external_jQuery_default()(self.settings.next);
    self.elements.$prev = external_jQuery_default()(self.settings.prev);

    self._private.attachEvents();
  }
};

_private.prototype.changeSlide = function (slide, direction) {
  var self = this.self;
  direction = _util.param(direction, 0);
  var slide_element = external_jQuery_default()(slide).get(0),
      // accounts for jquery object or standard element
  $slide = null,
      new_index = -1;

  if (slide_element) {
    self.elements.$slides.each(function (index) {
      if (this === slide_element) {
        $slide = external_jQuery_default()(this);
        new_index = index;
        return false;
      }
    });

    if ($slide && new_index >= 0) {
      self.properties.new_index = new_index;

      if (direction == 1 || direction == -1) {
        self.properties.direction = direction;
      } else {
        self.properties.direction = new_index < self.properties.current_index ? -1 : 1;
      } // set which slides need animations


      self.adjust(true, true);
    }
  }
};

_private.prototype.setItemsActivity = function (type, new_index, orientation) {
  var self = this.self;
  var data = {
    new_container_height: 0
  };
  var $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides;

  if (_util.elementExists($items)) {
    // activity start
    if (type == 'slide' && _util.elementExists(self.elements.$thumbs)) {
      self.elements.$thumbs.removeClass('focus');
    }

    self._private.setCarouselItemsActive(type, new_index); // activity end
    // container height start


    $items.each(function () {
      var $item = external_jQuery_default()(this),
          item_height = $item[0].getBoundingClientRect().height; // should have border-box set for box-sizing

      if (self.settings.active_height) {
        if ($item.hasClass('active')) {
          if (orientation == 'vertical') {
            if (!$item.hasClass('last-active') && !$item.hasClass('part-active')) {
              item_height += $item.outerHeight(true) - $item.outerHeight(false);
            }

            if ($item.hasClass('part-active')) {
              item_height /= 2;
            }

            data.new_container_height += item_height;
          } else {
            if (item_height > data.new_container_height) {
              data.new_container_height = item_height;
            }
          }
        }
      } else {
        if (orientation == 'vertical') {
          data.new_container_height += item_height;
        } else {
          if (item_height > data.new_container_height) {
            data.new_container_height = item_height;
          }
        }
      }

      if ($item.hasClass('active')) {
        if (type == 'slide' && _util.elementExists(self.elements.$thumbs)) {
          self.elements.$thumbs.eq($item.data('cs-index')).addClass('focus');
        }
      }
    });
  }

  return data;
};

_private.prototype.prepareAdjust = function (type, animate) {
  var self = this.self;
  animate = _util.param(animate, false);
  var data,
      $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
      $container = type == 'thumb' ? self.elements.$thumbs_container : self.elements.$container,
      $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
      shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
      margin = type == 'thumb' ? self.settings.thumbs_margin : self.settings.margin,
      orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation;

  if (_util.elementExists($items)) {
    // layout start
    self._private.applySettings();

    $container.css({
      'transition': 'all 0s ease'
    });
    $wrapper.css({
      'transition': 'all 0s ease'
    });
    data = {
      current_index: self.properties.current_index,
      new_index: self.properties.new_index,
      container_width: $container.get(0).getBoundingClientRect().width,
      container_height: $container.get(0).getBoundingClientRect().height,
      new_container_height: 0
    };

    if (type == 'thumb') {
      data.current_index = self._private.convertIndex('thumb', data.current_index);
      data.new_index = self._private.convertIndex('thumb', data.new_index);
    }

    margin = self._private.getRealMargin(margin, data.container_width);
    var new_wrapper_width = 0,
        new_wrapper_height = 0,
        slide_css = {};

    if (orientation == 'vertical') {
      slide_css = {
        'width': data.container_width,
        'height': 'auto',
        'float': 'none',
        'transition': 'all 0s ease'
      };

      if (_util.isNumber(margin)) {
        slide_css['margin-bottom'] = margin + 'px';
      }
    } else {
      slide_css = {
        'width': (data.container_width - margin * (shown - 1)) / shown + 'px',
        'height': 'auto',
        'float': 'left',
        'transition': 'all 0s ease'
      };

      if (_util.isNumber(margin)) {
        slide_css['margin-right'] = margin + 'px';
      }
    }

    $items.css(slide_css).each(function () {
      new_wrapper_width += external_jQuery_default()(this).outerWidth(true) + 1;
      new_wrapper_height += external_jQuery_default()(this).outerHeight(true) + 1;
    });

    if (orientation == 'vertical') {
      $wrapper.css({
        'width': '',
        'height': new_wrapper_height + 'px'
      });
    } else {
      $wrapper.css({
        'width': new_wrapper_width + 'px',
        'height': ''
      });
    } // layout end


    var activity_data = self._private.setItemsActivity(type, data.current_index, orientation);

    $container.css('height', activity_data.new_container_height + 'px');

    if (!animate) {
      var new_carousel_position_data = self._private.getNewCarouselPosition(type, data.current_index, data.container_width, activity_data.new_container_height);

      self._private.setCarouselPosition(type, new_carousel_position_data.translate_x, new_carousel_position_data.translate_y);
    }

    activity_data = self._private.setItemsActivity(type, data.new_index, orientation);
    data.new_container_height = activity_data.new_container_height;
  } else {
    data = false;
  }

  return data;
};
;// CONCATENATED MODULE: ./src/default-settings.js
var _default_settings = {
  container: false,
  next: false,
  prev: false,
  shown: 1,
  orientation: 'horizontal',
  align: 'left',
  // for multiple items, set the zero point
  margin: false,
  //loop: false,
  continuous: false,
  min_clones: 0,
  draggable: true,
  thumbs_container: false,
  thumbs_next: false,
  thumbs_prev: false,
  thumbs_shown: 3,
  thumbs_orientation: 'horizontal',
  thumbs_align: 'center',
  // for multiple items, set the zero point
  thumbs_margin: false,
  //thumbs_loop: false,
  thumbs_continuous: false,
  thumbs_min_clones: 0,
  auto_thumbs: false,
  // will remove existing html inside thumbs container if it exists
  //bullets_container: false,
  auto_play: false,
  // set a number for a time period. false or 0 will not auto play.
  hover_pause: false,
  auto_create: true,
  active_height: true,
  responsive: {}
};
;// CONCATENATED MODULE: ./src/core.js





var core_core = function _core(settings) {
  var self = this;
  self._private = new _private(self); //defaults for pass through values

  self.properties = {
    instance_id: _static._next_instance_id,
    events: {}
  };

  self._private.reset();

  self.base_settings = external_jQuery_default().extend(true, {}, self.default_settings, _util.param(settings, {}));

  self._private.applySettings(true); // use base settings and the responsive settings inside to get overall settings


  _static._next_instance_id++;
  _static._instances[self.properties.instance_id] = self;
  _static._instances.length++;
  if (self.settings.auto_create) self.create();
};
core_core.prototype.version = "0.1.21";
core_core.prototype.default_settings = _default_settings;

core_core.prototype.create = function () {
  var self = this;
  self.destroy();
  self.trigger('create');

  self._private.build();

  if (!_util.elementExists(self.elements.$slides)) return;

  self._private.load(); // first adjust


  self._private.prepareAdjust('slide');

  self._private.prepareAdjust('thumb');

  self.adjust(false, true);
  self.goTo(self.settings.continuous ? Math.floor((self.elements.$slides.length - self.properties.slides_length) / 2) : 0, 0);
  self.adjust(false, true);

  if (self.settings.auto_play) {
    self.play();
  }

  self.trigger('after_create');
};

core_core.prototype.destroy = function () {
  var self = this;

  if (self.elements.$container) {
    self.elements.$container.remove();

    if (_util.isSet(_static._instances[self.properties.instance_id])) {
      delete _static._instances[self.properties.instance_id];
      _static._instances.length--;
    }

    self._private.reset();
  }
};

core_core.prototype.update = function (settings) {
  var self = this;
  external_jQuery_default().extend(true, self.base_settings, _util.param(settings, {}));

  self._private.applySettings(true);

  self.adjust(false, true);
};

core_core.prototype.adjust = function (animate, immediate) {
  var self = this;
  animate = _util.param(animate, true);
  immediate = _util.param(immediate, true);
  if (self.properties.direction != 1 && self.properties.direction != -1) self.properties.direction = 1;

  if (!immediate) {
    if (self.properties.lazy_adjust_timer !== false) {
      return;
    } else {
      self.properties.lazy_adjust_timer = setTimeout(function () {
        self.properties.lazy_adjust_timer = false;
        self.adjust(animate, true);
      }, 300);
    }

    return;
  } else {
    if (self.properties.lazy_adjust_timer !== false) {
      clearTimeout(self.properties.lazy_adjust_timer);
      self.properties.lazy_adjust_timer = false;
    }
  }

  if (_util.elementExists(self.elements.$slides)) {
    self.trigger('adjust');

    var slide_adjust_data = self._private.prepareAdjust('slide', animate),
        thumb_adjust_data = self._private.prepareAdjust('thumb', animate),
        new_slide_carousel_position_data = self._private.getNewCarouselPosition('slide', slide_adjust_data.new_index, slide_adjust_data.container_width, slide_adjust_data.new_container_height),
        new_thumb_carousel_position_data = self._private.getNewCarouselPosition('thumb', thumb_adjust_data.new_index, thumb_adjust_data.container_width, thumb_adjust_data.new_container_height),
        transition_seconds = 0,
        difference = 0,
        old_translate_position = 0,
        new_translate_position = 0;

    if (slide_adjust_data) {
      self.elements.$container.css({
        'transition': 'height 0.5s ' + self.properties.container_height_easing
      });

      if (animate) {
        difference = Math.abs(slide_adjust_data.new_index - slide_adjust_data.current_index);
        transition_seconds = Math.round(difference / 5 * 100) / 100;
        if (transition_seconds > 1) transition_seconds = 1;else if (transition_seconds < 0.4) transition_seconds = 0.4;
        self.elements.$wrapper.css({
          'transition': 'transform ' + transition_seconds + 's ' + self.properties.wrapper_transform_easing
        });
      }

      if (thumb_adjust_data) {
        self.elements.$thumbs_container.css({
          'transition': 'height 0.5s ' + self.properties.container_height_easing
        });

        if (animate) {
          difference = Math.abs(thumb_adjust_data.new_index - thumb_adjust_data.current_index);
          transition_seconds = Math.round(difference / 5 * 100) / 100;
          if (transition_seconds > 1) transition_seconds = 1;else if (transition_seconds < 0.4) transition_seconds = 0.4;
          self.elements.$thumbs_wrapper.css({
            'transition': 'transform ' + transition_seconds + 's ' + self.properties.wrapper_transform_easing
          });
        }
      }

      self.properties.current_index = self.properties.new_index;
      setTimeout(function () {
        // animate container height
        self.elements.$container.css('height', slide_adjust_data.new_container_height + 'px'); // animate slides

        self._private.setCarouselPosition('slide', new_slide_carousel_position_data.translate_x, new_slide_carousel_position_data.translate_y);

        if (thumb_adjust_data) {
          //animate thumb container height
          self.elements.$thumbs_container.css('height', thumb_adjust_data.new_container_height + 'px'); // animate thumbs

          self._private.setCarouselPosition('thumb', new_thumb_carousel_position_data.translate_x, new_thumb_carousel_position_data.translate_y);

          self.trigger('after_adjust');
        } else {
          self.trigger('after_adjust');
        }
      }, 0);
    }
  }
};

core_core.prototype.isReady = function () {// if minimum loaded images is true
};

core_core.prototype.goTo = function (slide, direction) {
  var self = this;

  self._private.resetAutoPlay();

  if (_util.isNumber(slide)) {
    slide = self._private.getValidIndex(slide);

    self._private.changeSlide(self.elements.$slides.get(slide), direction);
  } else {
    self._private.changeSlide(slide, direction);
  }
};

core_core.prototype.shift = function (amount) {
  var self = this;

  if (_util.isNumber(amount) && amount != 0) {
    self.goTo(self.properties.current_index + amount, amount < 0 ? -1 : 1);
  }
};

core_core.prototype.next = function () {
  var self = this;
  var new_index = self.properties.current_index + 1;

  var index_range = self._private.getIndexRange();

  if (new_index > index_range.max) {
    if (self.elements.$slides.length > self.properties.slides_length && self.settings.continuous) {
      self.elements.$wrapper.css({
        'transition': 'all 0s ease'
      });

      var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
          new_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.min), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1;

      if (self.settings.orientation == 'vertical') {
        self._private.setCarouselPosition('slide', 0, new_position);
      } else {
        self._private.setCarouselPosition('slide', new_position, 0);
      }

      self.properties.current_index = index_range.min;
      new_index = index_range.min + 1;
    } else {
      new_index = index_range.min;
    }
  }

  self.goTo(new_index, 1);
};

core_core.prototype.prev = function () {
  var self = this;
  var new_index = self.properties.current_index - 1;

  var index_range = self._private.getIndexRange();

  if (new_index < index_range.min) {
    if (self.elements.$slides.length > self.properties.slides_length && self.settings.continuous) {
      self.elements.$wrapper.css({
        'transition': 'all 0s ease'
      });

      var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
          new_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.max), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1;

      if (self.settings.orientation == 'vertical') {
        self._private.setCarouselPosition('slide', 0, new_position);
      } else {
        self._private.setCarouselPosition('slide', new_position, 0);
      }

      self.properties.current_index = index_range.max;
      new_index = index_range.max - 1;
    } else {
      new_index = index_range.max;
    }
  }

  self.goTo(new_index, -1);
};

core_core.prototype.play = function () {
  var self = this;
  self.pause();
  var timeout_ms = _util.isNumber(self.settings.auto_play) ? parseInt(self.settings.auto_play, 10) : 3000;
  self.properties.auto_play_timer = setTimeout(function () {
    self.next();
  }, timeout_ms);
};

core_core.prototype.pause = function () {
  var self = this;

  if (self.properties.auto_play_timer !== false) {
    clearTimeout(self.properties.auto_play_timer);
    self.properties.auto_play_timer = false;
  }
};

core_core.prototype.on = function (event, handler) {
  var self = this;
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : '_default';
    if (!_util.isPlainObject(self.properties.events[event_type])) self.properties.events[event_type] = {};
    if (!_util.isArray(self.properties.events[event_type][event_name])) self.properties.events[event_type][event_name] = [];
    self.properties.events[event_type][event_name].push(handler);
  }
};

core_core.prototype.off = function (event, handler) {
  var self = this;
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : false;

    if (_util.isPlainObject(self.properties.events[event_type])) {
      for (var current_event_name in self.properties.events[event_type]) {
        if (self.properties.events[event_type].hasOwnProperty(current_event_name) && _util.isArray(self.properties.events[event_type][current_event_name]) && (event_name === false || event_name === current_event_name)) {
          if (_util.isFunction(handler)) {
            for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
              if (self.properties.events[event_type][current_event_name][i] === handler) {
                self.properties.events[event_type][current_event_name].splice(i, 1);
                i--;
              }
            }
          } else self.properties.events[event_type][current_event_name] = [];
        }
      }
    }
  }
};

core_core.prototype.trigger = function (event, handler, params) {
  var self = this;
  params = _util.isArray(params) ? params : [];
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : false;

    if (_util.isFunction(self.settings[event_type])) {
      self.settings[event_type]();
    }

    if (_util.isPlainObject(self.properties.events[event_type])) {
      for (var current_event_name in self.properties.events[event_type]) {
        if (self.properties.events[event_type].hasOwnProperty(current_event_name) && _util.isArray(self.properties.events[event_type][current_event_name]) && (event_name === false || event_name === current_event_name)) {
          for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
            if (_util.isFunction(self.properties.events[event_type][current_event_name][i]) && (!_util.isFunction(handler) || self.properties.events[event_type][current_event_name][i] === handler)) {
              self.properties.events[event_type][current_event_name][i].apply(self, params);
            }
          }
        }
      }
    }
  }
};
;// CONCATENATED MODULE: ./src/cable-slider.js


 // global events

_static.$window.off('resize.' + _static._event_namespace).on('resize.' + _static._event_namespace, function () {
  if (_static._instances.length > 0) {
    for (var i in _static._instances) {
      if (_static._instances.hasOwnProperty(i)) {
        if (_static._instances[i] instanceof core_core) {
          _static._instances[i].adjust(false, false);
        }
      }
    }
  }
});

(external_jQuery_default()).CableSlider = core_core;
/* harmony default export */ const cable_slider = ((/* unused pure expression or super */ null && (_core)));
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
// extracted by mini-css-extract-plugin

})();

/******/ })()
;