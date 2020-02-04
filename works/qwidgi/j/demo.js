(function(){

var demo = function($obj, options)
{
   this.init = function()
   {
      title.set('Возможности');
      
      $('#body').addClass('index-page');

      title.empty();
   }

   this.clear = function()
   {
      $('#body').removeClass('index-page');

      title.empty();
   }

   this.init();

   $obj
      .html(options.html);

   $obj
      .addClass('demo_view')
      .find('a').each(function()
      {
         if(this.hash == '#auth')
         {
            if(common.auth())
            {
               $(this).parent().remove();
               return;
            }

            this.href = 'javascript:void(0);'
            this.onclick = function()
            {
               var url = '/interface/form/login';

               layout.intfse.load(
               {
                  url:options.url,
                  verify:function(){return common.cache[url] && common.cache[url].length;},
                  next:function()
                  {
                     layout.add(
                        'auth',
                        {html:common.cache[url]}
                     );
                  },
                  callback:function(data){return common.cache[url]=html=data;}
               });
            }
         }
      });

   $obj
      .find('.icon')
      .hover(
         function(){
            $(this).addClass('hover' + ($obj[0].clientHeight - ($(this).find('.description').offset().top - $obj.offset().top) - $(this).find('.description').height() - 50 < 0 ? ' bottom' : '') + ($obj[0].clientWidth - ($(this).find('.description').offset().left - $obj.offset().left) - $(this).find('.description').width() < 0 ? ' right' : ''));
         },
         function(){
            $(this).removeClass('hover right bottom')
         }
      );

   var $hints = $obj
      .find('.description')
      .removeClass('description')
      .popupHint();

   if($hints && $hints.length)
      $hints.addClass('description');

   return this;
}

$.fn.demo = function(options)
{
   options.url = options.url || '/interface/info/demo';
   options.html = options.html || common.cache[options.url] || '';

   var me = this;

   icon.run(
      {
         url:options.url,
         html:options.html
      },
      options,
      function(html)
      {
            common.cache[options.url] = options.html = html;

            common.intrfc(me, demo, options)
      }
   );

   return this;
}
})();
