var fs = require('fs'),
    path = require('path'),
    inlineLink = require('./modules/inline-links'),
    inlineImg = require('./modules/inline-img');



module.exports = function(file) {
    var html = fs.readFileSync(file, "utf-8");
    console.log("===");
    console.log(html);
    console.log("===");
    
    var basePath = path.dirname(file);

    var reprocessedHtml = inlineLink(html, basePath);

   // console.log(reprocessedHtml);

    var outFilePath = getOutputPath(file);

    fs.writeFileSync(outFilePath, reprocessedHtml);

    function getOutputPath(file) {
        var outputFileName = path.basename(file, path.extname(file)) +
        ".dist" + path.extname(file);

        return path.join(path.dirname(file), outputFileName);
    }
};

module.exports(process.argv[2]);