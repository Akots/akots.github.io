(function(){
jQuery.fn.datepickerEx = function()
{

   var init = function($obj)
   {
      $obj.datepicker(
      {
         onSelect: function(dateText)
         {
            $obj.parent().find('.val').text(dateText);

            if($obj.parent().length && $obj.parent()[0].inputEx)
               $obj.parent()[0].inputEx.save();
         }
      });
   }



   return $(this.length ? this : [this]).each(function(i, o){
      init($(o));
   });
}})();
