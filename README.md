# Factory Girl

port features from factory_girl in rails to nodejs

## Installation

Node.js:

    npm install 'factory_girl'

## Defining Factories

Javascript

``` js
var FactoryGirl = require('factory_girl');

FactoryGirl.define('user', function() {
	this.id = 1;
	this.association('profile');
})

FactoryGirl.define('profile', function() {
	this.id = 1;
	this.create_lists('detail', 2); # => 2: the number of association which were created
})

FactoryGirl.define('detail', function() {
	this.id = 1;
})

var user = FactoryGirl.create('user');
user.attributes() # => {id: 1}
user.toJSON() # => {id: 1, profile: {id: 1, user_id: 1, detail: [{id: 1, profile_id: 1}, {id: 1, profile_id: 1}]}}

FactoryGirl.attributes_for('user') # => {id: 1}
```
