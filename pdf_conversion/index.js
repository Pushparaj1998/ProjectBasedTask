var convertapi = require('convertapi')('OnOKwRJEgT18rsN3');
convertapi.convert('pdf', {
    File: 'uploads/file4.cbz',
    PdfVersion: '2.0',
    PdfResolution: '1000',
    ColorSpace: 'RGB'

}, 'cbz').then(function(result) {
    console.log("result------------>", result.response.Files)
    result.saveFiles('uploads');
    for(let arr of  result.response.Files){
        console.log(arr)
    }
});
