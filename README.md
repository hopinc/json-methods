# `json-methods`

A utility for adding methods to any JSON object. For example, deserializing a user object from your API and adding a `.isAdult()`.

## Basic Example

```ts
import { create } from "@onehop/json-methods";

interface User {
	id: string;
	email: string;
	age: number;
}

const users = create<User>().methods({
	// Methods must be created with method function syntax,
	// rather than property arrow functions (so that `this` can be bound)
	isAdult() {
		return this.age >= 18;
	},
});

// json is the JSON object that we want to add methods to
const json = await getUserFromAPI();
const user = users.from(json);

// Safely access properties:
console.log(user.email);

// And call our methods
console.log("Can watch the movie?:", user.isAdult());
```
