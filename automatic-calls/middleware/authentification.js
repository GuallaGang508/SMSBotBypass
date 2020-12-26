module.exports = (request, response, next) => {
    const config = require('../config');

  try {
    const pass = request.body.password;

    if(config.apipassword == '')  error('Your API Password is not set, look at your config file.', 401);

    switch(pass) {
      case '':
          error('The password you sent is empty.', 401);
        break;
      case undefined:
          error('Please send the password API.', 401);
        break;
      case config.apipassword:
          next();
        break;
      default:
          error('Invalid password.', 401);
        break;
    }
    
  } catch {
    response.status(401).json({
      error: 'Invalid request!'
    });
  }

  function error(msg, statuscode) {
    response.status(statuscode).json({
      error: msg
    });
  }
};