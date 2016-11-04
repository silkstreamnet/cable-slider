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
            container_height_easing: '',
            wrapper_transform_easing: ''
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

    _private.prototype.getNewCarouselPosition = function (type, new_index, container_width, container_height) {
        var self = this.self;
        new_index = _static.param(new_index, false);

        var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
            orientation = type == 'thumb' ? self.settings.thumbs_orientation : self.settings.orientation,
            items_length = type == 'thumb' ? self.elements.$thumbs.length : self.elements.$slides.length,
            $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            $clones_before = type == 'thumb' ? self.elements.$thumb_clones_before : self.elements.$slide_clones_before,
            $clones_after = type == 'thumb' ? self.elements.$thumb_clones_after : self.elements.$slide_clones_after;

        var container_size = orientation == 'vertical' ? container_height : container_width,
            new_position = 0,
            furthest_position = 0,
            nearest_position = 0;

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
            return {
                translate_x:0,
                translate_y:new_position*-1
            };
        }
        else {
            return {
                translate_x:new_position*-1,
                translate_y:0
            };
        }

    };

    _private.prototype.setCarouselPosition = function(type,translate_x,translate_y){
        var self = this.self;
        var $wrapper = type == 'thumb' ? self.elements.$thumbs_wrapper : self.elements.$wrapper;
        $wrapper.css('transform', 'translate3d('+(translate_x)+'px,' + (translate_y) + 'px,0px)');
        $wrapper.data('translate-x',translate_x);
        $wrapper.data('translate-y',translate_y);
    };

    _private.prototype.getRealMargin = function(margin,container_width) {
        var self = this.self;
        if (_static.isString(margin,true)) {
            var last_char = margin.slice(-1);
            if (last_char == '%') {
                var percent = parseInt(margin,10);
                if (_static.isNumber(percent)) {
                    margin = container_width*(percent/100);
                }
            }
        }
        return margin;
    };

    _private.prototype.setCarouselItemsActive = function (type,new_index) {
        var self = this.self;
        new_index = _static.param(new_index, false);

        var shown = type == 'thumb' ? self.settings.thumbs_shown : self.settings.shown,
            align = type == 'thumb' ? self.settings.thumbs_align : self.settings.align,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            min_index = new_index,
            max_index = new_index + (shown - 1);

        if (align == 'bottom' || align == 'right') {
            min_index = new_index - (shown - 1);
            max_index = new_index;
        }
        else if (align == 'center') {
            min_index = new_index - ((shown - 1)/2);
            max_index = new_index + ((shown - 1)/2);
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
                $item.addClass('active last-active');
            }
            else if (index == min_index) {
                $item.addClass('active first-active');
            }
            else if (index >= min_index && index <= max_index) {
                $item.addClass('active');
            }
            else if (index != max_index && index == Math.ceil(max_index)) {
                $item.addClass('active last-active part-active');
            }
            else if (index != min_index && index == Math.floor(min_index)) {
                $item.addClass('active first-active part-active');
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

        if (self.settings.continuous && _static.elementExists($items) && $items.length > shown) {
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

    _private.prototype.attachDragEvents = function() {
        var self = this.self;
        var disable_mouse = false,
            start_x = 0,
            start_y = 0,
            move_x = 0,
            move_y = 0,
            wrapper_x = 0,
            wrapper_y = 0,
            new_position = 0,
            old_position = 0,
            start = function(new_start_x,new_start_y){
                self.elements.$wrapper.css('transition','all 0s ease');
                start_x = new_start_x;
                start_y = new_start_y;
                move_x = start_x;
                move_y = start_y;
                wrapper_x = self.elements.$wrapper.data('translate-x');
                wrapper_y = self.elements.$wrapper.data('translate-y');
            },
            move = function(new_move_x,new_move_y) {
                move_x = new_move_x;
                move_y = new_move_y;

                if (self.settings.orientation == 'vertical') {
                    new_position = wrapper_y+(move_y-start_y);
                    self.elements.$wrapper.css('transform', 'translate3d(0px,' + (new_position) + 'px,0px)');
                    self.elements.$wrapper.data('translate-x',0);
                    self.elements.$wrapper.data('translate-y',new_position);
                }
                else {
                    new_position = wrapper_x+(move_x-start_x);
                    self.elements.$wrapper.css('transform', 'translate3d(' + (new_position) + 'px,0px,0px)');
                    self.elements.$wrapper.data('translate-x',new_position);
                    self.elements.$wrapper.data('translate-y',0);
                }
            },
            end = function() {
                var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
                    $check_slide,
                    item_position;

                if (self.settings.orientation == 'vertical') {
                    old_position = wrapper_y;
                    new_position = wrapper_y+(move_y-start_y);
                }
                else {
                    old_position = wrapper_x;
                    new_position = wrapper_x+(move_x-start_x);
                }

                if (new_position < old_position) {
                    // go right
                    for (var j=self.elements.$slides.length-1; j>=0; j--) {
                        $check_slide = self.elements.$slides.eq(j);
                        item_position = self._private.getItemPosition($check_slide,self.elements.$wrapper,container_size,self.settings.orientation,self.settings.align);
                        if (item_position <= (new_position-8)*-1) {
                            if (j == self.properties.current_index && j < self.elements.$slides.length-1) {
                                j++;
                            }
                            self.goTo(j,1);
                            break;
                        }
                    }
                }
                else if (new_position > old_position) {
                    // go left
                    for (var i=0; i<self.elements.$slides.length; i++) {
                        $check_slide = self.elements.$slides.eq(i);
                        item_position = self._private.getItemPosition($check_slide,self.elements.$wrapper,container_size,self.settings.orientation,self.settings.align);
                        if (item_position >= (new_position+8)*-1) {
                            if (i == self.properties.current_index && i > 0) {
                                i--;
                            }
                            self.goTo(i,-1);
                            break;
                        }
                    }
                }
            };
        self.elements.$container.off('touchstart.'+_static._event_namespace).on('touchstart.'+_static._event_namespace, function(e) {
            disable_mouse = true;
            start(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY);
            _static.$document.off('touchmove.'+_static._event_namespace).on('touchmove.'+_static._event_namespace, function(e) {
                e.preventDefault();
                move(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY);
                return false;
            });
            _static.$document.off('touchend.'+_static._event_namespace).on('touchend.'+_static._event_namespace, function(e) {
                _static.$document.off('touchmove.'+_static._event_namespace);
                _static.$document.off('touchend.'+_static._event_namespace);
                disable_mouse = false;
                end();
            });
        });

        self.elements.$container.off('mousedown.'+_static._event_namespace).on('mousedown.'+_static._event_namespace, function(e) {
            if (!disable_mouse && e.which == 1) {
                start(e.pageX,e.pageY);
                _static.$document.off('mousemove.'+_static._event_namespace).on('mousemove.'+_static._event_namespace,function(e){
                    e.preventDefault();
                    move(e.pageX,e.pageY);
                    return false;
                });
                _static.$document.off('mouseup.'+_static._event_namespace).on('mouseup.'+_static._event_namespace, function(e){
                    _static.$document.off('mousemove.'+_static._event_namespace);
                    _static.$document.off('mouseup.'+_static._event_namespace);
                    end();
                });
            }
        });
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

            if (self.settings.drag) {
                self._private.attachDragEvents();
            }

            if (_static.elementExists($thumbs)) {
                $thumbs.each(function (index) {
                    var $thumb = $(this);
                    $thumb.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
                        e.preventDefault();
                        self.goTo(index);
                    });
                });
            }

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

    _private.prototype.setItemsActivity = function(type,$items,new_index,orientation) {
        var self = this.self;

        var data = {
            new_container_height:0
        };
        // activity start

        $items.removeClass('active part-active first-active last-active');
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

        return data;
    };

    _private.prototype.prepareAdjust = function(type,animate) {
        var self = this.self;

        animate = _static.param(animate, false);

        var data,
            $items = type == 'thumb' ? self.elements.$thumbs : self.elements.$slides,
            $clones_before = type == 'thumb' ? self.elements.$thumb_clones_before : self.elements.$slide_clones_before,
            $clones_after = type == 'thumb' ? self.elements.$thumb_clones_after : self.elements.$slide_clones_after,
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

            self._private.buildClones(type);

            data = {
                current_index:self.properties.current_index,
                new_index:self.properties.new_index,
                container_width:$container.get(0).getBoundingClientRect().width,
                new_container_height:0
            };

            margin = self._private.getRealMargin(margin,data.container_width);

            var new_wrapper_width = 0,
                new_wrapper_height = 0,
                slide_css = {};

            if (orientation == 'vertical') {
                slide_css = {
                    'width': data.container_width,
                    'height': 'auto',
                    'float': 'none',
                    'transition':'all 0s ease'
                };
                if (_static.isNumber(margin)) {
                    slide_css['margin-bottom'] = margin+'px';
                }
            }
            else {
                slide_css = {
                    'width': ((data.container_width - (margin * (shown - 1))) / shown) + 'px',
                    'height': 'auto',
                    'float': 'left',
                    'transition':'all 0s ease'
                };
                if (_static.isNumber(margin)) {
                    slide_css['margin-right'] = margin+'px';
                }
            }

            $items
                .add($clones_before)
                .add($clones_after)
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

            var activity_data = self._private.setItemsActivity(type, $items, data.current_index, orientation);
            $container.css('height',activity_data.new_container_height+'px');

            if (!animate) {
                var new_carousel_position_data = self._private.getNewCarouselPosition(type, data.current_index, data.container_width, activity_data.new_container_height);
                self._private.setCarouselPosition(type,new_carousel_position_data.translate_x,new_carousel_position_data.translate_y);
            }

            activity_data = self._private.setItemsActivity(type, $items, data.new_index, orientation);
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

    CableSlider.prototype.version = '0.1.0';
    CableSlider.prototype.default_settings = {
        container: false,
        next: false,
        prev: false,
        shown: 1,
        orientation: 'horizontal',
        align: 'left', // for multiple items, set the zero point
        margin: false,
        loop: false,
        continuous: false,
        drag: true,
        thumbs_container: false,
        thumbs_next: false,
        thumbs_prev: false,
        thumbs_shown: 5,
        thumbs_orientation: 'horizontal',
        thumbs_align: 'center', // for multiple items, set the zero point
        thumbs_margin: false,
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
        // first adjust
        self._private.prepareAdjust('slide');
        self._private.prepareAdjust('thumb');
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

            var slide_adjust_data = self._private.prepareAdjust('slide',animate),
                thumb_adjust_data = self._private.prepareAdjust('thumb',animate),
                new_slide_carousel_position_data = self._private.getNewCarouselPosition('slide', slide_adjust_data.new_index, slide_adjust_data.container_width, slide_adjust_data.new_container_height),
                new_thumb_carousel_position_data = self._private.getNewCarouselPosition('thumb', thumb_adjust_data.new_index, thumb_adjust_data.container_width, thumb_adjust_data.new_container_height),
                transition_seconds = 0,
                difference = 0,
                old_translate_position = 0,
                new_translate_position = 0;

            if (slide_adjust_data) {
                self.elements.$container.css({'transition':'height 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});
                if (animate) {
                    if (self.settings.orientation == 'vertical') {
                        old_translate_position = self.elements.$wrapper.data('translate-y');
                        new_translate_position = new_slide_carousel_position_data.translate_y;
                    }
                    else {
                        old_translate_position = self.elements.$wrapper.data('translate-x');
                        new_translate_position = new_slide_carousel_position_data.translate_x;
                    }
                    difference = Math.abs(new_translate_position-old_translate_position);

                    transition_seconds = Math.round(difference/9)/100;
                    if (transition_seconds > 1) transition_seconds = 1;
                    else if (transition_seconds < 0.2) transition_seconds = 0.2;

                    self.elements.$wrapper.css({'transition': 'transform '+transition_seconds+'s cubic-bezier(0.215, 0.61, 0.355, 1)'});
                }

                if (thumb_adjust_data) {
                    self.elements.$thumbs_container.css({'transition':'height 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});
                    if (animate) {
                        self.elements.$thumbs_wrapper.css({'transition': 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)'});
                    }
                }

                self.properties.current_index = self.properties.new_index;

                setTimeout(function () {
                    // animate container height
                    self.elements.$container.css('height',slide_adjust_data.new_container_height+'px');

                    // animate slides
                    self._private.setCarouselPosition('slide',new_slide_carousel_position_data.translate_x,new_slide_carousel_position_data.translate_y);

                    if (thumb_adjust_data) {
                        //animate thumb container height
                        self.elements.$thumbs_container.css('height',thumb_adjust_data.new_container_height+'px');

                        // animate thumbs
                        self._private.setCarouselPosition('thumb',new_thumb_carousel_position_data.translate_x,new_thumb_carousel_position_data.translate_y);

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
                    break;
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
            new_index = self.elements.$slides.length - 1;
        }
        else if (new_position >= furthest_position && cur_position > furthest_position) {
            // find first item less than furthest_position
            for (var i = self.elements.$slides.length - 1; i >= 0; i--) {
                var $find_slide = $(self.elements.$slides[i]),
                    find_slide_position = self._private.getItemPosition($find_slide, self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align);
                if (find_slide_position < furthest_position) {
                    new_index = i;
                    break;
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

})(jQuery, window, document);