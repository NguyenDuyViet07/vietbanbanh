// ======================================
// DỮ LIỆU SẢN PHẨM
// ======================================

let products = JSON.parse(
    localStorage.getItem("sweetCakeProducts")
) || [

    {
        id: 1,
        name: "Bánh Kem Chocolates",
        price: 250000,
        stock: 20
    },

    {
        id: 2,
        name: "Bánh Kem Paris",
        price: 350000,
        stock: 20
    },

    {
        id: 3,
        name: "Bánh Kem Dâu Tây",
        price: 280000,
        stock: 20
    },

    {
        id: 4,
        name: "Cupcake Vani",
        price: 45000,
        stock: 30
    },

    {
        id: 5,
        name: "Cupcake Socola",
        price: 45000,
        stock: 30
    },

    {
        id: 6,
        name: "Cupcake Dâu Tây",
        price: 45000,
        stock: 30
    },

    {
        id: 7,
        name: "Bánh Tart Trứng",
        price: 35000,
        stock: 30
    },

    {
        id: 8,
        name: "Bánh Donut Chocolate",
        price: 35000,
        stock: 30
    },

    {
        id: 9,
        name: "Bánh Giáng Sinh",
        price: 320000,
        stock: 20
    },

    {
        id: 10,
        name: "Bánh sinh nhật Vanilla",
        price: 320000,
        stock: 20
    },

    {
        id: 11,
        name: "Bánh sinh nhật Matcha",
        price: 320000,
        stock: 20
    },

    {
        id: 12,
        name: "Bánh Petit Four",
        price: 35000,
        stock: 30
    },

    {
        id: 13,
        name: "Donut kem trứng",
        price: 25000,
        stock: 30
    },
    {
        id: 14,
        name: "Donut Dâu Tây",
        price: 65000,
        stock: 30
    },
    {
        id: 15,
        name: "Pancake",
        price: 50000,
        stock: 30
    }
];


// ======================================
// ĐƠN HÀNG
// ======================================

let orders = JSON.parse(
    localStorage.getItem("sweetCakeOrders")
) || [];


// ======================================
// LƯU DỮ LIỆU
// ======================================

function saveProducts() {

    localStorage.setItem(
        "sweetCakeProducts",
        JSON.stringify(products)
    );

}


// ======================================
// FORMAT TIỀN
// ======================================

function formatMoney(number) {

    return number.toLocaleString("vi-VN") + " ₫";

}


// ======================================
// HIỂN THỊ SẢN PHẨM
// ======================================

function renderProducts() {

    const table =
        document.getElementById("productTable");

    table.innerHTML = "";


    products.forEach(product => {

        let status = "";

        let statusClass = "";


        if (product.stock === 0) {

            status = "Hết hàng";

            statusClass = "out-stock";

        }

        else if (product.stock <= 5) {

            status = "Sắp hết";

            statusClass = "low-stock";

        }

        else {

            status = "Còn hàng";

            statusClass = "in-stock";

        }


        table.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>

                <td>
                    ${formatMoney(product.price)}
                </td>

                <td>

                    <div class="stock-controls">

                        <button
                            type="button"
                            onclick="changeStock(${product.id}, -1)"
                            title="Giảm 1"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            class="stock-input"
                            id="stock-input-${product.id}"
                            value="${product.stock}"
                            min="0"
                            step="1"
                            onchange="setStockInline(${product.id}, this.value)"
                            onkeydown="if(event.key==='Enter'){this.blur();}"
                        >

                        <button
                            type="button"
                            onclick="changeStock(${product.id}, 1)"
                            title="Tăng 1"
                        >
                            +
                        </button>

                    </div>

                </td>

                <td>

                    <span class="status ${statusClass}">
                        ${status}
                    </span>

                </td>

                <td>
                    <button
                        type="button"
                        class="save-stock-btn"
                        onclick="setStockInline(${product.id}, document.getElementById('stock-input-${product.id}').value)"
                    >
                        Lưu
                    </button>
                </td>

            </tr>

        `;

    });

}


// ======================================
// TĂNG / GIẢM TỒN KHO
// ======================================

function changeStock(id, amount) {

    const product =
        products.find(p => p.id === id);


    if (!product) return;


    product.stock += amount;


    if (product.stock < 0) {

        product.stock = 0;

    }


    saveProducts();

    renderProducts();

    updateDashboard();

}


// ======================================
// SỬA SỐ LƯỢNG NGAY TRÊN BẢNG (không popup)
// ======================================

function setStockInline(id, value) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    const number = parseInt(value, 10);

    if (isNaN(number) || number < 0) {
        // Khôi phục giá trị cũ trên input
        const input = document.getElementById("stock-input-" + id);
        if (input) input.value = product.stock;
        return;
    }

    product.stock = number;

    saveProducts();
    renderProducts();
    updateDashboard();
}


// ======================================
// HIỂN THỊ ĐƠN HÀNG
// ======================================

function renderOrders() {

    const table =
        document.getElementById("orderTable");


    table.innerHTML = "";


    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center">

                    Chưa có đơn hàng

                </td>

            </tr>

        `;

        return;

    }


    // Hiển thị đơn mới nhất trước
    const sorted = [...orders].reverse();

    sorted.forEach((order, idx) => {
        // Hỗ trợ cả cấu trúc cũ (products/fullname/createdAt) và mới (items/name/date)
        const items = order.items || order.products || [];
        const customerName =
            (order.customer && (order.customer.name || order.customer.fullname)) || "—";
        const customerPhone =
            (order.customer && order.customer.phone) || "";
        const date = order.date || order.createdAt || "—";
        const status = order.status || "Chờ xử lý";

        const productNames = items
            .map(item => `${item.name} x${item.quantity}`)
            .join(", ");

        // index trong mảng gốc để cập nhật status
        const realIndex = orders.indexOf(order);

        table.innerHTML += `

            <tr>

                <td>
                    #${order.id}
                </td>

                <td>
                    <strong>${customerName}</strong>
                    ${customerPhone ? `<br><small style="color:#888">${customerPhone}</small>` : ""}
                </td>

                <td>
                    ${productNames || "—"}
                </td>

                <td>
                    <strong>
                        ${formatMoney(order.total)}
                    </strong>
                </td>

                <td>
                    <select class="status-select" onchange="updateOrderStatus(${realIndex}, this.value)">
                        <option value="Chờ xử lý" ${status === "Chờ xử lý" ? "selected" : ""}>Chờ xử lý</option>
                        <option value="Đang giao" ${status === "Đang giao" ? "selected" : ""}>Đang giao</option>
                        <option value="Hoàn thành" ${status === "Hoàn thành" ? "selected" : ""}>Hoàn thành</option>
                        <option value="Đã hủy" ${status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
                    </select>
                </td>

                <td>
                    ${date}
                </td>

            </tr>

        `;

    });

}


function updateOrderStatus(index, newStatus) {
    if (index < 0 || index >= orders.length) return;
    orders[index].status = newStatus;
    localStorage.setItem("sweetCakeOrders", JSON.stringify(orders));
    updateDashboard();
}


// ======================================
// TÍNH DOANH THU
// ======================================

function calculateRevenue() {

    return orders.reduce(
        (total, order) =>
            total + Number(order.total),
        0
    );

}


// ======================================
// CẬP NHẬT DASHBOARD
// ======================================

function updateDashboard() {

    const revenue =
        calculateRevenue();


    const stock =
        products.reduce(
            (total, product) =>
                total + product.stock,
            0
        );


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatMoney(revenue);


    document.getElementById(
        "revenueLarge"
    ).textContent =
        formatMoney(revenue);


    document.getElementById(
        "totalOrders"
    ).textContent =
        orders.length;


    document.getElementById(
        "totalProducts"
    ).textContent =
        products.length;


    document.getElementById(
        "totalStock"
    ).textContent =
        stock;

}


// ======================================
// KHỞI ĐỘNG ADMIN
// ======================================

renderProducts();

renderOrders();

updateDashboard();

// ======================================
// AUTH HELPERS
// ======================================

function adminLogout() {
    logout();
    window.location.href = "index.html";
}

// Hiển thị tên admin
(function () {
    const user = getCurrentUser();
    const label = document.getElementById("admin-user-label");
    if (label && user) {
        label.textContent = "👤 " + (user.fullname || user.username);
    }
})();
