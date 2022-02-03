import * as ts                                from "typescript";
import { Context }                            from "./contexts/Context";
import { ConstructorImportDescriptionSource } from "./declarations";
import { getOutPathForSourceFile }            from "./helpers";
import { log }                                from "./log";

export function getExportOfConstructor(
	symbol: ts.Symbol,
	typeCtor: ts.EntityName | ts.DeclarationName,
	context: Context
): ConstructorImportDescriptionSource | undefined
{
	const exportSymbol = context.typeChecker.getExportSymbolOfSymbol(symbol);
	if (!exportSymbol)
	{
		log.warn("getExportOfConstructor: Failed to find export of the constructor.");
		return undefined;
	}

	const classDeclaration = symbol.valueDeclaration as ts.ClassDeclaration;

	const name = classDeclaration?.name?.escapedText?.toString();
	if (!name)
	{
		log.warn("getExportOfConstructor: Failed to get name of exported parent");
		return undefined;
	}

	const source = classDeclaration.getSourceFile();
	// const ctorSource = typeCtor.getSourceFile(); TODO: Remove
	const options = context.transformationContext.getCompilerOptions();

	if (!options.outDir || !options.rootDir)
	{
		log.warn(`getExportOfConstructor: No "outDir" specified in tsconfig file.`);
		return undefined;
	}

	return {
		en: exportSymbol.escapedName.toString(),
		n: name,
		srcPath: source.fileName,
		outPath: getOutPathForSourceFile(source.fileName, options.rootDir, options.outDir),
	};
}
