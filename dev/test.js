import $ from "jquery"
import "./assets/sass/test.scss"
import CableSlider from "../src/cable-slider"

$('.image-gallery-slide.hide,.image-gallery-thumb.hide').removeClass('hide');

const image_gallery_slider = new CableSlider({
    container:'.image-gallery-slides',
    next:'.image-gallery-next',
    prev:'.image-gallery-prev',
    margin:10,
    orientation:'horizontal',
    align:'center',
    shown:1,
    continuous:true,
    thumbs_container:'.image-gallery-thumbs',
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
            image_gallery_slider.on('after_adjust.update-bullet',function(){
                var perky_width = (100/image_gallery_slider.properties.slides_length);
                var index = image_gallery_slider.elements.$slides.eq(image_gallery_slider.properties.current_index).data('cs-index');
                $bullet.css({
                    'width':perky_width+'%',
                    'left':(perky_width*(index))+'%'
                });
            });
        }
    },200);
});

export default {
    image_gallery_slider
}
