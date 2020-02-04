(function(){
﻿jQuery.fn.hidebar = function(options)
{
   function hidebar($hidebar , options)
   {

      options = options || {};
      options = $.extend({
         title    : '',
         info     : '',
         hide     : true/*,
         onUpdate : function(data){
            if (data && data.title)
            {

            }
         }*/
      }, options);

      var $content = $hidebar.find('.hidebar_content');
      var $title = $hidebar.find('h3.hidebar_header'); 
      var show = typeof(options.close) == 'boolean' ? !options.close : true;

      if(!$content.length)
      {
         $content = $hidebar.removeClass('hidebar').addClass('hidebar_content');
         $hidebar = $content.wrap('<div class="hidebar ' + $content.attr('id') + '"></div>').parent();
         $title = $hidebar.prepend('<h3 class="hidebar_header"></h3>').find('h3.hidebar_header');
      }

      !options.hide ? $title.addClass('nohide') : $title.removeClass('nohide')

      if(options.title && options.title.length)
         $title.html(options.title + '<span class="info">' + options.info + '</span>');
      else
      {
         options.info = $title.find('.info').html();
         options.title = $title.html().replace(/<span[^>]*>[^<]+<\/span>/ig, '');

         if(options.title.length <= 0)
            $title.hide();
      }

      function toggle()
      {
          show ? $content.removeClass('hide') : $content.addClass('hide');
          show ? $title.removeClass('hidden') : $title.addClass('hidden');


           if (!show)
           {
              var $hidebar_title = $('<ul class="hidden_title"></ul>').appendTo($title);

              var $r = $content.find('h4.title');
              var l = $r.length;

              $r.each(function(i)
              {
                  if($(this).parent().hasClass('pattern') || $(this).parent().hasClass('delete'))
                  {
                     l--;
                     return;
                  }

                  var str = '';
                  $('a,.val', this).each(function()
                  {
                     str += this.innerHTML + ' ';
                  });

                  $hidebar_title.append('<li>' + $.trim(common.htmlspecialchars(str)).replace(/ /ig, '&nbsp;') + (i < l-1 && !(i == l-2 && $($r[l-1]).parent().hasClass('pattern')) ? ', ' : '') + '</li>');
              });

           }
           else {
              $title.find('.hidden_title').remove();
           }

       }

     if (options.hide)
        $title.click(function()
        {
           show = !show;

           toggle();

           if(options.ontoggle)
              options.ontoggle(show);
        });

      toggle();

      var setTitle = function(title)
      {
         $title.text(title);

         if(title && title.length)
            $title.show()
      }

      this.setInfo = function(info)
      {
         $title.find('.info').text(info);
      }

      return this;
   }

   return common.init(this, function(o)
   {
      var o = o.length ? o : $(o);

			if (!o.length)
				return;

      var tmp_hidebar = new hidebar(o, options);

      if(o.parents('.hidebar').length)
         o.parents('.hidebar')[0].hidebar = tmp_hidebar;

   });
}})();
