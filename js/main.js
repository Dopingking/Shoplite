// API endpoints
const API_URL = "https://api.escuelajs.co/api/v1/products";
const CAT_URL = "https://api.escuelajs.co/api/v1/categories";

// DOM elements
const productList = document.getElementById("product-list");
const categoriesDiv = document.getElementById("categories");
const cartCount = document.getElementById("cart-count");
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const loadingProducts = document.getElementById("loading-products");
const loadingCategories = document.getElementById("loading-categories");
const toast = document.getElementById("toast");

// Search function
async function searchProducts(query) {
  if (!query.trim()) {
    fetchProducts(); // load default products
    return;
  }
  try {
    loadingProducts.classList.remove("hidden");
    productList.innerHTML = "";

    const res = await fetch(`${API_URL}?title=${encodeURIComponent(query)}&offset=0&limit=12`);
    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      productList.innerHTML = `<p class="col-span-full text-center text-red-500">No products found for "${query}".</p>`;
    } else {
      renderProducts(products);
    }

    loadingProducts.classList.add("hidden");
  } catch (err) {
    loadingProducts.classList.add("hidden");
    productList.innerHTML = '<p class="col-span-full text-center text-red-500">Error searching products.</p>';
  }
}

// Hook up search events
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  searchProducts(query);
});
document.getElementById("mobile-search-btn").addEventListener("click", () => {
  const query = document.getElementById("mobile-search-input").value;
  searchProducts(query);
});
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchProducts(e.target.value);
});
document.getElementById("mobile-search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchProducts(e.target.value);
});

// Hero Section auto slider
const heroBg = document.getElementById("hero-bg");
let index = 0;
const slidesCount = heroBg.children.length;

function showSlide(i) {
  index = (i + slidesCount) % slidesCount;
  heroBg.style.transform = `translateX(-${index * 100}%)`;
}
setInterval(() => {
  showSlide(index + 1);
}, 4000);

// Utility: pick the first valid image URL
function getValidImage(images) {
  if (Array.isArray(images)) {
    for (let img of images) {
      if (img && typeof img === "string" && img.startsWith("http") && !img.includes("localhost")) {
        return img;
      }
    }
  }
  return "https://placehold.co/300x200?text=No+Image";
}

// Fetch products
async function fetchProducts(categoryId = null) {
  try {
    loadingProducts.classList.remove("hidden");
    productList.innerHTML = "";

    let url = categoryId
      ? `${CAT_URL}/${categoryId}/products`
      : `${API_URL}?offset=0&limit=8`;

    const res = await fetch(url);
    const products = await res.json();

    if (!Array.isArray(products)) {
      productList.innerHTML =
        '<p class="text-center col-span-full text-red-500">Error loading products. Please try again.</p>';
      loadingProducts.classList.add("hidden");
      return;
    }

    renderProducts(products);
    loadingProducts.classList.add("hidden");
  } catch (err) {
    loadingProducts.classList.add("hidden");
    productList.innerHTML =
      '<p class="text-center col-span-full text-red-500">Error loading products. Please try again.</p>';
  }
}

// Render products
function renderProducts(products) {
  productList.innerHTML = products
    .map((p) => {
      const imgSrc = getValidImage(p.images);
      return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
          <img src="${imgSrc}" alt="${p.title}" class="h-48 w-full object-contain p-4">
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 line-clamp-1">${p.title}</h3>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">${p.description || "No description available"}</p>
            <p class="price text-[#1a1b41] font-bold mt-2">$${p.price}</p>
            
            <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${imgSrc}')"
              class="mt-3 w-full bg-[#3bc14a] text-white py-2 rounded hover:bg-green-700 transition">
              Add to Cart
            </button>
            <a href="product.html?id=${p.id}" 
              class="mt-3 block text-center text-[#1a1b41] hover:text-[#3bc14a] font-semibold transition">
              View Details
            </a>
          </div>
        </div>`;
    })
    .join("");
}

// Fetch categories
async function fetchCategories() {
  try {
    loadingCategories.classList.remove("hidden");
    categoriesDiv.innerHTML = "";

    const res = await fetch(CAT_URL);
    const categories = await res.json();

    if (!Array.isArray(categories)) {
      categoriesDiv.innerHTML =
        '<p class="text-center col-span-full text-red-500">Error loading categories.</p>';
      loadingCategories.classList.add("hidden");
      return;
    }

    renderCategories(categories);
    loadingCategories.classList.add("hidden");
  } catch (err) {
    loadingCategories.classList.add("hidden");
    categoriesDiv.innerHTML =
      '<p class="text-center col-span-full text-red-500">Error loading categories.</p>';
  }
}

// Render categories
function renderCategories(categories) {
  const limitedCategories = categories.slice(0, 4);
  categoriesDiv.innerHTML = limitedCategories
    .map(
      (cat) => `
      <button onclick="fetchProducts(${cat.id})"
        class="category-btn px-6 py-8 bg-[#1a1b41] text-white rounded-lg hover:bg-[#3bc14a] transition text-lg font-semibold">
        ${cat.name}
      </button>`
    )
    .join("");
}

// Show toast notification
function showToast() {
  toast.classList.remove("translate-y-20");
  setTimeout(() => {
    toast.classList.add("translate-y-20");
  }, 2000);
}

// Add product to cart (localStorage)
function addToCart(productId, title, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex((i) => i.id === productId);

  if (idx >= 0) {
    cart[idx].qty++;
  } else {
    cart.push({ id: productId, qty: 1, title, price, image });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast();

  cartCount.classList.add("cart-pulse");
  setTimeout(() => cartCount.classList.remove("cart-pulse"), 1500);
}

// Update cart icon count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = totalItems;
  if (totalItems > 0) cartCount.classList.remove("hidden");
  else cartCount.classList.add("hidden");
}

// Mobile menu toggle
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
  fetchCategories();
  updateCartCount();
});

// // Scroll-to-top logic
// const scrollTopBtn = document.getElementById("scrollTopBtn");
// window.onscroll = () => {
//   if (document.documentElement.scrollTop > 200) {
//     scrollTopBtn.style.display = "block";
//   } else {
//     scrollTopBtn.style.display = "none";
//   }
// };
// scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
