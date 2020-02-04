(function(){
﻿$.fn.addContentLink = function(params)
{
   params = params || {};
   params = $.extend({
      title    : 'Добавить что-то там', 
      name     : 'add_widget', 
      href     : 'javascript:void(0);',
      onClick  : function($a){}
   }, params);
   
   var init = function($container)
   {
      var $list = $container.find('.add_content_list');
      if (!$list.length)
         $list = $container.append('<ul class="add_content_list">').find('.add_content_list');
         
      var $link = $list.find('.' + params.name + ' a');
      if (!$link.length)
         $link = $list
            .append('<li class="' + params.name + '"><a href="' + params.href + '">' + common.htmlspecialchars(params.title) + '</a></li>')
            .find('.' + params.name + ' a');
      
      $link.click(function(){
         params.onClick($(this));
      });
   }
   
   return common.init(this, init);
}})();
