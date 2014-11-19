var fs = require('fs'),
    ineed = require('ineed');

var plugin2 = require('./inline-img');

//Replaces or deletes tagNames in <body>
var plugin = {
    extends: 'reprocess',
    name: 'tagNamesInBody',

    init: function (ctx, replacer) {
        this.ctx = ctx;
        this.replacer = replacer;
    },

    onStartTag: function (startTag) {
        if (this.ctx.inBody) {
            startTag.tagName = this.replacer(startTag.tagName);

            //Delete token if tagName is null
            return startTag.tagName === null ? null : startTag;
        }
    },

    onEndTag: function (tagName) {
        if (this.ctx.inBody)
            return this.replacer(tagName);
    }
};


var file = process.argv[2];
var html = fs.readFileSync(file, "utf-8");


console.log("===");
console.log(html);
console.log("===");
//Let's use it
var reprocessedHtml = ineed
    .using(plugin)
    .using(plugin2)
    .using(require('./inline-script'))
    .reprocess
    .title(function() { return "wtf"; })
    .inlineImg(file)
    .inlineScript(file)
    .tagNamesInBody(function (tagName) {


            return "X" + tagName;
    })    
    .fromHtml(html);

console.log(reprocessedHtml);



