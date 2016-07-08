function IncludeDataExtension(env) {
    this.tags = ['includeData'];

    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context, args) {
        for (var arg in args) {
            if (arg !== '__keywords') {
                try {
                    var fileObj = env.loaders[0].getSource(args[arg]);
                    if (fileObj) {
                        var data = JSON.parse(fileObj.src);
                        if (arg === '_') {
                            for (var d in data) {
                                context.ctx[d] = data[d];
                            }
                        } else {
                            context.ctx[arg] = data;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };
}

module.exports = IncludeDataExtension;

module.exports.install = function(env) {
    env.addExtension('IncludeDataExtension', new IncludeDataExtension(env));
};
