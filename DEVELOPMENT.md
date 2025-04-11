# Development Setup

## Required VS Code Extensions

For the best development experience, please install the following VS Code extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - JavaScript/TypeScript linting
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. **Prettier** (`esbenp.prettier-vscode`)
   - Code formatting
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

3. **EditorConfig** (`editorconfig.editorconfig`)
   - Editor configuration
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

4. **TypeScript + JavaScript** (`ms-vscode.vscode-typescript-next`)
   - Enhanced TypeScript/JavaScript support
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## Recommended VS Code Settings

Add these settings to your VS Code workspace or user settings for the best experience:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## Extension Features

- **ESLint**: Automatically finds and fixes JavaScript/TypeScript problems
- **Prettier**: Formats your code on save
- **EditorConfig**: Maintains consistent coding styles
- **TypeScript**: Provides enhanced IntelliSense and type checking
