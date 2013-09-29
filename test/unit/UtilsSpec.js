describe('Utils', function () {
	describe('#merge()', function () {
		it('should exist', function () {
			expect(libAPI.utils.merge).to.be.a('function')
		});

		it('throw Error when target empty', function () {
			expect(libAPI.utils.merge).to.throw(Error);
		});

		describe('merge correctly', function () {
			var target, source;

			beforeEach(function() {
				target = {mocha: true, jasmine: false};
				source = {mocha: false, qunit: true};
			})

			it('no changing when source empty', function () {
				var origin = target;
				libAPI.utils.merge(target);
				expect(target).to.eql(origin);
			});

			it('with keep', function () {
				libAPI.utils.merge(target, source, true);
				expect(target).to.eql({mocha: true, jasmine: false, qunit: true});
			});

			it('without keep', function () {
				libAPI.utils.merge(target, source);
				expect(target).to.eql({mocha:false, jasmine: false, qunit: true});
			});
		});
	});
});
