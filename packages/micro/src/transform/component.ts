export const transform = (path: string) => ({
  code: `
const Component = {
  $$typeof: Symbol.for("react.module.reference"),
  filepath: "file://${path}",
  name: "",
};

export default Component;
`,
  metadata: {
    dependencies: [],
  },
});
