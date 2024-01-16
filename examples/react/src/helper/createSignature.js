import { createAttachedSignature, createDetachedSignature, createHash } from "crypto-pro";

// Domain model
// const result = {
//   hash: {
//     error: null,
//     data: null
//   },
//   signature: {
//     error: null,
//     data: null
//   }
// };

export const createSignature = async (props) => {
  const { thumbprint, isDetachedSignature, message } = props;

  const result = {
    hash: {
      error: null,
      data: null
    },
    signature: {
      error: null,
      data: null
    }
  };

  let hash;

  try {
    hash = await createHash(message);

    result.hash.data = hash;
  } catch (error) {
    result.hash.error = error.message;
    return result;
  }

  try {
    if (isDetachedSignature) {
      result.signature.data = await createDetachedSignature(thumbprint, hash);
    } else {
      result.signature.data = await createAttachedSignature(thumbprint, message);
    }
  } catch (error) {
    result.signature.error = error.message;
    return result;
  }

  return result;
};

