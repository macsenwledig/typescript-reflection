import * as TstReflect      from 'tst-reflect';
import { getType }          from "tst-reflect";
import NestedClass                                           from "./Nested/NestedClass";
import { AnotherServiceClassWithAbstract, SomeServiceClass } from "./SomeServiceClass";

const someServiceClassReflected = getType<SomeServiceClass>();
const someServiceClassResolved = Reflect.construct(someServiceClassReflected.ctor, []);

const anotherServiceClassReflected = getType<AnotherServiceClassWithAbstract>();
const anotherServiceClassResolved = Reflect.construct(anotherServiceClassReflected.ctor, []) as AnotherServiceClassWithAbstract;
anotherServiceClassResolved.getAType();

console.log(someServiceClassResolved instanceof SomeServiceClass);
console.log(someServiceClassResolved.someMethod());
console.log(someServiceClassReflected.constructorDescription);
console.log(someServiceClassResolved);


const nestedClassReflected = getType<NestedClass>();
const nestedClassResolved = Reflect.construct(nestedClassReflected.ctor, []);

console.log(nestedClassResolved instanceof NestedClass);
console.log(nestedClassResolved.someMethod());
console.log(nestedClassReflected.constructorDescription);
console.log(nestedClassResolved);


// const interfaceType = getType<SomeServiceInterface>();
// const someServiceClass = getType<SomeService>();
// const testingClass = getType<TestingClass>();
// const testingNativeParams = getType<TestingClassWithDifferentNativeParams>();
//
//
// const testingClassCtorParams = testingNativeParams.getConstructors()[0].getParameters();
//
// for (let testingClassCtorParam of testingClassCtorParams)
// {
// 	console.log(`Param ${testingClassCtorParam.name} type: `, typeof testingClassCtorParam.type.ctor, testingClassCtorParam.type.ctor);
// 	console.log(`Param ${testingClassCtorParam.name} type name: `, testingClassCtorParam.type.name);
// 	console.log(`Param ${testingClassCtorParam.name} is native?: `, testingClassCtorParam.type.isNative());
// }

