(function(){

jQuery.fn.responseList = function(params)
{

   if (!this || !this.length) return;

   params = params || {};

   var $responses = this;

   var hidebar = common.getHidebar(this);
   var count = 0;

   var updateHidebar = function()
   {
      if (!hidebar) return;

      hidebar.setInfo('отзывов: ' + count);
   }

   params = $.extend({
      onDelete : function(){
         --count;
         updateHidebar();
      },
      onAdd    : function(){
         ++count;
         updateHidebar();
      }
   }, params);

   var $template = $responses.find('.response.pattern').removeClass('pattern').remove();
   var $list = $responses.find('.responses-list');

   if (!$template.length) return;

   var clone_response = function(i, data)
   {
      var $clone = $template.clone();

      $clone.find('.link_to_user').attr('href', data.link_to_user);
      $clone.find('.avatar img').attr('src', data.avatar);
      $clone.find('.name .link_to_user').text(data.name);
      $clone.find('.content .send_date').text(data.create);
      $clone.find('.content .text').html(common.xtagging(common.spaceWord(data.text)));

      $list.prepend($clone);

      $clone.corner("cc:#FFF");

      $list.get(0).scrollTop = 0;
   }

   $.post(
      '/office/' + params.comp_id + '/responses',
      {comp_id : params.comp_id},
      function(data)
      {         
         if (data && data.length)
         {    
            $(data).each(clone_response);
            count = data.length;
            updateHidebar();
         }

         $list
            .after(
               '<div class="col-footer add_response">' + 
                  '<h3>Ваш отзыв о компании</h3>' +
                  '<table><tr>' +
                     '<td class="lft-text"><textarea class="text"></textarea></td>' + 
                     '<td class="rgt-submit"><input type="submit" value="Отправить" name="submit" class="submit" /></td>' +
                  '</tr></table>' +
               '</div>'
            )
            .parent()
            .find('.add_response .submit').click(function()
            {
               $textarea = $responses.find('.add_response .text');
               if ($textarea.length && $.trim($textarea.val()).length)
               {
                  var $t = $list.next().find('table').addClass('loading');

                  $.post(
                     '/office/' + params.comp_id + '/add_resp',
                     {
                        comp_id : params.comp_id,
                        text    : $textarea.val()
                     },
                     function(data)
                     {
                        $t.removeClass('loading')

                        if (common.is_proto())
                           data.text = $textarea.val();

                        if (data && data.sc)
                        {
                           count++;
                           updateHidebar();
                           clone_response(0, data);
                           $textarea.val('');
                        }

                        $textarea.focus();
                     },
                     'json'
                   );
                }
                return false;
             });

           if(params && params.end)   params.end();
       },
       'json'
     );

   return $responses;
}})();
