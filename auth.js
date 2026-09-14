/* =========================
   AUTH SYSTEM (localStorage)
========================= */

const USERS_KEY = "sweetCakeUsers";
const CURRENT_USER_KEY = "sweetCakeCurrentUser";

// Tài khoản admin mặc định
const DEFAULT_ADMIN = {
    id: 1,
    username: "admin",
    password: "admin123",
    fullname: "Quản trị viên",
    phone: "0900000000",
    role: "admin"
};

function getUsers() {
    let users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!users || !Array.isArray(users) || users.length === 0) {
        users = [DEFAULT_ADMIN];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    // Đảm bảo admin luôn tồn tại
    if (!users.find(u => u.username === "admin" && u.role === "admin")) {
        users.unshift(DEFAULT_ADMIN);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    if (user) {
        // Không lưu password vào session
        const { password, ...safeUser } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

function register(username, password, fullname, phone) {
    const users = getUsers();
    username = username.trim().toLowerCase();

    if (!username || !password || !fullname) {
        return { success: false, message: "Vui lòng điền đầy đủ thông tin!" };
    }
    if (username.length < 3) {
        return { success: false, message: "Tên đăng nhập tối thiểu 3 ký tự!" };
    }
    if (password.length < 4) {
        return { success: false, message: "Mật khẩu tối thiểu 4 ký tự!" };
    }
    if (users.find(u => u.username === username)) {
        return { success: false, message: "Tên đăng nhập đã tồn tại!" };
    }

    const newUser = {
        id: Date.now(),
        username,
        password,
        fullname: fullname.trim(),
        phone: (phone || "").trim(),
        role: "user"
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    return { success: true, message: "Đăng ký thành công!", user: newUser };
}

function login(username, password) {
    const users = getUsers();
    username = username.trim().toLowerCase();

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
    }

    setCurrentUser(user);
    return { success: true, message: "Đăng nhập thành công!", user };
}

function logout() {
    setCurrentUser(null);
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

function isLoggedIn() {
    return !!getCurrentUser();
}

// Khởi tạo users khi load
getUsers();
