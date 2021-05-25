import $ from "jquery"
import {_util} from "./util"
import {_static} from "./static"
import {_private} from "./private";
import {_default_settings} from "./default-settings";

export const _core = function (settings) {
    var self = this;
    self._private = new _private(self);

    //defaults for pass through values
    self.properties = {
        instance_id: _static._next_instance_id,
        events: {}
    };
    self._private.reset();

    self.base_settings = $.extend(true, {}, self.default_settings, _util.param(settings, {}));
    self._private.applySettings(true); // use base settings and the responsive settings inside to get overall settings

    _static._next_instance_id++;
    _static._instances[self.properties.instance_id] = self;
    _static._instances.length++;

    if (self.settings.auto_create) self.create();
};

_core.prototype.version = __VERSION__;
_core.prototype.default_settings = _default_settings;


_core.prototype.create = function () {
    var self = this;
    self.destroy();

    self.trigger('create');

    self._private.build();

    if (!_util.elementExists(self.elements.$slides)) return;

    self._private.load();

    // first adjust
    self._private.prepareAdjust('slide');
    self._private.prepareAdjust('thumb');
    self.adjust(false, true);

    self.goTo((self.settings.continuous ? Math.floor((self.elements.$slides.length-self.properties.slides_length)/2) : 0), 0);

    self.adjust(false,true);

    if (self.settings.auto_play) {
        self.play();
    }

    self.trigger('after_create');
};

_core.prototype.destroy = function () {
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

_core.prototype.update = function (settings) {
    var self = this;

    $.extend(true, self.base_settings, _util.param(settings, {}));
    self._private.applySettings(true);
    self.adjust(false, true);
};

_core.prototype.adjust = function (animate, immediate) {
    var self = this;
    animate = _util.param(animate, true);
    immediate = _util.param(immediate, true);
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

_core.prototype.isReady = function () {
    // if minimum loaded images is true
};

_core.prototype.goTo = function (slide, direction) {
    var self = this;
    self._private.resetAutoPlay();
    if (_util.isNumber(slide)) {
        slide = self._private.getValidIndex(slide);
        self._private.changeSlide(self.elements.$slides.get(slide), direction);
    }
    else {
        self._private.changeSlide(slide, direction);
    }
};

_core.prototype.shift = function (amount) {
    var self = this;
    if (_util.isNumber(amount) && amount != 0) {
        self.goTo(self.properties.current_index + amount, (amount < 0) ? -1 : 1);
    }
};

_core.prototype.next = function () {
    var self = this;
    var new_index = self.properties.current_index + 1;

    var index_range = self._private.getIndexRange();
    if (new_index > index_range.max) {
        if (self.elements.$slides.length > self.properties.slides_length && self.settings.continuous) {
            self.elements.$wrapper.css({'transition': 'all 0s ease'});
            var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
                new_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.min), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1;
            if (self.settings.orientation == 'vertical') {
                self._private.setCarouselPosition('slide',0,new_position);
            }
            else {
                self._private.setCarouselPosition('slide',new_position,0);
            }
            self.properties.current_index = index_range.min;
            new_index = index_range.min+1;
        }
        else {
            new_index = index_range.min;
        }
    }

    self.goTo(new_index, 1);
};

_core.prototype.prev = function () {
    var self = this;
    var new_index = self.properties.current_index - 1;

    var index_range = self._private.getIndexRange();
    if (new_index < index_range.min) {
        if (self.elements.$slides.length > self.properties.slides_length && self.settings.continuous) {
            self.elements.$wrapper.css({'transition': 'all 0s ease'});
            var container_size = self._private.getContainerSize(self.elements.$container, self.settings.orientation),
                new_position = self._private.getItemPosition(self.elements.$slides.eq(index_range.max), self.elements.$wrapper, container_size, self.settings.orientation, self.settings.align) * -1;
            if (self.settings.orientation == 'vertical') {
                self._private.setCarouselPosition('slide',0,new_position);
            }
            else {
                self._private.setCarouselPosition('slide',new_position,0);
            }
            self.properties.current_index = index_range.max;
            new_index = index_range.max-1;
        }
        else {
            new_index = index_range.max;
        }
    }

    self.goTo(new_index, -1);
};

_core.prototype.play = function () {
    var self = this;
    self.pause();
    var timeout_ms = (_util.isNumber(self.settings.auto_play)) ? parseInt(self.settings.auto_play, 10) : 3000;
    self.properties.auto_play_timer = setTimeout(function () {
        self.next();
    }, timeout_ms);
};

_core.prototype.pause = function () {
    var self = this;
    if (self.properties.auto_play_timer !== false) {
        clearTimeout(self.properties.auto_play_timer);
        self.properties.auto_play_timer = false;
    }
};

_core.prototype.on = function (event, handler) {
    var self = this;
    var event_parts = event.split('.', 2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : '_default';
        if (!_util.isPlainObject(self.properties.events[event_type])) self.properties.events[event_type] = {};
        if (!_util.isArray(self.properties.events[event_type][event_name])) self.properties.events[event_type][event_name] = [];
        self.properties.events[event_type][event_name].push(handler);
    }
};

_core.prototype.off = function (event, handler) {
    var self = this;
    var event_parts = event.split('.', 2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
        if (_util.isPlainObject(self.properties.events[event_type])) {
            for (var current_event_name in self.properties.events[event_type]) {
                if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                    && _util.isArray(self.properties.events[event_type][current_event_name])
                    && (event_name === false || event_name === current_event_name)) {
                    if (_util.isFunction(handler)) {
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

_core.prototype.trigger = function (event, handler, params) {
    var self = this;
    params = (_util.isArray(params)) ? params : [];
    var event_parts = event.split('.', 2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
        if (_util.isFunction(self.settings[event_type])) {
            self.settings[event_type]();
        }
        if (_util.isPlainObject(self.properties.events[event_type])) {
            for (var current_event_name in self.properties.events[event_type]) {
                if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                    && _util.isArray(self.properties.events[event_type][current_event_name])
                    && (event_name === false || event_name === current_event_name)) {
                    for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
                        if (_util.isFunction(self.properties.events[event_type][current_event_name][i])
                            && (!_util.isFunction(handler) || self.properties.events[event_type][current_event_name][i] === handler)) {
                            self.properties.events[event_type][current_event_name][i].apply(self, params);
                        }
                    }
                }
            }
        }
    }
};
