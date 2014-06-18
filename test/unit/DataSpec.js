describe('Data', function () {
	defineFactoryGirl();

	it('datum should be defined', function () {
		expect(libAPI.datum).to.exist;
	});

	describe('#checkDefined()', function () {

		it('should contain user, account, visa, ... defined', function () {
			(function() {
				libAPI.datum.checkDefined('user');
				libAPI.datum.checkDefined('account');
				libAPI.datum.checkDefined('visa');
				libAPI.datum.checkDefined('master');
				libAPI.datum.checkDefined('paypal');
				libAPI.datum.checkDefined('profile');
				libAPI.datum.checkDefined('place');
				libAPI.datum.checkDefined('plateau');
			}).should.not.throw();
		});

		it('mquy should be not defined', function () {
			(function() {
				libAPI.datum.checkDefined('mquy');
			}).should.throw();
		});
	});

	describe('#setDefined()', function () {
		createNewFactory({});

		it('create mquy\'s factory successfully', function () {
			(function() {
				libAPI.datum.checkDefined('mquy');
			}).should.not.throw();
		});
	});

	describe('#setAlias()', function () {

		it('alias is array in opts', function () {
			libAPI.datum.setAlias({alias: ['mquy', 'luffy']}, function(){});
			(function() {
				libAPI.datum.checkDefined('mquy');
				libAPI.datum.checkDefined('luffy');
			}).should.not.throw();
		});

		it('alias is string in opts', function () {
			libAPI.datum.setAlias({alias: 'mquy'}, function(){});
			(function() {
				libAPI.datum.checkDefined('mquy');
			}).should.not.throw();
		});
	});

	describe('#getOptions()', function () {
		var options = {mocha: true, jasmine: false};
		createNewFactory(options);

		it('get the same', function () {
			expect(libAPI.datum.getOptions('mquy')).to.eql(options);
		});
	});

	describe('#getDefined()', function () {
		var define = function() {};
		createNewFactory({}, define);

		it('get correctly', function () {
			expect(libAPI.datum.getDefined('mquy')).to.equal(define);
		});
	});

	describe('#createFactory()', function () {
		var spy;

		beforeEach(function() {
			spy = sinon.spy();
			FactoryGirl.define('mquy', spy);
		})

		it('should be instance of model', function () {
			libAPI.datum.createFactory('mquy');
			spy.called.should.equal.true;
		});
	});

	describe('#remove()', function () {
		it('mquy should not exist', function () {
			libAPI.datum.remove('user');
			(function() {
				libAPI.datum.checkDefined('user');
			}).should.throw();
		});
	});

	describe('#clear()', function () {
		it('should not contain any factories', function () {
			libAPI.clear();
			expect(libAPI.datum.count()).to.equal(0);
		});
	});
});
