(function(){

function userInfo($obj, options)
{
   if (!$obj.length)
      return this;

   options = options || {};

   var me = this;
   var $unit_city = null;
   var user_id = options.id;
   options.edit = typeof(options.edit) == 'boolean' ? options.edit : null;
   options.isTitle = typeof(options.isTitle) == 'boolean' ? options.isTitle : false;

   this.clear = function()
   {
      if(typeof(title.$cont) == 'object' && title.$cont.length)
         title.$cont.find('.toggle_edit.user_profile').remove();
   }

   this.init = function()
   {
      if(options.edit && options.isTitle)
         title.set('Мой профиль');
      else if(options.data && options.isTitle)
         title.set((options.data.first_name ? options.data.first_name + ' ' : '') + (options.data.patronymic ? options.data.patronymic + ' ' : '') + (options.data.second_name ? options.data.second_name : ''));
   }

   // ************************************************************
   //       Подгружаем основную информацию
   // ************************************************************
   if ( $('#info', $obj).length)
      $.post(
        '/u/info',
         {
            user_id : options.id
         },
         function(data)
         {
            options.edit = typeof(options.edit) == 'boolean' ? options.edit : data.edit;
            options.data = data;

            me.init();

            if (data)
            {
               if (data.avatar_url && data.avatar_url.length)
               {
                  $('.avatar img', $obj)
                     .after('<img class="photo_change" src="' + data.avatar_url + '" />')
                     .remove();

                  $('.avatar img', $obj)
                     .load(function()
                     {
                        $('.common_info', $obj).width($(this).width());
                     })
                     .data('rel', data.avatar_crop || {})
                     .attr('alt', (data.first_name || '') + (data.second_name ? ' ' + data.second_name : '' ));
               }
               else
               {
                  $('.avatar', $obj).removeClass('no-avatar').addClass('no-avatar');
                  $('.avatar img', $obj).remove();
               }

               /*********************************************
                              *
                              *   Отправка сообщения пользователю в профайле
                              *
                              *********************************************/

               if(!data.edit)
               {
                  $('.quick_menu .edit-photo').parent().remove();

                  $('.quick_menu .send_user_message').attr( 'href', '#im/people/' + data.id + '/' + data.first_name + (data.second_name ? ' ' + data.second_name : ''));

                  if(!data.isYourContact)
                     $('.quick_menu .add_right_people').click(function(){
                        $li = $(this).parent().hide();

                        $.post(
                          '/u/' + data.id + '/right_people/add',
                          {},
                          function(data){
                            if (data && data.sc)
                              $li.remove();
                           else
                              $li.show();
                          },
                          'json'
                        );
                     });
                  else
                     $('.quick_menu .add_right_people').parent().remove();
               }
               else
               {
                  $('.quick_menu .send_user_message').parent().remove();
                  $('.quick_menu .add_right_people').parent().remove();
               }

               $obj.find('.tel').addClass('empty');

               $(data.tel).each(function(i, o)
               {
                  if($.trim(this.val).length)
                     $obj
                        .find('.tel' + (this.type == 1 ? '.mob' : (this.type != 2 ? '.work':'.home')))
                        .removeClass('empty')
                        .find('.value')
                        .text(o.val);
               });

               if (data.first_name)
                  $('.first_name_cont', $obj).text(data.first_name);
               else
                  $('.first_name_cont', $obj).addClass('empty');

               if (data.patronymic)
                  $('.second_name_cont', $obj).text(data.patronymic);
               else
                  $('.second_name_cont', $obj).addClass('empty');

               if (data.second_name)
                  $('.last_name_cont', $obj).text(data.second_name);
               else
                  $('.last_name_cont', $obj).addClass('empty');

               if (data.sex)
                  $('.sex .value', $obj).text(data.sex);
               else
                  $('.sex .value', $obj).parent().addClass('empty');

               if (data.birthday)
                  $('.birthday .value', $obj).text(data.birthday);
               else
                  $('.birthday .value', $obj).parent().addClass('empty');

               if (data.city)
                  $('.city .value', $obj).text(data.city);
               else
                  $('.city .value', $obj).parent().addClass('empty');

               if (data.polit)
                  $('.polit .value', $obj).text(data.polit);
               else
                  $('.polit .value', $obj).parent().addClass('empty');

               if (data.trustin)
                  $('.trustin .value', $obj).text(data.trustin);
               else
                  $('.trustin .value', $obj).parent().addClass('empty');

               if (data.email)
                  $('.email .value', $obj).text(data.email);
               else
                  $('.email .value', $obj).parent().addClass('empty');

               if (data.icq)
                  $('.icq .value', $obj).text(data.icq);
               else
                  $('.icq .value', $obj).parent().addClass('empty');

               if (data.skype)
                  $('.skype .value', $obj).text(data.skype);
               else
                  $('.skype .value', $obj).parent().addClass('empty');

               if (data.address)
                  $('.address .value', $obj).text(data.address);
               else
                  $('.address .value', $obj).parent().addClass('empty');

               if (!data.confirm && options.edit)
                  $('.email .value', $obj).after('<div id="resend_info"><span class="date">' + data.last_confirm_send + '</span> Вам было отправлено письмо, содержащее ссылку для подтверждения Вашего e-mail, <a href="javascript:void(0)">повторить</a>?</div>')
                  .next().find('a')
                  .click(function()
                  {
                     //message.send_data_begin();
                     var $l = $(this).parent().addClass('loading');

                     $.post(
                        '/u/resend',
                        {},
                        function(data)
                        {
                           //message.hide();
                           $l.removeClass('loading')
                           .find('.date')
                           .text('Сейчас');
                        },
                        'json'
                     );
                  });

               if (data.about)
                  $('.about_cont', $obj).empty().html(common.xtagging(common.htmlspecialchars(data.about)));

               go(data);

            }
         },
         'json'
      );

   function search(title, name)
   {
      return common.link(title, name, 'people');
   }

   function go(data)
   {
      common.log('Init profile#' + options.id);

      // ************************************************************
      //       Инпуты в профайле
      // ************************************************************

      $obj.find('.tab-contacts').attr('href', '#u/' + data.id + '/contact');
      $obj.find('.tab-foto').attr('href', '#u/' + data.id + '/album');
      $obj.find('.tab-office').attr('href', '#office/' + data.office_id + '/profile');

      if (options.edit)
      {
         $obj.find('.quick_menu .send_user_message').parent().hide();
         $obj.find('.quick_menu .add_right_people').parent().hide();
         $obj.find('.edit-photo').parent().show();

         $obj.find('.avatar img').imgchanger();

         $obj.find('.imgchanger .edit').hide();

         var $toggle_edit = $obj.find('.edit-photo', $obj)
         .click(function()
         {
            var isEditable = !$('.email .value .val', $obj).length;

            $('.info-item.empty', $obj).toggle();
            $('.change-password', $obj).toggle();
            $('.row .change-password', $obj).toggle();

            if ($('#add-person').length)
               $('#add-person').remove();

            $('#work .hidebar_content,#educ', $obj).each(function(i, o)
            {
               if (o && o.intrfc && o.intrfc.toggleMode)
                  o.intrfc.toggleMode();
            });

            if(!isEditable)
            {
               $obj.removeClass('edit');
               $toggle_edit.removeClass('search').attr('title', 'Редактировать профайл');

               $(
                  '.polit .value,' +
                  '.trustin .value,' +
                  '.birthday .value,' +
                  '.tel .value,' +
                  '.email .value,' +
                  '.icq .value,' +
                  '.skype .value,' +
                  '.address .value,' +
                  '#info .city .value,' +
                  '.name .value,' +
                  '#about .about_cont.value',
                  $obj
               ).each(function(i, o)
               {
                  o.inputEx.dispose();
               });

               $('.sex .value,.fstatus .value', $obj).each(function(i, o)
               {
                  o.selectEx.dispose();
               });

               $obj.find('.imgchanger .edit').hide();

               if(options.reviewEdEm)
                  options.reviewEdEm($obj);
            }
            else
            {
               $obj.addClass('edit');

               $toggle_edit
                 .attr('title', 'Просмотр')
                 .addClass('search');

               $obj.find('#educ').show();
               $obj.find('#work').show();

               if(!$('.name .first_name .value', $obj).length)
                  $('.name .value', $obj).wrap_cont();

               var input_option = {search:search}

               $(
                  '.polit .value,' +
                  '.trustin .value,' +
                  '.birthday .value,' +
                  '.email .value,' +
                  '.icq .value,' +
                  '.skype .value,' +
                  '.address .value,' +
                  '#info .city .value',
                  $obj
               ).inputEx(input_option);

               $('.sex .value', $obj)
                  .selectEx($.extend({empty:'не указан',list:'/u/sexs', url:'/u/edit'}, input_option));
               $('.fstatus .value', $obj)
                  .selectEx($.extend({empty:'не указан',list:'/u/family_statuses', url:'/u/edit'}, input_option));

               $('#info .city .value', $obj).city();

               $('.name .first_name_cont.value', $obj)
                  .inputEx($.extend({empty:'Имя'}, input_option));
               $('.name .second_name_cont.value', $obj)
                  .inputEx($.extend({empty:'Отчество'}, input_option));
               $('.name .last_name_cont.value', $obj)
                  .inputEx($.extend({empty:'Фамилия'}, input_option));
               $('.tel.mob .value', $obj).inputEx($.extend({empty:'Телефон',param:{type:1}}, input_option));
               $('.tel.home .value', $obj).inputEx($.extend({empty:'Телефон',param:{type:2}}, input_option));
               $('.tel.work .value', $obj).inputEx($.extend({empty:'Телефон',param:{type:3}}, input_option));
               $('#birthday', $obj)
                  .datepickerEx();

               $('#about .about_cont.value', $obj).inputEx($.extend({empty:''}, input_option));

               $toggle_edit.addClass('search');

               $obj.find('.imgchanger .edit').show();
            }
         });
      }

      var $menu_wrap = options.hasTopTabs && !options.edit ?
         title.$cont :
         (!options.edit ? $obj.find('.profile-header'): false);

      if($menu_wrap && $menu_wrap.length)
         $menu_wrap.userMenu(
         {
            hasContacts : options.data.hasContacts,
            hasAlbums   : options.data.hasAlbums,
            office_id   : options.data.office_id,
            url:
            {
               contact : '#u/' + options.id + '/contact',
               album   : '#u/' + options.id + '/album',
               office  : '#u/' + data.user_id + '/office/' + options.data.office_id + '/profile'
            }
         });

      $('#info .value', $obj).each(function(i, o)
      {
         if(!$(o).is('.about_cont'))
            $(o).html(search($(o).text(), $(o).parent()[0].className.split(' ')[0]));
      });


      $obj.find('form').validate(
      {
         errorElement: 'div',
         rules: {
            email: { required: true, email: true },
            birthday: { required: false, dateDE: true },
            start_work: { required: false, dateDE: true },
            end_work: { required: false, dateDE: true }
         },
         messages: {
            email: {
               required: 'Введите Ваш e-mail адрес',
               email: 'Введите правильный e-mail'
            },
            birthday: {
               required: 'Введите дату Вашего рождения',
               dateDE: 'Введите корректную дату'
            },
            start_work: {
               required: 'Введите дату начала работы в компании',
               dateDE: 'Введите корректную дату начала работы в компании'
            },
            end_work: {
               required: 'Введите дату окончания работы в компании',
               dateDE: 'Введите корректную дату окончания работы в компании'
            }
         }
      });

      // ************************************************************
      //      Форма изменения пароля в профайле
      // ************************************************************

      var $change_password = $('#change-password');

      $('#change-password').length
      {
      $change_password = $change_password
         .attr('id','')
         .removeClass('popupwindow')
         .popupHint({
            isDialog : true,
            header   : 'Изменить пароль'
         })
         .attr('id','change-password')
         .addClass('popupwindow');
      }

      if (options.edit && $('#change-password').length)
      {
         $('.submit', $change_password).append('&nbsp;<input class="cancel" type="button" value="Отмена" />');

         $('a.change-password').click(function()
         {
            var offset = $('.change-password').offset();

            $change_password.css(
            {
               top: offset.top - 210,
               left: offset.left + 20
            });

            $('table', $change_password).show();
            $('.message', $change_password).hide();

            $('#old_password', $change_password).val('');
            $('#new_password', $change_password).val('');

            $change_password.animate({ opacity: 'toggle' }, 250);
         });

         $('.cancel').click( function()
         {
            $change_password.animate({ opacity: 'toggle' }, 250);
         });

         $('#form-change-password').validate(
         {
            errorElement: 'div',
            rules: {
               old_password: { required: true, minlength: 5 },
               new_password: { required: true, minlength: 5 }
            },
            messages: {
               old_password: {
                  required: 'Введите старый пароль'
               },
               new_password: {
                  required: 'Введите новый пароль'
               }
            },
            submitHandler: function() {

               var $change_password =  $('#change-password');

               $.post('/u/edit',
                  {
                     old_password : $('#old_password').val(),
                     new_password : $('#new_password').val(),
                     js : true
                  },
                  function(data)
                  {

                     if(data.sc)
                     {
                        $('table', $change_password).hide();
                        $change_password.hide();

                        var $message = 
                           $('<div>' +
                                '<p class="fsz-normal">' +
                                   data.ms +
                                '</p>' +
                                '<input class="cancel" type="button" value="Закрыть" />' +
                             '</div>')
                             .popupHint({
                                isDialog : true
                             })
                             .addClass('profile-message');
                           
                        $message
                           .prependTo('#profile')
                           .hide()
                           .animate({ opacity: 'show' }, 250);

                        var message_hide = function()
                        {
                           $message.animate({ opacity: 'hide' }, 250);
                        }
                        
                        setTimeout( message_hide, 5000);
                        
                        $message.find('.cancel').click( function()
                        {
                           $message.animate({ opacity: 'toggle' }, 250);
                        });
                        
                     } else {
                        //
                     }
                  }, 'json');
            }
         });
      }

      if(options.end)
         options.end(options.data);
   }

   return this;
}

jQuery.fn.userInfo = function(options)
{
   return common.intrfc(this, userInfo, options);
}
})();
