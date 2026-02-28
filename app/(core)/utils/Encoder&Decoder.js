import pako from "pako";

export const compressAndEncode = (inputString) => {
    try {
        const uint8Array = new TextEncoder().encode(inputString);
        const compressed = pako.deflate(uint8Array, { to: "string" });
        return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
        console.error("Error compressing and encoding:", error);
        return null;
    }
};