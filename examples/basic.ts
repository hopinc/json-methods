import {create} from '../src/index';

interface User {
	name: string;
	age: number;
}

const users = create<User>().methods({
	getAge() {
		return this.age;
	},

	getName() {
		return this.name;
	},

	isAdult() {
		return this.age >= 18;
	},

	// Methods can take arguments, too!
	isAtLeastAge(age: number) {
		return this.age >= age;
	},

	exampleWithArrow: () => {
		// This is an example of why you can't use an arrow function here, you must use
		// method syntax to access .this (as that is how the method is bound)
		// @ts-ignore
		return this.name;
	},
});

// Or, you can parse a direct object (for example if you want to do schema valdiation first)
// and use .from: `const alistair = users.from({ name: 'alistair', age: 17 });`
const alistair = users.parse(JSON.stringify({name: 'alistair', age: 17}));

// Accessing property .name from raw object and also our method .getAge() & .isAdult()
console.log(
	alistair.name,
	'is',
	alistair.getAge(),
	'is adult?:',
	alistair.isAdult(),
);
console.log('Alistair is over 16?:', alistair.isAtLeastAge(16));

// Stringifing will result in the original object JSON you parsed in
console.log(JSON.stringify(alistair));

// Proof that the proxy behaves like a regular object
// when getting keys...
console.log('Keys:', Object.getOwnPropertyNames(alistair));

// ...and when iterating keys
for (const key in alistair) {
	console.log(key);
}

// Stringifying the proxy will result in the dreaded [object Object]
console.log(`Stringifying ${alistair}`);
