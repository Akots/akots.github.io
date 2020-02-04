(function(){


$.fn.popupHint = function(options)
{
   options = options || {}

   function init($obj, options)
   {
      var $h = $(
         '<div class="' + (!options.isDialog ? 'popup-hint' : 'dialog-hint') + (options.header ? ' popup-header' : '') + '">' +
            '<div class="c lt"></div>' +
            '<div class="br t">' + (options.header ? '<h3>' + options.header + '</h3>' : '') + '</div>' +
            '<div class="c rt"></div>' +
            '<div class="br l"></div>' +
            '<div class="content"></div>' +
            '<div class="br r"></div>' +
            '<div class="c lb"></div>' +
            '<div class="br b"></div>' +
            '<div class="c rb"></div>' +
         '</div>'
      );

      $obj.before($h);

      $h.find('.content').append($obj);

      return $h;
   }

   var $res = false;

   $(this).each(function()
   {
      var t = init($(this), options);

      if(!$res)
         $res = t;
      else
         $res.push(t);
   });

   return $res;
}


})();
