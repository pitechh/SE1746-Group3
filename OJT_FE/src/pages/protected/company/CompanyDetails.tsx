import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { Company } from "../../../types/DataTypes";
import {
  getCompanyDetails,
  updateCompany,
  createCompany,
} from "../../../services/CompanyServices";
import { getAllcountByRoleAndStatus } from "../../../services/AccountService";
import { Role } from "../../../types/StatusEnum";

const CompanyDetails: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const { mode, companyId } = useParams(); // Lấy mode và companyId từ URL
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [hrStaffs, setHrStaffs] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  // Xác định chế độ: update, create hay chỉ xem chi tiết.
  const isUpdateMode = mode === "update";
  const isCreateMode = mode === "create";
  const isDetailsMode = mode === "details";

  useEffect(() => {
    const fetchData = async () => {
      // Fetch HR Staffs và Provinces
      await fetchHrStaffs();
      await fetchProvinces();
  
      if (companyId && (isDetailsMode || isUpdateMode)) {
        await fetchCompanyDetails(companyId); // Sau khi HR Staffs và Provinces được fetch, mới fetch company details
      }
    };
  
    fetchData(); // Gọi hàm fetchData async
  
  }, [companyId, isDetailsMode, isUpdateMode]);


  const fetchCompanyDetails = async (companyId: string) => {
    try {
      const data = await getCompanyDetails(Number(companyId));
       console.log(data);
       if(data ) {
        setCompany(data);
        setLocation(data.location);
        setSelectedAccount(Number(data.accountId));
       }
      
    } catch (error) {
      Swal.fire("Error", "Unable to fetch company details. Please try again.", "error");
    }
  };

  // Hàm lấy danh sách các tỉnh/thành phố
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

  // Hàm lấy danh sách HR Staff và chuyển accountId về dạng chuỗi để nhất quán
  const fetchHrStaffs = async () => {
    try {
      const data = await getAllcountByRoleAndStatus(Role.HR_STAFF, "Active");
      console.log(data);
      const hrStaffOptions = data.map((staff) => ({
        value: staff.accountId,
        label: staff.fullname,
      }));
      setHrStaffs(hrStaffOptions);
    } catch (err) {
      console.error("Failed to fetch HR Staffs", err);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
  
    // Thêm location và accountId vào formData
    formData.append("location", location);
    formData.append("accountId", String(selectedAccount));
  
    // Kiểm tra xem formData có chứa tệp hay không
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // Log tên và giá trị của các trường trong formData
    }
  
    try {
      if (isUpdateMode && company) {
        await updateCompany(formData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Company updated successfully!",
        }).then(() => navigate(`/manager/company/details/${companyId}`));
      } else if (isCreateMode) {
        await createCompany(formData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Company created successfully!",
        }).then(() => navigate("/manager/company/list"));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      Swal.fire({
        icon: "error",
        title: "Action failed!",
        text: errorMessage,
      });
    }
  };
  
  


  const handleUpdateClick = () => {
    navigate(`/manager/company/update/${companyId}`);
    window.location.reload();
  };

  return (
    <div id="CompanyDetail" className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isUpdateMode
                ? "Update company"
                : isCreateMode
                ? "Create company"
                : "View company details"}
            </h4>
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company name</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  defaultValue={company?.companyName || ""}
                  placeholder="Name"
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Website url</label>
                <input
                  type="text"
                  className="form-control"
                  name="websiteUrl"
                  defaultValue={company?.websiteUrl || ""}
                  placeholder="Website URL"
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Phone number</label>
                <input
                  type="text"
                  className="form-control"
                  name="phoneNumber"
                  defaultValue={company?.phoneNumber || ""}
                  placeholder="Phone number"
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>HR Staff</label>
                <Select
                  className="h-46px"
                  options={hrStaffs}
                  placeholder="Select HR Staff"
                  onChange={(selectedOption) =>
                    setSelectedAccount(selectedOption ? selectedOption.value : "")
                  }
                  value={hrStaffs.find(
                    (option) => option.value === selectedAccount
                  )}
                  isClearable
                  isDisabled={isDetailsMode}
                />
              </div>
              {isUpdateMode || isCreateMode ? (
                <div className="form-group">
                  <label>Avatar</label>
                  <input
                    type="file"
                    name="avatar"
                    className="file-upload-default"
                  />
                  <div className="input-group col-xs-12">
                    <input
                      type="text"
                      className="form-control file-upload-info"
                      disabled
                      placeholder="Upload Image"
                    />
                    <span className="input-group-append">
                      <button
                        className="file-upload-browse btn btn-primary"
                        type="button"
                      >
                        Upload
                      </button>
                    </span>
                  </div>
                </div>
              ) : (
                company?.avatar && (
                  <div className="form-group">
                    <label>Avatar</label>
                    <div className="input-group col-xs-12">
                      <img src={String(company.avatar)} alt="Avatar" width="300" />
                    </div>
                  </div>
                )
              )}
              <div className="form-group">
                <label>Location</label>
                <Select
                  className="h-46px"
                  options={provinces}
                  placeholder="Select location"
                  onChange={(selectedOption) =>
                    setLocation(selectedOption ? selectedOption.value : "")
                  }
                  value={provinces.find(
                    (option) => option.value === location
                  )}
                  isClearable
                  isDisabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows={4}
                  defaultValue={company?.address || ""}
                  disabled={isDetailsMode}
                ></textarea>
              </div>
              {isUpdateMode ? (
                <button type="submit" className="btn btn-primary mr-2">
                  Update
                </button>
              ) : isCreateMode ? (
                <button type="submit" className="btn btn-primary mr-2">
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={handleUpdateClick}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-light"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;

