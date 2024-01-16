import { useCallback, useState } from "react";

const STATUS = {
  INIT: "STATUS_INIT",
  IN_PROGRESS: "STATUS_IN_PROGRESS",
  DONE: "STATUS_DONE",
  ERROR: "STATUS_ERROR"
};

export const useHashSignature = () => {
  const [hash, setHash] = useState("");
  const [hashStatus, setHashStatus] = useState("Не вычислен");
  const [hashError, setHashError] = useState(null);

  const [signature, setSignature] = useState("");
  const [signatureStatus, setSignatureStatus] = useState("Не создана");
  const [signatureError, setSignatureError] = useState(null);

  const resetHashSignature = useCallback(() => {
    setHash("");
    setHashError(null);

    setSignature("");
    setSignatureError(null);
  }, []);

  const setStatus = useCallback((status = STATUS.INIT, result = null) => {
    switch (status) {
      case STATUS.IN_PROGRESS:
        resetHashSignature();
        setHashStatus("Вычисляется...");
        setSignatureStatus("Создается...");
        break;

      case STATUS.DONE:
        setHashStatus("OK");
        setSignatureStatus("OK");

        setHash(result.hash.data);
        setSignature(result.signature.data);
        break;

      case STATUS.ERROR:
        setHashStatus("Не создана");
        setSignatureStatus("Не создана");

        if (result && result.hash && result.hash.error) setHashError(result.hash.error);
        if (result && result.signature && result.signature.error) setSignatureError(result.signature.error);
        break;

      case STATUS.INIT:
      default:
        resetHashSignature();
        setHashStatus("Не вычислен");
        setSignatureStatus("Не создана");
        break;
    }
  }, [resetHashSignature]);

  return {
    hash,
    setHash,
    hashStatus,
    setHashStatus,
    hashError,
    setHashError,
    signature,
    setSignature,
    signatureStatus,
    setSignatureStatus,
    signatureError,
    setSignatureError,
    resetHashSignature,
    setStatus,
    STATUS
  };
};
