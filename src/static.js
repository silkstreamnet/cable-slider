import $ from "jquery"

export const _static = {
    $document: $(document),
    $window: $(window),
    $html: $('html'),
    $body: $('body'),
    _event_namespace: 'CableSlider',
    _next_instance_id: 0,
    _next_transition_id: 0,
    _instances: {length: 0}
};
