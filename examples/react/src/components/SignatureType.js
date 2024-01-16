import React, { useCallback } from "react";

function SignatureType({ isDetachedSignature, onChange }) {

  const onTypeToggle = useCallback((event) => {
    const value = parseInt(event.target.value);
    onChange(!!value);
  }, [onChange])

  return (
    <>
      <label>Тип подписи: *</label>

      <br/>

      <label>
        <input
          type="radio"
          checked={!isDetachedSignature}
          value={0}
          onChange={onTypeToggle}/>Совмещенная</label>

      <br/>

      <label>
        <input
          type="radio"
          value={1}
          checked={isDetachedSignature}
          onChange={onTypeToggle}/>Отделенная</label>
    </>
  )
}

export default React.memo(SignatureType);
