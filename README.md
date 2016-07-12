# nunjucks-includeData
Let nunjucks template Include data from JSON file

#How to install?
```javascript
npm install nunjucks-includeData
```

#How to use it?
Config
```javascript
var nunjucks = require('nunjucks');
var njIncludeData = require('nunjucks-includeData');

var templatesDir = ...; // Your template folder
var nunjucksEnv = nunjucks.configure( templatesDir, { ... } );  // Config your nunjucks with the templateDir
njIncludeData.install(nunjucksEnv);  // Init the extension with the nunjucks environment
```

Then:
Template file under `templatesDir`
```javascript
{% includeData 'data/user.json' as user %}

Hello {{ user.firstName }} {{ user.lastName}}
```

JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate"
}
```
Display output:
```html
Hello Bill Gate
```

#Syntax
```javascript
{% includeData <file> [as <namespace>] [clean] [, <file> [as <namespace>] [clean], ...] %}
```
- file: path is relative to the templatesDir (see the config section above)
- namespace: if no namespace supplied, then it will be global namespace
- clean: clean the namespace before read in the file, this option cannot be applied on the global namespace

##Example

```javascript
{% includeData
  'data/user.json',
  'data/user.json' as user
%}

Hello {{ firstName }} {{ lastName}}
Hello again {{ user.firstName }} {{ user.lastName}}
```
Display output:
```html
Hello Bill Gate
Hello again Bill Gate
```
