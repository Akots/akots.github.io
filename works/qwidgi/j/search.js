(function(){

function srch($obj, options)
{
   var srch = this;

   if(options.html)
      $obj.html(options.html);

   $obj.find('.tab').hide();
   var searchControl = null;

   options.o = options.o || 'office';
   options.q = options.q ? decodeURIComponent(options.q) : '';
   options.p = options.p || '';
   var me = this;

   this.needReset = function(new_options)
   {
      return !(new_options.q != options.q);
   }

   function result(data)
   {
      $obj.find('.message_wrap').remove();
      var $lftcol = $obj.find('#lftcol-groups');

      function nofind($cont)
      {
         return $cont.empty().append('<span>Ничего не найдено</span>');
      }


      if (Number(data.count.offices))
      {
         var $list = $obj
            .find('.office.tab')
            .empty()
            .append('<div class="lftcol-groups-items"><ul class="menu"></ul></div><div class="view"></div>')
            .find('.menu')

         $(data.offices).each(function(i, o)
         {
            $list.append('<li class="title"><a href="javascript:void(0)" class="title o' + o.company_id + '"></a></li>')
               .find('.o' + o.company_id)
               .text(this.name)
               .click(function()
               {
                  $list.find('.active').removeClass('active');

                  $(this).addClass('active');

                  var $view =
                     $obj.find('.office.tab .view')
                        .empty()
                        .addClass('loading');

                  $view
                     .officeInfo
                     (
                        {
                           id:o.company_id,
                           edit:false,
                           end:function()
                           {
                              $view.removeClass('loading');
                           }
                        }
                     );
               })
               .append('<em></em>')
               .find('em')
               .text(o.place);
         });

         $list.find('li.title:first a').click();
      }
      else
         nofind($obj.find('.office.tab'));


      if (Number(data.count.persons)) {
         $obj.find('.people.tab').empty().addPerson(
            data.persons,
            {
               type: 3,
               is_voited_access: false
            }
         );
      }
      else
         nofind($obj.find('.people.tab'));

      if (Number(data.count.vacancies))
      {
         $obj.find('.vacancy.tab').empty().addVacancyCard(data.vacancies);
      }
      else
         nofind($obj.find('.vacancy.tab'));

      googleInit();

      $lftcol.find('.new_count').remove();

      $lftcol.find('.people a').append('<span class="new_count">' + data.count.persons + '</span>');
      $lftcol.find('.office a').append('<span class="new_count">' + data.count.offices + '</span>');
      $lftcol.find('.vacancy a').append('<span class="new_count">' + data.count.vacancies + '</span>');

      options.o = options.o || 'office';

      $obj.find('#lftcol-groups a').each(function(i, o)
      {
         o.href = o.href.replace(/\?.*/ig, '') + '?q=' + encodeURIComponent(options.q)
      });
   }

   var googleInit = function()
   {
      if(!searchControl)
      {
         var googleCont = $obj.find('.google.tab');
         // Create a search control
         searchControl = new google.search.SearchControl();

         // all searchers will run in large mode
         searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
      
         // Add in a full set of searchers
         var localSearch = new google.search.LocalSearch()
         searchControl.addSearcher(localSearch);
         searchControl.addSearcher(new google.search.WebSearch());
         searchControl.addSearcher(new google.search.VideoSearch());
         searchControl.addSearcher(new google.search.BlogSearch());
         searchControl.addSearcher(new google.search.NewsSearch());
         searchControl.addSearcher(new google.search.ImageSearch());
         searchControl.addSearcher(new google.search.BookSearch());
         searchControl.addSearcher(new google.search.PatentSearch());
         // Tell the searcher to draw itself and tell it where to attach
         searchControl.draw(googleCont[0]);

         localSearch.setCenterPoint(google.loader.ClientLocation.region + ', ' + google.loader.ClientLocation.country);
      }

      // Execute an inital search
      searchControl.execute(options.q);

      $obj.find('table.gsc-search-box').hide();
   }

   var init = function()
   {
      common.log('search.init: ' + decodeURIComponent(options.q));

      if (options.q.length > 2 && typeof(common.cache['serach_' + options.q + '_' + options.p]) != 'object')
      {
         $.post(
            '/interface/search',
            {
               q: options.q,
               p: options.p
            },
            function(data)
            {
               common.cache['serach_' + options.q + '_' + options.p] = data;

               result(data);
            },
            'json'
         );
      }else if (options.q.length > 2 && typeof(common.cache['serach_' + options.q + '_' + options.p]) == 'object')
      {
         result(common.cache['serach_' + options.q + '_' + options.p]);
      }else
      {
         (new messg($obj)).show('Длина запроса должна быть не менее трех символов');
      }
   }

   this.init = function(o)
   {
      if(o && o.q != options.q)
      {
         init();
         $.extend(options, o);
      }else if(o) 
         $.extend(options, o);

      $obj.find('.tab').hide();
      $obj.find('.' + options.o + '.tab').show();

      $obj.find('.ui-tabs-selected').removeClass('ui-tabs-selected');
      $obj.find('li.' + options.o).addClass('ui-tabs-selected');
   }

   init();
   me.init();

   return this;
}

jQuery.fn.search = function(options)
{
   if (!this.length)
    return this;

   var $obj = this;

   options = options || {};

   options.html = options.html || '';
   options.url = options.cont || options.url || '';

   title.set('Поиск');

   common.log('init search: ' + decodeURIComponent(options.q));

   if(!options.url || !common.cache[options.url])
      layout.intfse.load(
      {
         url:options.url,
         verify:function(){return options.html && options.html.length;},
         next: function()
         {
            common.intrfc($obj, srch, options);
         },
         callback:function(data){return common.cache[options.url] = options.html = data;}
      });
   else
   {
      options.html = common.cache[options.url];
      common.intrfc($obj, srch, options);
   }

   return this;
}
})();
