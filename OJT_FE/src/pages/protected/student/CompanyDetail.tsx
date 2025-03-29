import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCompanyById } from "../../../services/CompanyServices";
import { Company, Internship } from "../../../types/DataTypes";
import { fetchAllInternships } from "../../../services/InternshipServices";

const avatarCompany = "/src/assets/images/samples/300x300/1.jpg"; // Cập nhật đường dẫn nếu cần thiết
const CompanyDetail: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [CompanyData, setCompanyData] = useState<Company>();
    const [internshipList, setInternshipList] = useState<Internship[]>([]);
    const [pageJob, setPageJob] = useState<number>(1);
    const [totalPageJob, setTotalPageJob] = useState<number>(0);

    const [jobSearch, setJobSearch] = useState<string>("");

    const { id } = useParams<{ id: string }>();
    const fetchCompanyDetail = async () => {
        try {
            setLoading(true);
            if (id) {
                const data = await fetchCompanyById(id)
                if (data) {
                    setCompanyData(data);
                } else {
                    console.error("Fetched data is null");
                }
            } else {
                console.error("ID is undefined");
            }
        } catch (error) {
            setError("Failed to fetch company details");
        } finally {
            setLoading(false);
        }
    }

    const fetchJobByCompany = async (id: string) => {
        try {
            setLoading(true);
            const jobs = await fetchAllInternships(
                pageJob,
                5,
                jobSearch,
                null,
                parseInt(id)
            )
            setInternshipList(jobs.items);
            setTotalPageJob(jobs.totalPages);
        } catch {
            setError("Failed to fetch internship list.");
        } finally {
            setLoading(false);
        }
    }
    const prevPage = async () => {
        if (pageJob > 1) {
            await setPageJob(pageJob - 1)
        }
    }
    const nextPage = async () => {
        if (pageJob < totalPageJob) {
            await setPageJob(pageJob + 1)
        }
    }

    useEffect(() => {
        if (id) {
            fetchCompanyDetail();
            fetchJobByCompany(id);
        } else {
            console.error("ID is undefined");
        }
    }, [id, pageJob]);

    return (
        <div className="container-fluid bg-light">
            <div className="container p-5">
                {CompanyData ? (
                    <>
                        <div className="body-partner-detail">
                            <div className="job-detail__body">
                                <div className="job-detail__body-left">
                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">
                                        <div className="job-detail__info--title">
                                            <h1 className="bold job-detail__info--title">{CompanyData.companyName}</h1>
                                        </div>
                                        <div className="row">
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Tax Number:&nbsp;
                                                </b>
                                                {CompanyData.phoneNumber}
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Website:&nbsp;
                                                </b>
                                                <span >
                                                    <a href={CompanyData.websiteUrl}
                                                        target="_blank"
                                                        style={{ wordBreak: 'break-all' }}>
                                                        {CompanyData.websiteUrl}
                                                    </a>
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Address:&nbsp;
                                                </b>
                                                <span>
                                                    {CompanyData.address}, {CompanyData.location}
                                                </span>
                                            </div>
                                            <div className="summary-item col-md-6 mb-2 mt-4">
                                                <b>
                                                    <i className=""></i>
                                                    Đánh giá mức độ hài lòng của sinh viên về doanh nghiệp:&nbsp;
                                                </b>
                                                <span>
                                                    <code>
                                                        Chưa có đánh giá từ sinh viên
                                                    </code>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">
                                        <div className="d-flex justify-content-between align-items-center job-detail__information-detail--title-container">
                                            <h2 className="job-detail__information-detail--title">Tuyển dụng</h2>
                                        </div>
                                        <div className="box-body">
                                            <div className="box-search">
                                                <div className="input-group">
                                                    <div className="input-group-prepend w-100">
                                                        <i className="ti-search"></i>
                                                        <input type="text" className="form-control" placeholder="Tên công việc, vị trí ứng tuyển..."></input>
                                                    </div>
                                                </div>
                                                <a className="btn btn-search btn-search-job-company">
                                                    <i className="ti-search"></i>
                                                    <span>Tìm kiếm</span>
                                                </a>
                                            </div>
                                            <div className="job-list-default">
                                                {internshipList.map(internship => (
                                                    <div className="job-item-default bg-highlight job-ta bg-flash-job">
                                                        <div className="avatar">
                                                            <img src={avatarCompany}></img>
                                                        </div>
                                                        <div className="body">
                                                            <div className="body-content">
                                                                <div className="title-block">
                                                                    <div>
                                                                        <h3 className="title">
                                                                            <Link className="title" to={`/internship/detail/${internship.internshipId}`}>
                                                                                <span>{internship.position} </span>
                                                                            </Link>
                                                                        </h3>
                                                                    </div>
                                                                    <div className="box-right">
                                                                        <label className="title-salary">
                                                                            <i className="ti-money"></i>
                                                                            {Math.round(internship.salary / 3 * 2)} - {internship.salary} triệu
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="info">
                                                                <div className="label-content">
                                                                    <label className="address"> Hà Nội</label>
                                                                </div>
                                                                <div className="icon">
                                                                    <button className="btn btn-apply-now"><span>Ứng tuyển</span></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {totalPageJob > 0 && (
                                                <div className='feature-job-page'>
                                                    <div className='content'>
                                                        <a onClick={() => prevPage()}>
                                                            <span className='btn-feature-jobs-pre btn-slick-arrow'>
                                                                <i className='ti-angle-left'></i>
                                                            </span>
                                                        </a>
                                                        <div className='feature-job-page_text'>
                                                            <p className='slick-pagination'>
                                                                <span className='hight-light'>{pageJob}</span> / {totalPageJob} trang
                                                            </p>
                                                        </div>
                                                        <a onClick={() => nextPage()}>
                                                            <span className="btn-feature-jobs-next btn-slick-arrow">
                                                                <i className="ti-angle-right"></i>
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <div className="right col-md-3 ">
                                    <div className="image company-logo">
                                        <img src={String(CompanyData.avatar || avatarCompany)} alt="hcl-logo" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                ) : (
                    <>
                        <div>
                            <span>NOT FOUND</span>
                        </div>
                    </>
                )}
            </div>

        </div >
    )

}

export default CompanyDetail