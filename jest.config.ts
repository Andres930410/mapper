import type { Config } from "@jest/types";
import jestModuleNameMapper from "jest-module-name-mapper"

const config: Config.InitialOptions = {
  moduleNameMapper: jestModuleNameMapper(),
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
export default config;
