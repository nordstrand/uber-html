var url = require('url'),
    path = require('path'),
    fs = require('fs'),
    url = require('url'),
    DataUri = require('datauri');
        
var Common = require('ineed/lib/common');

module.exports = {
    name: 'inlineImg',
    extends: 'reprocess',

    init: function (ctx, basePath) {
        this.ctx = ctx;
        this.basePath = path.dirname(basePath);
    },

    onStartTag: function (startTag) {
        if (startTag.tagName === 'img') {
            var src = Common.getAttrValue(startTag.attrs, 'src') || '';

            var file = this.resolveImgSrc(src);
            
            if (fs.existsSync(file)) {
                console.log("Exists:", file);
                Common.setAttrValue(startTag.attrs, 'src', new DataUri(file).content);
            }
        }

        return startTag;
    },

    resolveImgSrc: function(src) {
        var pathName = url.parse(src).pathname;
        return path.join(this.basePath, pathName);
    }
};