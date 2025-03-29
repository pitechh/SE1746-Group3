import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Proposal } from "../../../types/DataTypes";
import { fetchProposalById } from "../../../services/ProposalService";

const avatarCompany = "/src/assets/images/samples/300x300/1.jpg"; // Cập nhật đường dẫn nếu cần thiết
const CompanyDetail: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [ProposalData, setProposalData] = useState<Proposal>();

    const fetchProposal = async () => {
        try {
            setLoading(true);
            const data = await fetchProposalById()
            if (data) {
                setProposalData(data);
            } else {
                console.error("Fetched data is null");
            }
        } catch (error) {
            setError("Failed to fetch proposal");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProposal();
    }, []);

    return (
        <div id="InternshipProposal" className="container-fluid bg-light">
            <div className="container p-5">

                <div className="body-partner-detail">
                    {ProposalData ? (
                        <>
                            <div className="job-detail__body">
                                <div className="job-detail__body-left">
                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">

                                        <div className="job-detail__info--title">
                                            <h1 className="bold job-detail__info--title">{ProposalData.jobPosition}</h1>
                                        </div>
                                        <div className="row">
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Company Name:&nbsp;
                                                </b>
                                                {ProposalData.companyName}
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Status:&nbsp;
                                                </b>
                                                <span className={`status ${ProposalData.status}`} >
                                                    {ProposalData.status}
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Location:&nbsp;
                                                </b>
                                                <span>
                                                    {ProposalData.location}
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Address:&nbsp;
                                                </b>
                                                <span>
                                                    {ProposalData.address}
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Tax Number:&nbsp;
                                                </b>
                                                <span>
                                                    {ProposalData.taxNumber}
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Website:&nbsp;
                                                </b>
                                                <span>
                                                    {ProposalData.websiteURL}
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">
                                        <div className="d-flex justify-content-between align-items-center job-detail__information-detail--title-container">
                                            <h2 className="job-detail__information-detail--title">Infomation</h2>
                                        </div>
                                        <div className="job-detail__information-container">
                                            <div className="job-detail__information-detail--content">
                                                <div className="job-description">
                                                    <div className="job-description__item">
                                                        <h3>HR Information</h3>
                                                        <ul>
                                                            <li>Tên: {ProposalData.hrName}</li>
                                                            <li>Email: {ProposalData.hrMail}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Task description</h3>
                                                        <div className="job-description__item--content">{ProposalData.taskDescription}</div>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Evidences</h3>
                                                        <div className="job-description__item--content">
                                                            <img src={ProposalData.evidences} alt="" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="right col-md-3 ">
                                    <div className="image company-logo d-flex flex-column">
                                        <img src={ProposalData.companyLogo || avatarCompany} className="" alt="hcl-logo" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="job-detail__body">
                            <div className="job-detail__body-left">
                                <div id="job-detail__box--left job-detail__info d-flex " className="job-detail__box--left job-detail__info">
                                    <div className="row">

                                        <div className="summary-item col-md-6 mb-2 mt-4 d-flex justify-content-center">

                                            <a className="btn btn-primary ml-2">
                                                <i className="ti-download mr-1"></i>
                                                Download file tutorial
                                            </a>
                                        </div>
                                        <div className="summary-item col-md-6 mb-2 mt-4 d-flex justify-content-center">
                                            <Link to={`/InternshipProposals/create`} className="btn btn-primary ml-2">
                                                <i className="ti-plus mr-1"></i>
                                                Create Proposal
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            </div>

        </div >
    )

}

export default CompanyDetail