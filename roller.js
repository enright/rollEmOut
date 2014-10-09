'use strict';

// a roll randomly selects a value from something that provides the value
// that sounds like there's something that tells me
// how many values are provided
// returns a value when provided an index into the value
// probably is able to provide data for storage
// probably can be recreated by key/name

var roll = (function () {
	var rolls = [];
	return {
		roll: function (count, bonus) {
			bonus = bonus || 0;
			
			if (rolls[count]) {
				return rolls[count];
			} else {
				rolls[count] = function () {
					return Math.floor(Math.random() * count) + 1;
				};
			}
		}
	}
}());

function Roll(count) {
	if (!(this instanceOf Roll)) {
		return new Roll();
	}
	this.count = count;
}
Roll.prototype.count = function () {
	return this.count;
}
Roll.prototype.roll = function () {
	var index = Math.floor(Math.random() * this.count);
	return this.select(index);
}
Roll.prototype.select = function () {
	return undefined;
}
var roll =  {
}

function ArrayRoll(array) {
	if (!(this instanceOf ArrayRoll)) {
		return new ArrayRoll();
	}
	var arrayRoll = Object.create(new Roll(array.length));
}

ArrayRoll.prototype = new Roll

function createADie(sides, bonus) {
	if (Array.isArray(sides)) {
		return createDie(sides, bonus);
	} else {
		return createNumberDie(sides, bonus);
	}
}

function createNumberDie(number, bonus) {
	var numberDie = {},
		bonusValue = Number.isNumber(bonus) ? bonus : undefined;
	
	numberDie.getDice: function () {
		return [number];
	},
	numberDie.getBonus: function () {
		return bonus;
	},
	numberDie.roll: function () {
		var rollValue = Math.floor((Math.random() * (number)) + 1);
		return {
			roll: rollValue,
			bonus: bonus,
			total: bonusValue ? rollValue + bonusValue : rollValue
		}
	}
	return numberDie;
}

// create a die based on an array of sides
// don't make an assumption about the data except that
// a side may contain an array and that rolling means
// recursively randomizing the sides
function createDie(sides, bonus) {
	var die = {},
		dice = [],
		i,
		length = sides.length;
	
	// go through all sides, if any is an array
	// create a die for it
	for (i = 0; i < length; i += 1) {
		if (Array.isArray(sides[i]) {
			dice[i] = createDie(sides[i]);
		}
	}
	
	die.getDice: function () {
		return sides;
	},
	die.getBonus: function () {
		return bonus;
	},
	die.roll: function () {
		var index = Math.floor((Math.random() * (length)) + 1);
		if (dice[index]) {
			return dice[index].roll();
		} else {
			return {
				roll: sides[index],
				bonus: bonus
			}
		}
	}
	return die;
}

exports.createDie = createADie;

// return an object that has a number of rolls
function createRoller(dice, bonus) {
	var dies,
		i,
		length = dice.length;
		
	for (i = 0; i < length; i += 1) {
		dies.push(createADie(dice[i]);
	}
	
	return {
		getDice: function () {
			return dice;
		},
		getBonus: function () {
			return bonus;
		},
		roll: function () {
			var total = 0,
				i,
				length = dies.length;
			for (i = 0; i < length; i += 1) {
				var result = dies[i].roll();
				
				total = total + dies[i].roll();
			}
			return total + bonus;
		}
	};
}

exports.createRoller = createRoller;

function fromJSON(json) {
	if (json.dice.length === 1) {
		return createADie(json.dice[0], json.bonus);
	} else {
		return createRoller(json.dice, json.bonus);
	}
}


export.toJSON = toJSON;
