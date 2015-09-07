// ;(function($, window, document, undefined) {

//     var pluginName = 'Lrn';

//     $.fn[ pluginName ] = function(options) {
//         $(this).css('color', 'red');
//     }

// })($, window, document);

(function( $ ) {
	$.fn.colorify = function ( options ) {

		var settings = $.extend({
			color: '#556b2f',
			backgroundColor: 'white'
		}, options);

		return this.each(function(){
		    $(this).css({
		    	'color': settings.color,
		    	'background-color': settings.backgroundColor
		    });
		});
	}
})( jQuery );

(function($){

    $.fn.popup = function (action) {

    	if ( action === 'open' ) {
    		// open
    	}

    	if ( action === 'close' ) {
    		// close
    	}
    };

})( jQuery );


(function($){

    $.fn.showLinkLocation = function () {

    	this.filter('a').append(function(){
    		return ' (' + this.href + ')';
    	});

    	return this;
    };

})( jQuery );



$.fn.hilight = function ( options ) {

	var opts = $.extend({}, $.fn.hilight.defaults, options);

	this.css({
		color: opts.foreground,
		background: opts.background
	})
};

$.fn.hilight.defaults = {
	foreground: 'red',
	background: 'yellow'
};


























