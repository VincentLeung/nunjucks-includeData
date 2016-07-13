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

#Tag Syntax
```javascript
{% includeData <file> [as <namespace>] [clean] [, <file> [as <namespace>] [clean], ...] %}
```
- `namespace`: if no namespace supplied, then it will be global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted
- `clean`: clean the namespace before read in the file, this option has no effect on the global namespace

#Json file keyword
```javascript
__injectToRoot_as_[namespace]: <file>
```
- `namespace`: if no namespace supplied, then it will be global namespace
- `file`: path is relative to the templatesDir (see the config section above), expression is accepted

##Example 1

Template:
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

##Example 2
JSON data file: `templatesDir`/data/user.json
```json
{
	"firstName": "Bill",
	"lastName": "Gate",
	"__injectToRoot_as_contact": "data/contact.json",
	"__injectToRoot_as_": "data/contact.json"
}
```
JSON data file: `templatesDir`/data/contact.json
```json
{
	"email": "bill.gate@gamil.com"
}
```

Template:
```javascript
{% includeData
  'data/user.json' as user
%}

Hello {{ user.firstName }} {{ user.lastName}}
Email: {{ contact.email }}
Email again: {{ email }}
```
Display output:
```html
Hello Bill Gate
Email: bill.gate@gmail.com
Email again: bill.gate@gmail.com
```
