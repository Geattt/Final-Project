let modal = document.getElementById('myModal')
let containers = document.getElementById('contain')

document.getElementById('myBtn').addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflowY = 'scroll';
});

window.onclick=function(event){
    if(event.target == modal){
        modal.style.display = 'none';
        document.body.style.overflowY = 'scroll';
    }
}

//Code for cart items

let cart = document.getElementById('cart-items')

let products = null;
// get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

//show datas product in list 
function addDataToHTML() {
    // Remove existing menu items from HTML
    let menuContainer = document.querySelector('.listProduct');
    menuContainer.innerHTML = '';

    // Add new product data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');

            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <div class="column">
                    <span class="text-container">
                        <span>${product.name}</span>
                    </span>   
                    <span class="description">
                        <span>${product.description1}</span>
                        <span>${product.description2}</span>
                        <span>${product.description3}</span>
                    </span>
                    <button class="addButton" onclick="addCart(${product.id})">Add To Cart</button>
                </div>
                
                <div class="popup" onclick="togglePopup(this)">
                    <span class="calorie">
                        <script src="https://cdn.lordicon.com/lordicon.js"></script>
                        <lord-icon
                            src="https://cdn.lordicon.com/kndkiwmf.json"
                            trigger="hover"
                            colors="primary:#ffffff,secondary:#e88c30"
                            style="width:50px;height:50px">
                        </lord-icon>
                    </span> 
                    <span class="popuptext">${product.calorie}</span>
                </div>
                <span class="price">$${product.price}</span>
            `;
            menuContainer.appendChild(newProduct);
        });
    }
}
//use cookie so the cart doesn't get lost on refresh page
function togglePopup(element) {
    let popup = element.querySelector('.popuptext');
    popup.classList.toggle('show');
}

let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));
    //// If this product is not in the cart
    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{
        //If this product is already in the cart.
        //I just increased the quantity
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML() {
    // clear data default
    let listCartHTML = document.querySelector('.cart-items');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // if has product in Cart
    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img style="width:70px;height:70px" src="${product.image}">
                    <div class="content">
                        <div class="name-cart">${product.name}</div>
                        <div class="price-cart">$${product.price} / 1 product</div>
                    </div>
                    <div class="quantity-cart">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value-cart">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;

                // Append the quantity-cart div to the rightmost of the newCart element
                newCart.appendChild(document.createElement('div')).classList.add('quantity-cart');

                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}

