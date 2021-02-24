export function toDashCase(camel: string) {
  return camel.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}
