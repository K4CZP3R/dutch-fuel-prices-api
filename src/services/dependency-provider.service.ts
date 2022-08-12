export class DependencyProviderService {
	private static instance: DependencyProviderService;

	private dependencyStorage: { [name: string]: unknown } = {};

	private static getInstance(): DependencyProviderService {
		if (!DependencyProviderService.instance) DependencyProviderService.instance = new DependencyProviderService();
		return DependencyProviderService.instance;
	}

	public static setImpl<T>(name: string, implementation: T): void {
		this.getInstance().dependencyStorage[name] = implementation;
	}
	public static getImpl<T>(name: string): T {
		return this.getInstance().dependencyStorage[name] as T;
	}
}
export function Inject<T>(name: string): (target: unknown, key: string | symbol) => void {
	return function (target: unknown, key: string | symbol) {
		const getter = () => {
			return DependencyProviderService.getImpl<T>(name);
		};
		const setter = (__next: never) => {
			throw new Error("Can't assign to inject decorated property!");
		};

		Object.defineProperty(target, key, {
			get: getter,
			set: setter,
			enumerable: true,
			configurable: true,
		});
	};
}
