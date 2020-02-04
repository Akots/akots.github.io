	var validateUsername = function() {
	     var value = jQuery.trim($("#username").val());
	     if (value.length == 0 ) {
	          $("#check-result-callname").removeClass().show().addClass("error-massage").text("Please enter your callname");
	          return 2;
	     }
	
	     $.get("scripts/check.php", {
	          name: value
	     }, function(response) {
	          $("#check-process-callname").fadeOut();
	          if (response==1) {
	               $("#check-result-callname").removeClass().show().addClass("success").text("Username is availeble");
	               return 0;
	          } else {
						$("#username").one("blur",function(){$("#username").focus()});
	               $("#check-result-callname").removeClass().show().addClass("error-massage").text("Username is not availeble");
	               return 1;
	          }
	     });
	}//finish validate Username
	
	var validatePassword = function() {
		var pas = jQuery.trim($("#password").val());
		var pasconfirm = jQuery.trim($("#confirmpassword").val());
		$("check-result-password").hide();
		if (pas.length == 0 || pasconfirm.length == 0) {
			if (pas.length == 0) {
				$("check-result-password").hide();
				$("#password").one("blur",function(){$("#password").focus()});
				$("#check-result-password").show().text("Please enter your password");
				return 2;
				}
			else if (pasconfirm.length == 0  && pas.length !=0 ) {
				$("check-result-password").hide();
				$("#confirmpassword").one("blur",function(){$("#confirmpassword").focus()});
				return 3;
				}
			else if (pasconfirm.length == 0) {
				$("check-result-password").hide();
				$("#confirmpassword").one("blur",function(){$("#confirmpassword").focus()});
				return 3;
				}
			}
		else if (pasconfirm != pas) {
			/*$("#confirmpassword").one("blur",function(){$("#confirmpassword").focus()});*/
			$("#check-result-password").show().text("Passwords doesn't match");
			return 1;
			}
		else {
			$("#check-result-password").hide();
			return 0;
			}
	}//finish Password checking

	var validatePasswordVerify = function() {
		var pas = jQuery.trim($("#password").val());
		var pasconfirm = jQuery.trim($("#confirmpassword").val());
		$("check-result-password").hide();
		if (pas.length == 0 || pasconfirm.length == 0) {
			if (pas.length == 0 && pasconfirm.length != 0) {
				/*$("#password").one("blur",function(){$("#password").focus()});*/
				$("#check-result-password").show().text("Please enter your password");
				return 2;
				}
			else if (pasconfirm.length == 0 && pas.length != 0) {
				/*$("#confirmpassword").one("blur",function(){$("#confirmpassword").focus()});*/
				$("#check-result-password").show().text("Please enter verify password");
				return 3;
				}
			}
		else if (pasconfirm != pas) {
			/*$("#confirmpassword").one("blur",function(){$("#confirmpassword").focus()});*/
			$("#check-result-password").show().text("Passwords doesn't match");
			return 1;
			}
		else {
			$("#check-result-password").hide();
			return 0;
			}
	}//finish Password checking

	var validatePhone = function() {
		var pho = jQuery.trim($(this).val());
		$("#check-result-phone").hide();
		
		if ( pho.length != 0 ) {
			$('#check-result-' + $(this).attr('id')).hide();
			if ( !/^\+?\d\(?\d+\)?[\d\-]+$/.test(pho)){
				/*$(this).one("blur", function(){$(this).focus()});*/
				$('#check-result-' + $(this).attr('id')).show().text("Please enter a valid phone number");
				disableButton();
				return 1;
			}
			else {
				return 0;
				}
		}
		if ( $(this).attr('id') === 'mobilphone' && pho.length == 0 ) {
			$("#check-result-mobilphone").hide();
			/*$("#mobilphone").one("blur", function(){$("#mobilphone").focus()});*/
			$("#check-result-mobilphone").show().text("Please enter your phone number");
			return 2;
		}
	}//finish validate Phone
	
	var validateNumericFields = function() {
		var value = $(this).val();
		$('#check-result-' + $(this).attr('id')).hide();
		if ( value != 0 ) {
			if ( !/^\d+[\d-]+$/.test(value)){
					$('#check-result-' + $(this).attr('id')).hide();
					/*$(this).one("blur",function(){$(this).focus()});*/
					$('#check-result-' + $(this).attr('id')).text("Please enter a non-numeric characters in these field").show();
					disableButton();
					return 1;
				}
			else {
				$('#check-result-' + $(this).attr('id')).hide();
				return 0;
			}
		}
	}//finish validate Numeric Fields
	
	var validateMail = function() {
		var mal = jQuery.trim($("#mail").val());
		$("#check-result-mail").hide();
		if ( mal != 0 ) {
			$("#check-result-mail").hide();
			
			if ( !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(mal) ) {
			/*$("#mail").one("blur",function(){$("#mail").focus()});*/
			$("#check-result-mail").show().text("Mail not valid");
			disableButton();
			return 1;
			}
		}
		else {
			return 0;
			}
	}//finish validate Mail

	$('#register-form').submit(function(){
		form.submit();
		return false;
	});

	var disableButton = function() {
		$("#button-save").addClass("disable-button");
		}
		
	var validateSubmit = function() {
	$("#username").blur();
	$("#password").blur();
	$("#confirmpassword").blur();
	$("#mobilphone").blur();
	$("#editmobilphone").blur();

	$("#mail").blur();
	$("#icq").blur();
	$("#skype").blur();
	$("#homephone").blur();
	$("#fax").blur();
	$("#officephone").blur();
	$("#vpnphone").blur();

	var errorBox = $("p.error-massage:visible:first");
	if (errorBox.attr('id') != undefined){
		var inputId = errorBox.attr('id').replace(/check-result-/, '');
		$("#" + inputId).focus();
		return false;
		}
		else {
			//console.log("Show now " + $(".button").attr('id'));
			$(".success-msg").fadeIn("slow");
			$("#button-save").addClass("disable-button");
			$("#button-save").select().focus();
			return false;
			}
		
	}//finish validate Submit form


$(document).ready(function(){	

	$(".button").mousedown(function(){
		if ($(this).attr('class') == "button disable-button") {
		//console.log("Show now ");
		return false; 
		}
		else {
			//console.log("Show update ");
			validateSubmit();
		}
	});
	
	$("#username").blur(validateUsername);
	$("#password").blur(validatePassword);
	$("#confirmpassword").blur(validatePasswordVerify);
	$("#mobilphone").blur(validatePhone);
	$("#editmobilphone").blur(validatePhone);
	
	$("#mail").blur(validateMail);
	$("#icq").blur(validateNumericFields);
	$("#homephone").blur(validatePhone);
	$("#fax").blur(validatePhone);
	$("#officephone").blur(validatePhone);
	$("#vpnphone").blur(validatePhone);

	$("#button-save").addClass("disable-button");

	$("#main input").keydown(function(){
		$(".button-save").addClass("disable-button");
	});
	$("input").blur(function(){
		var errorBox = $("p.error-massage:visible:first");
		if (errorBox.attr('id') != undefined){
			//console.log("Show errors ");
			$(".success-msg").hide();
			$("#button-save").addClass("disable-button");
			}
		else {
			//console.log("Show now ");
			$(".success-msg").hide();
			$(".button-save").removeClass("disable-button");
			}
	});
		
});