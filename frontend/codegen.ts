import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8080/graphql",
  generates: {
    "./types/graphql.d.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;