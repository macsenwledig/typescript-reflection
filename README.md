# JavaScript(/TypeScript) Runtime Reflection and Generics (tst-reflect)

> **The repository of TypeScript runtime reflection packages.**

[![tst-reflect](https://img.shields.io/npm/v/tst-reflect.svg?color=brightgreen&style=flat-square&logo=npm&label=tst-reflect)](https://www.npmjs.com/package/tst-reflect)
[![tst-reflect-transformer](https://img.shields.io/npm/v/tst-reflect-transformer.svg?color=brightgreen&style=flat-square&logo=npm&label=tst-reflect-transformer)](https://www.npmjs.com/package/tst-reflect-transformer)
[![License MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](https://opensource.org/licenses/MIT)

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=hookyns&repo=ts-reflection&theme=tokyonight)](https://github.com/Hookyns/ts-reflection)

[Examples](#examples) | [Synopsis](#synopsis) | [How to start](#how-to-start)

## About

Yeap! How the title says, this project is about runtime **reflection** with working **generic** types, 
achieved using custom TypeScript transformer plugin (package `tst-reflect-transformer`) 
and runtime stuff (package `tst-reflect`).

More info inside the corresponding folders, see `transformer`, `runtime`.

## Show Me Some Code!

### Simple Example
```typescript
import { getType } from "tst-reflect";

function printTypeProperties<TType>() {
    const type = getType<TType>();
    console.log(type.getProperties().map(prop => prop.name + ": " + prop.type.name).join("\n"));
}

interface SomeType {
    foo: string;
    bar: number;
    baz: Date;
}

printTypeProperties<SomeType>();
```

Output:
```
foo: string
bar: number
baz: Date
```

### Dependency Injection from scratch.
[![Run on repl.it](https://repl.it/badge/github/Hookyns/tst-reflect-example-01.git)](https://repl.it/github/Hookyns/tst-reflect-example-01.git)

<details><summary>Click to expand!</summary>
<p>

```typescript
import {
    getType,
    Type
} from "tst-reflect";

class ServiceCollection
{
    public readonly services: Array<[Type, any]> = [];

    addTransient<TDep, TImp>(dependencyType?: Type, dependencyImplementation?: Type | any)
    {
        this.services.push([dependencyType ?? getType<TDep>(), dependencyImplementation ?? getType<TImp>()]);
    }
}

class ServiceProvider
{
    private readonly serviceCollection: ServiceCollection;

    constructor(serviceCollection: ServiceCollection)
    {
        this.serviceCollection = serviceCollection;
    }

    getService<TDependency>(type?: Type): TDependency
    {
        if (type === undefined) 
        {
            type = getType<TDependency>();
        }
    
        // Find implementation of type
        const [, impl] = this.serviceCollection.services.find(([dep]) => dep.is(type));

        if (!impl)
        {
            throw new Error(`No implementation registered for '${type.name}'`);
        }

        if (!(impl instanceof Type))
        {
            return impl;
        }

        if (!impl.isClass())
        {
            throw new Error("Registered implementation is not class.");
        }

        // Parameter-less
        if (!impl.getConstructors()?.length)
        {
            return Reflect.construct(impl.ctor, []);
        }

        // Ctor with less parameters preferred
        const ctor = impl.getConstructors().sort((a, b) => a.parameters.length > b.parameters.length ? 1 : 0)[0];

        // Resolve parameters
        const args = ctor.parameters.map(param => this.getService(param.type))

        return Reflect.construct(impl.ctor, args);
    }
}

interface IPrinter
{
    printHelloWorld();

    printText(text: string);
}

abstract class BasePrinter implements IPrinter
{
    abstract printHelloWorld();

    abstract printText(text: string);
}

class ConsolePrinter extends BasePrinter implements IPrinter
{
    private readonly console: Console;

    constructor(console: Console)
    {
        super();
        this.console = console;
    }

    printHelloWorld()
    {
        this.console.log("Hello World!")
    }

    printText(text: string)
    {
        this.console.log(text)
    }
}

//-----------------------------------------

const collection = new ServiceCollection();

collection.addTransient(getType<Console>(), console);
collection.addTransient<IPrinter, ConsolePrinter>(); // Working runtime generic!!

const provider = new ServiceProvider(collection);

//-----------------------------------------

const printer = provider.getService<IPrinter>();
console.log("printer is instanceof ConsolePrinter:", printer instanceof ConsolePrinter);

printer.printHelloWorld();
printer.printText("Try it on repl.it");
printer.printText("And good bye!");
```

</p>
</details>

<details><summary>Generated JavaScript code</summary>
<p>

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const tst_reflect_1 = require("tst-reflect");
tst_reflect_1.getType({
    n: "Console",
    fn: "W:/tst-reflect/dev/node_modules/typescript/lib/lib.dom.d.ts:Console",
    props: [{n: "memory", t: tst_reflect_1.getType({n: "any", fn: "any", k: 2})}],
    k: 0
}, 20580);
tst_reflect_1.getType({n: "IPrinter", fn: "W:/tst-reflect/dev/example1.ts:IPrinter", k: 0}, 23131);
tst_reflect_1.getType({
    n: "BasePrinter",
    fn: "W:/tst-reflect/dev/example1.ts:BasePrinter",
    ctors: [{params: []}],
    k: 1,
    iface: tst_reflect_1.getType(23131)
}, 23133);
tst_reflect_1.getType({
    n: "ConsolePrinter",
    fn: "W:/tst-reflect/dev/example1.ts:ConsolePrinter",
    props: [{n: "console", t: tst_reflect_1.getType(20580)}],
    ctors: [{params: [{n: "console", t: tst_reflect_1.getType(20580)}]}],
    k: 1,
    ctor: () => ConsolePrinter,
    bt: tst_reflect_1.getType(23133)
}, 23139);

class ServiceCollection {
    constructor() {
        this.services = [];
    }

    foo(foo, __genericParams__) {
        return __genericParams__.A;
    }

    addTransient(dependencyType, dependencyImplementation, __genericParams__) {
        this.services.push([dependencyType ?? __genericParams__.TDep, dependencyImplementation ?? __genericParams__.TImp]);
    }
}

class ServiceProvider {
    constructor(serviceCollection) {
        this.serviceCollection = serviceCollection;
    }

    getService(type) {
        const [, impl] = this.serviceCollection.services.find(([dep]) => dep.is(type));
        if (!impl) {
            throw new Error(`No implementation registered for '${type.name}'`);
        }
        if (!(impl instanceof tst_reflect_1.Type)) {
            return impl;
        }
        if (!impl.isClass()) {
            throw new Error("Registered implementation is not class.");
        }
        if (!impl.getConstructors()?.length) {
            return Reflect.construct(impl.ctor, []);
        }
        const ctor = impl.getConstructors().sort((a, b) => a.parameters.length > b.parameters.length ? 1 : 0)[0];
        const args = ctor.parameters.map(param => this.getService(param.type));
        return Reflect.construct(impl.ctor, args);
    }
}

class BasePrinter {
}

class ConsolePrinter extends BasePrinter {
    constructor(console) {
        super();
        this.console = console;
    }

    printHelloWorld() {
        this.console.log("Hello World!");
    }

    printText(text) {
        this.console.log(text);
    }
}

const collection = new ServiceCollection();
collection.addTransient(undefined, undefined, {TDep: tst_reflect_1.getType(23131), TImp: tst_reflect_1.getType(23139)});
collection.addTransient(tst_reflect_1.getType(20580), console);
const provider = new ServiceProvider(collection);
const printer = provider.getService(tst_reflect_1.getType(23131));
console.log("printer is instanceof ConsolePrinter:", printer instanceof ConsolePrinter);
printer.printHelloWorld();
printer.printText("Try it on repl.it");
printer.printText("And good bye!");
```

</p>
</details>

### Short Explanation

There are two interesting parts in the example. First part is at the bottom, where `getType<T>()` call is. This function is imported from runtime package and
its return type is `Type` which is class imported from runtime package too.
`getType<T>()` is Alpha of the package. That's how you get your `Type`, the Omega of the package.

Second part is somewhere in the middle in method `getService<T>()` of `ServiceProvider` class where you can see some operations with `Type`.
Type details in [Synopsis](#synopsis).

## Examples
- [Example 01 - Dependency Injection](https://github.com/Hookyns/tst-reflect-example-01) [![Run on repl.it](https://repl.it/badge/github/Hookyns/tst-reflect-example-01.git)](https://repl.it/github/Hookyns/tst-reflect-example-01.git)

Feel free to add Your interesting examples. Just add a link to this README and make a PR.

### Decorator with Generic Reflection
`tst-reflect-transformer` is able to process class decorators marked by @reflectDecorator JSDoc tag.
You will be able to get `Type` of each decorated class.

```typescript
/**
 * @reflectDecorator
 */
export function inject<TType>()
{
    const typeofClass = getType<TType>();

    return function <TType extends { new(...args: any[]): {} }>(Constructor: TType) {
        return class extends Constructor
        {
            constructor(...args: any[])
            {
                super(...type.getConstructors()[0].parameters.map(param => serviceProvider.getService(param.type)));
            }
        }
    };
}

@inject()
class A {}

@inject()
class B {}
```

## How to start

`npm i tst-reflect && npm i tst-reflect-transformer -D`

In order to use transformer plugin you need TypeScript compiler which support plugins (if you don't want to write custom compiler via TypeScript API on
your own), eg. package [ttypescript](https://www.npmjs.com/package/ttypescript).

`npm i ttypescript -D`

Now just add transformer to `tsconfig.json` and run `ttsc` instead of `tsc`.

```json5
{
    "compilerOptions": {
        // your options...

        // ADD THIS!
        "plugins": [
            {
                "transform": "tst-reflect-transformer"
            }
        ]
    }
}
```

and with Webpack

```javascript
({
    test: /\.(ts|tsx)$/,
    loader: "ts-loader",
    options: {
        compiler: "ttypescript"
    }
})
```

## Synopsis

```typescript

/**
 * Object representing TypeScript type in memory
 */
export declare class Type
{
    static readonly Object: Type;

    /**
     * Returns information about generic conditional type.
     */
    get condition(): ConditionalType | undefined;

    /**
     * Returns a value indicating whether the Type is container for unified Types or not
     */
    get union(): boolean;

    /**
     * Returns a value indicating whether the Type is container for intersecting Types or not
     */
    get intersection(): boolean;

    /**
     * List of underlying types in case Type is union or intersection
     */
    get types(): ReadonlyArray<Type> | undefined;

    /**
     * Constructor function in case Type is class
     */
    get ctor(): Function | undefined;

    /**
     * Base type
     * @description Base type from which this type extends from or undefined if type is Object.
     */
    get baseType(): Type | undefined;

    /**
     * Interface which this type implements
     */
    get interface(): Type | undefined;

    /**
     * Get type full-name
     * @description Contains file path base to project root
     */
    get fullName(): string;

    /**
     * Get type name
     */
    get name(): string;

    /**
     * Get kind of type
     */
    get kind(): TypeKind;

    /**
     * Underlying value in case of literal type
     */
    get literalValue(): any;

    /**
     * Returns true if types are equals
     * @param type
     */
    is(type: Type): boolean;

    /**
     * Returns a value indicating whether the Type is a class or not
     */
    isClass(): boolean;

    /**
     * Returns a value indicating whether the Type is a interface or not
     */
    isInterface(): boolean;

    /**
     * Returns a value indicating whether the Type is an literal or not
     */
    isLiteral(): boolean;

    /**
     * Returns a value indicating whether the Type is an object literal or not
     */
    isObjectLiteral(): boolean;

    /**
     * Returns true if type is union or intersection of types
     */
    isUnionOrIntersection(): boolean;

    /**
     * Check if this type is a string
     */
    isString(): boolean;

    /**
     * Check if this type is a number
     */
    isNumber(): boolean;

    /**
     * Check if this type is a boolean
     */
    isBoolean(): boolean;

    /**
     * Check if this type is an array
     */
    isArray(): boolean;

    /**
     *
     * @return {boolean}
     */
    isObjectLike(): boolean;

    /**
     * Returns array of type parameters.
     */
    getTypeParameters(): ReadonlyArray<Type>;

    /**
     * Returns type arguments in case of generic type
     */
    getTypeArguments(): ReadonlyArray<Type>;

    /**
     * Returns constructor description when Type is a class
     */
    getConstructors(): ReadonlyArray<Constructor> | undefined;

    /**
     * Returns array of properties
     */
    getProperties(): ReadonlyArray<Property>;

    /**
     * Returns array of methods
     */
    getMethods(): ReadonlyArray<Method>;

    /**
     * Returns array of decorators
     */
    getDecorators(): ReadonlyArray<Decorator>;

    /**
     * Determines whether the class represented by the current Type derives from the class represented by the specified Type
     * @param {Type} classType
     */
    isSubclassOf(classType: Type): boolean;

    /**
     * Determines whether the current Type derives from the specified Type
     * @param {Type} targetType
     */
    isDerivedFrom(targetType: Type): boolean;

    /**
     * Determines whether the Object represented by the current Type is structurally compatible and assignable to the Object represented by the specified Type
     * @param {Type} target
     * @return {boolean}
     * @private
     */
    isStructurallyAssignableTo(target: Type): boolean;

    /**
     * Determines whether an instance of the current Type can be assigned to an instance of the specified Type.
     * @description This is fulfilled by derived types or compatible types.
     * @param target
     */
    isAssignableTo(target: Type): boolean;
}

/**
 * Kind of type
 */
export declare enum TypeKind
{
    /**
     * Interface
     */
    Interface = 0,
    /**
     * Class
     */
    Class = 1,
    /**
     * Native JavaScript/TypeScript type
     */
    Native = 2,
    /**
     * Container for other types in case of types union or intersection
     */
    Container = 3,
    /**
     * Type reference created during type checking
     * @description Usually Array<...>, ReadOnly<...> etc.
     */
    TransientTypeReference = 4,
    /**
     * Some specific object
     * @description Eg. "{ foo: string, bar: boolean }"
     */
    Object = 5,
    /**
     * Some subtype of string, number, boolean
     * @example <caption>type Foo = "hello world" | "hello"</caption>
     * String "hello world" is literal type and it is subtype of string.
     *
     * <caption>type TheOnlyTrue = true;</caption>
     * Same as true is literal type and it is subtype of boolean.
     */
    LiteralType = 6,
    /**
     * Fixed lenght arrays literals
     * @example <caption>type Coords = [x: number, y: number, z: number];</caption>
     */
    Tuple = 7,
    /**
     * Generic parameter type
     * @description Represent generic type parameter of generic types. Eg. it is TType of class Animal<TType> {}.
     */
    TypeParameter = 8,
    /**
     * Conditional type
     */
    ConditionalType = 9
}

export declare enum Accessor
{
    None = 0,
    Getter = 1,
    Setter = 2
}

export declare enum AccessModifier
{
    Private = 0,
    Protected = 1,
    Public = 2
}

export interface ConditionalType
{
    /**
     * Extends type
     */
    extends: Type;
    /**
     * True type
     */
    trueType: Type;
    /**
     * False type
     */
    falseType: Type;
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
     * Optional property
     */
    optional: boolean;
    /**
     * Property decorators
     */
    decorators: ReadonlyArray<Decorator>;
    /**
     * Access modifier
     */
    accessModifier: AccessModifier;
    /**
     * Accessor
     */
    accessor: Accessor;
    /**
     * Readonly
     */
    readonly: boolean;
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
    type: Type;
    /**
     * Parameter is optional
     */
    optional: boolean;
}

export declare class MethodBase
{
    /**
     * Parameters of this method
     */
    getParameters(): ReadonlyArray<MethodParameter>;
}

/**
 * Method details
 */
export declare class Method extends MethodBase
{
    /**
     * Name of this method
     */
    get name(): string;

    /**
     * Return type of this method
     */
    get returnType(): Type;

    /**
     * Method is optional
     */
    get optional(): boolean;

    /**
     * Access modifier
     */
    get accessModifier(): AccessModifier;

    /**
     * Returns list of generic type parameter.
     * @return {Array<Type>}
     */
    getTypeParameters(): ReadonlyArray<Type>;

    /**
     * Returns array of decorators
     */
    getDecorators(): ReadonlyArray<Decorator>;
}

/**
 * Constructor details
 */
export declare class Constructor extends MethodBase
{
}
```

## Motivation

I'm developing this for own Dependency Injection system, to allow registering and resolving based on types. Something like:

```
serviceCollection.AddScoped<ILog, Log>();
...
serviceProvider.Resolve<ILog>();
```

Where resolve() take care about constructors parameters, based on their types, and resolve everything.

## Known Issues

* Order of generated meta can be wrong in case of circular modules.

## License
This project is licensed under the [MIT license](./LICENSE).
