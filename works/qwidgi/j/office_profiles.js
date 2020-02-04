(function(){

var $templateProfile = false;
var $template = false;
var $lftcol = false;

var our_companies = [];

function officeProfile($obj, options)
{
   options.page = options.page || '';

   function getPage(p)
   {
      return p.split('/').length ? p.split('/')[0] : '';;
   }

   options.page = getPage(options.page);

   var key = 'office_uid_' + options.user_id + '_' + options.id;

   var set = function(office_info)
   {
      common.log('Init office#' + office_info.id);

      var $companyPage = $template
         .clone()
         .attr('id', 'company-edit' + office_info.id);

      $obj.append(
         $companyPage
      );

      var addCount = function(v)
      {
         return typeof(v) != 'undefined' && v > 0 ? ' (' + v + ')' : '';
      };

      $lftcol
         .append(
            '<ul class="list o' + office_info.id + '">' +
               '<li><h2><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/profile">' + common.strictWord(office_info.comp_name, 13) + '</a></h2></li>' +
               '<li class="title"><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/employees">Сотрудники' + addCount(office_info.number_employees) + '</a></li>' +
               '<li class="title"><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/album">Фотографии' + addCount(office_info.number_photos) + '</a></li>' +
               '<li class="title"><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/vacancy">Вакансии' + addCount(office_info.number_vacancies) + '</a></li>' +
               '<li class="title"><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/responses">Отзывы' + addCount(office_info.number_messages) + '</a></li>' +
               '<li class="title"><a href="#' + (options.user_id ? 'u/' + options.user_id + '/' : '') + 'office/' + office_info.id + '/relations">Связи</a></li>' +
             '</ul>'
         );

      $companyPage.find('#profile_comp').attr('id', 'profile_comp' + office_info.id);
      $companyPage.find('#employees').attr('id', 'employees' + office_info.id).hide();
      $companyPage.find('#comp_albums').attr('id', 'comp_albums' + office_info.id).hide();
      $companyPage.find('#vacancy_cont').attr('id', 'vacancy_cont' + office_info.id).hide();
      $companyPage.find('#responses').attr('id', 'responses' + office_info.id).hide();
      $companyPage.find('#relations').attr('id', 'relations' + office_info.id).hide();
   }

   var set_title = function()
   {
      var c = common.cache[key];
      title.set(c && c.info ? (c.info.first_name || '') + ' ' + (c.info.second_name || '')  : 'Мой офис');

      if(c.info)
         title.$cont.userMenu(
         {
            hasContacts : c.info.hasContacts,
            hasAlbums   : c.info.hasAlbums,
            office_id   : c.info.office_id,
            active      : 'office',
            url         :
            {
               contact  : '#u/' + c.info.user_id + '/contact',
               album    : '#u/' + c.info.user_id + '/album',
               office   : '#u/' + options.user_id + '/office/' + c.info.office_id + '/profile'
            }
         });
   }

   var reinit = function()
   {
      var data = {}

      $(common.cache[key].list).each(function(i, o)
      {
         if(options.id == o.id)
            data = o;
      });

      common.log('Office reinit start #' + data.id);

      set_title();

      var $officeInfo = $obj.find('#profile_comp' + options.id).show();

      var pages = {
         profile   : '.profile_comp.main',
         employees : '.employees.main',
         albums    : '.comp_albums.main',
         vacancy   : '.vacancy_cont.main',
         responses : '.responses.main',
         relations : '.relations.main'
      }

      var sct = ['.company.main'];

      for(var p in pages)
         if(options.page != p)
            sct.push(pages[p])

      common.log(options.page + ': ' + sct.join(', '));

      $obj.find(
         sct.join(', ')
      ).css('display', 'none')
      .each(function(){
         if(this.intrfc && this.intrfc.clear)
            this.intrfc.clear();
      });

      $obj.find('#company-edit' + options.id).show();

      var end = function()
      {
         $obj
            .removeClass('loading')
            .addClass('viewlist');

         set_title();
      }

      switch(options.page)
      {
         case 'employees':
            var $empl = $obj.find('#employees' + options.id)
               .employees(
               {
                  comp_id        : options.id,
                  contact_id     : options.contact_id,
                  edit           : data.edit,
                  isTitle        : false,
                  onRecieveData  : function(data)
                  {
                     end();

                     if (data && data.length) return;

                     $empl.find('.employees').remove();
                  }
               }).show();
         break;
         case 'album':

            var $alb = $obj.find('#comp_albums' + options.id);
            var new_options = path.parse(location.hash.substr(1)).options;

            if(
               $alb.length &&
               layout.needReset($alb[0], new_options, $alb[0].options || {})
            )
            {
               $alb.show()[0].intrfc.init(new_options);
            }
            else
            {
               // Фотоальбом компании
               $alb
                  .qgallery(
                     $.extend(
                        path.parse(location.hash.substr(1)).options,
                        {
                           id      : options.id,
                           o       : options.user_id ? 'u/' + options.user_id + '/office' : options.o,
                           edit    : data.edit,
                           end     : end,
                           isTitle : false
                        }
                     )
                  );

               if($alb.length && typeof($alb[0].intrfc) == 'object' && $.isFunction($alb.show()[0].intrfc.recall_tumb))
               {
                  $obj.show().find('#company-edit' + options.id).show();

                  $alb.show()[0].intrfc.recall_tumb();
               }
            }

         break;
         case 'vacancy':
            if(!$obj.find('#vacancy_cont' + options.id)[0].intrfc)
            {
               var $vcncy = $obj.find('#vacancy_cont' + options.id)
                  .vacancyList(
                  {
                     comp_id : options.id,
                     edit:data.edit,
                     onRecieveData  : function(data, edit)
                     {
                        end();

                        if (data && data.length)
                           return;

                        if (!edit)
                           $obj.find('#company-edit' + options.id + ' .vacancy_cont').remove();

                        $obj.find('#company-edit' + options.id + ' .vacancy_cont .delete').hide();
                     }
                  }).show();
             }else
                  $obj.find('#vacancy_cont' + options.id).show();
         break;
         case 'responses':

            if(!$obj.find('#responses' + options.id)[0].intrfc)
               $obj.find('#responses' + options.id)
                  .responseList({comp_id : options.id,end:end,edit:data.edit})
                  .show();
            else
               $obj.find('#responses' + options.id).show();

         break;
         case 'relations':
            // Связи компании
            if(!$obj.find('#relations' + options.id)[0].intrfc)
            {
               var $rltns = $obj.find('#relations' + options.id)
                  .relations(
                  {
                     edit    : data.edit,
                     comp_id : options.id,
                     templateProfile: $templateProfile,
                     onRecieveData  : function(data, edit)
                     {
                        end();

                        if (data)
                        {
                           var count = 
                              Number(data.count_partners) + 
                              Number(data.count_competitors) + 
                              Number(data.count_corporations);

                           if (!isNaN(count) && count > 0)
                              return;
                        }
                     }
                  }).show();
             }else
                $obj.find('#relations' + options.id).show();

            $obj.find('#relations' + options.id + ' .profile_comp').show();
         break;
         default:
            // Информация о компании
            if(!$obj.find('#profile_comp' + options.id).intrfc)
               $obj
                  .find('#profile_comp' + options.id)
                  .officeInfo
                  (
                     $.extend(
                     {
                        data:data,
                        edit:data.edit,
                        our_companies:this.our_companies,
                        end:end
                     },
                     options
                  )
               ).show();
            else
               $obj.find('#profile_comp' + options.id).show();
         break;
      }


      $obj.find(':first .ui-tabs-selected').removeClass('ui-tabs-selected');

      $obj.find(':first a[href=#office/' + options.id + '/' + options.page + ']').parent().addClass('ui-tabs-selected');

   };

   var reset = function()
   {
      common.log('office reset ' + options.o + '#' + options.id);

      $obj.addClass('loading');

      if(options.html)
      {
        $obj
           .empty()
           .html(options.html);

         $templateProfile = $obj.find('#profile_comp').clone();
         $template = $obj.find('#company-edit').remove();
         $lftcol = $obj.find('#lftcol-groups');

         our_companies = [];
      }

      function view(data)
      {
         $(data.list).each(function(i, o)
         {
            our_companies[o.id] = o.comp_name;
         });

         $(data.list).each(function(i, o)
         {
            set(o);
         });

         reinit();
      }

      if(!common.cache[key])
         $.post(
            '/office/info',
            {
               id      : options.id,
               user_id : options.user_id
            },
            function(data)
            {
               common.cache[key] = data;

               view(data)
            },
            'json'
         );
      else
         view(common.cache[key]);
   }

   this.init = function(o)
   {
      if(o) $.extend(options, o);

      options.page = getPage(options.page);

      reinit();
   }

   this.needReset = function(new_options)
   {
      var hasId = false;
      $(common.cache[key].list).each(function(i, o)
      {
         if(new_options.id == o.id)
            hasId = true;
      });

      return !hasId ||
         (
            typeof(new_options.user_id) == 'undefined' &&
            typeof(options.user_id) == 'undefined'
         ) ||
         (
            options.user_id != new_options.user_id
         );

   }

   reset();

   return this;
}

$.fn.officeProfile = function(options)
{
   options = options || {};
   options.html = options.html || common.cache[options.url] || '';

   var me = this;

   icon.run(
      {
         url:options.url,
         html:options.html
      },
      options,
      function(html)
      {
         common.intrfc(me, officeProfile, $.extend(options, {html:html}));
      }
   );

   return this;
}})();
