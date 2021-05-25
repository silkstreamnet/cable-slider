import $ from "jquery"
import {_util} from "./util"
import {_static} from "./static"

export const _private = function (core_self) {
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

_private.prototype.getValidIndex = function (slide) {
    var self = this.self;
    var index_range = self._private.getIndexRange();
    if (slide < index_range.min) {
        slide = index_range.min;
    }
    else if (slide > index_range.max) {
        slide = index_range.max;
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
    if (_util.has3dSupport) {
        $wrapper.css('transform', 'translate3d(' + (translate_x) + 'px,' + (translate_y) + 'px,0px)');
    }
    else {
        $wrapper.css('transform', 'translate(' + (translate_x) + 'px,' + (translate_y) + 'px)');
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
        target_clones_length,
        limit;

    if (_util.elementExists($items)) {
        // remove existing clones
        $items.filter('.cable-slider-clone').remove();

        // reset
        if (type == 'thumb') $items = self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');
        else $items = self.elements.$slides = $wrapper.find('>.cable-slider-slide');

        if (continuous) {

            if (shown+1 > min_clones) min_clones = shown+1;

            //todo should clones copy events?

            // fill
            if ($items.length < shown) {
                i = 0;
                clones_length = 0;
                target_clones_length = (shown - $items.length);

                while (clones_length < target_clones_length) {
                    $items.eq(i).clone(true,true).addClass('cable-slider-clone').appendTo($wrapper);
                    i++;
                    clones_length++;
                }

                if (type != 'thumb') {
                    self.properties.slides_length = shown;
                }

                if (type == 'thumb') $items = self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');
                else $items = self.elements.$slides = $wrapper.find('>.cable-slider-slide');
            }

            // append
            i = 0;
            clones_length = 0;
            target_clones_length = min_clones;
            limit = (target_clones_length > $items.length) ? $items.length-1 : target_clones_length-1;
            while (clones_length < target_clones_length) {
                $items.eq(i).clone(true,true).addClass('cable-slider-clone').appendTo($wrapper);
                if (i >= limit) i = 0;
                else i++;
                clones_length++;
            }

            // prepend
            i = $items.length - 1;
            clones_length = 0;
            target_clones_length = min_clones;
            limit = (target_clones_length > $items.length) ? 0 : $items.length - target_clones_length;
            while (clones_length < target_clones_length) {
                $items.eq(i).clone(true,true).addClass('cable-slider-clone').prependTo($wrapper);
                if (i <= limit) i = $items.length - 1;
                else i--;
                clones_length++;
            }

            // reset
            if (type == 'thumb') self.elements.$thumbs = $wrapper.find('>.cable-slider-thumb');
            else self.elements.$slides = $wrapper.find('>.cable-slider-slide');
        }
    }
};

_private.prototype.convertIndex = function(to_type,index) {
    var self = this.self;

    if (to_type == 'thumb') {
        if (self.settings.continuous && !self.settings.thumbs_continuous) {
            index = self.elements.$slides.eq(index).data('cs-index');
        }
        else if (!self.settings.continuous && self.settings.thumbs_continuous) {
            self.elements.$thumbs.each(function(real_index){
                var $item = $(this),
                    cs_index = $item.data('cs-index');
                if (cs_index == index && !$item.hasClass('cable-slider-clone')) {
                    index = real_index;
                    return false;
                }
            });
        }
    }
    else {
        if (self.settings.continuous && !self.settings.thumbs_continuous) {
            var index_range = self._private.getIndexRange();

            self.elements.$slides.each(function(real_index){
                var $item = $(this),
                    cs_index = $item.data('cs-index');
                if (cs_index == index && !$item.hasClass('cable-slider-clone')) {
                    index = real_index;
                    return false;
                }
            });
        }
        else if (!self.settings.continuous && self.settings.thumbs_continuous) {
            index = self.elements.$thumbs.eq(index).data('cs-index');
        }
    }

    return index;
};

_private.prototype.getIndexRange = function () {
    var self = this.self;
    var extra_clone_count = (self.elements.$slides.length > self.properties.slides_length) ? Math.ceil(((self.elements.$slides.length-((self.settings.shown)*2))-self.properties.slides_length)/2) : 0,
        min_index = 0,
        max_index = 0;

    if (self.elements.$slides.length > self.settings.shown) {
        min_index = extra_clone_count;
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
    }
    else {
        if (self.settings.align == 'bottom' || self.settings.align == 'right') {
            min_index = max_index = self.elements.$slides.length-1;
        }
        else if (self.settings.align == 'center') {
            min_index = max_index = Math.floor((self.elements.$slides.length - 1) / 2);
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
            wrapper_x = _util.getTranslatePosition(self.elements.$wrapper.get(0), 'x');
            wrapper_y = _util.getTranslatePosition(self.elements.$wrapper.get(0), 'y');
            captured = false;
            self.elements.$wrapper.css('transition', 'all 0s ease');
            self._private.setCarouselPosition('slide', wrapper_x, wrapper_y);

            self.pause();

            move(new_start_x, new_start_y, false, type);
        },
        move = function (new_move_x, new_move_y, event, type) {
            move_x = new_move_x;
            move_y = new_move_y;

            var movement_x = Math.abs(move_x - start_x) - capture_space,
                movement_y = Math.abs(move_y - start_y) - capture_space;

            if (type != 'touch') captured = true;

            if (!captured) {
                if ((movement_x > 0 || movement_y > 0) && ((movement_y >= movement_x && self.settings.orientation == 'vertical') || movement_x >= movement_y)) {
                    captured = true;
                }
                else {
                    if ((movement_x > 0 || movement_y > 0) && ((movement_y < movement_x && self.settings.orientation == 'vertical') || movement_x < movement_y)) {
                        end(event,type);
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
                        furthest_position = nearest_position = (self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation)) * -1;
                    }
                    else if (self.settings.align == 'center') {
                        furthest_position = nearest_position  = (self._private.getFurthestPosition(self.elements.$slides.last(), self.elements.$wrapper, container_size, self.settings.orientation) / 2) * -1;
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
                        }
                        else if (new_position > nearest_position) {
                            start_y = move_y;
                            wrapper_y = furthest_position;
                            old_position = wrapper_y;
                            new_position = wrapper_y;
                            self.properties.current_index += self.properties.slides_length;
                        }
                    }
                    else {
                        if (new_position < furthest_position) new_position = furthest_position + ((new_position - furthest_position) / 3);
                        else if (new_position > nearest_position) new_position = nearest_position + ((new_position - nearest_position) / 3);
                    }

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
                        else if (new_position > nearest_position) {
                            start_x = move_x;
                            wrapper_x = furthest_position;
                            old_position = wrapper_x;
                            new_position = wrapper_x;
                            self.properties.current_index += self.properties.slides_length;
                        }
                    }
                    else {
                        if (new_position < furthest_position) new_position = furthest_position + ((new_position - furthest_position) / 3);
                        else if (new_position > nearest_position) new_position = nearest_position + ((new_position - nearest_position) / 3);
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
            }

            if (self.settings.auto_play) {
                self.play();
            }

            if (captured) {
                var $target = $(event.target);
                if ($target.closest(self.elements.$container).length) {
                    $(event.target).one('click',function(e){
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
        self.elements.$container.css('touch-action','manipulation');

        self.elements.$container.off('dragstart.' + _static._event_namespace).on('dragstart.' + _static._event_namespace,function(e){
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

    var pauseAutoPlay = function () {
        self.pause();
    };
    var resumeAutoPlay = function () {
        if (self.settings.auto_play) {
            self.play();
        }
    };

    // attach listeners
    if (_util.elementExists(self.elements.$next)) {
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
    if (_util.elementExists(self.elements.$prev)) {
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

    if (_util.elementExists(self.elements.$container)) {
        if (self.settings.hover_pause) {
            self.elements.$container
                .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
        }
    }

    if (self.settings.draggable) {
        self._private.attachDragEvents();
    }

    if (_util.elementExists(self.elements.$thumbs_container)) {
        if (self.settings.hover_pause) {
            self.elements.$thumbs_container
                .off('mouseenter.' + _static._event_namespace).on('mouseenter.' + _static._event_namespace, pauseAutoPlay)
                .off('mouseleave.' + _static._event_namespace).on('mouseleave.' + _static._event_namespace, resumeAutoPlay);
        }
    }

    if (_util.elementExists(self.elements.$thumbs)) {
        self.elements.$thumbs.off('click.' + _static._event_namespace).on('click.' + _static._event_namespace, function (e) {
            e.preventDefault();
            var $item = $(this),
                new_slide_index = self._private.convertIndex('slide',$item.data('cs-index'));
            self.shift(new_slide_index-self.properties.current_index);
        });
    }
};

_private.prototype.build = function () {
    var self = this.self;
    if (!_util.elementExists(self.elements.$container)) {
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

        if (!_util.isNumber(self.settings.shown) || self.settings.shown < 1) self.settings.shown = 1;

        self.elements.$root = $root;
        self.elements.$container = $container;
        self.elements.$wrapper = $wrapper;
        self.elements.$slides = $slides;
        self.properties.slides_length = $slides.length;

        $slides.each(function(i){
            $(this).data('cs-index',i);
        });

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

            if (_util.elementExists($thumbs)) {
                $thumbs.each(function(i){
                    $(this).data('cs-index',i);
                });
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
    direction = _util.param(direction, 0);

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

        self._private.setCarouselItemsActive(type, new_index);

        // activity end

        // container height start

        $items.each(function () {
            var $item = $(this),
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
                    }
                    else {
                        if (item_height > data.new_container_height) {
                            data.new_container_height = item_height;
                        }
                    }
                }
            }
            else {
                if (orientation == 'vertical') {
                    data.new_container_height += item_height;
                }
                else {
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

        $container.css({'transition': 'all 0s ease'});
        $wrapper.css({'transition': 'all 0s ease'});

        data = {
            current_index: self.properties.current_index,
            new_index: self.properties.new_index,
            container_width: $container.get(0).getBoundingClientRect().width,
            container_height: $container.get(0).getBoundingClientRect().height,
            new_container_height: 0
        };

        if (type == 'thumb') {
            data.current_index = self._private.convertIndex('thumb',data.current_index);
            data.new_index = self._private.convertIndex('thumb',data.new_index);
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
        }
        else {
            slide_css = {
                'width': ((data.container_width - (margin * (shown - 1))) / shown) + 'px',
                'height': 'auto',
                'float': 'left',
                'transition': 'all 0s ease'
            };
            if (_util.isNumber(margin)) {
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
