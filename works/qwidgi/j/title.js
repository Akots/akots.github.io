var title = {
   $cont:null,
   init:function()
   {
      title.$cont = $('#top-bg');

      return title.$cont;
   },
   empty:function()
   {
      if(title.$cont != null)
         title.$cont.empty();

      common.log('title.empty()');
   },
   set:function(val)
   {
      if(
         val && val.length &&
         (
            (
               title.$cont &&
               title.$cont.length
            ) ||
            (
               !title.$cont && title.init()
            )
         )
      )
      {
         var h1 = title.$cont.find('h1');

         if(!h1.length)
            h1 = title.$cont.prepend('<H1></H1>').find('H1');

         document.title = 'Qwidgi - ' + val.replace(/<[^>]*>/ig, '');

         common.log('title.set(' + val + ')');

         return h1.html(val);
      }
      return false;
   },
   append:function(val)
   {
      if(title.$cont == null)
         title.init();

      return title.$cont.append(val);
   }

};
