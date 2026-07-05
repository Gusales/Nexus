import { base } from "@nexus/eslint-config";
import reactEslintConfig from "eslint-plugin-react";
import reactHooksEslintConfig from "eslint-plugin-react-hooks";
import reactNativeEslintConfig from "eslint-plugin-react-native";

export default [
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/.expo/**",
            "**/.turbo/**",
            "**/src-tauri/target/**",
            "**/*.config.js/**",
        ]
    },
    {
        files: ["apps/agent-sidecar/**/*.ts"],
        languageOptions: {
            globals: {
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "readonly"
            }
        }
    },
    {
        files: ["apps/agent-shell/src/**/*.{ts,tsx}"],
        plugins: {
            "react": reactEslintConfig,
            "react-hooks": reactHooksEslintConfig
        },
        rules: {
            ...reactEslintConfig.configs.recommended.rules,
            ...reactHooksEslintConfig.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    {
        files: ["apps/mobile/**/*.{ts,tsx}"],
        plugins: {
            "react": reactEslintConfig,
            "react-hooks": reactHooksEslintConfig,
            "react-native": reactNativeEslintConfig,
        },
        languageOptions: {
            globals: {
                __DEV__: "readonly",
            },
        },
        rules: {
            ...reactEslintConfig.configs.recommended.rules,
            ...reactHooksEslintConfig.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-native/no-unused-styles": "warn",
            "react-native/no-inline-styles": "warn",
            "react-native/no-color-literals": "warn",
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    {
        files: ["packages/shared-types/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "error"
        }
    },
    {
        rules: {
            "import/first": "off",
            "import/order": "off",
            "import/newline-after-import": "off",
            "import/no-duplicates": "off",
        }
    },
    ...base,
];