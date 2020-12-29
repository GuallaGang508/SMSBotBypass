module.exports = (request, response, next) => {
  /**
   * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
   */
  const config = require('../config');

  try {
      /**
       * Ici l'on récupère le mot de passe de l'api, par requête GET ou POST
       */
      const pass = request.body.password || request.params.apipassword;

      /**
       * On vérifie si le mot de passe de l'api n'est pas vide, si oui, erreur de sécurité et on retourne une erreur
       */
      if (config.apipassword == '') error('Your API Password is not set, look at your config file.', 401);

      /**
       * Selon les cas d'utilisation, l'on renvoit un code d'erreur où alors l'on next() => signifie que tout est bon et que la fonction passe
       */
      switch (pass) {
          case ' ':
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