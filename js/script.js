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
  initPhotoScrollEffects();
  initHeroHeaderVisibility();
  initHeroTextReveal();
  initLayoutSwitcher();
  initThemeToggle();
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
    }, { threshold: 0.1 });

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

function initPhotoScrollEffects() {
  var photoNodes = document.querySelectorAll('.photo');
  if (!photoNodes.length) {
    return;
  }

  var items = [];
  var itemsMap = typeof WeakMap === 'function' ? new WeakMap() : null;

  photoNodes.forEach(function(photo) {
    var frame = photo.querySelector('.photo-frame');
    var info = photo.querySelector('.info');

    if (!frame || !info) {
      return;
    }

    photo.classList.add('photo--animated');

    var item = {
      photo: photo,
      frame: frame,
      info: info,
      isInView: false,
      hasAppeared: false
    };

    items.push(item);
    if (itemsMap) {
      itemsMap.set(photo, item);
    }
  });

  if (!items.length) {
    return;
  }

  var reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var prefersReducedMotion = reduceMotionQuery ? reduceMotionQuery.matches : false;
  if (prefersReducedMotion) {
    items.forEach(function(item) {
      item.photo.classList.add('is-visible');
      item.photo.classList.add('is-parallax-ready');
      item.frame.style.setProperty('--parallax-translate', '0px');
      item.info.style.setProperty('--parallax-translate', '0px');
    });
    return;
  }

  var ticking = false;
  var removeParallaxListeners = null;

  var updateParallax = function() {
    ticking = false;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

    items.forEach(function(item) {
      var rect = item.photo.getBoundingClientRect();
      var total = viewportHeight + rect.height;

      if (total <= 0) {
        item.frame.style.setProperty('--parallax-translate', '0px');
        item.info.style.setProperty('--parallax-translate', '0px');
        return;
      }

      var progress = (viewportHeight - rect.top) / total;
      if (progress <= 0 || progress >= 1) {
        item.frame.style.setProperty('--parallax-translate', '0px');
        item.info.style.setProperty('--parallax-translate', '0px');
        return;
      }

      var centered = progress - 0.5;
      var influence = progress * (1 - progress) * 4;
      var frameOffset = -centered * 24 * influence;
      var infoOffset = centered * 32 * influence;

      item.frame.style.setProperty('--parallax-translate', frameOffset.toFixed(2) + 'px');
      item.info.style.setProperty('--parallax-translate', infoOffset.toFixed(2) + 'px');
    });
  };

  var requestParallaxUpdate = function() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  };

  var enableParallax = function() {
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
    requestParallaxUpdate();
    removeParallaxListeners = function() {
      window.removeEventListener('scroll', requestParallaxUpdate);
      window.removeEventListener('resize', requestParallaxUpdate);
    };
  };

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var item = itemsMap ? itemsMap.get(entry.target) : null;
        if (!item) {
          for (var i = 0; i < items.length; i += 1) {
            if (items[i].photo === entry.target) {
              item = items[i];
              break;
            }
          }
        }
        if (!item) {
          return;
        }

       if (entry.isIntersecting) {
         item.isInView = true;
         if (!item.hasAppeared) {
          item.photo.classList.add('is-visible');
          item.hasAppeared = true;
          window.setTimeout(function() {
            item.photo.classList.add('is-parallax-ready');
             requestParallaxUpdate();
           }, 650);
         }
          requestParallaxUpdate();
        } else {
          item.isInView = false;
        }
      });
    }, {
      threshold: 0.1
    });

    items.forEach(function(item) {
      observer.observe(item.photo);
    });

    enableParallax();
  } else {
    items.forEach(function(item) {
      item.isInView = true;
      item.photo.classList.add('is-visible');
      item.photo.classList.add('is-parallax-ready');
    });

    enableParallax();
  }

  if (reduceMotionQuery) {
    var handlePreferenceChange = function(event) {
      if (!event.matches) {
        return;
      }

      if (typeof removeParallaxListeners === 'function') {
        removeParallaxListeners();
        removeParallaxListeners = null;
      }

      items.forEach(function(item) {
        item.isInView = false;
        item.photo.classList.add('is-visible');
        item.photo.classList.add('is-parallax-ready');
        item.frame.style.setProperty('--parallax-translate', '0px');
        item.info.style.setProperty('--parallax-translate', '0px');
      });
    };

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handlePreferenceChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handlePreferenceChange);
    }
  }
}

function initHeroHeaderVisibility() {
  var header = document.querySelector('.header');

  if (!header) {
    return;
  }

  var hero = document.querySelector('.hero');
  var logo = header.querySelector('.logo');

  var getGutter = function() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-gutter')) || 0;
  };

  var gutter = getGutter();

  var measureLogoWidth = function() {
    if (!logo) {
      return;
    }

    var wasCollapsed = logo.classList.contains('logo--collapsed');
    if (wasCollapsed) {
      logo.classList.remove('logo--collapsed');
    }

    var width = logo.getBoundingClientRect().width;
    logo.style.setProperty('--logo-expanded-width', width + 'px');

    if (wasCollapsed) {
      logo.classList.add('logo--collapsed');
    }
  };

  var updateHeaderPosition = function() {
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var shouldFix = scrollY >= gutter;
    header.classList.toggle('header--fixed', shouldFix);
  };

  var handleResize = function() {
    gutter = getGutter();
    measureLogoWidth();
    updateHeaderPosition();
  };

  measureLogoWidth();
  updateHeaderPosition();

  window.addEventListener('scroll', function() {
    updateHeaderPosition();
  }, { passive: true });
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
}

function initHeroTextReveal() {
  var hero = document.querySelector('.hero');
  var title = document.querySelector('.hero__title');
  var subtitle = document.querySelector('.hero__subtitle');

  if (!hero || !title || !subtitle) {
    return;
  }

  var wrapWords = function() {
    var html = title.innerHTML;
    if (!html) {
      return;
    }

    var parts = html.split(/(\s+|<br\s*\/?\s*>)/i);
    var wordIndex = 0;
    var mapped = parts.map(function(part) {
      if (!part) {
        return '';
      }
      if (/^<br\s*\/?\s*>$/i.test(part)) {
        return part;
      }
      if (/^\s+$/.test(part)) {
        return part;
      }
      var span = '<span class="hero__title-word" style="--word-index: ' + wordIndex + ';">' + part + '</span>';
      wordIndex += 1;
      return span;
    }).join('');

    title.innerHTML = mapped;
  };

  wrapWords();

  var reveal = function() {
    if (!title.classList.contains('hero__title--visible')) {
      title.classList.add('hero__title--visible');
    }
    if (!subtitle.classList.contains('hero__subtitle--visible')) {
      subtitle.classList.add('hero__subtitle--visible');
    }
  };

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(hero);
  } else {
    reveal();
  }
}

function initLayoutSwitcher() {
  var switcher = document.querySelector('.layout-switcher');
  var container = document.querySelector('.container');

  if (!switcher || !container) {
    return;
  }

  var buttons = Array.prototype.slice.call(switcher.querySelectorAll('[data-layout]'));
  var setActive = function(button) {
    buttons.forEach(function(btn) {
      btn.classList.toggle('layout-switcher__button--active', btn === button);
    });
  };

  var applyLayout = function(layout) {
    container.setAttribute('data-layout', layout);
  };

  switcher.addEventListener('click', function(event) {
    var target = event.target.closest('[data-layout]');
    if (!target) {
      return;
    }

    var layoutName = target.getAttribute('data-layout');
    setActive(target);
    applyLayout(layoutName);
  });

  var toggleVisibility = function(show) {
    switcher.classList.toggle('layout-switcher--visible', show);
  };

  var hero = document.querySelector('.hero');

  if (hero) {
    var getViewportHeight = function() {
      return window.innerHeight || document.documentElement.clientHeight || 0;
    };

    var updateVisibility = function() {
      var rect = hero.getBoundingClientRect();
      var threshold = getViewportHeight() / 2;
      toggleVisibility(rect.bottom <= threshold);
    };
    window.addEventListener('scroll', updateVisibility, { passive: true });
    var onResize = function() {
      updateVisibility();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    updateVisibility();
  } else {
    toggleVisibility(true);
  }
}

function initThemeToggle() {
  var toggles = document.querySelectorAll('.theme-toggle');
  if (!toggles.length) {
    return;
  }

  var storageKey = 'overlapse-theme';
  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    storedTheme = null;
  }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  var hasExplicitPreference = !!storedTheme;

  var stops = ['0.95', '1.2', '1.4', '2', '2.8', '4', '5.6', '8', '11', '16'];
  var reelTransitionMs = 300;
  var reelBlurFadeMs = 140;
  var reelDelayStep = 90;

  toggles.forEach(function(btn) {
    var inner = btn.querySelector('.theme-toggle__value-inner');
    if (!inner || inner.dataset.initialized === 'true') {
      return;
    }
    inner.innerHTML = stops.map(function(stop) {
      return '<span class="theme-toggle__value-item">' + stop + '</span>';
    }).join('');
    inner.style.setProperty('--aperture-steps', stops.length - 1);
    inner.style.setProperty('--aperture-count', stops.length);
    inner.dataset.initialized = 'true';
  });

  var getStopIndex = function(theme) {
    return stops.indexOf(theme === 'dark' ? '16' : '0.95');
  };

  var updateReels = function(theme, options) {
    var index = getStopIndex(theme);
    var animate = options && options.animate;

    toggles.forEach(function(btn, idx) {
      var inner = btn.querySelector('.theme-toggle__value-inner');
      if (!inner) {
        return;
      }

      if (btn._reelTimeouts) {
        btn._reelTimeouts.forEach(function(timerId) {
          clearTimeout(timerId);
        });
      }
      btn._reelTimeouts = [];

      if (!animate) {
        inner.style.transition = 'none';
        inner.style.setProperty('--aperture-index', index);
        void inner.offsetHeight;
        inner.style.transition = '';
        btn.classList.remove('theme-toggle--animating');
      } else {
        var delay = idx * reelDelayStep;
        btn.classList.add('theme-toggle--animating');
        btn._reelTimeouts.push(setTimeout(function() {
          inner.style.setProperty('--aperture-index', index);
        }, delay));
        btn._reelTimeouts.push(setTimeout(function() {
          btn.classList.remove('theme-toggle--animating');
        }, delay + Math.max(0, reelTransitionMs - reelBlurFadeMs)));
      }
    });
  };

  var applyTheme = function(theme) {
    var isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    toggles.forEach(function(btn) {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.classList.toggle('theme-toggle--active', isDark);
    });
    if (hasExplicitPreference) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        // ignore storage errors
      }
    }
  };

  applyTheme(currentTheme);
  updateReels(currentTheme, { animate: false });

  toggles.forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
      hasExplicitPreference = true;
      applyTheme(currentTheme);
      updateReels(currentTheme, { animate: true });
    });
  });

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var mediaChangeHandler = function(event) {
      var stored = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch (error) {
        stored = null;
      }
      if (stored) {
        return;
      }
      hasExplicitPreference = false;
      applyTheme(event.matches ? 'dark' : 'light');
      updateReels(event.matches ? 'dark' : 'light', { animate: true });
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', mediaChangeHandler);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(mediaChangeHandler);
    }
  }
}
