/* =========================
   CART DATA (persist localStorage)
========================= */

const CART_KEY = "sweetCakeCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


/* =========================
   PRODUCT STOCK (liên kết admin)
========================= */

const PRODUCTS_KEY = "sweetCakeProducts";

const DEFAULT_PRODUCTS = [
    { id: 1, name: "Bánh Kem Chocolate", price: 250000, stock: 20 },
    { id: 2, name: "Bánh Kem Paris", price: 350000, stock: 20 },
    { id: 3, name: "Bánh Kem Dâu Tây", price: 280000, stock: 20 },
    { id: 4, name: "Cupcake Vani", price: 45000, stock: 30 },
    { id: 5, name: "Cupcake Socola", price: 45000, stock: 30 },
    { id: 6, name: "Cupcake Dâu Tây", price: 45000, stock: 30 },
    { id: 7, name: "Bánh Tart Trứng", price: 35000, stock: 30 },
    { id: 8, name: "Donut Chocolate", price: 35000, stock: 30 },
    { id: 9, name: "Bánh Giáng Sinh", price: 320000, stock: 20 },
    { id: 10, name: "Bánh Sinh Nhật Vanilla", price: 320000, stock: 20 },
    { id: 11, name: "Bánh Sinh Nhật Matcha", price: 320000, stock: 20 },
    { id: 12, name: "Bánh Pháp Petit Four", price: 35000, stock: 30 },
    { id: 13, name: "Donut Kem Trứng", price: 25000, stock: 30 },
    { id: 14, name: "Donut Dâu Tây", price: 65000, stock: 30 },
    { id: 15, name: "Pancake", price: 50000, stock: 30 },
    { id: 16, name: "Tiramisu Cổ Điển", price: 89000, stock: 25 },
    { id: 17, name: "Tiramisu Matcha", price: 95000, stock: 20 },
    { id: 18, name: "Tiramisu Chocolate", price: 92000, stock: 20 },
    { id: 19, name: "Bánh Nướng Đậu Xanh", price: 75000, stock: 40 },
    { id: 20, name: "Bánh Nướng Thập Cẩm", price: 85000, stock: 40 },
    { id: 21, name: "Bánh Dẻo Đậu Xanh", price: 80000, stock: 40 },
    { id: 22, name: "Bánh Nướng Cốm Dừa", price: 75000, stock: 40 },
    { id: 23, name: "Bánh Dẻo Cốm Dừa", price: 75000, stock: 40 },
    { id: 24, name: "Set Quà Trung Thu", price: 850000, stock: 10 }
];

function getProducts() {
    let list = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "null");
    if (!list || !Array.isArray(list) || list.length === 0) {
        list = DEFAULT_PRODUCTS.map(p => ({ ...p }));
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
    }
    return list;
}

function getProductByName(name) {
    return getProducts().find(p => p.name === name);
}

function getAvailableStock(name) {
    const product = getProductByName(name);
    if (!product) return 999; // không có trong kho admin thì không chặn
    const inCart = cart.find(c => c.name === name);
    const reserved = inCart ? inCart.quantity : 0;
    return Math.max(0, product.stock - reserved);
}

/* Hiển thị số lượng còn lại trên thẻ sản phẩm (nhỏ gọn) */
function renderProductStock() {
    const cards = document.querySelectorAll(".product-card");
    if (!cards.length) return;

    const products = getProducts();

    cards.forEach(card => {
        // Ưu tiên tên trong addToCart (khớp kho admin), fallback h3
        let name = null;
        const btn = card.querySelector(".add-btn");
        if (btn) {
            const m = (btn.getAttribute("onclick") || "").match(/addToCart\('([^']+)'/);
            if (m) name = m[1];
        }
        if (!name) {
            const h3 = card.querySelector("h3");
            if (h3) name = h3.textContent.trim();
        }
        if (!name) return;

        const product = products.find(p => p.name === name);
        if (!product) return;

        const stock = product.stock;
        let badgeClass = "stock-badge in";
        let text = "Còn " + stock;
        if (stock === 0) {
            badgeClass = "stock-badge out";
            text = "Hết hàng";
        } else if (stock <= 5) {
            badgeClass = "stock-badge low";
            text = "Còn " + stock;
        }

        let badge = card.querySelector(".stock-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = badgeClass;
            const bottom = card.querySelector(".product-bottom");
            if (bottom) {
                const strong = bottom.querySelector("strong");
                if (strong) {
                    // gói giá + badge cho bố cục gọn
                    let wrap = bottom.querySelector(".price-stock");
                    if (!wrap) {
                        wrap = document.createElement("div");
                        wrap.className = "price-stock";
                        strong.parentNode.insertBefore(wrap, strong);
                        wrap.appendChild(strong);
                    }
                    wrap.appendChild(badge);
                } else {
                    bottom.prepend(badge);
                }
            } else {
                card.querySelector(".product-content")?.appendChild(badge);
            }
        } else {
            badge.className = badgeClass;
        }
        badge.textContent = text;

        // Disable nút nếu hết hàng
        if (btn) {
            if (stock <= 0) {
                btn.disabled = true;
                btn.classList.add("disabled");
                btn.textContent = "Hết hàng";
            } else {
                btn.disabled = false;
                btn.classList.remove("disabled");
                if (btn.textContent.includes("Hết hàng") || btn.textContent.trim() === "Hết hàng") {
                    btn.innerHTML = "🛒 Thêm";
                }
            }
        }
    });
}



/* =========================
   FORMAT MONEY
========================= */

function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "đ";
}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   ADD PRODUCT
========================= */

function addToCart(name, price) {

    const available = getAvailableStock(name);

    if (available <= 0) {
        showToast("Xin lỗi, " + name + " đã hết hàng!");
        renderProductStock();
        return;
    }

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {
        if (existingProduct.quantity >= (getProductByName(name)?.stock ?? 999)) {
            showToast("Chỉ còn " + (getProductByName(name)?.stock ?? 0) + " sản phẩm!");
            return;
        }
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    renderProductStock();
    showToast("Đã thêm " + name + " vào giỏ hàng!");
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    saveCart();

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    // Nếu không có phần tử giỏ hàng (trang checkout) thì chỉ lưu
    if (!cartItems || !cartCount || !cartTotal) return;

    let total = 0;
    let totalQuantity = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <div>🛒</div>

                <h3>Giỏ hàng đang trống</h3>

                <p>
                    Hãy chọn một chiếc bánh bạn yêu thích.
                </p>

            </div>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0đ";

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;

        total += productTotal;

        totalQuantity += product.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="cart-item-price">
                        ${formatMoney(product.price)}
                    </p>

                </div>


                <div class="quantity">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeProduct(${index})"
                    title="Xóa sản phẩm"
                >
                    🗑️
                </button>

            </div>

        `;

    });


    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatMoney(total);
}


/* =========================
   INCREASE QUANTITY
========================= */

function increaseQuantity(index) {

    if (!cart[index]) return;

    const name = cart[index].name;
    const product = getProductByName(name);
    if (product && cart[index].quantity >= product.stock) {
        showToast("Chỉ còn " + product.stock + " sản phẩm trong kho!");
        return;
    }

    cart[index].quantity++;
    updateCart();
    renderProductStock();
}


/* =========================
   DECREASE QUANTITY
========================= */

function decreaseQuantity(index) {

    if (!cart[index]) return;


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();
    renderProductStock();
}


/* =========================
   REMOVE PRODUCT
========================= */

function removeProduct(index) {

    if (!cart[index]) return;

    const removedName = cart[index].name;

    cart.splice(index, 1);

    updateCart();
    renderProductStock();

    showToast("Đã xóa " + removedName);
}


/* =========================
   OPEN CART
========================= */

function openCart() {

    const overlay =
        document.getElementById("cart-overlay");

    overlay.style.display = "flex";

    document.body.style.overflow = "hidden";
}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    const overlay =
        document.getElementById("cart-overlay");

    overlay.style.display = "none";

    document.body.style.overflow = "";
}


/* =========================
   OPEN CHECKOUT → trang riêng
========================= */

function openCheckout() {

    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống!");
        return;
    }

    saveCart();
    window.location.href = "checkout.html";
}

function closeCheckout() {
}


/* Checkout form logic đã chuyển sang checkout.js */


/* =========================
   FILTER PRODUCTS
========================= */

function filterProducts(category, button) {

    const products =
        document.querySelectorAll(".product-card");

    const buttons =
        document.querySelectorAll(".category");


    buttons.forEach(btn => {

        btn.classList.remove("active");

    });


    button.classList.add("active");


    products.forEach(product => {

        const productCategory =
            product.dataset.category;


        if (
            category === "all" ||
            productCategory === category
        ) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

}


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const nav =
        document.getElementById("nav");

    nav.classList.toggle("show");

}


/* =========================
   CLOSE MENU AFTER CLICK
========================= */

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        document
            .getElementById("nav")
            .classList.remove("show");

    });

});


/* =========================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================= */

document
    .getElementById("cart-overlay")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            closeCart();

        }

    });


/* =========================
   ESC KEY
========================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeCart();
    }

});


/* =========================
   INITIALIZE
========================= */

updateCart();

/* =========================
   AUTH UI
========================= */

function openAuthModal(tab) {
    const overlay = document.getElementById("auth-overlay");
    overlay.classList.add("show");
    switchAuthTab(tab || "login");
    const loginErr = document.getElementById("login-error");
    const regErr = document.getElementById("register-error");
    const forgotErr = document.getElementById("forgot-error");
    const forgotOk = document.getElementById("forgot-success");
    if (loginErr) loginErr.textContent = "";
    if (regErr) regErr.textContent = "";
    if (forgotErr) forgotErr.textContent = "";
    if (forgotOk) { forgotOk.style.display = "none"; forgotOk.textContent = ""; }
}

function closeAuthModal() {
    document.getElementById("auth-overlay").classList.remove("show");
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const forgotForm = document.getElementById("forgot-form");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "none";
    if (forgotForm) forgotForm.style.display = "none";
    if (tabLogin) tabLogin.classList.remove("active");
    if (tabRegister) tabRegister.classList.remove("active");

    if (tab === "register") {
        if (registerForm) registerForm.style.display = "block";
        if (tabRegister) tabRegister.classList.add("active");
    } else if (tab === "forgot") {
        if (forgotForm) forgotForm.style.display = "block";
        const err = document.getElementById("forgot-error");
        const ok = document.getElementById("forgot-success");
        if (err) err.textContent = "";
        if (ok) { ok.style.display = "none"; ok.textContent = ""; }
    } else {
        if (loginForm) loginForm.style.display = "block";
        if (tabLogin) tabLogin.classList.add("active");
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const username = document.getElementById("forgot-username").value;
    const phone = document.getElementById("forgot-phone").value;
    const errorEl = document.getElementById("forgot-error");
    const successEl = document.getElementById("forgot-success");

    errorEl.textContent = "";
    successEl.style.display = "none";
    successEl.textContent = "";

    if (typeof recoverPassword !== "function") {
        errorEl.textContent = "Chức năng chưa sẵn sàng!";
        return;
    }

    const result = recoverPassword(username, phone);
    if (!result.success) {
        errorEl.textContent = result.message;
        return;
    }

    successEl.style.display = "block";
    successEl.innerHTML =
        "Mật khẩu của tài khoản <b>" + result.username + "</b> là: <b>" + result.password + "</b><br>" +
        '<a href="#" id="forgot-go-login">Đăng nhập ngay →</a>';
    const go = document.getElementById("forgot-go-login");
    if (go) {
        go.onclick = function (e) {
            e.preventDefault();
            switchAuthTab("login");
            const u = document.getElementById("login-username");
            if (u) u.value = result.username;
        };
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    const result = login(username, password);
    if (!result.success) {
        errorEl.textContent = result.message;
        return;
    }

    errorEl.textContent = "";
    closeAuthModal();
    updateAuthUI();
    showToast("Xin chào, " + (result.user.fullname || result.user.username) + "!");
}

function handleRegister(event) {
    event.preventDefault();
    const fullname = document.getElementById("reg-fullname").value;
    const username = document.getElementById("reg-username").value;
    const phone = document.getElementById("reg-phone").value;
    const password = document.getElementById("reg-password").value;
    const password2 = document.getElementById("reg-password2").value;
    const errorEl = document.getElementById("register-error");

    if (password !== password2) {
        errorEl.textContent = "Mật khẩu nhập lại không khớp!";
        return;
    }

    const result = register(username, password, fullname, phone);
    if (!result.success) {
        errorEl.textContent = result.message;
        return;
    }

    errorEl.textContent = "";
    closeAuthModal();
    updateAuthUI();
    showToast("Đăng ký thành công! Xin chào " + fullname);
}

function handleLogout(event) {
    event.preventDefault();
    logout();
    updateAuthUI();
    showToast("Đã đăng xuất");
    document.getElementById("user-dropdown").classList.remove("show");
}

function goAdmin(event) {
    event.preventDefault();
    if (isAdmin()) {
        window.location.href = "admin.html";
    } else {
        showToast("Bạn không có quyền truy cập!");
    }
}

function toggleUserDropdown() {
    document.getElementById("user-dropdown").classList.toggle("show");
}

function updateAuthUI() {
    const user = getCurrentUser();
    const btnLogin = document.getElementById("btn-login");
    const userMenu = document.getElementById("user-menu");
    const displayName = document.getElementById("user-display-name");
    const adminLink = document.getElementById("admin-link-item");

    if (user) {
        btnLogin.style.display = "none";
        userMenu.style.display = "block";
        displayName.textContent = user.fullname || user.username;
        if (user.role === "admin") {
            adminLink.style.display = "block";
        } else {
            adminLink.style.display = "none";
        }
    } else {
        btnLogin.style.display = "flex";
        userMenu.style.display = "none";
    }
}

// Auto-fill checkout form nếu đã đăng nhập
function prefillCheckoutIfLoggedIn() {
    const user = getCurrentUser();
    if (!user) return;

    const fullnameInput = document.getElementById("fullname");
    const phoneInput = document.getElementById("phone");

    if (fullnameInput && !fullnameInput.value) {
        fullnameInput.value = user.fullname || "";
    }
    if (phoneInput && !phoneInput.value && user.phone) {
        phoneInput.value = user.phone;
    }
}

// Close auth modal when click outside
document.getElementById("auth-overlay")?.addEventListener("click", function (e) {
    if (e.target === this) closeAuthModal();
});

// Close dropdown when click outside
document.addEventListener("click", function (e) {
    const menu = document.getElementById("user-menu");
    const dropdown = document.getElementById("user-dropdown");
    if (menu && dropdown && !menu.contains(e.target)) {
        dropdown.classList.remove("show");
    }
});

// Hook openCheckout to prefill
const originalOpenCheckout = typeof openCheckout === "function" ? openCheckout : null;

// Initialize auth UI
updateAuthUI();


/* =========================
   REVIEWS
========================= */

const REVIEWS_KEY = "sweetCakeReviews";

const DEFAULT_REVIEWS = [
    {
        id: 1,
        name: "Hương Giang idol",
        rating: 5,
        content: "Bánh rất ngon, hình thức đẹp và đóng gói cẩn thận. Mình đặt bánh sinh nhật cho bạn và mọi người đều khen bánh mềm, thơm, vị ngọt vừa phải chứ không bị ngấy. Nhân viên tư vấn cũng rất nhiệt tình. Chắc chắn sẽ tiếp tục ủng hộ Sweet Cake!",
        date: "01/09/2026"
    },
    {
        id: 2,
        name: "Trịnh Trần Phương Huấn",
        rating: 5,
        content: "Đây là một trong những tiệm bánh mình yêu thích nhất. Bánh không chỉ đẹp mà hương vị cũng rất ổn, đặc biệt là bánh chocolate và bánh kem dâu. Đóng hộp sang trọng, thích hợp làm quà tặng.",
        date: "05/09/2026"
    },
    {
        id: 3,
        name: "Sơn Tường MVP",
        rating: 5,
        content: "Mình đã đặt bánh ở EAUT Cake vài lần và lần nào cũng hài lòng. Giao đúng mẫu, đúng thời gian. Tiệm chú ý từng chi tiết nhỏ và hỗ trợ khi có yêu cầu riêng. Rất đáng để thử!",
        date: "10/09/2026"
    }
];

function getReviews() {
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY));
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        reviews = DEFAULT_REVIEWS;
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    }
    return reviews;
}

function saveReviews(reviews) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

function starsHtml(rating) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
        s += i <= rating ? "★" : "☆";
    }
    return s;
}

function renderReviews() {
    const grid = document.getElementById("reviews-grid");
    if (!grid) return;

    const reviews = getReviews();
    // Mới nhất lên trước
    const sorted = [...reviews].reverse();

    grid.innerHTML = sorted.map(r => `
        <div class="review-card">
            <div class="stars">${starsHtml(r.rating)}</div>
            <p>“${escapeHtml(r.content)}”</p>
            <strong>${escapeHtml(r.name)}</strong>
            ${r.date ? `<span class="review-date">${escapeHtml(r.date)}</span>` : ""}
        </div>
    `).join("");
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function initStarPicker() {
    const picker = document.getElementById("star-picker");
    const ratingInput = document.getElementById("review-rating");
    if (!picker || !ratingInput) return;

    const buttons = picker.querySelectorAll(".star-btn");

    function highlight(n) {
        buttons.forEach(btn => {
            const s = parseInt(btn.dataset.star, 10);
            btn.classList.toggle("active", s <= n);
        });
    }

    highlight(5);

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const n = parseInt(btn.dataset.star, 10);
            ratingInput.value = n;
            highlight(n);
        });
        btn.addEventListener("mouseenter", () => {
            highlight(parseInt(btn.dataset.star, 10));
        });
    });

    picker.addEventListener("mouseleave", () => {
        highlight(parseInt(ratingInput.value, 10) || 5);
    });
}

function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById("review-name").value.trim();
    const content = document.getElementById("review-content").value.trim();
    const rating = parseInt(document.getElementById("review-rating").value, 10) || 5;
    const errorEl = document.getElementById("review-error");

    if (!name || !content) {
        errorEl.textContent = "Vui lòng nhập đầy đủ họ tên và nội dung!";
        return;
    }

    if (content.length < 10) {
        errorEl.textContent = "Nội dung đánh giá tối thiểu 10 ký tự!";
        return;
    }

    errorEl.textContent = "";

    const reviews = getReviews();
    reviews.push({
        id: Date.now(),
        name,
        rating,
        content,
        date: new Date().toLocaleDateString("vi-VN")
    });
    saveReviews(reviews);

    document.getElementById("review-form").reset();
    document.getElementById("review-rating").value = "5";
    initStarPicker();

    renderReviews();
    showToast("Cảm ơn bạn đã gửi đánh giá!");

    // Scroll tới review mới
    document.getElementById("reviews-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Prefill tên nếu đã đăng nhập
function prefillReviewName() {
    if (typeof getCurrentUser !== "function") return;
    const user = getCurrentUser();
    const nameInput = document.getElementById("review-name");
    if (user && nameInput && !nameInput.value) {
        nameInput.value = user.fullname || user.username || "";
    }
}

// Init reviews khi có section
if (document.getElementById("reviews-grid")) {
    renderReviews();
    initStarPicker();
    prefillReviewName();
}


/* =========================
   INIT STOCK DISPLAY
========================= */

document.addEventListener("DOMContentLoaded", function () {
    // Đảm bảo có dữ liệu sản phẩm trong localStorage
    getProducts();
    renderProductStock();
});

// Cập nhật khi quay lại tab (admin có thể đã sửa tồn kho)
window.addEventListener("focus", function () {
    renderProductStock();
});

window.addEventListener("storage", function (e) {
    if (e.key === PRODUCTS_KEY) {
        renderProductStock();
    }
});

/* =========================
   PRODUCT DETAIL MODAL
========================= */

const PRODUCT_DETAILS = {
    "Bánh Kem Chocolate": {
        type: "BÁNH KEM",
        desc: "Bánh kem chocolate đậm đà với lớp gato mềm ẩm, phủ kem chocolate mịn và trang trí socola chảy. Phù hợp cho sinh nhật và các dịp đặc biệt.",
        ingredients: ["Bột mì số 8", "Trứng gà tươi", "Đường cát", "Bơ lạt", "Bột cacao nguyên chất", "Kem tươi whipping", "Socola đen 70%", "Sữa tươi không đường"]
    },
    "Bánh Kem Paris": {
        type: "BÁNH KEM",
        desc: "Bánh kem Caramel kết hợp hương vị caramel ngọt ngào với nhân nho khô và lớp gato vanilla mềm mịn. Vẻ ngoài tinh tế mang phong cách Paris.",
        ingredients: ["Gato vanilla", "Kem caramel", "Nho khô ngâm rum", "Bơ lạt", "Đường nâu", "Kem tươi", "Muối biển", "Vanilla extract"]
    },
    "Bánh Kem Dâu Tây": {
        type: "BÁNH KEM",
        desc: "Vị dâu tây tươi hòa quyện cùng kem sữa mềm mịn. Lớp bánh bông lan nhẹ, phủ kem và trang trí dâu tây tươi bắt mắt.",
        ingredients: ["Bột mì", "Trứng gà", "Đường", "Dâu tây tươi", "Kem tươi whipping", "Sữa đặc", "Bơ", "Mứt dâu"]
    },
    "Cupcake Vani": {
        type: "CUPCAKE",
        desc: "Cupcake nhỏ xinh với lớp kem vani thơm nhẹ, vị ngọt thanh, thích hợp làm món tráng miệng hoặc quà tặng.",
        ingredients: ["Bột mì đa dụng", "Trứng", "Đường bột", "Bơ lạt", "Sữa tươi", "Vanilla extract", "Kem whipping", "Muối"]
    },
    "Cupcake Socola": {
        type: "CUPCAKE",
        desc: "Cupcake socola đậm vị với lớp kem socola mềm, phù hợp người yêu thích hương vị cacao.",
        ingredients: ["Bột mì", "Bột cacao", "Trứng", "Đường", "Bơ", "Sữa tươi", "Kem socola", "Socola chip"]
    },
    "Cupcake Dâu Tây": {
        type: "CUPCAKE",
        desc: "Cupcake vị dâu tây dịu nhẹ, kem hồng bắt mắt, thơm mùi trái cây tự nhiên.",
        ingredients: ["Bột mì", "Trứng", "Đường", "Bơ", "Puree dâu tây", "Kem whipping", "Màu thực phẩm tự nhiên", "Dâu tươi trang trí"]
    },
    "Bánh Tart Trứng": {
        type: "DESSERT",
        desc: "Bánh tart trứng kiểu Hồng Kông với lớp vỏ giòn tan và nhân trứng sữa béo mịn, thơm ngậy.",
        ingredients: ["Bột mì", "Bơ lạt", "Đường bột", "Trứng gà", "Sữa tươi", "Sữa đặc", "Vanilla", "Muối"]
    },
    "Donut Chocolate": {
        type: "DESSERT",
        desc: "Donut mềm xốp phủ lớp socola bóng mịn, thêm topping hạt và socola chip.",
        ingredients: ["Bột mì", "Men nở", "Sữa tươi", "Trứng", "Đường", "Bơ", "Socola phủ", "Hạt trang trí"]
    },
    "Bánh Giáng Sinh": {
        type: "BÁNH KEM",
        desc: "Bánh khúc cây Giáng sinh truyền thống, lớp gato chocolate cuộn kem, trang trí theo chủ đề Noel.",
        ingredients: ["Gato chocolate", "Kem tươi", "Bột cacao", "Đường", "Trứng", "Bơ", "Chocolate ganache", "Phụ kiện trang trí Noel"]
    },
    "Bánh Sinh Nhật Vanilla": {
        type: "BÁNH KEM",
        desc: "Bánh sinh nhật vanilla nhẹ nhàng, kem trắng mịn, dễ trang trí theo yêu cầu cho ngày đặc biệt.",
        ingredients: ["Bột mì", "Trứng", "Đường", "Bơ lạt", "Sữa tươi", "Vanilla extract", "Kem whipping", "Đường bột"]
    },
    "Bánh Sinh Nhật Matcha": {
        type: "BÁNH KEM",
        desc: "Bánh sinh nhật matcha thanh mát, kết hợp kem sữa và bột trà xanh Nhật Bản cao cấp.",
        ingredients: ["Bột mì", "Bột matcha Nhật", "Trứng", "Đường", "Bơ", "Kem tươi", "Sữa tươi", "White chocolate"]
    },
    "Bánh Pháp Petit Four": {
        type: "DESSERT",
        desc: "Petit four kiểu Pháp – những chiếc bánh nhỏ tinh tế, nhiều lớp và hương vị đa dạng trong từng miếng.",
        ingredients: ["Bột hạnh nhân", "Trứng", "Đường", "Bơ", "Mứt trái cây", "Chocolate", "Fondant", "Vanilla"]
    },
    "Donut Kem Trứng": {
        type: "DESSERT",
        desc: "Donut nhân kem trứng béo mịn, lớp vỏ mềm, phủ đường bột hoặc glaze nhẹ.",
        ingredients: ["Bột mì", "Men", "Sữa", "Trứng", "Đường", "Bơ", "Kem trứng custard", "Đường bột"]
    },
    "Donut Dâu Tây": {
        type: "DESSERT",
        desc: "Donut vị dâu tây với lớp glaze hồng và topping dâu, ngọt dịu dễ ăn.",
        ingredients: ["Bột mì", "Men nở", "Sữa tươi", "Trứng", "Đường", "Bơ", "Puree dâu", "Glaze dâu"]
    },
    "Pancake": {
        type: "DESSERT",
        desc: "Pancake mềm xốp kiểu Mỹ, dùng kèm mật ong, bơ hoặc trái cây tươi.",
        ingredients: ["Bột mì", "Bột nở", "Trứng", "Sữa tươi", "Đường", "Bơ lạt", "Muối", "Vanilla"]
    },
    "Tiramisu Cổ Điển": {
        type: "TIRAMISU",
        desc: "Tiramisu cổ điển kiểu Ý với bánh ladyfinger thấm cà phê espresso, kem mascarpone và cacao.",
        ingredients: ["Bánh ladyfinger", "Mascarpone", "Trứng gà", "Đường", "Espresso", "Rượu Marsala (tùy chọn)", "Bột cacao", "Kem tươi"]
    },
    "Tiramisu Matcha": {
        type: "TIRAMISU",
        desc: "Biến tấu tiramisu với bột matcha, vị trà xanh thanh và kem mascarpone béo nhẹ.",
        ingredients: ["Bánh ladyfinger", "Mascarpone", "Bột matcha", "Trứng", "Đường", "Sữa tươi", "Kem tươi", "Bột matcha rắc mặt"]
    },
    "Tiramisu Chocolate": {
        type: "TIRAMISU",
        desc: "Tiramisu socola đậm đà, kết hợp cacao và kem mascarpone cho tín đồ chocolate.",
        ingredients: ["Bánh ladyfinger", "Mascarpone", "Bột cacao", "Socola đen", "Trứng", "Đường", "Espresso", "Kem tươi"]
    },
    "Set Quà Trung Thu": {
        type: "BÁNH TRUNG THU",
        desc: "Set quà trung thu cao cấp gồm nhiều loại bánh nướng và bánh dẻo, đóng hộp sang trọng làm quà tặng.",
        ingredients: ["Bánh nướng thập cẩm", "Bánh nướng đậu xanh", "Bánh dẻo", "Hạt sen", "Lạp xưởng", "Đường", "Bột bánh", "Hộp quà trang trí"]
    },
    "Bánh Nướng Đậu Xanh": {
        type: "BÁNH TRUNG THU",
        desc: "Bánh nướng nhân đậu xanh truyền thống, vỏ bánh thơm, nhân mịn ngọt vừa phải.",
        ingredients: ["Bột bánh nướng", "Đậu xanh không vỏ", "Đường", "Dầu ăn", "Trứng gà (quét mặt)", "Muối", "Mạch nha"]
    },
    "Bánh Nướng Cốm Dừa": {
        type: "BÁNH TRUNG THU",
        desc: "Bánh nướng nhân cốm dừa lạ miệng, kết hợp hương cốm non và dừa sợi.",
        ingredients: ["Bột bánh nướng", "Cốm tươi", "Dừa sợi", "Đường", "Dầu", "Trứng quét mặt", "Mạch nha"]
    },
    "Bánh Dẻo Cốm Dừa": {
        type: "BÁNH TRUNG THU",
        desc: "Bánh dẻo mềm với nhân cốm dừa, vị thanh mát, không nướng.",
        ingredients: ["Bột nếp", "Đường bột", "Cốm", "Dừa nạo", "Dầu đậu nành", "Nước lọc", "Muối"]
    },
    "Bánh Nướng Thập Cẩm": {
        type: "BÁNH TRUNG THU",
        desc: "Bánh nướng thập cẩm đủ vị: hạt sen, lạp xưởng, trứng muối, mứt bí – hương vị trung thu kinh điển.",
        ingredients: ["Bột bánh nướng", "Hạt sen", "Lạp xưởng", "Trứng muối", "Mứt bí", "Hạt điều", "Đường", "Dầu ăn"]
    },
    "Bánh Dẻo Đậu Xanh": {
        type: "BÁNH TRUNG THU",
        desc: "Bánh dẻo nhân đậu xanh mịn, vỏ bánh dẻo trong, ngọt nhẹ dễ ăn.",
        ingredients: ["Bột nếp", "Đậu xanh không vỏ", "Đường", "Dầu", "Nước hoa bưởi (tùy chọn)", "Muối"]
    }
};

function openProductDetail(name) {
    const detail = PRODUCT_DETAILS[name];
    if (!detail) {
        showToast("Chưa có thông tin chi tiết cho sản phẩm này");
        return;
    }

    // Tìm card để lấy ảnh, giá, tag
    const cards = document.querySelectorAll(".product-card");
    let imgSrc = "", priceText = "", tagText = "";
    cards.forEach(card => {
        const h3 = card.querySelector("h3");
        if (h3 && h3.textContent.trim() === name) {
            const img = card.querySelector(".product-image img");
            const priceEl = card.querySelector(".product-bottom strong");
            const tagEl = card.querySelector(".product-tag");
            if (img) imgSrc = img.getAttribute("src") || "";
            if (priceEl) priceText = priceEl.textContent.trim();
            if (tagEl) tagText = tagEl.textContent.trim();
        }
    });

    document.getElementById("pd-image").src = imgSrc;
    document.getElementById("pd-image").alt = name;
    document.getElementById("pd-name").textContent = name;
    document.getElementById("pd-type").textContent = detail.type;
    document.getElementById("pd-price").textContent = priceText;
    document.getElementById("pd-desc").textContent = detail.desc;

    const tagEl = document.getElementById("pd-tag");
    if (tagText) {
        tagEl.style.display = "inline-block";
        tagEl.textContent = tagText;
    } else {
        tagEl.style.display = "none";
    }

    // Tồn kho
    const stock = typeof getAvailableStock === "function" ? getAvailableStock(name) : null;
    const stockEl = document.getElementById("pd-stock");
    if (stock !== null && stock !== undefined) {
        stockEl.textContent = stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng";
        stockEl.style.color = stock > 0 ? "#6b8f71" : "#c45c7a";
    } else {
        stockEl.textContent = "";
    }

    // Thành phần
    const ul = document.getElementById("pd-ingredients");
    ul.innerHTML = "";
    detail.ingredients.forEach(ing => {
        const li = document.createElement("li");
        li.textContent = ing;
        ul.appendChild(li);
    });

    // Nút thêm giỏ
    const addBtn = document.getElementById("pd-add-btn");
    // Lấy giá số từ addToCart trên card
    let priceNum = 0;
    cards.forEach(card => {
        const h3 = card.querySelector("h3");
        if (h3 && h3.textContent.trim() === name) {
            const btn = card.querySelector(".add-btn");
            if (btn) {
                const m = (btn.getAttribute("onclick") || "").match(/addToCart\('([^']+)',\s*(\d+)\)/);
                if (m) priceNum = parseInt(m[2], 10);
            }
        }
    });
    addBtn.onclick = function () {
        addToCart(name, priceNum);
        closeProductDetail();
    };

    const overlay = document.getElementById("product-detail-overlay");
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeProductDetail() {
    const overlay = document.getElementById("product-detail-overlay");
    if (overlay) {
        overlay.style.display = "none";
        document.body.style.overflow = "";
    }
}

// Gắn click vào product-card (trừ nút Thêm)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", function (e) {
            // Không mở detail khi bấm nút Thêm
            if (e.target.closest(".add-btn")) return;
            const h3 = card.querySelector("h3");
            if (h3) openProductDetail(h3.textContent.trim());
        });
    });
});

// Đóng bằng phím Esc
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeProductDetail();
});
