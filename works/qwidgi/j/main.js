google.load('search', '1.0');

$(document).ready(function()
{
   $('.feedback').hide();

   if (common.auth && !common.is_proto)
      $('a#logout').hide();

   Storage.init();

   common.ie55 = ($.browser.msie && $.browser.version < 6);
   common.ie6 = ($.browser.msie && $.browser.version == 6);
   common.ie7 = ($.browser.msie && $.browser.version == 7);

   if ( common.ie6 || common.ie55 )
      $(document.body).addClass('is-ie ie6');

   if ( common.ie7 )
      $(document.body).addClass('is-ie ie7');

   var rev = {
      get: $.get,
      post: $.post
   }

   function iserror(p)
   {
      if(typeof(p.sc) == 'boolean' && !p.sc && p.err)
      {
         layout.add('errors', p.err);

         return true;
      }

      return false;
   }

   var cl = function(p, callback)
   {
      if(iserror(p))
         return;

      callback(p)
   }

   for(var f in rev)
   {
      $[f] = function(url, data, callback, type)
      {
         rev[f]( url, data, function(p){cl(p, callback);}, type);
      }
   }

   $('#feedback').feedback();
   $('#search-box').search_quick();

   $('#user-functions').append(!common.auth() ? icon.init({
      id:'',
      name:'auth',
      title:'Вход',
      ico:'/i/widget/ic-logout.png',
      url:'',
      cont: '/interface/form/login',
      fixed:true
   }, 'fixed') : '<a id="logout" title="" href="/logoff">Выход</a>');

   layout.create(
      {
         load:function()
         {
            $.historyInit(path.go);
         }
      }
   );


});

