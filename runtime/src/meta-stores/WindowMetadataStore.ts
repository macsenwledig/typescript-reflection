import { REFLECT_STORE_SYMBOL } from "../consts";
import { Type }                 from "../Type";
import { MetadataStore }        from "./MetadataStore";
import { MetadataStoreBase }    from "./MetadataStoreBase";

/** @internal */
declare global
{
	export var window: Window & typeof globalThis;

	interface Window
	{
		[REFLECT_STORE_SYMBOL]: WindowMetadataStore;
	}

}

export class WindowMetadataStore extends MetadataStoreBase
{

	private _store: { [p: number]: Type } = {};

	public static initiate(): MetadataStore
	{
		if (!window)
		{
			throw new Error("This environment does not support window store. Are you running this in a nodejs environment?");
		}

		if (window[REFLECT_STORE_SYMBOL])
		{
			return window[REFLECT_STORE_SYMBOL];
		}

		window[REFLECT_STORE_SYMBOL] = new WindowMetadataStore();

		(Type as any)._setStore(window[REFLECT_STORE_SYMBOL]);

		return window[REFLECT_STORE_SYMBOL];
	}

	public static get(): MetadataStore
	{
		return window[REFLECT_STORE_SYMBOL] || this.initiate();
	}

	get store(): { [p: number]: Type }
	{
		return this._store;
	}

	get(id: number): Type | undefined
	{
		return this._store[id] ?? undefined;
	}

	getLazy(id: number): () => (Type | undefined)
	{
		return function lazyType() {
			return window[REFLECT_STORE_SYMBOL].get(id) ?? undefined;
		};
	}
}