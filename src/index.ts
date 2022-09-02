type AnyMethod = (...args: any[]) => any;

function merge<T, M>(json: T, methods: M) {
	for (const key in methods) {
		if (key in json) {
			throw new Error(
				`Key ${key} already exists in json, so cannot apply a method with the same name.`,
			);
		}
	}

	return {
		...json,
		...methods,
	} as T & M;
}

/**
 * SchemaLike is any validation object that has a .parse method
 */
export interface SchemaLike<T> {
	/**
	 * Parses the input and returns the parsed value. If the input is invalid, it should throw an error.
	 * and be caught by the caller. json-methods will not handle errors itself.
	 * @param data The data to parse
	 */
	parse(data: unknown): T;
}

export interface JSONMethodInstance<In, Out> {
	parse(json: string): Out;
	from(data: In): Out;
}

export function create<T extends object>(schema?: SchemaLike<T>) {
	function methods<M extends object>(
		methods: M[keyof M] extends AnyMethod ? M & ThisType<T & M> : never,
	): JSONMethodInstance<T, T & M> {
		const resolve = (data: T) =>
			merge<T, M>(schema ? schema.parse(data) : data, methods);

		return {
			parse(json: string) {
				return resolve(JSON.parse(json));
			},

			from(data: T) {
				return resolve(data);
			},
		};
	}

	return {
		methods,
	};
}

export type Infer<T> = T extends JSONMethodInstance<unknown, infer Out>
	? Out
	: never;
