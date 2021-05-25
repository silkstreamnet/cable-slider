import $ from "jquery"
import CableSlider from "../src"

$('.custom-cable-slider-slide.hide,.custom-cable-slider-thumb.hide').removeClass('hide');

const custom_cable_slider = new CableSlider({
    container:'.custom-cable-slider-slides',
    next:'.custom-cable-slider-next',
    prev:'.custom-cable-slider-prev',
    margin:10,
    orientation:'horizontal',
    align:'center',
    shown:1,
    continuous:true,
    thumbs_container:'.custom-cable-slider-thumbs',
    thumbs_shown:3,
    thumbs_orientation:'horizontal',
    thumbs_align:'left',
    thumbs_margin:false,
    auto_thumbs:false,
    //auto_play:2000,
    hover_pause:true,
    //min_clones:10,
    responsive:{ // need a function to get responsive overrides for settings
        1000:{ // if > 768 then apply these settings
            shown:1,
            thumbs_shown:30
        },
        800:{
            shown:1,
            thumbs_shown:4
        }
    }
})

$(window).on('load',function(){
    setTimeout(function(){
        var $bullet = $('.featured-banner-indicator-bullet');
        if ($bullet.length || 1) {
            custom_cable_slider.on('after_adjust.update-bullet',function(){
                var perky_width = (100/custom_cable_slider.properties.slides_length);
                var index = custom_cable_slider.elements.$slides.eq(custom_cable_slider.properties.current_index).data('cs-index');
                $bullet.css({
                    'width':perky_width+'%',
                    'left':(perky_width*(index))+'%'
                });
            });
        }
    },200);
});

export default {
    custom_cable_slider
}
