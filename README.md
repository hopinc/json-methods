# `json-methods`

A utility for adding methods to any JSON object. For example, deserializing a user object from your API and adding a `.isAdult()`. Whilst this library works great for validation, use cases extend far beyond that. It was built for `@onehop/js` to enable regular objects to have utility methods that are context aware (like fetching a deployment's containers in Hop).

## Installation

```bash
# With yarn
yarn add @onehop/json-methods

# With npm
npm install --save @onehop/json-methods
```

## Basic Example

For something a little bit more in depth, but still simple, check out [/examples/basic.ts](/examples/basic.ts)

```ts
import {create} from '@onehop/json-methods';

interface User {
	id: string;
	email: string;
	age: number;
}

const Users = create<User>().methods({
	// Methods must be created with method function syntax,
	// rather than property arrow functions (so that `this` can be bound)
	isAdult() {
		return this.age >= 18;
	},
});

// json is the JSON object that we want to add methods to
const json = await getUserFromAPI();
const user = Users.from(json);

// Or, if you have a JSON string, we can parse it for you
const user = Users.parse(json);

// Safely access properties:
console.log(user.email);

// And call our methods
console.log('Can watch the movie?:', user.isAdult());
```

## Validation

While you can use this library to validate certain fields in an object, `json-methods` will not validate that an object has the correct fields (at runtime we cannot know what fields an object will have, even if you pass a TypeScript generic). For this reason, `json-methods` supports `.from` which will allow you to use something like Zod or Yup.

```ts
const schema = z.object({
	age: z.number().min(0),
});

// Infer type from the schema for single source of truth
const Users = create<z.infer<typeof schema>>().methods({
	isAdult() {
		return this.age >= 18;
	},
});

const raw = await getUserFromAPI();
const user = Users.from(schema.parse(raw));

console.log('Can watch the movie?:', user.isAdult());
```

## Advanced TypeScript

For more advanced use cases, there's a type exported called `Infer` that will allow you to get the full type of your object with the methods added

```ts
import {create, Infer} from '@onehop/json-methods';

const Users = create<{age: number}>().methods({
	isAdult() {
		return this.age >= 18;
	},
});

// UserWithMethods is {age: number} & {isAdult(): boolean}
type UserWithMethods = Infer<typeof Users>;
```
