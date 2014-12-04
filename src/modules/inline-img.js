var path = require('path'),
    url = require('url'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    rework = require('rework'),
    mime = require('mime'),
    func = require('rework-plugin-function'),
    reworkFunction = require('rework-plugin-function');

module.exports = function(html, basePath) {
    var $ = cheerio.load(html);
    
    $("style").each(function() {
        var $el = $(this),
            style = $el.text();
        
        //console.log ("###1", arguments);
        // console.log ("###2", $el.html());
        
        if (!style) {
            return;
        }
       
        
        style = inlineCss(style);
        
        $el.text(style);
        $el.removeAttr('src');
        
    });
    
    return $.html();
    

    function inlineCss(css) {
        return rework(css)
            .use(reworkFunction({ url: inline }))
            .toString();

        function inline(filename){
            var file = resolveSrc(filename);

            if (!file) {
                throw new Error('inline(): failed to find "' + filename + '"');
            }

            var type = mime.lookup(file);
            var base64 = new Buffer(fs.readFileSync(file)).toString('base64');
            return 'url("data:' + type + ';base64,' + base64 + '")';
        }

        function resolveSrc(src) {
            var pathName = url.parse(src).pathname;
            return path.join(basePath, pathName);
        }
    }
};


function inlineCss(css) {
    
    function inline(filename){
        var file = resolveSrc(filename);

        if (!file) {
            throw new Error('inline(): failed to find "' + filename + '"');
        }

        var type = mime.lookup(file);
        var base64 = new Buffer(fs.readFileSync(file)).toString('base64');
        return 'url("data:' + type + ';base64,' + base64 + '")';
    }

    function resolveSrc(src) {
        var pathName = url.parse(src).pathname;
        return path.join(".", pathName);
    }

    return rework(css)
        .use(reworkFunction({ url: inline }))
        .toString();
}

console.log("DOH");
console.log(inlineCss("body { background: url('topbanner.png') #00D repeat-y fixed; }"));

      

