import { LocalVariableData } from '../components/LocalVariablesComponent';

export interface ThemeData {
  name: string;
  description: string;
  primaryColor: string;
}

/**
 * Data factory for generating unique test data.
 * Ensures each test run uses unique identifiers to avoid collisions.
 */
export class DataFactory {
  /** Generate a unique local variable data set */
  static localVariable(prefix: string = 'localVar'): LocalVariableData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      name,
      shortDescription: name,
      description: `Automated test variable - ${name}`,
    };
  }

  /** Generate a unique theme data set */
  static theme(prefix: string = 'Theme'): ThemeData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      name,
      description: `Automated test theme - ${name}`,
      primaryColor: '#F54927',
    };
  }
}
