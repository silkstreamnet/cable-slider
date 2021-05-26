import $ from "jquery";
import {_static} from "./static";
import {_core} from "./core";

// global events
_static.$window.off('resize.' + _static._event_namespace).on('resize.' + _static._event_namespace, function () {
    if (_static._instances.length > 0) {
        for (var i in _static._instances) {
            if (_static._instances.hasOwnProperty(i)) {
                if (_static._instances[i] instanceof _core) {
                    _static._instances[i].adjust(false, false);
                }
            }
        }
    }
});

$.CableSlider = _core;

export default _core;
