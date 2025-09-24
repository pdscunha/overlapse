// Call & init
$(document).ready(function(){
  var sliders = $('.ba-slider');

  sliders.each(function(){
    var cur = $(this);
    // Adjust the slider image width to match the container width
    var width = cur.width() + 'px';
    cur.find('.resize img').css('width', width);
    // Prepare the slider for the entrance animation
    prepareSliderAnimation(cur);
    // Bind dragging events
    drags(cur.find('.handle'), cur.find('.resize'), cur);
  });

  initSliderAnimations(sliders);
});

// Update sliders on resize. 
// Because we all do this: i.imgur.com/YkbaV.gif
$(window).resize(function(){
  $('.ba-slider').each(function(){
    var cur = $(this);
    var width = cur.width()+'px';
    cur.find('.resize img').css('width', width);
  });
});

function drags(dragElement, resizeElement, container) {
	
  // Initialize the dragging event on mousedown.
  dragElement.on('mousedown touchstart', function(e) {
    dragElement.css('transition', 'none');
    resizeElement.css('transition', 'none');
    
    dragElement.addClass('draggable');
    resizeElement.addClass('resizable');
    
    // Check if it's a mouse or touch event and pass along the correct value
    var startX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;
    
    // Get the initial position
    var dragWidth = dragElement.outerWidth(),
        posX = dragElement.offset().left + dragWidth - startX,
        containerOffset = container.offset().left,
        containerWidth = container.outerWidth();
 
    // Set limits
    minLeft = containerOffset - 20 //+ 10//;
    maxLeft = containerOffset + containerWidth - dragWidth + 20 //- 10//;
    
    // Calculate the dragging distance on mousemove.
    dragElement.parents().on("mousemove touchmove", function(e) {
    	
      // Check if it's a mouse or touch event and pass along the correct value
      var moveX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;
      
      leftValue = moveX + posX - dragWidth;
      
      // Prevent going off limits
      if ( leftValue < minLeft) {
        leftValue = minLeft;
      } else if (leftValue > maxLeft) {
        leftValue = maxLeft;
      }
      
      // Translate the handle's left value to masked divs width.
      widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
			
      // Set the new values for the slider and the handle. 
      // Bind mouseup events to stop dragging.
      $('.draggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
        $(this).removeClass('draggable');
        resizeElement.removeClass('resizable');
      });
      $('.resizable').css('width', widthValue);
    }).on('mouseup touchend touchcancel', function(){
      dragElement.removeClass('draggable');
      resizeElement.removeClass('resizable');
    });
    e.preventDefault();
  }).on('mouseup touchend touchcancel', function(e){
    dragElement.removeClass('draggable');
    resizeElement.removeClass('resizable');
  });
}

function prepareSliderAnimation(slider) {
  slider.data('hasAnimated', false);
  slider.find('.resize').css({ width: '0%', transition: 'none' });
  slider.find('.handle').css({ left: '0%', transition: 'none' });
}

function animateSlider(slider) {
  if (slider.data('hasAnimated')) {
    return;
  }

  slider.data('hasAnimated', true);

  var resizeEl = slider.find('.resize');
  var handleEl = slider.find('.handle');

  // Force reflow so transition toggles reliably
  resizeEl[0].offsetHeight;
  handleEl[0].offsetHeight;

  resizeEl.css('transition', 'width 500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)');
  handleEl.css('transition', 'left 500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)');

  resizeEl.css('width', '50%');
  handleEl.css('left', '50%');

  setTimeout(function(){
    resizeEl.css('transition', 'none');
    handleEl.css('transition', 'none');
  }, 520);
}

function initSliderAnimations(sliders) {
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateSlider($(entry.target));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    sliders.each(function(){
      observer.observe(this);
    });
  } else {
    // Fallback: animate any sliders currently visible and on scroll
    var onScroll = function() {
      sliders.each(function(){
        var slider = $(this);
        if (isElementInViewport(slider[0])) {
          animateSlider(slider);
        }
      });
    };

    $(window).on('scroll.baSlider resize.baSlider', onScroll);
    onScroll();
  }
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}
