const express = require('express');
const app = express();
const dotenv = require('dotenv');
const jwt = require('./utils/jwt');
const bcrypt = require('bcrypt');


dotenv.config();
//logger winston
const logger = require('./utils/winston');

//----CARGAMOS LA BASE DE DATOS--------
let persistencia = require('./repository/factory').getPersistencia();
let getPersistencia = new persistencia


require('./database/connections');
var usuarios = [];//datos de usuarios
var productos = [];//variable donde guardo los productos
var chat = [] //Mensajes en el servidor

async function cargaDatos(){
    try{       
        usuarios = await getPersistencia.leer(usuarios, "users"); //pasamos un string para que cargue la base de datos que corresponde 
        productos = await getPersistencia.leer(productos, "productos");
        chat = await getPersistencia.leer(chat, "chat");                      
    }
    catch(error){
        logger.error(error);
    }
}
cargaDatos()


//loadData()

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));



//---------PASSSPORT
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


let globalId = 0;

passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
        let usuario = usuarios.find(u => u.username === username);

        if (!usuario) {
            logger.error('usuario no encontrado con el nombre:', username);
            return done(null, false, logger.error('mensaje', 'usuario no encontrado'));
        } else {
            if (!isValidPassword(usuario, password)) {
                logger.error('contraseña invalida');
                return done(null, false, logger.error('mensaje', 'contraseña invalida'));
            } else {               
                io.on('connect', socket => {                           
                    socket.emit('usuario', usuario);                   
                    socket.emit('productos', productos);
                    socket.emit('mensajes', chat);    
                })                
                return done(null, usuario);
            }
        }
    })
);

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, function (req, username, password, done) {
    let usuario = usuarios.find(u => u.username === username);

    if (usuario) {
        logger.error('usuario ya existe');
        return done(null, false, logger.error('mensaje', 'usuario ya existe'));
    } else {        

         newUser = {
            id: ++globalId,
            username: username,
            password: createHash(password),
            rol: req.body.rol
        };
        
        usuarios.push(newUser);
        return done(null, newUser);
    }
})
);

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);//mucho muy importante aca hace el hash de encriptacion
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    let user = usuarios.find(u => u.id == id);
    return done(null, user);
});

// creamos la aplicacion
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

// inicializamos passport
app.use(passport.initialize());
app.use(passport.session());

// middleware de autenticacion
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/formulario");
    }
}

function roleAdmin(req, res, next) {
    logger.warn('>', req.user)
    if (req.isAuthenticated() && req.user.rol == 'admin') {
        next();
    } else {
        res.status(401).send('no autorizado')
    }
}
//----COOKIE SESSION-------------------------
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const conection = require('./database/connections')

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        
        mongoUrl: conection.urlMongoAtlas,
        mongoOptions: conection.advancedOptions
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//----ROUTERS-------------
const routerLogin = require('./router/routerLogin');
const routerProductos = require('./router/productos');
const routerMensajes = require('./router/messages');

app.use('/api', routerProductos);
app.use('/api', routerMensajes);
app.use(routerLogin.router);
const { async } = require('rxjs'); 


//  LOGIN
app.get('/login', routerLogin.getLogin);
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), routerLogin.postLogin);
app.get('/faillogin', routerLogin.getFaillogin);

//  SIGNUP
app.get('/formulario', routerLogin.formulario);
app.get('/signup', routerLogin.getSignup);
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), routerLogin.postSignup);
app.get('/failsignup', routerLogin.getFailsignup);

// LOGOUT
app.get('/logout', routerLogin.getLogout);

//----WEB SOCKET-----------
io.on('connect', socket => {                           
    socket.on('compra-finalizada', async pedido => {      


        //enviamos whatsapp
        let phone = pedido.shift()                 
        const accountSid = process.env.accountSid;
        const authToken =  process.env.authToken;
        
        const client = require('twilio')(accountSid, authToken);
        
        client.messages.create({
              body: `Gracias vuelva prontus, estamos preparando tu pedido y en breve nos pondremos en contacto.`,
              mediaUrl: ['https://scontent.faep25-1.fna.fbcdn.net/v/t1.6435-9/94064511_101860278168983_4668443401358671872_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=zNPIm6iBrhcAX_p3Mou&_nc_ht=scontent.faep25-1.fna&oh=245e559703d79cb6821ccc00401d5e1e&oe=61608FF9'],
              from: 'whatsapp:+14155238886',
              to: 'whatsapp:+549' + phone
              })
        .then(message => logger.warn(message.sid))
        .catch(console.log)
        //enviamos el pedido por mail        
        routerLogin.createMailOptions('compra', pedido);
        //let mail = pedido.shift();
        let username = pedido.shift();
        await getPersistencia.actualizar(username, pedido, "orden-de-compra");
        let orden = {
            carrito: pedido,
            user: username
        }
        
        await getPersistencia.guardar(orden, "ordenes");
         
    })
    socket.on('nuevo-mensaje', mensaje => {
        chat.push(mensaje);
        mensaje.id = chat.length + 1;               
       
        (async () => {
            try{    
               await getPersistencia.guardar(chat, "chat");                
            }catch(error){
                logger.error("Fallo cargar nuevo mensaje")
            }        
        })();      
        io.sockets.emit('mensajes', chat)
        
    })    
})

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    logger.warn(`servidor escuchando en http://localhost:${PORT}`);
});
http.on('error', error => {
    logger.error('error en el servidor:', error);
});

// protejo el servidor ante cualquier excepcion no atrapada
app.use((err, req, res, next) => {
    logger.error(err.message);
    return res.status(500).send('ERROR NO RECONOCIDO');
});






