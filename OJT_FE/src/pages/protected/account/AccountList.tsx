import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import Pagination from "../../../components/common/Pagination";
import { Account, Internship } from "../../../types/DataTypes";
import { useNavigate } from "react-router-dom";
import { Role, Status } from "../../../types/StatusEnum";
import { fetchAllAccounts } from "../../../services/AccountService";

const AccountList: React.FC = () => {
  const [accountsData, setAccountData] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [companies, setCompanies] = useState<
    { value: number; label: string }[]
  >([]);
  const navigate = useNavigate();
  const statusOptions = Object.values(Status).map((status) => ({
    value: status,
    label: status,
  }));
  const roleOptions = Object.values(Role).map((role) => ({
    value: role,
    label: role,
  }));

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAccounts(
        pageNumber,
        pageSize,
        searchKeyword,
        selectedRole,
        selectedStatus
      );

      if (data && data.items) {
        console.log({ data: data.items });
        setAccountData(data.items);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Invalid data format: expected an object with items.");
      }
    } catch (err) {
      setError("Failed to fetch internships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchKeyword, selectedRole, selectedStatus, pageNumber, pageSize]);

  return (
    <div id="InternshipList" className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Account List</h4>
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <div className="d-flex">
                <Select
                  options={roleOptions}
                  placeholder="Select Role"
                  onChange={(selectedOption) =>
                    setSelectedRole(selectedOption ? selectedOption.value : "")
                  }
                  isClearable
                  className="h-46px mr-2"
                />
                <Select
                  options={statusOptions}
                  placeholder="Select Status"
                  onChange={(selectedOption) =>
                    setSelectedStatus(
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                  isClearable
                  className="h-46px mr-2"
                />
                <div style={{ marginRight: "0.5rem", width: "200px" }}>
                  <input
                    type="text"
                    placeholder="Enter somthing ..."
                    className="form-control"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <Button className="btn btn-primary" onClick={fetchAllData}>
                  Search
                </Button>
              </div>
              <div>
                <Button
                  className="btn btn-primary"
                  onClick={() => navigate("/manager/account/create")}
                >
                  Add New
                </Button>
              </div>
            </div>

            {loading ? (
              <p>Loading internships...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                {accountsData.length > 0 ? (
                  <div className="table-responsive pt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Email</th>
                          <th>Fullname</th>
                          <th>role</th>
                          <th>status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountsData.map((account, index) => (
                          <tr key={account.accountId}>
                            <td>{index + 1 + (pageNumber - 1) * pageSize}</td>
                            <td>{account.email}</td>
                            <td>{account.fullname}</td>
                            <td>{account.role}</td>
                            <td>{account.status}</td>
                            <td>
                              <Button
                                type="button"
                                className="btn btn-inverse-info btn-icon"
                                style={{ marginRight: "0.5rem" }}
                              >
                                <i className="ti-pencil-alt"></i>
                              </Button>
                              <button
                                type="button"
                                className="btn btn-inverse-danger btn-icon"
                              >
                                <i className="ti-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-warning">No Account available.</p>
                )}
              </>
            )}
            <div className="d-flex justify-content-end mt-4">
              <Pagination
                pageCurrent={pageNumber}
                totalPage={totalPages}
                paginate={setPageNumber}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
