const IpfsService = require('../services/ipfs');

class fileController {
    async upload(req, res) {
        try {
            let save_on_ipfs = await IpfsService.upload(req);
            if(save_on_ipfs && save_on_ipfs.status == 200) {
                let output = {
                    image: save_on_ipfs.image
                }
                return res.status(200).send({ status: 200, success:true, data: output, message: 'Upload Successfully' });
            } else {
                return req.status(200).send({ status: 400, success: false , message: "Upload Failed"});
            }
        } catch (error) {
            return res.status(400).send({ status: 400, success: false, message: "Error in Upload", error: error})
        }
    }
}

module.exports = fileController;
