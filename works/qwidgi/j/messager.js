(function(){
var Messager = 
{
   flashChatSpeed : 5000,
   send:function(name, id)
   {
      return Messager.add_tab_unit(this.to_user, {name:name, id:id, new_count:0}, true);
   },
   current:false,
   timer:null,
   stop:function()
   {
      clearTimeout(Messager.timer);
   },
   office:[],
   people:[],
   $cont:false,
   tab_data: function(nm, d, p, url, pic)
   {
     this.name = 'office';
     this.id = null;
     this.filter = 'today';
     this.init = false;
     this.max_mes_id = null;
     this.url = '';
     this.pic = '';

     this.name = nm?nm:this.name;
     this.id = d ? d : this.id;
     this.filter = p ? p : this.filter; 
     this.url = url ? url : this.url;
     this.pic = pic ? pic : this.pic;
   },
   scrollTop:function(h)
   {
      if( Messager.current.name != Messager.news.name)
         Messager.$cont.find('.pages')[0].scrollTop = h || Messager.$cont.find('#' + Messager.current.name + ' .cont').height();
   },
   action:function(options)
   {
      common.log('RE-Инициализируем Messanger');

      Messager.current =
      (
         options.o == Messager.in_office.name ?
         Messager.in_office :
         (
            options.o == Messager.to_user.name ?
            Messager.to_user :
            Messager.news
         )
      );

      options.o = Messager.current.name;

      options.title = decodeURIComponent(options.title) || '';

      Messager.set(options);

      function end()
      {
         common.log('init ' + options.o)


         Messager.$cont.find('#lftcol-groups .active,#lftcol-groups .ui-tabs-selected').removeClass('active').removeClass('ui-tabs-selected');
         Messager.$cont.find('#lftcol-groups .' + options.o + '>a').addClass('ui-tabs-selected');
         Messager.$cont.find('#lftcol-groups .' + options.o + ' .' + options.o.substr(0, 1) + options.id).addClass('active');

         Messager.$cont.find('.lftcol-groups-items').hide();
         Messager.$cont.find('.lftcol-groups-items.' + options.o).show();

         Messager.$cont.find('.cont,.filter').hide();
         var $cont = Messager.$cont.find('#' + Messager.current.name + ' .cont', '#' + Messager.current.name + ' .filter').show();

         if(!Messager.$cont.find('#lftcol-groups .lftcol-groups-items.' + options.o + ' .' + options.o.substr(0, 1) + options.id + '.active').length)
         {
            if(options.id && options.id.length)
               return Messager.add_tab_unit(Messager.current = Messager.to_user, {name:options.title, id:options.id, new_count:0}, true);

            var $first = Messager.$cont.find('#lftcol-groups .lftcol-groups-items.' + options.o + ' a:first');

            if($first.length)
            {
               $first.addClass('active').click();
               return;
            }
         }

         $cont.find('>ul').empty();

         Messager.$cont.find('input[name=uid]').val(options.id);

         var $user = Messager.$cont.find('.user_cont');

         if($user.length && $user[0].inputEx)
            $user[0].inputEx.setTitle(decodeURIComponent(options.title));

         Messager.refresh(
            Messager.current,
            function()
            {
               setTimeout(Messager.changes, 5000);

               Messager.scrollTop()

               Messager.$cont.find('textarea').focus();
            }
         );
      }

      if(options.o == Messager.news.name || !options.o.length)
      {
         Messager.$cont.find('.messages-area')
            .removeClass('with-subitems messageadd-allowed');

         Messager.$cont.find('form')
            .parent()
            .addClass('hide')
            .children()
            .removeClass('full without_text without_to');

         Messager.$cont.find('#news')
            .addClass('full')
            .siblings()
            .removeClass('full without_text without_to');
      }
      if(options.o == Messager.in_office.name)
      {
         Messager.$cont.find('.messages-area')
            .removeClass('with-subitems messageadd-allowed')
            .addClass('with-subitems messageadd-allowed');

         Messager.$cont.find('form')
            .parent()
            .removeClass('hide without_to');

         Messager.$cont.find('#' + Messager.current.name)
            .siblings()
            .removeClass('full without_text without_to');

         Messager.in_office.id = options.id;
      }
      if(options.o == Messager.to_user.name)
      {
         Messager.$cont.find('.messages-area')
            .removeClass('with-subitems messageadd-allowed')
            .addClass('with-subitems messageadd-allowed');

         Messager.$cont.find('form')
            .parent()
            .removeClass('hide')
            .children()
            .removeClass('without_text without_to');

         Messager.$cont.find('#' + Messager.current.name)
            .addClass('without_text')
            .siblings()
            .removeClass('full without_text without_to');

         Messager.to_user.id = options.id;
      }

      if(Messager.current.name == 'news')
      {
         end();

         return Messager.$cont;
      }


      // создаем табы, общения
      if(!Messager.$cont.find('#lftcol-groups .' + Messager.current.name + ' .lftcol-groups-items li').length)
         Messager.add_tab(
            Messager.current,
            end
         );
      else
         end();

      return Messager.$cont;
   },
   init:function ($obj, options)
   {
      if(!$obj.length)
         return;

      common.log('Инициализируем Messanger');

      Messager.$cont = $obj;

      this.set = function(o)
      {
         options = o;
      }

      $obj.append(
         '<div id="lftcol-groups"><ul class="menu">' + 
           '<li class="title office"><a href="#im/office">Мои Офисы</a></li>' +
           '<li class="title people"><a href="#im/people">Контакты</a></li>' +
           '<li class="title news"><a href="#im/news">Уведомления</a></li>' +
         '</ul></div>' +
         '<div class="messages-area">' +
            '<div class="pages">' +
               '<div id="news"><div class="cont"><ul></ul></div></div>' +
               '<div id="office"><div class="cont"><ul></ul></div></div>' +
               '<div id="people"><div class="cont"><ul></ul></div></div>' +
            '</div>' + 
            '<div class="col-footer">' +
               '<form action="" method="post" autocomplete="off">' +
               '<h3 class="to"><span class="float_left">Кому:</span> <span class="user"><span class="user_cont"></span></span></h3>' +
               '<input type="hidden" name="uid" />' +
               '<table class="both">' +
                  '<tr>' +
                  '<td class="lft-text textbox"><textarea class="text" maxlength="2048" name="mess"></textarea></td>' +
                  '<td class="rgt-submit"><input class="submit" name="go" type="submit" value="Отправить" /></td>' +
                   '</tr>' +
               '</table>' +
               '</form>' +
            '</div>' +
         '</div>'
      );

      var $uid = $obj.find('input[name=uid]');

      var $uname = $obj.find('.user_cont')
         .inputEx({empty:'Укажите получателя :)',auto_save:false})
         .find('input')
         .setup_autocomplete(
            '/u/search/quick',
            {
               minChars:2,
               auto_save:false,
               formatItem: function (row, i, num)
               {
                  return '<img src="' + row[2] + '" alt="' + row[0] + '">' + row[0];
               }
            },
            function(event, data, formatted)
            {
               var $val = $(this).parent().find('.val');

               $val.text($(this).val());

               if(data == 'No match!' || !data.length)
               {
                  $uid.val('');
               }
               else
               {
                  $uid.val(data[1]);
                  Messager.add_tab_unit(Messager.current, {name:data[0], id:data[1], new_count:0}, true);
                  //Messager.select();
               }
            }
         );

      Messager.append_news = function($cont, o)
      {
         $cont.addEvent(o, {is_news : true});

         return o.className;
      }

      Messager.append_mess = function(messages, $cont)
      {
         var max_mes_id = 0;
         var count = 0;
         var new_countages = []
         var add_str = '';
         var mine = '';

         $(messages).each(function(i, o)
         {
             if( !document.getElementById('m' + o.id) )
             {
                add_str += o.from_id + ',';
                if(ID == o.from_id) mine = 'mine';
                else mine = '';

                $cont.append(
                  '<li id="m' + o.id + '" class="mes-item item ' + mine + '" ' + (o.from_id ? 'from_id="' + o.from_id + '"' : '') + '">' +
                   '<ul>' +
                    '<li class="from">' +
                        '<span class="mess-item-top"></span><span class="mess-item-bot"></span>' +
                           '<span class="mess-item-top-lft"></span><span class="mess-item-top-rgt"></span>' +
                           '<span class="mess-item-bot-lft"></span><span class="mess-item-bot-rgt"></span>' +
                           '<span class="mess-item-lft"></span><span class="mess-item-rgt"></span>' +
                           '<span class="avatar">' +
                            '<span class="avatar-corners-top"></span>' +
                              '<img src="' + o.avatar_url + '"/>' +
                            '<span class="avatar-corners-bot"></span>' +
                         '</span>' +
                          common.htmlspecialchars(o.from) +
                    '<em class="time">' + o.time + '</em></li>' +
                    '<li class="text">' + common.spaceWord(o.text) + '</li>' +
                   '</ul>'+
                  '</li>'
                );

                new_countages[new_countages.length] = o;

                count++;
             }

             if(max_mes_id < Number(o.id))
                max_mes_id = Number(o.id);
         });

         return {max_id:max_mes_id,count:count,new_mess:new_countages};
      }

      Messager.refresh = function(inf, end)
      {
            inf.init = true;

            $.post(
                '/u/mess/' + inf.name,
                {
                   id: common.valOrEmpty(inf ? inf.id : ''),
                   filter: common.valOrEmpty(inf ? inf.filter : '')
                },
                function(data)
                {
                   var $cont = $obj.find('#' + inf.name + ' .cont>ul');

                   if(inf.name == Messager.news.name && data.length)
                     $(data).each(function(i, o)
                     {
                        Messager.append_news($cont, o);
                     });
                   else if(data.length)
                   {
                      $('li', $cont).remove();

                      var i = Messager.append_mess(data, $cont);

                      inf.max_mes_id = i.max_id;

                      $(i.new_mess).each(
                         function(i, e)
                         {

                            if(!Messager[inf.name][inf.id])
                               Messager[inf.name][inf.id] = [];

                            Messager[inf.name][inf.id][Messager[inf.name].length] = e;
                         }
                      );

                      $obj.find('.' + inf.name.substr(0, 1) + inf.id + ' .new_count').empty();
                   }

                  if(end)  end();
                },
                inf.name != 'news' ? 'json' : ''
            );
      }

      Messager.news = new Messager.tab_data
      (
         'news',
         null,
         common.get_storage('news.filter')
      );
      Messager.in_office = new Messager.tab_data
      (
         'office',
         null,
         common.get_storage('in_office.filter'),
         '/u/mess/offices',
         '/office/logo/'
      );
      Messager.to_user = new Messager.tab_data
      (
         'people',
         null,
         common.get_storage('to_user.filter'),
         '/u/mess/talks',
         ''
      );

      var $menu = $obj.find('.menu');

      $obj.find('textarea').keyup(function(e){
        if (e.keyCode == 13 && $.trim(this.value).length)
          $('form', $obj).submit();
      });

      Messager.add_tab_unit = function(inf, o, selected)
      {
         if(
            selected ||
            (
               (!options.id || !Number(options.id)) &&
               (inf.name == options.o || !options.o.length)
            )
         )
         {
            options.o = inf.name;
            inf.id = options.id = o.id;
            options.title = o.name;
         }

         var $list = $menu.find('.' + inf.name + '.list');
         var $unit = $list.find('.' + inf.name.substr(0,1) + o.id);

         function name(name)
         {
            return $.trim(name).length ? name : 'Безымянный';
         }

         function select()
         {
            options.o = inf.name;
            inf.id = options.id = o.id;
            options.title = o.name;

            location.href = $unit.attr('href');
            $unit.parent().parent().find('.active').removeClass('active');
            $unit.addClass('active');
            $uname.parent()[0].inputEx.setTitle(name(o.name));

            Messager.action($.extend(options, {id:o.id,title:o.name}));

            return false;
         }

         if($unit.length && selected)
            return $unit.click();

         $unit = $list
            .append(
               '<li><a href="#im/' + encodeURIComponent(inf.name) + '/' + o.id + '/' + encodeURIComponent(o.name) + '" class="' + inf.name.substr(0,1) + o.id + '">' +
                  (o.photo_url ? '<img src="' + o.photo_url + '" />' : '') +
                  common.htmlspecialchars(name(o.name)) +
                  '<span class="new_count">' +
                     (o.new_count > 0 ? + o.new_count : '') +
                  '</span>' +
               '</a></li>'
            ).find('.' + inf.name.substr(0,1) + o.id)
            .click(select);

         if($unit.length && selected)
            $unit.click();

         return $unit;
      }

      Messager.add_tab = function(inf, end)
      {
         $.post(
            inf.url,
            {},
            function(data)
            {
               var $list = $menu.find('.' + inf.name + ' .list');
               
               if(!$list.length)
                  $list = $menu
                     .find('.' + inf.name)
                     .append('<ul class="lftcol-groups-items ' + inf.name + ' list"></ul>')
                     .find('.' + inf.name + '.list');

               $(data).each(
                  function(i, o)
                  {
                     Messager.add_tab_unit(inf, o);
                  }
               );

               Messager[inf.name] = data;

               if(end)  end();
            },
            'json'
         );
      }

      // запускаем обновлятор
      Messager.changes = function()
      {
         $.post(
            '/u/mess/changes',
            {
               office_init: common.valOrEmpty(Messager.in_office.init),
               office_id: common.valOrEmpty(Messager.in_office.id),
               office_filter: common.valOrEmpty(Messager.in_office.filter),
               office_max_mes_id: common.valOrEmpty(Messager.in_office.max_mes_id),
               user_init: common.valOrEmpty(Messager.to_user.init),
               user_id: common.valOrEmpty(Messager.to_user.id),
               user_filter: common.valOrEmpty(Messager.to_user.filter),
               user_max_mes_id: common.valOrEmpty(Messager.to_user.max_mes_id)
            },
            function(change)
            {
               if (!change) return;

               if(Messager.to_user.init && change.people.length)
                  Messager.append_mess(change.people, $obj.find('#' + Messager.to_user.name + ' .cont>ul'));

               if(Messager.in_office.init && change.office.length)
                  Messager.append_mess(change.office, $obj.find('#' + Messager.in_office.name + ' .cont>ul', true));

               if(change.news && change.news.length)
               {
                  var $news = $obj.find('#news .cont ul');
                  var last_item = '';
                  $(change.news).each(function(i, o)
                  {
                     if(!$news.find('.' + o.className).length)
                        last_item = Messager.append_news($news, o);
                  });
               }
               Messager.scrollTop();

               Messager.timer = setTimeout(Messager.changes, common.is_proto() ? 5000 : 15000);
            },
            'json'
         );
      }

      $('form', $obj).submit(function()
      {
         $obj.find('form input, form textarea')
            .attr('disabled', 'true')
            .addClass('diasabled')
            .disabled = true;

         $obj.find('form').addClass('send_message');

         $.post(
            '/u/mess/add',
            {
               text:$obj.find('textarea').val(),
               name:Messager.current.name,
               to:Number($uid.val()) > 0 ? Number($uid.val()) : Messager.current.id
            },
            function(data)
            {
               $obj.find('form input, form textarea')
                  .removeAttr('disabled')
                  .removeClass('diasabled')
                  .disabled = false;

               $obj.find('form').removeClass('send_message');

               if(common.is_proto())
               {
                  data.text = $obj.find('textarea').val();
                  data.id = Math.floor(Math.random()*10000) + 1;
               }
               var $cont = $('#' + Messager.current.name + ' .cont>ul', $obj);

               var m = Messager.append_mess(data, $cont, Messager.current.name == 'office');

               if( Messager.current.name != Messager.news.name)
                  Messager.scrollTop($cont.height());

               $obj.find('textarea').val('');
            },
            'json'
         )

         return false;
      });

      Messager.action(options);

      return $obj.data('is_mess', true);
   }
}

jQuery.fn.Messager = function(options)
{
   var settings = $.extend({}, options);

   if(!this.data('is_mess'))
      return common.init(this, function(o){o.Messager = Messager.init($(o), settings);});
   else
      Messager.action(settings);

   return this;
}

function im($obj, options)
{

   if (!$obj.length)
      return $obj;

   this.init = function()
   {
      title.set('Мои сообщения');
   }

   this.init();

   $obj.Messager(options);

   this.clear = function()
   {
      Messager.stop();
   }

   return this;
}

﻿$.fn.im = function(options)
{
   return common.intrfc(this, im, options);
}
})();
