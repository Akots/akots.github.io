(function(){

function workPlaces($places, options)
{
   //var edit = $places.is('.edit');
   var edit = options.edit;

   var job_options =
   {
      onSetId: function()
      {
         var is_exists_new_job = false;
         $places.find('.city .label input').each(
         function(i, o)
         {
            if($places.parent().parent().is('.pattern') >= -1)
               return;

            if(!is_exists_new_job)
               is_exists_new_job = Number(o.value) <= 0;
         });

         is_exists_new_job ?
            $places.parent().find('.add_job').hide() :
            $places.parent().find('.add_job').show();

      }
   };

   var new_job = function()
   { 
      var $new = $('.job.pattern', $places).clone(true);

      $new.find('.del_job').remove();

      $('div.val', $new).empty(); 
      $('input[name=job_id]', $new).val('');
      $('input', $new).val('');

      return $new.removeClass('pattern');
   };

   job_options.onSetId();

   var url = '/u/' + options.user_id + '/emp/list';

   var load = function(data)
      {
         common.cache[url] = data;

         $(data).each(function(i, o)
         {
            var $job = new_job();

            $('.job.pattern', $places).before($job);

            $job.job($.extend({id:o.id,edit:edit,data:o}, job_options)).show();

         });

         job_options.onSetId();

         if(options.end)
            options.end();
      }


   if(!common.cache[url])
      $.post(
         url,
         {},
         load,
         'json'
      );
   else
      load(common.cache[url]);

   this.toggleMode = function()
   {
      edit = !edit;

      if(edit && !$places.find('.add_job').length)
         var $add_job = $places
            .prepend('<a class="add_job ajax add-info-item" href="javascript:void(0);" title="Добавить место работы">Добавить работу</a>')
            .parent()
            .find('.add_job')
            .click(function()
               {

                  var $new = new_job();

                  $add_job.parent().append($new);

                  $new.job($.extend({id:null,edit:edit}, job_options)).show();

                  job_options.onSetId();

                  return false;
               }
            );
      else
         $places.find('.add_job').remove();

      $places.find('.job').each(function(i, o){
         if (o && o.intrfc && o.intrfc.toggleMode && !$(o).hasClass('pattern'))
            o.intrfc.toggleMode();
      });
   }

   return this;
}

jQuery.fn.work_places = function(options)
{
   return common.intrfc(this, workPlaces, options);
}

})();
