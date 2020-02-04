(function(){

function userProfile($obj, options)
{
   if (!$obj.length)
      return $obj;

   var options = options ? options : {};

   if(options.html)
     $obj = $obj
        .empty()
        .html(options.html);

   options.layout = $obj.addClass('loading');
   var info = false;

   this.start = function($userPage, options)
   {

      function reviewEdEm($obj)
      {

         var countJob = 0;
         var countSchools = 0;

         function is_empty($this)
         {
            return !$this.hasClass('pattern') && !$this.hasClass('delete') && !$this.hasClass('empty_all');
         }

         $obj.find('#work .hidebar_content .job').each(function()
         {
            if(is_empty($(this)))
               countJob++;
         });

         $obj.find('#educ .hidebar_content div.highschool,#educ .hidebar_content div.school').each(function()
         {
            if(is_empty($(this)))
               countSchools++;
         });

         if(!countJob)
            $obj.find('#work').hide();

         if(!countSchools)
            $obj.find('#educ').hide();
      }


      info = $userPage.find('#profile').userInfo($.extend(
      {
         hasTopTabs : true,
         isTitle    : true,
         reviewEdEm : reviewEdEm,
         end        : function(data)
         {
            options.layout.removeClass('loading');

            var storage_toggle = function(name, show)
            {
               common.put_storage('state_' + name, show ? 0 : 1);
            }

            $userPage.find('#secondary-info').hidebar(
            {
               ontoggle : function(show){storage_toggle('secondary-info', show)},
               close    : Number(common.get_storage('state_secondary-info')) == 1 ? true : false
            });

            var EdEmEnd = 2;
            function onEdEmEnd()
            {
               EdEmEnd--;
               if(!EdEmEnd)
                  reviewEdEm($userPage);
            }

            $userPage.find('#educ').educ_lists(
            {
               user_id : data.id,
               edit:false,
               end:function()
               {
                  $userPage.find('#educ').hidebar(
                  {
                     ontoggle : function(show){storage_toggle('educ', show)},
                     close    : Number(common.get_storage('state_educ')) == 1 ? true : false
                  });

                  onEdEmEnd();
               }
            });

            $userPage.find('#work .hidebar_content').work_places(
            {
               user_id : data.id,
               edit:false,
               end:function()
               {
                  $userPage.find('#work').hidebar(
                  {
                     ontoggle : function(show){storage_toggle('work', show)},
                     close    : Number(common.get_storage('state_work')) == 1 ? true : false
                  });

                  onEdEmEnd();
               }
            });

         }
      },options));
   }

   this.clear = function()
   {
      if(title.$cont != null && typeof(title.$cont) == 'object' && title.$cont.length)
         title.$cont.find('#edit-profile,#page-functional,#profile-tabs').remove();
   }

   this.init = function()
   {
      if(info && info.length && info[0].intrfc)
         info[0].intrfc.init();
   }

   this.start($obj, options);

   return this;
}

﻿$.fn.userProfile = function(options)
{
   options = options || {};
   options.html = options.html || common.cache[options.url] || '';

   var me = this;

   icon.run(
      {
         url:options.url,
         html:options.html
      },
      options,
      function(html)
      {
         common.intrfc(me, userProfile, $.extend(options, {html:html}));
      }
   );
   return this;
}})();
