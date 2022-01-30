import {
	REFLECT_STORE_SYMBOL,
	Type,
	TypeActivator,
	MetaStoreImpl
} from "tst-reflect";

/** @internal */
declare global
{
	export var process: NodeJS.Process;
	namespace NodeJS
	{
		interface Process
		{
			[REFLECT_STORE_SYMBOL]: NodeProcessMetaStore;
		}
	}
}

export class NodeProcessMetaStore implements MetaStoreImpl
{

	private _store: { [p: number]: Type } = {};

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
		return function () {
			return process[REFLECT_STORE_SYMBOL].get(id) ?? undefined;
		};
	}

	set(id: number, description: any): Type
	{
		const type = this.wrap(description);

		this._store[id] = type;

		return type;
	}

	wrap(description: any): Type
	{
		const type = Reflect.construct(Type, [], TypeActivator);
		type.initialize(description);
		return type;
	}

}

if (!process[REFLECT_STORE_SYMBOL])
{
	process[REFLECT_STORE_SYMBOL] = new NodeProcessMetaStore();
}

(Type as any)._setStore(process[REFLECT_STORE_SYMBOL]);

function _tst_reflect_wrap(description?: any)
{
	return process[REFLECT_STORE_SYMBOL].wrap(description);
}

function _tst_reflect_lazy(typeId: number)
{
	return process[REFLECT_STORE_SYMBOL].getLazy(typeId);
}

function _tst_reflect_set(typeId: number, data: any): void
{
	process[REFLECT_STORE_SYMBOL].set(typeId, data);
}

function _tst_reflect_get(typeId: number)
{
	return process[REFLECT_STORE_SYMBOL].get(typeId);
}

export {
	_tst_reflect_get,
	_tst_reflect_wrap,
};

