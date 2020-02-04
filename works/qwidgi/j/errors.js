(function(){

function errors($obj, options)
{

   var error = 
   {
      '401':'У вас нет права просматривать эту страницу',
      '404':'Такой страницы на сервере нет',
      '403':'В данный момент мы не можем обработать ваш запрос, извините',
      '500':'Произошла ошибка при выполнении вашего запроса'
   };

   title.set((error[options.st] ? error[options.st]  + ' (' + options.st + (options.cd ? ':' + options.cd : '') + ')' : 'Ошибка ' + options.st + (options.cd ? ':' + options.cd : '') ));

   $obj.html(
      '<p>' + options.mg + '</p>' +
      '<p>Мы уже занем об этой ошибке и письмо об этом отправлено ответственному</p>' +
      '<p>Если вы по каким-либо причинам считаете что необходимо дополнительно сообщить о ней вы можете написать нам по адресу <a href="mailto:support@qwidgi.com">support@qwidgi.com</a></p>' +
      '<p>Мы нижайше просим вернуться к <a href="/">началу сайта</a>, в <a href="/">Вашу виджетницу</a></p>'
   );

   $('#errors_view').corner();

   return this;
}


$.fn.errors = function(options)
{
   return common.intrfc(this, errors, options);
}


})();
