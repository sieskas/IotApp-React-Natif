// e2e/types.d.ts
import 'detox/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): R;
      toExist(): R;
      toHaveText(text: string): R;
      toHaveLabel(label: string): R;
      toHaveId(id: string): R;
      toHaveValue(value: string): R;
      not: Matchers<R>;
    }
  }
}
