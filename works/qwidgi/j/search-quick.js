(function(){
jQuery.fn.search_quick = function(options)
{
   var me = this;

   var $inp =
      me.find('#quick-search')
      .focus(function(){
         if($inp.val()=='Поиск')
            $inp.val('');
      })
      .blur(function(){
         if(!$inp.val().length)
            $inp.val('Поиск');
      });
   
   me.find('.form-search').validate(
   {
      errorElement: 'div',
      focusCleanup: true,
      rules: {
         search_field: { required: true, minlength: 3 }
      },
      messages: {
         search_field: {
            required: 'Необходимо ввести строку запроса',
            minlength: 'Введите минимум 3 символа'
         }
      },
      submitHandler: function(form)
      {
      	location = '#search?q=' + encodeURIComponent($inp.val());
      }
   });
}
})();
