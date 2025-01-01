declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;

  export default ReactComponent;
}
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />


interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_SECRET_KEY:string;
  // Add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}