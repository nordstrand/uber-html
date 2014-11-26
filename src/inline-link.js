var url = require('url'),
    path = require('path'),
    fs = require('fs'),
    url = require('url'),
    DataUri = require('datauri');
        
var Common = require('ineed/lib/common');

module.exports = {
    name: 'inlineLink',
    extends: 'reprocess',

    init: function (ctx, basePath) {
        this.ctx = ctx;
        this.basePath = path.dirname(basePath);
    },

    onStartTag: function (startTag) {
        if (startTag.tagName === 'link' && 
            Common.getAttrValue(startTag.attrs, 'rel') === 'stylesheet') {
            
            var src = Common.getAttrValue(startTag.attrs, 'href');

            if (src) {
                var file = this.resolveSrc(src);

                if (fs.existsSync(file)) {
                    var data = fs.readFileSync(file, 'utf-8');
                    startTag.tagName = 'style>' + data + '</style';
                    startTag.attrs = [];
                }
            }
        }

        return startTag;
    },

    
    resolveSrc: function(src) {
        var pathName = url.parse(src).pathname;
        return path.join(this.basePath, pathName);
    }
};


