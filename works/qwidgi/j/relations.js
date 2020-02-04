(function(){
﻿
$.fn.relations = function(params)
{
   if (!this.length)
      return this;

   params = params || {};

   var init = function($relations, params)
   {
      var currnent_id = null;
      var partners_init = false;
      var competitors_init = false;
      var corporations_init = false;

      var $partners = $relations.find('.page.partners');
      var $competitors = $relations.find('.page.competitors');
      var $corporations = $relations.find('.page.corporations');
      var count_relations = {};

      var $tab_partners = $relations.find('.tab.partners .num');
      var $tab_competitors = $relations.find('.tab.competitors .num')
      var $tab_corporations = $relations.find('.tab.corporations .num')
      var $quick_menu_template = $relations.find('.menu.icon').remove();

      if(!params.edit)
         $quick_menu_template.find('.accept').remove();

      if(!params.edit)
         $quick_menu_template.find('.delete,.change_relation').remove();

      function view($a, o, type)
      {
         currnent_id = o.company_id;
         $relations.find('.active').removeClass('active');
         $a.addClass('active');

         $relations.find('.company-view')
            .empty()
            .append(params.templateProfile.clone())
            .addClass('loading')
            .officeInfo
            (
               {
                  id:o.company_id,
                  edit:false,
                  end:function()
                  {
                     $relations.find('.company-view').removeClass('loading');

                     quick_menu($a, o, type, $relations.find('.profile_comp-header .wrap_menu'));
                  }
               }
            );
      }

      function add($cont, o, type)
      {
         var $title = $pattern.clone().addClass('o' + o.company_id);

         $cont.append($title);

         var $a = $title.find('a');

         $a
            .text(o.name)
            .click(function()
            {
               view($a, o, type);
            });

         quick_menu($a, o, type, $title).wrap('<div class="submenu"></div>').parent().before('<div class="tools"></div>');

         return $a;
      }

      function quick_menu($a, o, type, $con)
      {
         function onDelete(data){
            if (type == 2)
               $tab_competitors.text('(' + (--count_relations.count_competitors) + ')');
            else if (type == 3)
               $tab_corporations.text('(' + (--count_relations.count_corporations) + ')');
            else
               $tab_partners.text('(' + (--count_relations.count_partners) + ')');
         }

         function onChangeRelation(data, to_type)
         {
            if (type == 2)
               $tab_competitors.text('(' + (--count_relations.count_competitors) + ')');
            else if (type == 3)
               $tab_corporations.text('(' + (--count_relations.count_corporations) + ')');
            else
               $tab_partners.text('(' + (--count_relations.count_partners) + ')');


            if (to_type == 2)
               $tab_competitors.text('(' + (++count_relations.count_competitors) + ')');
            else if (to_type == 3)
               $tab_corporations.text('(' + (++count_relations.count_corporations) + ')');
            else
               $tab_partners.text('(' + (++count_relations.count_partners) + ')');

            return add(to_type == 2 ? $competitors : (to_type == 3 ? $corporations : $partners), data, to_type);
         }

         var $quick_menu = $quick_menu_template
            .clone()
            .addClass('c_' + o.company_id)
            .appendTo($con);

         $quick_menu.find('.header span').text(o.name);

         if(params.edit && !o.accept)
            $quick_menu_template.find('.accept').remove();

         var $relation_menu = $quick_menu.find('.change_relation ul').hover(
            function()
            {
               $relation_menu.addClass('show');
            },
            function()
            {
               $relation_menu.removeClass('show');
            }
         );

         $quick_menu.find('.change_relation a.icon').click(function()
         {
            $relation_menu.addClass('show');
         });

         $(document).click(function(event)
         {
            var $target = $(event.target);
            if (
               $quick_menu.length && 
               (!$target.parents('.c_' + o.company_id).length ||
               !$target.parents('.change_relation').length) 
            )
            {
               $relation_menu.hide();
            }
         });

         var $send_message_menu = $quick_menu.find('.send_message .message_box').hide();
         $quick_menu.find('.send_message a.icon').click(function()
         {
            common.log('send_message');

            $send_message_menu.show();
            $send_message_menu.find('.message').focus();
         });

         $quick_menu.find('.send_message .message_box .close_message_box').click(function()
         {
            $(this).parents('.message_box').hide();
         });

         $quick_menu.find('.send_message .message_box .body .submit').click(function()
         {
            var $submit = $(this);
            var $message = $quick_menu.find('.send_message .message_box .body .message');
            if ($message.length && $.trim($message.val()).length)
            {
               $submit.attr('disabled', 'disabled');
               $.post(
                 '/office/' + o.company_id + '/add_resp',
                 {
                   comp_id : o.company_id,
                   text     : $message.val()
                 },
                 function(data)
                 {
                    $message.val('');
                    $submit.removeAttr('disabled');

                   if (data && data.sc)
                     $submit.parents('.message_box').hide('normal');

                   $quick_menu.find('.send_message .message_box .close_message_box').click()
                 },
                 'json'
               );
             }
             return false;
         });

         var param = 
         {
            comp_id_to_delete : o.company_id,
            comp_id           : params.comp_id
         }

         $quick_menu.find('.delete').click(function()
         {
            common.log('delete');

            var $this = $(this).attr('disabled', 'disabled');

            $.post(
               '/office/' + params.comp_id + '/relation/delete',
               param,
               function(data)
               {
                  if (data && data.sc)
                  {
                     $relations.find('.company-view').children().hide();
                     $a.parent().hide();

                     if($a.parent().next().length)
                        $a.parent().next().find('>a').click();

                     onDelete(o);

                     (new messg($relations.find('.company-view'))).action(function()
                     {
                       $a.parent().show().click();

                       $.post(
                         '/office/' + params.comp_id + '/relation/delete',
                         $.extend({undo:true}, param),
                         function(){
                         },
                         'json'
                       );
                     },function()
                     {
                        $a.parent().remove();
                        $quick_menu.parent().remove();
                     });
                  }
               },
               'json'
            );
            return false;
         });

         if (type)
         {
            if (type == 2)
               $relation_menu.find('.to_competitors').parent().remove();
            else if (type == 3)
               $relation_menu.find('.to_corporations').parent().remove();
            else 
               $relation_menu.find('.to_partner').parent().remove();
         }

         $relation_menu.find('a').click(function()
         {
            common.log('relation_change');

            var $this = $(this);

            $.post(
               '/office/' + params.comp_id + '/relation/change',
               {
                  comp_id_to_change : o.company_id,
                  comp_id           : params.comp_id,
                  to_type           : Number($this.attr('to_type'))
               },
               function(data){
                  if (data && data.sc)
                  {
                     onChangeRelation(o, Number($this.attr('to_type'))).click();
                     $a.parent().remove();
                     $quick_menu.parent().remove();
                  }

               },
               'json'
            );
            return false;
         });

         $quick_menu.find('.join').click(function(){
            $.post(
               '/u/join',
               {
                  comp_id: o.company_id
               },
               function(data){
                  if (data && (data.sc == true || data.sc))
                  {
                     $quick_menu.find('.join').remove();
                  }
               },
               'json'
            );
            return false;
         });

         $quick_menu.find('.relations').click(function(){
            location.href = '#' + o.relations_url.substr(1);
            return false;
         });

         $quick_menu.find('.accept').click(function()
         {

             $.post(
               '/office/' + params.comp_id + '/relation/accept',
               {
                  comp_id_to_accept : o.company_id,
                  comp_id           : params.comp_id
               },
               function(data){
                  if (data && data.sc)
                  {
                     $quick_menu.removeClass('no_accept');
                     $quick_menu.find('.accept').remove();
                  }

               },
               'json'
            );
            return false;
         });
         return $quick_menu;
      }
      
      
      $.post(
         '/office/' + params.comp_id + '/relation/count',
         {comp_id  : params.comp_id},
         function(data)
         {
            if (params.onRecieveData)
               params.onRecieveData(data, params.edit);

            if (
               data && 
               data.count_partners != null && 
               data.count_competitors != null && 
               data.count_corporations != null
            )
            {
                data.count_partners = Number(data.count_partners);
                data.count_competitors = Number(data.count_competitors);
                data.count_corporations = Number(data.count_corporations);

                count_relations = data;

                $tab_partners.text('(' + data.count_partners + ')');
                $tab_competitors.text('(' + data.count_competitors + ')');
                $tab_corporations.text('(' + data.count_corporations + ')');
            }
         },
         'json'
      );

      var $pattern = $relations.find('.title.pattern').removeClass('pattern');
      var first = true;

      var partnersLoad = function(type)
      {
         var $cont = (type == 1 ? $partners : (type == 2 ? $competitors : $corporations) ).empty();

         $.post(
            '/office/' + params.comp_id + '/relation/get',
            {
               comp_id : params.comp_id,
               type    : type
            },
            function(data)
            {
               $(data).each(function(i, o)
               {
                  var $title = add($cont, o, type);

                  var $current = false;
                  var $submenu = false;

                  var hide = function(s)
                  {
                     if(hover && s != true)
                        return;

                     if($submenu && $current)
                     {
                        $current.append(
                           $submenu.removeClass('.submenu_active').hide()
                        );

                        $current.find('a').removeClass('hover');
                        $current.find('.send_message .message_box')
                     }

                     hover = $current = $submenu = false;
                  };

                  var hover = false;

                  $title.parent().find('.tools').click(
                     function()
                     {
                        $current = $(this).parent();
                        $submenu = $current.find('.submenu');

                        var c = $current.offset();
                        c.left += $current.width()-$submenu.width()+30;
                        c.top += 5;

                        $current.find('a').addClass('hover');

                        $(document.body).append(
                           $submenu.css(c).addClass('submenu_active')
                           .hover(function()
                           {
                              hover = true;
                              $submenu = $(this).show();
                              $current.find('a').addClass('hover');
                           }, function()
                           {
                              hide(true);
                           })
                           .show()
                        );
                     });

                  if(first)
                  {
                     first = false;

                     view($title, o, type);
                  }
               });
            },
            'json'
         );
      }

      var tab_selected = function(tab)
      {
         $relations.find('.ui-tabs-selected').removeClass('ui-tabs-selected');
         $relations.find('.tab.' + tab).addClass('ui-tabs-selected');
      }

      partnersLoad(1);
      partnersLoad(2);
      partnersLoad(3);

      
      tab_selected('partners');
      tab_selected('competitors');
      tab_selected('corporations');

      return $relations;
   }

   return common.init(this, init, params);
}})();
