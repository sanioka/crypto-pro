import React, { useCallback } from "react";

function Message({ message, onChange }) {

  const onMessageChange = useCallback((event) => {
    onChange(event.target.value);
  }, [onChange])

  return (
    <div style={{ marginBottom: '15px'}}>
      <label htmlFor="message">Подписываемое сообщение: *</label>

      <br/>

      <textarea
        id="message"
        name="message"
        cols="80"
        rows="5"
        placeholder="Введите сообщение"
        value={message}
        onChange={onMessageChange}
        autoFocus
        required/>
    </div>
  );
}

export default React.memo(Message);
