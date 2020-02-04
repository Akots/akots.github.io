(function(){

var info = function($obj, options){

   this.init = function()
   {
      title.set(options.title || '');
   }
   this.init();

   $obj.html(options.html);
}

$.fn.info = function(options)
{
   var $obj = this;
   options.url = options.url;
   options.html = options.html || ''; 

   layout.intfse.load(
   {
      url: options.url,
      verify: function(){ return options.html.length; },
      next: function()
      {
         common.intrfc($obj, info, options);
      },
      callback: function(data){ return common.cache[options.url] = options.html = data; }
   });   common.intrfc(this, info, options);

   return this;
}})();