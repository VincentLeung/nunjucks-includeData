var RecursiveIterator = require('recursive-iterator');

function IncludeDataExtension(env) {
    this.tags = ['includeData'];
    this.keywords = {
        as: 'as',
        clean: 'clean',
        file: 'file',
        data: 'data',
        namespace: 'namespace',
        injectToRoot_as: '__injecttoroot_as_',
        injectToRoot_asClean: '__injecttoroot_asclean_',
        injectToHere_as: '__injecttohere_as_',
        injectToHere_asClean: '__injecttohere_asclean_',
        injectArray0ToRoot_as: '__injectarray0toroot_as_',
        injectArray0ToRoot_asClean: '__injectarray0toroot_asclean_',
        injectArray0ToHere_as: '__injectarray0tohere_as_',
        injectArray0ToHere_asClean: '__injectarray0tohere_asclean_'
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

    this.includeJson = function(root, rootCtx) {
        for(let {parent, node, key, path, deep} of new RecursiveIterator(root)) {
            var lowerCaseKey = key.toLowerCase();
            var keyPrefix = null;
            var ctx = rootCtx;
            var clean = false;
            var arrayCheck = false;
            if (lowerCaseKey.startsWith(this.keywords.injectToRoot_as)) {
                keyPrefix = this.keywords.injectToRoot_as;
            } else if (lowerCaseKey.startsWith(this.keywords.injectToRoot_asClean)) {
                keyPrefix = this.keywords.injectToRoot_asClean;
                clean = true;
            } else if (lowerCaseKey.startsWith(this.keywords.injectToHere_as)) {
                keyPrefix = this.keywords.injectToHere_as;
                ctx = parent;
            } else if (lowerCaseKey.startsWith(this.keywords.injectToHere_asClean)) {
                keyPrefix = this.keywords.injectToHere_asClean;
                ctx = parent;
                clean = true;
            } else if (lowerCaseKey.startsWith(this.keywords.injectArray0ToRoot_as)) {
                keyPrefix = this.keywords.injectArray0ToRoot_as;
                arrayCheck = true;
            } else if (lowerCaseKey.startsWith(this.keywords.injectArray0ToRoot_asClean)) {
                keyPrefix = this.keywords.injectArray0ToRoot_asClean;
                clean = true;
                arrayCheck = true;
            } else if (lowerCaseKey.startsWith(this.keywords.injectArray0ToHere_as)) {
                keyPrefix = this.keywords.injectArray0ToHere_as;
                ctx = parent;
                arrayCheck = true;
            } else if (lowerCaseKey.startsWith(this.keywords.injectArray0ToHere_asClean)) {
                keyPrefix = this.keywords.injectArray0ToHere_asClean;
                ctx = parent;
                clean = true;
                arrayCheck = true;
            }
            if (keyPrefix) {
                delete parent[key];
                var jsonData = this.readFile(node, rootCtx);
                var namespace = key.substring(keyPrefix.length);
                if (arrayCheck && Array.isArray(jsonData)) {
                    jsonData = jsonData[0];
                }
                this.addData(ctx, jsonData, namespace, clean);
            }
        }
        return root;
    };

    this.readFile = function(fileName, rootCtx) {
        try {
            var fileObj = env.loaders[0].getSource(fileName);
            if (fileObj) {
                var jsonData = JSON.parse(fileObj.src);
                jsonData = this.includeJson(jsonData, rootCtx);
                return jsonData;
            } else {
                console.log("error to load: " + fileName);
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
