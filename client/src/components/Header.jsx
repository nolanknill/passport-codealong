// NavLink component allows us to define an active CSS class for the page we are currently on
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <section className="header">
      <div className="header__banner"></div>
      <div className="header__bottom">
        <Link className="header__logo" to="/">
          BrainFeed
        </Link>
        <nav className="header__nav">
          <NavLink
            className={(navData) =>
              navData.isActive
                ? 'header__nav-link header__nav-link--active'
                : 'header__nav-link'
            }
            to="/"
            exact="true"
          >
            Home
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive
                ? 'header__nav-link header__nav-link--active'
                : 'header__nav-link'
            }
            to="/profile"
            exact="true"
          >
            Profile
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive
                ? 'header__nav-link header__nav-link--active'
                : 'header__nav-link'
            }
            to="/posts"
            exact="true"
          >
            Posts
          </NavLink>
        </nav>
      </div>
    </section>
  );
};

export default Header;