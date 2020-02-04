var icon = 
{
   html:function(data, className)
   {
      var isIcon = function()
      {
         return ((/^\/i\/widget\/[^\.]*\.png$/).test(﻿﻿data.ico));
      }

      var urlIco = data.ico;

      if ((common.ie55 || common.ie6) && urlIco)
         urlIco = urlIco.replace('/widget/','/widget/ie/');


      var ht = 160;

      var $r= $('<div class="png-fix ' + (!data.fixed ? className : 'fixed') + ' icon' + ( isIcon() ? ' is-icon' : '' ) + '" id="' + data.name + '">' +
         '<a class="link" href="' + (data.url ? '#' + data.url : 'javascript:void(0)') + '">' +
            (
               isIcon() ?
                  '<div class="orig-image" style="background-image: url(' + urlIco + ');"></div>'
               :
                  (
                     !data.type || data.type != 'list' ?
                     '<img src="' + urlIco + '" alt="' + common.htmlspecialchars(data.title) + '" />' :
                     '<div style="background-image:url(' + urlIco + ');' + (className == 'fixed' || className == 'drop' ? 'background-position: -' + ht + 'px 0px' : '') + '" class="list"></div>'
                  ) +
                  '<div class="img png-fix"></div>'
            ) +
            '<span class="title">' + common.htmlspecialchars(data.title) + '</span>' +
            (
               Number(data.count) > 0 ?
                  '<span class="png-fix count c' + Number(data.count) + '" style="background-position:' +
                  (
                     Number(data.count) <= 199 ?
                     '-' + 39*(data.count%10) + 'px'
                     :
                     0
                  ) +
                  ' ' +
                  (
                     Number(data.count) <= 199 ?
                     '-' + 30*Math.floor(data.count/10) + 'px'
                     :
                     0
                  ) +
                  ';">' + data.count + '</span>'
               :
               ''
            ) +
      '</a></div>')
      .data('wid', data.id);

      if(data.type && data.type == 'list' && data.num)
         $r
            .find('.img')
            .mousemove(function(e)
               {
                  var l = 15,
                     $this = $(this),
                     dx = e.pageX - $this.offset().left -l;

                  if(dx < 0)  return;

                  var 
                     wl = $(this).width() - l,
                     wt = ht/(Number(data.num)),
                     n = Math.ceil((dx)/wt),
                     h = Math.ceil((n*ht));

                  $r.find('.list')
                     .css('background-position', ($this.parents('.drop').length ? '-' + ht : '0') + 'px -' + h + 'px');

                  if(data.list && data.list.length && data.list.length > n)
                  {
                     $r.find('.title')
                        .text(data.list[n].name);

                     $r.find('.link')
                        .attr('href', '#' + data.url + '/' + data.list[n].id);
                  }
               })
            .mouseout(function()
            {
               $r.find('.title').text(data.title);
            });

      return $r;
   },
   init:function(data, className)
   {
      var $w = icon.html(data, className);

      var p = path.parse(data.url);

      icon.lancher(
         $w,
         $.extend(
         {
            url:data.cont,
            name:p && p.name ? p.name : data.name,
            icon:data
         }, p.options)
      ).click(
         function()
         {
            $('#dashboard_view .icon.select, #head .icon.select')
               .removeClass('select');

            $(this).addClass('select');
         }
      );

      return $w;
   },
   run: function(o, options, callback)
   {
      options = options || {};
      options.url = options.url || o.url || false;

      callback = callback || function()
      {
         layout.add(
            o.name || options.name,
            $.extend({html:o && o.html ? o.html : ''}, options, o)
         );
      }

      if( (o && o.html && o.html.length) || !options.url.length )
         callback(o.html);
      else if( options.url.length )
         layout.intfse.load(
         {
            url:options.url,
            verify:function(){return o.html.length;},
            next:function(){callback(o.html)},
            callback:function(data){return common.cache[options.url] = o.html = data;}
         });
   },
   lancher:function($obj, options)
   {
      options = options || {};
      options.url = options.url || '';
      options.html = options.html || common.cache[options.url] ||  '';

      if(!$obj || !$obj.length)
         return common.log('icon [' + options.url + '] h\'t interface');

      if( options.url.length && !options.html.length)
         layout.intfse.load(
         {
            url:options.url,
            verify:function(){return options.html.length;},
            callback:function(data){return common.cache[options.url]=options.html=data;}
         });

      var $link = $obj.find('a');

      if(!options.icon.url.length)
         $link.click(function(){
            icon.run($.extend({html:options.html,url:options.icon.cont}, options.icon), options)
         });

      return $obj;
   }
}

var layout = {
   list:[],
   sendState:function()
   {
      var param =
      {
         'body[]':[],
         'dock[]':[]
      };

      $('#body .block').each(function(i, o){
         param['body[]'][param['body[]'].length] = $(o).data('wid');
      });

      $('#head .drop').each(function(i, o){
         param['dock[]'][param['dock[]'].length] = $(o).data('wid');
      });

      $.post(
         '/interface/state',
         param,
         function(data)
         {
            
         },
         'json'
      )
   },
   create:function(options)
   {
      options = options || {};

      $.get(
         options.docks || '/interface/docks',
         options.param || {},
         function(data)
         {
            $(data).each(function(i, o)
            {
               $('#head .dock')
                  .append(icon.init(o, 'drop'));

            });

            $('#head .dock').dragDrop('drop');

            if(options.load)
               options.load();

         },
         'json'
      );
   },
   current:null,
   before:null,
   back:function()
   {
      if(layout.current && layout.before)
      {
         layout.clearArea();

         layout.current.hide();

         if(layout.current && layout.current[0].intrfc && layout.current[0].intrfc.clear)
            layout.current[0].intrfc.clear();

         if(layout.before && layout.before[0].intrfc && layout.before[0].intrfc.init)
            layout.before[0].intrfc.init();

         var t = layout.current;
         layout.current = layout.before;
         layout.before = t;

         layout.current.show();
      }
   },
   name:function(name){return name + '_view';},
   init:function(lyt, options)
   {
      try
      {
         if(typeof(lyt) != 'object' || typeof(lyt.obj) != 'object' || !lyt.obj.length) return;

         if(typeof(lyt.obj[0]) == 'object' && typeof(lyt.obj[0].intrfc) == 'object' && $.isFunction(lyt.obj[0].intrfc.init))
            lyt.obj[0].intrfc.init( options || lyt.options );
      }catch(e){
         common.log(e);
      }
   },
   clear:function(lyt, options)
   {
      try
      {
         if(typeof(lyt) != 'object' || typeof(lyt.obj) != 'object' || !lyt.obj.length) return;

         options = lyt.options || options;

         if(typeof(lyt.obj[0]) == 'object' && typeof(lyt.obj[0].intrfc) == 'object' && $.isFunction(lyt.obj[0].intrfc.clear))
            lyt.obj[0].intrfc.clear(options);
      }catch(e){
         common.log(e);
      }
   },
   clearArea:function()
   {
      layout.clear(layout.list['auth']);
      $('.imgAreaSelect').remove();
      $('#body').removeClass('index-page');
      $('#splash').hide();
   },
   needReset:function(layer, new_options, old_options)
   {
      return (
            (
               layer.intrfc &&
               layer.intrfc.needReset &&
               layer.intrfc.needReset(new_options)
            ) ||
            (
               !(
                  layer.intrfc &&
                  layer.intrfc.needReset
               ) &&
               common.equal(new_options, old_options)
            )
         );
   },
   add:function(name, options)
   {
      if(layout.current && layout.name(name) != layout.current.get(0).id)
         layout.before = layout.current;

      layout.list[name] = layout.list[name] || {};

      layout.clearArea();

      var nm_show = false;

      for(var nm in layout.list)
      {
         if(
            nm == name &&
            layout.list[nm] &&
            layout.list[nm].obj &&
            layout.list[nm].obj.length &&
            layout.needReset(layout.list[nm].obj[0], options, layout.list[nm].options)
         )
            nm_show = nm;
         else if(layout.list[nm].obj)
         {
            layout.list[nm].obj.hide();
            layout.clear(layout.list[nm]);
         }

      }

      if(nm_show)
      {
         layout.current = layout.list[nm_show].obj.show();
         layout.init(layout.list[nm_show], options);
      }
      else
      {
         var $l = $('#body #' + layout.name(name)); 
         if(!$l.length)
            $l = $('#body')
               .append('<div id="' + layout.name(name) + '" class="layout"></div>')
               .find('#' + layout.name(name));

         if(typeof($l) != 'undefined' && $l.length)
         {
            //layout.init(layout.list[name], options);

            try
            {
               layout.current = layout.list[name].obj = (
                  typeof($l[name]) != 'undefined' ?
                  $l[name](options) :
                  $l
               ).show()
               .data('name', name);
            }
            catch(e)
            {
               common.log(e);
            }
            message.alertsInit(options);

         }

         layout.list[name].options = $.extend({}, options);

      }

      return layout.current;
   },
   intfse:
   {
      load:function(options)
      {
         var end = 
            function(data)
            {
               if(options.callback && data)
                  options.callback(data);

               if(options.next)
                  options.next(data);
            };

         if(options.verify && options.verify())
         {
            end(options.html ? options.html : false);
            return;
         }

         $.get(
            options.url,
            {},
            end,
            'text'
         );
     }
   }
};
