var common = 
{
   cache:[],
   is_proto: function()
   {
     return typeof(IS_PROTO) != 'undefined' && IS_PROTO ? IS_PROTO : false;
   },
   serialize:function(o, pre)
   {
      var s = (pre || '') + '_';

      for(var nm in o)
         s += '_' + (o[nm] || '');

      return s;
   },
   intrfc:function($obj, init, options)
   {
     return $($obj.length ? $obj : [$obj]).each(function(i, o){
        o.options = $.extend({}, options);
        o.intrfc = new init($(o), o.options);
     });
   },
   init:function($obj, init, options)
   {
     return $($obj.length ? $obj : [$obj]).each(function(i, o){
        init($(o), $.extend({}, options));
     });
   },
   valOrEmpty:function(val)
   {
   return typeof(val) != 'undefined' && val != null ? val : '';
   },
   param:function(param)
   {
    var res = {};

    if(param)
      for (var item in param)
        res[item] = $.isFunction(param[item]) ? param[item]() : param[item];
    
    // делаем пустыми все неопределенные поля
    for (var nm in res)
    {
      if(typeof(res[nm]) == 'undefined' || res[nm] == null)
        res[nm] = '';
    }
    
    return res;
   },
   strict:function(val, mx)
   {
      mx = mx || 15;
      val = val || '';
      return (val.length < mx ? common.htmlspecialchars(val) : common.htmlspecialchars(val.substr(0, mx)) + '&hellip;');
   },
   strictWord:function(val, mx)
   {
      val = val || '';
      mx = mx || 15;

      var res = '';
      var l   = 0;

      $(val.split(/[ ;,\.\'\"\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\:\<\>\?\/]/)).each(function()
      {
         var dl = this.length + 1;

         res += common.strict(val.substr(l, dl - 1), mx) + val.substr(l + dl -1, 1);

         l += dl;
      })
      return res;
   },
   spaceWord:function(val, mx)
   {
      val = val || '';
      mx = mx || 50;

      var res = '';

      $(val.split(/[ ]/)).each(function()
      {
         var r = '';

         if(this.length > mx)
            for(var i = 0; i < this.length; i += mx)
               r += this.substr(i, i+mx > this.length ? this.length%mx : mx) + ' ';

         res += common.htmlspecialchars($.trim(r) || this) + ' ';
      })
      return $.trim(res);
   },
   htmlspecialchars: function (str, quote_style) 
   {
      if (!str) return str;

       str = str.toString()
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;');

       // Encode depending on quote_style
       if (quote_style == 'ENT_QUOTES') {
           str = str
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
       } else if (quote_style != 'ENT_NOQUOTES') {
           // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)
           str = str.replace(/"/g, '&quot;');
       }
       
       return str;
   },
   htmlspecialchars_decode: function (str, quote_style)
   {
      if (!str) return str;
      
      str = str
         .replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>');

      // Encode depending on quote_style
      if (quote_style == 'ENT_QUOTES') {
        str = str
           .replace(/&quot;/g, '"')
           .replace(/&#039;/g, '\'');
      } else if (quote_style != 'ENT_NOQUOTES') {
        // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)
        str = str.replace(/&quot;/g, '"');
      }

      return str;
   },
   search: function(param, add, def_title)
   {
      var query = '';
      var first = false;
      for(var lbl in param)
      {
         if(param[lbl])
            query += encodeURIComponent(lbl) + '=' + encodeURIComponent(param[lbl]) + '&';
         else
            query += encodeURIComponent(param[lbl]) + '&';

         if(!first)
            first = lbl;
      }

      query = query.substr(-1) == '&' ? query.substr(0, query.length-1) : query;

      if(param['q'])
         return '<a href="#search' + (encodeURIComponent(add) ? ('/' + encodeURIComponent(add) + '?') : '?') +  query + '">' + param['q'] + '</a>';

      return common.htmlspecialchars(def_title);
   },
   link:function(val, name, path)
   {
      return common.search({q:$.trim(val.replace(/<[^>]*>/ig, '')),p:name}, path);
   },
   tagging: function(val)
   {
      if (!val) return '';
      return val.replace('<br', "\n<br", 'ig').replace('</p>', "</p>\n\n", 'ig').replace(/<([^<>\s]*)(\s[^<>]*)?>/ig, '');
   },
   xtagging: function(text)
   {
    var CR = String.fromCharCode(13);
    var LF = String.fromCharCode(10);

    return ( '<p>' + text.replace(CR + CR, '</p><p>', 'g').replace(LF + LF, '</p><p>', 'g').replace(CR, '<br />', 'g').replace(LF, '<br />', 'g') + '</p>').replace('<p></p>', '<br />', 'g');
   },
   get_storage: function(key)
   {
      try
      {
         return Storage.get(key);
      }catch(e){}
         
      return null;
   },
   put_storage: function(key, val)
   {
      try
      {
         Storage.put(key, val);
      }catch(e){}
   },
   getHidebar: function($element)
   {
      var $hidebar = $element.parents('.hidebar');
      return $hidebar.length && $hidebar[0].hidebar ? $hidebar[0].hidebar : null;
   },

   isempty: function(val)
   {
      return (!val.length || !$.trim(val).length);
   },

   isemail: function(val)
   {
      if(common.isempty(val))
         return false;

      return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val);
   },
   equal: function(o1, o2)
   {
      if(
         (typeof(o1) != typeof(o2)) ||
         (typeof(o1) != 'object' && o1 != o2)
      )
         return false;

      var name1 = [], name2 = [];

      for(var n in o1)
         name1[name1.length] = n;

      for(var m in o2)
         name2[name2.length] = m;

      if(name2.length != name1.length)
         return false;

      function iscount(o)
      {
         var num = 0;
         for(var n in o)
         {
            if(num > 0)
               return true;
            num++;
         }

         if(num > 0)
            return true;

         return false;
      }

      for(var m in o2)
         if(
            (typeof(o1[m]) != 'object' && o1[m] != o2[m]) ||
            (typeof(o1[m]) == 'object' && iscount(o1[m]) && !common.equal(o1[m], o2[m])) ||
            (typeof(o1[m]) == 'object' && !iscount(o1[m]) && o1[m] != o2[m])
         )
            return false;

      return true;
   },
   log:function(str)
   {
      try
      {
         if(typeof(console) != 'undefined' && typeof(console.log) != 'undefined' )
            return console.log(str);
      }catch(e){}

      return false;
   },
   auth:function(val)
   {
      AUTH =
         typeof(val) == 'boolean' ?
         val :
         (
            typeof(AUTH) == 'boolean' ?
            AUTH :
            false
         );

      return AUTH;
   }
};
