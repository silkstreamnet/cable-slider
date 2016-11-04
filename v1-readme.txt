thumbs shown count should always be >= slides shown count

you cant show less thumbs than slides

fixes to do
- on ios, the scroll is not blocked on touch drag
- on android, the scroll is blocked vertically.. need to update to check if the intention of the scroll matches the direction of the slides
- if translate3d is not available, use translate2d