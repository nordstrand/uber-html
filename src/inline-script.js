var url = require('url'),
    path = require('path'),
    fs = require('fs'),
    url = require('url'),
    DataUri = require('datauri');
        
var Common = require('ineed/lib/common');

module.exports = {
    name: 'inlineScript',
    extends: 'reprocess',

    init: function (ctx, basePath) {
        this.ctx = ctx;
        this.basePath = path.dirname(basePath);
    },

    onStartTag: function (startTag) {
        if (startTag.tagName === 'script') {
            var src = Common.getAttrValue(startTag.attrs, 'src') || '';
            this.src = src;
            
            var file = this.resolveSrc(this.src);
            
            if (fs.existsSync(file)) {
                console.log("Exists:", file);
                this.data = fs.readFileSync(file, 'utf-8');
            } else {
                this.data = undefined;
            }
        }

        return startTag;
    },
    
    onText: function (text) {
        if (this.ctx.leadingStartTag === 'script' && this.data) {
            //this.data = undefined;
            
            return this.data;
        }

        return text;
    },

    resolveSrc: function(src) {
        var pathName = url.parse(src).pathname;
        return path.join(this.basePath, pathName);
    }
};


