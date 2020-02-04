path =
{
   rewrite:
      [
         {
            reg:/^auth$/,
            name:'auth',
            cont:'/interface/form/login'
         },
         {
            reg:/^demo$/,
            name:'demo',
            cont:'/interface/info/demo'
         },
         {
            reg:/^faq$/,
            name:'info',
            cont:'/interface/info/faq',
            title:'FAQ'
         },
         {
            reg:/^about$/,
            name:'info',
            cont:'/interface/info/about',
            title:'О сайте'
         },
         {
            reg:/^eula$/,
            name:'info',
            cont:'/interface/info/eula',
            title:'Пользовательское соглашение'
         },
         {
            reg:{
               ind:/^invite(\/(vkontakte|odnoklassniki|facebook)|)$/,
               data:{
                  source:2
               }
            },
            name:'invite',
            cont:'/interface/form/invite'
         },
         {
            reg:
            {
               ind:/^u(\/(\d+)|)\/profile(\?mess=(hello|regen_sent|regen_fail)|)$/,
               data:
               {
                  id:2,
                  param:3
               }
            },
            name:'userProfile',
            cont:'/interface/u/profile'
         },
         {
            reg:{
               ind:/^(u\/(\d+)\/|)(office)(\/(\d+)|)\/(profile|employees(\/(\d+)|)|album(\/(\d+)((\/view\/(\d+)|))|)|vacancy|responses|relations)$/,
               data:{
                  o:3,
                  id:5,
                  page:6,
                  contact_id:8,
                  album_id:10,
                  photo_id:13,
                  user_id:2
               }
            },
            name:'officeProfile',
            cont:'/interface/office/profile'
         },
         {
            reg:{
               ind:/^(u)(\/(\d+)|)\/album(\/(\d+)|)(\/(view\/(\d+)|)|)$/,
               data:{
                  o:1,
                  id:3,
                  album_id:5,
                  photo_id:8,
                  isTitle:true
               }
            },
            name:'qgallery'
         },
         {
            reg:{
               ind:/^(office|u)(\/(\d+)|)(\/group\/(\d+)|)\/contact(\/(\d+)|)(\?mess=(reg|contact(_success|_decline|)(_fail|))(\&auth=true)?|)$/,
               data:{
                  o          : 1,
                  id         : 3,
                  group_id   : 5,
                  contact_id : 7,
                  param      : 9,
                  auth       : 12
               }
            },
            name:'contacts'
         },
         {
            reg:
            {
               ind:/^(guest)(\/(\d+)|)$/,
               data:
               {
                  withMenu   : false,
                  withGroup  : false,
                  isTitle    : true,
                  url_get    : '/u/guest/get',
                  o          : 1,
                  contact_id : 3,
                  view_cont  : function(uid)
                  {
                     return '#guest' + (uid ? '/' + uid : '');
                  }
               }
            },
            name:'contacts',
            title:'Гости'
         },
         {
            reg:{
               ind:/^search(\/(office|people|vacancy|google)|)(\?q=|\&q=|)([^&]*)(\&|)(p=|)(.*)$/,
               data:{
                  o:2,
                  q:4,
                  p:7,
                  cont:'/interface/srch/index'
               }
            },
            name:'search'
         },
         {
            reg:
            {
               ind:/^im(\/(office|people|news)|)(\/(\d+)|)(\/([^\/]*)|)$/,
               data:{
                  o:2,
                  id:4,
                  title:6
               }
            },
            name:'im'
         },
         {
            reg:'',
            name:'dashboard'
         },
         {
            reg:
            {
               ind:/.*/,
               data:{
                  mg:'Запрашиваемая вами страница отсутствует. Никто уже не вспомнит куда она делась, а может появиться в будующем и вы всего лишь на шаг впереди самого времени...',
                  st:'404'
               }
            },
            name:'errors'
         }
      ],
   parse:function(hash)
   {
      hash = typeof(hash) == 'string' ? hash : location.hash.substr(1);

      for(var i=0;i<path.rewrite.length;i++)
      {
         var reg = path.rewrite[i].reg && path.rewrite[i].reg.ind ? path.rewrite[i].reg.ind : path.rewrite[i].reg;

         if(reg == hash || (reg.test && reg.test(hash)))
         {
            var res = $.extend({}, path.rewrite[i]);
            if(typeof(res.reg.data) != 'undefined')
            {
               var options = $.extend({}, res.options);
               var vals = hash.match(res.reg.ind);

               $(res.reg.data).each(function(i, o)
               {
                  for(name in o)
                     options[name] = hash && hash.length && typeof(o[name]) == 'number' ? vals[o[name]] : o[name];
               })
               res.options = options;
            }
            return res;
         }
      }

      return false;
   },
   hash:function(hash)
   {
      hash = typeof(hash) == 'string' ? hash : location.hash.substr(1);

      return  hash.length && hash.substr(0,1) == '#' ? hash.substr(1) : hash;
   },
   go:function(hash)
   {
      hash = hash || location.hash;

      if(common.logHistory)
         common.log('history.go: #' + location.hash + ' (' + hash + ')');

      hash = path.hash(hash);

      var res = path.parse(hash);

      if(res)
         layout.add(res.name, $.extend({name:res.name,url:res.cont,title:res.title}, res.options));
      else
         common.log('history.go: #' + location.hash + ' (nothing parse res: ' + res + ')');
   }
};
