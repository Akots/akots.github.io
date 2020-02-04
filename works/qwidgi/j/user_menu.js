(function(){

$.fn.userMenu = function(options)
{
   options = options || {};
   options.url = options.url || {};

   if(!this.length || (!options.hasContacts && !options.hasAlbums && !options.office_id))
      return false;

   this.find('.profile-tabs').remove()

   common.log('create profile-tabs');

   var $m = $(
         '<ul class="profile-tabs">' +
            (options.hasContacts ? '<li class="tab-contacts' + (options.active == 'contacts' ? ' active':'') + '"><a title="Контакты" href="' + (options.url.contact || '#u/contact') + '"></a></li>' : '') +
            (options.hasAlbums ? '<li class="tab-foto' + (options.active == 'albums' ? ' active':'') + '"><a title="Фото" href="' + (options.url.album || '#u/album') + '"></a></li>' : '') +
            (options.office_id ? '<li class="tab-office' + (options.active == 'office' ? ' active':'') + '"><a title="Офис" href="' + (options.url.office || '#office/profile') + '"></a></li>' : '') +
         '</ul>'
   );

   $m.find('li').hover(
      function(){$(this).addClass('hover')},
      function(){$(this).removeClass('hover')}
   );


   return this.append($m);

}


})();

