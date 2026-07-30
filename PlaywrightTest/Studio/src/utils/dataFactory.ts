import { LocalVariableData } from '../components/LocalVariablesComponent';
import { LambdaData } from '../components/LambdaEditorComponent';
import { ScreenData } from '../components/ScreenEditorComponent';
import { TransactionData } from '../components/TransactionEditorComponent';
import { AppData } from '../components/CreateAppComponent';

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

  /** Generate a unique lambda process data set */
  static lambda(prefix: string = 'LAMBDA'): LambdaData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      name,
      description: name,
      code: 'Context.setRegister("1000", "Test")\n\n',
    };
  }

  /** Generate a unique screen data set */
  static screen(prefix: string = 'SmokeTestScreen'): ScreenData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      sequence: 'S999',
      name,
      description: name,
      templateSearch: 'Smoke',
    };
  }

  /** Generate a unique mobile app data set */
  static app(prefix: string = 'SmokeTestAppMobile'): AppData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      name,
      shortDescription: name,
    };
  }

  /** Generate a unique transaction data set */
  static transaction(prefix: string = 'SmokeTestTRX'): TransactionData {
    const timestamp = Date.now();
    const name = `${prefix}${timestamp}`;
    return {
      name,
      description: name,
      transactionCode: '9999',
    };
  }
}
