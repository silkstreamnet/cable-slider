thumbs shown count should always be >= slides shown count

you cant show less thumbs than slides

----------------------
How to set the container height for vertical elements
1. Make sure all slides have widths set to fit their container (default is 100%) and are displayed one after each other going down.
2. Get outerHeight of items current_index to current_index+(shown-1). Add all this together.
3. Set container height to the result of above.

This code structure needs to work with horizontal elements