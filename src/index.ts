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

export function create<T extends object>() {
	function methods<M extends object>(
		methods: M[keyof M] extends AnyMethod ? M & ThisType<T & M> : never,
	) {
		return {
			parse(json: string) {
				return merge<T, M>(JSON.parse(json) as T, methods);
			},

			from(data: T) {
				return merge<T, M>(data, methods);
			},
		};
	}

	return {
		methods,
	};
}

export type Infer<T> = T extends {parse(json: string): infer R} ? R : never;
