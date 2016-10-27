var mysql   = require("mysql");
var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'qpest-db.cmy6fhaxfznd.sa-east-1.rds.amazonaws.com',
        user     : 'qpestMaster',
        password : 'Masterqpest123',
        database : 'qpest_db',
        debug    :  false
    });
function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });
    router.get("/usuario", function(req, res){
    	pool.getConnection(function(err, connection) {
	        if (err) {
	            console.error('CONNECTION error: ',err);
	            res.statusCode = 503;
	            res.send({
	                result: 'error',
	                err:    err.code
	            });
	        } else {
	            connection.query('SELECT * FROM `usuario` ORDER BY idusuario DESC LIMIT 20', function(err, rows, fields) {
	                if (err) {
	                    console.error(err);
	                    res.statusCode = 500;
	                    res.send({
	                        result: 'error',
	                        err:    err.code
	                    });
	                }
	                res.send({
	                    result: 'success',
	                    err:    '',
	                    json:   rows,
	                    length: rows.length
	                });
	                connection.release();
	            });
	        }
    	});
    });

    router.post("/usuario", function(req, res){
    	pool.getConnection(function(err, connection) {
	        
    		console.log(req.body);
	        if (err) {
	            console.error('CONNECTION error: ',err);
	            res.statusCode = 503;
	            res.send({
	                result: 'error',
	                err:    err.code
	            });
	        } else {
	            var id = req.body.usuarioid;
	            var name = req.body.nome;

	            connection.query('INSERT INTO `usuario` VALUES (?,?)', id, name, function(err, result) {
	                if (err) {
	                    console.error(err);
	                    res.statusCode = 500;
	                    res.send({
	                        result: 'error',
	                        err:    err.code
	                    });
	                } else {
	                    res.send({
	                        result: 'success',
	                        err:    '',
	                        id:     result.insertId
	                    });
	                }
	                connection.release();
	            });
	        }
    	});
    });

  
}

module.exports = REST_ROUTER;