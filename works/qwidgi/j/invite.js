(function(){

﻿function invite($obj, options)
{
   if (!$obj.length)
     return this;

   this.init = function()
   {
      title.set('Пригласить знакомых');
   }

   this.init();

   options = options ? $.extend({}, options) : {};

   if (options.html)
      $obj = $obj
         .empty()
         .html(options.html);

   var setSource = function(t)
   {
      $obj.find('div.invite').each(function(i, o){
         var e = $(o);
         e.hasClass(t) ? e.show() : e.hide();
      });
   };

   var source = options.source || 'handmade';

   switch (source)
   {
      case 'vkontakte':
         setSource('outer-network');
         $('.invite.outer-network').inviteOuter({
            typeID:     5,
            title:      'ВКонтакте.ru',
            name:       'www.vkontakte.ru',
            href:       'http://www.vkontakte.ru'
         });
         return this;
      case 'odnoklassniki':
         setSource('outer-network');
         $('.invite.outer-network').inviteOuter({
            typeID:     6,
            title:      'Одноклассники.ru',
            name:       'www.odnoklassniki.ru',
            href:       'http://www.odnoklassniki.ru'
         });
         return this;
      case 'facebook':
         setSource('outer-network');
         $('.invite.outer-network').inviteOuter({
            typeID:     7,
            title:      'Facebook.com',
            name:       'www.facebook.com',
            href:       'http://www.facebook.com'
         });
         return this;
      default:
         setSource(source);
   }

   var $pattern = $('.row.pattern', $obj).removeClass('pattern');

   $obj.find('input[type=radio]').click(function(e)
   {
      if (e.currentTarget.checked)
         source = e.currentTarget.id;
      if (e.currentTarget.id == 'handmade' && e.currentTarget.checked)
         $('.person', $obj).show();
      else
         $('.person', $obj).hide();
   });

   $('.person', $obj)
      .append('<li class="add"><a href="javascript:void(0);" title="Пригласить еще">Добавить еще</a></li>')
      .find('.add a')
      .click(function()
      {
         checkPerson();

         var $row = $pattern.parent().clone(true);

         var num = $obj.find('.person .row').length;

         $row.find('input').val('').each(function(i, o){
            o.id = o.id.replace('0', '') + num;
            o.name = o.name.replace('0', '') + num;
         });

         $row.find('label').each(function(i, o)
         {
            o.htmlFor = o.htmlFor.replace('0', '') + num;
         });

         $('.add', $obj).before($row);
      });

   var checkPerson = function()
   {
      $('#handmade', $obj)[0].checked = true;
      $('.result', $obj).hide();
   }

   var email = function(o, rec)
   {
      checkPerson();

      $obj.is_valid = true;

      var $o = o.currentTarget ? $(o.currentTarget) : (o ? o : $(this));

      var $name = $o.parent().parent().find('.name input');

      if (typeof(rec) == 'undefined' || rec)
         noempty($name, false);

      if (!$o.parent().find('.error').length)
         $o.after('<span class="error"></span>');

      var e = '';
      if (!(common.isempty($name.val()) && common.isempty($o.val())))
      {
         if (common.isempty($o.val()))
            e = 'Необходимо ввести Email';
         else if (!common.isemail($o.val()))
            e = 'Неверный Email';

         $obj.is_valid = $obj.is_valid && e == '';
      }

      $o.parent().find('.error').text(e);

      $obj.is_valid ? submit_enable() : submit_disable();
   }

   var noempty = function(o, rec)
   {
      checkPerson();

      $obj.is_valid = true;

      var $o = o.currentTarget ? $(o.currentTarget) : (o ? o : $(this));

      var $email = $o.parent().parent().find('.email input');

      if (typeof(rec) == 'undefined' || rec)
         email($email, false)

      if (!$o.parent().find('.error').length)
         $o.after('<span class="error"></span>');

      var e = '';
      if (!common.isempty($email.val()) && common.isempty($o.val()))
      {
         e = 'Необходимо ввести Имя';

         $obj.is_valid = $obj.is_valid && e == '';
      }

      $o.parent().find('.error').text(e);

      $obj.is_valid ? submit_enable() : submit_disable();
   }

   var submit_disable = function()
   {
      $obj
         .find('input[@type=submit]')
         .attr('disabled', 'true')
         .addClass('diasabled')
         .disabled = true;
   };

   var submit_enable = function()
   {
      $obj
         .find('input[@type=submit]')
         .removeAttr('disabled')
         .removeClass('diasabled')
         .disabled = false;
   };

   $('#invite_form').submit(function()
   {
      if (source != 'handmade')
      {
         location = '#invite/' + source;
         return false;
      }

      submit_disable();
      $obj.addClass('bg-loading');

      var pdata = {};

      $('.person', $obj).find('input[@type=text]').each(function(i, o)
      {
         pdata[o.name] = o.value;
      });

      $.post(
         '/invite/email',
         pdata,
         function(data)
         {

            $obj.removeClass('bg-loading');
            submit_enable();

            if (data.sc)
               $('.result', $obj)
                  .html((data.mg || '').replace(/\n/, '<br /><br />'))
                  .addClass('status')
                  .show();
            else
               $('.result', $obj)
                  .html((data.mg || '').replace(/\n/, '<br /><br />'))
                  .removeClass('status')
                  .show();

            if (data.sc_ids)
               for (var i = 0; i < data.sc_ids.length; i++)
               {
                  $obj.find('input[@name=name_' + data.sc_ids[i] + ']').val('');
                  $obj.find('input[@name=surname_' + data.sc_ids[i] + ']').val('');
                  $obj.find('input[@name=email_' + data.sc_ids[i] + ']').val('');
               }

         }, 'json'
      );
      return false;
   });

   $obj.find('.out input').click(
      function()
      {
         $($obj.form).attr('action', $obj.parent().find('a').attr('href'));
      }
   );

   $obj.find('.email input')
      .keyup(email)
      .change(email);

   $obj.find('.name input')
      .keyup(noempty)
      .change(noempty);

   if ($obj.parent().find('#handmade').length)
         $obj.parent().find('#handmade')[0].checked = true;
/* && !$obj.parent().find('#handmade')[0].checked)
      $obj.find('.person').hide();
*/
   return this;
}

$.fn.invite = function(options)
{
   var $obj = this;

   options.url = options.url || '/interface/form/invite';
   options.html = options.html || ''; 

   layout.intfse.load(
   {
      url: options.url,
      verify: function(){ return options.html.length; },
      next: function()
      {
         common.intrfc($obj, invite, options);
      },
      callback: function(data){ return common.cache[options.url] = options.html = data; }
   });
   common.intrfc(this, invite, options);

   return this;
}})();
