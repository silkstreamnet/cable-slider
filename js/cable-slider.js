(function ($, window) {

    var _private = function () {
        },
        _static = {
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
            lazy_adjust_timer: false
        };
        self.elements = {
            $root: null,
            $container: null,
            $wrapper: null,
            $slides: null,
            $slide_clones_before: null,
            $slide_clones_after: null,
            $next: null,
            $prev: null,
            $thumbs_root: null,
            $thumbs_container: null,
            $thumbs_wrapper: null,
            $thumbs: null,
            $thumb_clones_before: null,
            $thumb_clones_after: null,
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

    _private.prototype.setCarouselPosition = function (type, current_index, new_index, container_width, container_height) {
        var self = this.self;
        new_index = _static.param(new_index, false);

        var index_diff = 0,
            shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
            orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation,
            items_length = type == 'thumb' && _static.elementExists(self.elements.$thumbs) ? self.elements.$thumbs.length : self.elements.$slides.length,
            $wrapper = type == 'thumb' && _static.elementExists(self.elements.$thumbs) ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
            $items = type == 'thumb' && _static.elementExists(self.elements.$thumbs) ? self.elements.$thumbs : self.elements.$slides,
            $clones_before = type == 'thumb' && _static.elementExists(self.elements.$thumbs) ? self.elements.$thumb_clones_before : self.elements.$slide_clones_before,
            $clones_after = type == 'thumb' && _static.elementExists(self.elements.$thumbs) ? self.elements.$thumb_clones_after : self.elements.$slide_clones_after;

        var container_size = orientation == 'vertical' ? container_height : container_width,
            new_position = 0,
            furthest_position = 0,
            nearest_position = 0;

        //todo what about items with different sizes which don't fit directly into a certain amount shown?
        if (items_length > shown) {
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

        if (orientation == 'vertical') {
            $wrapper.css('transform', 'translate3d(0px,' + (new_position * -1) + 'px,0px)');
        }
        else {
            $wrapper.css('transform', 'translate3d(' + (new_position * -1) + 'px,0px,0px)');
        }

        $items.each(function () {
            var $item = $(this),
                item_near_point = orientation == 'vertical' ? $item.offset().top - $wrapper.offset().top : $item.offset().left - $wrapper.offset().left,
                item_far_point = orientation == 'vertical' ? item_near_point + $item.get(0).getBoundingClientRect().height : item_near_point + $item.get(0).getBoundingClientRect().width;
            if (item_near_point < new_position + container_size && item_far_point > new_position) {
                $item.addClass('active');
            }
        });
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
        var $new_clone,
            $clones_before = type == 'thumb' ? self.elements.$thumb_clones_before : self.elements.$slide_clones_before,
            $clones_after = type == 'thumb' ? self.elements.$thumb_clones_after : self.elements.$slide_clones_after,
            $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            i;

        if (_static.elementExists($clones_before)) {
            $clones_before.remove();
        }
        if (_static.elementExists($clones_after)) {
            $clones_after.remove();
        }

        if ($items.length > shown) {
            $clones_before = $([]);
            $clones_after = $([]);
            for (i = $items.length - 1; i >= $items.length - shown; i--) {
                $new_clone = $items.eq(i).clone();
                $new_clone.addClass('cable-slider-clone').prependTo($wrapper);
                $clones_before = $clones_before.add($new_clone);
            }
            for (i = 0; i <= shown - 1; i++) {
                $new_clone = $items.eq(i).clone();
                $new_clone.addClass('cable-slider-clone').appendTo($wrapper);
                $clones_after = $clones_after.add($new_clone);
            }
        }
        else {
            $clones_before = null;
            $clones_after = null;
        }

        if (type == 'thumb') {
            self.elements.$thumb_clones_before = $clones_before;
            self.elements.$thumb_clones_after = $clones_after;
        }
        else {
            self.elements.$slide_clones_before = $clones_before;
            self.elements.$slide_clones_after = $clones_after;
        }
    };

    _private.prototype.build = function () {
        var self = this.self;
        if (!_static.elementExists(self.elements.$container)) {
            var i,
                $root = $(self.settings.container).eq(0),
                $container = null,
                $wrapper = null,
                $slides = null,
                $tmp_slides = null;

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

                $thumbs.each(function (index) {
                    var $thumb = $(this);
                    $thumb.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                        e.preventDefault();
                        self.goTo(index);
                    });
                });
            }

            self.elements.$thumbs_root = $thumbs_root;
            self.elements.$thumbs_container = $thumbs_container;
            self.elements.$thumbs_wrapper = $thumbs_wrapper;
            self.elements.$thumbs = $thumbs;

            self._private.buildClones('slide');
            self._private.buildClones('thumb');

            self.elements.$next = $(self.settings.next);
            self.elements.$prev = $(self.settings.prev);

            // attach listeners
            self.elements.$next.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                e.preventDefault();
                self.next();
            });
            self.elements.$prev.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                e.preventDefault();
                self.prev();
            });

            if (self.settings.auto_play) {
                self.play();
            }
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

    CableSlider.prototype.version = '0.0.7';
    CableSlider.prototype.default_settings = {
        container: false,
        next: false,
        prev: false,
        shown: 1,
        orientation: 'horizontal',
        align: 'left', // for multiple items, set the zero point
        margin: 0,
        loop: false,
        continuous: false,
        thumbs_container: false,
        thumbs_next: false,
        thumbs_prev: false,
        thumbs_shown: 5,
        thumbs_orientation: 'horizontal',
        thumbs_align: 'center', // for multiple items, set the zero point
        thumbs_margin: 0,
        thumbs_loop: false,
        thumbs_continuous: false,
        auto_thumbs: false, // will remove existing html inside thumbs container if it exists
        bullets_container: false,
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
        self.adjust(false, true);

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

            self._private.applySettings();

            var current_index = self.properties.current_index,
                new_index = self.properties.new_index,
                adjust_slides = self.elements.$slides.length > self.settings.shown,
                adjust_thumbs = (_static.elementExists(self.elements.$thumbs)) ? self.elements.$thumbs.length > self.settings.thumbs_shown : false;

            self.elements.$container.css({'transition': 'all 0s ease'});
            self.elements.$thumbs_container.css({'transition': 'all 0s ease'});
            self.elements.$wrapper.css({'transition': 'all 0s ease'});
            self.elements.$thumbs_wrapper.css({'transition': 'all 0s ease'});

            // slides
            self._private.buildClones('slide');

            var container_width = self.elements.$container.get(0).getBoundingClientRect().width,
                container_height = self.elements.$container.get(0).getBoundingClientRect().height;

            if (self.settings.orientation == 'vertical') {
                container_height = _static.getJustHeight(self.elements.$container.parent());
                self.elements.$container.css('height', container_height + 'px');
            }
            //self.elements.$container.css({'transition':'height 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});

            var slide_margin = self.settings.margin,
                slide_width = (container_width - (slide_margin * (self.settings.shown - 1))) / self.settings.shown,
                slide_height = (container_height - (slide_margin * (self.settings.shown - 1))) / self.settings.shown,
                set_width = 0,
                set_height = 0,
                slide_css = {};

            if (self.settings.orientation == 'vertical') {
                slide_css = {
                    'width': 'auto',
                    'height': (slide_height) + 'px',
                    'float': 'none',
                    'margin-bottom': slide_margin + 'px'
                };
            }
            else {
                slide_css = {
                    'width': (slide_width) + 'px',
                    'height': 'auto',
                    'float': 'left',
                    'margin-right': slide_margin + 'px'
                };
            }

            self.elements.$slides
                .add(self.elements.$slide_clones_before)
                .add(self.elements.$slide_clones_after)
                .css(slide_css)
                .each(function () {
                    set_width += $(this).outerWidth(true);
                    set_height += $(this).outerHeight(true);
                });

            if (self.settings.orientation == 'vertical') {
                self.elements.$wrapper.css({
                    'width':'',
                    'height':(set_height + 10) + 'px'
                });
            }
            else {
                self.elements.$wrapper.css({
                    'width':(set_width + 10) + 'px',
                    'height':''
                });
            }

            if (animate && adjust_slides && new_index != current_index) {
                self.elements.$wrapper.css({'transition': 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});
            }

            self._private.setCarouselPosition('slide', current_index, current_index, container_width, container_height);

            self.properties.current_index = new_index;

            setTimeout(function () {
                self.elements.$slides.removeClass('active');
                if (_static.elementExists(self.elements.$thumbs)) {
                    self.elements.$thumbs.removeClass('focus');
                }

                if (self.settings.orientation == 'vertical') {
                    container_height = _static.getJustHeight(self.elements.$container.parent());
                    self.elements.$container.css('height', container_height + 'px');
                }

                self._private.setCarouselPosition('slide', current_index, new_index, container_width, container_height);

                var setHeight = 0;

                self.elements.$slides.each(function (index) {
                    var $item = $(this);
                    if ($item.hasClass('active')) {
                        if (self.settings.orientation != 'vertical') {
                            var slideHeight = $item[0].getBoundingClientRect().height + ($item.outerHeight(true) - $item.outerHeight(false)); // should have border-box set for box-sizing
                            if (slideHeight > setHeight) {
                                setHeight = slideHeight;
                            }
                        }

                        if (_static.elementExists(self.elements.$thumbs)) {
                            self.elements.$thumbs.eq(index).addClass('focus');
                        }
                    }
                });

                if (self.settings.orientation != 'vertical') {
                    self.elements.$container.css('height', setHeight + 'px');
                }

                if (_static.elementExists(self.elements.$thumbs) && self.elements.$thumbs.length == self.elements.$slides.length) {
                    setTimeout(function () {
                        self._private.buildClones('thumb');

                        var thumbs_container_width = self.elements.$thumbs_container.get(0).getBoundingClientRect().width,
                            thumbs_container_height = self.elements.$thumbs_container.get(0).getBoundingClientRect().height;

                        if (self.settings.thumbs_orientation == 'vertical') {
                            thumbs_container_height = _static.getJustHeight(self.elements.$thumbs_container.parent());
                            self.elements.$thumbs_container.css('height', thumbs_container_height + 'px');
                        }
                        //self.elements.$thumbs_container.css({'transition':'height 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});

                        var thumb_margin = self.settings.thumbs_margin,
                            thumb_width = (thumbs_container_width - (thumb_margin * (self.settings.thumbs_shown - 1))) / self.settings.thumbs_shown,
                            thumb_height = (thumbs_container_height - (thumb_margin * (self.settings.thumbs_shown - 1))) / self.settings.thumbs_shown,
                            thumb_css = {};
                        set_width = 0;
                        set_height = 0;

                        if (self.settings.thumbs_orientation == 'vertical') {
                            thumb_css = {
                                'width': 'auto',
                                'height': (thumb_height) + 'px',
                                'float': 'none',
                                'margin-bottom': thumb_margin + 'px'
                            };
                        }
                        else {
                            thumb_css = {
                                'width': (thumb_width) + 'px',
                                'height': 'auto',
                                'float': 'left',
                                'margin-right': thumb_margin + 'px'
                            };
                        }

                        self.elements.$thumbs
                            .add(self.elements.$thumb_clones_before)
                            .add(self.elements.$thumb_clones_after)
                            .css(thumb_css)
                            .each(function () {
                                set_width += $(this).outerWidth(true);
                                set_height += $(this).outerHeight(true);
                            });

                        if (self.settings.thumbs_orientation == 'vertical') {
                            self.elements.$thumbs_wrapper.css('height', (set_height + 10) + 'px');
                        }
                        else {
                            self.elements.$thumbs_wrapper.css('width', (set_width + 10) + 'px');
                        }

                        if (animate && adjust_thumbs && new_index != current_index) {
                            self.elements.$thumbs_wrapper.css({'transition': 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});
                        }

                        self._private.setCarouselPosition('thumb', current_index, current_index, thumbs_container_width, thumbs_container_height);


                        setTimeout(function () {
                            self.elements.$thumbs.removeClass('active');

                            if (self.settings.thumbs_orientation == 'vertical') {
                                thumbs_container_height = _static.getJustHeight(self.elements.$thumbs_container.parent());
                                self.elements.$thumbs_container.css('height', thumbs_container_height + 'px');
                            }

                            self._private.setCarouselPosition('thumb', current_index, new_index, thumbs_container_width, thumbs_container_height);

                            setHeight = 0;

                            self.elements.$thumbs.each(function () {
                                var $item = $(this);
                                if ($item.hasClass('active')) {
                                    if (self.settings.thumbs_orientation != 'vertical') {
                                        var slideHeight = $item[0].getBoundingClientRect().height + ($item.outerHeight(true) - $item.outerHeight(false)); // should have border-box set for box-sizing
                                        if (slideHeight > setHeight) {
                                            setHeight = slideHeight;
                                        }
                                    }
                                }
                            });

                            if (self.settings.thumbs_orientation != 'vertical') {
                                self.elements.$thumbs_container.css('height', setHeight + 'px');
                            }

                            self.trigger('after_adjust');
                        }, 0);

                    }, 0);
                }
                else {
                    self.trigger('after_adjust');
                }
            }, 0);
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

        var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
            cur_position = self._private.getItemPosition(self.elements.$slides.eq(self.properties.current_index), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align),
            new_position = self._private.getItemPosition(self.elements.$slides.eq(new_index), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align),
            furthest_position = self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation),
            nearest_position = self._private.getNearestPosition(self.elements.$slides.first(), self.elements.$wrapper, self.settings.orientation);

        if (cur_position >= furthest_position && new_position > furthest_position) {
            new_index = 0;
        }
        else if (new_position <= nearest_position && cur_position < nearest_position) {
            // find first item greater than nearest_position
            for (var i = 0; i < self.elements.$slides.length; i++) {
                var $find_slide = $(self.elements.$slides[i]),
                    find_slide_position = self._private.getItemPosition($find_slide, self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align);
                if (find_slide_position > nearest_position) {
                    new_index = i;
                }
            }
        }
        self.goTo(new_index, 1);
    };

    CableSlider.prototype.prev = function () {
        var self = this;
        var new_index = self.properties.current_index - 1;
        new_index = self._private.getValidSlideNumber(new_index);

        // new position will change based on alignment
        var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
            cur_position = self._private.getItemPosition(self.elements.$slides.eq(self.properties.current_index), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align),
            new_position = self._private.getItemPosition(self.elements.$slides.eq(new_index), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align),
            furthest_position = self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation),
            nearest_position = self._private.getNearestPosition(self.elements.$slides.first(), self.elements.$wrapper, self.settings.orientation);

        if (cur_position <= nearest_position && new_position < nearest_position) {
            new_index = self.elements.$slides.length - self.settings.shown;
        }
        else if (new_position >= furthest_position && cur_position > furthest_position) {
            // find first item less than furthest_position
            for (var i = self.elements.$slides.length - 1; i >= 0; i--) {
                var $find_slide = $(self.elements.$slides[i]),
                    find_slide_position = self._private.getItemPosition($find_slide, self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align);
                if (find_slide_position > nearest_position) {
                    new_index = i;
                }
            }

        }
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

})(jQuery, window);