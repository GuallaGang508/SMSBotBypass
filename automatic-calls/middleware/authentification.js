module.exports = (request, response, next) => {
    const config = require('../config');

  try {
    const pass = request.body.password;

    if (pass != config.apipassword) {
        response.status(401).json({
            error: 'Invalid password'
          });
    } else {
      next();
    }

  } catch {
    response.status(401).json({
      error: 'Invalid request!'
    });
  }
};