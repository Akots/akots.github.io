(function(){
﻿$.fn.office = function(options)
{

   if (!this.length)
     return this;

   options = options ? $.extend({}, options) : {};
   if(options.html)
     $obj = this
        .empty()
        .html(options.html);

   var init = function($obj, options)
   {
      var $org_id = $obj.parent().find('#org_id');
      var $venue_id = options.venue ? options.venue.parent().find('#venue_id') : [];

      if(!$org_id.length)
         $org_id = $obj.after('<input name="org_id" id="org_id" type="hidden" />').next();

    if(!$venue_id.length)
      $venue_id = options.venue ? options.venue.after('<input name="venue_id" id="venue_id" class="venue_id" type="hidden" />').next() : [];

     $obj.setup_autocomplete(
      '/office/list',
      $.extend(
        {
          formatItem: function (row, i, num)
          {
            if(options.select)
               options.select(row);

            return row[0] + '<em class="ac_region">' + row[5] + '</em><em class="ac_country">' + row[1] + ', ' + row[3] + '</em>';
          }
        },
        options && options.param ? options.param: {}
      ),
      function(event, data, formatted)
      {
         $org_id.val(data[4]);

         if($obj.parent()[0].inputEx)
            $obj.parent()[0].inputEx.setTitle(data[0]);

         if(options && options.city && options.city.length && options.city.parent().length && options.city[0].inputEx)
            options.city[0].inputEx.setValue(data[6], data[1], false);
         else if(options && options.city && options.city.length)
         {
            options.city.find('input[name=city]').val(data[1]);
            $('input[name=city_id]', options.city).val(data[6]);
         }

         if(options && options.venue  && options.venue.length && options.venue.parent().length && options.venue.parent()[0].inputEx)
            options.venue.parent()[0].inputEx.setValue(data[7], data[5], false);
         else if(options && options.venue  && options.venue.length)
         {
            options.venue.find('input[name=venue]').val(data[5]);
            $('input[name=venue_id]', options.venue).val(data[7]);
         }

         if($obj.parent()[0].inputEx)
            $obj.parent()[0].inputEx.setValue(data[4], data[0]);
      }
    );

    var $org_id = $obj.parent().find('#org_id');
    
    if(!$org_id.length)
      $org_id = $obj.after('<input name="org_id" id="org_id" type="hidden" />').next();
  }

  return common.init(this, init, options);
}
})();
