import {
	AccessModifier,
	Accessor
} from "../enums.ts";
import { Mapper } from "../mapper.ts";
import {
	LazyType,
	TypeProvider
} from "../Type.ts";
import type { Type } from "../Type.ts";
import {
	Decorator,
	DecoratorDescription
} from "./decorator.ts";

/**
 * @internal
 */
export interface PropertyDescription
{
	/**
	 * Name of the property
	 */
	n: string;

	/**
	 * Property type
	 */
	t: Type | TypeProvider;

	/**
	 * Optional property
	 */
	o: boolean;

	/**
	 * Decorators
	 */
	d?: Array<DecoratorDescription>;

	/**
	 * Access modifier
	 */
	am?: AccessModifier;

	/**
	 * Accessor
	 */
	acs?: Accessor;

	/**
	 * Readonly
	 */
	ro?: boolean;
}

/**
 * Property description
 */
export class PropertyInfo
{
	private readonly _type: LazyType;

	/**
	 * Property decorators
	 * @internal
	 */
	private _decorators: ReadonlyArray<Decorator>;

	/**
	 * Property name
	 */
	readonly name: string;

	/**
	 * Property type
	 */
	get type(): Type
	{
		return this._type.type;
	}

	/**
	 * Optional property
	 */
	readonly optional: boolean;

	/**
	 * Access modifier
	 */
	readonly accessModifier: AccessModifier;

	/**
	 * Accessor
	 */
	readonly accessor: Accessor;

	/**
	 * Readonly
	 */
	readonly readonly: boolean;

	/**
	 * @param description
	 * @internal
	 */
	protected constructor(description: PropertyDescription)
	{
		this.name = description.n;
		this._type = new LazyType(description.t);
		this._decorators = description.d?.map(Mapper.mapDecorators) || [];
		this.optional = description.o;
		this.accessModifier = description.am ?? AccessModifier.Public;
		this.accessor = description.acs ?? Accessor.None;
		this.readonly = description.ro ?? false;
	}

	/**
	 * Returns array of decorators
	 */
	getDecorators(): ReadonlyArray<Decorator>
	{
		return this._decorators.slice();
	}
}

/**
 * @internal
 */
export class PropertyInfoActivator extends PropertyInfo
{
}