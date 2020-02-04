(function(){

function educLists($educ, options)
{
  if(!this || this.length <= 0)
    return;

  var edit = options.edit;

  var school_options =
  {
    onSetId: function(prefix)
    {
      var is_exists_new_school = false;

      $educ.find('.' + prefix + '.educ_city .label input').each(
      function(i, o)
      {
        if($educ.parent().parent().is('.pattern'))
          return;

        if(!is_exists_new_school)
          is_exists_new_school = Number(o.value) <= 0;
      });

      is_exists_new_school ?
        $educ.find('.' + (prefix == 'second' ? '' : prefix) + 'school .school .add_school').hide() :
        $educ.find('.' + (prefix == 'second' ? '' : prefix) + 'school .school .add_school').show();

    }
  };

   $('.pattern', $educ).hide();

   var new_school = function(suffix)
   {
      var suffix = suffix ? suffix : '';

      var $new = $('.' + suffix + 'school.pattern', $educ).clone(true);

      $new.find('.del_school').remove();

      $('.val', $new).empty(); 
      $('input[name=school_id]', $new).val('');
      $('input', $new).val('');

    return $new.removeClass('pattern');
  };

   school_options.onSetId();
   var url = '/u/' + options.user_id + '/educ/list';

   var load = function(data)
    {
      common.cache[url] = data;

      var add_data = function(data, $school, $pattern, suffix)
      {
        $pattern.before($school);

        $school.school($.extend({}, school_options, {data:data,edit:false,suffix:suffix && suffix == 'high' ? suffix : 'second'})).show();
      }

      $(data.highschools).each(function(i, o)
      {
        add_data(o, new_school('high'), $('.highschool.pattern', $educ), 'high');
      });

      $(data.schools).each(
      function(i, o)
      {
        add_data(o, new_school(), $('.school.pattern', $educ));
      });

      school_options.onSetId();

      if(options.end)
         options.end();
    };

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

      var $schools = $('.highschool', $educ);
      var $add_highschool = $schools.length ? $($schools[$schools.length-1]) : null;
      if(edit && $add_highschool != null && !$educ.find('.add_highschool').length)
         $add_highschool
         .parent().prepend('<a class="add_highschool ajax add-info-item" href="javascript:void(0);">Добавить ВУЗ</a>')
         .parent().find('.add_highschool')
         .click(function(){

               var $new = new_school('high');

               $add_highschool.before($new);

               $new.school($.extend({suffix:'high',edit:true}, school_options)).show();

               school_options.onSetId('high');

               return false;
            }
         );
      else
         $educ.find('.add_highschool').remove();

      var $schools = $('.school', $educ);
      var $add_school = $($schools[$schools.length-1]);
      if(edit && !$educ.find('.add_school').length)
         $add_school
         .parent().find('div.school:first').before('<a class="add_school ajax add-info-item" href="javascript:void(0);">Добавить школу</a>')
         .parent().find('.add_school')
         .click(function(){

               var $new = new_school();

               $add_school.before($new);

               $new.school($.extend({suffix:'second',edit:true}, school_options)).show();

               school_options.onSetId('second');

               return false;
            }
         );
      else
         $educ.find('.add_school').remove();

      $educ.find('.highschool, .school').each(function(i, o){
         if (o && o.intrfc && o.intrfc.toggleMode && !$(o).hasClass('pattern'))
            o.intrfc.toggleMode();
      });

   }

  return this;
}

jQuery.fn.educ_lists = function(options)
{
   return common.intrfc(this, educLists, options);
}

})();
