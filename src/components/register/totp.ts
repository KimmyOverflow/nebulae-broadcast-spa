import { encode } from "hi-base32"

export function assembleOtpauthUrl(username: string, totpSecret: string) {(
    `otpauth://totp/${encodeURIComponent(`NebulaeBroadcast:${username}`)}?secret=${totpSecret}&issuer=NebulaeBroadcast`
)}

export function generateTotpSecret() {
    const buf = new Uint8Array(32)
    window.crypto.getRandomValues(buf)
    return encode(buf)
}
