const Bottleneck =
require("bottleneck");

const limiter =
new Bottleneck({

minTime:3000,
maxConcurrent:1

});

module.exports =
limiter;