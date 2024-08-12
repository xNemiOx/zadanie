// next-auth.d.ts
import { User as NextAuthUser } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    phone?: string;
  }
  
  interface Session {
    user: User;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends NextAuthUser {
    phone?: string;
  }
}
