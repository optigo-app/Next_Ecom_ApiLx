/**
 * Next.js 15 Server-side Instrumentation Hook.
 * Automatically catches all unhandled exceptions on the server:
 * - Server Components errors
 * - Server Actions errors
 * - API route / Route handler errors
 * - Middleware errors
 * - Node process uncaught exceptions & unhandled rejections
 *
 * NOTE: Runtime-specific code is separated into instrumentation-node.js
 * to ensure Turbopack / Next.js compiles Edge instrumentation without Node.js module warnings.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initNodeInstrumentation } = await import("./instrumentation-node");
    await initNodeInstrumentation();
  }
}

/**
 * Next.js 15 native request error hook.
 * Fires whenever any server-side request or rendering throws an error.
 */
export async function onRequestError(err, request, context) {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { handleRequestError } = await import("./instrumentation-node");
    await handleRequestError(err, request, context);
  } else {
    console.error("[SERVER_REQUEST_ERROR]", err?.message || err);
  }
}
