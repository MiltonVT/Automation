/**
 * Structured Logger
 * Format: [Action] -> [Entity] : [Detail]
 * Per copilot-instructions.md
 */
export class Logger {
  static action(action: string, entity: string, detail: string): void {
    console.log(`[${action}] -> ${entity} : ${detail}`);
  }

  static success(action: string, entity: string, detail: string): void {
    console.log(`[${action}] -> ${entity} : ✅ ${detail}`);
  }

  static warn(action: string, entity: string, detail: string): void {
    console.log(`[${action}] -> ${entity} : ⚠️ ${detail}`);
  }

  static error(action: string, entity: string, detail: string): void {
    console.log(`[${action}] -> ${entity} : ❌ ${detail}`);
  }
}
