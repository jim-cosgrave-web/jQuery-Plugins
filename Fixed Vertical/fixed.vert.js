
;(function ( $, window, document, undefined ) {

		var pluginName = "fixedVert",
			defaults = {
				timeout: { }
		    };
 
		function Plugin ( element, options ) {
			this.element = $(element);
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function () {
				this.extendSettings();
				this.initializeCSS();
				this.moveElement();
				this.registerEvents();
			},
			extendSettings: function () {
                var padding = {
                    top: parseInt(this.settings.container.css('padding-top')),
                    right: parseInt(this.settings.container.css('padding-right')),
                    bottom: parseInt(this.settings.container.css('padding-bottom')),
                    left: parseInt(this.settings.container.css('padding-left'))
                };

                //console.log(padding);

                //var padding = parseInt(this.settings.container.css('padding-top'));
                var topBoundary = this.settings.boundingElementTop.offset().top + this.settings.boundingElementTop.outerHeight() + padding.top;
                var bottomBoundary = this.settings.boundingElementBottom.offset().top - this.element.outerHeight() - padding.top;
                var elementHeight = this.element.outerHeight();

                var extendedSettings = {
                    padding: padding,
                    topBoundary: topBoundary,
                    bottomBoundary: bottomBoundary,
                    elementHeight: elementHeight
                };

                this.settings = $.extend( {}, this.settings, extendedSettings );
			},
			initializeCSS: function () {
                this.element.css({
                    position: 'absolute',
                    left: this.settings.container.offset().left + this.settings.padding.left,
                    top: this.settings.topBoundary
                });
			},
			moveElement: function () {
                var self = this;

				clearTimeout(this.settings.timeout);

                this.settings.timeout = setTimeout(function(){
	                var windowTop = window.pageYOffset;
		            var top;

					if(windowTop > self.settings.topBoundary) {
		                top = windowTop + self.settings.padding.top;

					    var fixedBottom = top + self.settings.elementHeight - self.settings.padding.bottom;
					
					    if(fixedBottom > self.settings.bottomBoundary) {
							top = self.settings.bottomBoundary - (self.settings.padding.bottom * 6)
						}
					}
					else {
					    top = self.settings.topBoundary;
					}

					//$fixed.css('top', top);
					self.element.animate({'top': top}, 500);
				}, 100);
			},
			registerEvents: function () {
                var self = this;

                $(document).on('scroll', function () {
                	self.moveElement();
                });
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
				    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});

			// chain jQuery functions
			return this;
		};

})( jQuery, window, document );
	