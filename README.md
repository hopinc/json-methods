# `json-methods`

A utility for adding methods to any JSON object. For example, deserializing a user object from your API and adding a `.isAdult()`.

## Installation

```bash
# With yarn
yarn add @onehop/json-methods

# With npm
npm install --save @onehop/json-methods
```

## Basic Example

For something a little bit more in depth, but still simple, checkout [/examples/basic.ts](/examples/basic.ts)

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

// Or, if you have a JSON string, we can parse it for you
const user = users.parse(json);

// Safely access properties:
console.log(user.email);

// And call our methods
console.log("Can watch the movie?:", user.isAdult());
```

## Runtimes

This library is designed to work in any runtime that supports `Proxy`, so feel free to pop it into Bun, Node, Cloudflare workers or any modern browser.
