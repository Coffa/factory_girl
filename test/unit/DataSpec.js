describe('Data', function () {
	defineFactoryGirl();

	it('datum should be defined', function () {
		expect(libAPI.datum).to.exist
	});

	describe('#checkDefined()', function () {
		it('should be defined', function () {
			expect(libAPI.datum.checkDefined).to.be.a('function');
		});

		it('should contain all defined', function () {
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

	});
});
