type Key = string | number | symbol;
type RecordOf<T> = Record<Key, T>;
type Method<T> = (this: T, ...args: any[]) => unknown;

function getProxy<T extends object, M extends RecordOf<Method<T>>>(
	json: T,
	methods: M,
) {
	return new Proxy(json, {
		get(_, property) {
			if (property === 'toJSON') {
				return () => json;
			}

			if (property === 'toString') {
				return () => '[object Object]';
			}

			if (property in json) {
				return json[property as keyof T];
			}

			if (property in methods) {
				return methods[property].bind(json);
			}

			// No property found, so behave like a regular object (undefined)
			return undefined;
		},

		has(_, property) {
			return property in json || property in methods;
		},
	}) as T & M;
}

export function create<T extends object>() {
	function methods<M extends RecordOf<Method<T>>>(methods: M) {
		return {
			parse(json: string) {
				return getProxy(JSON.parse(json) as T, methods);
			},

			from(data: T) {
				return getProxy(data, methods);
			},
		};
	}

	return {
		methods,
	};
}

export type Infer<T> = T extends {parse(json: string): infer R} ? R : never;
