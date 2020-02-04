(function(){

function remind($action, options)
{
   var $obj = options.snap.before(options.html).prev().hide();

   if(!$('.cancel', $obj).length)
      $('.submit', $obj).append('&nbsp;<a class="cancel ajax" href="javascript:void(0);" type="button">Отмена</a>');

   $action.click( function()
   {
      $obj.show();

      options.show();

      $('.message', $obj).css('visibility', 'hidden');

      if(options && options.email)
         $('.remail', $obj).val(options.email());
   });

   $obj.find('.cancel').click( function()
   {
      $obj.hide();
      options.close();
      $('.message', $obj).hide();
   });

   $obj.validate(
   {
      errorElement: 'div',
      rules: {
         remail: { required: true, email: true }
      },
      messages: {
         remail: {
            required: '',
            email: 'Не верный e-mail адрес'
         }
      },
      submitHandler: function() {
         
         $.post('/u/gen_pwd', {
               remail : $('.remail', $obj).val()
            },
            function(data)
            {
               var $message = $('.message', $obj);
               var is_email = false;
               var system_message = 'Неверный E-mail!';

               if(common.is_proto() && $('.remail', $obj).val() != 'user@mail.com') {
                  is_email = false;
                  system_message = 'Такой e-mail не найден!';
               } else {
                  is_email = data.is_email;
                  system_message = data.sm || (data.is_email ? 'Пароль отправлен на Ваш email' : '');
               }

               if($message.length)
                  $message
                     .text(system_message)
                     .css('visibility', 'hidden')

               setTimeout( function()
               {
                  $message.css('visibility', 'hidden')
                  $obj.find('.cancel').click();
               }, 3000);
            }, 'json');
      }
   });

   return this;
}

jQuery.fn.remind = function(options)
{
   var $obj = this;

   options.url = options.url || '/interface/form/remind'

   layout.intfse.load(
   {
      url:options.url,
      verify:function(){return options.html && options.html.length;},
      next: function()
      {
         common.intrfc($obj, remind, options);
      },
      callback:function(data){return common.cache[options.url] = options.html = data;}
   });

   return $obj;
}})();

