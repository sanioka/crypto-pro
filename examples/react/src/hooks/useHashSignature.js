import { useCallback, useMemo, useState } from "react";

// Статусы получения ЭЦП
export const STATUS = {
  INIT: "STATUS_INIT",
  IN_PROGRESS: "STATUS_IN_PROGRESS",
  DONE: "STATUS_DONE",
  ERROR: "STATUS_ERROR"
};

/**
 * Основа для отображения сформированных хеша/эцп
 * Выведено в отдельный файл, отделено от модели данных, данные поступают через переменную result
 */
export const useHashSignature = () => {
  const [hash, setHash] = useState("");
  const [hashStatus, setHashStatus] = useState("Не вычислен");
  const [hashError, setHashError] = useState(null);

  const [signature, setSignature] = useState("");
  const [signatureStatus, setSignatureStatus] = useState("Не создана");
  const [signatureError, setSignatureError] = useState(null);

  /**
   * Общая точка входа на изменение стейтов
   */
  const setHashSignature = useCallback((status = STATUS.INIT, { result, reset = true } = {}) => {
    const resetHashSignature = () => {
      setHash("");
      setHashError(null);

      setSignature("");
      setSignatureError(null);
    };

    switch (status) {
      case STATUS.IN_PROGRESS:
        if (reset) resetHashSignature();
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
        setHashStatus("Ошибка");
        setSignatureStatus("Ошибка");

        if (result && result.hash && result.hash.error) setHashError(result.hash.error);
        if (result && result.signature && result.signature.error) setSignatureError(result.signature.error);
        break;

      case STATUS.INIT:
      default:
        if (reset) resetHashSignature();
        setHashStatus("Не вычислен");
        setSignatureStatus("Не создана");
        break;
    }
  }, []);

  const hashData = useMemo(() => {
    return { hash, hashStatus, hashError };
  }, [hash, hashError, hashStatus]);

  const signatureData = useMemo(() => {
    return { signature, signatureStatus, signatureError };
  }, [signature, signatureError, signatureStatus]);

  return { hashData, signatureData, setHashSignature };
};
