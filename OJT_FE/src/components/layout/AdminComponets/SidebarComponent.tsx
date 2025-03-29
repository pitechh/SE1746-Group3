import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCompanyByAccountID } from "../../../services/CompanyServices";
import AuthService from "../../../services/AuthService";
import { Role } from "../../../types/StatusEnum";
import { Account } from "../../../types/DataTypes";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = AuthService.getUserInfo();
        if (!user) {
          setError("User not authenticated.");
          return;
        }
        setUser(user);
      } catch (err) {
        setError("Failed to user company.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleStudentApply = async () => {
    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      const company = await getCompanyByAccountID(user.accountId);

      if (company !== null) {
        navigate(`/manager/student-applied/company/${company.companyId}`);
      } else {
        navigate("/403-forbidden")
      }
    } catch (err) {
      alert("Failed to fetch company.");
    }
  };


  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/* Dashboard luôn hiển thị */}
        <li className="nav-item">
          <NavLink className="nav-link" to="/manager/welcome">
            <i className="icon-grid menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </NavLink>
        </li>

        {/* Companies => chỉ hiển thị với role STAFF(PDT) */}
        {user?.role === Role.STAFF && (

          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/company/list">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Companies</span>
            </NavLink>
          </li>
        )}

        {/* Internships => chỉ hiển thị với role HR_STAFF */}
        {user?.role === Role.HR_STAFF && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/internship/list">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Internships</span>
            </NavLink>
          </li>
        )}

        {/* Accounts => chỉ hiển thị với role Admin */}
        {user?.role === Role.ADMIN && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/account/list">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Accounts</span>
            </NavLink>
          </li>
        )}

        {/* Applied Students => chỉ hiển thị với role HR_STAFF */}
        {user?.role === Role.HR_STAFF && (
          <li className="nav-item">
            <a className="nav-link" onClick={handleStudentApply}>
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Applied Students</span>
            </a>
          </li>
        )}

        {/* Proposals => chỉ hiển thị với role STAFF */}
        {user?.role === Role.STAFF && (
          <li className="nav-item">
            <a className="nav-link" href="/manager/proposal/list">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Proposals</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
