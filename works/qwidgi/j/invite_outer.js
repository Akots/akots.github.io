(function(){

jQuery.fn.inviteOuter = function(options)
{
   var $obj = this;
   var $auth = $obj.find('form.auth');
   var $friends = $obj.find('form.friends');
   var $report = $obj.find('div.report');
   var friendsList = [];
   var curFriend = -1;
   var errCount = 0;

   $obj.find('.outer-title').html(options.title);

   $auth.validate(
   {
      errorElement:     'div',
      focusInvalid:     false,
      focusCleanup:     false,
      rules: {
         email: {
            required:   true,
            email:      true
         },
         pass: {
            required:   true,
            minlength:  3
         }
      },
      messages: {
         email: {
            required:   'Необходимо ввести e-mail',
            email:      'Неверный e-mail'
         },
         pass: {
            required:   'Необходимо ввести пароль',
            minlength:  'Не менее 3 символов'
         }
      },
      submitHandler: function()
      {
         submitDisable($auth);
         $auth.addClass('bg-loading');

         $.post(
            '/invite/outer/list',
            {
               typeID:  options.typeID,
               email:   $('#email', $auth).val(),
               pass:    $('#pass',  $auth).val()
            },
            function(data)
            {
               $auth.removeClass('bg-loading');
               submitEnable($auth);

               if (data && data.sc)
               {
                  var i, r = data.list, $f = $friends.find('.list');
                  friendsList = data.list;

                  for (i in r)
                  {
                     $f.append(
                        '<label for="f' + r[i].id + '">' +
                           (r[i].innerID ? '<acronym title="Будет приглашен в друзья" class="status">уже в Qwidgi</acronym>' : '') +
                           '<input type="checkbox" id="f' + r[i].id + '" name="f' + r[i].id + '" checked="checked" />' +
                           r[i].firstName + ' ' + r[i].lastName +
                        '</label>'
                     );

                     $friends
                        .find('input#f' + r[i].id)
                        .click(friendsChange);
                  }

                  friendsChange();

                  $friends.find('.template').html(data.tpl.replace(/\r\n|\n/g, '<br />'));

                  $auth.hide();
                  $friends.show();
               }
               else
               {
                  $('.result', $auth)
                     .html(data.mg || '')
                     .show();
               }
            },
            'json'
         );

         return false;
      }
   });

   var submitDisable = function(o)
   {
      o
         .find('input[@type=submit]')
         .attr('disabled', 'true')
         .addClass('diasabled')
         .disabled = true;
   };

   var submitEnable = function(o)
   {
      o
         .find('input[@type=submit]')
         .removeAttr('disabled')
         .removeClass('diasabled')
         .disabled = false;
   };

   var authChange = function(e)
   {
      $auth.valid() ? submitEnable($auth) : submitDisable($auth);
   };

   $auth.find('label').each(function(i, o)
   {
      $('#' + $(o).attr('for'))
         .keyup(authChange)
         .blur(authChange)
         .focus(authChange);
   });

   authChange();

   $('#email', $auth).focus();

   $friends.submit(function()
   {
      $friends.hide();
      $report.show();

      sendInvite();

      return false;
   });

   var friendsChange = function()
   {
      var i, m = false;

      for (i in friendsList)
         if ($friends.find('input#f' + friendsList[i].id)[0].checked)
         {
            m = true;
            break;
         }

      m ? submitEnable($friends) : submitDisable($friends);
   };

   var sendInvite = function()
   {
      var r = friendsList, $f = $report.find('.list');

      ++curFriend;
      for (; curFriend < r.length && !$friends.find('input#f' + r[curFriend].id)[0].checked; curFriend++);

      if (curFriend >= r.length)
      {
            errCount
         ?
            $report
               .find('.result')
               .html(
                  '<p>Приглашения отправлены с ошибками, приносим свои извинения.</p>' +
                  '<p>Администрация сервера уже поставлена в известность.</p>' +
                  '<p>Пожалуйста, попробуйте пригласить друзей, используя форму отправки сообщений ' +
                  'на сайте <a href="' + options.href + '" target="_blank">' + options.name + '</a></p>'
               )
               .show()
         :
            $report
               .find('.result')
               .addClass('status')
               .html('Приглашения успешно отправлены')
               .show();

         return;
      }

      $f.append(
         '<li class="bg-loading">' +
         r[curFriend].firstName + ' ' + r[curFriend].lastName +
         '</li>'
      );

      if (r[curFriend].innerID)
      {

         $.post(
            '/u/right_people/add',
            {
               user_id: r[curFriend].innerID
            },
            function(data)
            {
                  data && data.sc
               ?
                  setFriendStatus('уже в Qwidgi, приглашен в друзья')
               :
                  setFriendStatus('не удалось добавить в друзья', true);

               sendInvite();
            },
            'json'
         );

      }
      else
      {

         $.post(
            '/invite/outer/create',
            {
               typeID:     options.typeID,
               id:         r[curFriend].id,
               firstName:  r[curFriend].firstName,
               lastName:   r[curFriend].lastName
            },
            function(data)
            {
                  data && data.sc
               ?
                  setFriendStatus('ok')
               :
                  setFriendStatus(data.mg || 'не удалось отправить приглашение', true);

               sendInvite();
            },
            'json'
         );

      }
   };

   var setFriendStatus = function(s, e)
   {
      $report
         .find('.bg-loading')
         .removeClass('bg-loading')
         .prepend('<span class="status' + (e ? ' error' : '') + '">' + s + '</span>');
      if (e)
         ++errCount;
   };

   return $obj;
}
})();
