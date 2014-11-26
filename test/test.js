/*jshint node: true, mocha : true */

var assert = require("assert"),
    fs = require("fs")
    chai = require('chai'),
    processFile = require("../src/process-file");
    
describe("uberhtml", function() {
    before(function() {
        chai.should();
        chai.use(require('chai-fs'));
    });

    afterEach(function(done) {
        done();
    });

    ["img-inline", "script-inline", "link-inline"].forEach(function(t) {
        it(t + " plugin should return expected html", function() {
            assertFile(t);
        });
    });
     

    function assertFile(file) {
        processFile("test/" + file + "/index.html");
        
        ("test/" + file + "/index.dist.html")
        .should.have
        .content(fs.readFileSync("test/" + file +   
                                 "/index.expected.html",
                                "utf-8"));
    }
});
