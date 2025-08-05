// global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    HF_API_TOKEN: string;
  }
}
