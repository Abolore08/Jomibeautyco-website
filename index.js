/* =========================================================
   JOMIBEAUTYCO
   Main JavaScript
========================================================= */

/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    document.body.classList.toggle("menu-open", isOpen);
  });
}

/* Close menu when navigation link is clicked */

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("open");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  });
});

/* Close menu when clicking outside */

document.addEventListener("click", (event) => {
  if (!navMenu || !menuToggle) return;

  const clickedInsideMenu = navMenu.contains(event.target);

  const clickedMenuButton = menuToggle.contains(event.target);

  if (
    !clickedInsideMenu &&
    !clickedMenuButton &&
    navMenu.classList.contains("open")
  ) {
    navMenu.classList.remove("open");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }
});

/* ================= HEADER SCROLL ================= */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ================= PRODUCT FILTER ================= */

const filterButtons = document.querySelectorAll(".filter-btn");

const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    productCards.forEach((card) => {
      const productCategory = card.dataset.category;

      if (selectedCategory === "all" || selectedCategory === productCategory) {
        card.classList.remove("hidden");

        setTimeout(() => {
          card.classList.add("in-view");
        }, 50);
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("in-view");
  });
}

/* ================= NEWSLETTER ================= */

const newsletterForm = document.getElementById("newsletterForm");

const emailInput = document.getElementById("email");

const formMessage = document.getElementById("formMessage");

if (newsletterForm && emailInput && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      formMessage.textContent = "Please enter your email address.";

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";

      return;
    }

    formMessage.textContent = "You're on the list! Welcome to JomiBeautyCO ✨";

    emailInput.value = "";
  });
}

/* =========================================================
   SHOPPING CART
========================================================= */

let cart = JSON.parse(localStorage.getItem("jomiBeautyCart")) || [];

const cartBtn = document.getElementById("cartBtn");

const cartCount = document.getElementById("cartCount");

const addToCartButtons = document.querySelectorAll(".add-to-cart");

/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {
  if (!cartCount) return;

  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
}

/* ================= SAVE CART ================= */

function saveCart() {
  localStorage.setItem("jomiBeautyCart", JSON.stringify(cart));

  updateCartCount();
}

/* ================= ADD PRODUCT TO CART ================= */

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.name;

    const productPrice = Number(button.dataset.price);

    if (!productName || !productPrice) {
      return;
    }

    const existingProduct = cart.find((item) => item.name === productName);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    saveCart();

    const originalText = button.textContent.trim();

    button.textContent = "Added ✓";

    button.classList.add("added");

    setTimeout(() => {
      button.textContent = originalText;

      button.classList.remove("added");
    }, 1500);
  });
});

/* ================= OPEN CART ================= */

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    openCart();
  });
}

/* ================= OPEN CART FUNCTION ================= */

function openCart() {
  let cartPanel = document.getElementById("cartPanel");

  if (!cartPanel) {
    cartPanel = document.createElement("div");

    cartPanel.id = "cartPanel";

    document.body.appendChild(cartPanel);
  }

  renderCart();

  cartPanel.classList.add("active");
}

/* ================= CLOSE CART ================= */

function closeCart() {
  const cartPanel = document.getElementById("cartPanel");

  if (cartPanel) {
    cartPanel.classList.remove("active");
  }
}

/* ================= DISPLAY CART ================= */

function renderCart() {
  const cartPanel = document.getElementById("cartPanel");

  if (!cartPanel) return;

  /* EMPTY CART */

  if (cart.length === 0) {
    cartPanel.innerHTML = `

            <div class="cart-header">

                <h2>Your Cart</h2>

                <button
                    class="cart-close"
                    onclick="closeCart()"
                    aria-label="Close cart"
                >
                    ×
                </button>

            </div>


            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add something beautiful to your cart
                    and come back when you're ready.
                </p>

                <button
                    class="continue-shopping"
                    onclick="closeCart()"
                >
                    Continue Shopping
                </button>

            </div>

        `;

    return;
  }

  /* CART ITEMS */

  let cartItemsHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    cartItemsHTML += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <span>
                        ₦${item.price.toLocaleString()}
                    </span>

                </div>


                <div class="cart-item-actions">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <strong class="cart-item-total">

                    ₦${itemTotal.toLocaleString()}

                </strong>


                <button
                    class="remove-item"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `;
  });

  /* CART PANEL */

  cartPanel.innerHTML = `

        <div class="cart-header">

            <div>

                <span class="eyebrow">
                    JomiBeautyCO
                </span>

                <h2>Your Cart</h2>

            </div>


            <button
                class="cart-close"
                onclick="closeCart()"
                aria-label="Close cart"
            >
                ×
            </button>

        </div>


        <div class="cart-items">

            ${cartItemsHTML}

        </div>


        <div class="cart-footer">

            <div class="cart-total">

                <span>
                    Total
                </span>

                <strong>
                    ₦${total.toLocaleString()}
                </strong>

            </div>


            <button
                class="checkout-btn"
                onclick="checkoutWhatsApp()"
            >
                Checkout on WhatsApp →
            </button>


            <button
                class="continue-shopping"
                onclick="closeCart()"
            >
                Continue Shopping
            </button>

        </div>

    `;
}

/* ================= CHANGE QUANTITY ================= */

function changeQuantity(index, change) {
  if (!cart[index]) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();

  renderCart();
}

/* ================= REMOVE PRODUCT ================= */

function removeFromCart(index) {
  if (!cart[index]) return;

  cart.splice(index, 1);

  saveCart();

  renderCart();
}

/* ================= WHATSAPP CHECKOUT ================= */

function checkoutWhatsApp() {
  if (cart.length === 0) return;

  let message = "Hello JomiBeautyCO,\n\n";

  message += "I would like to place an order:\n\n";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    message += `${index + 1}. ${item.name}`;

    message += ` x${item.quantity}`;

    message += ` - ₦${itemTotal.toLocaleString()}\n`;
  });

  message += `\nTotal: ₦${total.toLocaleString()}`;

  message += "\n\nThank you!";

  const whatsappNumber = "2348025264779";

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}

/* ================= ESCAPE KEY ================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");

    if (menuToggle) {
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  }
});

/* ================= CURRENT YEAR ================= */

const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ================= INITIAL CART COUNT ================= */

updateCartCount();