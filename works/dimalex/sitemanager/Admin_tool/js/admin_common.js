$(document).ready(function() 
{
	$('.search .add-filter.pseudo').click(function(){
	   var searchBoxes = $('.search fieldset.hidden').length;

	   if (searchBoxes)
         $('.search fieldset.hidden:first').removeClass("hidden").find(".inputbox").focus();

      if (searchBoxes == 1)
         $('.search .add-filter').removeClass("pseudo").addClass("disabled");
      
      return false;
   })
   
   $('.toogle-show').click(function(){
      if ($(this).hasClass("expanded"))
         $(this).text("more");
      else
         $(this).text("less");
         
      $(this).toggleClass("expanded");
      var $mes = $(this).parent().find('.last-mes');
      $mes.toggleClass("hidden");
      $mes.parent().find(".mes-separator").toggleClass("hidden");
      
      return false;
   })
   
   var $tabsCont = $("#main");
   
   $(".tabs a", $tabsCont).click(function(){
      var $link = $(this);
      var spName = $link.parent().attr("id");

      $(".tabs li").removeClass("selected");
      $link.parent().addClass("selected");
      $(".tab-entry", $tabsCont).addClass("hidden");
      
      $tabsCont.find(".tab-entry." + spName).removeClass("hidden");
      
      
      return false;
   });
   
});