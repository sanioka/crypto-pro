import React from 'react';

function Signature({signature, signatureStatus, signatureError}) {
  return (
    <>
      <label htmlFor="signature">Подпись (PKCS7):</label>

      <br/>

      <textarea
        id="signature"
        cols="80"
        rows="10"
        value={signature}
        placeholder={signatureStatus}
        readOnly/>

      <pre>{signatureError || null}</pre>
    </>
  )
}

export default React.memo(Signature);
