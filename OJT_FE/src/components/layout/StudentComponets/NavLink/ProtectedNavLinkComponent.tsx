import { Link, NavLink } from "react-router-dom";
import avatar from "../../../../assets/images/faces/face28.jpg";
import { Account } from "../../../../types/DataTypes";
import AuthService from "../../../../services/AuthService"; "../../../../services/AuthService";



function ProtectedNavLinkComponent() {
    return (
        <ul id="studentPage" className="navbar-nav">
            <li className="nav-item d-flex align-items-center">
                <NavLink to="/" className="nav-link">
                    Home
                </NavLink>
            </li>
            <li className="nav-item d-flex align-items-center">
                <NavLink to="/internship/list" className="nav-link">
                    Job Opportunities
                </NavLink>
            </li>
            <li className="nav-item d-flex align-items-center">
                <NavLink to="/company/list" className="nav-link">
                    Companies & Institutions
                </NavLink>
            </li>
            <li className="nav-item d-flex align-items-center">
                <NavLink to={`/InternshipProposals`} className="nav-link">
                    My OJT Proposals
                </NavLink>
            </li>
            <li className="nav-item d-flex align-items-center">
                <NavLink to="/applyList" className="nav-link">
                    My Apply
                </NavLink>
            </li>
            <li className="nav-item nav-profile dropdown d-flex align-items-center">
                <a
                    className="nav-link dropdown-toggle"
                    href=""
                    data-toggle="dropdown"
                    id="profileDropdown"
                >
                    <img src={avatar} className="" alt="profile" width="40" height="40" />
                </a>
                <div
                    className="dropdown-menu dropdown-menu-right navbar-dropdown"
                    aria-labelledby="profileDropdown"
                >
                    <Link className="dropdown-item" to="/Profile">
                        <i className="mr-2 ti-user text-primary"></i>
                        Profile
                    </Link>
                    <a
                        className="dropdown-item"
                        onClick={() => AuthService.logOut()}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="mr-2 ti-shift-left text-primary"></i>
                        Logout
                    </a>
                </div>
            </li>
        </ul>
    );
}

export default ProtectedNavLinkComponent;