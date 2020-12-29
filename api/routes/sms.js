module.exports = function(request, response) {
  /**
   * Intégration des dépendences SQLITE3
   */
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./db/data.db');

  /**
   * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
   */
  const config = require('../config');

  /**
   * Identification et déclaration Twilio
   */
  const client = require('twilio')(config.accountSid, config.authToken);

  /**
   * Récupération des variables postées permettant d'ordonner l'appel
   */
  var to = request.body.to || null;
  var user = request.body.user || null;
  var service = request.body.service + 'sms';

  /**
   * Si il manque l'une des variable, transmettre l'erreur et empêcher le fonctionnement du système
   */
  if (to == null || user == null || service == null) {
      response.status(200).json({
          error: 'Please post all the informations needed.'
      });
      return false;
  }

  /**
   * Si l'on ne trouve pas l'emplacement du fichier service, alors cela veut dire que le service n'est pas supporté et l'on retourne une erreur 
   */
  if (config[service] == undefined) {
      response.status(200).json({
          error: 'The service wasn\'t recognised.'
      });
      return false;
  }

  /**
   * Si le numéro de téléphone est correcte, alors on lance l'appel
   */
  if (to.match(/^\d{8,14}$/g) && !!user && !!service) {
      /**
       * API Twilio permettant d'émettre le SMS
       */
      client.messages.create({
          body: config[service],
          from: config.callerid,
          statusCallback: config.serverurl + '/status/' + config.apipassword,
          to: '+' + to
      }).then((message) => {
          smssid = message.sid;

          response.status(200).json({
              smssid
          });
          response.send(smssid);

          /**
           * Ajout à la DB Sqlite3 du SMS envoyé
           */
          db.run(`INSERT INTO sms(smssid, user, itsfrom, itsto, content,  service, date) VALUES(?, ?, ?, ?, ?, ?, ?)`, [smssid, user, config.callerid, to, config[service], service, Date.now()], function(err) {
              if (err) {
                  return console.log(err.message);
              }
          });
      });
  } else {
      response.status(200).json({
          error: 'Bad phone number or username or service.'
      });
  }
};