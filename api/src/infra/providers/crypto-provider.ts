import crypto from "crypto";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class CryptoProvider {
  private key = process.env.ENCRYPT_CORE_KEY as string;
  private blind = process.env.BLIND_KEY as string;
  sha256(payload: string) {
    return crypto.createHash("sha256").update(payload).digest("hex");
  }
  /**
   *
   * @param payload O valor a ser encriptado
   * @returns Valor criptografado para blind
   */
  hmac(payload: string) {
    return crypto
      .createHmac("sha256", this.blind)
      .update(payload)
      .digest("hex");
  }
  encrypt(value: string) {
    const encrypted = CryptoJS.AES.encrypt(value, this.key).toString();
    return encrypted; // Return the encrypted data as a string
  }
  decrypt(encryptedData: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.key); // Decrypt the data
    const originalText = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string
    return originalText; // Return the original text
  }
  hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
  decryptEntity<T extends Record<string, any>>(entity: T, fields: string[]): T {
    const decrypted = { ...entity } as Record<string, any>;
    for (const field of fields) {
      if (decrypted[field]) {
        decrypted[field] = this.decrypt(decrypted[field]!);
      }
    }
    return decrypted as T;
  }
}

export class JwtProvider {
  private key = process.env.JWT_KEY! as string;
  generateToken(payload: object) {
    return jwt.sign(payload, this.key, { expiresIn: "1y" });
  }
  verifyToken(token: string) {
    const payload = jwt.verify(token, this.key);
    return payload;
  }
}
