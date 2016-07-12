function IncludeDataExtension(env) {
    this.tags = ['includeData'];

    this.parse2 = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        console.log(JSON.stringify(args, null, 2));
        return new nodes.CallExtension(this, 'run', args);
    };

    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = new nodes.NodeList(tok.lineno, tok.colno);
        var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
        var argArray = new nodes.Array(tok.lineno, tok.colno);
        while(1) {
            var nextTok = parser.peekToken();
            if(nextTok.type === lexer.TOKEN_BLOCK_END) {
                if(!argArray.children.length) {
                    parser.fail('parseIncludeData: Expected at least one importData name',
                        tok.lineno,
                        tok.colno);
                }

                parser.nextToken();
                break;
            }
            if(argArray.children.length > 0 && !parser.skip(lexer.TOKEN_COMMA)) {
                parser.fail('parseIncludeData: expected comma',
                    tok.lineno,
                    tok.colno);
            }
            var template = parser.parsePrimary();
            var aliasName = (parser.skipSymbol('as')) ? parser.parsePrimary().value : '';
            var clean = parser.skipSymbol('clean');
            var dict = new nodes.Dict(template.lineno, template.colno);
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, 'clean'),
                                          new nodes.Literal(template.lineno, template.colno, clean)));
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, 'file'),
                                          new nodes.Literal(template.lineno, template.colno, template.value)));
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, 'namespace'),
                                          new nodes.Literal(template.lineno, template.colno, aliasName)));
            argArray.addChild(dict);
        }
        kwargs.addChild(new nodes.Pair(template.lineno,
                                      template.colno,
                                      new nodes.Literal(template.lineno, template.colno, 'data'),
                                      argArray));
        args.addChild(kwargs);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context, args) {
        for (var i = 0; i < args.data.length; i++) {
            var data = args.data[i];
            try {
                var fileObj = env.loaders[0].getSource(data.file);
                if (fileObj) {
                    var jsonData = JSON.parse(fileObj.src);
                    if (data.namespace && data.clean) {
                        context.ctx[data.namespace] = jsonData;
                    } else {
                        var ctx = context.ctx;
                        if (data.namespace) {
                            if (!context.ctx[data.namespace]) {
                                context.ctx[data.namespace] = {};
                            }
                            ctx = context.ctx[data.namespace];
                        }
                        for (var key in jsonData) {
                            ctx[key] = jsonData[key];
                        }
                    }
                } else {
                    console.log("error to load: " + data.file);
                }
            } catch (e) {
                console.log(e);
            }
        }
    };
}

module.exports = IncludeDataExtension;

module.exports.install = function(env) {
    env.addExtension('IncludeDataExtension', new IncludeDataExtension(env));
};
