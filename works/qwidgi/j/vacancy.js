(function(){
﻿
function vacancy($vacancy, params)
{
   var no_photo_url = '/i/none.png';

   var id = null;
   var with_edit = params.edit;
   var is_new  = params && params.is_new ? params.is_new  : false;

   var options =
   {
      param     :
      {
         vacancy_id: function()
         {
           return id
         },
         comp_id : params.comp_id
      },
      url       : '/office/vacancy/edit'
   };

   if(params.data)
   {

      id = params.data.id;

      $vacancy.find('.title .value').html(common.htmlspecialchars(params.data.title));
      $vacancy.find('.description .value').html(common.htmlspecialchars(params.data.description));

   }

   if (with_edit)
   {
      $vacancy.find('.delete').show();

      $vacancy.find('.title .value').inputEx( $.extend(options,
      {
         empty : 'Название вакансии',
         inp_disptype : 'inline',
         onSave: function(data, p)
         {
            if (data && data.sc && data.id)
              id = data.id;

            if(params.onRename)
               params.onRename(p.title)
         }
       }));

      $vacancy.find('.description .value').inputEx($.extend(options, 
      {
         empty : 'Описание вакансии',
         inp_disptype : 'block',
         onSave: function(data, param)
         {
            if (data && data.sc && data.id)
               id = data.id;
         }
      }));
   }

   (is_new ? $vacancy.find('.delete').hide() : $vacancy.find('.delete').show());

   if (!with_edit)
      $vacancy.find('.delete').remove();
   else      
      $vacancy.find('.delete').click(function()
      {
         var $this = this;
         $.post(
            '/office/vacancy/delete',
            {
              id       : id,
              comp_id  : params.comp_id
            },
            function(data)
            {
                if (data && (data.sc == true || data.sc))
                {
                  $vacancy.empty();
                  if (params.onDelete)
                     params.onDelete();
                }

                (new messg($vacancy)).action(function()
                {
                  $vacancy.show();
                  if (params.onUnDelete)
                     params.onUnDelete();

                  $.post(
                    '/office/vacancy/delete',
                    {
                      id:id,
                      undo:true
                    },
                    function(){},
                    'json'
                  );
                });

            },
            'json'
        );
        return false;
     });

   return this;
}

jQuery.fn.vacancyList = function(params)
{
   if (!this.length) return;

   params = params || {};
   var $vacancies = this;

   $vacancies.find('form').submit(function()
   {
      return false;
   })

   var def = false;
   var $search = $('#filter-search input[name=search]')
      .focus(function()
      {
         if( !def )
            def = this.value;

         this.value = '';
      })
      .blur(function()
      {
         if( !this.value.length )
            this.value = def;
      })
      .endType(function()
         {
            $vacancies.find('li').each(function(i, o)
            {
               var val = common.htmlspecialchars($search.val());

               if(!val.length || $(o).find('a').text().toLowerCase().indexOf(val.toLowerCase()) >= 0)
                  $(o).show();
               else
                  $(o).hide();
            });
         });

   $.post(
      '/office/vacancy/get',
      {comp_id : params.comp_id},
      function(data)
      {
         if (params.onRecieveData)
            params.onRecieveData(data, params.edit);

         var $template_item = $vacancies.find('.vacancies .pattern').removeClass('pattern').remove();

         var $template = $vacancies.find('.vacancy-view').removeClass('pattern').clone();

         function add(o)
         {
            var $clone = $template_item.clone();

            $vacancies.find('.vacancies').append($clone);

            return $clone.find('a')
               .text(o.title)
               .click(function()
               {
                  $vacancies.find('.vacancies .active').removeClass('active');

                  var $link = $(this).addClass('active');

                  $vacancies
                     .find('.vacancy-view')
                     .empty()
                     .html($template.html())
                     .vacancy
                     (
                        o,
                        $.extend(
                           {
                              is_new: false,
                              $cont:$vacancies,
                              onRename:function(name)
                              {
                                 $link.text(name);
                              },
                              onDelete:function()
                              {
                                 $link.parent().hide();
                              },
                              onUnDelete:function()
                              {
                                 $link.parent().show();
                              }
                           },
                           params
                        )
                     );
               });
         }

         $(data).each(function(i, o)
         {
            add(o);
         });

         if(data.length)
            $vacancies.find('li:first a').click();

         if(!params.edit)
            $vacancies.find('.tools').remove();
         else
            $vacancies.find('.tools .add').click(function()
            {
               var validated = true;
               $vacancies.find('#vacancies a').each(function(){
                  if (!this.innerHTML.length) validated = false;
               })
               if (validated){
                  add({
                     id:null,
                     title:'',
                     description:''
                  }).click();
   
                  $vacancies.find('.vacancy-view .title .val').click();
   
                  $vacancies.find('form').validate(
                     {
                        errorElement: 'div',
                        focusInvalid: false,
                        focusCleanup: false,
                        rules:
                        {
                          title: {
                            required: true
                          },
                          description: {
                             required: true
                          }
                        },
                        messages: {
                          title: {
                            required: 'Необходимо ввести название'
                          },
                          description: {
                            required: 'Необходимо ввести описание'
                          }
                        }
                     });
                  }
            });
      },
      'json'
   );

   return this;
}

jQuery.fn.addVacancyCard = function(data, params)
{
   params = params || {};
   if (!this || this && !this.length || !data)
      return this;

   var init = function($container)
   {

//************************************************
//JSON Object
// {
//    id : '2',
//    title: 'Застельщик линолеума',
//    description: 'Требуется хороший застельщик линолеума. Работа непыльная. С 03.00 до 11.00. Все условия, соц. пакет.'
//  }
//***********************************************

      $(data).each(function(index, vacancy_card){
         if (
            vacancy_card.comp_name && 
            vacancy_card.title &&
            vacancy_card.company_page_url &&
            vacancy_card.description
         )
         {

            $vacancy = $(
               '<div class="vacancy_card">' + 
                  '<div class="title vacancy-header brd-dotted-bottom"><h1>' + vacancy_card.title + ', ' + '<a href="#' + vacancy_card.company_page_url.substr(1) + '">' + vacancy_card.comp_name + '</a></h1></div>' + 
                  '<div class="description vacancy-description value">' + vacancy_card.description + '</div>' + 
                  '<ul class="tools">' +
                     '<li class="send_email"><input type="button" class="icon" title="Отправить e-mail компании ' + encodeURIComponent(vacancy_card.comp_name) + '" /></li>' +
                  '</ul>' +
               '</div>'
            );

            $vacancy.find('.send_email' ).click(function(){
               location.href = 'mailto:' + vacancy_card.company_email;
            });

            if(!vacancy_card.company_email)
               $vacancy.find('.send_email' ).hide();

            $container.append($vacancy);

         }
      });
   }
   init(this);
   return this;
}

jQuery.fn.vacancy = function(data, params)
{
   return common.intrfc(this, vacancy, $.extend(params, {data:data}));
}})();
