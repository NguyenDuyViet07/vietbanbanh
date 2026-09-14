/* =========================
   CART DATA (persist localStorage)
========================= */

const CART_KEY = "sweetCakeCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

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

    cart[index].quantity++;

    updateCart();
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
}


/* =========================
   REMOVE PRODUCT
========================= */

function removeProduct(index) {

    if (!cart[index]) return;

    const removedName = cart[index].name;

    cart.splice(index, 1);

    updateCart();

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
    // Giữ lại để tương thích (không dùng modal nữa)
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
    document.getElementById("login-error").textContent = "";
    document.getElementById("register-error").textContent = "";
}

function closeAuthModal() {
    document.getElementById("auth-overlay").classList.remove("show");
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    if (tab === "login") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        tabLogin.classList.remove("active");
        tabRegister.classList.add("active");
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
