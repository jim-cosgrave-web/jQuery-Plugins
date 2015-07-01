/*
 *  Description: Small plugin to turn a list of nested ul into a tree view
 *  Author: Jim Cosgrave
 */

;(function ( $, window, undefined ) {
  // Create the defaults once
  var pluginName = 'TreeView',
      document = window.document,
      defaults = {
      	effect: 'toggle',
      	effectSpeed: '',
      	linkOnlyToggle: true
      };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend( {}, defaults, options) ;

    this.validateOptions();

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.validateOptions = function () {
  	if(!this.options.effect || this.options.effect === '') {
  		this.options.effect = 'toggle';
  	}
  }

  Plugin.prototype.init = function () {
    var self = this, $body = $('body');

    this.$element.find('ul').eq(0).find('li').find('ul').hide();

    $body.off('click').on('click', 'a.tree-node-toggle', function(e) {
        self.toggle(this, e)
    });

    var li = this.$element.find('li');

    if (!this.options.linkOnlyToggle) {
	    li.off('click').on('click', function(e) {
			self.toggle(this, e)
	    });

        li.css('cursor', 'default');
	    li.has('ul').css('cursor', 'pointer');
	}


  };

  Plugin.prototype.toggle = function(elem, e){
      $(elem).closest('li').find('ul').eq(0)[this.options.effect](this.options.effectSpeed);
      e.preventDefault();
      e.stopPropagation(); 
  }

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  }

}(jQuery, window));