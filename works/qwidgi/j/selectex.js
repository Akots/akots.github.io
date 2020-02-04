(function(){

function selectEx($obj, settings){

  if(!$obj || !$obj.length)
    return;

   var name = $obj.parent().length ? $obj.parent()[0].className.split(' ')[0] : '';
   var $val = $obj.parent().find('.val');
   var $select = $obj.find('#' + name);
   
   settings = settings || {};
   settings.path = settings.path || 'people';

   var activate = function()
   {
      $select.show();
      $val.hide();
      $select.focus();
   }

   var $label = $obj.parent()
      .find('.label')
      .click(activate);

   $obj.click(activate);

   var undo_val = {}, val = undo_val.title = typeof(settings.val) == 'undefined' ? common.tagging($obj.html()) : settings.val;

   var is_empty = function()
   {
      var selected = $select.selectedValues();

      return !(selected.length && selected[0]['text'].length);

   }

   function start_title()
   {
      return undo_val.title = $obj.find('a').length ? $obj.find('a').text() : $val.text();
   }

   var value = function(v)
   {
      v = v || start_title();
      var val = false;
      for(var a = 0; a< $select[0].options.length; a++)
         if($select[0].options[a].text == v)
            val = $select[0].options[a].value;

      if(val)
         undo_val.id = val;

      return val;
   }

   var title = function(def)
   {
      var selected = $select.selectedValues();

      var t = (
         value(selected.length ? selected[0].text : false) ?
            (
               selected.length ?
               (
                  selected[0]['text'].length ? selected[0]['text'] :
                  (
                     typeof(def) != 'undefined' ? def : settings.empty
                  )
               ) :
               (
                  typeof(def) != 'undefined' ? def :
                  settings.empty
               )
            ) :
            settings.empty
         );

      $val.text(t);

      return t;
   }

   $val
     .focus(activate)
     .click(activate);


   this.getTitle = function()
   {
      return !is_empty() ? title(start_title()) : '';
   }

   this.setTitle = function(val)
   {
      if(!$select.length)
         return;

      var id = value(val);

      if(id)
      {
         $select.selectOptions(id);
         title(val);
      }
   }

   var blur = function()
   {
      title();
      $select.hide();
      $val.show();
   }

   this.dispose = function()
   {
      var t = title();
      $obj.html
      (
         settings.search ?
         settings.search(t, name) :
         '<a href="/search' + (settings.path ? '/' + settings.path : 'people') + '?q=' +
         escape(t) +
         '">' +
         common.htmlspecialchars(t) +
         '</a>'
      );

      if(t == settings.empty)
         $obj.parent().addClass('empty');
   }

   var save = function(is_mess)
   {
      blur();

      is_mess = typeof(is_mess) == 'undefined' ? true : is_mess;

      settings.param = settings.param ? settings.param : {};

      settings.param[$select.attr('name') + '_id'] = $select.val();
      settings.param[$select.attr('name')] = $val.text();

      var m = false;
      if(is_mess)
      {
         m = new messg($obj.parent().parent());
         m.send_data_begin();
      }

      $obj.addClass('changed').parent().addClass('changed');

      $.post(
         settings && typeof( settings.url ) != 'undefined' ? settings.url : '/u/edit',
         common.param(settings.param),
         function(data){

            if(settings && settings.onSave)
               settings.onSave(data, settings.param);

            var ms =  null;
            var saccess = (!data.sc || data.sc == 'false');

            if(is_mess && saccess && data.mg && data.mg.length)
              ms = data.mg;

            if(is_mess)
               m.action
               (
                 function()
                 {
                   title(undo_val.title);
                   $select.selectOptions(undo_val.id);
                   save(false)
                   m.hide();
                 },
                 null,
                 ms
              );
         }
         , 'json'
      );

   };

   if(!$select.length)
      $select = $('<select id="' + name + '" name="' + name + '"></select>').appendTo($obj).hide();

   $select
      .ajaxAddOption(
         settings && settings.list ? settings.list : '/u/sexs',
         settings && settings.param ? common.param(settings.param) : {},
         null,
         function(el, list, args)
         {
            var val = value(start_title());

            if(val)
               $select.selectOptions(val);

            if(!$val.length)
               $val = $('<span class="val" tabindex="1">' + common.htmlspecialchars(val ? title(start_title()) : settings.empty) + '</span>').appendTo($obj);
            else
               $val.find('.val').attr('tabindex', '1');

            $select
               .parent()
               .parent()
               .addClass(is_empty() ? 'empty' : '')
               .removeClass(!is_empty() ? 'empty' : '');

            $obj.find('a').remove();
         }
      )
      .hide()
      .blur(blur)
      .change(save);

   return this;
}

jQuery.fn.selectEx = function(options)
{
   return common.init
   (
      this,
      function(o, settings)
      {
         if(o.length)
            o[0].selectEx = new selectEx(o, settings);
      },
      $.extend({empty : 'пусто'}, options)
   );
}})();
