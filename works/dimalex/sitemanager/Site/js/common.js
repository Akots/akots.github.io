$(document).ready(function() 
{

	$('.tg-signin').click(function(){
      panelToogle($(".over-panel.signin"));
      
      return false;
   })
   
   $('.tg-register').click(function(){
      panelToogle($(".over-panel.register"));
      
      return false;
   })
   
   $(".over-panel .cancel").click(function(){
      var $overPanel = $(this).parents('.over-panel');
      panelToogle($overPanel);
      
      return false;
   });
   
});

function panelToogle($overPanel) {

   if ($overPanel.hasClass('show')) {
      $overPanel.animate({
         height: 'hide'
      }, 200,
      function(){
         $overPanel.removeClass("show")
      });
   }
   else
   {
      $overPanel.animate({
         height: 'show'
      }, 200,
      function(){
         $overPanel.addClass("show")
      });
   }
}

