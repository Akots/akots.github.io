function messg($cont)
{
   var me = this;

   this.init = function()
   {
      $cont = $cont || layout.current.find('.message_wrap');

      if(!$cont.length)
         $cont = layout.current
            .prepend('<span class="message_wrap">' +
                        '<span class="cor-top-lft"></span>' +
                        '<span class="cor-bot-lft"></span>' +
                        '<span class="cor-top-rgt"></span>' +
                        '<span class="cor-bot-rgt"></span>' +
                        '<span class="message"></span>' +
                     '</span>')
            .find('.message_wrap');
      else if(!$cont.is('.message_wrap'))
         $cont = $('<span class="message_wrap"><span class="cor-top-lft"></span><span class="cor-bot-lft"></span><span class="cor-top-rgt"></span><span class="cor-bot-rgt"></span><span class="message"></span></span>').appendTo($cont);

      return $cont;
   }

   this.send_data_end = function()
   {
      if($cont && $cont.length)
         $cont.find('.inputex_loading').remove();
   }
   this.send_data_begin = function()
   {
      me.send_data_end();

      me.init()
         .find('.message')
         .prepend('<div class="inputex_loading"><img src="/i/waits.gif" alt="" /></div>');
   }
   this.show = function(text) {
      return me.init().find('.message')
        .html(text)
        .show();
   }

   this.hide = function(end) {
      if($cont && $cont.length)
         $cont
            .animate(
            {
               opacity: 0
            },
            {
               complete:function()
               {
                  if($cont && $cont.length)
                     $cont.remove();

                  $cont = false;

                  if(end)  end();
               }
            }, 1000);
      else if(end)
         end();
   }

   this.action = function(undo, hide, messg)
   {
      me.send_data_end();

      me.show((messg && messg.length ? messg : 'Сохранено') + (undo ? ' <a class="undo ajax" href="javascript:void(0);">вернуть</a>, ': '') + ' <a href="javascript:void(0);" class="cancel ajax">убрать</a>')
      .parent()
      .find('.cancel')
      .click(
        function(){
          me.hide();
          if(hide) hide();

          clearTimeout(me.timer);

          return false;
        }
      )
      .parent()
      .find('.undo')
      .click(
        function(){
          undo();
          me.hide();
          return false;
        }
      );

      me.auto_hide(hide);
   }

   this.auto_hide = function(end)
   {
      me.timer = setTimeout(function()
      {
         me.hide(end);
      }, 5000);
   }

   return this;
}

var message = 
{
   alerts: {
      hello:                     'Добро пожаловать! Пароль для входа в систему отправлен вам по email',
      contact_success:           'Вы приняли приглашение стать другом',
      contact_fail:              'Извините, мы не смогли добавить вашего друга',
      contact_decline:           'Вы отклонили приглашение стать другом',
      contact_decline_fail:      'Извините, мы не смогли удалить приглашение',
      regen_sent:                'Новый пароль отправлен Вам на email',
      regen_fail:                'Неверная ссылка. Напишите по вдресу <a href="mailto:support@qwidgi.com">support@qwidgi.com</a>, если считаете что это наша проблема',
      reg:                       'Добро пожаловать в Qwidgi! Вы можете начать общение прямо сейчас, нажав кнопку "Отмена", но для полноценного пользования сайтом, пожалуйста, введите свой email и задайте пароль'
   },
   alertsInit: function(o)
   {

      var m =
         o && o.param ?
            o.param.match(/[\?\&]mess\=([^\&]*)/)
         :
            false;

      if (m && m.length && message.alerts[m[1]])
         (new messg(layout.current)).action(false, false, message.alerts[m[1]]);

   }
}
jQuery.fn.endType = function(fun)
{
   var old_val = null;
   var timer = null;

   $(this).keyup(function(e)
   {
      if(old_val != e.target.value)
      {
         clearTimeout(timer);
         timer = setTimeout(fun, 1000);
      }

      old_val = e.target.value;
   });

   return this;
};
