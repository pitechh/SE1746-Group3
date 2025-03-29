import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../../../services/AccountService"
import Swal from "sweetalert2";

const AccountDetail: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("0");
  const [age, setAge] = useState<number>(0);
  const [studentInfo, setStudentInfo] = useState({
    StudentCode: "",
    Major: "",
    Address: "",
    CvImage: "no data",
    Status: "Not Registered for Internship"
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const accountData = {
      accountId: 0, // giả sử backend tự sinh
      fullname,
      email,
      password,
      gender: gender === "Male" ? 1 : 0,
      role,
      status: 0,
      age,
      data: role === "Student" ? { ...studentInfo } : null,
    };
    try {
      await createAccount(accountData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created",
      }).then(() => {
        navigate(-1); // quay lại sau khi alert
      });
    } catch (error: any) {
      // Nếu server trả về lỗi có message
      const errorMessage =
        error?.response?.data?.message || "Đã xảy ra lỗi không xác định.";
      Swal.fire({
        icon: "error",
        title: "Create account fail!",
        text: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div id="AccountDetail" className="row">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Create account</h4>
            <form className="form-sample" onSubmit={handleSubmit}>
              {/* Email & Password */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Email</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Password</label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Full name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter full name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Age</label>
                    <div className="col-sm-9">
                      <input
                        placeholder="Enter age"
                        type="text"
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Gender & Age */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Gender</label>
                    <div className="col-sm-9">
                      <select
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Role</label>
                    <div className="col-sm-9">
                      <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                        <option value="HRstaff">HRstaff</option>
                        <option value="StudentServicesDepartmentStaff">Department Service Staff</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Role */}
              <div className="row">

              </div>

              {/* Student Info */}
              {role === "Student" && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Student Code</label>
                        <div className="col-sm-9">
                          <input
                            placeholder="Enter student code"
                            type="text"
                            className="form-control"
                            value={studentInfo.StudentCode}
                            onChange={(e) =>
                              setStudentInfo({
                                ...studentInfo,
                                StudentCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Major</label>
                        <div className="col-sm-9">
                          <input
                            placeholder="Enter major"
                            type="text"
                            className="form-control"
                            value={studentInfo.Major}
                            onChange={(e) =>
                              setStudentInfo({
                                ...studentInfo,
                                Major: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Address</label>
                        <div className="col-sm-9">
                          <textarea
                            placeholder="Enter address"
                            rows={4}
                            className="form-control"
                            value={studentInfo.Address}
                            onChange={(e) =>
                              setStudentInfo({
                                ...studentInfo,
                                Address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>


                </>
              )}

              {/* Buttons */}
              <button type="submit" className="btn btn-primary mr-2">
                Submit
              </button>
              <button type="button" className="btn btn-light" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
