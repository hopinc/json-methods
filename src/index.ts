type Key = string | number | symbol;

type RecordOf<T> = Record<Key, T>;
type Method<T> = (this: T, ...args: any[]) => unknown;

export function create<T extends object>() {
	function methods<M extends RecordOf<Method<T>>>(methods: M) {
		function getProxy(json: T) {
			return new Proxy(json, {
				get(_, property) {
					if (property === "toJSON") {
						return () => json;
					}

					if (property === "toString") {
						return () => "[object Object]";
					}

					if (property in json) {
						return json;
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

		return {
			parse(json: string) {
				return getProxy(JSON.parse(json) as T);
			},

			from(data: T) {
				return getProxy(data);
			},
		};
	}

	return { methods };
}
