jQuery(document).ready(function($) {

   $('.flashbox').click(function(){
      $flashbox = $(this);
      
      $flashbox.animate({
         height: "0",
         opacity: "0"
      }, 300, function(){
         $flashbox.hide();
      });
         
      $('body.w-flashbox #wrapper').animate({
         paddingTop: "16px"
      }, 200, function(){
        $('body.w-flashbox').removeClass('w-flashbox');
      });
   })
   
   if ($('.flashbox').hasClass('success') || $('.flashbox').hasClass('notice'))
      setTimeout(function() {
        $('.flashbox').click();
      }, 5000);
});

(function($){
   /*DropDown create & select*/
   dropdownSelect = function($list) {
      if (!$list || !$list.length) return this;
   
      var $listClone = $list.clone().removeClass("countrys");
      
      $dropDown = jQuery('<div class="dropdown-popup hidden"></div>');
      $dropDown = $list.before($dropDown).parent().find(".dropdown-popup");
      $dropDown.html($listClone);
      
     $('body').click(function() {
         $dropDown.addClass('hidden');
      });
      
     $(".dropdown-list").click(function(event) {
         event.stopPropagation();
      });
      
     $(".it-visible a", $list).click(function(event){
         
         $dropDown.toggleClass("hidden");
   
         return false;
      })
      
     $(".it-visible a", $dropDown).click(function(){
         $dropDown.toggleClass("hidden");
   
         return false;
      })
   }
   
   selectDays = function($list, $saveInp) {
      if (!$list || !$list.length) return this;
      
      $saveInp.addClass("hidden");
      
      $list.find(".pseudo").click(function(){
         var daysVal = '';
         $(this).parent().toggleClass("selected");
         
         $list.find("li").each(function() {
           daysVal += ($(this).hasClass("selected") ? 1 : 0);
         });
   
         $saveInp.val(daysVal + '');
         
         return false;
      })
   }
})(jQuery);