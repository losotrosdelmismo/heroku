Bazar e-commerce con un poco de todo

estrucctura de catpetas:

api: lugar donde ubico el CRUD, el crud funciona pasando un array y un string que indica que tipo de modelo refiere. Como 
opcional, se le puede pasar un numero para busca el id o username segun el tipo de modelo.

database: archivo para configurar la base de datos

log-winston: donde alojamos todos los logs del sistema

models: lugar donde alojamos los diferentes tipos de modelos para mongoose

persistencia: donde guardamos todas las persistencias originales. Si no existe en mongo el sistema busca la persistencia y crea la base de datos

public: archivos estaticos, imagenes y Js del cliente

resultados artillery: donde guarde los test con artillery

router: donde alojamos todos los routers

utils: alojamos todos los componentes complementarios, mail, SMS y logger

views: vistas en HTML



