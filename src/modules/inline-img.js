var path = require('path'),
    url = require('url'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    rework = require('rework'),
    mime = require('mime'),
    func = require('rework-plugin-function');

module.exports = function(html, basePath) {
    var $ = cheerio.load(html);
    
    $("style").each(function() {
        var $el = $(this);
            style = $el.text();
        
        if (!style) return;
       
        
        style = reworkcss(style);
        
        $el.text(style);
        $el.removeAttr('src');
        
    });
    
    return $.html();
    
    function resolveSrc(src) {
        var pathName = url.parse(src).pathname;
        return path.join(basePath, pathName);
    }
    
                    
                    
    var reworkPlugin = function() {
      
      function inline(filename){

        var file = resolveSrc(filename);
                    
        if (!file) throw new Error('inline(): failed to find "' + filename + '"');

        var type = mime.lookup(file);
        var base64 = new Buffer(read(file)).toString('base64');
        return 'url("data:' + type + ';base64,' + base64 + '")';
      }

      return func({ url: inline });
    };
                    
    function reworkcss(style) {
        style = rework('style')
        .use(reworkPlugin)
        .toString({ sourcemap: false });

        return style;
    }
};


