import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Pagination from "../../../components/common/Pagination";
import { fetchMajorFilters } from "../../../services/MajorServices";
import { StudentApplied } from "../../../types/DataTypes";
import { fetchStudentApplied, updateApplyStatus } from "../../../services/StudentServices";
import { ApplyStatus } from "../../../types/StatusEnum";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

const StudentAppliedList: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [students, setStudents] = useState<StudentApplied[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majors, setMajors] = useState<{ value: string; label: string }[]>([]);

  // Fetch majors for filtering
  useEffect(() => {
    const loadMajors = async () => {
      try {
        const majorData = await fetchMajorFilters();
        setMajors(
          majorData.map((major) => ({
            value: major.majorName,
            label: major.majorName,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch majors", err);
      }
    };

    loadMajors();
  }, []);

  // Fetch applied students
  useEffect(() => {
    if (companyId) {
      fetchStudents();
    }
  }, [companyId, pageNumber, selectedMajor, searchTerm]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentApplied(
        Number(companyId),
        pageNumber,
        pageSize,
        selectedMajor,
        searchTerm
      );
      if (data && data.items) {
        setStudents(data.items);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Invalid data format.");
      }
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (studentId: number,applyId: number, status: ApplyStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status.toLowerCase()} this proposal?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const response = await updateApplyStatus(studentId, applyId, status);
        Swal.fire("Success", `Apply status updated to ${status}.`, "success");
        fetchStudents(); // Reload the data after the update
      } catch (error) {
        Swal.fire("Error", "Failed to update apply status.", "error");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Applied Students</h4>

            {/* Bộ lọc chuyên ngành và ô tìm kiếm */}
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <div className="d-flex">
                <Select
                  options={majors}
                  placeholder="Select Major"
                  onChange={(selectedOption) =>
                    setSelectedMajor(selectedOption ? selectedOption.value : "")
                  } // Set majorName thay vì majorId
                  isClearable
                  className="h-46px mr-2"
                />
                <div className="d-flex">
                  <div className=" mr-2">
                    <input
                      type="text"
                      placeholder="Search student code..."
                      className="form-control mr-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary" onClick={fetchStudents}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <p>Loading students...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : students.length > 0 ? (
              <div className="table-responsive pt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Code</th>
                      <th>Major</th>
                      <th>Address</th>
                      <th>CV</th>
                      <th>Apply Status</th>
                      <th>Internship Position</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.studentId}>
                        <td>{index + 1 + (pageNumber - 1) * pageSize}</td>
                        <td>{student.studentCode}</td>
                        <td>{student.major}</td>
                        <td>{student.address}</td>
                        <td>
                          <a
                            href={`/uploads/${student.cvImage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View CV
                          </a>
                        </td>
                        <td className={`status ${student.applyStatus}`}>{student.applyStatus}</td>
                        <td>{student.internshipPosition}</td>
                        <td>
                          {
                            student.applyStatus === ApplyStatus.PENDING && (
                              <>
                                <Button
                                  type="button"
                                  className="btn btn-inverse-success btn-icon mr-2"
                                  onClick={() =>
                                    handleUpdateStatus(student.studentId ,student.applyId, ApplyStatus.APPROVED)
                                  }
                                >
                                  Apply
                                </Button>
                                <Button
                                  type="button"
                                  className="btn btn-inverse-danger btn-icon"
                                  onClick={() =>
                                    handleUpdateStatus(student.studentId, student.applyId, ApplyStatus.REJECT)
                                  }
                                >
                                  Reject
                                </Button>
                              </>

                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-warning">No applied students found.</p>
            )}

            {/* Pagination */}
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

export default StudentAppliedList;
