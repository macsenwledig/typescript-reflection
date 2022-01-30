import * as ts                 from "typescript";
import * as fs                 from "fs";
import * as path               from "path";
import {
	ConfigObject,
	createConfig
}                              from "../config";
import { ExtendedTsLibWriter } from "../meta-writer/extended-ts-lib-writer/ExtendedTsLibWriter";
import MetadataGenerator       from "../MetadataGenerator";

const UnknownPackageName = "@@this";
const InstanceKey: symbol = Symbol.for("tst-reflect.TransformerContext");
let instance: TransformerContext = (global as any)[InstanceKey] || null;

export default class TransformerContext
{
	private _config?: ConfigObject;
	private _metadataGenerator?: MetadataGenerator;

	private _metaWriter?: ExtendedTsLibWriter;
	public program?: ts.Program;

	/**
	 * Get singleton instance of TransformerContext.
	 */
	static get instance(): TransformerContext
	{
		if (!instance)
		{
			instance = Reflect.construct(TransformerContext, [], Activator);
		}

		return instance;
	}

	/**
	 * Metadata library generator.
	 */
	get metadataGenerator(): MetadataGenerator | undefined
	{
		return this._metadataGenerator;
	}

	get metaWriter(): ExtendedTsLibWriter | undefined
	{
		return this._metaWriter;
	}

	/**
	 * Configuration object.
	 */
	get config(): ConfigObject
	{
		if (!this._config)
		{
			throw new Error("TransformerContext has not been initiated yet.");
		}

		return this._config;
	}

	/**
	 * Protected constructor.
	 * @protected
	 */
	protected constructor()
	{
		if (new.target != Activator)
		{
			throw new Error("This constructor is protected.");
		}
	}

	/**
	 * Init context.
	 * @param program
	 */
	init(program: ts.Program)
	{
		this.prepareConfig(program);
		this.program = program;

		// If metadata library allowed
		if (this.config.useMetadata)
		{
			this._metadataGenerator = new MetadataGenerator(this.config.metadataFilePath);
			this._metadataGenerator.recreateLibFile();
		}
		if (!this._metaWriter)
		{
			this._metaWriter = new ExtendedTsLibWriter(`src/reflection.meta.ts`, this);
		}
	}

	/**
	 * Prepare configuration object.
	 * @param program
	 * @private
	 */
	private prepareConfig(program: ts.Program)
	{
		const options: ts.CompilerOptions = program.getCompilerOptions();
		const rootDir = path.resolve(options.rootDir || program.getCurrentDirectory());
		const [root, packageName] = this.getPackageName(rootDir);
		this._config = createConfig(options, root, packageName);
	}

	/**
	 * Get name of the package
	 * @return {string}
	 * @private
	 */
	private getPackageName(root: string, recursiveCheck: boolean = false): [root: string, packageName: string]
	{
		try
		{
			const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf-8");
			return [root, JSON.parse(packageJson).name || UnknownPackageName];
		}
		catch (e)
		{
			if (path.parse(root).root == root)
			{
				// as any -> internal
				return [undefined as any, UnknownPackageName];
			}

			const [packageRoot, packageName] = this.getPackageName(path.normalize(path.join(root, "..")), true);

			if (packageRoot == undefined)
			{
				if (recursiveCheck)
				{
					return [packageRoot, packageName];
				}

				return [root, packageName];
			}

			return [packageRoot, packageName];
		}
	}
}

class Activator extends TransformerContext
{
}
