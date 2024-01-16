import React from "react";

function SignCheckDescription() {
  return (
    <p>
      Для <a href="https://www.gosuslugi.ru/pgu/eds/"
             target="_blank"
             rel="nofollow noopener noreferrer"
             title="Перейти к проверке подписи">проверки</a> нужно
      создать файл со сгенерированной подписью в кодировке UTF-8 с расширением *.sgn
      <br />
      для отделенной подписи (или *.sig для совмещенной).
    </p>
  )
}

export default React.memo(SignCheckDescription)
