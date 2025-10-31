/// <reference types="@types/tailwindcss" />

// This file helps TypeScript understand the custom Tailwind directives
// and prevents false positive linting errors

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'tailwindcss/plugin' {
  import { PluginCreator } from 'tailwindcss/types/config';
  const plugin: PluginCreator;
  export default plugin;
}
