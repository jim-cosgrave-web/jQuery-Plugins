;(function ( $, window, document, undefined ) {
    'use strict';

    var $window     = $(window),
        $document   = $(document),
        $body       = $('body'),
        $containers = $('.magnify-container'),
        bodyPadding;

    function init () {
    	setMouseMoveEvent( document, window );
        cacheBodyPadding();

        $.each($containers, function () {
            var $this, $src, $enlarge, $target, srcBounds, containerPadding, enlargedDisplayWidth, 
                enlargedDisplayHeight, enlargedHeight, enlargedWidth, enlargedDisplayScale, scale, 
                offsetLeft, offsetTop, timeout;

            setContainerVariables(this);
            positionEnlarge();
            loadBackgroundImage();
            setMouseHoverEvent();

            // Check if the image is being hovered over            
            function mouseInRange(e, bounds, timeoutCheck) {
                var mouseX = e.clientX,
                    mouseY = e.clientY;

                // The timeout check is needed because a timeout is set every time the image is hovered over
                // When the timeout expires we need to check if the image is no longer being hovered over.
                // The mouseX and mouseY values differ based on event that triggers this method.
                if(timeoutCheck) {
                    return ((mouseX  >= bounds.left && mouseX  <= bounds.right) 
                        && (mouseY  >= bounds.top && mouseY  <= bounds.bottom));
                } else {
                    return ((mouseX + $window.scrollLeft() >= bounds.left && mouseX + $window.scrollLeft() <= bounds.right) 
                        && (mouseY + $window.scrollTop() >= bounds.top && mouseY + $window.scrollTop() <= bounds.bottom));
                }
            }

            function setMouseHoverEvent () {
            	$this.mousemove(function ( e ) {
                    // Clear any previously set timeouts because we only need 1 active check
					clearTimeout(timeout);

            		timeout = setTimeout(function () { checkUnfocus(); }, 100);
 
                    // If the mouse is hovering over the image
            		if ( mouseInRange( e, srcBounds ) ) {
            			showEnlarge();
            			moveBackgroundImage( e );
            			moveTarget( e );
            		} else {
                        hideEnlarge();
            		}
            	});

                // Repositions the background image of the zoomed in image element
            	function moveBackgroundImage ( e ) {
                    var distLeft = (e.clientX - srcBounds.left - offsetLeft + $window.scrollLeft()) / scale,
                        distTop = (e.clientY - srcBounds.top - offsetTop + $window.scrollTop()) / scale;

                    if(distLeft < 0)
                        distLeft = 0;

                    if(distTop < 0)
                        distTop = 0;

                    var distFromSide = (enlargedWidth - enlargedDisplayWidth) - distLeft;

                    if(distFromSide < 0)
                        distLeft = enlargedWidth - enlargedDisplayWidth

                    var distFromBottom = (enlargedHeight - enlargedDisplayHeight) - distTop;

                    if(distFromBottom < 0)
                        distTop = enlargedHeight - enlargedDisplayHeight;

                    $enlarge.css({
                    	'background-position-x': -distLeft,
                    	'background-position-y': -distTop
                    });
            	}

                // The "target" refers to the square with a blue dotted background that appears over the
                // source image as you hover over it.  The element follows the mouse, but is also bound
                // to the edges of the source image.
            	function moveTarget ( e ) {
                    var targetLeft = e.clientX - ($target.outerWidth() / 2) + containerPadding.left,
                        targetTop = e.clientY - ($target.outerHeight() / 2) + containerPadding.top;

                    targetLeft -= srcBounds.left - $window.scrollLeft();
                    targetTop -= srcBounds.top - $window.scrollTop();

                    if(e.clientX + $window.scrollLeft() - $src.offset().left - $target.width() / 2 < 0)
                        targetLeft = 0 + containerPadding.left;

                    if(e.clientY + $window.scrollTop() - $src.offset().top - $target.height() / 2 < 0)
                        targetTop = 0 + containerPadding.top;

                    if(targetLeft + $target.outerWidth() - containerPadding.left + srcBounds.left > srcBounds.right)
                        targetLeft = srcBounds.right + containerPadding.left - $target.width() - srcBounds.left - 1;

                    if(targetTop + $target.outerHeight() - containerPadding.top + srcBounds.top > srcBounds.bottom)
                        targetTop = srcBounds.bottom + containerPadding.top - $target.outerHeight() - srcBounds.top + 1

                    $target.css({
                    	left: targetLeft,
                    	top: targetTop
                    });
            	}

                // This method is invoked when the mouse move timeout expires and
                // will check if the user is still hovering over the source image
            	function checkUnfocus ( ) {
                    var e = {
                        clientX: window.mouseXPos,
                        clientY: window.mouseYPos
                    };
                    
                    if( mouseInRange( e, srcBounds, true ) ) {
                    	showEnlarge();
                    } else {
                    	hideEnlarge();
                    }
            	}

            	function showEnlarge () {
            		$enlarge.show();
                    $target.show();
            	}

            	function hideEnlarge () {
            		$enlarge.hide();
                    $target.hide();
            	}
            }

            // This method is invoked at the very beginning of processing.
            // Rather than loading the large background image before the page loads,
            // we load it into an element as this plugin is running and store some data
            // about the image.  This allows us to get the size of the background image
            // compared to the source image so we can determine things like the scale
            // between the 2 images.
            function loadBackgroundImage () {
                var bgImg = $('<img />');
                bgImg.hide();
                bgImg.bind('load', function() {
                    enlargedHeight = $(this).height();
                    enlargedWidth = $(this).width();
                    enlargedDisplayScale = enlargedDisplayWidth / enlargedWidth;
                    scale = $src.outerWidth() / enlargedWidth;

                    $target.css({
                        width: enlargedDisplayWidth * scale,
                        height: enlargedDisplayHeight * scale
                    });

                    offsetLeft = ($target.width() / 2);
                    offsetTop = ($target.height() / 2);

                    $(this).remove();
                });

                $('body').append(bgImg);
                bgImg.attr('src', $src.attr('data-img-src'));
            }

            // This method is invoked during initial processing.
            // The zoom element is given a background image and is positioned to the side
            // of the source image.  Repositioning does not check if the zoomed in element
            // will end up being off the screen, but that could easily be added.
            function positionEnlarge () {
            	$enlarge.css({
                    'background-image': 'url(' + $src.data('img-src') + ')',
                    'left': srcBounds.right + 16,
                    'top': srcBounds.top
                });
            }

            // Store some variable available to the scope of the entire plugin that will be
            // used frequently
            function setContainerVariables ( self ) {
			    $this = $(self),
			    $src = $this.find('img.magnify-src'),
			    $enlarge = $this.parent('.magnify-wrap').find('.magnify-enlarge'),
			    $target = $this.find('.magnify-target'),

			    srcBounds = {
                    left: $src.offset().left,
                    right: $src.offset().left + $src.outerWidth(),
                    top: $src.offset().top,
                    bottom: $src.offset().top + $src.outerHeight()
                },

                containerPadding = {
                    top: parseInt($this.css('padding-top')),
                    left: parseInt($this.css('padding-left'))
                },

                enlargedDisplayWidth = $enlarge.width(),
                enlargedDisplayHeight = $enlarge.height();
			}
        });
    }

    // An event that fires any time the mouse is moved and stores the current position
    // of the mouse
    function setMouseMoveEvent ( document, window ) {
        $(document).mousemove(function(e) {
            window.mouseXPos = e.pageX;
            window.mouseYPos = e.pageY;
        }); 
    }

    // Body padding is required to correctly position elements in other methods.  We need
    // to cache this padding so we can reuse it later.
    function cacheBodyPadding () {
        bodyPadding = {
            top: parseInt($body.css('margin-top')),
            right: parseInt($body.css('margin-right')),
            bottom: parseInt($body.css('margin-bottom')),
            left: parseInt($body.css('margin-left'))
        };
    }

    // Kick everything off
    init();
})( jQuery, window, document );