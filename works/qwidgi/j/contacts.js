(function(){

function contacts($layout, options)
{
   if (!$layout || !$layout.length) return this;

   $layout.addClass('contacts_view');
   var me = this;
   var $people = false;
   var url = '/interface/u/profile';

   options = options || {};

   this.clear = function()
   {
      if(options.isTitle)
         title.empty();
   }

   function reviewLink()
   {
      if($people)
      {
         $people.find('#list-items .active').removeClass('active');

         $people
            .find('.v' + options.contact_id + ' .vcard a')
            .addClass('active');
      }

      var f = $layout.hasClass('listview');

      $layout.find('#list-items .vcard a').each(function()
      {
         var r = $(this).parent().parent().parent().parent().find('.to_profile').attr('href');
         var id = (options.id || ID);


         this.href = f ?
            options.view_cont( r.replace(/[^#]*#u\/([\d]+)\/profile$/ig, '$1'), options.comp_id || id, options.group_id ) :
            r;
      });
   }

   this.needReset = function(new_options)
   {
      return !(
         !common.cache[url] ||
         !(
            typeof(new_options.id) == 'undefined' &&
            typeof(options.id) == 'undefined'
         ) ||
         (
            typeof(options.id) != 'undefined' &&
            options.id != new_options.id
         ) ||
         !(
            typeof(new_options.group_id) == 'undefined' &&
            typeof(options.group_id) == 'undefined'
         ) ||
         (
            typeof(options.group_id) != 'undefined' &&
            options.group_id != new_options.group_id
         ));
;
   }

   this.init = function(new_options)
   {
      if(new_options && new_options.contact_id)
         options.contact_id = new_options.contact_id;

      if(options.isTitle)
      {
         title.set(options.title ? options.title : (common.cache[index()] && common.cache[index()].info ? (common.cache[index()].info.first_name || '') + ' ' + (common.cache[index()].info.second_name || '') : 'Мои контакты'));

      }

      if(options.end)
         options.end( common.cache[index()] && common.cache[index()].info ? common.cache[index()].info : false);

      if( options.contact_id )
      {
         $layout.addClass('listview');

         reviewLink();

         var $view = $layout.find('.contact').empty();

         if(!$view.length)
            $view = $('<div class="contact"></div>').appendTo($layout.find('.group_view'))

         function view_user(html)
         {
            $view.userProfile(
            {
               id         : options.contact_id,
               html       : html,
               hasTopTabs : false,
               edit       : false,
               isTitle    : false
            });
         }

         if(typeof(common.cache[url]) == 'undefined')
            $.post(
               url,
               {},
               function(html)
               {
                  common.cache[url] = html;
                  view_user(html);
               },
               'text'
            );
         else
            view_user(common.cache[url]);

      }else
         reviewLink();


      return title
         .append
         (
            '<div id="page-functional">' +
               '<a class="toggle-view" href="javascript:void(0);" title="Поменять вид" />' +
            '</div>'
         )
         .find('.toggle-view')
         .click(function()
         {
            $(this).toggleClass('list-view');
            $layout.toggleClass('listview');

            reviewLink()

            if(
               $people &&
               $layout.find('#list-items .vcard:first a').length &&
               $layout.hasClass('listview') &&
               (!options.contact_id || !options.contact_id.length)
            )
            {
               $people.find('#list-items .active').removeClass('active');
               location.href = $layout.find('#list-items .vcard:first a').addClass('active').attr('href');
            }
         });
   }

   var index = function()
   {
      return common.serialize(
      {
         o: options.isEmployees,
         group_id: options.group_id,
         comp_id: options.comp_id,
         id: options.id
      });
   }

   var load = function(data)
   {
      common.cache[index()] = data;

      if($people)
         $people.parent().removeClass('indicator-loading loading');

      if (options.onRecieveData) 
         options.onRecieveData((data.list || data), options.edit);

      if (data && (data.list || data).length && $people)
      {
         $people.empty().addPerson(
            data.list || data ,
            options.isEmployees ?
            {
               comp_id          : options.comp_id,
               edit             : options.edit,
               is_voited_access : true,
               onDelete         : options.onDelete,
               onUndo           : options.onUndo,
               end              : me.init,
               url              : options.urlCard,
               click            : function()
               {
                  $people.find('.active').removeClass('active');

                  $(this).addClass('active');
               },
               isEmployees      :options.isEmployees
            } :
            {
               type             : 2, // Нужные люди
               delete_url       : options.url_del || '/u/right_people/delete',
               is_voited_access : true,
               group_id         : options.group_id,
               accept_url       : options.url_accept || '/u/right_people/accept',
               end              : me.init,
               url              : function(card)
               {
                  return (options.o ? options.o : 'u') + '/' + (options.id ? options.id + '/' : '') + 'contact/' + card.user_id;
               },
               click            : function()
               {
                  $people.find('.active').removeClass('active');

                  $(this).addClass('active');
               },
               css              : function(card)
               {
                  return card.user_id == options.contact_id ? ' active' : '';
               },
               isEmployees      : options.isEmployees
            }
         );
      }
      if($people)
         $people
            .append('<br class="both" />')
            .parent()
            .removeClass('indicator-loading loading');
   }

   var reset = function()
   {
      var first = 'Поиск';

      options.html = options.html ? options.html :
         '<div class="group_view"><div id="filters"><form>' +
            '<div id="filter-search">' +
               '<span><input value="' + first + '" name="search" /></span>' +
            '</div>' +
         '</form></div>' +
         '<div id="list-items"><ul class="list"></ul></div></div>';

      if(options.isTitle)
         title.empty();

      $people = $layout.find('#list-items .list');

      if(!$people.length)
         $people = $layout.append(options.html).find('#list-items .list');

      var $search = $layout
         .find('input[name=search]');

      $search
         .focus(function()
         {
            if(first == $search.val())
               $search.val('')
         })
         .blur(function()
         {
            if(!$search.val().length)
               $search.val(first);
         })
         .endType(function()
            {
               $people.find('.item').each(function(i, o)
               {
                  var val = common.htmlspecialchars($search.val());

                  if(!val.length || $(o).find('.name a').text().toLowerCase().indexOf(val.toLowerCase()) >= 0)
                     $(o).show();
                  else
                     $(o).hide();
               });
            });


      if($people)
         $people.parent().addClass('indicator-loading');

      if(!common.cache[index()])
         $.post
         (
            options.url_get || '/u/' + (options.id ? options.id + '/' : '') + 'right_people/get',
            {
               group_id:options.group_id
            },
            load,
            'json'
         );
      else
         load(common.cache[index()]);

   }

   reset();

   return this;
}

$.fn.contacts = function(options)
{
   var me = this;

   var url = '/u' + (options.id ? '/' + options.id : '') + '/group/get';


   var load = function(data)
   {
      common.cache[url] = data;

      if(!data.length)
      {
         me.removeClass('with-group');

         return;
      }

      var $list = me.find('#lftcol-groups .list');

      if($list.find('.g' + options.group_id).length)
      {
         $list.find('.ui-tabs-selected').removeClass('ui-tabs-selected');
         $list.find('.g' + options.group_id).addClass('ui-tabs-selected');

         return;
      }

      if($list.length)
         $list.parent().remove();

      $list = me.prepend(
         '<div id="lftcol-groups">' +
            '<ul class="list">' +
            '  <li><h2><a href="#u/contact">Все контакты</h2></li>' +
            '</ul>' +
         '</div>'
      ).addClass('with-group')
      .find('#lftcol-groups .list');

      $(data).each(function(){
         $('<li class="title g' + this.id + ' ' + (Number(options.group_id ? options.group_id : 0) == this.id ? ' ui-tabs-selected' : '') + '"><a href="#' + options.o + (options.id ? '/' + options.id : '') + (this.id ? '/group/' + this.id : '') + '/contact' + '">' + common.strictWord(this.title) + '<em class="new_count">' + this.num + '</em><span>' + common.strictWord(this.venue) + '</span></a></li>')
            .appendTo($list);
      });
   }

   options.withGroup =
      (
         typeof(options.withGroup) == 'boolean' ?
         options.withGroup :
         true
      );

   options.withMenu =
      (
         typeof(options.withMenu) == 'boolean' ?
         options.withMenu :
         true
      );

   if( !common.cache[url] && options.withGroup )
      $.post(
         url,
         {
            id:options.id
         },
         load,
         'json'
      );
   else if(options.withGroup)
      load(common.cache[url]);

   options.end = function(data)
   {
      if(!data)
         return;

      if(!title.$cont)
         title.init();

      if(options.withMenu)
         title.$cont.userMenu(
         {
            hasContacts : data.hasContacts,
            hasAlbums   : data.hasAlbums,
            office_id   : data.office_id,
            active      : 'contacts',
            url         :
            {
               contact  : '#u/' + data.user_id + '/contact',
               album    : '#u/' + data.user_id + '/album',
               office   : '#u/' + data.user_id + '/office/' + data.office_id + '/profile'
            }
         });

      if(options.auth == '&auth=true')
         icon.run({
            name : 'auth',
            url  : '/interface/form/login',
            html : false
         });

   }

   options.isTitle = true;
   options.isEmployees = false;

   options.view_cont = options.view_cont || function(uid, id, group_id)
   {
      return '#u/' + (id ? id + '/' : '') + (group_id ? 'group/' + group_id + '/' : '') + 'contact/' + uid;
   }

   return common.intrfc(this, contacts, options);
}

$.fn.employees = function(params)
{
   var count = 0;
   return common.intrfc(
      this,
      contacts,
      $.extend(
         {
            url_get    : '/office' + (params.comp_id ? '/' + params.comp_id : '') + '/employee/get',
            urlCard    : function(card)
            {
               return 'office' + (params.comp_id ? '/' + params.comp_id : '') + '/employees/' + card.user_id;
            },
            isEmployees: true,
            is_voited_access: true,
            onDelete   : function()
            {
               --count;
            },
            onUndo     : function()
            {
               ++count;
            },
            end        : function(data){
               count = data.length;
            },
            view_cont   : function(uid, comp_id)
            {
               return '#office/' + comp_id + '/employees/' + uid;
            }
         },
         params
      )
   );
}
})();
