describe('Module', function () {
	defineFactoryGirl();

	describe('#define()', function () {
		it('throw error when lack function', function () {
			(function() {
				FactoryGirl.define('user');
			}).should.throw();
		});

		it('define mquy', function () {
			FactoryGirl.define('mquy', function() {});
			expect(FactoryGirl.defined('mquy')).to.be.true;
		});
	});

	describe('#defined()', function () {
		it('should have user', function () {
			expect(FactoryGirl.defined('user')).to.be.true;
		});

		it('should not have mquy', function () {
			expect(FactoryGirl.defined('mquy')).to.be.false;
		});
	});

	describe('#create()', function () {
		it('should create user', function () {
			user = FactoryGirl.create('user')
			expect(user).to.exist;
		});
	});

	describe('#createLists()', function () {
		it('should have 2 user', function () {
			users = FactoryGirl.createLists('user', 2);
			expect(users).to.have.length(2);
		});
	});

	describe('#attributesFor()', function () {
		it('user should have ... attributes', function () {
			user = FactoryGirl.attributesFor('user');
			expect(user).to.eql({id: 1, name: 'Minh Quy'});
		});
	});
});
