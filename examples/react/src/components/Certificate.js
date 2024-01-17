import React, { useState, useEffect, useCallback } from "react";
import { getUserCertificates } from 'crypto-pro';

const localStorageKey = 'selectedCertificateThumbprint';
const DEFAULT_THUMBPRINT = 'default';

function Certificate({ certificate, onChange }) {
  const [certificateList, setCertificateList] = useState([]);
  const [certificatesError, setCertificatesError] = useState([]);

  const [certificateDetails, setCertificateDetails] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  const selectCertificate = useCallback((event) => {
    const selectedThumbprint = event.target.value

    // Сохраняем в localStorage выбранное значение
    selectedThumbprint === DEFAULT_THUMBPRINT ? localStorage.removeItem(localStorageKey) : localStorage.setItem(localStorageKey, selectedThumbprint);

    const selectedCertificate = certificateList.find(({thumbprint}) => thumbprint === selectedThumbprint) ?? null;

    onChange(selectedCertificate);

    setCertificateDetails(null);
    if (selectedCertificate) loadCertificateDetails(selectedCertificate);
  }, [certificateList, onChange]);

  async function loadCertificateDetails(certificate) {
    try {
      setCertificateDetails({
        name: certificate.name,
        issuerName: certificate.issuerName,
        subjectName: certificate.subjectName,
        thumbprint: certificate.thumbprint,
        validFrom: certificate.validFrom,
        validTo: certificate.validTo,
        isValid: await certificate.isValid(),
        version: await certificate.getCadesProp('Version'),
        base64: await certificate.exportBase64(),
        algorithm: await certificate.getAlgorithm(),
        extendedKeyUsage: await certificate.getExtendedKeyUsage(),
        ownerInfo: await certificate.getOwnerInfo(),
        issuerInfo: await certificate.getIssuerInfo(),
        decodedExtendedKeyUsage: await certificate.getDecodedExtendedKeyUsage(),
        '1.3.6.1.4.1.311.80.1': await certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.1'),
        '[\'1.3.6.1.5.5.7.3.2\', \'1.3.6.1.4.1.311.10.3.12\']': await certificate.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.2',
          '1.3.6.1.4.1.311.10.3.12'
        ]),
        '1.3.6.1.4.1.311.80.2': await certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.2'),
        '\'1.3.6.1.5.5.7.3.3\', \'1.3.6.1.4.1.311.10.3.12\'': await certificate.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.3',
          '1.3.6.1.4.1.311.10.3.12'
        ]),
      });
    } catch (error) {
      setDetailsError(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setCertificateList(await getUserCertificates());
      } catch (error) {
        setCertificatesError(error.message);
      }
    })();
  }, []);

  // Подставляем ранее выбранный сертификат из localStorage
  useEffect(() => {
    const localStorageThumbprint = localStorage.getItem(localStorageKey);
    if (localStorageThumbprint && localStorageThumbprint !== DEFAULT_THUMBPRINT) {
      selectCertificate({ target: { value: localStorageThumbprint } });
    }
  }, [selectCertificate]);

  return (
    <>
      <label htmlFor="certificate">Сертификат: *</label>

      <br/>

      <select id="certificate" onChange={selectCertificate} style={{ width: "675px" }}
              value={certificate && certificate.thumbprint ? certificate.thumbprint : DEFAULT_THUMBPRINT}>
        <option value={DEFAULT_THUMBPRINT}>Не выбран</option>

        {certificateList.map(({name, thumbprint, validTo}) =>
          <option key={thumbprint} value={thumbprint}>
            {name + ' (действителен до: ' + validTo.split('T')[0] + ')'}
          </option>
        )}
      </select>

      <pre>{certificatesError || null}</pre>

      {certificate ? (
        <>
          <details>
            <summary>Информация о сертификате</summary>

            <pre>
              {JSON.stringify(certificate, null, '  ')}
            </pre>

            <pre>
              {certificateDetails ? (
                JSON.stringify(certificateDetails, null, '  ')
              ) : 'Запрашивается...'}
            </pre>
          </details>

          <pre>{detailsError || null}</pre>
        </>
      ) : null}
    </>
  );
}

export default React.memo(Certificate);
