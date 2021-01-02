module.exports = function(m) {
    /**
     * Instanciation des dépendences de la fonction
     */
    const axios = require('axios');
    const qs = require('qs');

    /**
     * Importation du fichier config contenant les données du BOT
     */
    const config = require('../config');

    /**
     * Fonction permettant d'envoyer des embed sur discord
     */
    const embed = require('../embed');

    /**
     * Si la commande n'est pas call, alors finir la fonction
     */
    if (m.command !== "call" && m.command !== "calltest") return false;

    /**
     * Si la commande ne contient pas 2 arguments, finir la fonction et renvoyer une erreur
     */
    if(m.args.length < 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 arguments, example : **!call 33612345678 paypal**', m.user);
    
    /**
     * Si le numéro de téléphone ou le service ne correspond pas aux regex, alors renvoyer une erreur
     */
    if(!m.args['0'].match(/^\d{8,14}$/g)) return embed(m.message, 'Bad phone number', 15158332, 'This phone number is not good, a good one : **33612345678**', m.user);
    if(!m.args['1'].match(/[a-zA-Z]+/gm)) return embed(m.message, 'Bad service name', 15158332, 'This service name is not good, a good one : **paypal**', m.user);
    
    /**
     * Si la commande est !calltest alors l'on passe en call de test avec l'user test
     */
    m.user = m.command == "calltest" ? 'test' : m.user;
    m.args['2'] = m.args['2'] == undefined ? '' : m.args['2'];

    /**
     * Si toutes les conditions ont été passées, alors envoyer une requête à l'api d'appel
     */
    axios.post(config.apiurl + '/call/', qs.stringify({
        password: config.apipassword,
        to: m.args['0'],
        user: m.user,
        service: m.args['1'].toLowerCase(),
        name: m.args['2'].toLowerCase() || null
    }))
    .catch(error => {
        console.error(error)
    })

    /**
     * Réponse disant que le call api a bien été passé
     */
    return embed(m.message, 'Call sent', 3066993, 'The api call has been sent to **' + m.args['0'] + '** using **' + m.args['1'] + '** service.', m.user)
}