describe('Welcome Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Forcez le reload pour être sûr
    await device.reloadReactNative();
  });

  it('should show welcome title and press the button', async () => {
    await waitFor(element(by.id('logo-text')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
