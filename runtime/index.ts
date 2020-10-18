const PACKAGE_ID: string = "tst-reflect"﻿

/**
 * Kind of type
 */
export enum TypeKind
{
	/**
	 * Interface
	 */
	Interface,

	/**
	 * Class
	 */
	Class,

	/**
	 * Native JavaScript/TypeScript type
	 */
	Native,

	/**
	 * Container for other types in case of types union or intersection
	 */
	Container
}

/**
 * @internal
 */
export interface ParameterDescription
{
	n: string;
	t: Type
}

/**
 * @internal
 */
export interface PropertyDescription
{
	n: string;
	t: Type;
	d?: Array<DecoratorDescription>;
}

/**
 * Property description
 */
export interface Property
{
	/**
	 * Property name
	 */
	name: string;

	/**
	 * Property type
	 */
	type: Type;

	/**
	 * Property decorators
	 */
	decorators: Array<Decorator>;
}

/**
 * @internal
 */
export interface DecoratorDescription
{
	n: string;
	fn: string;
}

/**
 * Decoration description
 */
export interface Decorator
{
	/**
	 * Decorator name
	 */
	name: string;

	/**
	 * Decorator full name
	 */
	fullName?: string;
}

/**
 * Method parameter description
 */
export interface MethodParameter
{
	/**
	 * Parameter name
	 */
	name: string;
	
	/**
	 * Parameter type
	 */
	type: Type
}

/**
 * @internal
 */
export interface ConstructorDescription
{
	params: Array<ParameterDescription>
}

/**
 * Constructor description object
 */
export interface Constructor
{
	/**
	 * Constructor parameters
	 */
	parameters: Array<MethodParameter>
}

/**
 * @internal
 */
export interface TypeProperties
{
	n?: string;
	fn?: string;
	k: TypeKind;
	ctors?: Array<ConstructorDescription>;
	props?: Array<PropertyDescription>;
	decs?: Array<DecoratorDescription>;
	union?: boolean;
	inter?: boolean;
	types?: Array<Type>;
	ctor?: () => Function;
	bt?: Type;
	iface?: Type;
}

const typesMetaCache: { [key: number]: Type } = {};

/**
 * Object representing TypeScript type in memory
 */
export class Type
{
	private static readonly objectType = new Type({
		n: "Object",
		fn: "Object",
		ctor: Object,
		k: TypeKind.Native
	});
	
	private readonly _ctor?: () => Function;
	private readonly _kind: TypeKind;
	private readonly _name: string;
	private readonly _fullName: string;
	private readonly _isUnion: boolean;
	private readonly _isIntersection: boolean;
	private readonly _types?: Array<Type>;
	private readonly _properties: Array<Property>;
	private readonly _decorators: Array<Decorator>;
	private readonly _constructors: Array<Constructor>;
	private readonly _baseType?: Type;
	private readonly _interface?: Type;

	/**
	 * Internal Type constructor
	 * @internal
	 */
	constructor(description: TypeProperties)
	{
		if (new.target != TypeActivator)
		{
			throw new Error("You cannot create instance of Type manually!");
		}

		this._name = description.n || "";
		this._fullName = description.fn || "";
		this._kind = description.k;
		this._constructors = description.ctors?.map(Type.mapConstructors) || [];
		this._properties = description.props?.map(Type.mapProperties) || [];
		this._decorators = description.decs?.map(Type.mapDecorators) || [];
		this._ctor = description.ctor;
		this._baseType = description.bt ?? (description.ctor == Object ? undefined : Type.objectType);
		this._interface = description.iface;

		this._isUnion = description.union || false;
		this._isIntersection = description.inter || false;
		this._types = description.types;
	}

	/**
	 * @internal
	 * @param typeId
	 */
	public static _getTypeMeta(typeId: number)
	{
		const type = typesMetaCache[typeId];

		if (!type)
		{
			throw new Error(`Unknown type identifier '${typeId}'. Metadata not found.`);
		}

		return type;
	}

	/**
	 * @internal
	 * @param typeId
	 * @param type
	 */
	public static _storeTypeMeta(typeId: number, type: Type)
	{
		typesMetaCache[typeId] = type;
	}

	/**
	 * @internal
	 * @param d
	 */
	private static mapDecorators(d: DecoratorDescription)
	{
		return ({name: d.n, fullName: d.fn});
	}

	/**
	 * @internal
	 * @param p
	 */
	private static mapProperties(p: PropertyDescription)
	{
		return ({name: p.n, type: p.t, decorators: p.d?.map(Type.mapDecorators)});
	}

	/**
	 * @internal
	 * @param c
	 */
	private static mapConstructors(c: ConstructorDescription)
	{
		return ({parameters: c.params.map(p => ({name: p.n, type: p.t}))});
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns a value indicating whether the Type is container for unified Types or not
	 */
	get isUnion(): boolean
	{
		return this._isUnion;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns a value indicating whether the Type is container for intersecting Types or not
	 */
	get isIntersection(): boolean
	{
		return this._isIntersection;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * List of underlying types in case Type is union or intersection
	 */
	get types(): Array<Type> | undefined
	{
		return this._types;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Constructor function in case Type is class
	 */
	get ctor(): Function | undefined
	{
		return this._ctor?.();
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Base type
	 */
	get baseType(): Type | undefined
	{
		return this._baseType;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Get type full-name
	 * @description Contains file path base to project root
	 */
	get fullName(): string
	{
		return this._fullName;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Get type name
	 */
	get name(): string
	{
		return this._name;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Get kind of type
	 */
	get kind(): TypeKind
	{
		return this._kind;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns true if types are equals
	 * @param type
	 */
	is(type: Type)
	{
		return this._fullName == type._fullName;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns a value indicating whether the Type is a class or not
	 */
	isClass(): boolean
	{
		return this.kind == TypeKind.Class;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns a value indicating whether the Type is a interface or not
	 */
	isInterface(): boolean
	{
		return this.kind == TypeKind.Interface;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns constructor description when Type is a class
	 */
	getConstructors(): Array<Constructor> | undefined
	{
		if (!this.isClass())
		{
			return undefined;
		}

		return this._constructors;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns interface which this type implements
	 */
	getInterface(): Type | undefined
	{
		return this._interface;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns array of properties
	 */
	getProperties(): Array<Property>
	{
		return this._properties;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Returns array of decorators
	 */
	getDecorators(): Array<Decorator>
	{
		return this._decorators;
	}
}

class TypeActivator extends Type
{
}

/**
 * Returns Type of generic parameter
 */
export function getType<T>(): Type
/** @internal */
export function getType<T>(description?: TypeProperties | number, typeId?: number): Type
{
	// Return type from storage
	if (typeof description == "number")
	{
		return Type._getTypeMeta(description);
	}

	// Construct Type instance
	if (description && description.constructor === Object)
	{
		const type = Reflect.construct(Type, [description], TypeActivator);

		// Store Type if it has ID
		if (typeId)
		{
			Type._storeTypeMeta(typeId, type);
		}

		return type;
	}

	throw new Error(`Cannot be called. Call of this function should be replaced by Type while TS compilation. Check if '${PACKAGE_ID}' transformer is used.`);
}


/**
 * Decorator for marking methods as they accept generic parameters as arguments
 */
export function reflectGeneric()
{
	return function (target, propertyKey) {
	}
}

// To identify functions by package
export const TYPE_ID_PROPERTY_NAME = "__tst_reflect__";
reflectGeneric.__tst_reflect__ = true;
getType.__tst_reflect__ = true;