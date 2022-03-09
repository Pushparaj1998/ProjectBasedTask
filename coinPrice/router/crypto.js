const crypto = require('crypto')
const CryptoDecryption = {
    decrypt: function (text) {
        const key = "bf3c199c2470cb477d907b1e0917c17b"

        let textParts = text.split(':');
        let iv = Buffer.from(textParts[0], 'hex');
        let encryptedText = Buffer.from(textParts[1], 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
 
module.exports = CryptoDecryption