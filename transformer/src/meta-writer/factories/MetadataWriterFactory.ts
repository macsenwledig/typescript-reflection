import { MetadataTypeValues }    from "../../config-options";
import TransformerContext        from "../../contexts/TransformerContext";
import { IMetadataWriter }       from "../IMetadataWriter";
import { InlineMetadataWriter }  from "../inline/InlineMetadataWriter";
import { TypeLibMetadataWriter } from "../type-lib/TypeLibMetadataWriter";

export const MetadataWriterFactory = {
	/**
	 * Create new instance of MetadataWriter
	 * @param {TransformerContext} context
	 * @return {IMetadataWriter | undefined}
	 */
	create(context: TransformerContext): IMetadataWriter | undefined
	{
		switch (context.config.useMetadataType)
		{
			case MetadataTypeValues.inline:
				return new InlineMetadataWriter(context.config.projectDir, context);
			case MetadataTypeValues.typeLib:
				return new TypeLibMetadataWriter(context.config.metadataFilePath, context);
		}
	}
};