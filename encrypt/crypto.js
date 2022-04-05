const crypto = require('crypto')
// let text = "0x3a51413c9aef7f7d251b510c0287bfef648acb839779aeaf99b14be67175df8d";
let data;
const CryptoDecryption = {
    encrypt: function(text) {
        const key = "bf3c199c2470cb477d907b1e0917c17b"
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        data = iv.toString('hex') + ':' + encrypted.toString('hex')
        return console.log("Encrypt Data-------------------->"+iv.toString('hex') + ':' + encrypted.toString('hex'));
    },

    decrypt: function(text) {
        try {
            const key = "bf3c199c2470cb477d907b1e0917c17b"
            let textParts = text.split(':');
            let iv = Buffer.from(textParts[0], 'hex');
            let encryptedText = Buffer.from(textParts[1], 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return console.log("decrypt data---------------->"+decrypted.toString());
        } catch (err) {
            console.log(err)
        }
    },

    randomString: function() {
        try {

            var string = '';
            var characters = '0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < 10; i++) {
                string += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            string = Date.now() + string;
            return string.toUpperCase();
        } catch (error) {
            console.log('Error @ randomString :', error)
            return false;
        }
    }
}
CryptoDecryption.encrypt("0x3a51413c9aef7f7d251b510c0287bfef648acb839779aeaf99b14be67175df8d");

CryptoDecryption.decrypt(data);
