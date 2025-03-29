import { Link, NavLink } from "react-router-dom"

function PublicNavLinkComponent() {
    return (
        <>
            <ul id="studentPage" className="navbar-nav ms-auto"> {/* Changed to ms-auto */}
                <li className="nav-item">
                    <NavLink to="/" className="nav-link">
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/company/list" className="nav-link">
                        Companies & Institutions
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="https://daihoc.fpt.edu.vn/gioi-thieu-dai-hoc-fpt/" className="nav-link">
                        About Us
                    </NavLink>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="btn btn-primary rounded rounded-1">
                        Log in
                    </Link>
                </li>
            </ul>
        </>
    )
}
export default PublicNavLinkComponent