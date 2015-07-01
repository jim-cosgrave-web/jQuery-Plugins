/*
 *  Project: Edlong
 *  Description: Small plugin to turn a list of nested ul into a tree view
 *  Author: Jim Cosgrave
 */

;(function ( $, window, undefined ) {
  // Create the defaults once
  var pluginName = 'TreeView',
      document = window.document,
      defaults = {
      };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    this.$element.find('ul').eq(0).find('li').find('ul').hide();

    $('body').on('click', 'a.tree-node-toggle', function() {
        $(this).closest('li').find('ul').eq(0).toggle();
    });

  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  }

}(jQuery, window));