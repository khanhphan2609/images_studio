// utils/webauthn.ts

// Accepts string | Uint8Array | ArrayBuffer | number[] and converts to Uint8Array
export function base64UrlToUint8Array(input: string | Uint8Array | ArrayBuffer | number[]): Uint8Array {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (Array.isArray(input)) return new Uint8Array(input);

  if (typeof input !== "string") {
    throw new Error("base64UrlToUint8Array: invalid input type");
  }

  const base64Url = input;
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Safely prepare PublicKeyCredentialCreationOptions-like object
export function preparePublicKeyOptions(serverOptions: any) {
  if (!serverOptions) throw new Error("Missing serverOptions");

  const out: any = { ...serverOptions };

  // challenge can be string or bytes already
  if (serverOptions.challenge !== undefined) {
    out.challenge = base64UrlToUint8Array(serverOptions.challenge);
  }

  // user.id can be string or bytes already
  if (serverOptions.user && serverOptions.user.id !== undefined) {
    out.user = {
      ...serverOptions.user,
      id: base64UrlToUint8Array(serverOptions.user.id),
    };
  }

  // Ensure pubKeyCredParams sane fallback
  out.pubKeyCredParams = Array.isArray(serverOptions.pubKeyCredParams)
    ? serverOptions.pubKeyCredParams.map((param: any) => ({
        type: param.type,
        alg: param.alg,
      }))
    : [{ type: "public-key", alg: -7 }];

  // If this is authentication options, normalize allowCredentials if present
  if (Array.isArray(serverOptions.allowCredentials)) {
    out.allowCredentials = serverOptions.allowCredentials.map((cred: any) => ({
      ...cred,
      id: base64UrlToUint8Array(cred.id),
    }));
  }

  return out;
}