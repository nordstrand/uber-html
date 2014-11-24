var fs = require('fs'),
    path = require('path'),
    ineed = require('ineed');


module.exports = function(file) {
    var html = fs.readFileSync(file, "utf-8");
    console.log("===");
    console.log(html);
    console.log("===");

    var reprocessedHtml = ineed
        .using(require('./inline-img'))
        .using(require('./inline-script'))
        .reprocess
     //   .title(function() { return "wtf"; })
        .inlineImg(file)
        .inlineScript(file)
        .fromHtml(html);


    console.log(reprocessedHtml);



    var outFilePath = getOutputPath(file);

    //fs.writeFile(outFilePath, reprocessedHtml, //function (err) {
    //  if (err) throw err;
    //  console.log("Saved.", outFilePath);
    //});

    fs.writeFileSync(outFilePath, reprocessedHtml);

    function getOutputPath(file) {
        var outputFileName = path.basename(file, path.extname(file)) +
        ".dist" + path.extname(file);

        return path.join(path.dirname(file), outputFileName);
}
    
};