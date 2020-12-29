module.exports = function(req, res) {
    /**
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('.././config');

    /**
     * Intégration des dépendences FS permettant de modifier des fichiers
     */
    const fs = require('fs');

    /**
     * Création d'une variable stockant le nom du service à aller chercher dans le fichier config
     */
    const service = req.params.service + 'filepath';

    /**
     * Si il existe bien un le service dans le fichier config, alors continuer
     */
    if (!!config[service] && config[service] != undefined) {
        /**
         * Récupération du chemin de stockage du fichier audio
         */
        const filePath = config[service];

        /**
         * Calcul de la taille du fichier audio
         */
        var stat = fs.statSync(filePath);
        var total = stat.size;

        /**
         * Modification du header pour que le fichier puisse être utilisable par Twilio
         */
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': 'audio/mpeg'
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        return res.status(200).json({
            error: 'Bad service.'
        });
    }
};