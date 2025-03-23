import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Track if database has been initialized to avoid multiple initializations
let isDbInitialized = false;

export async function middleware(request: NextRequest) {
  // Run this only on the server and only once
  if (typeof window === 'undefined' && !isDbInitialized) {
    try {
      // Dynamic import to avoid client-side inclusion
      const { initializeDatabase } = await import('./lib/db/init-database');
      
      // Initialize database
      console.log("Initializing database from middleware...");
      await initializeDatabase();
      
      // Set flag to avoid re-initialization
      isDbInitialized = true;
      console.log("Database initialization complete");
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure middleware to run only on specific routes to avoid excessive execution
export const config = {
  matcher: ['/dashboard/:path*'],
} 