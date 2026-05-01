const products = [
  { id: "soap-1", name: "Coconut Milk Activated Charcoal Soap", price: 110, image: "assets/images/coconut-milk.jpeg", description: "It removes dead skin cells, it moisturizes the skin." },
  { id: "soap-2", name: "Potato Ulunthu Soap", price: 110, image: "assets/images/potato-ulunthu.jpeg", description: "Helps brighten skin tone and supports soft, smooth skin." },
  { id: "soap-3", name: "Beetroot Facepack", price: 130, description: "Gives a fresh glow and helps revive tired-looking skin." },
  { id: "soap-4", name: "Manjistha Soap", price: 120, description: "Supports skin brightening and helps improve skin texture." },
  { id: "soap-5", name: "Goat Milk with Shea Butter Soap", price: 120, description: "Deeply nourishes dry skin and helps maintain moisture." },
  { id: "soap-6", name: "Redwine Soap", price: 100, description: "Helps with skin renewal and gives a healthy glow." },
  { id: "soap-7", name: "Multani Mitti Soap", price: 120, description: "Helps absorb excess oil and cleanse pores gently." },
  { id: "soap-8", name: "Kuppaimeni Neem Soap", price: 130, description: "Supports clear skin and helps reduce tanning appearance." },
  { id: "soap-9", name: "Nalangu Maavu Soap", price: 120, description: "Traditional blend that helps keep skin fresh and glowing." },
  { id: "soap-10", name: "Red Sandal Soap", price: 110, description: "Helps improve skin tone and gives a smoother look." },
  { id: "soap-11", name: "Sandal Soap", price: 110, description: "Provides mild cleansing with a bright, refreshed feel." },
  { id: "soap-12", name: "Beetroot Soap", price: 100, description: "Helps maintain soft skin and natural-looking glow." },
  { id: "soap-13", name: "Aloe Vera Soap", price: 100, description: "Soothes skin and helps reduce dryness and irritation." },
  { id: "soap-14", name: "Avarampoo Soap", price: 130, description: "Supports skin clarity and helps improve overall skin feel." }
];

const CART_KEY = "arimaa_cart";

function readCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(productId) {
  const cart = readCart();
  const product = products.find((p) => p.id === productId);
  const existing = cart.find((item) => item.id === productId);

  if (!product) return;

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  writeCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  countEl.textContent = String(getCount(readCart()));
}

function renderMenu() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (item) => `
      <article class="card">
        <div class="menu-thumb ${item.image ? "" : "placeholder"}">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span>${item.name.charAt(0)}</span>`}
        </div>
        <div class="card-content">
          <h4>${item.name}</h4>
          <p class="desc">${item.description || ""}</p>
          <div class="price-row">
            <strong>Rs. ${item.price}</strong>
            <button class="cta" data-id="${item.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const productId = target.getAttribute("data-id");
    if (!productId) return;
    addToCart(productId);
    target.textContent = "Added";
    setTimeout(() => {
      target.textContent = "Add to Cart";
    }, 700);
  });
}

function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  if (!cartItemsEl || !cartTotalEl) return;

  const cart = readCart();

  if (!cart.length) {
    cartItemsEl.innerHTML = "<p>Your cart is empty. Add soaps from the shop page.</p>";
    cartTotalEl.textContent = "Rs. 0";
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-main">
          ${
            item.image
              ? `<img class="cart-thumb" src="${item.image}" alt="${item.name}" />`
              : `<div class="cart-thumb placeholder"><span>${item.name.charAt(0)}</span></div>`
          }
        <div>
          <strong>${item.name}</strong><br />
          Rs. ${item.price}
        </div>
        </div>
        <div class="qty-controls">
          <button data-action="dec" data-id="${item.id}" type="button">-</button>
          <span>${item.qty}</span>
          <button data-action="inc" data-id="${item.id}" type="button">+</button>
        </div>
      </div>
    `
    )
    .join("");

  cartTotalEl.textContent = `Rs. ${getTotal(cart)}`;

  cartItemsEl.onclick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.getAttribute("data-id");
    const action = target.getAttribute("data-action");
    if (!id || !action) return;

    const updatedCart = readCart()
      .map((item) => {
        if (item.id !== id) return item;
        if (action === "inc") return { ...item, qty: item.qty + 1 };
        if (action === "dec") return { ...item, qty: Math.max(0, item.qty - 1) };
        return item;
      })
      .filter((item) => item.qty > 0);

    writeCart(updatedCart);
    renderCart();
  };
}

function setPaymentBehavior() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const upiBox = document.getElementById("upiBox");
  if (!upiBox) return;

  const apply = () => {
    const selected = document.querySelector('input[name="payment"]:checked');
    upiBox.style.display = selected && selected.value === "upi" ? "block" : "none";
  };

  paymentRadios.forEach((radio) => radio.addEventListener("change", apply));
  apply();
}

function setupOrderForm() {
  const form = document.getElementById("order-form");
  const msg = document.getElementById("order-msg");
  if (!form || !msg) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cart = readCart();

    if (!cart.length) {
      msg.textContent = "Cart is empty. Please add products before placing order.";
      return;
    }

    const formData = new FormData(form);
    const customer = formData.get("name");
    msg.textContent = `Thank you, ${customer}. Your order total is Rs. ${getTotal(cart)}. We will contact you shortly.`;

    writeCart([]);
    renderCart();
    form.reset();
    setPaymentBehavior();
  });
}

updateCartCount();
renderMenu();
renderCart();
setPaymentBehavior();
setupOrderForm();
