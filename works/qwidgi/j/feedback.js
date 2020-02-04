(function(){

jQuery.fn.feedback = function()
{
   var $obj = $('.feedback').show().popupHint({
      header:'Обратная связь',
      isDialog:true
   }).addClass('feedback_cont');
   return this.click(function()
   {
      var $caller = $('#feedback');

      if (AUTH)
         $obj.find('label[@for=email]').hide().next().hide();
      else
         $obj.find('label[@for=email]').show().next().show();

      $obj.show();
      $caller.hide();

      $('.result', $obj).hide();

      $(AUTH || $('#email', $obj).val() != '' ? '#msg' : '#email', $obj).focus();

      var valobj =
      {
         errorElement: 'div',
         focusInvalid: false,
         focusCleanup: false,
         rules: {
            msg: {
               required: true,
               maxlength: 500000
            }
         },
         messages: {
            email: {
               required: 'Необходимо ввести email',
               email: 'Неверный email'
            },
            msg: {
               required: 'Введите текст сообщения',
               minlength: 'Не более 500 000 символов'
            }
         },
         submitHandler: function()
         {
            submit_disable();
            $('#msg', $obj).addClass('bg-loading');

            $.post(
               $obj.attr('action'),
               {
                  email: AUTH ? '' : $('#email', $obj).val(),
                  msg: $('#msg', $obj).val()
               },
               function(data)
               {

                  $('#msg', $obj).removeClass('bg-loading');
                  submit_enable();

                  if (data.sc)
                  {

                     $('.result', $obj)
                        .html(data.mg || '')
                        .addClass('status')
                        .show();

                     $('.msg', $obj).val('');

                     setTimeout(function()
                     {
                        $caller.show();
                        $obj.hide();
                     }, 3000);

                  }
                  else
                  {

                     $('.result', $obj)
                        .html(data.mg || '')
                        .removeClass('status')
                        .show();

                     $obj.find('label').each(function(i, o)
                     {
                        $('#' + $(o).attr('for')).focus(function()
                        {
                           $('.result', $obj).hide();
                        });
                     });

                  }

               }, 'json'
            );
            return false;
         }
      }

      var submit_disable = function()
      {
         $obj
            .find('input[@type=submit]')
            .attr('disabled', 'true')
            .addClass('disabled')
            .disabled = true;
      };

      var submit_enable = function()
      {
         $obj
            .find('input[@type=submit]')
            .removeAttr('disabled')
            .removeClass('disabled')
            .disabled = false;
      };

      if (!AUTH)
         valobj.rules.email = {
            required: true,
            email: true
         };

      var
         $validator = $obj.find('form').validate(valobj),
         is_init = $obj.find('input[@type=button]').length;

      if (is_init)
         return false;

      $obj.find('.submit')
         .append('<input class="cancel" type="button" value="Отмена" />')
         .find('input[@type=button]')
         .click(function()
         {
            $caller.show();
            $obj.hide();
            return false;
         });

      var fields_change = function(e)
      {
         $obj.valid() ? submit_enable() : submit_disable();
      };

      fields_change();

      $obj.find('label').each(function(i, o)
      {
         $('#' + $(o).attr('for'))
            .keyup(fields_change)
            .blur(fields_change)
            .focus(fields_change);
         $('div.error', $(o).parent()).hide();
      });

      return false;
   });
}
})();
