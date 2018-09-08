const {
  user,
  password,
} = require('./secrets.json');

const login = async (page) => {
  try {
    await page.click('#user');
    await page.keyboard.type(user);

    await page.click('#password');
    await page.keyboard.type(password);

    const navigate = page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    page.click('#SignIn');
    await navigate;

    return {};
  } catch (error) {
    console.log('error with log in');
    console.log(error);
    return { error };
  }
}

module.exports = {
  login
};
