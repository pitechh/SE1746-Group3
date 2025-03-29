import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Company } from "../../../types/DataTypes";
import { Button } from "react-bootstrap";
import { fetchCompanies } from "../../../services/CompanyServices";
import Pagination from "../../../components/common/Pagination";
import { Link, useNavigate } from "react-router-dom";

const CompanyList: React.FC = () => {
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [provinces, setProvinces] = useState<
    { value: string; label: string }[]
  >([]);
  const navigate = useNavigate();
  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      const data = await response.json();
      if (data.error === 0 && Array.isArray(data.data)) {
        const provinceOptions = data.data.map((province: any) => ({
          value: province.name,
          label: province.name,
        }));
        setProvinces(provinceOptions);
      }
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await fetchCompanies(
        pageNumber,
        pageSize,
        searchKeyword,
        location
      );
      console.log("Fetched companies:", data);
      if (data && data.items) {
        setCompanyData(data.items);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Invalid data format: expected an object with items.");
      }
    } catch (err) {
      setError("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [pageNumber, pageSize]);

  return (
    <div className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Company List</h4>
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <div className="d-flex">
                <div style={{ marginRight: "0.5rem" }}>
                  <Select
                    className="h-46px"
                    options={provinces}
                    placeholder="Select location"
                    onChange={(selectedOption) =>
                      setLocation(selectedOption ? selectedOption.value : "")
                    }
                    isClearable
                  />
                </div>
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
                  onClick={() => {
                    navigate("/manager/company/create");
                    window.location.reload(); // Reloads the page after navigation
                  }}
                >
                  Add New
                </Button>
              </div>
            </div>

            {loading ? (
              <p>Loading companies...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                {Array.isArray(companyData) && companyData.length > 0 ? (
                  <div className="table-responsive pt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Company Name</th>
                          <th>Phone Number</th>
                          <th>Website</th>
                          <th>Address</th>
                          <th>Location</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyData.map((company, index) => (
                          <tr key={company.companyId}>
                            <td>{index + 1 + (pageNumber - 1) * pageSize}</td>
                            <td>{company.companyName}</td>
                            <td>{company.phoneNumber}</td>
                            <td>
                              <a
                                href={company.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {company.websiteUrl}
                              </a>
                            </td>
                            <td>{company.address}</td>
                            <td>{company.location}</td>
                            <td>
                              <Button
                                type="button"
                                className="btn btn-inverse-info btn-icon"
                                style={{ marginRight: "0.5rem" }}
                                onClick={() => {
                                  navigate(
                                    `/manager/company/update/${company.companyId}`
                                  );
                                  window.location.reload();
                                }}
                              >
                                <i className="ti-pencil-alt"></i>
                              </Button>

                              <button
                                type="button"
                                className="btn btn-inverse-danger btn-icon mr-2"
                              >
                                <i className="ti-trash"></i>
                              </button>

                              <Link
                                to={`/manager/company/details/${company.companyId}`}
                              >
                                <Button
                                  type="button"
                                  className="btn btn-inverse-info btn-icon"
                                >
                                  <i className="ti-eye"></i>
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-warning">No companies available.</p>
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

export default CompanyList;
