var RecursiveIterator = require('recursive-iterator');

function IncludeDataExtension(env) {
    this.tags = ['includeData'];
    this.keywords = {
        as: 'as',
        clean: 'clean',
        file: 'file',
        data: 'data',
        namespace: 'namespace',
        injectToRoot_as_: '__injectToRoot_as_',
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
            var template = parser.parseExpression();
            var aliasName = (parser.skipSymbol(this.keywords.as)) ? parser.parsePrimary().value : '';
            var clean = parser.skipSymbol(this.keywords.clean);
            var dict = new nodes.Dict(template.lineno, template.colno);
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, this.keywords.clean),
                                          new nodes.Literal(template.lineno, template.colno, clean)));
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, this.keywords.file),
                                          template));
            dict.addChild(new nodes.Pair(template.lineno,
                                          template.colno,
                                          new nodes.Literal(template.lineno, template.colno, this.keywords.namespace),
                                          new nodes.Literal(template.lineno, template.colno, aliasName)));
            argArray.addChild(dict);
        }
        kwargs.addChild(new nodes.Pair(template.lineno,
                                      template.colno,
                                      new nodes.Literal(template.lineno, template.colno, this.keywords.data),
                                      argArray));
        args.addChild(kwargs);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context, args) {
        for (var i = 0; i < args.data.length; i++) {
            var data = args.data[i];
            var jsonData = this.readFile(data.file, context.ctx);
            this.addData(context.ctx, jsonData, data.namespace, data.clean);
        }
    };

    this.includeJson = function(root, ctx) {
        for(let {parent, node, key, path, deep} of new RecursiveIterator(root)) {
            if (key.startsWith(this.keywords.injectToRoot_as_)) {
                var jsonData = this.readFile(node, ctx);
                var namespace = key.substring(this.keywords.injectToRoot_as_.length);
                this.addData(ctx, jsonData, namespace, true);
            }
        }
        return root;
    };

    this.readFile = function(fileName, ctx) {
        try {
            var fileObj = env.loaders[0].getSource(fileName);
            if (fileObj) {
                var jsonData = JSON.parse(fileObj.src);
                jsonData = this.includeJson(jsonData, ctx);
                return jsonData;
            } else {
                console.log("error to load: " + data.file);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    };

    this.addData = function(ctx, jsonData, namespace, clean) {
        if (jsonData) {
            if (namespace && clean) {
                ctx[namespace] = jsonData;
            } else {
                if (namespace) {
                    if (!ctx[namespace]) {
                        ctx[namespace] = {};
                    }
                    ctx = ctx[namespace];
                }
                for (var key in jsonData) {
                    ctx[key] = jsonData[key];
                }
            }            
        }
    };

}

module.exports = IncludeDataExtension;

module.exports.install = function(env) {
    env.addExtension('IncludeDataExtension', new IncludeDataExtension(env));
};
