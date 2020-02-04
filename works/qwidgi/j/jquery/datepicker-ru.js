/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
jQuery(function($){
   $.datepicker.regional['ru'] = {clearText: 'Очистить', clearStatus: '',
      closeText: 'X', closeStatus: '',
      prevText: '&lt;',  prevStatus: '',
      nextText: '&gt;', nextStatus: '',
      currentText: 'Сегодня', currentStatus: '',
      monthNames: ['Января','Февраля','Марта','Апреля','Мая','Июня',
      'Июля','Августа','Сентября','Октября','Ноября','Декабря'],
      monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
      'Июл','Авг','Сен','Окт','Ноя','Дек'],
      monthStatus: '', yearStatus: '',
      weekHeader: 'Не', weekStatus: '',
      dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
      dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
      dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
      dayStatus: 'DD', dateStatus: 'D, M d',
      dateFormat: 'dd.mm.yy', firstDay: 1, 
      initStatus: '', isRTL: false};
   $.datepicker.setDefaults($.datepicker.regional['ru']);
});
