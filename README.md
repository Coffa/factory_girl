# Factory Girl

port features from factory_girl in rails to nodejs

## Installation

Node.js:

    npm install 'factory_girl'

## Usage

### Define factory

``` js
var FactoryGirl = require('factory_girl'); // for nodejs
```

``` js

FactoryGirl.define('user', function() {
	this.id = Math.random()*101|0;
	this.title = 'That\'s awesome day';
	this.emotion = 'happy';
})
```

### Using factories

``` js
	user = FactoryGirl.create('user'); // create instance user
	user.attributes(); // => {id: 1, title: 'That\'s awesome day', emotion: 'happy'}
```

It's possible to override the defined attributes by passing a json:
``` js
	user = FactoryGirl.create('user', {id: 2});
	user.attributes(); // => {id: 2, ....}
	FactoryGirl.attributesFor('user') // => {id: 1, ...}
	FactoryGirl.defined('user') // => true
```

### Loading factories

When using node.js you can specify the path(s) to your factories, so FactoryGirl will autoload all factories in that paths
```js
  FactoryGirl.definitionFilePaths = [__dirname + '/factories'];
  FactoryGirl.findDefinitions();
```
_* The path to the factories must be an `Array` and also must be relative to the current file_

### Aliases

``` js
FactoryGirl.define('user', {alias: 'doctor'}, function () {
	// same above
})
```

`FactorGirl.create('user')` is equal to `FactoryGirl.create('doctor')`

another thing is you can pass to array to alias  `{alias: ['doctor', 'patient']`

### Inheritance

``` js
FactorlGirl.define('doctor', {inherit: 'user'}, function() {
	this.id = 2;
	this.label = 'Dr';
})

var doctor = Factory.create('doctor');
doctor.attributes() // => {id: 2, title: 'That\'s awesome day', emotion: 'happy', label: 'Dr'}
```

### Association

``` js
FactoryGirl.hasOne(name[, factoryName] [, ref])
FactoryGirl.belongsTo(name[, factoryName] [, ref])
FactoryGirl.hasMany(name[, factoryName], num[, ref])
```

`name`: Factory's property name
`factoryName`: Definition name of the related factory
`num`: Number of related factories to be created
`ref`: Foreign key attribute name

#### Examples

```js
FactoryGirl.define('profile', function() {
	this.id = 2;
	this.label = 'Dr';
	this.belongTo('user');
})

FactoryGirl.define('place', function() {
	this.id = 2;
	this.label = 'New York';
	this.hasOne('user');
})

FactoryGirl.define('user', function() {
  this.name = 'John';
  this.hasMany('places', 'place');
})

var profile = FactoryGirl.create('profile');
profile.attributes() // => {label: 'Dr'};
profile.toJSON() // => {id: 2, label: 'Dr', user_id: 1, user: {id: 1, title: 'That\'s awesome day', emotion: 'happy'}}

var place = FactoryGirl.create('place');
profile.toJSON() // => {id: 2, label: 'New York', user: {id: 1, place_id: 2, ...}}
```

### Create Multi Object
``` js
FactoryGirl.createLists('user') => [{id: 1, ...}, {id: 23, ....}]
```

### Sequences

``` js
FactoryGirl.sequence('seq_name', function(id) {
	return 'name ' + id;
});

FactoryGirl.define('user', function () {
	this.sequence('seq_name', 'name');
})

var user = FactoryGirl.create('user');
user.toJSON() // => {name: 'name 1'}

var user2 = FactoryGirl.create('user');
user2.toJSON() // => {name: 'name 2'}
```
