'use strict';

var SourceMapConsumer = require('source-map').SourceMapConsumer;
var isparta = require('isparta');

module.exports = function(source, map) {
    var config = this.options.isparta || {
        embedSource: true,
        noAutoWrap: true,
        babel: this.options.babel
    };

    if(this.sourceMap){
      config.codeGenerationOptions = config.codeGenerationOptions || {};
      config.codeGenerationOptions.sourceMap = this.resourcePath;
      config.codeGenerationOptions.sourceMapWithCode = true;
    }

    var instrumenter = new isparta.Instrumenter(config);

    if (this.cacheable) {
        this.cacheable();
    }

    var instrumented = instrumenter.instrumentSync(source, this.resourcePath);

    if(this.sourceMap){
      var outMap = instrumenter.lastSourceMap();

      if(outMap){
          outMap.applySourceMap(new SourceMapConsumer(map), this.resourcePath);

          map = outMap.toJSON();
      }
    }

    this.callback(null, instrumented, map);
};
