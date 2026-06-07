export default function errorParser(error: unknown): string {
  if (Array.isArray(error)) {
    return error.map((err) => err.msg).join("\n");
  }
  const e = error as { name?: string; errors?: Record<string, { message: string }>; message?: string };
  if (e.name === "ValidationError" && e.errors) {
    return Object.values(e.errors).map((err) => err.message).join("\n");
  }
  return e.message ?? "Unknown error";
}
