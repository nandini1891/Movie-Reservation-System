import "./Navbar.css";

function Navbar({
  isLoggedIn,
  user,
  setIsLoggedIn,
  setUser,
  onSignIn,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Left Side */}
        <div className="nav-left">

          <h2 className="logo">
            <span className="gold">CINÉ</span>VAULT
          </h2>

          <nav>
            <a href="/" className="active">
              Films
            </a>

            {isLoggedIn && (
              <a href="/bookings">
                My Bookings
              </a>
            )}
          </nav>

        </div>

        {/* Right Side */}
        <div className="nav-right">

          {!isLoggedIn ? (

            <button
              className="signin-btn"
              onClick={onSignIn}
            >
              Sign In
            </button>

          ) : (

            <div className="nav-user">

              <div className="user-profile">

                <div className="avatar">
                  {user?.name?.charAt(0)}
                </div>

                <div className="user-text">
                  <h4>{user?.name}</h4>
                  <p>{user?.role}</p>
                </div>

              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  setIsLoggedIn(false);
                  setUser(null);
                }}
              >
                Sign Out
              </button>

            </div>

          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;