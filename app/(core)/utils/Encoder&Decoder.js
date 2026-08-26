import pako from "pako";

export const compressAndEncode = (inputString) => {
    try {
        const uint8Array = new TextEncoder().encode(inputString);
        const compressed = pako.deflate(uint8Array);
        if (typeof compressed === "string") {
            return btoa(compressed);
        }
        let binary = "";
        const len = compressed.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(compressed[i]);
        }
        return btoa(binary);
    } catch (error) {
        console.error("Error compressing and encoding:", error);
        return null;
    }
};