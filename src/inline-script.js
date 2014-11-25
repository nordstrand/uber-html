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
            this.nukeNextEndTag = false;
            
            var src = Common.getAttrValue(startTag.attrs, 'src');
            
            if (src) {
                var file = this.resolveSrc(src);

                if (fs.existsSync(file)) {
                    var data = fs.readFileSync(file, 'utf-8');
                    startTag.attrs=[];
                    startTag.tagName = 'script>' + data + '</script';
                    this.nukeNextEndTag = true;
                }
            }
        }

        return startTag;
    },
    
    onEndTag: function (endTag) {
        if (endTag === 'script' && this.nukeNextEndTag) {
            endTag =  null;
        }
        
        return endTag;
    },

    resolveSrc: function(src) {
        var pathName = url.parse(src).pathname;
        return path.join(this.basePath, pathName);
    }
};


