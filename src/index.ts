type Key = string | number | symbol;
type RecordOf<T> = Record<Key, T>;
type Method<T> = (this: T, ...args: any[]) => unknown;

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
	};
}

export function create<T extends object>() {
	function methods<M extends RecordOf<Method<T>>>(methods: M) {
		return {
			parse(json: string) {
				return merge(JSON.parse(json) as T, methods);
			},

			from(data: T) {
				return merge(data, methods);
			},
		};
	}

	return {
		methods,
	};
}

export type Infer<T> = T extends {parse(json: string): infer R} ? R : never;
