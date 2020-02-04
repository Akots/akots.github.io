(function(){

function school($obj, options)
{
   options = options || {};
   options.data = options.data || {};

  var id = null;

  options.edit = typeof(options.edit) == 'boolean' ? options.edit : false;

  var set_id = function(val)
  {
    id = val;
    $('.educ_city .label input', $obj).val(val);

    var $del_school = $('.del_school', $obj);
    var param =
    {
      id:function(){return id;},
      trigger:options.suffix ? options.suffix : null
    };

    if($del_school.length <= 0 && options && options.edit)
     $del_school = $('h4', $obj).parent().prepend(
      '<a href="javascript:void(0);" class="del-info-item del_school delete" title="Удалить"></a>'
     )
     .find('.del_school')
     .click(
       function(){
        $.post(
          '/u/educ/del',
          common.param(param),
          function(data)
          {
            $obj.addClass('delete').hide();

            (new messg($obj)).action(function()
            {
              $obj.show().removeClass('delete');

              $.post(
                '/u/educ/del',
                $.extend({undo:true}, common.param(param)),
                function(){},
                'json'
              );
            });
            }
          );
        });

        if(options && options.onSetId)
          options.onSetId();
      }

    if(options && options.data && options.data.id)
      set_id(options.data.id);

    set_id($('.educ_city .label input', $obj).val());

    var onSave = function(data)
    {
      if(data && data.id)
        set_id(data.id);
    };

   var options_school = 
   {
      url: '/u/educ/edit',
      param:
      {
         id:function()
         {
            return id;
         },
         trigger:options.suffix ? options.suffix : null
      },
      onSave:onSave
   };

   if (options.data && !options.edit)
   {
      $('.school_cont', $obj).html(common.search({q:options.data.name}, 'people'));
      $('input[name=school_id]', $obj).val(options.data.id);
      $('.school_year_cont', $obj).html(common.search({q:options.data.year}, 'people'));
      $('.educ_city .value', $obj).html(common.search({q:options.data.city}, 'people'));
      $('.faculty .value', $obj).html(common.search({q:options.data.faculty}, 'people'));
      $('.sub-faculty .value', $obj).html(common.search({q:options.data.sub_faculty}, 'people'));
      $('.shape .value', $obj).html(common.search({q:options.data.shape}, 'people'));
      $('.status .value', $obj).html(common.search({q:options.data.status}, 'people'));
   }

   this.toggleMode = function()
   {
      options.edit = !options.edit;

      if(options && options.data && options.data.id)
         set_id(options.data.id);

      set_id($('.educ_city .label input', $obj).val());

      if(options && options.edit)
      {
         if(!$('.school_year_cont', $obj).parents('.school_year').length)
            $('.school_year_cont, .title .school_cont.value', $obj).wrap_cont()

         $(
            '.school_year_cont',
            $obj
         )
            .inputEx($.extend({maxlength:4,minlength:4,empty:'Выпуск'}, options_school))
            .numeric();

         $(
            '.school_cont',
            $obj
         )
            .inputEx($.extend({maxlength:4,minlength:4,empty:'Заведение'}, options_school));

         $('.educ_city .value', $obj)
            .inputEx($.extend({empty:'Город'}, options_school))
            .city(options_school);

         $(
            '.faculty .value',
            $obj
         ).inputEx($.extend({minlength:0,empty:'Факультет'}, options_school));

         $(
            '.sub-faculty .value',
            $obj
         ).inputEx($.extend({minlength:0,empty:'Кафедра'}, options_school));

         $('.faculty input', $obj).setup_autocomplete('/u/educ/faculties', {minChars: 0, matchContains: false});
         $('.sub-faculty input', $obj).setup_autocomplete('/u/educ/sub-faculty',
            {
               minChars: 0,
               matchContains: false,
               param:
               {
                  faculty:function(){return $('.faculty input', $obj).val();},
                  id:function()
                  {
                     return id;
                  }
               }
            }
         );

         $('.shape  .value', $obj).selectEx($.extend(
         {
            empty:'Форма обучения',
            list:'/u/educ/shape',
            url:'/u/educ/edit',
            val:options.data ? options.data.shape : null
         }, options_school));

         $('.status  .value' , $obj).selectEx($.extend(
         {
            empty:'Степень',
            list:'/u/educ/status',
            url:'/u/educ/edit',
            val:options.data ? options.data.status : null
         }, options_school));

         if(options.data)
         {
            id = options.data.id;

            var $school_name = $('#school', $obj);
            var $school_id = $('#school_id', $obj);
            var $year = $('#school_year', $obj);
            var $educ_city = $('#educ_city', $obj);
            var $educ_city_id = $('#educ_city_id', $obj);
            var $faculty = $('#faculty', $obj);
            var $faculty_id = $('#faculty_id', $obj);
            var $sub_faculty = $('#sub-faculty', $obj);
            var $shape = $('#shape', $obj);
            var $status = $('#status', $obj);

            if(options.data.name && $school_name.length && $school_name.parent()[0].inputEx)
               $school_name.parent()[0].inputEx.setTitle(options.data.name);   
            if(options.data.id)
               $school_id.val(options.data.id);
            if(options.data.year && $year.length && $year.parent()[0].inputEx)
               $year.parent()[0].inputEx.setTitle(options.data.year);
            if(options.data.city && $educ_city.length && $educ_city.parent()[0].inputEx)
               $educ_city.parent()[0].inputEx.setTitle(options.data.city);
            if(options.data.city_id)
               $educ_city_id.val(options.data.city_id);
            if(options.data.faculty && $faculty.length && $faculty.parent()[0].inputEx)
               $faculty.parent()[0].inputEx.setTitle(options.data.faculty);
            if(options.data.faculty_id)
               $faculty_id.val(options.data.faculty_id);
            if(options.data.sub_faculty && $sub_faculty.length && $sub_faculty.parent()[0].inputEx)
               $sub_faculty.parent()[0].inputEx.setTitle(options.data.sub_faculty);
            if(options.data.sub_faculty && $sub_faculty.length && $sub_faculty.parent()[0].inputEx)
               $sub_faculty.parent()[0].inputEx.setTitle(options.data.sub_faculty);
            if(options.data.shape && $shape.length && $shape.parent()[0].inputEx)
               $shape.parent()[0].inputEx.setTitle(options.data.shape);
            if(options.data.status && $status.length && $status.parent()[0].inputEx)
               $status.parent()[0].inputEx.setTitle(options.data.status);
         }

         $obj.show();
      }
      else
      {
         $obj.find('.del_school').remove();

         var $school_name = $('#school', $obj);
         var $school_id = $('#school_id', $obj);
         var $year = $('#school_year', $obj);
         var $educ_city = $('#educ_city', $obj);
         var $educ_city_id = $('#educ_city_id', $obj);
         var $faculty = $('#faculty', $obj);
         var $faculty_id = $('#faculty_id', $obj);
         var $sub_faculty = $('#sub-faculty', $obj);
         var $shape = $('#shape', $obj);
         var $status = $('#status', $obj);

         if ($school_id.length)
            options.data.id = $school_id.val();

         if($school_name.length && $school_name.parent()[0].inputEx)
         {
            options.data.name = $school_name.parent()[0].inputEx.getTitle();
            $school_name.parent()[0].inputEx.dispose();   
         }

         if($year.length && $year.parent()[0].inputEx)
         {
            options.data.year = $year.parent()[0].inputEx.getTitle();
            $year.parent()[0].inputEx.dispose()
         }

         if($educ_city.length && $educ_city.parent()[0].inputEx)
         {
            options.data.city = $educ_city.parent()[0].inputEx.getTitle();
            options.data.city_id = $educ_city_id.val();
            $educ_city.parent()[0].inputEx.dispose();
         }

         if($faculty.length && $faculty.parent()[0].inputEx)
         {
            options.data.faculty = $faculty.parent()[0].inputEx.getTitle(options.data.faculty);
            options.data.faculty_id = $faculty_id.val();
            $faculty.parent()[0].inputEx.dispose();
         }

         if($sub_faculty.length && $sub_faculty.parent()[0].inputEx)
         {
            options.data.sub_faculty = $sub_faculty.parent()[0].inputEx.getTitle();
            $sub_faculty.parent()[0].inputEx.dispose();
         }

         $obj.removeClass('empty_all');

         if($('.empty', $obj).length >= ($status.length && $status.parent().length && $status.parent()[0].selectEx ? 10 : 6))
            $obj.addClass('empty_all').hide();

         if($shape.length && $shape.parent()[0].selectEx)
         {
            options.data.shape = $shape.parent()[0].selectEx.getTitle();
            $shape.parent()[0].selectEx.dispose();
         }

         if($status.length && $status.parent()[0].selectEx)
         {
            options.data.status = $status.parent()[0].selectEx.setTitle();
            $status.parent()[0].selectEx.dispose();
         }

      }
   }

   if (options.edit)
   {
      options.edit = false;
      this.toggleMode();
   }

   return this;
}

$.fn.school = function(options)
{
   return common.intrfc(this, school, options);
}})();
