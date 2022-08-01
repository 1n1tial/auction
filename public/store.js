ready()

function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }
  
  function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');
  
    function updateClock() {
      const t = getTimeRemaining(endtime);
  
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
  
      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }
  
    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }
  
  const deadline1 = new Date(Date.parse(new Date()) + 10 * 24 * 60 * 60 * 1000);
  initializeClock('clockdiv1', deadline1);
  const deadline2 = new Date(Date.parse(new Date()) + 10 * 24 * 60 * 60 * 1000);
  initializeClock('clockdiv2', deadline2);
  const deadline3 = new Date(Date.parse(new Date()) + 10 * 24 * 60 * 60 * 1000);
  initializeClock('clockdiv3', deadline3);
  const deadline4 = new Date(Date.parse(new Date()) + 10 * 24 * 60 * 60 * 1000);
  initializeClock('clockdiv4', deadline4);

function ready() {
    var removeCartItemBtns = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemBtns.length; i++) {
        var btn = removeCartItemBtns[i]
        btn.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', priceChanged)
    }

    var addToCartBtns = document.getElementsByClassName('shop-item-btn')
    for (var i = 0; i < addToCartBtns.length; i++) {
        var btn = addToCartBtns[i]
        btn.addEventListener('click', addToCartCLicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function removeCartItem(event) {
    var btnclicked = event.target
    btnclicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function priceChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartCLicked(event) {
    var btn = event.target
    var shopItem = btn.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemsNames = document.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert('This item is already added to bid list')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-column cart-item">
            <img class="cart-item-image" src="${imageSrc}" width="80">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-column cart-price">${price}</span>
        <div class="cart-column cart-quantity">
            <input class="cart-price-input" type="number" value="1">
            <button class="btn btn-danger">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-price-input')[0].addEventListener('change', priceChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-price-input')[0]
        var origPrice = parseFloat(priceElement.innerText.replace('CURRENT BID: $', ''))
        var price = parseFloat(quantityElement.value)
        if (price < origPrice) {
            return
        }
        total = total + price
    }
    total = Math.round(total*100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function purchaseClicked() {
    if (parseFloat(document.getElementsByClassName('cart-total-price')[0].innerText.replace('$', '')) === 0) {
        alert('PLEASE MATCH THE CURRENT BID')
        return
    } else {
        alert('CONTINUE THE BID?')
        updateCurrentBid()
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    }   
}

function updateCurrentBid() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var priceElement = cartRow.getElementsByClassName('cart-price-input')[0]
        var price = parseFloat(priceElement.value)
        var shopItemContainer = document.getElementsByClassName('shop-item')
        console.log(8)
        for (var j = 0; j < shopItemContainer.length; j++) {
            var shopItem = shopItemContainer[j]
            var shopItemTitle = shopItem.getElementsByClassName('shop-item-title')[0].innerText
            var shopItemPrice = shopItem.getElementsByClassName('shop-item-price')[0].innerText
            if (shopItemTitle == title) {
                shopItem.getElementsByClassName('shop-item-price')[0].innerText = 'CURRENT BID: $' + price
            }
        }
    }
    
}