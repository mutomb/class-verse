const cart = {
  itemTotal() {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem('cart')) {
        return JSON.parse(sessionStorage.getItem('cart')!).length //non-null assertion
      }
    }
    return 0
  },
  addItem(item) {
    let cart = []
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem('cart')) {
        cart = JSON.parse(sessionStorage.getItem('cart')!) //non-null assertion
      }
      let itemIndex = cart.findIndex((element)=>{return element.course._id === item._id})
      if(itemIndex> -1){
        cart[itemIndex] = {course: item, quantity: 1} //{course: item, quantity: ++cart[itemIndex].quantity}
      }
      else{  
        cart.push({
          course: item,
          quantity: 1
        })
      }
      sessionStorage.setItem('cart', JSON.stringify(cart)!) //non-null assertion
    }
  },
  updateCart(itemIndex, quantity) {
    let cart = []
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem('cart')) {
        cart = JSON.parse(sessionStorage.getItem('cart')!) //non-null assertion
      }
      cart[itemIndex].quantity = quantity
      sessionStorage.setItem('cart', JSON.stringify(cart))
    }
  },
  getCart() {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem('cart')) {
        return JSON.parse(sessionStorage.getItem('cart')!) //non-null assertion
      }
    }
    return []
  },
  removeItem(itemIndex) {
    let cart = []
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem('cart')) {
        cart = JSON.parse(sessionStorage.getItem('cart')!) //non-null assertion
      }
      cart.splice(itemIndex, 1)
      sessionStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart
  },
  emptyCart(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('cart')
      cb()
    }
  },
}

export default cart
