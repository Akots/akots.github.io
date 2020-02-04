(function(){

$.fn.changeVote = function(options)
{
   var $view_changes = false;

   $(document).mouseover(function(event)
   {
         if (
            $view_changes &&
            !$(event.target).parents('#view_changes').length &&
            event.target.id != 'view_changes' &&
            $view_changes.length &&
            $view_changes[0].cont &&
            $view_changes[0].cont.parent().parent().length &&
            !$(event.target).parents('.' + $view_changes[0].cont.parent().parent()[0].className).length
         )
            $view_changes.empty().hide();
   });

   $(document).click(function(event){
         if ($view_changes && !$(event.target).parents('#view_changes').length)
            $view_changes.empty().hide();
   });

   var $edit = $(this);

   if(!$view_changes)
      $view_changes = $('<ul id="view_changes" class="fly"></ul>')
      .css('display', 'none')
      .appendTo(document.body);
   function label(o)
   {
      return o.parentNode.className.split(' ')[0];
   }

   var view_changes = function(data, o)
   {
      $view_changes.empty().append('<li class="warning">Это поле было изменено. Вы можете проголосовать за изменение, для того чтоб его могли увидеть все остальные.</li>');

      $(data).each(function(i, o)
      {
         $view_changes.addEvent(
            o,
            {
               afterVoite : function(){
                  common.cache[label(o)] = false;
               }
            }
         );
      });

      var offset = $edit.offset();

      $view_changes[0].cont = $edit;

      $view_changes
         .css(
         {
            top:offset.top + $edit.outerHeight(),
            left:offset.left,
            position:'absolute'
         })
         .show();
   }

   return this.mouseover(function()
   {
      var me = this;
      var name = label(this);

      $edit = $(this);

      if(common.cache[name] && common.cache[name].length)
         view_changes(common.cache[name], this);
      else
         $.post(
            '/office' + (options.data.id ? '/' + options.data.id : '') + '/changes',
            {
               name:name
            },
            function(data)
            {
               view_changes(common.cache[name] = data, me);
            }
         );
   });
}

function officeInfo($profile, options)
{
   var officeInfo = this;
   options.edit = typeof(options.edit) == 'boolean' ? options.edit : true;

   this.setTitle = function (data)
   {
      data = data || options.data;
      title.set(data.comp_name || 'Компания');

      title.$cont.find('#add-person').remove();
   }

   if (options.data.comp_name)
      $('.comp_name .value', $profile).text(options.data.comp_name);
   else
      $('.comp_name', $profile).addClass('empty');
      
   if (options.data.logotype_url)
   {
      $('.logotype img', $profile)
         .after('<img src="' + options.data.logotype_url + '"  />')
         .remove();

         $('.logotype img', $profile)
         .load(function()
         {
            $('.common_info', $profile).width($(this).width());
         })
         .data('rel', options.data.logo_crop || {})
         .attr('alt', options.data.comp_name || '');
   }

   if (options.data.number_employees)
      $('.number-employees .value', $profile).text(options.data.number_employees);
   else
      $('.number-employees', $profile).addClass('empty');

   if (options.data.year_create)
      $('.year-create .value', $profile).text(options.data.year_create);
   else
      $('.year-create', $profile).addClass('empty');

   if (options.data.city)
      $('.city .value', $profile).text(options.data.city);
   else
      $('.city', $profile).addClass('empty');

   if (options.data.pattern_ownership)
   {
      $('.pattern_ownership', $profile).before(', ');
      $('.pattern_ownership .value', $profile).text(options.data.pattern_ownership);
   }
   else
      $('.pattern_ownership', $profile).addClass('empty');
   
   if (options.data.branch)
      $('.branch .value', $profile).text(options.data.branch);
   else
      $('.branch', $profile).addClass('empty');

   if (options.data.venue)
      $('.venue .value', $profile).text(options.data.venue);
   else
      $('.venue', $profile).addClass('empty');

   if (options.data.comp_phone)
      $('.comp_phone .value', $profile).text(options.data.comp_phone);
   else
      $('.comp_phone', $profile).addClass('empty');

   if (options.data.comp_email)
      $('.comp_email .value', $profile).text(options.data.comp_email);
   else
      $('.comp_email', $profile).addClass('empty');

   if (options.data.comp_site)
      $('.comp_site .value', $profile).text(options.data.comp_site);
   else
      $('.comp_site', $profile).addClass('empty');

   if (options.data.first_name)
      $('.first_name_cont', $profile).text(options.data.first_name);
   else
      $('.first_name_cont', $profile).addClass('empty');

   if (options.data.second_name)
      $('.second_name_cont', $profile).text(options.data.second_name);
   else
      $('.second_name_cont', $profile).addClass('empty');

   if (options.data.last_name)
      $('.last_name_cont', $profile).text(options.data.last_name);
   else
      $('.last_name_cont', $profile).addClass('empty');

   var edit = options.data.edit && options.edit;

   var change_fields = [
      '.comp_name .value',
      '.city .value',
      '.venue .value',
      '.pattern_ownership .value',
      '.branch .value',
      '.comp_email .value',
      '.comp_site .value',
      '.comp_phone .value',
      '.first_name_cont',
      '.last_name_cont',
      '.second_name_cont',
      '.number-employees .value',
      '.year-create .value'
   ];

   $(options.data.change_fields).each(function(i, o)
   {
      if (change_fields[o-1])
         $profile.find(change_fields[o-1]).addClass('changed').parent().addClass('changed');
   });

   // ************************************************************
   //       Инпуты в профайле компании
   // ************************************************************

   function search(title, name)
   {
      return common.link(title, name, 'office');
   }

   if(edit)
   {
      // ************************************************************
      //       Валидация в форме профайла компании
      // ************************************************************

      $profile.find('form').validate(
      {
         errorElement   : 'div',
         //focusInvalid : false,
         //focusCleanup : false,
         rules          :
         {
            /*comp_name      : { required: true, minlength: 3 },*/
            first_name     : { required: true, minlength: 3 },
            last_name      : { required: true, minlength: 3 },
            comp_email     : { required: false, email: true }
         },
         messages: {
            /*comp_name: {
               required  : 'Введите название организации',
               minlength : 'Введите минимум 3 символа'
            },*/
            first_name: {
               required  : 'Введите имя генерального директора',
               minlength : 'Введите минимум 3 символа'
            },
            last_name: {
               required  : 'Введите фамилию генерального директора',
               minlength : 'Введите минимум 3 символа'
            },
            comp_email: {
               email     : 'Введите правильный e-mail'
            }
         }
      });
   }

   $profile.find('.value').each(function(i, o){
      $(o).html(search($.trim($(o).html().replace(/<[^>]*>/ig, '')), $(o).parent()[0].className.split(' ')[0]));
   });

   if(edit)
   {
      $('.logotype img', $profile).imgchanger(
      {
            url_img          : common.is_proto() ? '/office/' + options.data.id + '/logo/1' : '',
            url_img_orig     : '/office/' + options.data.id + '/logo/orig',
            upload_url       : '/office/' + options.data.id + '/upload_logo',
            resize_url       : '/office/' + options.data.id + '/logo_size',
            office_id        : options.data.id,
            with_edit        : edit,
            type             : 'logotype'
      });

      $profile.find('.imgchanger .edit').hide();


      var $toggle_edit = $profile.find('.edit-photo')
         .click(function()
         {
            if(
               $profile.find('.comp_email .value .val').length
            )
            {
               $profile.removeClass('edit');

               $profile.find(
               '.comp_name .value,'  +
               '.city .value,'       +
               '.branch .value,'     +
               '.year-create .value,'+
               '.number-employees .value,' +
               '.venue .value,'      +
               '.comp_phone .value,' +
               '.comp_email .value,' + 
               '.comp_site .value,'  +
               '.director .value'
               ).each(function(i, o){
                  o.inputEx.dispose();
               });

               $profile.find('.pattern_ownership .value')[0].selectEx.dispose();

               $toggle_edit.removeClass('search').attr('title', 'Редактировать информацию о компании');

               $profile.find('.changed .changed').changeVote(options);

               $profile.find('.imgchanger .edit').hide();

            }
            else
            {
               $profile.addClass('edit');

               var onSave = function(data, param)
               {
                  common.cache[param.name] = false;

                  $profile.find('.changed .changed').changeVote(options);
               }

               var inputExParams = {
                  url    : '/office/' + options.data.id + '/edit',
                  param  :   { id : options.data.id },
                  path   : 'office',
                  search : search,
                  onSave : onSave
               };

               $profile.find('.comp_name .value,').inputEx($.extend({empty:'Название компании'}, inputExParams));

               $profile.find(
                  '.number-employees .value,' +
                  '.branch .value,'           +
                  '.year-create .value,'      +
                  '.number-employees .value,' +
                  '.comp_phone .value,'       +
                  '.comp_email .value,'       +
                  '.venue .value,'            +
                  '.comp_site .value'
               ).inputEx(inputExParams);

               var $city =

                  $profile.find('.city .value')
                  .inputEx(inputExParams)
                  .city(
                  {
                     url: '/office/' + options.data.id + '/edit',
                     param:
                     {
                        comp_id:options.data.id
                     }
                  });

               $profile
                  .find('#venue')
                  .setup_autocomplete('/loc/venues',
               {
                  extraParams:
                  {
                        city_id:function(){return $city.parent().find('input.city_id').val()}
                  }
               });

               $profile.find('.director .value').wrap_cont();
               $profile.find('.director .first_name_cont.value').inputEx($.extend(inputExParams, {empty:'Имя'}));
               $profile.find('.director .second_name_cont.value').inputEx($.extend(inputExParams, {empty:'Отчество'}));
               $profile.find('.director .last_name_cont.value').inputEx($.extend(inputExParams, {empty:'Фамилия'}));

               $profile.find('.pattern_ownership .value').selectEx(
                  {
                     empty  : 'Форма собственности',
                     list   : '/office/ownership',
                     url    : '/office/' + options.data.id + '/edit',
                     search : search,
                     onSave : onSave
                  }
               );

               $toggle_edit.addClass('search').attr('title', 'Просмотр информации о компании');

               $profile.find('.imgchanger .edit').show();
            }
         });

      $profile.find('.changed .changed').changeVote(options);
      $profile.find('.quick_menu .send_user_message').parent().remove();

   }else{
      $profile.find('.quick_menu .send_user_message').attr('href', '#im/office/' + options.data.id + '/' + options.data.comp_name);

      $profile.find('.quick_menu .add_right_people').click(function(){
         $li = $(this).parent();

         $.post(
           '/u/' + options.data.id + '/right_people/add', // + '/' + person_card.user_id,
           {},
           function(data){
             if (data && data.sc)
               $li.remove();
           },
           'json'
         );
      });

      $profile.find('.quick_menu .edit-photo').parent().remove();
      $profile.find('.changed').removeClass('changed');
   }

   var $relation_menu = $profile.find('.quick_menu .change_relation').css('display', 'none');

   function init_relation_menu()
   {
      $relation_menu = $relation_menu.find('ul').hide();

      var $companies = $('<ul></ul>');

      for(var oid in options.our_companies)
         $companies.append('<li class="oid' + oid + ' to_comp"><a href="javascript:void(0)">' + options.our_companies[oid] + '</a></li>');

      $companies.hide().find('.oid' + options.id).remove();

      $relation_menu.find('li').each(function()
      {
         var $ul = $companies.clone(),
             type = Number(this.className.substr(1));

         for(var oid in options.data.relations)
            if(type == options.data.relations[oid])
               $ul.find('.oid' + oid).css('display', 'none');

         $(this).append($ul);

      });

      $profile.find('.change_relation a.icon').click(function(){
         $relation_menu.show();
      });

      $relation_menu.hover(
         function(){
            $relation_menu.show();
         },
         function(){
            $relation_menu.hide();
         }
      );

      $relation_menu.find('.lev1').hover(
         function(){
            $(this).find('ul').show();
         },
         function(){
            $(this).find('ul').hide();
         }
      );

      $relation_menu.find('.to_comp a').click(function()
      {
         var $this = $(this);

         var to_type = $this.parent().parent().parent()[0].className.split(' ')[0].substr(1);
         var to_comp = $this.parent()[0].className.split(' ')[0].substr(3);

         $.post(
            '/office/' + options.id + '/relation/change',
            {
               comp_id_to_change : options.id,
               comp_id           : to_comp,
               to_type           : to_type
            },
            function(data)
            {
               if (data && data.sc)
               {
                  options.data.relations[to_comp] = to_type;
                  $relation_menu.find('.to_comp').show();
                  $relation_menu.find('.t' + to_type + ' .oid' + to_comp).hide();
               }
            },
            'json'
         );
         return false;
      });

      return $relation_menu.parent().show();
   }

   if(common.cache['our_companies'])
      options.our_companies = common.cache['our_companies'];

   if(edit && !options.our_companies)
      layout.intfse.load(
      {
         url: '/office/our',
         verify: function(){ return options.our_companies && options.our_companies.length; },
         next: function()
         {
            init_relation_menu()
         },
         callback: function(data)
         {
            try
            {
               eval('options.our_companies = ' + data + ';');
               return common.cache['our_companies'] = options.our_companies;
            }catch(e){}

            return {};
         }
      });
   else if(edit)
      init_relation_menu()

   if(options.end)
      options.end();

   return this;
}

$.fn.officeInfo = function(options)
{
   var $obj = this;

   options.data = options.data || false;

   if(!options.data)
   {
      function init()
      {
         if(!$obj.find('.profile_comp.main').length)
         {
            options.url = options.url || '/interface/office/profile';
            options.html = options.html || common.cache[options.url] || ''; 

            icon.run(
               {
                  url:options.url,
                  html:options.html
               },
               options,
               function(html)
               {
                  $obj.append($(options.html = html).find('.profile_comp.main'));

                  common.intrfc($obj, officeInfo, options);
               }
            );

         }else
            common.intrfc($obj, officeInfo, options);
      }

      var url = '/office/' + options.id + '/get';

      if(typeof(common.cache[url]) == 'undefined')
         $.post(
            url,
            {
               id:options.id
            },
            function(data)
            {
               if(data.length)
                  data = data[0];

               init(common.cache[url] = options.data = data);
           },
           'json'
         );
      else
         init(options.data = common.cache[url]);

   }else
      common.intrfc($obj, officeInfo, options);

   return this;

}})();
