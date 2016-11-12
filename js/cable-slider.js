(function ($, window, document) {

    var _private = function () {
        },
        _static = {
            $document: $(document),
            $window: $(window),
            $html: $('html'),
            $body: $('body'),
            _event_namespace: 'CableSlider',
            _next_instance_id: 0,
            _next_transition_id: 0,
            _instances: {length: 0}
        };

    _static.param = function (parameter, _default) {
        return (typeof parameter !== 'undefined' ? parameter : _default);
    };
    _static.regexEscape = function (string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    _static.isSet = function (value) {
        return typeof value !== "undefined";
    };
    _static.isFunction = function (func) {
        return typeof func === "function";
    };
    _static.isPlainObject = function (obj) {
        return typeof obj === "object" && obj != null && !(obj instanceof Array);
    };
    _static.isArray = function (arr) {
        return typeof arr === "object" && arr instanceof Array;
    };
    _static.isNumber = function (number, required) {
        return typeof number === "number" && (!_static.param(required, false) || number > 0);
    };
    _static.isString = function (string, required) {
        return typeof string === "string" && (!_static.param(required, false) || string != '');
    };
    _static.getAttributeString = function ($object, attr) {
        var val = $object.attr(attr);
        return (typeof val === 'undefined' || val === false || val === '') ? '' : val;
    };
    _static.indexOf = function (value, array, strict) {
        strict = strict || false;
        if (array instanceof Array) {
            for (var i = 0; i < array.length; i++) {
                if (strict) {
                    if (array[i] === value) {
                        return i;
                    }
                } else if (array[i] == value) {
                    return i;
                }
            }
        }
        return -1;
    };
    _static.trim = function (string) {
        return (_static.isString(string)) ? string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : string;
    };
    _static.applyDataToSettings = function ($object, settings, defaults, stage) {
        settings = _static.param(settings, {});
        defaults = _static.param(defaults, {});
        stage = _static.param(stage, '');
        for (var property in defaults) {
            if (defaults.hasOwnProperty(property)) {
                var data_property = stage + property.toLowerCase().replace('_', '-');
                if (typeof defaults[property] === 'object' && defaults[property] !== null) {
                    if (typeof settings[property] !== 'object' || settings[property] === null) settings[property] = {};
                    _static.applyDataToSettings($object, settings[property], defaults[property], data_property + '-');
                } else {
                    var data = $object.data(data_property);
                    if (typeof data !== 'undefined') {
                        var data_float = parseFloat(data);
                        if (data == 'true') data = !0; else if (data == 'false') data = !1; else if (data_float == data) data = data_float;
                        settings[property] = data;
                    }
                }
            }
        }
        return settings;
    };
    _static.elementExists = function ($element) {
        return (_static.isSet($element) && $element && $element.length > 0);
    };

    _static.getJustWidth = function ($element) {
        var element = (_static.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().width;
        return (cs.boxSizing == 'border-box') ? size - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth) : size;
    };
    _static.getJustHeight = function ($element) {
        var element = (_static.isSet($element.length)) ? $element.get(0) : $element, cs = getComputedStyle(element), size = element.getBoundingClientRect().height;
        return (cs.boxSizing == 'border-box') ? size - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth) : size;
    };

    _static.has3dSupport = (function () {
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
    })();

    _static.getTranslatePosition = function (obj, axis) {
        if (!window.getComputedStyle || (axis !== 'x' && axis !== 'y')) return 0;
        var style = getComputedStyle(obj),
            transform = style.transform || style.webkitTransform || style.mozTransform;
        if (transform) {
            var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
            if (matrix3d) return parseFloat(matrix3d[1].split(', ')[axis == 'x' ? 12 : 13]);
            var matrix = transform.match(/^matrix\((.+)\)$/);
            return matrix ? parseFloat(matrix[1].split(', ')[axis == 'x' ? 4 : 5]) : 0;
        }
        return 0;
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
            slides_length:0,
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

    _private.prototype.getValidSlideNumber = function (slide) {
        var self = this.self;
        var total_slides = self.elements.$slides.length;
        if (slide < 0) {
            slide = slide % -total_slides;
        }
        else if (slide > total_slides - 1) {
            slide = slide % total_slides;
        }
        return slide;
    };

    _private.prototype.getContainerSize = function ($container, orientation) {
        return orientation == 'vertical' ? $container.get(0).getBoundingClientRect().height : $container.get(0).getBoundingClientRect().width;
    };

    _private.prototype.getItemPosition = function ($item, $wrapper, container_size, orientation, align) {
        var pos = orientation == 'vertical' ? ($item.offset().top - $wrapper.offset().top) : ($item.offset().left - $wrapper.offset().left);
        if (orientation == 'vertical') {
            if (align == 'bottom') {
                pos -= container_size - $item.get(0).getBoundingClientRect().height;
            }
            else if (align == 'center') {
                pos -= (container_size - $item.get(0).getBoundingClientRect().height) / 2;
            }
        }
        else {
            if (align == 'right') {
                pos -= container_size - $item.get(0).getBoundingClientRect().width;
            }
            else if (align == 'center') {
                pos -= (container_size - $item.get(0).getBoundingClientRect().width) / 2;
            }
        }
        return pos;
    };

    _private.prototype.getFurthestPosition = function ($last_item, $wrapper, container_size, orientation) {
        return orientation == 'vertical' ? (($last_item.offset().top - $wrapper.offset().top) + $last_item.get(0).getBoundingClientRect().height) - container_size : (($last_item.offset().left - $wrapper.offset().left) + $last_item.get(0).getBoundingClientRect().width) - container_size;
    };

    _private.prototype.getNearestPosition = function ($first_item, $wrapper, orientation) {
        return orientation == 'vertical' ? (($first_item.offset().top - $wrapper.offset().top)) : (($first_item.offset().left - $wrapper.offset().left));
    };

    _private.prototype.getNewCarouselPosition = function (type, new_index, container_width, container_height) {
        var self = this.self;
        new_index = _static.param(new_index, false);

        var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
            orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation,
            $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides;

        var container_size = orientation == 'vertical' ? container_height : container_width,
            new_position = 0,
            furthest_position = 0,
            nearest_position = 0;

        if (_static.elementExists($items)) {
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
            }
            else {
                if (align == 'bottom' || align == 'right') {
                    new_position = self._private.getFurthestPosition($items.last(), $wrapper, container_size, orientation);
                }
                else if (align == 'center') {
                    new_position = self._private.getFurthestPosition($items.last(), $wrapper, container_size, orientation) / 2;
                }
            }
        }

        if (orientation == 'vertical') {
            return {
                translate_x: 0,
                translate_y: new_position * -1
            };
        }
        else {
            return {
                translate_x: new_position * -1,
                translate_y: 0
            };
        }

    };

    _private.prototype.setCarouselPosition = function (type, translate_x, translate_y) {
        var self = this.self;
        var $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper;
        if (_static.has3dSupport) {
            $wrapper.css('transform', 'translate3d(' + (translate_x) + 'px,' + (translate_y) + 'px,0px)');
        }
        else {
            $wrapper.css('transform', 'translate(' + (translate_x) + 'px,' + (translate_y) + 'px)');
        }
    };

    _private.prototype.getRealMargin = function (margin, container_width) {
        var self = this.self;
        if (_static.isString(margin, true)) {
            var last_char = margin.slice(-1);
            if (last_char == '%') {
                var percent = parseInt(margin, 10);
                if (_static.isNumber(percent)) {
                    margin = container_width * (percent / 100);
                }
            }
        }
        return margin;
    };

    _private.prototype.setCarouselItemsActive = function (type, new_index) {
        var self = this.self;
        new_index = _static.param(new_index, false);

        var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            min_index = new_index,
            max_index = new_index + (shown - 1);

        if (_static.elementExists($items)) {
            $items.removeClass('active part-active first-active last-active');

            if (align == 'bottom' || align == 'right') {
                min_index = new_index - (shown - 1);
                max_index = new_index;
            }
            else if (align == 'center') {
                min_index = new_index - ((shown - 1) / 2);
                max_index = new_index + ((shown - 1) / 2);
            }

            if (min_index < 0) {
                min_index = 0;
                max_index = ($items.length <= shown) ? $items.length - 1 : shown - 1;
            }
            else if (max_index > $items.length - 1) {
                min_index = $items.length - shown;
                max_index = $items.length - 1;
            }

            $items.each(function (index) {
                var $item = $(this);
                if (index == max_index) {
                    $item.addClass('last-active');
                }
                if (index == min_index) {
                    $item.addClass('first-active');
                }
                if (index >= min_index && index <= max_index) {
                    $item.addClass('active');
                }
                else {
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
            new_settings = $.extend(true, {}, self.base_settings);

            if (typeof self.base_settings.responsive === "object") {
                for (var responsive_key in self.base_settings.responsive) {
                    if (self.base_settings.responsive.hasOwnProperty(responsive_key)) {
                        responsive_width_keys.push(responsive_key);
                    }
                }
            }

            responsive_width_keys.sort(function (a, b) {
                return a - b
            });

            for (var i = responsive_width_keys.length; i >= 0; i--) {
                if (window_width > parseInt(responsive_width_keys[i], 10)) {
                    $.extend(true, new_settings, self.base_settings.responsive[responsive_width_keys[i]]);
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
            limit;

        // remove existing clones
        $items.filter('.cable-slider-clone').remove();

        // reset
        if (type == 'thumb') $items = self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');
        else $items = self.elements.$slides = $wrapper.find('>.cable-slider-slide');

        if (continuous && _static.elementExists($items)) {

            if (shown+1 > min_clones) min_clones = shown+1;

            //todo should clones copy events?

            // prepend
            clones_length = 0;
            limit = (min_clones > $items.length) ? 0 : $items.length - (min_clones);
            while (clones_length < min_clones) {
                for (i = $items.length - 1; i >= limit; i--) {
                    $items.eq(i).clone().addClass('cable-slider-clone').prependTo($wrapper);
                    clones_length++;
                }
            }

            // append
            clones_length = 0;
            limit = (min_clones > $items.length) ? $items.length : min_clones;
            while (clones_length < min_clones) {
                for (i = 0; i < limit; i++) {
                    $items.eq(i).clone().addClass('cable-slider-clone').appendTo($wrapper);
                    clones_length++;
                }
            }

            // reset
            if (type == 'thumb') self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');
            else self.elements.$slides = $wrapper.find('>.cable-slider-slide');
        }
    };

    _private.prototype.getIndexRange = function () {
        var self = this.self;
        var extra_clone_count = ((self.elements.$slides.length-((self.settings.shown)*2))-self.properties.slides_length)/2,
            min_index = extra_clone_count,
            max_index = (self.elements.$slides.length-extra_clone_count) - self.settings.shown;

        if (self.settings.continuous) {
            max_index -= self.settings.shown;
        }

        if (self.settings.align == 'bottom' || self.settings.align == 'right') {
            min_index = extra_clone_count+(self.settings.shown - 1);
            max_index = (self.elements.$slides.length-extra_clone_count) - 1;

            if (self.settings.continuous) {
                min_index += self.settings.shown;
            }
        }
        else if (self.settings.align == 'center') {
            min_index = extra_clone_count+(Math.ceil((self.settings.shown - 1) / 2));
            max_index = (self.elements.$slides.length-extra_clone_count) - Math.ceil((self.settings.shown) / 2);

            if (self.settings.continuous) {
                min_index += Math.ceil((self.settings.shown + 1) / 2);
                max_index -= Math.ceil((self.settings.shown - 1) / 2);
            }
        }

        return {
            min: min_index,
            max: max_index
        }
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
            start = function (new_start_x, new_start_y, event, type) {
                start_x = new_start_x;
                start_y = new_start_y;
                move_x = start_x;
                move_y = start_y;
                wrapper_x = _static.getTranslatePosition(self.elements.$wrapper.get(0), 'x');
                wrapper_y = _static.getTranslatePosition(self.elements.$wrapper.get(0), 'y');
                captured = false;
                self.elements.$wrapper.css('transition', 'all 0s ease');
                self._private.setCarouselPosition('slide', wrapper_x, wrapper_y);

                move(new_start_x, new_start_y, false, type);
            },
            move = function (new_move_x, new_move_y, event, type) {
                move_x = new_move_x;
                move_y = new_move_y;

                var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
                    index_range = self._private.getIndexRange(),
                    furthest_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.max), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1,
                    nearest_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.min), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1,
                    movement_x = Math.abs(move_x - start_x) - capture_space,
                    movement_y = Math.abs(move_y - start_y) - capture_space;

                if (type == 'touch') {
                    if ((movement_x > 0 || movement_y > 0) && ((movement_y >= movement_x && self.settings.orientation == 'vertical') || movement_x >= movement_y)) {
                        captured = true;
                    }
                    else if ((movement_x > 0 || movement_y > 0) && ((movement_y < movement_x && self.settings.orientation == 'vertical') || movement_x < movement_y)) {
                        end(type);
                        return;
                    }
                }
                else {
                    captured = true;
                }

                if (event) {
                    event.preventDefault();
                }

                if (captured) {
                    self.elements.$slides.removeClass('active part-active first-active last-active');

                    if (self.settings.orientation == 'vertical') {
                        old_position = wrapper_y;
                        new_position = wrapper_y + (move_y - start_y);
                        if (new_position < furthest_position) new_position = furthest_position + ((new_position - furthest_position) / 3);
                        if (new_position > nearest_position) new_position = nearest_position + ((new_position - nearest_position) / 3);
                        self._private.setCarouselPosition('slide', 0, new_position);
                    }
                    else {
                        old_position = wrapper_x;
                        new_position = wrapper_x + (move_x - start_x);
                        if (self.settings.continuous) {
                            if (new_position < furthest_position) {
                                start_x = move_x;
                                wrapper_x = nearest_position;
                                old_position = wrapper_x;
                                new_position = wrapper_x;
                                self.properties.current_index -= self.properties.slides_length;
                            }
                            if (new_position > nearest_position) {
                                start_x = move_x;
                                wrapper_x = furthest_position;
                                old_position = wrapper_x;
                                new_position = wrapper_x;
                                self.properties.current_index += self.properties.slides_length;
                            }
                        }
                        else {
                            if (new_position < furthest_position) new_position = furthest_position + ((new_position - furthest_position) / 3);
                            if (new_position > nearest_position) new_position = nearest_position + ((new_position - nearest_position) / 3);
                        }
                        self._private.setCarouselPosition('slide', new_position, 0);
                    }
                }

                return false;
            },
            end = function (event, type) {
                _static.$document.off('touchmove.' + _static._event_namespace);
                _static.$document.off('touchend.' + _static._event_namespace);
                _static.$document.off('mousemove.' + _static._event_namespace);
                _static.$document.off('mouseup.' + _static._event_namespace);
                disable_mouse = false;

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
                            }
                            else if (old_position < new_position) {
                                j--;
                                d = -1;
                            }
                        }
                        else {
                            captured = false;
                        }
                    }

                    if (j < index_range.min) j = index_range.min;
                    else if (j > index_range.max) j = index_range.max;

                    self.goTo(j, d);
                }
            };

        if (_static.elementExists(self.elements.$container)) {
            self.elements.$container.off('touchstart.' + _static._event_namespace).on('touchstart.' + _static._event_namespace, function (e) {
                disable_mouse = true;
                start(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e, 'touch');
                _static.$document.off('touchmove.' + _static._event_namespace).on('touchmove.' + _static._event_namespace, function (e) {
                    return move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e, 'touch');
                });
                _static.$document.off('touchend.' + _static._event_namespace).on('touchend.' + _static._event_namespace, function (e) {
                    return end(e, 'touch');
                });
            });

            self.elements.$container.off('mousedown.' + _static._event_namespace).on('mousedown.' + _static._event_namespace, function (e) {
                if (!disable_mouse && e.which == 1) {
                    start(e.pageX, e.pageY, e, 'mouse');
                    _static.$document.off('mousemove.' + _static._event_namespace).on('mousemove.' + _static._event_namespace, function (e) {
                        return move(e.pageX, e.pageY, e, 'mouse');
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

        var pauseAutoPlay = function () {
            self.pause();
        };
        var resumeAutoPlay = function () {
            if (self.settings.auto_play) {
                self.play();
            }
        };

        // attach listeners
        if (_static.elementExists(self.elements.$next)) {
            self.elements.$next.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                e.preventDefault();
                self.next();
            });
            if (self.settings.hover_pause) {
                self.elements.$next
                    .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                    .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
            }
        }
        if (_static.elementExists(self.elements.$prev)) {
            self.elements.$prev.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                e.preventDefault();
                self.prev();
            });
            if (self.settings.hover_pause) {
                self.elements.$prev
                    .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                    .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
            }
        }

        if (_static.elementExists(self.elements.$container)) {
            if (self.settings.hover_pause) {
                self.elements.$container
                    .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                    .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
            }
        }

        if (self.settings.drag) {
            self._private.attachDragEvents();
        }

        if (_static.elementExists(self.elements.$thumbs_container)) {
            if (self.settings.hover_pause) {
                self.elements.$thumbs_container
                    .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                    .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
            }
        }

        if (_static.elementExists(self.elements.$thumbs)) {
            self.elements.$thumbs.each(function (index) {
                var $thumb = $(this);
                $thumb.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                    e.preventDefault();
                    self.goTo(index);
                });
            });
        }
    };

    _private.prototype.build = function () {
        var self = this.self;
        if (!_static.elementExists(self.elements.$container)) {
            var i,
                $root = $(self.settings.container).eq(0),
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

            if (!_static.isNumber(self.settings.shown) || self.settings.shown < 1) self.settings.shown = 1;

            self.elements.$root = $root;
            self.elements.$container = $container;
            self.elements.$wrapper = $wrapper;
            self.elements.$slides = $slides;
            self.properties.slides_length = $slides.length;

            // thumbs
            var $thumbs_root = $(self.settings.thumbs_container).eq(0),
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
                        var $slide_first_img = $(this).find('img').eq(0);
                        if ($slide_first_img.length) {
                            $thumbs_wrapper.append($('<div class="cable-slider-thumb"></div>').append($slide_first_img.clone()));
                        }
                    });
                    $thumbs = $thumbs_wrapper.find('>.cable-slider-thumb');
                }
                else {
                    $tmp_thumbs = $thumbs_root.find('>*');
                    if ($tmp_thumbs.length) {
                        $tmp_thumbs.wrapAll('<div class="cable-slider-thumbs-container"><div class="cable-slider-thumbs-wrapper"></div></div>');
                        $tmp_thumbs.wrap('<div class="cable-slider-thumb"></div>');
                        $thumbs_container = $thumbs_root.find('>.cable-slider-thumbs-container').eq(0);
                        $thumbs_wrapper = $thumbs_container.find('>.cable-slider-thumbs-wrapper').eq(0);
                        $thumbs = $thumbs_wrapper.find('>.cable-slider-thumb');
                    }
                }
            }

            self.elements.$thumbs_root = $thumbs_root;
            self.elements.$thumbs_container = $thumbs_container;
            self.elements.$thumbs_wrapper = $thumbs_wrapper;
            self.elements.$thumbs = $thumbs;

            self._private.buildClones('slide');
            self._private.buildClones('thumb');

            self.elements.$next = $(self.settings.next);
            self.elements.$prev = $(self.settings.prev);

            self._private.attachEvents();
        }
    };

    _private.prototype.changeSlide = function (slide, direction) {
        var self = this.self;
        direction = _static.param(direction, 0);

        var slide_element = $(slide).get(0), // accounts for jquery object or standard element
            $slide = null,
            new_index = -1;
        if (slide_element) {
            self.elements.$slides.each(function (index) {
                if (this === slide_element) {
                    $slide = $(this);
                    new_index = index;
                    return false;
                }
            });

            if ($slide && new_index >= 0) {
                var index_range = self._private.getIndexRange();
                if (new_index < index_range.min) new_index = index_range.min;
                else if (new_index > index_range.max) new_index = index_range.max;

                self.properties.new_index = new_index;

                if (direction == 1 || direction == -1) {
                    self.properties.direction = direction;
                }
                else {
                    self.properties.direction = (new_index < self.properties.current_index) ? -1 : 1;
                }

                // set which slides need animations
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

        if (_static.elementExists($items)) {
            // activity start

            if (type == 'slide' && _static.elementExists(self.elements.$thumbs)) {
                self.elements.$thumbs.removeClass('focus');
            }

            self._private.setCarouselItemsActive(type, new_index);

            // activity end

            // container height start

            $items.each(function (index) {
                var $item = $(this),
                    item_height = $item[0].getBoundingClientRect().height; // should have border-box set for box-sizing

                if ($item.hasClass('active')) {
                    if (orientation == 'vertical') {
                        if (!$item.hasClass('last-active') && !$item.hasClass('part-active')) {
                            item_height += $item.outerHeight(true) - $item.outerHeight(false);
                        }

                        if ($item.hasClass('part-active')) {
                            item_height /= 2;
                        }

                        data.new_container_height += item_height;
                    }
                    else {
                        if (item_height > data.new_container_height) {
                            data.new_container_height = item_height;
                        }
                    }

                    if (type == 'slide' && _static.elementExists(self.elements.$thumbs)) {
                        self.elements.$thumbs.eq(index).addClass('focus');
                    }
                }
            });
        }

        return data;
    };

    _private.prototype.prepareAdjust = function (type, animate) {
        var self = this.self;

        animate = _static.param(animate, false);

        var data,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            $container = type == 'thumb' ? self.elements.$thumbs_container : self.elements.$container,
            $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
            shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            margin = type == 'thumb' ? self.settings.thumbs_margin : self.settings.margin,
            orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation;

        if (_static.elementExists($items) && (type != 'thumb' || self.elements.$thumbs.length == self.elements.$slides.length)) {

            // layout start
            self._private.applySettings();

            $container.css({'transition': 'all 0s ease'});
            $wrapper.css({'transition': 'all 0s ease'});

            data = {
                current_index: self.properties.current_index,
                new_index: self.properties.new_index,
                container_width: $container.get(0).getBoundingClientRect().width,
                new_container_height: 0
            };

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
                if (_static.isNumber(margin)) {
                    slide_css['margin-bottom'] = margin + 'px';
                }
            }
            else {
                slide_css = {
                    'width': ((data.container_width - (margin * (shown - 1))) / shown) + 'px',
                    'height': 'auto',
                    'float': 'left',
                    'transition': 'all 0s ease'
                };
                if (_static.isNumber(margin)) {
                    slide_css['margin-right'] = margin + 'px';
                }
            }

            $items
                .css(slide_css)
                .each(function () {
                    new_wrapper_width += $(this).outerWidth(true);
                    new_wrapper_height += $(this).outerHeight(true);
                });

            if (orientation == 'vertical') {
                $wrapper.css({
                    'width': '',
                    'height': (new_wrapper_height + 10) + 'px'
                });
            }
            else {
                $wrapper.css({
                    'width': (new_wrapper_width + 10) + 'px',
                    'height': ''
                });
            }

            // layout end

            var activity_data = self._private.setItemsActivity(type, data.current_index, orientation);
            $container.css('height', activity_data.new_container_height + 'px');

            if (!animate) {
                var new_carousel_position_data = self._private.getNewCarouselPosition(type, data.current_index, data.container_width, activity_data.new_container_height);
                self._private.setCarouselPosition(type, new_carousel_position_data.translate_x, new_carousel_position_data.translate_y);
            }

            activity_data = self._private.setItemsActivity(type, data.new_index, orientation);
            data.new_container_height = activity_data.new_container_height;
        }
        else {
            data = false;
        }

        return data;
    };

    var CableSlider = function (settings) {
        var self = this;
        self._private = new _private();
        self._private.self = self;

        //defaults for pass through values
        self.properties = {
            instance_id: _static._next_instance_id,
            events: {}
        };
        self._private.reset();

        self.base_settings = $.extend(true, {}, self.default_settings, _static.param(settings, {}));
        self._private.applySettings(true); // use base settings and the responsive settings inside to get overall settings

        _static._next_instance_id++;
        _static._instances[self.properties.instance_id] = self;
        _static._instances.length++;

        if (self.settings.auto_create) self.create();
    };

    CableSlider.prototype.version = '0.1.6';
    CableSlider.prototype.default_settings = {
        container: false,
        next: false,
        prev: false,
        shown: 1,
        orientation: 'horizontal',
        align: 'left', // for multiple items, set the zero point
        margin: false,
        //loop: false,
        continuous: false,
        min_clones: 0,
        drag: true,
        thumbs_container: false,
        thumbs_next: false,
        thumbs_prev: false,
        thumbs_shown: 3,
        thumbs_orientation: 'horizontal',
        thumbs_align: 'center', // for multiple items, set the zero point
        thumbs_margin: false,
        //thumbs_loop: false,
        thumbs_continuous: false,
        thumbs_min_clones: 0,
        auto_thumbs: false, // will remove existing html inside thumbs container if it exists
        //bullets_container: false,
        auto_play: false, // set a number for a time period. false or 0 will not auto play.
        hover_pause: false,
        auto_create: true,
        responsive: {}
    };


    CableSlider.prototype.create = function () {
        var self = this;
        self.destroy();

        self.trigger('create');

        self._private.build();
        self._private.load();
        // first adjust
        self._private.prepareAdjust('slide');
        self._private.prepareAdjust('thumb');
        self.adjust(false, true);

        self.goTo((self.settings.continuous ? (self.elements.$slides.length-self.properties.slides_length)/2 : 0), 0);

        self.adjust(false,true);

        if (self.settings.auto_play) {
            self.play();
        }

        self.trigger('after_create');
    };

    CableSlider.prototype.destroy = function () {
        var self = this;
        if (self.elements.$container) {

            self.elements.$container.remove();

            if (_static.isSet(_static._instances[self.properties.instance_id])) {
                delete _static._instances[self.properties.instance_id];
                _static._instances.length--;
            }

            self._private.reset();
        }
    };

    CableSlider.prototype.update = function (settings) {
        var self = this;

        $.extend(true, self.base_settings, _static.param(settings, {}));
        self._private.applySettings(true);
        self.adjust(false, true);
    };

    CableSlider.prototype.adjust = function (animate, immediate) {
        var self = this;
        animate = _static.param(animate, true);
        immediate = _static.param(immediate, true);
        if (self.properties.direction != 1 && self.properties.direction != -1) self.properties.direction = 1;
        if (!immediate) {
            if (self.properties.lazy_adjust_timer !== false) {
                return;
            }
            else {
                self.properties.lazy_adjust_timer = setTimeout(function () {
                    self.properties.lazy_adjust_timer = false;
                    self.adjust(animate, true);
                }, 300);
            }
            return;
        }
        else {
            if (self.properties.lazy_adjust_timer !== false) {
                clearTimeout(self.properties.lazy_adjust_timer);
                self.properties.lazy_adjust_timer = false;
            }
        }
        if (_static.elementExists(self.elements.$slides)) {
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
                self.elements.$container.css({'transition': 'height 0.5s ' + self.properties.container_height_easing});
                if (animate) {
                    difference = Math.abs(slide_adjust_data.new_index - slide_adjust_data.current_index);
                    transition_seconds = Math.round((difference / 5) * 100) / 100;
                    if (transition_seconds > 1) transition_seconds = 1;
                    else if (transition_seconds < 0.4) transition_seconds = 0.4;
                    self.elements.$wrapper.css({'transition': 'transform ' + transition_seconds + 's ' + self.properties.wrapper_transform_easing});
                }

                if (thumb_adjust_data) {
                    self.elements.$thumbs_container.css({'transition': 'height 0.5s ' + self.properties.container_height_easing});
                    if (animate) {
                        difference = Math.abs(thumb_adjust_data.new_index - thumb_adjust_data.current_index);
                        transition_seconds = Math.round((difference / 5) * 100) / 100;
                        if (transition_seconds > 1) transition_seconds = 1;
                        else if (transition_seconds < 0.4) transition_seconds = 0.4;
                        self.elements.$thumbs_wrapper.css({'transition': 'transform ' + transition_seconds + 's ' + self.properties.wrapper_transform_easing});
                    }
                }

                self.properties.current_index = self.properties.new_index;

                setTimeout(function () {
                    // animate container height
                    self.elements.$container.css('height', slide_adjust_data.new_container_height + 'px');

                    // animate slides
                    self._private.setCarouselPosition('slide', new_slide_carousel_position_data.translate_x, new_slide_carousel_position_data.translate_y);

                    if (thumb_adjust_data) {
                        //animate thumb container height
                        self.elements.$thumbs_container.css('height', thumb_adjust_data.new_container_height + 'px');

                        // animate thumbs
                        self._private.setCarouselPosition('thumb', new_thumb_carousel_position_data.translate_x, new_thumb_carousel_position_data.translate_y);

                        self.trigger('after_adjust');
                    }
                    else {
                        self.trigger('after_adjust');
                    }
                }, 0);
            }
        }
    };

    CableSlider.prototype.isReady = function () {
        // if minimum loaded images is true
    };

    CableSlider.prototype.goTo = function (slide, direction) {
        var self = this;
        self._private.resetAutoPlay();
        if (_static.isNumber(slide)) {
            slide = self._private.getValidSlideNumber(slide);
            self._private.changeSlide(self.elements.$slides.get(slide), direction);
        }
        else {
            self._private.changeSlide(slide, direction);
        }
    };

    CableSlider.prototype.shift = function (amount) {
        var self = this;
        if (_static.isNumber(amount) && amount != 0) {
            self.goTo(self.properties.current_index + amount, (amount < 0) ? -1 : 1);
        }
    };

    CableSlider.prototype.next = function () {
        var self = this;
        var new_index = self.properties.current_index + 1;
        new_index = self._private.getValidSlideNumber(new_index);

        var index_range = self._private.getIndexRange();
        if (new_index > index_range.max) new_index = index_range.min;

        self.goTo(new_index, 1);
    };

    CableSlider.prototype.prev = function () {
        var self = this;
        var new_index = self.properties.current_index - 1;
        new_index = self._private.getValidSlideNumber(new_index);

        var index_range = self._private.getIndexRange();
        if (new_index < index_range.min) new_index = index_range.max;

        self.goTo(new_index, -1);
    };

    CableSlider.prototype.play = function () {
        var self = this;
        self.pause();
        var timeout_ms = (_static.isNumber(self.settings.auto_play)) ? parseInt(self.settings.auto_play, 10) : 3000;
        self.properties.auto_play_timer = setTimeout(function () {
            self.next();
        }, timeout_ms);
    };

    CableSlider.prototype.pause = function () {
        var self = this;
        if (self.properties.auto_play_timer !== false) {
            clearTimeout(self.properties.auto_play_timer);
            self.properties.auto_play_timer = false;
        }
    };

    CableSlider.prototype.on = function (event, handler) {
        var self = this;
        var event_parts = event.split('.', 2);
        if (event_parts.length) {
            var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : '_default';
            if (!_static.isPlainObject(self.properties.events[event_type])) self.properties.events[event_type] = {};
            if (!_static.isArray(self.properties.events[event_type][event_name])) self.properties.events[event_type][event_name] = [];
            self.properties.events[event_type][event_name].push(handler);
        }
    };

    CableSlider.prototype.off = function (event, handler) {
        var self = this;
        var event_parts = event.split('.', 2);
        if (event_parts.length) {
            var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
            if (_static.isPlainObject(self.properties.events[event_type])) {
                for (var current_event_name in self.properties.events[event_type]) {
                    if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                        && _static.isArray(self.properties.events[event_type][current_event_name])
                        && (event_name === false || event_name === current_event_name)) {
                        if (_static.isFunction(handler)) {
                            for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
                                if (self.properties.events[event_type][current_event_name][i] === handler) {
                                    self.properties.events[event_type][current_event_name].splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        else self.properties.events[event_type][current_event_name] = [];
                    }
                }
            }
        }
    };

    CableSlider.prototype.trigger = function (event, handler, params) {
        var self = this;
        params = (_static.isArray(params)) ? params : [];
        var event_parts = event.split('.', 2);
        if (event_parts.length) {
            var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
            if (_static.isFunction(self.settings[event_type])) {
                self.settings[event_type]();
            }
            if (_static.isPlainObject(self.properties.events[event_type])) {
                for (var current_event_name in self.properties.events[event_type]) {
                    if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                        && _static.isArray(self.properties.events[event_type][current_event_name])
                        && (event_name === false || event_name === current_event_name)) {
                        for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
                            if (_static.isFunction(self.properties.events[event_type][current_event_name][i])
                                && (!_static.isFunction(handler) || self.properties.events[event_type][current_event_name][i] === handler)) {
                                self.properties.events[event_type][current_event_name][i].apply(self, params);
                            }
                        }
                    }
                }
            }
        }
    };

    // global events
    _static.$window.off('resize.' + _static._event_namespace).on('resize.' + _static._event_namespace, function () {
        if (_static._instances.length > 0) {
            for (var i in _static._instances) {
                if (_static._instances.hasOwnProperty(i)) {
                    if (_static._instances[i] instanceof CableSlider) {
                        _static._instances[i].adjust(false, false);
                    }
                }
            }
        }
    });

    $.CableSlider = CableSlider;

})(jQuery, window, document);