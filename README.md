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

#Tag Syntax
```javascript
{% includeData <file> [as <namespace>] [clean] [, <file> [as <namespace>] [clean], ...] %}
```
- `namespace`: if no namespace supplied, then it will be the global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted
- `clean`: clean the namespace before read in the file, this option has no effect on the global namespace

#Json file keyword
##Inject a json file to the root scope
```javascript
__injectToRoot_as_[namespace]: <file>
```
- `namespace`: if no namespace supplied, then it will be the global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to the root scope (clean)
```javascript
__injectToRoot_asClean_[namespace]: <file>
```
Empty the namespace before json injection.  Produce the same result as `__injectToRoot_as_` if no namespace is provided.
- `namespace`: if no namespace supplied, then it will be the global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to current scope
```javascript
__injectToHere_as_[namespace]: <file>
```
- `namespace`: if no namespace supplied, then it will be the current namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to current scope (clean)
```javascript
__injectToHere_as_[namespace]: <file>
```
Empty the namespace before json injection.  Produce the same result as `__injectToHere_as_` if no namespace is provided.
- `namespace`: if no namespace supplied, then it will be the current namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Example 1 - Basic
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate"
}
```
Template:
```javascript
{% includeData
  'data/user.json',
  'data/user.json' as user
%}

Hello {{ firstName }} {{ lastName}}
Hi {{ user.firstName }} {{ user.lastName}}
```
Display output:
```html
Hello Bill Gate
Hi Bill Gate
```
##Example 2 - Basic clean
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate"
}
```
Template:
```javascript
{% includeData
  'data/user.json' as user,
  'data/user2.json' as user,
  'data/user.json' as player,
  'data/user2.json' as player clean
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ player.firstName }} {{ player.lastName}} {{ player.email }}!
```
Display output:
```html
Hello Bill Gate tim.cook@gmail.com!
Hi Bill Gate !
```
