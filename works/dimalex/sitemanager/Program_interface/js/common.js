$(document).ready(function() 
{
   /*Login popup*/
   $(".modal-window.cat-manage").jqm({toTop:true, trigger: '.trigger-cat-add'});
   
   $(".modal-window.trash-list-manage").jqm({toTop:true, trigger: '.trash-list.action'});
   
   $(".modal-window.move-list-manage").jqm({toTop:true, trigger: '.move-selected.action'});

	$('.system-mess').click(function(){
      $flashbox = $(this);

      $flashbox.animate({
         height: "0",
         opacity: "0"
      }, 300, function(){
         $flashbox.hide();
      });
   })
   
   if ($('.system-mess').length)
      setTimeout(function() {
         $('.system-mess').click();
      }, 6000); 
});