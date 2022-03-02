// import { createValueExpression }  from "../../utils/createValueExpression";
// import { IMetadataNodeGenerator } from "../IMetadataNodeGenerator";
// import * as ts                    from "typescript";
//
// const factory = ts.factory;
//
// export class InlineMetadataNodeGenerator implements IMetadataNodeGenerator
// {
// 	private readonly typeFactoryIdentifier: ts.Identifier;
// 	private readonly metadataIdentifier: ts.Identifier;
//
// 	constructor()
// 	{
// 		this.typeFactoryIdentifier = factory.createIdentifier("__τ"); // TODO: Load from config! reflection.typeFactory
//		
// 		this.metadataIdentifier = factory.createIdentifier("__Ω");
// 		// TODO: Create `import { Metadata } from "@rtti/abstract";` (import or require based on tsconfig) in each file and generate `Metadata.resolveType(id)` in place of getType<T>() calls.
// 	}
//
// 	/**
// 	 * Generated import statements which will be added to each source file
// 	 *
// 	 * @param {string} metaLibImportPath
// 	 * @returns {ts.Statement[]}
// 	 */
// 	sourceFileMetaLibStatements(metaLibImportPath?: string): ts.Statement[]
// 	{
// 		return [ // TODO: Require or Import, based on tsconfig
// 			factory.createVariableStatement(
// 				undefined,
// 				factory.createVariableDeclarationList(
// 					[factory.createVariableDeclaration(
// 						this.typeFactoryIdentifier,
// 						undefined,
// 						undefined,
// 						factory.createCallExpression(
// 							factory.createIdentifier("require"),
// 							undefined,
// 							[factory.createStringLiteral("tst-reflect")]
// 						)
// 					)],
// 					ts.NodeFlags.Const
// 				)
// 			),
// 		];
// 	}
//
// 	/**
// 	 * Generated method call which adds the generated source description of a node to the store
// 	 *
// 	 * @param {number} typeId
// 	 * @param {TypePropertiesSource} description
// 	 * @returns {ts.CallExpression}
// 	 */
// 	addDescriptionToStore(typeId: number, description: TypePropertiesSource | ts.ObjectLiteralExpression): ts.CallExpression
// 	{
// 		const properties: ts.ObjectLiteralExpression = ts.isObjectLiteralExpression(<ts.ObjectLiteralExpression>description)
// 			? <ts.ObjectLiteralExpression>description
// 			: createValueExpression(description) as ts.ObjectLiteralExpression;
//
// 		return factory.createCallExpression(
// 			this.typeFactoryIdentifier,
// 			undefined,
// 			[factory.createNumericLiteral(typeId), properties] // TODO: Only properties. Type id should be inside properties
// 		);
// 	}
//
// 	/**
// 	 * Generated method call which creates a Type from a source description inline
// 	 *
// 	 * @param {TypePropertiesSource} description
// 	 * @returns {ts.CallExpression}
// 	 */
// 	createDescriptionWithoutAddingToStore(description: TypePropertiesSource): ts.CallExpression
// 	{
// 		return factory.createCallExpression(
// 			this.typeFactoryIdentifier,
// 			undefined,
// 			[createValueExpression(description)]
// 		);
// 	}
//
// 	/**
// 	 * Generated method call to get a type from the store by its id
// 	 *
// 	 * @param {number} typeId
// 	 * @returns {ts.CallExpression}
// 	 */
// 	getTypeFromStore(typeId: number): ts.CallExpression
// 	{
// 		return factory.createCallExpression(
// 			factory.createPropertyAccessExpression(
// 				this.typeFactoryIdentifier,
// 				factory.createIdentifier("resolveType")
// 			),
// 			undefined,
// 			[factory.createNumericLiteral(typeId)]
// 		);
// 	}
//
// 	/**
// 	 * Generated method call to get a type from the store by its id, but is wrapped in a function.
// 	 *
// 	 * @param {number} typeId
// 	 * @returns {ts.CallExpression}
// 	 */
// 	getTypeFromStoreLazily(typeId: number): ts.CallExpression
// 	{
// 		return factory.createCallExpression(
// 			factory.createPropertyAccessExpression(
// 				factory.createPropertyAccessExpression(
// 					factory.createPropertyAccessExpression(
// 						this.typeFactoryIdentifier,
// 						factory.createIdentifier("Type")
// 					),
// 					factory.createIdentifier("store")
// 				),
// 				factory.createIdentifier("getLazy")
// 			),
// 			undefined,
// 			[factory.createNumericLiteral(typeId)]
// 		);
// 	}
//
// 	/**
// 	 * When we're at the top-level our getType call processing, we need to replace
// 	 * the method call with our own version which references the meta lib
// 	 *
// 	 * @param {ts.CallExpression} call
// 	 * @returns {ts.CallExpression}
// 	 */
// 	updateSourceFileGetTypeCall(call: ts.CallExpression): ts.CallExpression
// 	{
// 		return ts.factory.updateCallExpression(
// 			call,
// 			factory.createPropertyAccessExpression(
// 				factory.createPropertyAccessExpression(
// 					factory.createPropertyAccessExpression(
// 						// this.inFileGetTypeIdentifier,
// 						this.typeFactoryIdentifier,
// 						factory.createIdentifier("Type")
// 					),
// 					factory.createIdentifier("store")
// 				),
// 				factory.createIdentifier("get")
// 			),
// 			call.typeArguments,
// 			call.arguments
// 		);
// 	}
//
// }
