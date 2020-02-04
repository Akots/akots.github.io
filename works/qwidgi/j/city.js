(function(){
jQuery.fn.city = function(options)
{
   if(!this || !this.length)
      return;

    var init = function($this, options)
    {

       var id = null;
       var city_name = '';

       var $obj = $this.find('input[type=text]');

       if($obj.length && $obj.parent().find('.' + $obj.attr('name') + '_id').length)
            id = Number($this.parent().find('.' + $obj.attr('name') + '_id').val());

       var settings =
       {
             inputEx: true,
             title: function()
             {
                return $.trim($obj.val());
                //return city_name;
             }
       };
       settings = $.extend(settings, options);
       settings.param = $.extend(settings.param,
       {
             city_id: function()
             {
                return id;
             }
       });

       if($this.length)
          $this[0].getId = function()
          {
             return id;
          }

       if(
         settings &&
         (
            typeof(settings.inputEx) == 'undefined' ||
            settings.inputEx
         ) &&
         (
            !$obj.length ||
            !$obj.parent().length ||
            !$obj.parent()[0].inputEx
         )
      )
             $obj = $this.inputEx(settings).find('input[type=text]');

       city_name = settings.text =
         settings.inputEx && $obj.parent()[0].inputEx ?
         $obj.parent()[0].inputEx.getTitle() :
         $.trim($this.text());

       if(!$this.parent().find('.' + $obj.attr('name') + '_id').length)
          $obj.after('<input name="' + $obj.attr('name') + '_id" class="' + $obj.attr('name') + '_id" type="hidden" value="" />');

       var no_match = function()
       {
             var $add_city = $('#add_city');
             var $add_city_block = $('.popupwindow.add-city-form');

             if($add_city.length <= 0)
             {
                $add_city = $(
                '<div>' +
                '<form id="add_city" action="/loc/city/add" method="post" class="form_popup">' + 
                 '<input type="hidden" maxlength="50" value="" name="city" class="city_name">' + 
                 '<table><tr>' + 
                   '<td class="label"><label for="country">Страна:</label></td>' + 
                   '<td class="input"><select name="country" id="country"></select></td>' + 
                 '</tr><tr>' + 
                   '<td class="label"><label for="region">Регион:</label></td>' + 
                   '<td class="input"><select name="region" id="region"></select></td>' + 
                 '</tr><tr>' + 
                   '<td></td>' +
                   '<td class="submit"><input value="Добавить" name="submit" type="submit" />' +
                  '<input value="Отменить" class="cancel" name="cancel" type="button" /></td>' + 
                 '</tr></table>' +
                '</form>' +
                '</div>'
                )
                .appendTo(document.body)
                .popupHint({
                   header:'Добавить город',
                   isDialog:true
                })
                .addClass('popupwindow add-city-form')
                .hide();



               $add_city.find('.cancel').click( function()
               {
                  $add_city.hide();
               });

                var region_change = function(country_id)
                {
                   var region = $add_city.find('select#region');

                   region.parent().addClass('loader');

                   $.post(
                      '/loc/regions',
                      {country:country_id},
                      function(data)
                      {
                         region.removeOption(/./).addOption(data, false);

                         for(var id in data)
                         {
                            region.selectOptions(id);
                            break;
                         }
                         region.parent().removeClass('loader');
                      },
                      'json'
                   );

                }

                var $country = $add_city.find('select#country').change(function(){
                   region_change(this.value)
                });

                $.post(
                   '/loc/countries',
                   {},
                   function(data)
                   {
                      $country.removeOption(/./).addOption(data, false);
                         for(var id in data)
                         {
                            $country.selectOptions(id);
                            region_change(id)
                            break;
                         }
                   },
                   'json'
                );

                $add_city.submit(function(){

                      $.post(
                         '/loc/city/add',
                         {
                            country:$add_city.find('select#country').val(),
                            region:$add_city.find('select#region').val(),
                            city:$obj.val()
                         },
                         function(data)
                         {
                            id = data.city_id;

                            $obj.parent().find('input.' + $obj.attr('name') + '_id').val(data.city_id);

                            if($obj.parent().length && $obj.parent()[0].inputEx)
                               $obj.parent()[0].inputEx.save(true);
                            $add_city.remove();
                         },
                         'json'
                      );

                   return false;
                });
             }
             $add_city.find('.city_name').val($obj.val());

             var $val = $obj.parent();

             $val = $val.length ? $val : $obj;

             if($val.offset() && $val.offset().top)
                $add_city
                   .css({
                     top      : $val.offset().top + $val.outerHeight({ margin: true }),
                     left     : $val.offset().left
                   })
                   .show();
       }

       var param = {};

       if(settings && settings.param)
          for (var item in settings.param)
             param[item] = $.isFunction(settings.param[item]) ? settings.param[item]() : settings.param[item];

      var $post = null;

       $obj.setup_autocomplete(
          '/loc/cities',
          {
             extraParams: param,
             formatItem: function (row, i, num)
             {
                return row[0] + '<em class="ac_region">' + row[1] + '</em><em class="ac_country">' + row[2] + '</em>';
             }
          },
          function(event, data, formatted)
          {
            if($post)  $post.abort();

             var old_id = id;
             id = null;

             if(data == 'No match!' || (common.is_proto() &&  city_name == 'new'))
             {
                data[3] = '';
                data[0] = '';
                no_match();
             }
             else
                $('.popupwindow.add-city-form').remove();

             id = data[3];
             city_name = data[0];

             $obj.parent().find('input.' + $obj.attr('name') + '_id')
                .val(id);

             $obj.parent().find('.val')
                .text(city_name);

             if(old_id != id && $obj.parent().length && $obj.parent()[0].inputEx)
                $obj.parent()[0].inputEx.save(true);

          if(options && options.result)
            options.result();

             return id;
          }
       ).change(
          function()
          {
             $obj.parent().find('.val').text($obj.val());

             city_name = this.value;

             if(!city_name.length)
             {
                $('.popupwindow.add-city-form').remove();
                id = null;
                if($obj.parent().length && $obj.parent()[0].inputEx)
                   $obj.parent()[0].inputEx.save(true);
             }
             else
                $post = $.post(
                   '/loc/city/exists',
                   {
                      city_name:city_name,
                      city_id:id
                   },
                   function(data)
                   {
                      id = null;

                      if(data && data.id)
                         id = data.id;

                      if(
                        (
                           !common.is_proto() && !data.exists
                        ) || (
                           common.is_proto() &&  city_name == 'new'
                        )
                     )
                         no_match();
                      else
                         $('.popupwindow.add-city-form').remove();
                   },
                   'json'
                );
          }
       ); 
    }

   return $(this.length ? this : [this]).each(function(i, o){
      init($(o), options);
   });

   return this;
}})();
