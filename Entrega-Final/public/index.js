const socket = io.connect();
var user; //variable donde guardamos los datos del usuario
var carrito = []//variable donde guardamos la compra del cliente

document.addEventListener("DOMContentLoaded", ()=>{
//---------- LOGIN --------------    
socket.on('usuario', data => {    
    if(data != null){
        user =  data;         
        document.querySelector(".user").innerHTML = `
        <img src="uploads/${data.foto}" alt="" width="100" >
            <h3>Bienvenido Usuario: ${data.username}, tus compras te las mandaremos al mail: ${data.mail} </h3>
        `
    }    
});
socket.on('dame-usuario', data => {
    data = user.username;
    console.log(data)
    socket.emit('mando-usuario', data);
})
//----------PRODUCTOS - CARRITO --------------
socket.on('productos', data => {
    if(data != null){ 
        console.log(data)          
    let tabla = document.querySelector('.tabla')
    tabla.innerHTML = `<h1>Vista de Productos</h1>
    <br>
    <table class="table table-dark">
                <tr><th>Nombre</th><th>Precio</th><th>Foto</th><th>Actualizado</th></tr>
                <tbody class="tablaDATA"></tbody>
                </table>
        `
    let tablaDATA = document.querySelector('.tablaDATA')
    data.forEach(e => {      
     
     tablaDATA.innerHTML += ` 
           
     <tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.timeStamp}</td><td>${e.id}</td><td><button class="comprar">COMPRAR</button></td></tr>
           
    `
    });
    
    tablaDATA.addEventListener('click', event => {
    if(event.target.classList.contains('comprar')){
        let id = event.target.parentElement.previousElementSibling.textContent;
        let producto;
        
        for(let e of data){
            if(e.id == id){
                producto = e;
            }
        }
        alert("Felicitaciones compraste "+ producto.title)
        carrito.push(producto);
        addCarrito(carrito)
    }
        
    })

    }else{
        console.log("productos no recibidos " + data)
    }
})

})

function addCarrito(carrito){
    let carritoTable = document.querySelector('.carrito');

    carritoTable.innerHTML = `
    <div class="jumbotron tabla">
    <h1>Tu pedido</h1>
    <br>      
    
        <div class="pedido table-responsive">
            <table class="table table-dark">
            <tr><th>Nombre</th><th>Precio</th><th>Foto</th><th>Actualizado</th></tr>
            <tbody class="carritoDATA"></tbody>
            <tfoot>
    <tr>
      <td>TOTAL:</td>
      <td class="carritoTotal"></td><hr><button class="finalizar-compra btn btn-success">CONFIRMAR COMPRA</button>
    </tr>
  </tfoot>
            </table>
        </div>    
    </div>
    `
    let carritoDATA = document.querySelector('.carritoDATA');
    
    carrito.forEach(e => {      
     
        carritoDATA.innerHTML += `              
        <tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.timeStamp}</td><td>${e.id}</td></tr>        
       
        `
    });

    let carritoTotal = document.querySelector('.carritoTotal');
    let total = 0;
    carrito.forEach(e => {
        total += e.price
        carritoTotal.innerHTML = total;
    })

    let pedido = document.querySelector('.pedido');
    if(pedido != null){
        pedido.addEventListener( 'click', event => {
            if(event.target.classList.contains('finalizar-compra')){
                checkOut();
            }
    })
}

}



function checkOut(){
   
    let pedido = [];
    
    carrito.forEach(e => { 
       pedido.push(`<tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.timeStamp}</td><td>${e.id}</td></tr>`)   
    });
    pedido.unshift(user.username);
    pedido.unshift(user.mail);
    pedido.unshift(user.telefono);
         
    
    
    socket.emit('compra-finalizada', pedido);
    
    document.querySelector('.carrito').innerHTML = `<div class="jumbotron">Gracias por su compra le enviamos un mail a ${user.mail}</div>`;
}

//----------CHAT--------------
function render(data){
    
    var html = data.map(elem => {
        return (`<div class="col row">
                    <p><strong>${elem.autor}</strong>
                    
                    </p><p class="brown">${elem.date}</p><p class="green">${elem.texto}</p>                    
                    </div>
        `)
    }).join('');

    document.querySelector('#mensajes').innerHTML = html;
}

socket.on('mensajes', chat => {    
    render(chat);    
})

function addMensajes(event){
 mail = document.querySelector('#userName');
    if(mail.value.includes('@')){
        let mensaje = {
            autor: mail.value,
            date: new Date().toLocaleString(),                        
            texto: document.querySelector('#texto').value
        }    
        socket.emit('nuevo-mensaje', mensaje);
        return false;
    }else{
        alert('Ingrese un mail valido')
    }  
    
    let ordenes = document.querySelector(".ordenes");
    if(ordenes != null){
        cargarOrden()
    }

    function cargarOrden(){
        console.log(ordenes)
        carrito.forEach(e => {      
     
            ordenes.innerHTML += `              
            <tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.timeStamp}</td><td>${e.id}</td></tr>        
           
            `
        });
    }

}