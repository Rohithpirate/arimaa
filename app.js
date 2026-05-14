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
const UPI_ID = "Rohithpirate@iob";

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

function addToCart(productId, qty = 1) {
  const cart = readCart();
  const product = products.find((p) => p.id === productId);
  const existing = cart.find((item) => item.id === productId);

  if (!product) return;

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  writeCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  countEl.textContent = String(getCount(readCart()));
}

function updateUPIPayLink() {
  const upiLinkEl = document.getElementById("upiPayLink");
  if (!upiLinkEl) return;

  const total = getTotal(readCart());
  const upiIntent = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("ARIMAA PRODUCTS")}&am=${encodeURIComponent(
    total.toFixed(2)
  )}&cu=INR&tn=${encodeURIComponent("Soap order payment")}`;
  upiLinkEl.setAttribute("data-upi-intent", upiIntent);
}

function renderMenu() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (item) => `
      <article class="card ${item.id === "soap-1" ? "clickable-card" : ""}" data-open-id="${item.id === "soap-1" ? item.id : ""}">
        <div class="menu-thumb ${item.image ? "" : "placeholder"}">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span>${item.name.charAt(0)}</span>`}
        </div>
        <div class="card-content">
          <h4>${item.id === "soap-1" ? `<a href="product.html?id=${item.id}" class="product-link">${item.name}</a>` : item.name}</h4>
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

    const openCard = target.closest("[data-open-id]");
    if (openCard && !target.closest("[data-id]")) {
      const openId = openCard.getAttribute("data-open-id");
      if (openId) {
        window.location.href = `product.html?id=${openId}`;
        return;
      }
    }

    const productId = target.getAttribute("data-id");
    if (!productId) return;
    addToCart(productId);
    target.textContent = "Added";
    setTimeout(() => {
      target.textContent = "Add to Cart";
    }, 700);
  });
}

function renderProductDetail() {
  const detailWrap = document.getElementById("product-detail");
  if (!detailWrap) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "soap-1";
  const product = products.find((p) => p.id === productId);
  if (!product) {
    detailWrap.innerHTML = "<p>Product not found.</p>";
    return;
  }

  detailWrap.innerHTML = `
    <div class="detail-card">
      <div class="detail-image-wrap ${product.image ? "" : "placeholder"}">
        ${
          product.image
            ? `<img src="${product.image}" alt="${product.name}" class="detail-image" />`
            : `<span>${product.name.charAt(0)}</span>`
        }
      </div>
      <div class="detail-info">
        <h2>${product.name}</h2>
        <p class="desc">${product.description || ""}</p>
        <p class="detail-price">Rs. ${product.price}</p>
        <div class="detail-qty">
          <button type="button" id="qty-dec">-</button>
          <span id="qty-value">1</span>
          <button type="button" id="qty-inc">+</button>
        </div>
        <button type="button" class="cta" id="detail-add-btn">Add to Cart</button>
      </div>
    </div>
  `;

  const qtyValue = document.getElementById("qty-value");
  const dec = document.getElementById("qty-dec");
  const inc = document.getElementById("qty-inc");
  const addBtn = document.getElementById("detail-add-btn");
  let qty = 1;

  const refreshQty = () => {
    if (qtyValue) qtyValue.textContent = String(qty);
  };

  dec?.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    refreshQty();
  });

  inc?.addEventListener("click", () => {
    qty += 1;
    refreshQty();
  });

  addBtn?.addEventListener("click", () => {
    addToCart(product.id, qty);
    addBtn.textContent = "Added";
    setTimeout(() => {
      addBtn.textContent = "Add to Cart";
    }, 700);
  });
}

function initPromoSlider() {
  const track = document.getElementById("slider-track");
  if (!track) return;

  const dots = Array.from(document.querySelectorAll(".dot"));
  let current = 0;
  const total = 2;

  const applySlide = (index) => {
    current = index;
    track.style.transform = `translateX(-${index * 50}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.getAttribute("data-slide") || "0");
      applySlide(index);
    });
  });

  setInterval(() => {
    applySlide((current + 1) % total);
  }, 3000);
}

function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  if (!cartItemsEl || !cartTotalEl) return;

  const cart = readCart();

  if (!cart.length) {
    cartItemsEl.innerHTML = "<p>Your cart is empty. Add soaps from the shop page.</p>";
    cartTotalEl.textContent = "Rs. 0";
    updateUPIPayLink();
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
  updateUPIPayLink();

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
    updateUPIPayLink();
  };

  paymentRadios.forEach((radio) => radio.addEventListener("change", apply));
  apply();
}

function setupUPIPayButton() {
  const btn = document.getElementById("upiPayLink");
  if (!btn) return;

  btn.addEventListener("click", () => {
    updateUPIPayLink();
    const upiIntent = btn.getAttribute("data-upi-intent");
    if (!upiIntent) return;
    window.location.href = upiIntent;
  });
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
renderProductDetail();
initPromoSlider();
setupUPIPayButton();
