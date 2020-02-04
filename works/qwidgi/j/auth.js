(function (){

var auth_cache = [];
var $splash = false;

var init = function()
{
   function ind()
   {
      if(layout.current[0].id != 'auth_view')
         return layout.current.show().css('z-index', '1');

      return layout.before.show().css('z-index', '1');
   }

   if(ind().is('#dashboard_view,#faq_view'))
      $('#body').addClass('index-page');

   if($splash)
      $splash.show();
}

function auth($obj, options)
{
   this.init = init;

   this.clear = function()
   {
      $obj.hide();

      if($splash)
         $splash.hide();
   }

   var $dialog = false;

   if (options.html)
   {
      $obj
         .appendTo(document.body)
         .html(options.html)
         .find('.auth_form')
         .wrap('<div class="form-cont"></div>');

      if(!$splash)
         $splash = $('<div id="splash"></div>').appendTo(document.body);

      $dialog = $obj
         .find('.form-cont')
         .removeClass('form-cont')
         .popupHint({
            isDialog : true,
            header   : 'Приветствуем в Qwidgi'
         })
         .addClass('form-cont');
   }


   var $form = $obj.find('.auth_form');

   $obj.css({'z-index':'2000','background-color':'transparent'});

   var form_view = function(is_auth)
   {
      options.auth = is_auth = typeof(is_auth) == 'undefined' ?
         (
            options && typeof(options.auth) != 'undefined' ?
            options.auth : true
         ) : is_auth;

      if (is_auth)
      {
         $dialog.find('h3').text('Приветствуем в Qwidgi');
         $form.find('.submit_button')
            .val('Вход')
            .attr('id', 'button-login');
         $form.attr('action', '/u/login');
      }
      else
      {
         $dialog.find('h3').text('Регистрация');
         $form.find('.submit_button')
            .val('Зарегистрироваться')
            .attr('id', 'button-register');
         $form.attr('action', '/u/register');
      }
   }

   for(var n in auth_cache)
      $form.find('input[name=' + n + ']').val(auth_cache[n]);

   $form.find('.submit')
      //.append('&nbsp;<a class="cancel ajax" href="javascript:void(0)">Отмена</a>')
      .append('&nbsp;<input type="button" value="Отмена" class="cancel"/>')
      .find('.cancel')
      .click(layout.back);

   form_view();

   $obj.find('.remind-link').remind(
   {
     email:function()
     {
        return $('.email', $form).val();
     },
     snap:$form,
     show:function()
     {
        $form.hide();
        $dialog.find('h3').text('Восстановление пароля');
     },
     close:function()
     {
       form_view();
       $form.show();
     }
   });

   $form
   .validate(
   {
      errorElement: 'div',
      focusInvalid: false,
      focusCleanup: false,
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
           required: true,
           minlength: 5
        }
      },
      messages: {
        email: {
          required: 'Необходимо ввести e-mail',
          email: 'Неверный e-mail'
        },
        password: {
          required: 'Необходимо ввести пароль',
          minlength: 'Не менее 5 символов'
        }
      },
      submitHandler: function() {

         if( typeof($('.email', $form).get(0).exists) != 'undefined' && !$('.email', $form).get(0).exists)
            return false;

        var remember = $('.remember', $form).attr('checked') ? 'true' : 'false';

        submit_disable();

        $form.find('.submit').addClass('loading');

        $.post(
          $form.attr('action'),
          {
            email    : $('.email', $form).val(),
            password : $('.password', $form).val(),
            remember : remember,
            tz       : ((-1)*(new Date()).getTimezoneOffset()/60)
          },
          function(data)
          {

            common.auth(data.auth);
            var register = data.register,
                email = data.email ? data.email : '',
                msg = data.mg ? data.mg : '';

            if(
              common.is_proto() &&
              $('.email', $form).val() == 'user@mail.com' &&
              $('.password', $form).val() == '12345'
            )
            {
              common.auth(true);
              register = false;

            }
            else if( common.is_proto() && $('.email', $form).val() != 'user@mail.com' )
            {
              common.auth(false);
              register = true;
            }
            else if( common.is_proto() )
            {
              common.auth(false);
              register = false;
            }

            var toProfile = function()
             {
               if(!common.is_proto())
               {
                  location.reload(true);
                  return;
               }

               location = '#u/profile';

               $('#head #auth').hide();
               $('#head #userProfile').remove();

               if(!data.first_name && !data.last_name){
                  $title = 'Мой профиль';
               }

               $('#head #auth')
                  .after(
                     icon.init(
                        {
                           id:1234,
                           name:'userProfile',
                           title:$title,
                           ico:'/u/' + data.id + '/icon',
                           url:'u/' + data.id + '/profile',
                           cont: '/interface/u/profile',
                           fixed:true
                        }, 'drop')
                  ).
                  remove();
             }

            if(common.auth() || register)
               toProfile();
            else
            {
               $form.find('.submit').removeClass('loading');
               submit_enable();
            }

            if(!(common.auth() || register) && $('.email', $form).val() == data.email)
            {
              $form.find('.message')
                 .text('Неверный пароль.')
                 .css('visibility', 'visible');

              $form.find('.password').focus( function()
              {
                 $form.find('.message').css('visibility', 'hidden');
              });

            }
            else if(!(common.auth() || register) && $('.email', $form).val() != data.email)
            {
              $form.find('.message')
                .text('Неправильный e-mail пользователя или пароль.')
                .css('visibility', 'visible');

              $('.email', $form).focus( function()
              {
                $form.find('.message').css('visibility', 'hidden');
              });
            }
          }, 'json'
        );
      }
    });

   //Дисаблим кнопку Регистрация

   var $fields = $form.find('.input input');

   var submit_disable = function()
   {
      $form
         .find('input[@type=submit]')
         .attr('disabled', 'true')
         .addClass('disabled')
         .disabled = true;
   }

   var submit_enable = function()
   {
      $form
         .find('input[@type=submit]')
         .removeAttr('disabled')
         .removeClass('disabled')
         .disabled = false;
   }

   var fields_change = function(e)
   {
      if(e && e.target)
         e.target.changed = true;

      var valid = true;
      $fields.each(function(i, o)
      {
         valid = valid && (typeof(o.changed) != 'undefined' &&  o.changed) && $(o).valid();

         auth_cache[o.name] = o.value;
      })

      valid = valid && (typeof($('.email', $form).get(0).exists) == 'undefined' || $('.email', $form).get(0).exists);

      valid ? submit_enable() : submit_disable();
   };

   $fields
      .keyup(fields_change)
      .blur(fields_change)
      .focus(fields_change);

   fields_change();

   var old_email = null;

   var email_change = function()
   {
      var $mess = $('.email', $form).parent().find('.our_error');

      if( !$mess.length )
         $mess = $('.email', $form)
            .after('<div class="our_error error"></div>')
            .find('.mess')
            .hide();

      if( !$('.email', $form).valid() )
      {
         $mess.empty().hide();
         return;
      }

      if( old_email == $('.email', $form).val() )
         return;

      $.get(
         '/u/checkemail',
         {email : $('.email', $form).val()},
         function(data)
         {

            old_email = $('.email', $form).val();
            $('.email', $form).get(0).exists = data.sc;

            if( !data.sc)
            {
               $mess.html(data.mg).show();
               submit_disable();
            }
            else
            {
               $mess.empty();
               submit_enable();
            }

         },
         'json'
      );

      $.get(
         '/u/is_email',
         {email : $('.email', $form).val()},
         function(data)
         {

            data = common.is_proto() && $('.email', $form).val() == 'user@mail.com'  ? true : (common.is_proto() ? false : data);

            old_email = $('.email', $form).val();

            form_view(data);

            if( !data && options.auth)
               $mess.text('Такого e-mail нет, вы будете зарегистрированы.').show();

            if( data && !options.auth)
               $mess.text('Такой e-mail зарегистрирован.').show();

         },
         'json'
      );
   }

   $('.email', $form)
     .endType(email_change)
     .blur(email_change)
     .focus();

   return this;
}

jQuery.fn.auth = function(options)
{
   init();

   return common.intrfc(this, auth, options);
}})();
