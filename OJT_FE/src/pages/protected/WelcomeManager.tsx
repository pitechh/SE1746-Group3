import { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import { Account } from "../../types/DataTypes";

const WelcomeManager: React.FC = () => {
  const [user, setUser] = useState<Account | null>(AuthService.getUserInfo());

  useEffect(() => {
    const updateUser = () => {
      const userInfo = AuthService.getUserInfo();
      setUser(userInfo);
    };

    window.addEventListener("storage", updateUser); // Lắng nghe sự thay đổi trong localStorage
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);
  return (
    <div className="row">
      <div>
        <h2>Welcome </h2>
        {user ? (
          <p>
            Logged in as: {user.fullname} ({user.role})
          </p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default WelcomeManager;
