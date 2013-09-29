defineFactoryGirl = function(){
  before(function() {
  	FactoryGirl.define('user', {alias: 'account'}, function() {
  		this.id = 1;
  		this.name = 'Minh Quy';
  	})

  	FactoryGirl.define('visa', {alias: ['master', 'paypal']}, function() {
  		this.id = 3;
  		this.label = 'secret';
  		this.hasOne('user');
  	})

  	FactoryGirl.define('profile', function() {
  		this.id = 2;
  		this.emotion = 'Happy';
  		this.belongTo('user');
  	})

  	FactoryGirl.define('place', function() {
  		this.id = 4;
  		this.name = 'Earth';
  		this.hasMany('user');
  	})

  	FactoryGirl.define('plateau', {inherit: 'place'}, function() {
  		this.id = 5;
  		this.type = 'plateau';
  	})
  })
};
