var winston = require('winston')

module.exports = function (tipo,clase,id,user) {

	 winston.log('info', '%s %s: %s',tipo,clase,id,{ user: user, tipo: tipo, clase: clase });


};