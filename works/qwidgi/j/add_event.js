(function(){

$.fn.addEvent = function(item, options)
{
   options = options || {};
   options = $.extend({
      afterVoite : function(){},
      is_news    : false
   }, options);
   var $cont = $(this);

   var voit_control_change = function($cont, o)
   {
      $cont.find('.' + o.className + ' .approve, .' + o.className + ' .decline').remove();
      $cont.find('.' + o.className).append('<span class="approved vote"></span> <span class="declined vote" title="Проголосовать ПРОТИВ"></span>');

      options.afterVoite();
   }

   if(!$cont.find('.' + item.className).length)
   {
      var send_params = {};
      send_params.action_id = options.is_news ? item.className.substr(1) : null;
      send_params.id = !options.is_news ? item.className.substr(1) : null;
      $cont
         .append('<li class="item ' + item.className + '">' + item.innerHTML + '</li>')
         .find('.' + item.className + ' .approve')
         .click(function(){
            $cont.find('.' + item.className + ' .approve').addClass('loading');
            $.post(
            '/office/approve',
            $.extend({approve:true}, send_params),
            function(data)
            {
               $cont.find('.' + item.className + ' .approve').removeClass('loading');
               if(data.sc)
               {
                  voit_control_change($cont, item);
               }
            },
            'json'
           )
         })
         .parent()
         .find('.decline')
         .click(function(){
            $cont.find('.' + item.className + ' .decline').addClass('loading');

            $.post(
            '/office/approve',
            $.extend({approve:false}, send_params),
            function(data)
            {
               $cont.find('.' + item.className + ' .decline').removeClass('loading');
               if(data.sc)
                  voit_control_change($cont, item);
            },
            'json'
           )
         });
   }
}})();
