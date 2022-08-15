import { create } from "../src/index";

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

	isAtLeastAge(age: number) {
		return this.age >= age;
	},
});

// Or, you can parse a direct object (for example if you want to do schema valdiation first)
// and use .from: `const alistair = users.from({ name: 'alistair', age: 17 });`
const alistair = users.parse(JSON.stringify({ name: "alistair", age: 17 }));

console.log(alistair.getName(), "is", alistair.getAge(), "is adult?:", alistair.isAdult());
console.log("Alistair is over 16?:", alistair.isAtLeastAge(16));

// Stringifing will result in the original object JSON you parsed in
console.log(JSON.stringify(alistair));

console.log("Keys:", Object.getOwnPropertyNames(alistair));
