describe('Model', function () {
	var user, visa, profile, place, plateau;

	defineFactoryGirl();

	beforeEach(function() {
		user = libAPI.datum.createFactory('user');
		visa = libAPI.datum.createFactory('visa');
		profile = libAPI.datum.createFactory('profile');
		place = libAPI.datum.createFactory('place');
		plateau = libAPI.datum.createFactory('plateau');
	})

	it('should exist', function () {
		expect(libAPI.Model).to.exist;
	});

	describe('#getName()', function () {
		it('has mquy\'s name', function () {
			expect(user.getName()).to.equal('user');
		});
	});

	describe('#attributes()', function () {
		it('user should have ... attributes', function () {
			expect(user.attributes()).to.eql({id: 1, name: 'Minh Quy'});
		});

		it('visa should have ... attributes', function () {
			expect(plateau.attributes()).to.eql({id: 5, name: 'Earth', type: 'plateau'});
		});
	});

	describe('#toJSON()', function () {
		it('user should have json with ... results', function () {
			expect(user.toJSON()).to.eql({
				id: 1,
				name: 'Minh Quy'
			});
		});

		it('visa should have json with ... results ', function () {
			expect(visa.toJSON()).to.eql({
				id: 3,
				label: 'secret',
				user: {
					visa_id: 3,
					id: 1,
					name: 'Minh Quy'
				}
			})
		});

		it('profile should have json with ... results', function () {
			expect(profile.toJSON()).to.eql({
				id: 2,
				emotion: 'Happy',
				user_id: 1,
				user: {
					id: 1,
					name: 'Minh Quy'
				}
			})
		});

		it('place should have json with ... results', function () {
			expect(place.toJSON()).to.eql({
				id: 4, name: 'Earth',
				user: [
					{id: 1, place_id: 4, name: 'Minh Quy'},
					{id: 1, place_id: 4, name: 'Minh Quy'}
				]
			})
		});

		it('plateau should have json with ... results', function () {
			expect(plateau.toJSON()).to.eql({
				id: 5,
				type: 'plateau',
				name: 'Earth',
				user: [
					{id: 1, plateau_id: 5, name: 'Minh Quy'},
					{id: 1, plateau_id: 5, name: 'Minh Quy'}
				]
			})
		});
	});

	describe('#belongTo()', function () {
		it('profile belong to user', function () {
			expect(profile.user).to.exist;
		});

		it('profile contains user_id', function () {
			expect(profile.user_id).to.equal(user.id);
		});
	});

	describe('#hasOne()', function () {
		it('visa has user', function () {
			expect(visa.user).to.exist;
		});

		it('user contains visa_id', function () {
			expect(visa.user.visa_id).to.equal(visa.id);
		});
	});

	describe('#hasMany()', function () {
		it('place has two user', function () {
			expect(place.user).to.have.length(2)
		});

		it('user has place id', function () {
			expect(place.user[0].place_id).to.equal(place.id)
		});
	});
});
