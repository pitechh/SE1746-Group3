import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Pagination from "../../../components/common/Pagination";
import { getAllProposal, updateProposalStatus } from "../../../services/ProposalService";
import { getStudentByAccountId } from "../../../services/StudentServices";
import { Proposal } from "../../../types/DataTypes";
import Swal from "sweetalert2";
import { ApplyStatus } from "../../../types/StatusEnum";

const ProposalList: React.FC = () => {
  const [proposalData, setProposalData] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const proposals = await getAllProposal();
      setProposalData(proposals);
      setTotalPages(Math.ceil(proposals.length / pageSize)); // Adjusting total pages based on data size
    } catch (err) {
      setError("Failed to fetch proposals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId: number) => {
    try {
      const student = await getStudentByAccountId(studentId);
      return student;
    } catch (err) {
      console.error("Failed to fetch student details:", err);
      return null;
    }
  };

  const handleViewDetails = async (proposal: Proposal) => {
    try {
      const student = await fetchStudentDetails(proposal.studentID);
      Swal.fire({
        title: `Proposal Details`,
        html: `
          <h5 style="text-align: start">Proposal Information</h5>
          <p style="text-align: start" ><strong>Job Position:</strong> ${proposal.jobPosition}</p>
          <p style="text-align: start"><strong>Company Name:</strong> ${proposal.companyName}</p>
          <p style="text-align: start"><strong>Task Description:</strong> ${proposal.taskDescription}</p>
          <p style="text-align: start"><strong>Employee Size:</strong> ${proposal.employeeSize}</p>
          <p style="text-align: start"><strong>Tax Number:</strong> ${proposal.taxNumber}</p>
          <p style="text-align: start"><strong>Website:</strong> <a href="${proposal.websiteURL}" target="_blank" rel="noopener noreferrer">${proposal.websiteURL}</a></p>
          <p style="text-align: start"><strong>HR Email:</strong> ${proposal.hrMail}</p>
          
          <h5 style="text-align: start" class="mt-4">Student Information</h5>
          <p style="text-align: start"><strong>Student Code:</strong> ${student?.studentCode}</p>
          <p style="text-align: start"><strong>Major:</strong> ${student?.major}</p>
          <p style="text-align: start"><strong>Address:</strong> ${student?.address}</p>
        `,
        showCloseButton: false,
        confirmButtonText: 'Close',
        width: '500px',
        customClass: {
          popup: 'custom-swal-popup',
        }
      });
    } catch (err) {
      Swal.fire("Error", "Could not fetch student details.", "error");
    }
  };
  const handleUpdateStatus = async (proposalId: number, status: ApplyStatus) => {
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
        const response = await updateProposalStatus(proposalId, status);
        Swal.fire("Success", `Proposal status updated to ${status}.`, "success");
        fetchAllData(); // Reload the data after the update
      } catch (error) {
        Swal.fire("Error", "Failed to update proposal status.", "error");
      }
    }
  };
  
  useEffect(() => {
    fetchAllData();
  }, [pageNumber, pageSize]);

  return (
    <div id="Proposal-List" className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Proposal List</h4>

            {loading ? (
              <p>Loading proposals...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <>
                {proposalData.length > 0 ? (
                  <div className="table-responsive pt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Job Position</th>
                          <th>Company</th>
                          <th>Student Code</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposalData.map((proposal, index) => (
                          <tr key={proposal.proposalID}>
                            <td>{index + 1 + (pageNumber - 1) * pageSize}</td>
                            <td>{proposal.jobPosition}</td>
                            <td>{proposal.companyName}</td>
                            <td>{proposal.studentID}</td>
                            <td className={`status ${proposal.status}`}>{proposal.status}</td>
                            <td>
                              <Button
                                type="button"
                                className="btn btn-inverse-info btn-icon mr-2"
                                onClick={() => handleViewDetails(proposal)}
                              >
                                <i className="ti-eye"></i>
                              </Button>
                              {
                                proposal.status === ApplyStatus.PENDING && (
                                  <>
                                    <Button
                                      type="button"
                                      className="btn btn-inverse-success btn-icon mr-2"
                                      onClick={() =>
                                        handleUpdateStatus(proposal.proposalID, ApplyStatus.APPROVED)
                                      }
                                    >
                                      Apply
                                    </Button>
                                    <Button
                                      type="button"
                                      className="btn btn-inverse-danger btn-icon"
                                      onClick={() =>
                                        handleUpdateStatus(proposal.proposalID, ApplyStatus.REJECTED)
                                      }
                                    >
                                      Reject
                                    </Button></>
                                )
                              }

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-warning">No proposals available.</p>
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

export default ProposalList;
