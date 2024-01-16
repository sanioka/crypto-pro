import React from "react";

function SignButton({ disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}>
      Создать подпись
    </button>
  )
}

export default React.memo(SignButton)
