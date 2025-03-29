import { useEffect, useState } from "react"
import { Company } from "../../types/DataTypes"
import { fetchCompanies } from "../../services/CompanyServices";
import avatarCompany from "../../assets/images/avatarCompany/67c66a67e42a81741056615.webp"
import { Link } from "react-router-dom";


const Companies: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>(" ");
    const [companiesData, setComaniesData] = useState<Company[]>([])
    const [error, setError] = useState<string>("");

    const fetchCompaniesList = async () => {
        try {
            setLoading(true);
            const companiesList = await fetchCompanies(
                page,
                9,
                searchTerm
            );
            if (companiesList && companiesList.items) {
                console.log(companiesList.items)
                setComaniesData(companiesList.items);
                setTotalPages(companiesList.totalPages);
            } else {
                throw new Error("Invalid data format: expected an array.");
            }
        } catch {
            setError("Failed to fetch internship list.");
        } finally {
            setLoading(false);
        }
    }
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

    const showAll = async () => {
        setSearchTerm("");
    }

    useEffect(() => {
        if (searchTerm === "") {
            fetchCompaniesList();
        }
    }, [page, searchTerm]);


    return (
        <div className="container p-5">
            <div className="col-md-12 pt-3 input-group">
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" name="companyNameSearch" id="companyNameSearch" className="form-control border border-1 rounded rounded-1" placeholder="Search Company"></input>
                <span className="input-group-btn">
                    <button onClick={() => fetchCompaniesList()} className="btn btn-primary ml-1 border-1 rounded rounded-1">
                        <i className="fa ti-search"></i>
                    </button>
                </span>
            </div>
            <div id="showAllCompaniesBlock" className="container my-3 ">
                {totalPages < 1 && (
                    <div className="col-md-12 text-center">
                        <button onClick={() => showAll()} id="showAllCompaniesButton" type="button" className="btn btn-primary showAllCompaniesButton rounded rounded-1">Show All Companies</button>
                    </div>
                )}
                <div className='row'>
                    {companiesData.map(company => (
                        <div className="col-md-4 col-sm-6 feature-job job-ta">
                            <div className="feature-job-item">
                                <div className="box-body d-flex">
                                    <a href="">
                                        <div className="box-company-logo">
                                            <div className="avatar">
                                                <img src={String(company.avatar || avatarCompany)} alt="Avatar Company" />
                                            </div>
                                        </div>
                                    </a>
                                    <div className="col-title cvo-flex-grow">
                                        <h3>
                                            <Link className="title" to={`/company/detail/${company.companyId}`}>
                                                <strong className="job_title">
                                                    {company.companyName}
                                                </strong>
                                            </Link>
                                        </h3>
                                        <a className="text-silver company text_ellipsis company_name">
                                            <span>{company.phoneNumber} </span>
                                        </a>
                                    </div>

                                </div>
                                <div className="box-footer ">
                                    <div className="d-flex">
                                        <div className="col-job-info location">
                                            <span className="text_ellipsis">
                                                {company.address}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 0 && (
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
                )}
            </div>
        </div>
    )
}

export default Companies