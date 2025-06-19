// e2e/LoginScreen.e2e.ts

describe('Welcome Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('should show welcome title and press the button', async () => {
    await waitFor(element(by.id('logo-text')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
