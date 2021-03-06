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

##Inject a json file to the root scope, if the json file contains an array, then insert the first element rather than whole array
```javascript
__injectArray0ToRoot_as_[namespace]: <file>
```
- `namespace`: if no namespace supplied, then it will be the global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to the root scope (clean), if the json file contains an array, then insert the first element rather than whole array
```javascript
__injectArray0ToRoot_asClean_[namespace]: <file>
```
Empty the namespace before json injection.  Produce the same result as `__injectArray0ToRoot_as_` if no namespace is provided.
- `namespace`: if no namespace supplied, then it will be the global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to current scope, if the json file contains an array, then insert the first element rather than whole array
```javascript
__injectArray0ToHere_as_[namespace]: <file>
```
- `namespace`: if no namespace supplied, then it will be the current namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Inject a json file to current scope (clean), if the json file contains an array, then insert the first element rather than whole array
```javascript
__injectArray0ToHere_as_[namespace]: <file>
```
Empty the namespace before json injection.  Produce the same result as `__injectArray0ToHere_as_` if no namespace is provided.
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
##Example 3 - Inject to root
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"__injectToRoot_as_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate"
}
```
JSON data file: `templatesDir`/data/user3.json
```json
{
	"firstName": "Peter",
	"lastName": "Pan",
	"email": "peter.pan@gmail.com"
}
```
Template:
```javascript
{% includeData
  'data/user3.json' as player
%}

Morning {{ player.firstName }} {{ player.lastName}} {{ player.email }}!

{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ player.firstName }} {{ player.lastName}} {{ player.email }}!
```
Display output:
```html
Morning Peter Pan peter.pan@gmail.com!
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate peter.pan@gmail.com!
```
##Example 4 - Inject to root (clean)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"__injectToRoot_asClean_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate"
}
```
JSON data file: `templatesDir`/data/user3.json
```json
{
	"firstName": "Peter",
	"lastName": "Pan",
	"email": "peter.pan@gmail.com"
}
```
Template:
```javascript
{% includeData
  'data/user3.json' as player
%}

Morning {{ player.firstName }} {{ player.lastName}} {{ player.email }}!

{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ player.firstName }} {{ player.lastName}} {{ player.email }}!
```
Display output:
```html
Morning Peter Pan peter.pan@gmail.com!
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate !
```
##Example 5 - Inject to here
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"player": {
		"email": "peter.pan@gmail.com"
	},
	"__injectToHere_as_player": "data/user2.json"
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
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ user.player.firstName }} {{ user.player.lastName}} {{ user.player.email }}!
```
Display output:
```html
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate peter.pan@gmail.com!
```
##Example 6 - Inject to here (clean)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"player": {
		"email": "peter.pan@gmail.com"
	},
	"__injectToHere_asClean_player": "data/user2.json"
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
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ user.player.firstName }} {{ user.player.lastName}} {{ user.player.email }}!
```
Display output:
```html
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate !
```
##Example 7 - Inject to root (1st element of array)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"__injectArray0ToRoot_as_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
[{
	"firstName": "Bill",
	"lastName": "Gate"
}, {
	"firstName": "Tim",
	"lastName": "Cook"
}]
```
JSON data file: `templatesDir`/data/user3.json
```json
{
	"firstName": "Peter",
	"lastName": "Pan",
	"email": "peter.pan@gmail.com"
}
```
Template:
```javascript
{% includeData
  'data/user3.json' as player
%}

Morning {{ player.firstName }} {{ player.lastName}} {{ player.email }}!

{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ player.firstName }} {{ player.lastName}} {{ player.email }}!
```
Display output:
```html
Morning Peter Pan peter.pan@gmail.com!
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate peter.pan@gmail.com!
```
##Example 8 - Inject to root (clean) (1st element of array)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"__injectArray0ToRoot_asClean_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
[{
	"firstName": "Bill",
	"lastName": "Gate"
}, {
	"firstName": "Time",
	"lastName": "Cook"
}]
```
JSON data file: `templatesDir`/data/user3.json
```json
{
	"firstName": "Peter",
	"lastName": "Pan",
	"email": "peter.pan@gmail.com"
}
```
Template:
```javascript
{% includeData
  'data/user3.json' as player
%}

Morning {{ player.firstName }} {{ player.lastName}} {{ player.email }}!

{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ player.firstName }} {{ player.lastName}} {{ player.email }}!
```
Display output:
```html
Morning Peter Pan peter.pan@gmail.com!
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate !
```
##Example 9 - Inject to here (1st element of array)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"player": {
		"email": "peter.pan@gmail.com"
	},
	"__injectArray0ToHere_as_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
[{
	"firstName": "Bill",
	"lastName": "Gate"
}, {
	"firstName": "Tim",
	"lastName": "Cook"
}]
```
Template:
```javascript
{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ user.player.firstName }} {{ user.player.lastName}} {{ user.player.email }}!
```
Display output:
```html
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate peter.pan@gmail.com!
```
##Example 10 - Inject to here (clean) (1st element of array)
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Tim",
	"lastName": "Cook",
	"email": "tim.cook@gmail.com",
	"player": {
		"email": "peter.pan@gmail.com"
	},
	"__injectArray0ToHere_asClean_player": "data/user2.json"
}
```
JSON data file: `templatesDir`/data/user2.json
```json
[{
	"firstName": "Bill",
	"lastName": "Gate"
}, {
	"firstName": "Time",
	"lastName": "Cook"
}]
```
Template:
```javascript
{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}} {{ user.email }}!
Hi {{ user.player.firstName }} {{ user.player.lastName}} {{ user.player.email }}!
```
Display output:
```html
Hello Tim Cook tim.cook@gmail.com!
Hi Bill Gate !
```
