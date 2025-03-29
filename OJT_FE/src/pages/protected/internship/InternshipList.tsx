import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";
import Pagination from "../../../components/common/Pagination";
import {
  fetchInternships,
  deleteInternship
} from "../../../services/InternshipServices";
import { fetchCompanyFilter } from "../../../services/CompanyServices";
import { fetchMajorFilters } from "../../../services/MajorServices";
import { Internship } from "../../../types/DataTypes";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const InternshipList: React.FC = () => {
  const [internshipData, setInternshipData] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [companies, setCompanies] = useState<
    { value: number; label: string }[]
  >([]);
  const [majors, setMajors] = useState<{ value: number; label: string }[]>([]);
  const navigate = useNavigate();

  const fetchFilters = async () => {
    try {
      const [companyData, majorData] = await Promise.all([
        fetchCompanyFilter(),
        fetchMajorFilters(),
      ]);

      setCompanies(
        companyData.items.map((company) => ({
          value: company.companyId,
          label: company.companyName,
        }))
      );

      setMajors(
        majorData.map((major) => ({
          value: major.majorId,
          label: major.majorName,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch filters", err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await fetchInternships(
        pageNumber,
        pageSize,
        searchKeyword,
        selectedCompany,
        selectedMajor
      );
      if (data && data.items) {
        setInternshipData(data.items);
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

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Dữ liệu sẽ không thể phục hồi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, hãy xóa nó!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteInternship(id);
          Swal.fire("Đã xóa!", "Thông tin thực tập đã được xóa.", "success");
          // Làm mới danh sách sau khi xóa
          fetchAllData();
        } catch (error) {
          Swal.fire(
            "Lỗi!",
            "Xóa thông tin thực tập không thành công.",
            "error"
          );
        }
      }
    });
  };
  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [pageNumber, pageSize]);

  return (
    <div id="Internship-List" className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Internship List</h4>
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <div className="d-flex">
                <Select
                  options={companies}
                  placeholder="Select Company"
                  onChange={(selectedOption) =>
                    setSelectedCompany(
                      selectedOption ? selectedOption.value : 0
                    )
                  }
                  isClearable
                  className="h-46px mr-2"
                />
                <Select
                  options={majors}
                  placeholder="Select Major"
                  onChange={(selectedOption) =>
                    setSelectedMajor(selectedOption ? selectedOption.value : 0)
                  }
                  isClearable
                  className="h-46px mr-2"
                />
                <div className="d-flex">
                  <div className=" mr-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                  <Button className="btn btn-primary" onClick={fetchAllData}>
                    Search
                  </Button>
                </div>
              </div>
              <div>
                <Button
                  className="btn btn-primary"
                  onClick={() => navigate("/manager/internship/create")}
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
                {internshipData.length > 0 ? (
                  <div className="table-responsive pt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Position</th>
                          <th>Company</th>
                          <th>Major</th>
                          <th>Salary</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internshipData.map((internship, index) => (
                          <tr key={internship.internshipId}>
                            <td>{index + 1 + (pageNumber - 1) * pageSize}</td>
                            <td>{internship.position}</td>

                            <td>{internship.companyName}</td>
                            <td>${internship.salary}</td>
                            <td>{internship.majorName}</td>
                            <td>
                              <Link
                                to={`/manager/internship/update/${internship.internshipId}`}
                              >
                                <Button
                                  type="button"
                                  className="btn btn-inverse-info btn-icon"
                                  style={{ marginRight: "0.5rem" }}
                                >
                                  <i className="ti-pencil-alt"></i>
                                </Button>
                              </Link>
                              <Link
                                to={`/manager/internship/details/${internship.internshipId}`}
                              >
                                <Button
                                  type="button"
                                  className="btn btn-inverse-info btn-icon mr-2"
                                >
                                  <i className="ti-eye"></i>
                                </Button>
                              </Link>
                              <button
                                type="button"
                                className="btn btn-inverse-danger btn-icon"
                                onClick={() =>
                                  handleDelete(internship.internshipId)
                                }
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
                  <p className="text-warning">No internships available.</p>
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

export default InternshipList;
