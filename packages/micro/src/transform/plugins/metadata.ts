export const BabelMetadataPlugin = () => ({
  visitor: {
    /** 
     * Static import statements
    */
    ImportDeclaration: (p: any, file: any) => {
      const source = p.get("source");

      if (source == null || source.type !== "StringLiteral") {
        return;
      }

      const dependency = source.node.value;

      file.file.metadata = {
        ...file.file.metadata,
        dependencies: [...(file.file.metadata?.dependencies || []), dependency],
      };
    },
  },
});
