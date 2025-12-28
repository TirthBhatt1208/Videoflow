import "express";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId?: string;
      sessionId?: string;
      getToken?: (opts?: any) => Promise<string | null>;
    };
    user?: any;
  }
}
