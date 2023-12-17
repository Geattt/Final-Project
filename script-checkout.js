// Function to get the value of a cookie by name
function getCookie(name) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

let calorieValue = getCookie('calorieValue');

let listCart = [];
function checkCart(){
        var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
        if(cookieValue){
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }
}
checkCart();
addCartToHTML();
function addCartToHTML(){
    // clear data default
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalCalorieHTML = document.querySelector('.totalCalorie');
    let totalCalorieNeededHTML = document.querySelector('.totalCalorieNeeded');
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalCalorie = 0;
    // if has product in Cart
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}" class="checkout-food">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}/1 product/${product.calorie}</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">$${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                totalPrice = totalPrice + (product.price * product.quantity);
                totalCalorie = totalCalorie + parseInt(product.calorie);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = '$' + totalPrice;
    totalCalorieHTML.innerText = totalCalorie + 'kkal';
    totalCalorieNeededHTML.innerText = calorieValue + 'kkal';
}

// script-checkout.js
const voucherButton = document.querySelector('.voucher-button');
voucherButton.addEventListener('click', checkVoucher);

async function checkVoucher() {
    const voucherInput = document.getElementById('voucher');
    const voucherCode = voucherInput.value;
  
    try {
        const response = await fetch(`http://localhost:8888/vouchers/${voucherCode}`);
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const voucherData = await response.json();
        if (voucherData && !voucherData.used) {
          alert('Voucher is valid!');
          // You can perform additional actions here if the voucher is valid
          const totalDiscountHTML = document.querySelector('.totalDiscount');
          totalDiscountHTML.innerText = `-$${voucherData.value}`;

          // Update totalPriceHTML by subtracting the voucher discount
          const totalPriceHTML = document.querySelector('.totalPrice');
          const originalTotalPrice = parseFloat(totalPriceHTML.innerText.replace('$', ''));
          const discountedTotalPrice = originalTotalPrice - voucherData.value;
          totalPriceHTML.innerText = `$${discountedTotalPrice.toFixed(0)}`;
          // Mark the voucher as used
          await fetch(`http://localhost:8888/vouchers/${voucherCode}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                used: true,
            }),
        });
        } else {
          alert('Invalid or used voucher!');
          // You can handle the case where the voucher is invalid or used
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error(error);
      alert('Voucher is invalid! Please try again.');
    }
  }
  
  
