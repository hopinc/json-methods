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

## Validation / Schemas

`json-methods` supports third-party schemas out of the box. You can write your own, or use things like Zod, Yup or Joi. The precondition is that the schema object itself has a method with the signature `parse(data: unknown): T` Here's a basic example using Zod:

```ts
import {create} from '@onehop/json-methods';
import {z} from 'zod';

// This schema has a .parse method internally, so it will work
// with json-methods without any modification
const schema = z.object({
	age: z.number().min(0),
});

const Users = create(schema).methods({
	isAdult() {
		return this.age >= 18;
	},
});

// During this phase, the schema will be used to validate the passed object.
// If you do not pass a schema, then the raw data will be used, but you
// could run into runtime errors if you try to access properties that don't exist!
// For this reason, it's recommended to always pass a schema if you can
const user = Users.from(await getUserFromAPI());

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
