;(function ( $, window, document, undefined ) {

	var pluginName = "EditForm",
		defaults = {
		    message: "You have unsaved changes."
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
			var self = this,
			    r = this.serializeToString();

            this.formatButtonIDs();

			this.$element
			    .data('monitor', 1)
			    .data('changed', 0)
			    .data('state', r)
			    .find('*')
			    .change(function(){
			    	var c = self.serializeToString();

					if(c == r) val = 0 
					else val = 1;

			    	self.$element
			    	    .data('changed', val)
			    	    .data('state', c);

			    	if(self.hasChanged()) {
			    		self.enableButtons();
			    	} else {
			    		self.disableButtons();
			    	}
			    });

			$(window).bind('beforeunload', function() {
				if(self.hasChanged()) {
					return self.settings.message;
				}
			});

			this.disableButtons();
		},
		serializeToString() {
			return JSON.stringify(this.$element.serializeArray()).hashCode();
		},
		hasChanged() {
			return this.$element.data('changed');
		},
		formatButtonIDs() {
			if(this.settings.buttons) {
				for(var i = 0; i < this.settings.buttons.length; i++) {
					var val = this.settings.buttons[i];

					if(val[0] != '#') {
						this.settings.buttons[i] = '#' + val;
					}
				}
			}
		},
		enableButtons() {
			for(var i = 0; i < this.settings.buttons.length; i++) {
				$(this.settings.buttons[i]).prop('disabled', false);
			}
		},
		disableButtons() {
			for(var i = 0; i < this.settings.buttons.length; i++) {
				$(this.settings.buttons[i]).prop('disabled', true);
			}
		}
	});

	$.fn[ pluginName ] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
			    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		return this;
	};

})( jQuery, window, document );


String.prototype.hashCode = function() {
     return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);  
};