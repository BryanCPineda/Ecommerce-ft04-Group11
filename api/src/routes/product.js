const server = require('express').Router();
const Sequelize = require('sequelize');
const { Product, Category} = require('../db.js');
const Op = Sequelize.Op;

server.get('/', (req, res, next) => {
	Product.findAll({
		include: {
			model: Category,
			through: { attributes: [] } // this will remove the rows from the join table (i.e. 'UserPubCrawl table') in the result set
		  }
	})
		.then(products => {
			res.send({ data: products });
		})
		.catch(next);
});


server.get('/custom/latests', (req, res, next) => {
	Product.findAll({
		order: [
			['createdAt','DESC']
		],
		limit: 6
	})
		.then(products => {
			res.send({ data: products });
		})
		.catch(next);
});



server.get('/search/:value', (req,res)=>{

	const query = req.params.value;
	console.log(query);
	
	Product.findAll({
		where: {
				[Op.or]: [
					{
						name: {
							[Op.iLike]: "%"+query+"%"
						}
					},
					{
						description: {
							[Op.iLike]: "%"+query+"%"
						}
					}
				]
			}  
		})  .then((product)=>{
			res.send({data: product})
			})  
})

server.post('/', (req, res) => {
	Product.create({
		name: req.body.name,
		description: req.body.description,
		stock: req.body.stock,
		price: req.body.price,
		images: JSON.stringify(req.body.images)
	})
	.then(() => {
		res.status(201).send('producto creado con exito')
	})
	.catch(() => {
		res.status(401).send('hubo un error')
	})
})

server.get('/:id', (req, res, next) => {
	Product.findByPk(req.params.id,{include: {
		model: Category,
		through: { attributes: [] }
	  }})
		.then(product => {
			if(!product){
				return res.send({errors: {messages:['Producto no encontrado'], status:404}}).status(404);
			}
			res.send({ data: product });
		})
		.catch(next);
});

server.put('/:id', (req, res) => {
    const id = req.params.id;
    if(!req.body.description) req.body.description = null;
    const {name, description, stock, price, images} = req.body

    if(!Number.isInteger(id * 1)){//multiplicar * 1 es muy IMPORTANTE (cositas de javascript xd)!
		return res.send({errors: [{message:'La id del producto no es valida.'}], status:422}).status(422);
	}

    Product.findByPk(id).then(product => {
        if(!product) {
            return res.send({errors: [{message:'Producto no encontrado'}], status: 404}).status(404);
        }
        product.name = name;
        product.stock = stock;
        product.price = price;
        product.images = JSON.stringify(images);
        product.description = description;
        product.save().then(()=>{
            return res.send({data: product}).status(200);
        }).catch(err => {
            var status = 500;
            if (err.name === 'SequelizeValidationError') status = 422;
            return res.send({errors: err.errors, status}).status(status);
        });
    }).catch(err => {
        return res.sendStatus(500);
    });
});

server.post('/:idProduct/category/:idCategory', (req, res) => {
	const {idProduct, idCategory} = req.params;

	if(!Number.isInteger(idProduct * 1)){ //multiplicar * 1 es muy IMPORTANTE (cositas de javascript xd)!
		return res.send({errors: {messages:['El id del producto no es valido.'], status:422}}).status(422);
	}
	if(!Number.isInteger(idCategory * 1)){//multiplicar * 1 es muy IMPORTANTE (cositas de javascript xd)!
		return res.send({errors: {messages:['La id de la categoría no es valido.'], status:422}}).status(422);
	}

	Product.findByPk(idProduct).then(product => {
		if(!product){
			return res.send({errors: {messages:['Producto no encontrado'], status:404}}).status(404);
		}
		Category.findByPk(idCategory).then(category => {
			if(!category){
				return res.send({errors: {messages:['Categoría no encontrada'], status:404}}).status(404);
			}
			product.addCategory(category).then(()=>{
				return res.sendStatus(201);
			});
		}).catch(err => {
			return res.sendStatus(500);
		});
	}).catch(err => {
		return res.sendStatus(500);
	});
});

server.delete('/:idProduct/category/:idCategory', (req, res) => {
	const {idProduct, idCategory} = req.params;

	if(!Number.isInteger(idProduct * 1)){ //multiplicar * 1 es muy IMPORTANTE (cositas de javascript xd)!
		return res.send({errors: {messages:['El id del producto no es valido.'], status:422}}).status(422);
	}
	if(!Number.isInteger(idCategory * 1)){//multiplicar * 1 es muy IMPORTANTE (cositas de javascript xd)!
		return res.send({errors: {messages:['La id de la categoría no es valido.'], status:422}}).status(422);
	}

	Product.findByPk(idProduct).then(product => {
		if(!product){
			return res.send({errors: {messages:['Producto no encontrado'], status:404}}).status(404);
		}
		Category.findByPk(idCategory).then(category => {
			if(!category){
				return res.send({errors: {messages:['Categoría no encontrada'], status:404}}).status(404);
			}
			product.removeCategory(category).then(() =>{
				return res.sendStatus(204);
			});
		}).catch(err => {
			return res.sendStatus(500);
		});
	}).catch(err => {
		return res.sendStatus(500);
	});
});

server.delete('/:id', function(req, res) {
    if (!Number.isInteger(req.params.id * 1)){
		res.send({errors: {messages:['el id del producto debe ser un numero'], status:422}}).status(422);
    	return;
    }
    Product.destroy({
            where: {
            id: req.params.id
            }
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
			res.send({errors: {messages:['registro borrado'], status:204}}).status(204);
            }else{
				res.send({errors: {messages:['no existe el producto'], status:404}}).status(404);
            }
        }
        ).catch(err => {
			return res.sendStatus(500);})
    });

server.get('/category/:nombreCat', function(req, res, next) {
    Category.findOne({
  
		where: {
			name: {[Sequelize.Op.iLike]: req.params.nombreCat}   // case insensitive search
			}

      })
    .then(function(categories){

        if(categories === null){
            return 
          } else {
			console.log('cat ', categories.id);
            return Product.findAll({
				
				include: [{model: Category,
					where:{
						id: categories.id
					},
					attributes: ['id','name']
				}],
            })
          }
    }) 
    .then(function(products){
		if(!products) {return res.send('no existe esa categoria').status(500);}
		if(products == [] ||products == 0  ) {return res.send('no existen productos para esa categoria').status(500);}

          return res.status(200).send({data: products});
        }).catch(err => {
			console.log('err');
		return res.send(err).status(500);
		})
	});

	
server.get('/categories/:idProduct', function(req, res, next) {
		
		Category.findAll({
					
			include: [{model: Product,
				where:{
					id: req.params.idProduct
				}
			}]
		}).then((data)=>{
			res.send(data)
		})
		.catch((error)=>{
			res.send(error)
		})
	});



module.exports = server;