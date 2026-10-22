export default function getSignature(role?: string): string {
  return role === "user" ? "Bearer" : "System";
}
