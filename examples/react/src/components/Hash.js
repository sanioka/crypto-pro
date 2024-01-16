import React from "react";

function Hash({ hashData }) {
  const { hash, hashStatus, hashError } = hashData;

  return (
    <>
      <label htmlFor="hash">Хеш (ГОСТ Р 34.11-2012 256 бит):</label>

      <br />

      <textarea
        id="hash"
        cols="80"
        rows="5"
        value={hash}
        placeholder={hashStatus}
        readOnly />

      <pre>{hashError || null}</pre>
    </>
  );
}

export default React.memo(Hash);
