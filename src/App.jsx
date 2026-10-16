import { useEffect, useState } from "react";
import "./App.css";

const initialUsers = [
  { id: 1, name: "Priya", email: "priya@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Alagammai", email: "alagammai@example.com", role: "User", status: "Active" },
  { id: 3, name: "Selva", email: "selva@example.com", role: "User", status: "Active" },
  { id: 4, name: "Viji", email: "viji@example.com", role: "User", status: "Active" },
  { id: 5, name: "Senthil", email: "senthil@example.com", role: "User", status: "Inactive" },
  { id: 6, name: "Harshan", email: "harshan@example.com", role: "User", status: "Active" },
];

function getSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("authUser") ? "dashboard" : "login"
  );

  const [user, setUser] = useState(() =>
    getSaved("authUser", null)
  );

  const [users, setUsers] = useState(() =>
    getSaved("accessUsers", initialUsers)
  );

  const [activePage, setActivePage] = useState("Overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [changedPassword, setChangedPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("accessUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  
  const handleLogin = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setToast("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setToast("Please enter a valid email ID.");
      return;
    }

    const existingUser = users.find(
      (item) => item.email.toLowerCase() === cleanEmail
    );

    const loggedInUser = {
      name: existingUser
        ? existingUser.name
        : cleanEmail.split("@")[0],
      email: cleanEmail,
    };

    setUser(loggedInUser);
    localStorage.setItem("authUser", JSON.stringify(loggedInUser));

    if (remember) {
      localStorage.setItem("rememberEmail", cleanEmail);
    }

    setPassword("");
    setScreen("dashboard");
    setActivePage("Overview");
    setToast("Login successful!");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const cleanEmail = newEmail.trim().toLowerCase();

    if (!name.trim() || !cleanEmail || !newPassword) {
      setToast("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setToast("Enter a valid email ID.");
      return;
    }

    if (newPassword.length < 8) {
      setToast("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast("Passwords do not match.");
      return;
    }

    if (users.some((item) => item.email.toLowerCase() === cleanEmail)) {
      setToast("This email already exists. Please log in.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role: "User",
      status: "Active",
    };

    setUsers((previous) => [...previous, newUser]);

    const loggedInUser = {
      name: newUser.name,
      email: newUser.email,
    };

    setUser(loggedInUser);
    localStorage.setItem("authUser", JSON.stringify(loggedInUser));

    setName("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setScreen("dashboard");
    setActivePage("Overview");
    setToast("Account created successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    setEmail("");
    setPassword("");
    setScreen("login");
    setActivePage("Overview");
    setToast("Logged out successfully.");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!currentPassword || !changedPassword) {
      setToast("Please complete all password fields.");
      return;
    }

    if (currentPassword !== password) {
      setToast(
        "Demo mode: enter your current session password."
      );
      return;
    }

    if (changedPassword.length < 8) {
      setToast("New password must have at least 8 characters.");
      return;
    }

    setPassword(changedPassword);
    setCurrentPassword("");
    setChangedPassword("");
    setToast("Password updated for this session.");
  };

  const openAddUser = () => {
    setEditUser(null);
    setName("");
    setNewEmail("");
    setModal(true);
  };

  const openEditUser = (item) => {
    setEditUser(item);
    setName(item.name);
    setNewEmail(item.email);
    setModal(true);
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (!name.trim() || !newEmail.trim()) {
      setToast("Please enter a name and email.");
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setToast("Enter a valid email ID.");
      return;
    }

    const duplicate = users.some(
      (item) =>
        item.email.toLowerCase() === cleanEmail &&
        item.id !== editUser?.id
    );

    if (duplicate) {
      setToast("This email is already in use.");
      return;
    }

    if (editUser) {
      setUsers((previous) =>
        previous.map((item) =>
          item.id === editUser.id
            ? { ...item, name: name.trim(), email: cleanEmail }
            : item
        )
      );

      if (user?.email === editUser.email) {
        const updatedUser = {
          ...user,
          name: name.trim(),
          email: cleanEmail,
        };

        setUser(updatedUser);
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
      }

      setToast("User updated successfully.");
    } else {
      setUsers((previous) => [
        ...previous,
        {
          id: Date.now(),
          name: name.trim(),
          email: cleanEmail,
          role: "User",
          status: "Active",
        },
      ]);

      setToast("User added successfully.");
    }

    setModal(false);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setUsers((previous) => previous.filter((item) => item.id !== id));
    setToast("User deleted successfully.");
  };

  const filteredUsers = users.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query)
    );
  });

  const navItems = [
    { name: "Overview", icon: "▦" },
    { name: "Users", icon: "♙" },
    { name: "My Profile", icon: "◉" },
    { name: "Change Password", icon: "⌑" },
  ];

  if (screen === "login") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand-icon">A</div>
          <h1>Welcome Back!</h1>
          <p className="subtitle">
            Sign in to your Authentication Dashboard
          </p>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="show-button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="form-row">
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-button"
                onClick={() => setScreen("forgot")}
              >
                Forgot password?
              </button>
            </div>

            <button className="primary-button" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button
              className="text-button"
              onClick={() => setScreen("register")}
            >
              Create Account
            </button>
          </p>

          
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  if (screen === "register") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand-icon">A</div>
          <h1>Create Account</h1>
          <p className="subtitle">Create your account to get started</p>

          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />

            <button className="primary-button" type="submit">
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <button
              className="text-button"
              onClick={() => setScreen("login")}
            >
              Login
            </button>
          </p>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  if (screen === "forgot") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand-icon">A</div>
          <h1>Forgot Password?</h1>
          <p className="subtitle">
            This is a demo page. You can return to login and use any
            testing password.
          </p>

          <button
            className="primary-button"
            onClick={() => setScreen("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon small">A</span>
          <span>AccessPanel</span>
        </div>

        <p className="nav-heading">MAIN MENU</p>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="mini-details">
              <strong>{user?.name || "User"}</strong>
              <span>Demo Account</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{activePage}</h2>
            <p>Manage your account and access settings</p>
          </div>

          <div className="topbar-user">
            <div className="avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {activePage === "Overview" && (
          <>
            <section className="welcome-banner">
              <div>
                <p className="eyebrow">YOUR WORKSPACE</p>
                <h1>Welcome, {user?.name || "User"}! 👋</h1>
                <p>
                  Your account dashboard is ready. Manage your users
                  and account settings here.
                </p>
              </div>
              <div className="welcome-symbol">✦</div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">♙</div>
                <p>Total Users</p>
                <h2>{users.length}</h2>
                <span>Registered users</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <p>Active Users</p>
                <h2>
                  {users.filter((item) => item.status === "Active").length}
                </h2>
                <span>Currently active</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">◉</div>
                <p>Inactive Users</p>
                <h2>
                  {users.filter((item) => item.status === "Inactive").length}
                </h2>
                <span>Currently inactive</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">♧</div>
                <p>Your Account</p>
                <h2>Active</h2>
                <span>Demo login session</span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Users</h3>
                  <p>Users available in your dashboard</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setActivePage("Users")}
                >
                  View All
                </button>
              </div>

              <UserTable
                users={filteredUsers.slice(0, 5)}
                onEdit={openEditUser}
                onDelete={deleteUser}
              />
            </section>
          </>
        )}

        {activePage === "Users" && (
          <section className="panel">
            <div className="panel-header users-header">
              <div>
                <h3>User Management</h3>
                <p>Add, search, edit, and delete users</p>
              </div>

              <button className="primary-button compact" onClick={openAddUser}>
                + Add User
              </button>
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or role..."
            />

            <UserTable
              users={filteredUsers}
              onEdit={openEditUser}
              onDelete={deleteUser}
            />
          </section>
        )}

        {activePage === "My Profile" && (
          <section className="panel profile-panel">
            <div className="profile-heading">
              <div className="profile-avatar">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.name || "User"}</h3>
                <p>{user?.email}</p>
                <span className="status-badge">Active Account</span>
              </div>
            </div>

            <div className="profile-info">
              <div>
                <label>Full Name</label>
                <p>{user?.name}</p>
              </div>
              <div>
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
              <div>
                <label>Account Type</label>
                <p>Demo User</p>
              </div>
              <div>
                <label>Account Status</label>
                <p>Active</p>
              </div>
            </div>
          </section>
        )}

        {activePage === "Change Password" && (
          <section className="panel password-panel">
            <h3>Change Password</h3>
            <p className="panel-description">
              Update the password used during this demo session.
            </p>

            <form onSubmit={handleChangePassword}>
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current session password"
                required
              />

              <label>New Password</label>
              <input
                type="password"
                value={changedPassword}
                onChange={(e) => setChangedPassword(e.target.value)}
                placeholder="Enter a new password"
                minLength={8}
                required
              />

              <button className="primary-button" type="submit">
                Update Password
              </button>
            </form>

            <div className="demo-note">
              This is a frontend demo. Password changes are not stored
              securely and do not create a real authentication system.
            </div>
          </section>
        )}

        <footer className="footer">
          Authentication & User Access Dashboard · Demo Project
        </footer>
      </main>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>{editUser ? "Edit User" : "Add New User"}</h3>
                <p>Enter the user details below</p>
              </div>
              <button
                className="close-button"
                onClick={() => setModal(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveUser}>
              <label>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button compact">
                  {editUser ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function UserTable({ users, onEdit, onDelete }) {
  if (!users.length) {
    return <div className="empty-state">No users found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>USER</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="table-user">
                  <div className="avatar">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <strong>{item.name}</strong>
                </div>
              </td>

              <td>{item.email}</td>
              <td>{item.role}</td>

              <td>
                <span
                  className={`status-badge ${
                    item.status === "Inactive" ? "inactive" : ""
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(item)}
                    title="Edit user"
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(item.id)}
                    title="Delete user"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}