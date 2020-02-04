(function(){
$.fn.addPerson = function(data, params)
{
   if (!this || this && !this.length || !data)
      return;

   params = params || {};

   //****Типы карточек человека params.type***********************
   // 1 - Карточка сотрудника
   // 2 - Карточка контакта человека
   // 3 - Результат поиска человека
   //*************************************************************

   var settings = $.extend({
      type        : 1, //Типы карточки человека
      delete_url  : params.delete_url || '/office/' + params.comp_id + '/employee/delete' //Урл удаления сотрудника
   }, params);

   settings.type = settings.type ? settings.type : 1;

   var init = function($container)
   {
      var with_edit = settings.edit;
//************************************************
//JSON Object
//	{
//		user_id : '2',
//		avatar_url : '/i/photo/90x90/2.jpg',
//		name: 'Анищенко Антон',
//		position: {'Менеджер'|['ЮгСткло, Менеджер', 'ЮгСткло, Менеджер']},
//		right_people_url: '/u/right_people/get',
//		user_page_url: '/u/profile',
//		comp_name: {'Gloru.Net'|['Gloru.Net', 'ЮгСткло']},
//    is_right_man: true,
//    fr_status:{0-7}
//    0 - найденный пользователь это и есть залогиненный пользователь
//    1 - найденный пользователь уже является другом залогиненного
//    2 - найденный пользователь уже приглашен залогиненным в контакты
//    3 - найденный пользователь приглашал залогиненного, но дружба не подтверждена
//    4 - найденный пользователь уже ранее отказывал в дружбе залогиненному
//    5 - залогиненный пользователь уже ранее отказывал в дружбе найденному
//    6 - найденный пользователь уже ранее удален залогиненным из "контактов".
//    7 - залогиненный пользоваьель уже ранее удален найденным из "контактов".
//	}
//***********************************************
      $(data).each(function(index, person_card){
         if (
            person_card.user_id && 
            person_card.avatar_url && 
            person_card.name && 
            person_card.right_people_url &&
            person_card.user_page_url
         )
         {
            var view_position = function(view_comp, companies, positions, maxPos)
            {
               var $res = $('<ul></ul>');

               positions = typeof(positions) != 'string' ? positions : [positions];
               companies = typeof(companies) != 'string' ? companies : [companies];
               var maxInStr = 25;

               $(positions).each(
                  function(i, o){

                     if(maxPos && i >= maxPos)
                        return;

                     var str = (view_comp && companies && companies[i] ? companies[i] + ', ' : '') + (o||'');

                     $res.append('<li>' + common.strict(str, maxInStr) + (maxPos && i+1 >= maxPos && positions.length >= i+1 && str.length < maxInStr ? '&hellip;' : '') + '</li>');
                  }
               );

               return positions && positions.length ? $res : false;
            }

            person_card.fr_status = Number(person_card.fr_status);
            if (!isNaN(person_card.fr_status))
               person_card.is_right_man = person_card.fr_status == 0 || 
                                          person_card.fr_status == 1 || 
                                          person_card.fr_status == 2;

            person_card.emp_id = person_card.emp_id ? person_card.emp_id : '';

            var is_accepted = person_card.is_accepted ? true : false ;
            var is_voited_access = (person_card.is_voited_access || settings.is_voited_access);
            var link = (person_card.user_page_url ? person_card.user_page_url.substr(1) : (settings.url ? settings.url(person_card) : ''))

            person_card.is_right_man = typeof person_card.is_right_man == 'boolean' ? person_card.is_right_man : false;

            var $person = $(
               '<ul class="person_card' + (!is_accepted && is_voited_access ? ' noaccepted' : '') + (settings.css ? settings.css(person_card) : '') + ' v' + person_card.user_id + '">' +
                  '<li class="person_img">' +
                     (!is_accepted && !person_card.is_voted && is_voited_access ?
                     '<span class="person-vote png-fix"><a class="approve" title="' + (params.isEmployees ? 'добавить в мои контакты' : 'добавить в коллеги') + '" href="javascript:void(0);"></a><a class="decline" title="' + (params.isEmployees ? 'убрать из контактов' : 'это НЕ мой коллега') + '" href="javascript:void(0);"></a></span>' : '') +
                     (link ? '<a class="to_profile" href="#' + link + '">' : '') +
                     '<span class="foto-corners-repeat"><span></span></span>' +
                     '<span class="foto-corners-top"><span><span></span></span></span>' +
                     '<span class="foto-corners-bot"><span><span></span></span></span>' +

                     (!is_accepted && person_card.is_voted && is_voited_access ?
                     '<span class="person-voted png-fix"></span>' : ''
                     ) +
                        '<img class="avatar" src="' + person_card.avatar_url + '" width="162" />' +
                     (link ? '</a>' : '') +
                     '<span class="icons">' +
                        '<ul class="icon">' +
                        (!person_card.is_right_man ?
                        '<li class="add_right_people"><input type="button" title="Добавить в контакты" /></li>' : '') +
                        '<li class="right_people"><input type="button" title="Контакты пользователя"></li>' +
                        (settings.type != 3 && person_card.fr_status !== 0 ?
                        '<li class="send_message"><a href="#im/people/' + person_card.user_id + '/' + encodeURIComponent(person_card.name) + '"  title="Послать сообщение" ></a></li>' : '') +
                        (with_edit && settings.type == 1 ?
                        '<li class="delete"><input type="button" title="Удалить из сотрудников" /></li>' : '') + 
                        (with_edit && settings.type == 2 ?
                        '<li class="delete"><input type="button" title="Удалить из контактов" /></li>' : '') +
                        '</ul>' +
                      '</span>' +
                  '</li>' +
                  '<li class="description"><ul class="vcard">' +
                  '<li class="name">' +
                  (link ? '<a href="#' + link + '">' : '') +
                   person_card.name +
                  (link ? '</a>' : '') +
                   '</li>' +
                  '<li class="position">' + 
                  '</li>' +
               '</ul></li>' +
               '</ul>'
            );
            //="' + person_card.right_people_url + '/' + person_card.user_id + '"

            var $pos = view_position(
                  settings.type != 1,
                  person_card.comp_name,
                  person_card.position,
                  settings.maxPos || 2
               );
            if($pos)
               $person.find('.position').append($pos);


            $person.hover(
               function () {
                  $(this).find('.icons').removeClass('hover').addClass('hover');
               },
               function () {
                  $(this).find('.icons').removeClass('hover');
               }
            );
            
            var param =
            {
               user_id  : person_card.user_id,
               comp_id  : settings.comp_id
            };

            if(settings.click)
               $person.find('.name a, .person_img a').click(settings.click);

            $person.find('.delete').click(function(){
               var $person = $(this).parents('.person_card');
               $.post(
                  settings.delete_url + '/' + person_card.user_id,
                  param,
                  function(data){
                     if (data && data.sc)
                     {
                        if (settings.onDelete)
                           settings.onDelete();

                        $person.hide();

                        message.action(function(){
                           $person.show();
                           if (settings.onUndo)
                              settings.onUndo();
                           $.post(
                              settings.delete_url + '/' + person_card.user_id,
                              $.extend({action:'undo'}, param),
                              function(){},
                              'json'
                           );
                        });

                        message.auto_hide();
                     }
                  },
                  'json'
               );
               return false;
            });

            $person.find('.person-vote .approve').click(function()
            {
               var $vote = $(this).parent();
               
               $vote.addClass('loading');

               $.post(
                  settings.accept_url || '/office/' + settings.comp_id + '/emp/approve',
                  {
                    emp_id    : person_card.emp_id,
                    user_id  : person_card.user_id,
                    approve   : true
                  },
                  function(data)
                  {
                     $vote.removeClass('loading');

                     if(data.sc)
                        $vote.remove();
                  },
                  'json'
              );
            })
            .parent()
            .find('.decline')
            .click(function(){
               var $vote = $(this).parent();

               $vote.addClass('loading');

               $.post(
               settings.accept_url || '/office/' + settings.comp_id + '/emp/approve',
               {
                 emp_id    : person_card.emp_id,
                 user_id  : person_card.user_id,
                 approve   : false
               },
               function(data)
               {
                 $vote.removeClass('loading');

                 if(data.sc)
                    $vote.remove();
               },
               'json'
             )
            });

            $person.find('.add_right_people').click(function(){
               $li = $(this).hide();
               $.post(
                  '/u/right_people/add',
                  {
                     user_id  : person_card.user_id
                  },
                  function(data){
                     if (data && data.sc)
                     {
                        $li.remove();
                        person_card.is_right_man = true;
                        person_card.fr_status = 2;
                     }else
                        $li.show();
                  },
                  'json'
               );
               return false;
            });

            $person.find('.right_people').click(function(){
               location.href = '#' + person_card.right_people_url.substr(1);
               return false;
            });
            $person.find('.send_message').attr('href', '#im/people/' + person_card.user_id + '/' + person_card.name);

            if($container.get(0).tagName == 'UL')
               $container
                  .append('<li class="item i' + index + '"></li>')
                  .find('.i' + index)
                  .append($person);
            else
               $container.append($person);
         }
      });

      if(settings.end)
         settings.end(data);

   }

   return common.init(this, init);
}})();
