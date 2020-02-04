(function(){

function job($obj, options)
{
   options = options || {};
   options.data = options.data || {};
   options.edit = typeof( options.edit ) == 'boolean' ? options.edit : false;

   var id = null;

   var org_id = function(val)
   {
      if(typeof(val) == 'undefined')
         return $obj.find('#org_id').val();

      return $obj.find('#org_id').val(val);
   }

   var set_id = function(val)
   {
      id = val;
      $obj.find('input[name=job_id]').val(val);

      var $del_job = $obj.find('.del_job');

      if(!$del_job.length && options && options.edit)
         $del_job = $('h4', $obj).parent().prepend(
            '<a href="javascript:void(0);" class="del-info-item del_job delete" title="Удалить"></a>'
         ).find('.del_job').click(function()
         {
            $.post(
               '/u/emp/del',
               {id:val},
               function(data)
               {

                  (new messg($obj)).action(function()
                  {
                      $obj.removeClass('delete').show();

                      $.post(
                        '/u/emp/del',
                        {
                           id:val,
                           acrion:'undo'
                        },
                        function(){},
                        'json'
                        );
                  });

                  $obj.hide().addClass('delete');
               }
            );
         });

      if(options && options.onSetId)
         options.onSetId();
   }

   var options_job =
   {
      url: '/u/emp/edit',
      param:
      {
         id:function()
         {
            return id;
         },
         org_id:org_id
      },
      onSave:function(data)
      {
         if(data && data.id)
            set_id(data.id);
         if(data && data.org_id)
            org_id(data.org_id);
      }
   };

   set_id(options.data.id);

   if (options && options.data && !options.edit)
   {
      $('.org_cont', $obj).html(common.search({q:options.data.org || ''}, 'office', 'Организация'));

      $('.pos_cont', $obj).html(common.search({q:options.data.pos || ''}, 'office', 'Должность'));

      $('.job_city .value', $obj).html(common.search({q:options.data.city || ''}, 'office', 'Город'));

      $('.start_work_cont', $obj).html(common.search({q:options.data.start_date || ''}, 'office', 'рождения'));

      $('.end_work_cont', $obj).html(common.search({q:options.data.end_date || ''}, 'office', 'настоящее время'));

      if(options.data.venue)
         $('.venue .value', $obj).html(common.search({q:options.data.venue}, 'office', 'место'));

   }

   this.toggleMode = function()
   {
      options.edit = !options.edit;

      if(options.edit)
      {
         if(options && options.data.id)
            set_id(options.data.id);
         else if($obj.find('input[name=job_id]').length)
            set_id($obj.find('input[name=job_id]').val());

         var city_id = function(){return $city.parent().find('input.job_city_id').val();};
         var venue_id = function(){
            return $venue.parent().find('input.venue_id').val();
         };


         if(!$('.org_cont', $obj).parents('.org').length)
            $('.start_work_cont, .end_work_cont, .org_cont, .pos_cont', $obj).wrap_cont()

         $('.start_work_cont, .end_work_cont, .org_cont, .pos_cont', $obj)
            .find('input')
            .removeClass('hasDatepicker');

         $('.org_cont', $obj)
            .inputEx($.extend(true, {
                  empty:'Название компании',
                  param:{
                     city_id: city_id,
                     venue_id: venue_id
                  }
               }, options_job))
            .parent()
            .addClass('value');
         $('.pos_cont', $obj)
            .inputEx($.extend({empty:'Должность'}, options_job))
            .parent()
            .addClass('value');

         $('.start_work_cont', $obj).inputEx($.extend({empty:'рождения'}, options_job))
            .find('input')
            .datepickerEx()
            .parent()
            .addClass('value');

         $('.end_work_cont', $obj).inputEx($.extend({empty:'настоящее время'}, options_job))
            .find('input')
            .datepickerEx()
            .parent()
            .addClass('value');

         var $venue = $('.venue .value', $obj).inputEx($.extend({empty:'Адрес'}, options_job));

         var $org = $('#org', $obj);

         var $city = $('.job_city .value', $obj)
         .inputEx($.extend({empty:'Город'}, options_job))
         .addClass('value')
         .city(
         {
            url: '/u/emp/edit',
            param:
            {
               id:function()
               {
                  return id;
               },
               city_id:city_id,
               org_id:org_id
            },
            onSave:function(data)
            {
               if(data && data.id)
                  set_id(data.id);
               if(data && data.org_id)
                  org_id(data.org_id);
            }
         });

         var params = {
            extraParams:
            {
               city_id:city_id
            }
         };

         $org.office({
           city:$city,
           venue:$('#venue', $obj).setup_autocomplete('/loc/venues', params),
           param:params
         });

         $('#pos', $obj).setup_autocomplete('/u/emp/positions'); 

         if(options && options.data)
         {
            if($('#org', $obj).parent().length)
               $('#org', $obj).parent()[0].inputEx.setTitle(options.data.org);

            $('#org_id', $obj).val(options.data.org_id);
            if($('#pos', $obj).parent().length)
               $('#pos', $obj).parent()[0].inputEx.setTitle(options.data.pos);
            if($('#job_city', $obj).parent().length)
               $('#job_city', $obj).parent()[0].inputEx.setTitle(options.data.city);
            $('#job_city_id', $obj).val(options.data.city_id);
            if($('#start_work', $obj).parent().length)
               $('#start_work', $obj).parent()[0].inputEx.setTitle(options.data.start_date);
            if($('#end_work', $obj).parent().length)
               $('#end_work', $obj).parent()[0].inputEx.setTitle(options.data.end_date);
            $('#job_id', $obj).val(options.data.id);
            if($('#venue', $obj).parent().length)
               $('#venue', $obj).parent()[0].inputEx.setTitle(options.data.venue);

         }

         $obj.show();

         $obj.find('.double').show();

      }
      else
      {

         if($('#org', $obj).parent().length)
         {
            options.data.org = $('#org', $obj).parent()[0].inputEx.getTitle();
            options.data.org_id = $('#org', $obj).parent()[0].inputEx.getId();
            $('#org', $obj).parent()[0].inputEx.dispose();
         }

         if($('#pos', $obj).parent().length)
         {
            options.data.pos = $('#pos', $obj).parent()[0].inputEx.getTitle();
            $('#pos', $obj).parent()[0].inputEx.dispose();
         }

         if($('#job_city', $obj).parent().length)
         {
            options.data.city = $('#job_city', $obj).parent()[0].inputEx.getTitle();
            options.data.city_id = $('#job_city', $obj).parent()[0].inputEx.getId();
            $('#job_city', $obj).parent()[0].inputEx.dispose();
         }

         if($('#start_work', $obj).parent().length)
         {  
            options.data.start_date = $('#start_work', $obj).parent()[0].inputEx.getTitle();
            $('#start_work', $obj).parent()[0].inputEx.dispose();
         }
         if($('#end_work', $obj).parent().length)
         {
            options.data.end_date = $('#end_work', $obj).parent()[0].inputEx.getTitle();
            $('#end_work', $obj).parent()[0].inputEx.dispose();
         }
         options.data.id = $('#job_id', $obj).val();
         if($('#venue', $obj).parent().length)
         {  
            options.data.venue = $('#venue', $obj).parent()[0].inputEx.getTitle();
            $('#venue', $obj).parent()[0].inputEx.dispose();
         }

         $obj.removeClass('empty_all').find('.del_job').remove();

         if($('.empty', $obj).length == 12)
            $obj.hide().addClass('empty_all');

         if($obj.find('.double .empty').length > 1)
            $obj.find('.double').hide();
      }
   }

   if (options && options.edit)
   {
      options.edit = false;
      this.toggleMode();
   }

   return this;
}

jQuery.fn.job = function(options)
{

   return common.intrfc(this, job, options);

}})();
