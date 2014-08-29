defineFactoryGirl = function(){
  beforeEach(function() {
    FactoryGirl.clear();

    FactoryGirl.sequence('s_id', function(i) {
      return 'id_' + i;
    });

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
  		this.sequence('s_id', 'id');
  		this.emotion = 'Happy';
  		this.belongsTo('user');
  	})

  	FactoryGirl.define('place', function() {
  		this.id = 4;
  		this.name = 'Earth';
  		this.hasMany('users', 'user', 2);
  	})

  	FactoryGirl.define('plateau', {inherit: 'place'}, function() {
  		this.id = 5;
  		this.type = 'plateau';
  	})
  });
};

createNewFactory = function(opts, define) {
  beforeEach(function() {
    libAPI.datum.setDefined('mquy', opts, define);
  })
}
