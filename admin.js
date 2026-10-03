// ======================================
// DỮ LIỆU SẢN PHẨM
// ======================================

let products = JSON.parse(
    localStorage.getItem("sweetCakeProducts")
) || [

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

// Đồng bộ tên cũ trong localStorage (nếu user đã mở admin trước)
(function migrateProductNames() {
    const nameMap = {
        "Bánh Kem Chocolates": "Bánh Kem Chocolate",
        "Bánh Donut Chocolate": "Donut Chocolate",
        "Bánh sinh nhật Vanilla": "Bánh Sinh Nhật Vanilla",
        "Bánh sinh nhật Matcha": "Bánh Sinh Nhật Matcha",
        "Bánh Petit Four": "Bánh Pháp Petit Four",
        "Donut kem trứng": "Donut Kem Trứng"
    };
    let changed = false;
    products.forEach(p => {
        if (nameMap[p.name]) {
            p.name = nameMap[p.name];
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem("sweetCakeProducts", JSON.stringify(products));
    }
})();


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



// ======================================
// BIỂU ĐỒ CỘT DOANH THU
// ======================================

function getOrderDate(order) {
    if (order.createdAt) {
        const d = new Date(order.createdAt);
        if (!isNaN(d.getTime())) return d;
    }
    if (order.date) {
        // "dd/mm/yyyy, hh:mm:ss" (vi-VN)
        const part = String(order.date).split(",")[0].trim();
        const m = part.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (m) {
            const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
            if (!isNaN(d.getTime())) return d;
        }
    }
    return null;
}

function getFilteredOrders() {
    const fromEl = document.getElementById("revenue-from");
    const toEl = document.getElementById("revenue-to");
    const fromVal = fromEl && fromEl.value ? fromEl.value : "";
    const toVal = toEl && toEl.value ? toEl.value : "";

    let fromTime = null;
    let toTime = null;
    if (fromVal) {
        fromTime = new Date(fromVal + "T00:00:00").getTime();
    }
    if (toVal) {
        toTime = new Date(toVal + "T23:59:59").getTime();
    }

    if (fromTime === null && toTime === null) return orders;

    return orders.filter(order => {
        const d = getOrderDate(order);
        if (!d) return false;
        const t = d.getTime();
        if (fromTime !== null && t < fromTime) return false;
        if (toTime !== null && t > toTime) return false;
        return true;
    });
}

function groupRevenueByDate(orderList) {
    const list = orderList || orders;
    const map = {};
    // Use sortable key YYYY-MM-DD internally
    const sortedKeys = [];
    list.forEach(order => {
        const d = getOrderDate(order);
        let sortKey = "9999-99-99";
        let label = "Không rõ";
        if (d) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            sortKey = y + "-" + m + "-" + day;
            label = d.toLocaleDateString("vi-VN");
        }
        if (!map[sortKey]) {
            map[sortKey] = { label: label, total: 0 };
            sortedKeys.push(sortKey);
        }
        map[sortKey].total += Number(order.total) || 0;
    });
    sortedKeys.sort();
    return sortedKeys.map(k => [map[k].label, map[k].total]);
}

function groupRevenueByStatus(orderList) {
    const list = orderList || orders;
    const map = {};
    list.forEach(order => {
        const st = order.status || "Chờ xử lý";
        if (!map[st]) map[st] = 0;
        map[st] += Number(order.total) || 0;
    });
    return Object.entries(map);
}



function renderBarChart(containerId, entries, emptyText) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!entries.length) {
        el.innerHTML = `<div style="padding:40px;text-align:center;color:#8a6a74;width:100%;">${emptyText || "Chưa có dữ liệu"}</div>`;
        return;
    }

    const maxVal = Math.max(...entries.map(e => e[1]), 1);

    el.innerHTML = entries.map(([label, value]) => {
        const pct = Math.max(4, Math.round((value / maxVal) * 100));
        const shortLabel = label.length > 12 ? label.slice(0, 10) + "…" : label;
        const valueLabel = value >= 1000000
            ? (value / 1000000).toFixed(1) + "tr"
            : value >= 1000
                ? Math.round(value / 1000) + "k"
                : String(value);
        return `
            <div class="bar-col" title="${label}: ${formatMoney(value)}">
                <div class="bar-value">${valueLabel}</div>
                <div class="bar-fill" style="height:${pct}%"></div>
                <div class="bar-label">${shortLabel}</div>
            </div>`;
    }).join("");
}

function renderRevenueCharts() {
    const filtered = getFilteredOrders();
    const byDate = groupRevenueByDate(filtered);
    // Giữ tối đa 31 cột khi lọc theo tháng, mặc định 14
    const dateEntries = byDate.length > 31 ? byDate.slice(-31) : byDate;
    renderBarChart("revenue-bar-chart", dateEntries, "Không có đơn trong khoảng ngày đã chọn");

    const legend = document.getElementById("revenue-chart-legend");
    if (legend) {
        legend.textContent = dateEntries.length
            ? `Hiển thị ${dateEntries.length} mốc thời gian · Di chuột vào cột để xem chi tiết`
            : "";
    }

    // Tổng trong khoảng lọc
    const sumEl = document.getElementById("revenue-filter-summary");
    if (sumEl) {
        const total = filtered.reduce((s, o) => s + (Number(o.total) || 0), 0);
        const fromEl = document.getElementById("revenue-from");
        const toEl = document.getElementById("revenue-to");
        const hasFilter = (fromEl && fromEl.value) || (toEl && toEl.value);
        if (hasFilter) {
            sumEl.textContent = `Khoảng đã lọc: ${filtered.length} đơn · Doanh thu: ${formatMoney(total)}`;
        } else {
            sumEl.textContent = filtered.length
                ? `Tất cả: ${filtered.length} đơn · Doanh thu: ${formatMoney(total)}`
                : "";
        }
    }

    const byStatus = groupRevenueByStatus(filtered);
    renderBarChart("status-bar-chart", byStatus, "Không có đơn trong khoảng ngày đã chọn");
}

function applyRevenueFilter() {
    renderRevenueCharts();
}

function resetRevenueFilter() {
    const fromEl = document.getElementById("revenue-from");
    const toEl = document.getElementById("revenue-to");
    if (fromEl) fromEl.value = "";
    if (toEl) toEl.value = "";
    renderRevenueCharts();
}


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

    renderRevenueCharts();

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
