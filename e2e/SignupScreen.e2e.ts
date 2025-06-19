// e2e/SignupScreen.e2e.ts - Version finale cross-platform parfaite
describe('SignupScreen E2E', () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await waitFor(element(by.id('login-inner-container')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('signup-button')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('signup-button')).tap();

    await waitFor(element(by.id('signup-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should show all input fields and buttons', async () => {
    await expect(element(by.id('signup-username-input'))).toBeVisible();
    await expect(element(by.id('signup-email-input'))).toBeVisible();
    await expect(element(by.id('signup-password-input'))).toBeVisible();
    await expect(element(by.id('signup-confirm-password-input'))).toBeVisible();
    await expect(element(by.id('signup-submit-button'))).toBeVisible();
    await expect(element(by.id('back-to-login-button'))).toBeVisible();
  });

  it('should show error on empty submit', async () => {
    await waitFor(element(by.id('signup-submit-button')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('signup-submit-button')).tap();

    await waitFor(element(by.id('alerts-container')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text('Tous les champs sont obligatoires')))
      .toBeVisible()
      .withTimeout(15000); // Timeout unifié pour les deux plateformes
  });

  it('should show error on invalid email', async () => {
    await waitFor(element(by.id('signup-username-input')))
      .toBeVisible()
      .withTimeout(10000);

    // SOLUTION: Utiliser replaceText sur toutes les plateformes pour uniformité
    await element(by.id('signup-username-input')).replaceText('user');
    await element(by.id('signup-email-input')).replaceText('invalid-email');
    await element(by.id('signup-password-input')).replaceText('123456');
    await element(by.id('signup-confirm-password-input')).replaceText('123456');

    if (device.getPlatform() === 'ios') {
      await element(by.id('signup-screen')).tap();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await element(by.id('signup-submit-button')).tap();

    await waitFor(element(by.id('alerts-container')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text('Veuillez entrer une adresse email valide')))
      .toBeVisible()
      .withTimeout(15000); // Timeout augmenté pour Android
  });

  it('should show error if passwords mismatch', async () => {
    console.log('🧪 Test: Password mismatch validation - FINAL VERSION');

    await waitFor(element(by.id('signup-username-input')))
      .toBeVisible()
      .withTimeout(10000);

    // Utiliser replaceText sur toutes les plateformes
    console.log(`📱 ${device.getPlatform()} - Using replaceText (unified approach)`);
    await element(by.id('signup-username-input')).replaceText('user');
    await element(by.id('signup-email-input')).replaceText('user@example.com');
    await element(by.id('signup-password-input')).replaceText('password123');
    await element(by.id('signup-confirm-password-input')).replaceText('password456');

    if (device.getPlatform() === 'ios') {
      await element(by.id('signup-screen')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await element(by.id('signup-submit-button')).tap();

    await waitFor(element(by.id('alerts-container')))
      .toBeVisible()
      .withTimeout(10000);

    console.log('✅ Alert container found, looking for error message...');

    await waitFor(element(by.text('Les mots de passe ne correspondent pas')))
      .toBeVisible()
      .withTimeout(15000);

    console.log('✅ Password mismatch error found!');
  });

  it('should navigate back to LoginScreen', async () => {
    await waitFor(element(by.id('back-to-login-button')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('back-to-login-button')).tap();

    await waitFor(element(by.id('login-inner-container')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should test password length validation', async () => {
    console.log('🧪 Test: Password length validation');

    await waitFor(element(by.id('signup-username-input')))
      .toBeVisible()
      .withTimeout(10000);

    // Utiliser replaceText sur toutes les plateformes
    await element(by.id('signup-username-input')).replaceText('user');
    await element(by.id('signup-email-input')).replaceText('user@example.com');
    await element(by.id('signup-password-input')).replaceText('123');
    await element(by.id('signup-confirm-password-input')).replaceText('123');

    if (device.getPlatform() === 'ios') {
      await element(by.id('signup-screen')).tap();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await element(by.id('signup-submit-button')).tap();

    await waitFor(element(by.id('alerts-container')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text('Le mot de passe doit contenir au moins 6 caractères')))
      .toBeVisible()
      .withTimeout(15000);

    console.log('✅ Password length validation works');
  });

  // Test de diagnostic de timing (iOS seulement)
  it('should measure alert timing', async () => {
    if (device.getPlatform() !== 'ios') {
      console.log('⏭️ Skipping timing test on Android');
      return;
    }

    console.log('⏱️ MEASURING ALERT TIMING');

    await waitFor(element(by.id('signup-username-input')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('signup-username-input')).replaceText('user');
    await element(by.id('signup-email-input')).replaceText('user@example.com');
    await element(by.id('signup-password-input')).replaceText('password123');
    await element(by.id('signup-confirm-password-input')).replaceText('password456');

    await element(by.id('signup-screen')).tap();
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('⏱️ Starting timing measurement...');
    const startTime = Date.now();

    await element(by.id('signup-submit-button')).tap();

    await waitFor(element(by.id('alerts-container')))
      .toBeVisible()
      .withTimeout(10000);

    const alertAppearTime = Date.now();
    console.log(`⏱️ Alert appeared after: ${alertAppearTime - startTime}ms`);

    let messageFoundTime = 0;
    let messageDisappearedTime = 0;

    try {
      await waitFor(element(by.text('Les mots de passe ne correspondent pas')))
        .toBeVisible()
        .withTimeout(5000);
      messageFoundTime = Date.now();
      console.log(`⏱️ Message found after: ${messageFoundTime - startTime}ms`);

      await waitFor(element(by.text('Les mots de passe ne correspondent pas')))
        .not.toBeVisible()
        .withTimeout(10000);
      messageDisappearedTime = Date.now();
      console.log(`⏱️ Message disappeared after: ${messageDisappearedTime - startTime}ms`);
      console.log(`⏱️ Message was visible for: ${messageDisappearedTime - messageFoundTime}ms`);

    } catch (e) {
      console.log('⏱️ Could not find or track message timing');
    }

    console.log('⏱️ Timing measurement complete');
  });
});
