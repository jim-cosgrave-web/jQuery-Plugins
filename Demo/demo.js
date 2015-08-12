(function( $ ){
    'use strict';

    $.fn.equalizeHeight = function (options) {
        var $rows = $(this);

        $.each($rows, function(){
            var $cols = $(this).find(options.columnClass),
                tallestHeight = 0;

            $.each($cols, function(i, el){
                var elHeight = $(el).outerHeight();

                if(elHeight > tallestHeight) {
                    tallestHeight = elHeight;
                }
            });

            $cols.css('min-height', tallestHeight);
        });

        return this;
    };
})( jQuery );

(function($){
    'use strict';

    $('.img').each(function(){
        var $img = $(this);

        if($img.parent('.captioned-image').length === 0) {
          $img
              .wrap('<div class="captioned-image"></div>')
              .after('<span class="caption">' + $img.attr('title') + '</span>')
        }
    });
})(jQuery);