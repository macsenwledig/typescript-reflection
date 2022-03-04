import * as ts                  from "typescript";
import { SourceFileContext }    from "../contexts/SourceFileContext";
import { MetadataSource }       from "../declarations";
import { log }                  from "../log";
import {
	MetadataMiddleware,
	MiddlewareContext,
	MiddlewareResult,
	NextMetadataMiddleware
} from "../middlewares";
import { shortArraySerializer } from "../middlewares/shortArraySerializer";

export function updateSourceFile(sourceFileContext: SourceFileContext, visitedNode: ts.SourceFile)
{
	const statements: Array<ts.Statement> = [];
	const modules = Array.from(sourceFileContext.metadata.getModules()).map(moduleMetadata => moduleMetadata.getModuleProperties());
	const middlewares: MetadataMiddleware[] = sourceFileContext.transformerContext.config.metadataMiddlewares;
	let metadata: MiddlewareResult | undefined = undefined;

	// Add our default middleware
	middlewares.push(shortArraySerializer);

	// MIDDLEWARES
	if (middlewares.length)
	{
		const source: MetadataSource = { modules };
		let middlewareIndex = 0;

		const middlewareContext: MiddlewareContext = {
			sourceFileContext,
			metadata: source,
			get result(): MiddlewareResult | undefined
			{
				return metadata;
			},
			setResult(expression: MiddlewareResult)
			{
				metadata = expression;
			}
		};

		const nextMetadataMiddleware: NextMetadataMiddleware = {
			invoke()
			{
				const middleware = middlewares[middlewareIndex++];

				if (middleware)
				{
					middleware(middlewareContext, nextMetadataMiddleware);
				}
			}
		};

		nextMetadataMiddleware.invoke();

		// function next(prevResult: MetadataSource)
		// {
		//
		// 	const middleware = middlewares[middlewareIndex++];
		//
		// 	if (middleware)
		// 	{
		// 		const res = middleware(sourceFileContext, { invoke: () => next() });
		// 		return res;
		// 	}
		//
		// 	return prevResult;
		// }
		//
		// next(source);
	}

	// // Add metadata into statements if metadata lib file is disabled
	// if (TransformerContext.instance.config.metadataType == MetadataTypeValues.inline)
	// {
	// 	for (let moduleMetadata of modules)
	// 	{
	// 		statements.push(ts.factory.createExpressionStatement(
	// 			sourceFileContext.metaWriter.factory.addDescriptionToStore(typeId, properties)
	// 		));
	// 	}
	// }
	// else
	// {
	// 	const types = sourceFileContext.metadata.getInFileTypes(sourceFileContext.sourceFile);
	// }

	const importsCount = visitedNode.statements.findIndex(s => !ts.isImportDeclaration(s));

	if (importsCount == -1)
	{
		log.warn("Reflection: getType<T>() used, but no import found.");
	}

	// TODO: Add import of metadata library
	// visitedNode = transformerContext.metaWriter.addLibImportToSourceFile(visitedNode);

	const finalizedStatements = importsCount == -1
		? [...statements, ...visitedNode.statements]
		: visitedNode.statements.slice(0, importsCount).concat(statements).concat(visitedNode.statements.slice(importsCount));

	return ts.factory.updateSourceFile(visitedNode, finalizedStatements);
}