//const send = require("m06_paa");
const send = require("m06_paa");

const message = 'Привет, это сообщение отправлено из модуля m06_paa из задания 06-04';

send.send("spottymotor@mail.ru", "0Bce3i1K9kbR39jqYqNd", "spottymotor@mail.ru", message)
  .then(response => console.log(`Письмо успешно отправлено: ${response}`))
  .catch(error => console.log(`Ошибка при отправке письма: ${error}`));