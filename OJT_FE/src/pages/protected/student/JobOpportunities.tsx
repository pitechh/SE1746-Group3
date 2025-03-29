import React, { useEffect, useState } from 'react';
import { Company, Internship, Major, Student } from '../../../types/DataTypes';
import { fetchAllCompanies } from '../../../services/CompanyServices';
import { fetchAllInternships } from '../../../services/InternshipServices';
import avatarCompany from "../../../assets/images/avatarCompany/67c66a67e42a81741056615.webp"
import { Link } from 'react-router-dom';
import { fetchMajorFilters } from '../../../services/MajorServices';
import { getStudent, getStudentByAccountId, getStudentInStorage } from '../../../services/StudentServices';

const JobOpportunities: React.FC = () => {
    const [majorData, setMajorData] = useState<Major[]>([]);
    const [companyData, setCompanyData] = useState<Company[]>([]);
    const [internshipData, setInternshipData] = useState<Internship[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<Student | null>(null);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchMajorList = async () => {
        try {
            setLoading(true);
            const majorList = await fetchMajorFilters();
            if (Array.isArray(majorList)) {
                setMajorData(majorList);
            } else {
                throw new Error("Invalid data format: expected an array.");
            }
        } catch {
            setError("Failed to fetch major list.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyList = async () => {
        try {
            setLoading(true);
            const companyList = await fetchAllCompanies();
            if (Array.isArray(companyList)) {
                setCompanyData(companyList);
            } else {
                throw new Error("Invalid data format: expected an array.");
            }
        } catch {
            setError("Failed to fetch company list.");
        } finally {
            setLoading(false)
        }
    };

    const fetchAllInternshipList = async () => {
        try {
            setLoading(true)
            const internshipList = await fetchAllInternships(
                page,
                9,
                searchTerm,
                selectedMajorId,
                selectedCompanyId,
            );
            if (internshipList && internshipList.items) {
                setInternshipData(internshipList.items);
                setTotalPages(internshipList.totalPages);
            } else {
                throw new Error("Invalid data format: expected an array.");
            }
        } catch {
            setError("Failed to fetch internship list.");
        } finally {
            setLoading(false)
        }
    };

    const fetchStudentByAccountId = async () => {
        const studentData = await getStudent();
        console.log({ studentData });
        if (studentData) {
            setStudentData(studentData);
        }
    }

    useEffect(() => {
        fetchMajorList();
        fetchCompanyList();
        fetchAllInternshipList();
        fetchStudentByAccountId();
    }, []);

    const prevPage = async () => {
        if (page > 1) {
            await setPage(page - 1)
        }
    }
    const nextPage = async () => {
        if (page < totalPages) {
            await setPage(page + 1)
        }
    }
    useEffect(() => {
        fetchAllInternshipList();
    }, [page, searchTerm, selectedMajorId, selectedCompanyId]);

    const handleMajorChange = (majorId: string) => {
        const numericId = majorId ? parseInt(majorId) : null;
        setSelectedMajorId(numericId);
    };

    const handleCompanyChange = (companyId: string) => {
        const numericId = companyId ? parseInt(companyId) : null;
        setSelectedCompanyId(numericId);
    };

    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container vh-100 p-5 ">
                    {/* Notification */}
                    {studentData?.applyStatus === "Registered for Internship" && (
                        <div className="alert alert-danger alert-dismissible fade show">
                            <div>
                                <p>LƯU Ý: Tại mỗi đợt apply sinh viên chỉ ứng tuyển duy nhất 01 vị trí. Trường hợp NOT PASSED sẽ được tiếp tục hỗ trợ ứng tuyển doanh nghiệp khác. Vì vậy, sinh viên vui lòng đọc kỹ JD trước khi ứng tuyển!</p>
                            </div>
                        </div>
                    )}


                    <div className="row">
                        {/* Filter Section */}
                        <div className="col-md-6 mx-auto">

                            <div className="d-flex align-items-center mb-3">
                                <strong className="mr-2">Filter:</strong>
                                <div className="btn-group mr-2 ml-5">
                                    <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">
                                        Major
                                    </button>
                                    <div id="filerDropdown" className="dropdown-menu p-3" style={{ width: '250px' }}>
                                        <div>
                                            <label className="d-block">
                                                <input
                                                    type="radio"
                                                    name="major"
                                                    value=""
                                                    checked={!selectedMajorId}
                                                    onChange={() => handleMajorChange("")}
                                                /> <strong>All Majors</strong>
                                            </label>
                                            {majorData.map(major => (
                                                <label key={major.majorId} className="d-block">
                                                    <input
                                                        type="radio"
                                                        name="major"
                                                        value={major.majorId}
                                                        checked={selectedMajorId === major.majorId}
                                                        onChange={() => handleMajorChange(major.majorId.toString())}
                                                    /> {major.majorName}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-group mr-2 ml-5">
                                    <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">
                                        Company
                                    </button>
                                    <div id="filerDropdown" className="dropdown-menu p-3" style={{ width: '250px' }}>
                                        <div>
                                            <label className="d-block">
                                                <input
                                                    type="radio"
                                                    name="company"
                                                    value=""
                                                    checked={!selectedCompanyId}
                                                    onChange={() => handleCompanyChange("")}
                                                /> <strong>All Companies</strong>
                                            </label>
                                            {companyData.map(company => (
                                                <label key={company.companyId} className="d-block">
                                                    <input
                                                        type="radio"
                                                        name="company"
                                                        value={company.companyId}
                                                        checked={selectedCompanyId === company.companyId}
                                                        onChange={() => handleCompanyChange(company.companyId.toString())}
                                                    /> {company.companyName}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="col-md-4">
                            <div className="input-group">
                                <input placeholder="Search job" value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                    }}
                                    className="btn btn-warming ml-1 border-1 rounded rounded-1"
                                >
                                    <i className="fa ti-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {internshipData.map(internship => (
                            <div key={internship.internshipId} className="col-md-4 col-sm-6 feature-job job-ta">
                                <div className="feature-job-item">
                                    <div className="box-body d-flex">
                                        <a href="">
                                            <div className="box-company-logo">
                                                <div className="avatar">
                                                    <img src={internship.companyLogo ? internship.companyLogo : avatarCompany} alt="" />
                                                </div>
                                            </div>
                                        </a>
                                        <div className="col-title cvo-flex-grow">
                                            <h3>
                                                <Link className="title" to={`/internship/detail/${internship.internshipId}`}>
                                                    <strong className="job_title">
                                                        {internship.position}
                                                    </strong>
                                                </Link>
                                            </h3>
                                            <a className="text-silver company text_ellipsis company_name">
                                                <span>{internship.companyName} </span>
                                            </a>
                                        </div>

                                    </div>
                                    <div className="box-footer ">
                                        <div className="d-flex">
                                            <div className="col-job-info salary">
                                                <span className="text_ellipsis">
                                                    {internship.salary / 2} - {internship.salary} triệu
                                                </span>
                                            </div>
                                            <div className="col-job-info location">
                                                <span className="text_ellipsis">
                                                    {internship.companyLocation}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='feature-job-page'>
                        <div className='content'>
                            <a onClick={() => prevPage()}>
                                <span className='btn-feature-jobs-pre btn-slick-arrow'>
                                    <i className='ti-angle-left'></i>
                                </span>
                            </a>
                            <div className='feature-job-page_text'>
                                <p className='slick-pagination'>
                                    <span className='hight-light'>{page}</span> / {totalPages} trang
                                </p>
                            </div>
                            <a onClick={() => nextPage()}>
                                <span className="btn-feature-jobs-next btn-slick-arrow">
                                    <i className="ti-angle-right"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default JobOpportunities;