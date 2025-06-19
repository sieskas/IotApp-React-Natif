describe('LoginScreen E2E', () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    // Add a small delay to ensure the app is fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should display login screen with all elements', async () => {
    // Wait for the login screen to be fully loaded
    await waitFor(element(by.id('login-inner-container')))
      .toBeVisible()
      .withTimeout(5000);

    expect(element(by.id('logo-text'))).toBeVisible();
    expect(element(by.id('username-input'))).toBeVisible();
    expect(element(by.id('password-input'))).toBeVisible();
    expect(element(by.id('login-button'))).toBeVisible();
    expect(element(by.id('signup-button'))).toBeVisible();
  });

  it('should show error if no credentials entered', async () => {
    // Wait for login screen to be ready
    await waitFor(element(by.id('login-button')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-button')).tap();

    // Wait for error message to appear
    await waitFor(element(by.text("Veuillez saisir votre nom d'utilisateur et votre mot de passe")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate to SignupScreen on signup tap', async () => {
    // Wait for signup button to be ready
    await waitFor(element(by.id('signup-button')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('signup-button')).tap();

    // Wait for signup screen to appear
    await waitFor(element(by.id('signup-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should login successfully with valid credentials (mocked)', async () => {
    // Wait for input fields to be ready
    await waitFor(element(by.id('username-input')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('username-input')).typeText('test');
    await element(by.id('password-input')).typeText('123445678');

    await element(by.id('login-button')).tap();

    // Wait for navigation to home screen
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
