// call a function with result later
// a function that takes data
// is turned into a function that receives data and calls the function
// that sounds really stupid

function toCPS(f) {
	return function (data, cps) {
		var result = f(data);
		SetImmediate(function () {
			cps(result);
		});
	};
};

// pass in a function that takes data
function toErrback(f) {
	return function (data, cps) {
		var result = f(err, data);
		SetImmediate(function () {
			cps(result);
		});
	};
};

var immediateArrowLift = function (liftFunction) {
	var cpsFunction = toCPS(liftFunction),
		complete = function (data) {
			SetImmediate(function () {
				console.log('complete: ', data);
			});
			// whatever
		},
		lifted = {};
	lifted.next = function (nextFunction) {
		var cpsNext = toCPS(nextFunction);
		return immediateArrowLift (function (data) {
				nextFunction(liftFunction(data));
		});
	},
	lifted.run = function (data) {
		cpsFunction(data, complete);
	};
	return lifted;
}

// a lifted function should
// 1) get input data on run
// 2) set immediate and call function on input data
// 3) call completion when done

