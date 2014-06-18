describe('Model', function () {
	var user, visa, profile, another_profile, place, plateau;

	defineFactoryGirl();

	beforeEach(function() {
		user = libAPI.datum.createFactory('user');
		visa = libAPI.datum.createFactory('visa');
		profile = libAPI.datum.createFactory('profile');
		another_profile = libAPI.datum.createFactory('profile');
		place = libAPI.datum.createFactory('place');
		plateau = libAPI.datum.createFactory('plateau');
	})

	it('should exist', function () {
		expect(libAPI.Model).to.exist;
	});

	describe('#getName()', function () {

		it('has factory user\'s name', function () {
			expect(user.getName()).to.equal('user');
		});
	});

	describe('#attributes()', function () {

		it('user should have ... attributes', function () {
			expect(user.attributes()).to.eql({id: 1, name: 'Minh Quy'});
		});

		it('place should have ... attributes', function () {
			expect(place.attributes()).to.eql({id: 4, name: 'Earth'})
		});

		it('plateau should have ... attributes', function () {
			expect(plateau.attributes()).to.eql({id: 5, name: 'Earth', type: 'plateau'});
		});
	});

	describe('#toJSON()', function () {

		it('visa should have json with ... results ', function () {
			expect(visa.toJSON()).to.eql({
				id: 3,
				label: 'secret',
				user: {
					visa_id: 3,
					id: 1,
					name: 'Minh Quy'
				}
			});
		});

		it('profile should have json with ... results', function () {
			expect(profile.toJSON()).to.eql({
				id: 'id_1',
				emotion: 'Happy',
				user_id: 1,
				user: {
					id: 1,
					name: 'Minh Quy'
				}
			});
		});

		it('another profile should have json with ... results', function () {
			expect(another_profile.toJSON()).to.eql({
				id: 'id_2',
				emotion: 'Happy',
				user_id: 1,
				user: {
					id: 1,
					name: 'Minh Quy'
				}
			});
		});

		it('place should have json with ... results', function () {
			expect(place.toJSON()).to.eql({
				id: 4, name: 'Earth',
				users: [
					{id: 1, place_id: 4, name: 'Minh Quy'},
					{id: 1, place_id: 4, name: 'Minh Quy'}
				]
			});
		});

		it('plateau should have json with ... results', function () {
			expect(plateau.toJSON()).to.eql({
				id: 5,
				type: 'plateau',
				name: 'Earth',
				users: [
					{id: 1, plateau_id: 5, name: 'Minh Quy'},
					{id: 1, plateau_id: 5, name: 'Minh Quy'}
				]
			})
		});
	});

	describe('#belongTo()', function () {
		it('profile belong to user', function () {
			expect(profile.user).to.instanceof(libAPI.Model);
		});

		it('profile contains user_id', function () {
			expect(profile.user_id).to.equal(user.id);
		});

		it('mquy use users instead of user', function() {
			FactoryGirl.define('demo', function() {})
		})
	});

	describe('#hasOne()', function () {
		it('visa has user', function () {
			expect(visa.user).to.instanceof(libAPI.Model);
		});

		it('user contains visa_id', function () {
			expect(visa.user.visa_id).to.equal(visa.id);
		});
	});

	describe('#hasMany()', function () {
		it('place has two user', function () {
			expect(place.users).to.have.length(2)
		});

		it('each user is instanceof user factory', function() {
			expect(function() {
				place.users.forEach(function(iterator) {
					if (iterator instanceof libAPI.Model) return;
					throw Error();
				})
			}).to.not.throw();
		});

		it('user has place id', function () {
			expect(place.users[0].place_id).to.equal(place.id)
		});
	});

	describe('#sequence()', function() {
		it('should has id equal 2', function() {
			expect(another_profile.id).to.equal('id_2')
		});
	})
});
