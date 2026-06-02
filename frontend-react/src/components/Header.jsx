import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { getImageUrl } from "../services/api";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const userData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin_user");

    if (userData) {
      setUser(JSON.parse(userData));
    } else if (adminData) {
      const admin = JSON.parse(adminData);
      setUser({ ...admin, isAdmin: true });
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setUser(null);
      navigate("/");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Live Suggestions logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        try {
          const response = await api.getProducts(
            `?search=${searchTerm}&limit=5`,
          );
          setSuggestions(response.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Suggestions error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products/all?search=${searchTerm.trim()}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchTerm("");
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-light bg-white sticky-top ${scrolled ? "shadow py-2" : "shadow-sm py-3"}`}
        style={{ transition: "all 0.3s ease" }}
      >
        <div className="container">
          {/* Logo and Mobile-only Icons/Toggler Row */}
          <Link
            className="navbar-brand d-flex align-items-center p-0 m-0 order-1"
            to="/"
          >
            <img
              src="/logo-madhav.png"
              alt="The Madhav Logo"
              className="navbar-logo"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div
            className="d-none d-lg-block flex-grow-1 mx-4 position-relative order-2"
            style={{ maxWidth: "500px", minWidth: "300px" }}
          >
            <form onSubmit={handleSearch} className="position-relative">
              <input
                type="text"
                className="form-control px-4 rounded-pill border-2"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() =>
                  searchTerm.length >= 2 && setShowSuggestions(true)
                }
                style={{ height: "45px", borderColor: "#e0eee6" }}
              />
              <button
                type="submit"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent text-success"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            {/* Live Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="position-absolute w-100 bg-white shadow-lg rounded-4 mt-2 p-2 border animate__animated animate__fadeIn"
                style={{ zIndex: 1100 }}
              >
                {suggestions.map((p) => {
                  const lang = i18n.language || "en";
                  const pName =
                    p.name && typeof p.name === "object"
                      ? p.name[lang] || p.name.en || Object.values(p.name)[0]
                      : p.name || "";
                  return (
                    <div
                      key={p.id}
                      className="d-flex align-items-center p-2 rounded-3 hover-bg-light cursor-pointer"
                      onClick={() => handleSuggestionClick(p)}
                      style={{ borderBottom: "1px solid #f8f9fa" }}
                    >
                      <img
                        src={getImageUrl(p.image)}
                        width="40"
                        height="40"
                        className="rounded-2 me-3 object-fit-cover"
                        alt=""
                      />
                      <div>
                        <div className="fw-bold small text-dark">{pName}</div>
                        <div className="text-success small fw-bold">
                          ₹{p.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div
                  className="text-center p-2 small text-muted cursor-pointer hover-text-success"
                  onClick={handleSearch}
                >
                  View all results for "{searchTerm}"
                </div>
              </div>
            )}
            {showSuggestions && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 1050 }}
                onClick={() => setShowSuggestions(false)}
              ></div>
            )}
          </div>

          {/* Search Bar - Mobile (Always visible) */}
          <div className="d-lg-none w-100 mt-2 order-5 position-relative">
            <form onSubmit={handleSearch} className="position-relative">
              <input
                type="text"
                className="form-control px-4 rounded-pill border-2"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() =>
                  searchTerm.length >= 2 && setShowSuggestions(true)
                }
                style={{ height: "40px", borderColor: "#e0eee6" }}
              />
              <button
                type="submit"
                className="btn position-absolute top-50 end-0 translate-middle-y me-1 border-0 bg-transparent text-success"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            {/* Mobile Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="position-absolute w-100 bg-white shadow-lg rounded-4 mt-2 p-2 border animate__animated animate__fadeIn"
                style={{ zIndex: 1100 }}
              >
                {suggestions.map((p) => {
                  const lang = i18n.language || "en";
                  const pName =
                    p.name && typeof p.name === "object"
                      ? p.name[lang] || p.name.en || Object.values(p.name)[0]
                      : p.name || "";
                  return (
                    <div
                      key={p.id}
                      className="d-flex align-items-center p-2 rounded-3 hover-bg-light cursor-pointer"
                      onClick={() => handleSuggestionClick(p)}
                      style={{ borderBottom: "1px solid #f8f9fa" }}
                    >
                      <img
                        src={getImageUrl(p.image)}
                        width="40"
                        height="40"
                        className="rounded-2 me-3 object-fit-cover"
                        alt=""
                      />
                      <div>
                        <div className="fw-bold small text-dark">{pName}</div>
                        <div className="text-success small fw-bold">
                          ₹{p.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div
                  className="text-center p-2 small text-muted cursor-pointer hover-text-success"
                  onClick={handleSearch}
                >
                  View all results for "{searchTerm}"
                </div>
              </div>
            )}
            {showSuggestions && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 1050 }}
                onClick={() => setShowSuggestions(false)}
              ></div>
            )}
          </div>

          <div className="d-flex align-items-center gap-1 gap-md-3 ms-auto order-2 order-lg-4">
            {/* Right Side Icons + Language */}
            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* Language Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm dropdown-toggle border shadow-sm px-2 d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderRadius: "10px",
                    fontWeight: "500",
                    height: "36px",
                  }}
                >
                  <i className="fa-solid fa-globe text-success me-md-1"></i>
                  <span className="d-none d-md-inline ms-1">
                    {t("language")}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 animate__animated animate__fadeIn"
                  style={{ borderRadius: "15px" }}
                >
                  <li>
                    <button
                      className="dropdown-item py-2"
                      onClick={() => changeLanguage("en")}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2"
                      onClick={() => changeLanguage("hi")}
                    >
                      हिन्दी (Hindi)
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2"
                      onClick={() => changeLanguage("gu")}
                    >
                      ગુજરાતી (Gujarati)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Cart Icon with Count */}
              <Link
                to="/cart"
                className="icon-link position-relative d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--light-green)",
                  borderRadius: "10px",
                  color: "var(--primary-green)",
                }}
              >
                <i className="fa-solid fa-basket-shopping fs-6"></i>
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm"
                    style={{
                      fontSize: "0.6rem",
                      padding: "0.4em 0.6em",
                      marginTop: "5px",
                      marginLeft: "-5px",
                      border: "2px solid white",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <div id="authSection" className="d-inline-block">
                {!user ? (
                  <Link
                    to="/login"
                    className="btn btn-success px-3 py-2 rounded-pill fw-bold"
                    id="loginBtn"
                    style={{
                      background: "var(--primary-green)",
                      border: "none",
                      fontSize: "11px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {t("login")}
                  </Link>
                ) : (
                  <div className="dropdown d-inline-block" id="userMenu">
                    <button
                      className="btn border-0 d-flex align-items-center dropdown-toggle shadow-none p-0 pe-2"
                      type="button"
                      id="userProfileDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=198754&color=fff`}
                        className="rounded-circle shadow-sm me-2"
                        width="35"
                        height="35"
                        alt={user.name}
                      />
                      <span className="fw-600 d-none d-md-inline text-dark">
                        {user.name}
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 p-2 animate__animated animate__fadeIn"
                      style={{
                        borderRadius: "15px",
                        minWidth: "220px",
                        zIndex: 1100,
                      }}
                    >
                      <li className="px-3 py-3 border-bottom mb-2">
                        <div className="fw-bold text-dark">{user.name}</div>
                        <div className="text-muted small">{user.email}</div>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2 px-3 rounded-3"
                          to={
                            user.isAdmin
                              ? "/admin/dashboard"
                              : "/user/dashboard"
                          }
                        >
                          <i className="fa-solid fa-gauge me-2 text-success"></i>
                          {user.isAdmin ? "Admin Panel" : t("my_dashboard")}
                        </Link>
                      </li>
                      {!user.isAdmin && (
                        <>
                          <li>
                            <Link
                              className="dropdown-item py-2 px-3 rounded-3"
                              to="/user/dashboard"
                            >
                              <i className="fa-solid fa-box-open me-2 text-success"></i>{" "}
                              {t("my_orders")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item py-2 px-3 rounded-3"
                              to="/user/dashboard"
                            >
                              <i className="fa-solid fa-user-gear me-2 text-success"></i>{" "}
                              {t("my_profile")}
                            </Link>
                          </li>
                        </>
                      )}
                      <li>
                        <hr className="dropdown-divider mx-2" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item py-2 rounded-3 text-danger"
                          onClick={handleLogout}
                        >
                          <i className="fa-solid fa-right-from-bracket me-3"></i>{" "}
                          {t("logout")}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              className="navbar-toggler border-0 shadow-none p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              onClick={toggleMenu}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <i className="fa-solid fa-xmark fa-lg text-dark"></i>
              ) : (
                <span className="navbar-toggler-icon"></span>
              )}
            </button>
          </div>

          <div
            className={`collapse navbar-collapse order-3 ${isOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto me-lg-4">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  id="navHome"
                  onClick={() => setIsOpen(false)}
                >
                  {t("home")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about"
                  id="navAbout"
                  onClick={() => setIsOpen(false)}
                >
                  {t("about_us")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                  id="navContact"
                  onClick={() => setIsOpen(false)}
                >
                  {t("contact_us")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="sub-navbar-wrapper">
        <nav className="sub-navbar navbar-expand-lg">
          <div className="container">
            <ul className="navbar-nav d-flex flex-row justify-content-lg-center flex-wrap">
              {Array.isArray(categories) &&
                categories.map((cat, idx) => {
                  const lang = i18n.language || "en";
                  const catName =
                    typeof cat.name === "object"
                      ? cat.name[lang] || cat.name.en
                      : cat.name;

                  // Assign icons based on slug if possible, or default to leaf
                  let icon = "fa-leaf";
                  if (cat.slug.includes("fruit")) icon = "fa-apple-whole";
                  if (cat.slug.includes("veg")) icon = "fa-carrot";
                  if (cat.slug.includes("seed")) icon = "fa-seedling";
                  if (cat.slug.includes("gardening")) icon = "fa-faucet-drip";
                  if (
                    cat.slug.includes("flower") ||
                    cat.slug.includes("rose") ||
                    cat.slug.includes("lily")
                  )
                    icon = "fa-spa";

                  return (
                    <li key={cat.id} className="nav-item">
                      <Link
                        className={`nav-link px-3 ${location.pathname === `/products/${cat.slug}` ? "active" : ""}`}
                        to={`/products/${cat.slug}`}
                      >
                        <i className={`fa-solid ${icon} me-1`}></i> {catName}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
