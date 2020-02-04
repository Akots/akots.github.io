(function(){

function inputEx($obj, options)
{

   if(!$obj.length)
      return $obj;

   options = options || {};
   options.path = options.path || 'people';

   var suffix = '_id';
   var me = this;
   var parent = $obj.length ? $obj[0] : null;
   var $label = $obj.parent().find('.label');
   var old_val = {title:(options.text ? options.text : null),id:null}, undo_val = $.extend({}, old_val);
   var tagName = 'input';
   var name = $obj.parent().length && $obj.parent()[0].className.split(' ').length ? $obj.parent()[0].className.split(' ')[0] : '';



   var is_empty = function()
   {
      return !$.trim(title()).length;
   }

   var title = function(){
      return options && options.title ? options.title(get_val()) : $.trim(get_val());
   }

   var set_val = function(val, is_init)
   {
      undo_val.title = old_val.title = val;
      is_init = typeof is_init == 'boolean' ? is_init : false;
      val = is_init ? common.htmlspecialchars_decode(val) : val;
      $obj.val(tagName != 'textarea' ? val : common.tagging(val));
   }

   var get_val = function()
   {
      return $obj.val();
   }

   if(
      $obj.length > 0 &&
      (
         $obj[0].nodeName != 'INPUT' ||
         $obj[0].nodeName != 'SELECT' ||
         $obj[0].nodeName != 'TEXTAREA'
      )
   )
   {
      tagName =
         $.inArray('textarea', $obj[0].className.split(' ')) > -1 ?
            'textarea' :
            'input';

    if (
       !$obj.parent().find('#' + name).length
    )
    {
       if( $label.length && !$label.find('label[for=' + name + ']').length )
          $label = $label.html('<label' + ($obj.parent()[0].className.length ? ' for="' + name + '"' : '') + '>' + $label.html() + '</label>').find('label');

       if( typeof($obj[0].is_empty) != 'boolean' || !$obj[0].is_empty )
          undo_val.title = old_val.title = tagName != 'textarea' ? $.trim($obj.text()) : common.tagging($obj.html());
       else
          undo_val.title = old_val.title = '';

       $obj = $obj
          .html('<' + tagName + ' id="' + name + '" name="' + name + '" style="display:none;" />')
          .parent()
          .find(tagName + '#' + name);

       set_val(old_val.title, true);
    }
    else
    {
       $label = $obj.parent().find('label');
       $obj = $obj.find(tagName + '#' + name);

       if(options && options.text)
          set_val(old_val.title);
       else
          undo_val.title = old_val.title = get_val();

       old_val.id = undo_val.id = $obj.parent().find('.' + $obj.attr('name') + suffix).val();
    }
  }

   var convert = function(text, is_init)
   {
      //is_init = typeof is_init == 'boolean' ? is_init : false;
      //text = is_init ? text : common.htmlspecialchars(text);
      if(tagName != 'textarea')
         return text;

      return common.xtagging(text);
   }

   var set_title = function(is_init)
   {
      return $obj
         .parent()
         .addClass(is_empty() ? 'empty' : '')
         .removeClass(!is_empty() ? 'empty' : '')
         .parent()
         .addClass(is_empty() ? 'empty' : '')
         .removeClass(!is_empty() ? 'empty' : '')
         .find('.val')
         .html(
            options.title ? is_empty() ? options.empty : title() : convert(is_empty() ? options.empty : title(), is_init)
         );
   }

   this.setTitle = function(val)
   {
      set_val(val);

      set_title();
   }

   this.getTitle = function()
   {
      var tmp = title();
      return tmp && typeof(tmp) != 'undefined' ? tmp : '';
   }

   this.getId = function()
   {
      return $.trim($obj.parent().find('.' + $obj.attr('name') + suffix).val());
   }

   this.dispose = function()
   {
      var val = get_val();
      val = val && typeof(val) != 'undefined' ? val : '';
      var id = me.getId();

      $obj.parent()[0].is_empty = is_empty();

      $obj.parent()
      .addClass(is_empty() ? 'empty' : '')
      .removeClass(!is_empty() ? 'empty' : '')
      .parent()
      .addClass(is_empty() ? 'empty' : '')
      .removeClass(!is_empty() ? 'empty' : '');

      if(tagName != 'textarea')
         $obj.parent().html(
            !is_empty() ?
               (
               options.search ?
                  options.search(val, name) :
                  '<a href="#search' + (options.path ? '/' + options.path : 'people') + '?q=' +  escape(val) + '">' + val + '</a>'
               ) +
               (
                  id ?
                  '<input name="' + $obj.attr('name') + suffix + '" value="' + id + '" type="hidden">' :
                  ''
               ) :
               options.empty
            );
      else
         $obj.parent().html(convert(val, true));
   }

   var set_id = function(val)
   {
     $obj.parent().find('.' + $obj.attr('name') + suffix).val(val);

     old_val = {title:get_val(),id:val};
     undo_val = {title:get_val(),id:val};
   }

   this.setId = function(val)
   {
      set_id(val);
   }

   this.setValue = function(id, title, is_send)
   {
      is_send = typeof is_send == 'boolean' ? is_send : true;

      set_val(title);

      set_title();

      set_id(id);

      if(is_send)
         me.save(true, false);
   }

   this.timer = null;
   var needed = false;

   this.save = function(need, is_mess)
   {
      needed = need || needed;

      function go(need)
      {
         need = typeof need == 'boolean' ? need : false;
         is_mess = typeof(is_mess) == 'undefined' ? true : is_mess;

         if (!$obj.valid || $obj.valid())
         {
            $obj.hide();

            if (options.inp_disptype)
               set_title().css('display', options.inp_disptype);
            else
               set_title().show();
         }

         if(options && (typeof(options.auto_save) != 'undefined' && !options.auto_save))
            return;

         if ((get_val() != old_val.title || need) && ( !$obj[0].form || $obj[0].form && $obj.valid()))
         {
            $obj.parent().addClass('changed').parent().addClass('changed');

            old_val.title = get_val();

            var param = {};

            param[$obj.attr('name')] = get_val();
            if($obj.parent().find('.' + $obj.attr('name') + suffix).length)
              old_val.id = param[$obj.attr('name') + suffix] = $.trim($obj.parent().find('.' + $obj.attr('name') + suffix).val());

            var m = false;
            if(is_mess)
            {
               m = new messg($obj.parent().parent());
               m.send_data_begin();
            }

            needed = false;

            $.post(
               options && typeof( options.url ) != 'undefined' ? options.url : '/u/edit',
               common.param($.extend(param, options.param)),
               function(data)
               {

                  var ms =  null;
                  var saccess = typeof(data.sc) == 'boolean' ? data.sc :  data.sc == 'true';

                  if(is_mess && saccess && data.mg && data.mg.length)
                     ms = data.mg;

                  if(options && options.onSave)
                     options.onSave(data, param);

                  var set_undo = function()
                  {
                     undo_val = $.extend({}, old_val);
                  }

                  if(m && undo_val.title && undo_val.title.length)
                     m.action(
                        function()
                        {
                           set_val(undo_val.title);
                           set_title(undo_val.title);
                           $obj.parent().find('.' + $obj.attr('name') + suffix).val(undo_val.id);
                           old_val = $.extend({}, undo_val);
                           m.hide();
                           me.save(true, false);
                        },
                        saccess ? set_undo : null,
                        ms
                     );
                  else if(m && (!undo_val.title || !undo_val.title.length))
                     m.action(false, saccess ? set_undo : null, ms);
               },
               'json'
            );
         }
      }

      common.log('inputEx.Save[' + $obj[0].tagName + ']: ' + (typeof($obj[0].autocomplete) == 'object' ? 'autocomplete' : 'no autocomplete') + (get_val() != old_val.title ? ', changed' : ', not changed') + (need ? ', need send' : ', not need'));
      if(typeof($obj[0].autocomplete) == 'object')
      {
         clearTimeout(me.timer);
         me.timer = setTimeout(function(){go(needed || need || get_val() != old_val.title)}, 300);
      }
      else
         go(need);
   };

   var action = function()
   {
      common.log('action');

      if(tagName == 'textarea')
         $obj.autogrow();
 
      $obj
         .css( 'width', $obj.prev().width() <= 70 ? 70 : $obj.prev().width() + 1 + 'px')
         .show() 
         .focus()
         .select()
         .prev()
         .hide();
   }

   $obj
      .blur(function()
      {
         if(tagName == 'textarea')
         {
            var height = $obj.height();
            $obj.prev().height(height);
         }

         me.save(false);
      })
     .keyup(
        function(e)
        {
           if (e.keyCode == 13 && tagName != 'textarea')
              me.save(false);
        });

   $obj.hide();

   if (
      !$obj.parent().find('.val').length
   )
      $obj.before('<div class="val" tabindex="1"></div>');
   else
      $obj.parent().find('.val').attr('tabindex', '1');

   set_title(false);

   $obj
      .parent()
      .parent()
      .addClass(is_empty() ? 'empty' : '' )
      .removeClass(!is_empty() ? 'empty' : '' )
      .find('.val')
      .dblclick(action)
      .focus(action);

   if($.browser.safari)
      $obj
         .parent()
         .parent()
         .click(action);

   $label.click(action);

   return this;
}

jQuery.fn.wrap_cont = function()
{

   return common.init(this, function(o){
      o = o.length ? o[0] : o;

      var name = o.className && o.className.split(' ').length ? o.className.split(' ')[0] : '';

      if(o && name.length && !$(o).parent().hasClass(name))
        $(o).wrap('<span class="' + name.replace(/\_cont$/i, '') + '"></span>');
  });
}

jQuery.fn.inputEx = function(options)
{
   return common.init
   (
      this,
      function(o, settings)
      {
         if(o.length)
            o[0].inputEx = new inputEx($(o), settings);
      },
      $.extend({empty : 'пусто'}, options)
   );

}})();
