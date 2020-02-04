(function(){

function imgchanger($img, options)
{
   this.clear =function()
   {
      $('.imgAreaSelect').remove();
   }

   var is_photo_change = false;
   if($img && $img.length && $img.attr('rel') && $img.attr('rel').length)
      eval('options.pcor = ' + $img.attr('rel') + ';');

   if(!options.pcor && $img)
      options.pcor = $img.data('rel');

   options.pcor = options.pcor && typeof(options.pcor.x1) != 'undefined' ? options.pcor : ($img ? {x1:0,y1:0,x2:$img.innerWidth(),y2:$img.innerHeight()} : {x1:0,y1:0,x2:0,y2:0});
   options.no_photo_url = !options.no_photo_url ? '/i/none.png' : '';

   var width = parseInt(options.pcor.x2)-parseInt(options.pcor.x1);
   var height = parseInt(options.pcor.y2)-parseInt(options.pcor.y1);

   var $splash = $('<div id="splash"></div>').appendTo(document.body);
   var $imagechanger = $('<div id="imagechanger_view" class="imagechanger layout"><div class="cont"></div></div>')
      .appendTo(document.body);

   var $dialog = $imagechanger
      .find('.cont')
      .html(
       '<div class="load_image">' +
         '<h4>Загрузить новое фото</h4>' +
         '<div class="image-function">' +
         '<iframe width="1" scrolling="no" height="1" frameborder="0" name="_uploadFrame" id="_uploadFrame" style="margin: 0px;display:none;" src="about:blank"  />' + 
         '<form class="upload" enctype="multipart/form-data" action="' + options.upload_url + '" method="post" target="_uploadFrame">' + 
           '<input type="hidden" name="album_id" value="' + options.album_id +'" />' +
           '<input type="hidden" name="photo_id" value="' + options.photo_id +'" />' + 
           (
              options.office_id ?  
              '<input type="hidden" name="office_id" value="' + options.office_id  +'" />' :
              ''
           ) + 
           '<p class="input"><input type="file" id="user_photo_upl" name="user_photo" /></p>' +
           '<p class="grey fsz-smaller">Загружайте картинки jpg, png, gif до 5 МБ.</p>'+
           '<p class="tools"><input type="button" value="Отмена" class="cancel ajax" />' +
       ' </form></div>' +
       '</div>' +
       '<div class="edit_image">' +
         '<form action="' + options.resize_url + '" class="photo_size" method="post"  target="_resizeFrame">' + 
         '<h4>Изменить текущее фото</h4>' +
         '<div class="image-function">' +
            '<input type="hidden" value = "' + options.pcor.x1 + '" name="x" />' +
            '<input type="hidden" value = "' + options.pcor.y1 + '" name="y" />' +
            '<input type="hidden" value = "' + width + '" name="width" />' +
            '<input type="hidden" value = "' + height + '" name="height" />' +
            '<img src="' + (!options.is_new ? options.url_img_orig : options.no_photo_url) +  '?cache=' + ( Math.floor ( Math.random ( ) * 100000 + 1 ) ) + '" class="avatar" />' +
            '</div>' +
            '<div>' +
              '<input class="submit" id="submit-change-photo" type="submit" value="Сохранить" />' +
              '<input type="button" value="Оставить" class="cancel ajax" />' +
            '</div>' +
         '</form>' +
       '</div>'
       )
       .removeClass('.cont')
       .popupHint(
       {
         header   : 'Загрузка фотографии',
         isDialog : true
       })
       .addClass('form-cont cont');

      if(options.is_new)
         $imagechanger.find('.edit_image').hide();

      $imagechanger
       .find('img.avatar')
       .load(function()
       {
         width = $(this).width();
         height = $(this).height();

         if(!options.pcor.x2)
         {

            var m = width > height ? height : width;

            options.pcor.x1 = (width - m)/2;
            options.pcor.y1 = (height - m)/2;

            options.pcor.x2 = options.pcor.x1 + m;
            options.pcor.y2 = options.pcor.y1 + m;
         }

         options.pcor.x1 = options.pcor.x1 > width ? 0 : options.pcor.x1;
         options.pcor.x2 = options.pcor.x2 > width ? width : options.pcor.x2;
         options.pcor.y1 = options.pcor.y1 > height ? 0 : options.pcor.y1;
         options.pcor.y2 = options.pcor.y2 > height ? heigth : options.pcor.y2;

         imgResizer = $(this)
         .imgAreaSelect(
         {
           x1:options.pcor.x1,
           y1:options.pcor.y1,
           x2:options.pcor.x2,
           y2:options.pcor.y2,
           minHeight:50,
           minWidth:50,
           aspectRatio:'1:1',
           onSelectEnd:
             function(img, selection)
             {
               $('form.photo_size input[name=x]').val(selection.x1);
               $('form.photo_size input[name=y]').val(selection.y1);
               $('form.photo_size input[name=width]').val(selection.width);
               $('form.photo_size input[name=height]').val(selection.height);
             }
         });
         !options.is_new && imgResizer ? imgResizer.show() : (imgResizer ? imgResizer.hide(): null);
       });

    $imagechanger
       .find('input[type=file]')
       .change(
         function()
         {
           if(
              this.value.length && 
              !$(this).parent().parent().find('load').length &&
              !$(this).parent().parent().find('.submit').length
           )
              $imagechanger.find('.tools').prepend('<input class="submit ajax" type="submit" value="Загрузить" />');
         }
       );

   $imagechanger
      .find('form.upload')
      .submit(function()
      {
         $imagechanger.find('.load_image').addClass('loading');

         var $frame = $('#_uploadFrame');
         var $form = $(this);

         if($frame.length)
            $frame[0].onload = function()
            {
               $imagechanger.find('.load_image').removeClass('loading');

               var data = {}
               try
               {
                  if($frame.length && $frame[0].contentDocument && $frame[0].contentDocument.body && $frame[0].contentDocument.body.textContent)
                  eval('var data = ' + $frame[0].contentDocument.body.textContent + ';');
               }catch(e){common.log(e);}

               if (data && data.sc)
               {
                  options.photo_id = data.photo_id || '';
                  options.album_id = data.album_id || '';
                  options.url_img_orig = 
                        options.office_id
                     ?
                        '/office/' + options.office_id + '/logo/orig'
                     :
                        '/u/album/' + options.album_id + '/thumb/' + options.photo_id;

                  options.url_img_orig = data.url_img_orig || options.url_img_orig;

                  $('input[name=album_id]').val(options.album_id);
                  $('input[name=photo_id]').val(options.photo_id);

                  $img ? $img.attr('photo_id', options.photo_id) : '';

                  $imagechanger.find('.edit_image').show();

                  $imagechanger
                    .find('img.avatar')
                    .attr(
                     'src',
                        options.url_img_orig +
                        '?cache=' +
                        (
                           Math.floor ( Math.random ( ) * 100000 + 1 )
                        )
                     );

                  is_photo_change = true;

                  $img ? $img.removeAttr('new') : '';

                  if (options.is_new && options.onUploadNew)
                    options.onUploadNew($.extend(data, {'url_img' : options.url_img}));

                  if(options.onUpload)
                     options.onUpload();

                 options.is_new = false;
               }

               if (!options.is_new && typeof(imgResizer) != 'undefined')
               {
                  $imagechanger.find('form.photo_size input.submit').show();
                  imgResizer.show()
               }

               $form.parent().show().next().show();

               $form.parent().parent()
                  .removeClass('loader');
           };

        if(typeof(imgResizer) != 'undefined')
          imgResizer.hide();

        return true;
      });

      $imagechanger
         .find('form.photo_size')
         .submit(function()
         {
           var post_param =
           {
             x            : $imagechanger.find('form.photo_size input[name=x]').val(),
             y            : $imagechanger.find('form.photo_size input[name=y]').val(),
             width        : $imagechanger.find('form.photo_size input[name=width]').val(),
             height       : $imagechanger.find('form.photo_size input[name=height]').val(),
             view_width   : options.view_width ? options.view_width : 196,
             photo_id     : options.photo_id,
             album_id     : (options.album_id ? options.album_id : ''),
             office_id    : (options.office_id ? options.office_id : '')
           };
           $.post(
             options.resize_url,
             post_param,
             function(data) {

               if(typeof(imgResizer) != 'undefined' && typeof(imgResizer.dispose) != 'undefined')
                  imgResizer.dispose();

               if (data && data.photo_url && $img)
                  $img.attr('src', data.photo_url + '?' + ( Math.floor ( Math.random ( ) * 100000 + 1 ) ));

              var rel_attr = null;

              if
              (
                  post_param.x &&
                  post_param.y &&
                  post_param.width &&
                  post_param.height &&
                  $img
               )
               {
                 rel_attr = 
                 '{' + 
                    'x1:' + post_param.x + ',' +
                    'y1:' + post_param.y + ',' +
                    'x2:' + (Number(post_param.width) + Number(post_param.x)) + ',' +
                    'y2:' + (Number(post_param.height) + Number(post_param.y)) +
                 '}';
                 $img.attr('rel', rel_attr);
                 eval('options.pcor = ' + rel_attr + ';');
               }

               is_photo_change = data && data.sc;

               if (options.onChangeSize)
                 options.onChangeSize($.extend(data, {'url_img' : data.photo_url}));

               $imagechanger.remove();
               $splash.remove();

               if (options.onClose)
                 options.onClose();
             }
             , 'json'
           );
           return false;
         }
       );

   $imagechanger.find('.cancel')
   .click(function()
   {
      if(typeof(imgResizer) != 'undefined' && typeof(imgResizer.dispose) != 'undefined')
         imgResizer.dispose();

      $imagechanger.remove();
      $splash.remove();

      if (options.onClose)
        options.onClose();
   });

   return this;
}

﻿jQuery.fn.imgchanger = function(options)
{

   options = options || {};
   options = $.extend({
      url_img       : common.is_proto() ? '/u/photo' : '',
      url_img_orig  : '/u/photo',
      upload_url    : '/u/upload_photo',
      resize_url    : '/u/photo_size',
      album_id      : '',
      onUploadNew   : function(){},
      with_delete   : false,
      delete_url    : '/u/album/photo/delete',
      onView        : function(){},
      with_edit     : true,
      office_id     : '',
      url           : '',
      photo_id      : ''
   }, options);

   var init = function($img)
   {
      $img.addClass('photo_change');
      var $canvas = $img.wrap('<div></div>').parent();

      if (options.with_edit)
         $canvas.prepend('<ul class="tools"><li class="edit"><a href="javascript:void(0);" title="Редактировать"></a></li></ul>');

      $img.before(
         options.url && options.url.length ?
            '<a class="url" href="' + options.url + '"></a>' : ''
      );

      var imgResizer = null;
      var id = $img.attr('photo_id') ? $img.attr('photo_id') : '';

      options.url_img = (options.url_img ? options.url_img + (id ? '/' + id : '') : $img.attr('src'));
      options.is_new = Boolean($img.attr('new') ? $img.attr('new') : false);
      options.url_img_orig = options.url_img_orig + (id ? '/' + id : '');

      if (options.with_edit && options.with_delete && !options.is_new)
         $img.parent().find('.tools')
            .append(
                  '<li class="delete"><a href="' + options.delete_url + '" title="Удалить"></a></li>'
               )
            .find('.delete')
            .click(function()
            {
               $.post(
                 options.delete_url,
                 {photo_id : options.photo_id},
                 function(data)
                 {
                    if (data && data.sc && options.onDelete)
                        options.onDelete($img);
                    else
                        $img.parents('.photo').remove();
                 },
                 'json'
               );
               return false;
            });

      $canvas
         .addClass('imgchanger')
         .hover(
           function()
           {
             $canvas.find('.shadow, .shadow .url').css
             ({
               width   : $canvas.find('img.photo_change').innerWidth(),
               height  : $canvas.find('img.photo_change').innerHeight(),
               display : 'block'
             });
           },
           function(){}
         )
         .click(function()
         {
            if (!options.is_new && options.onView)
               options.onView(id);  
         });

      var v = function(){imgchanger($img, $.extend({id:id}, options))};

      $canvas.find('.edit').click(v);

      if(options.edit_toggle)
         options.edit_toggle.click(v);

  }

  return common.init(this, init, options);
}

jQuery.fn.photo_view = function(options)
{
   if (!this.length)
     return this;

   var $obj = $(this);

   var $layout = $obj.parent().parent().addClass('loading').addClass('viewlist');

   options = options ? $.extend({}, options) : {};

   var $view = $layout.find('.imgview').empty();

   if(!$view.length)
      $view = $layout.append('<div class="imgview"></div>').find('.imgview');

   $view.hide();

   var edit = options.edit ? options.edit : false;

   options.photo_id = $(this).attr('photo_id') ? $(this).attr('photo_id') : (options.photo_id ? options.photo_id : '');

   $.extend(
      options,
      options.o == 'u'?
         {user_id        : options.id} :
         {office_id      : options.id}
   );

   if(options.photo_id)
   {
      $.post(
         '/' + options.to_photo() + '/info',
         {},
         function(data)
         {
            edit = data.edit;

            $view.append(
               '<div class="area">' +
                  '<div class="img">' +
                     '<span class="foto-corners-repeat"></span>' +
                     '<span class="foto-corners-top"><span><span></span></span></span>' +
                     '<span class="foto-corners-bot"><span><span></span></span></span>' +
                     '<img src="/' + options.to_photo() + '" />' +
                  '</div>' +
                  '<h1 class="title"><span>' + common.htmlspecialchars(data.title) + '</span></h1>' +
                  (
                     data.prev_id || data.next_id ?
                     '<ul class="nav">' +
                        (data.prev_id ? '<li><a class="left" title="предыдущая фото" href="#' + options.to_view(data.prev_id) + '"></a></li>' : '') +
                        (data.next_id ? '<li><a class="right" title="следующая фото" href="#' + options.to_view(data.next_id) + '"></a></li>': '') +
                     '</ul>' : ''
                  ) +
               '</div>'
               )
               .find('img')
               .load(function()
                  {
                     $layout.removeClass('loading');

                     $view
                        .show()
                        .find('.area')
                        .css({width:this.clientWidth,height:this.clientHeight});
                  })
               .data('rel', data.crop);

            if(edit)
            {
               $view.find('.title span').inputEx( {url:options.to_photo() + '/edit', empty: 'нет описания'} );
               $view.find('img').imgchanger($.extend(
                  {},
                  options.imgchanger_params,
                  {
                     photo_id       : options.photo_id,
                     // Путь к уменьшенной оригинальной, то что thumbnail
                     url_img_orig   : '/' + options.to_album() + (options.photo_id ? '/thumb/' + options.photo_id : ''),
                     // Путь к вырезанной пользвателем 196x196
                     url_img        : '/' + options.to_album() + (options.photo_id ? '/thumb/196x196/' + options.photo_id : '')
                  })
               );
            }else
               $view.find('img').before('<div class="tools"></div>');

            $('<li class="back"><a href="#' + options.to_album() + '" ></a></li>')
            .click(
               function()
               {
                  $view.remove();
               }
            ).prependTo($view.find('.tools'))
         },
         'json'
      );

      }
      else
      {
         $.post(
            '/' + options.to_album() + '/photo/list',
            {},
            function(data)
            {
               $layout.removeClass('loading');

               var $photos = $view.append('<ul class="photos"></ul>').find('.photos');

               $(data).each(function(i, o)
               {
                  $photos.append(
                     '<li class="photo i' + i + '">' +
                       '<ul>' +
                         '<li class="view">' +
                           '<span class="foto-corners-repeat"><span></span></span>' +
                           '<span class="foto-corners-top"><span><span></span></span></span>' +
                           '<span class="foto-corners-bot"><span><span></span></span></span>' +
                           (
                             !edit ? '<a class="url" href="#' + options.to_view(o.id) + '"></a>' : ''
                           ) +
                             '<img src="/' + options.to_view(o.id) + '"' + (o.crop ? ' rel="' + o.crop + '"' : '') + ' />' +
                         '</li>' +
                         '<li class="title">' +
                           (
                             edit ? '<span>' : ''
                           ) +
                           common.strict(o.title) +
                           (
                             edit ? '</span>' : ''
                           ) +
                         '</li>' +
                       '</ul>' +
                     '</li>');

                  if(edit)
                  {
                     $photos.find('.i' + i + ' .title span').inputEx( {url:options.to_photo(o.id) + '/edit',empty: 'нет описания',val:o.title,title:common.strict} );
                     $photos.find('.i' + i + ' .view img').imgchanger($.extend(
                        {},
                        options.imgchanger_params,
                        {
                           url:'#' + o.url.substr(1),
                           photo_id       : o.id,
                           // Путь к уменьшенной оригинальной, то что thumbnail
                           url_img_orig   : '/' + options.to_album() + (o.id ? '/thumb/' + o.id : ''),
                           // Путь к вырезанной пользвателем 196x196
                           url_img        : '/' + options.to_album() + (o.id ? '/thumb/196x196/' + o.id : '')
                        }
                     ));
                  }

                  $view.show();
               });
            },
            'json'
         );
      }

   return this;
}

function qgallery($obj, options)
{
   if (!$obj || !$obj.length)
     return $obj;

   var me = this;
   var $list = false;

   options = options ? $.extend({}, options) : {};

   this.init = function(o)
   {
      if(o)
      {
         o.album_id = o.album_id || false;
         o.photo_id = o.photo_id || false;

         $.extend(options, o);
      }

      if(options.isTitle)
      {
         title.set(options.title ? options.title() : (options.data && options.data.info ? (options.data.info.first_name || '') + ' ' + (options.data.info.second_name || '')  : 'Мои фотографии'));

         if(options.data && options.data.info)
            title.$cont.userMenu(
            {
               hasContacts : options.data.info.hasContacts,
               hasAlbums   : options.data.info.hasAlbums,
               office_id   : options.data.info.office_id,
               active      : 'albums',
               url         :
               {
                  contact  : '#u/' + options.data.info.user_id + '/contact',
                  album    : '#u/' + options.data.info.user_id + '/album',
                  office   : '#u/' + options.data.info.user_id + '/office/' + options.data.info.office_id + '/profile'
               }
            });
      }

      if(
         options.o &&
         options.album_id &&
         Number(options.album_id) &&
         $list && $list.length
      )
         $list.photo_view($.extend({edit:edit}, options));
      else if($obj.is('.viewlist'))
      {
         $obj.find('.imgview').remove();

         $obj.removeClass('viewlist');

         me.recall_tumb();
      }

      if(options.album_id)
      {
         $obj.find('.ui-tabs-selected').removeClass('ui-tabs-selected');
         $obj.find('.album.a' + options.album_id + ' .title').addClass('ui-tabs-selected');
      }

      if(options.end)
         options.end();
   }

   this.clear = function()
   {
      if(options.isTitle)
         title.empty();
   }

   var edit = typeof( options.edit ) == 'boolean' ? options.edit : false;

   options.album = options.album ? options.album : 'album'

   options.to_view = function (id)
   {
      return (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/' + options.album + '/' + options.album_id + '/view/' + (id || options.photo_id || '');
   }

   options.to_photo = function (id)
   {
      return (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/' + options.album + '/' + options.album_id + '/photo/' + (id || options.photo_id || '');
   }

   options.to_album = function ()
   {
      return (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/' + options.album + '/' + options.album_id;
   }

   options.to_albums = function ()
   {
      return (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/' + options.album;
   }

   var url = options.to_albums() + '/list';

   options.data = common.cache[url] || false;

   function change()
   {
      common.cache[url] = false;
   }
   
   $obj.addClass('qgallery').find('.imgview').remove();


   function recall_album($view, o)
   {
      var
         wt = ($view.width() - 3)/o.list.length,
         w = Math.ceil(wt),
         iw = $view.width(),
         h = $view.height();

      if(wt == 0) return;

      $view.parent().find('.item').empty();

      $(o.list).each(function(i, item)
      {
         if(!item) return;

         var s = (function(t)
            {
               return function()
               {
                  $view
                     .css('background-position', '0 -' + ((h-2) * t) + 'px');
               }
            })(i);

         $view
            .parent()
            .append(
               '<a class="item i' +
                  i +
                  '" href="#' +
                  item.substr(1) +
                  '" style="display:block;left:' +
                  Math.ceil(i*wt) +
                  'px;width:' +
                     w +
                  'px;height:' +
                     h +
               'px;"></a>'
            )
            .find('.i' + i)
            .focus(s)
            .hover(
               s,
               function(){}
            );
      });
   }

   this.recall_tumb = function()
   {
      $obj.show();

      if(typeof($list) != 'undefined' && $list && $list.length)
         $list.find('.album').each(function(i, o)
         {
            var id = o.className.split(' ');

            id = id[id.length-1];

            if($list.find('.' + id + ' .preview img').get(0).recall)
               $list.find('.' + id + ' .preview img').get(0).recall();
         });
   }

   common.log('Init qgallery for ' + options.o + '#' + options.id);

   var append_album = function($l, o, rename_end)
   {
      var is_new = !o.id;

      o.id = (!is_new ? o.id : 'New' + $l.find('.new').length);

      var $view = $l.append(
         '<li class="album'  + (is_new ? ' new' : '') + ' a' + o.id + '">' +
          '<ul id="a' + o.id + '">' +
            '<li class="preview"><img src="/i/bg-album-mask.png" class="png-fix" style="background:transparent no-repeat url(' + (o.list && o.list.length ? o.thum : '/i/none-album.png') + ');" /></li>' +
            '<li class="title' + (o.id == options.album_id ? ' ui-tabs-selected' : '') + '"><a href="#' + options.to_albums() + '/' + o.id + '" title="' + common.htmlspecialchars(o.title) + '">' + common.strict(o.title) + '</a></li>' + 
            (edit ?
            '<li class="tools png-fix">' +
            '<ul>' +
               '<li class="rename"><a href="javascript:void(0);" title="Переименовать"></a></li>' +
               '<li class="add-photo"><a href="javascript:void(0);" title="Добавить фотографию"></a></li>' +
               '<li class="delete"><a href="javascript:void(0);" title="Удалить альбом"></a></li></ul></li>':'') + 
               '<li class="count">' + o.list.length + ' ' +
               (
                  o.list.length%10 == 1 ?
                  'фотография':
                  (
                     o.list.length%10 > 1 && o.list.length%10 <= 4 ?
                      'фотографии' :
                      'фотографий'
                  )
               ) + '</li>' +
           '</ul>' +
          '</li>'
      )
         .find('.a' + o.id + ' .preview img')
         .load(function(){recall_album($view, o);});

      $view[0].recall = function(){recall_album($view, o);};

      $view.parent().parent().find('.rename a').click(function()
      {
         var renameLink = $(this).css('visibility', 'hidden');

         var end = $(this).data('end');

         var $title =
            $(this)
               .parent()
               .parent()
               .parent()
               .parent()
               .find('.title a');

         var old_val = $title.html();

         var rename = function(name)
         {
            $obj.find('.a' + o.id + ' .title a').html(common.strict(name)).attr('title', name);

            change();
         }

         var end = function($this, f)
         {
            if(f)
            {
               rename($val.val());

               $.post(
                  '/' + (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/album/edit',
                  {
                     album_id : o.id,
                     name     : 'name',
                     val      : $val.val()
                  },
                  function(data)
                  {

                     function clear()
                     {
                        renameLink.css('visibility', 'visible');
                        if(rename_end && $.isFunction(rename_end))
                           rename_end();
                        rename_end = false;
                     }

                     if (data && data.sc)
                     {

                        $('#qgallery_view .a' + o.id)
                           .removeClass('a' + o.id)
                           .addClass('a' + data.album_id)
                           .find('.title a')
                           .attr('href', '#' + options.to_albums() + '/' + data.album_id)

                        $('#qgallery_view #a' + o.id)
                           .attr('id', data.album_id)

                        if(Number(data.album_id) > 0)
                           o.id = data.album_id;

                        var $l = $view.parent().parent();

                        if( $l.find('.rename a').data('new') )
                        {
                           $l.find('.rename a').data('new', false);

                           $l
                              .find('.add-photo a')
                              .click();

                           clear();
                        }
                        else
                        {
                           (new messg($title.parent())).action(function()
                           {
                              $.post(
                                 '/' + (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/album/edit',
                                 {
                                    album_id : o.id,
                                    undo:true,
                                    name:'name',
                                    val:old_val
                                 },
                                 function()
                                 {
                                    rename(old_val);
                                    clear();
                                 },
                                 'json'
                              );
                           },
                           clear);

                        }
                     }else 
                        clear();

                  },
                  'json'
               );
            }

            $val.remove();

            $title.show().parent().removeClass('rename');
         }

         var $val = $title.parent().find('input[name=rename]');

         if(!$val.length)
            $val = $title
               .parent().addClass('rename')
               .find('a')
               .hide()
               .after('<input value="' + common.htmlspecialchars($title.attr('title')) + '" name="rename" />')
               .next()
               .keyup(function(e)
               {
                  if(e.keyCode == 13 || e.keyCode == 9)
                     end($(this), true);
                  if(e.keyCode == 27)
                     end($(this));
               })
               .blur(function(){end($(this), true);})
               .focus()
               .select();
      });
      $view.parent().parent().find('.add-photo a').click(function()
      {
         options.album_id = o.id;
         var changed = false;

         imgchanger(false, $.extend(
            {},
            options.imgchanger_params,
            {
               is_new:true,
               album_id: o.id,
               // Путь куда сабмитится форма аплоуда
               upload_url     : '/' + options.to_album() + '/upload_photo',
               // Путь куда сабмитится форма ресайза
               resize_url     : '/' + options.to_album() + '/photo_size',
               onChangeSize:function(){changed=true;change();},
               onUpload:function(){changed=true;change();},
               onClose:function(){if(changed){change();path.go();}},
               edit:edit
            }
         ));
      });
      $view.parent().parent().find('.delete a').click(function()
      {
         var $this = this;

         $.post(
            '/' + (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/album/delete',
            {album_id : o.id},
            function(data)
            {
               if (data && data.sc)
               {
                  $obj.find('.a' + o.id).addClass('deleted');

                  function clear()
                  {
                     $obj.find('.a' + o.id).hide();
                  }
                  
                  (new messg($l.find('.a' + o.id).after())).action(function()
                  {
                     $obj.find('.a' + o.id).removeClass('deleted');

                     $.post(
                        '/u/album/delete',
                        {
                           album_id : o.id,
                           undo:true
                        },
                        function()
                        {
                           clear();
                        },
                        'json'
                        );
                  },
                  clear);
               }
            },
            'json'
         );
         return false;
      });

      return $view;
   }

   var load = function(data)
   {
      options.data = common.cache[url] = data;

      edit = typeof(data.edit) == 'boolean' ? data.edit : false ;

      options.html = options.html ? options.html :
         '<div class="albums real">' +
           '<h2><a href="#' + (options.o ? options.o : 'u') + (options.id ? '/' + options.id : '') + '/album">Все альбомы</a></h2>' +
           '<ul class="list"></ul>' +
           (
             edit ? '<div class="tools col-tools"><div class="bg-tools png-fix">' +
             '<a href="javascript:void(0);" class="add-album add png-fix" title="Добавить альбом"><span class="png-fix"></span></a></div>':''
           ) +
           '</div></div>';

      $list = $obj.empty().append(options.html).find('.albums.real .list');

      options.imgchanger_params =
      {
         album_id       : options.album_id,
         photo_id       : options.photo_id,
         // Путь к уменьшенной оригинальной, то что thumbnail
         url_img_orig   : '/' + options.to_album() + (options.photo_id ? '/thumb/' + options.photo_id : ''),
         // Путь к вырезанной пользвателем 196x196
         url_img        : '/' + options.to_album() + (options.photo_id ? '/thumb/196x196/' + options.photo_id : ''),
         // Путь куда сабмитится форма аплоуда
         upload_url     : '/' + options.to_album() + '/upload_photo',
         // Путь куда сабмитится форма ресайза
         resize_url     : '/' + options.to_album() + '/photo_size',
         with_delete    : edit,
         // Путь по которому удаляется фотография
         delete_url     : options.photo_delete_url,
         with_edit      : edit,
         onDelete : function($img)
         {
           var photoList = $img.parents('.photo').length ? true : false;
               
           var $photo = photoList ? $img.parents('.photo').addClass('deleted') : $img.parents('.area').addClass('deleted');
           
           function clear()
           {
            if (photoList)
               $photo.hide();
            else
               location = $photo.find('.back a').attr('href');
           }
           
           (new messg($photo)).action(function()
           {
              $photo.removeClass('deleted');

              $.post(
                 options.photo_delete_url,
                 {
                    photo_id : options.photo_id,
                    undo     : true
                 },
                 function(){
                  clear()
                 },
                 'json'
              );
           }, clear);
         }
      };

      var hoverOn = function ()
      {
         $(this).removeClass('hover').addClass('hover');
      }
      var hoverOff = function ()
      {
         $(this).removeClass('hover');
      }
      
      $list.parent()
         .find('.add-album')
         .click(function()
         {
            var me = $(this).css('visibility', 'hidden');

            var $view = append_album
            (
               $(this).parent().parent().parent().find('.list'),
               {
                  title:'Новый фотоальбом',
                  description:'Развернутое описание альбома',
                  list:[]
               },
               function(){
                  me.css('visibility', 'visible');
               }
            );

            $list.append( $view.parent().parent().parent().clone(true) );

            $view.parent().parent()
               .find('.rename a')
               .data('new', true)
               .click();

            $view.parent().parent().parent()
               .hover(
                  hoverOn,
                  hoverOff
               );

         });

      $((data.list || data)).each(function(i, o)
      {
         append_album($list, o);
      });

      var $dbl = $list
         .parent()
         .clone(true)
         .show()
         .addClass(edit ? 'viewlist clone can-add' : 'viewlist clone')
         .removeClass('real')
         .attr('id', 'lftcol-groups');

      $dbl.find('.album').hover(
         hoverOn,
         hoverOff
      );

      if($list.parent().parent().length)
         $list
            .parent()
            .before($dbl);

      me.init();
   }

   this.needReset = function(new_options)
   {
      return !(!common.cache[url] ||
         options.o != new_options.o ||
         !(
            typeof(new_options.id) == 'undefined' &&
            typeof(options.id) == 'undefined'
         ) ||
         (
            typeof(options.id) != 'undefined' &&
            options.id != new_options.id
         ));
   }

   if(!common.cache[url])
      $.post(
         url,
         {},
         load,
         'json'
      );
   else
      load(common.cache[url]);

   return this;
}

jQuery.fn.qgallery = function(options)
{
   return common.intrfc(this, qgallery, options);
}

})();
