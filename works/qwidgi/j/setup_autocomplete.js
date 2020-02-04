(function(){
jQuery.fn.setup_autocomplete = function(url, options, result)
{
   if(!this.length)
      return;

   var id = null;
   var $obj = this;

   var settings = $.extend({
      formatItem: function (row, i, num) {return row[0];},
      minChars: 3,
      width: 250,
      delay: 400,
      cacheLength: 100,
      scroll: false,
      maxItemsToShow: 10,
      extraParams: id ? {id:id} : {}
   }, options ? options : {});
   
   return this[0].autocomplete = $obj.autocomplete(url, settings).result(
      result ? result :
      function(event, data, formatted){

         if(data && data.length)
         {
            if( data[1] )
               id = data[1]
            $obj.parent().find('.val').text(data[0]);
         }

         if(
            $obj.parent().length &&
            $obj.parent()[0].inputEx &&
            settings &&
            (
               typeof(settings.auto_save) == 'undefined' ||
               !settings.auto_save
            ) )
            $obj.parent()[0].inputEx.save(true);

      }
   ); 
}})();
