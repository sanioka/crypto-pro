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
import { useHashSignature, STATUS } from "./hooks/useHashSignature";

function App() {
  const [message, setMessage] = useState("Привет мир!");
  const [certificate, setCertificate] = useState(null);
  const [isDetachedSignature, setDetachedSignature] = useState(true);

  // Стейты для отображения вычисленного хеша/эцп выведены в отдельный хук
  const { hashData, signatureData, setHashSignature } = useHashSignature();

  // Сбрасываем хеш/эцп, если пользователь меняет входящие данные (другое сообщение, другой сертификат итд)
  useEffect(
    () => setHashSignature(STATUS.INIT, { reset: true }),
    [certificate, message, isDetachedSignature, setHashSignature]
  );

  // Метод сводит модель данных и UI через интерфейс result
  const onSubmitController = useCallback(async (event) => {
    const { IN_PROGRESS, DONE, ERROR } = STATUS;
    event.preventDefault();

    setHashSignature(IN_PROGRESS, { reset: true });

    try {
      // Модель данных отделена от view
      const result = await createSignature({ thumbprint: certificate.thumbprint, message, isDetachedSignature });

      if (result.hash.error || result.signature.error) {
        setHashSignature(ERROR, { result });
        return;
      }

      setHashSignature(DONE, { result });
    } catch (e) {
      setHashSignature(ERROR);
      console.error(e);
    }
  }, [certificate, isDetachedSignature, message, setHashSignature]);

  return (
    <>
      <form onSubmit={onSubmitController} noValidate>
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
        <Hash hashData={hashData} />
        <Signature signatureData={signatureData} />
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
