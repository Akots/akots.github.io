(function(){

function filter(expression, $dragable, $dropable)
{
   return $dragable.is(expression) && !($('#head .icon').length >= 6 && $dragable.is('.block') && $dropable.is('.drop,.dock'));
}

$.fn.dragDrop = function(className)
{
   var onlick = [];

   return $(this).find('.' + (className ? className : 'block'))
      .draggable(
      {
         helper: 'clone',
         appendTo: document.body,
         afterStart:function(h, e)
         {
            var f = function(){return false;};
            for(var i =0; i< arguments.length; i++)
               if(arguments[i] && arguments[i].find('a').length)
               {
                  onlick[i] = arguments[i].find('a')[0].onclick;
                  arguments[i].find('a')[0].onclick = f;
               }

            e.hide();
         },
         afterStop:function(h, e, d)
         {
            var f = function(){return true;};

            for(var i =0; i< arguments.length && i<2; i++)
               if(arguments[i] && arguments[i].find('a').length)
                  arguments[i].find('a')[0].onclick = onlick[i] || f;

            e.show();
         }
      })
      .droppable(
      {
         accept: function($o){return filter('.block,.drop', $o, this)},
         activeClass: 'droppable-active',
         hoverClass: 'droppable-hover',
         drop: function(ev, ui)
         {
            if(ui.draggable != this )
            {
               $(this).after(ui.draggable);

               if($(this).is('.block'))
                  ui.draggable
                     .removeClass('drop')
                     .addClass('block')
               else
                  ui.draggable
                     .removeClass('block')
                     .addClass('drop');

               layout.sendState();
            }
         }
      });
}

var isInit = false;


function dashboard($obj, options)
{
   var dashboard = this;

   this.init = function()
   {
      $('#body').addClass('index-page');

      title.set('Dashboard');

      title.empty();
   }

   this.clear = function()
   {
      $('#body').removeClass('index-page');
   }


   this.init(options);

   this.create = function($obj, options)
   {
      isInit = true;

      $obj.dragDrop('block');

      $obj
         .droppable(
         {
            accept: function($o){return filter('.drop', $o, this)},
            activeClass: 'droppable-active',
            hoverClass: 'droppable-hover',
            drop: function(ev, ui)
            {
               $obj.append(ui.draggable.addClass('block').removeClass('drop'));

               layout.sendState();
            }
         });

      $('#head .dock').droppable(
      {
         accept: function($o){return filter('.block,', $o, this)},
         activeClass: 'droppable-active',
         hoverClass: 'droppable-hover',
         drop: function(ev, ui)
         {
            $(this).append(ui.draggable.addClass('drop').removeClass('block'));

            layout.sendState();
         }
      });
   }

   if(isInit)
      return this;

   $.post(
      options.url ? options.url : '/interface/widjet',
      options.param ? options.param : {},
      function(data)
      {
         if(data.length || common.auth())
         {
            $(data).each(function(i, o)
            {
               $obj.append(icon.init(o, 'block'));
            });

            dashboard.create($obj, options);
         }
         else if( !common.auth() )
            $obj.demo(options)

         if(options.load)
            options.load();
      },
      'json'
   );

   return this;

}

$.fn.dashboard = function(options)
{
   return common.intrfc(this, dashboard, options);
}})();
