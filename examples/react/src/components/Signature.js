import React from "react";

function Signature({ signatureData }) {
  const { signature, signatureStatus, signatureError } = signatureData;

  const lengthData = signature && signature.length ? `(PKCS7, length = ${signature.length} symbols)` : '(PKCS7)'

  return (
    <>
      <label htmlFor="signature">Подпись {lengthData}:</label>

      <br />

      <textarea
        id="signature"
        cols="80"
        rows="10"
        value={signature}
        placeholder={signatureStatus}
        readOnly />

      <pre>{signatureError || null}</pre>
    </>
  );
}

export default React.memo(Signature);
