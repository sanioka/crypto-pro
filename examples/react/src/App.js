import React, { useCallback, useEffect, useState } from "react";

import Message from "./components/Message";
import Certificate from "./components/Certificate";
import SignatureType from "./components/SignatureType";
import Hash from "./components/Hash";
import Signature from "./components/Signature";
import CustomSystemInfo from "./components/CustomSystemInfo";
import SystemInfo from "./components/SystemInfo";
import SignButton from "./components/SignButton";
import SignCheckDescription from "./components/SignCheckDescription";

import { createSignature } from "./helper/createSignature";
import { useHashSignature } from "./hooks/useHashSignature";

function App() {
  const [message, setMessage] = useState("Привет мир!");
  const [certificate, setCertificate] = useState(null);
  const [isDetachedSignature, setDetachedSignature] = useState(true);

  const {
    hash,
    hashStatus,
    hashError,
    signature,
    signatureStatus,
    signatureError,
    setStatus,
    STATUS
  } = useHashSignature();

  // Удаляем результаты вычислений при изменении пользовательских данных
  useEffect(
    () => setStatus(STATUS.INIT),
    [certificate, message, isDetachedSignature, setStatus, STATUS]
  );

  const submitHandler = useCallback(async (event) => {
    event.preventDefault();

    setStatus(STATUS.IN_PROGRESS);

    try {
      const result = await createSignature({ thumbprint: certificate.thumbprint, message, isDetachedSignature });

      if (result.hash.error || result.signature.error) {
        setStatus(STATUS.ERROR, result);
        return;
      }

      setStatus(STATUS.DONE, result);
    } catch (e) {
      setStatus(STATUS.ERROR);
      console.error(e);
    }
  }, [certificate, isDetachedSignature, message, setStatus, STATUS]);

  return (
    <>
      <form onSubmit={submitHandler} noValidate>
        <fieldset>
          <legend>Создание подписи</legend>
          <Message message={message} onChange={setMessage} />
          <Certificate certificate={certificate} onChange={setCertificate} />
          <SignatureType isDetachedSignature={isDetachedSignature} onChange={setDetachedSignature} />

          <hr />
          <SignButton disabled={!certificate || !message} />
        </fieldset>
      </form>

      <fieldset style={{ marginTop: "15px", marginBottom: "15px" }}>
        <legend>Результат</legend>
        <Hash hash={hash} hashStatus={hashStatus} hashError={hashError} />
        <Signature signature={signature} signatureStatus={signatureStatus} signatureError={signatureError} />
        <SignCheckDescription />
      </fieldset>

      <fieldset>
        <legend>Информация о системе</legend>
        <CustomSystemInfo />
        <SystemInfo />
      </fieldset>
    </>
  );
}

export default App;
