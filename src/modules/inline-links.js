var path = require('path'),
    url = require('url'),
    fs = require('fs'),
    cheerio = require('cheerio');

module.exports = function(html, basePath) {
    var $ = cheerio.load(html);
    
    $("script[src]").each(function() {
        var $el = $(this),
            src = $el.attr('src');
        
        if (!src) return;
       
        var file = resolveSrc(src);

        console.log(src + " => " + file);

        if (fs.existsSync(file)) {
            var data = fs.readFileSync(file, 'utf-8');
            data = sanitizeScriptTag(data);
            $el.text(data);
            $el.removeAttr('src');
        }
    });
    
    return $.html();
    
    function resolveSrc(src) {
        var pathName = url.parse(src).pathname;
        return path.join(basePath, pathName);
    }
    
};


function sanitizeScriptTag(js) {
                    
    fs.writeFileSync("before", js, "utf-8");
    
    var t  = js.replace(/<\/(script)>/gi,"\\u003c/$1>");
   
                    
                    
    
    fs.writeFileSync("after", t, "utf-8");

    return t;

}



