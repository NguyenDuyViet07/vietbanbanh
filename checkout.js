/* =========================
   CHECKOUT PAGE LOGIC
========================= */

function formatMoneyCheckout(number) {
    return number.toLocaleString("vi-VN") + "đ";
}

function getCart() {
    return JSON.parse(localStorage.getItem("sweetCakeCart") || "[]");
}

function clearCart() {
    localStorage.setItem("sweetCakeCart", "[]");
    if (typeof cart !== "undefined") {
        cart = [];
    }
}

function renderCheckoutProducts() {
    const productsEl = document.getElementById("checkout-products");
    const totalEl = document.getElementById("checkout-total");
    const subtotalEl = document.getElementById("summary-subtotal");
    const formSection = document.querySelector(".checkout-form-section");
    const cartData = getCart();

    if (!productsEl) return;

    if (cartData.length === 0) {
        productsEl.innerHTML = `
            <div class="empty-checkout">
                <div class="empty-icon">🛒</div>
                <h3>Giỏ hàng trống</h3>
                <p>Hãy chọn bánh bạn yêu thích trước khi thanh toán.</p>
                <a href="index.html#products">Khám phá bánh</a>
            </div>
        `;
        if (totalEl) totalEl.textContent = "0đ";
        if (subtotalEl) subtotalEl.textContent = "0đ";
        if (formSection) {
            formSection.style.opacity = "0.5";
            formSection.style.pointerEvents = "none";
        }
        return;
    }

    let total = 0;
    productsEl.innerHTML = "";

    cartData.forEach(product => {
        const productTotal = product.price * product.quantity;
        total += productTotal;

        productsEl.innerHTML += `
            <div class="checkout-product">
                <div>
                    <div class="prod-name">${product.name}</div>
                    <div class="prod-qty">× ${product.quantity}</div>
                </div>
                <strong>${formatMoneyCheckout(productTotal)}</strong>
            </div>
        `;
    });

    if (totalEl) totalEl.textContent = formatMoneyCheckout(total);
    if (subtotalEl) subtotalEl.textContent = formatMoneyCheckout(total);
}

function prefillUserInfo() {
    if (typeof getCurrentUser !== "function") return;
    const user = getCurrentUser();
    if (!user) return;

    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");

    if (fullname && !fullname.value) {
        fullname.value = user.fullname || "";
    }
    if (phone && !phone.value && user.phone) {
        phone.value = user.phone;
    }
}

function initPaymentToggle() {
    const paymentSelect = document.getElementById("payment");
    const bankInfo = document.getElementById("bank-info");

    if (!paymentSelect || !bankInfo) return;

    paymentSelect.addEventListener("change", function () {
        if (this.value === "bank") {
            bankInfo.classList.add("show");
        } else {
            bankInfo.classList.remove("show");
        }
    });
}

function initCheckoutForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const cartData = getCart();
        const errorEl = document.getElementById("checkout-error");
        const submitBtn = document.getElementById("submit-btn");

        if (cartData.length === 0) {
            errorEl.textContent = "Giỏ hàng đang trống!";
            return;
        }

        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const payment = document.getElementById("payment").value;

        if (!fullname || !phone || !address || !payment) {
            errorEl.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        if (phone.length < 9) {
            errorEl.textContent = "Số điện thoại không hợp lệ!";
            return;
        }

        errorEl.textContent = "";

        const paymentName =
            payment === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Chuyển khoản ngân hàng";

        let total = 0;
        cartData.forEach(p => {
            total += p.price * p.quantity;
        });

        const order = {
            id: "DH" + Date.now(),
            customer: {
                name: fullname,
                phone: phone,
                address: address
            },
            items: cartData.map(p => ({
                name: p.name,
                price: p.price,
                quantity: p.quantity
            })),
            total: total,
            payment: paymentName,
            status: "Chờ xử lý",
            date: new Date().toLocaleString("vi-VN")
        };

        let orders =
            JSON.parse(localStorage.getItem("sweetCakeOrders") || "[]");
        orders.push(order);
        localStorage.setItem("sweetCakeOrders", JSON.stringify(orders));

        clearCart();

        // Hiện thông báo thành công
        const msg = document.getElementById("success-message");
        msg.textContent =
            `Mã đơn: ${order.id}\n` +
            `Khách hàng: ${fullname}\n` +
            `SĐT: ${phone}\n` +
            `Địa chỉ: ${address}\n` +
            `Thanh toán: ${paymentName}\n` +
            `Tổng tiền: ${formatMoneyCheckout(total)}\n\n` +
            `Cảm ơn bạn đã mua hàng tại EAUT Cake ❤️`;

        document.getElementById("success-overlay").classList.add("show");

        if (submitBtn) submitBtn.disabled = true;
    });
}

// Khởi động
document.addEventListener("DOMContentLoaded", function () {
    renderCheckoutProducts();
    prefillUserInfo();
    initPaymentToggle();
    initCheckoutForm();
});
