// Ambient declarations so a standalone `tsc --noEmit` (without the Next.js
// TypeScript plugin) resolves CSS side-effect imports. Next's own build
// handles these natively; this keeps editor/CI typechecks green too.
declare module '*.css'
declare module '*.scss'
