const { create } = require('ipfs-http-client');
const ipfs = create('https://ipfs.infura.io:5001');
const fs = require('fs');
const CID = require('cids');

class IpfsService {
     async upload(req){
        try {
            if (req.files.file) {
                const file = req.files.file[0];
                const fileName = file.filename;
                const filePath = "./uploads/nft/" + fileName;

                const fileHash = await this.addFile(fileName, filePath);

                return fileHash;
            } else {
                return {
                    status: 500,
                    data: 'File Not Found'
                };
            } 
        } catch (error) {
            console.log("Error : ", error);
            return {
                status: 500,
                data: error
            };
        }
     }

     async addFile(fileName, filePath) {
         try {
             const file = fs.readFileSync(filePath);
             const filesAdded = await ipfs.add({ path: fileName, content: Buffer.from(file)}, {
                 progress: (len) => console.log("Uploading file..."+ len)
             });

             let link = new CID(filesAdded.cid.toString()).toV1().toString('base32');
             link = "https://" + link + ".ipfs.io"
             let cid = filesAdded.cid.toString();

             await ipfs.cat(cid)
             let url = 'https://ipfs.io/ipfs/' + cid

             await fs.unlinkSync(filePath)

             return {
                 status: 200,
                 filesAdded,
                 cid,
                 image: url
             }
         } catch (error) {
             console.log("Error : ", error);
             return {
                 status: 500, 
                 error
             }
         }
     }
}
module.exports = new IpfsService();