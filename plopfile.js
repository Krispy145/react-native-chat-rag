module.exports = function (plop) {
  plop.setGenerator("component-native", {
    description: "Create a React Native component (Expo) with index",
    prompts: [{ type: "input", name: "name", message: "Component name (PascalCase):" }],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/native/Component.tsx.hbs"
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/index.ts",
        template: "export { default } from './{{pascalCase name}}';"
      }
    ]
  });
};
