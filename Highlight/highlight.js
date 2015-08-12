
;(function ( $, window, document, undefined ) {
	var pluginName = "highlight",
		defaults = {
		color: "#ff9",
		fadeTime: 1000
	};

	function Plugin ( element, options ) {
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
	        var el = this.$element;
	        $("<div/>")
	        .width(el.outerWidth())
	        .height(el.outerHeight())
	        .css({
	            "position": "absolute",
	            "left": el.offset().left,
	            "top": el.offset().top,
	            "background-color": this.settings.color,
	            "opacity": ".7",
	            "z-index": "9999999"
	        }).appendTo('body').fadeOut(this.settings.fadeTime).queue(function () { $(this).remove(); });
		},
		privateMethod: function () {
			alert('method called');
		}
	});

	$.fn[ pluginName ] = function ( options ) {
		this.each(function() {
			new Plugin( this, options );
		})

		return this;
	};

	$.fn[ pluginName ].exit = function ( options ) {
		console.log('exiting');
	}

})( jQuery, window, document );
