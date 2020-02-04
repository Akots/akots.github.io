/** Тип и версия браузера пользователя. Взято с jQuery */
userAgent = navigator.userAgent.toLowerCase();
browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

window.onload = function(){
   if ( (browser.msie && browser.version < 9) || (browser.opera && browser.version < 10) )
      document.getElementById("wrapper").className = '';
}