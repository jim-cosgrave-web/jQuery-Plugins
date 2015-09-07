;(function ( $, window, document, undefined ) {
	var pluginName = "Modal",
		defaults = {
		    propertyName: "value"
	    };

	function Plugin ( element, options ) {
		this.element = element;
		this.$element = $(element);
		this.$window = $(window);
		this.$document = $(document);
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			this.cacheModals();
			this.hideModals();
			this.positionModals();
			this.addCloseButton();
			this.createOverlay();
			this.registerEvents();
		},
		cacheModals: function () {
			this.$modals = $('.modal:not([data-show-on-load])');
		},
		hideModals: function () {
            this.$modals.hide();
            $('#cat-modal-overlay').hide();
		},
		positionModals: function () {
			var self = this;

			$.each(this.$modals, function(){
				var $this = $(this),
				    left = (self.$window.outerWidth() / 2) - ($this.outerWidth() / 2),
				    top = (self.$window.outerHeight() / 2) - ($this.outerHeight() / 2);

				$this.css({
					position: 'absolute',
					left: left,
					top: top
				});
			});
		},
		addCloseButton: function () {	
			var modals = $('.modal:not([data-modal-no-close])')

			$.each(modals, function () {
				var $close = $('<div class="cat-modal-close">x</div>');

				$close.css({
					position: 'absolute',
					top: '5px',
					right: '9px',
					cursor: 'pointer'
				});

				$(this).append($close);
			});
		},
		createOverlay: function () {
			var $elem = $('#cat-modal-overlay'),
			    self = this;

			if($elem.length === 0) {
				$elem = $('<div id="cat-modal-overlay" />');
				$elem.css({
					position: 'absolute',
					top: '0',
					bottom: '0',
					left: '0',
					right: '0',
					background: '#000',
					opacity: '.7',
					display: 'none',
					'z-index': '999998'
				});

				$('body').append($elem);

				$elem.on('click', function(){
					self.hideModals();
				});

				this.overlay = $elem;
			}
		},
		registerEvents: function () {
			var self = this,
			    $triggers = $('[data-modal-trigger]'),
			    defaultTrigger = 'click';

			$.each($triggers, function(){
				var $this = $(this);

				var elemTrigger = $this.data('trigger');
				var trigger = defaultTrigger;

				if(elemTrigger) {
					trigger = elemTrigger;
				}

				$this.on(trigger, function(){
					var $modal = $('#' + $this.data('target'));
					var action = $this.data('action');
					$modal[action]();
					self.overlay[action]();
				});
			});

			self.$document.keyup(function(e) {
			     if (e.keyCode == 27) { // escape key maps to keycode `27`
			        self.hideModals();
			    }
			});

			self.$document.on('click', '.cat-modal-close', function(){
				self.hideModals();
			});
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
