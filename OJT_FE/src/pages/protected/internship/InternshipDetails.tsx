import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { fetchCompanyFilter } from "../../../services/CompanyServices";
import { fetchMajorFilters } from "../../../services/MajorServices";

import {
  updateInternship,
  createInternship,
  fetchInternshipById,
} from "../../../services/InternshipServices";
import { Internship } from "../../../types/DataTypes";

const InternshipDetails: React.FC = () => {
  const { mode, internshipId } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [companies, setCompanies] = useState<any[]>([]); // Dữ liệu công ty
  const [majors, setMajors] = useState<any[]>([]); // Dữ liệu chuyên ngành
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<any | null>(null);

  const isUpdateMode = mode === "update";
  const isCreateMode = mode === "create";
  const isDetailsMode = mode === "details";

  useEffect(() => {
    fetchFilters();

    if (internshipId && (isDetailsMode || isUpdateMode)) {
      fetchInternshipDetails(internshipId);
    }
  }, [internshipId, isDetailsMode, isUpdateMode]);

  // Hàm lấy chi tiết internship
  const fetchInternshipDetails = async (internshipId: string) => {
    try {
      const data = await fetchInternshipById(internshipId);
      if (data) {
        setInternship(data);
        setSelectedCompany(data.companyID);
        setSelectedMajor(data.majorName);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Unable to fetch internship details. Please try again.",
        "error"
      );
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const internshipData = {
      position: (e.target as any).position.value,
      description: (e.target as any).description.value,
      requirement: (e.target as any).requirement.value,
      benefits: (e.target as any).benefits.value,
      salary: Number((e.target as any).salary.value),
      companyId: selectedCompany,
      majorId: selectedMajor,
    };

    try {
      if (isUpdateMode && internship) {
        await updateInternship(Number(internshipId), internshipData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Internship updated successfully!",
        }).then(() => navigate(`/manager/internship/details/${internshipId}`));
      } else if (isCreateMode) {
        await createInternship(internshipData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Internship created successfully!",
        }).then(() => navigate("/manager/internship/list"));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action failed!",
        text: "An unexpected error occurred.",
      });
    }
  };
  const handleUpdateClick = () => {
    navigate(`/manager/internship/update/${internshipId}`);
    window.location.reload();
  };

  return (
    <div id="InternshipDetail" className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              {isUpdateMode
                ? "Update Internship"
                : isCreateMode
                ? "Create Internship"
                : "View Internship Details"}
            </h4>
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  className="form-control"
                  name="position"
                  defaultValue={internship?.position || ""}
                  disabled={isDetailsMode}
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  className="form-control"
                  name="salary"
                  defaultValue={internship?.salary || 0}
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <Select
                  placeholder="Select Company"
                  options={companies}
                  value={companies.find(
                    (company) => company.value === selectedCompany
                  )}
                  onChange={(selectedOption) =>
                    setSelectedCompany(selectedOption?.value || null)
                  }
                  isDisabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Major</label>
                <Select
                  placeholder="Select Major"
                  options={majors}
                  value={majors.find((major) => major.label === selectedMajor)}
                  onChange={(selectedOption) =>
                    setSelectedMajor(selectedOption?.value || null)
                  }
                  isDisabled={isDetailsMode}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={4}
                  defaultValue={internship?.description || ""}
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Requirement</label>
                <textarea
                  className="form-control"
                  name="requirement"
                  rows={4}
                  defaultValue={internship?.requirement || ""}
                  disabled={isDetailsMode}
                />
              </div>
              <div className="form-group">
                <label>Benefits</label>
                <textarea
                  className="form-control"
                  name="benefits"
                  rows={4}
                  defaultValue={internship?.benefits || ""}
                  disabled={isDetailsMode}
                />
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

export default InternshipDetails;
