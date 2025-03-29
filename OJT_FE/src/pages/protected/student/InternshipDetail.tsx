import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Internship } from "../../../types/DataTypes";
import { fetchInternshipById } from "../../../services/InternshipServices";
import { applyJob } from "../../../services/StudentServices";

interface PopupProps {
    message: string;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-lg shadow-xl z-10 relative">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">{message}</h3>
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

const avatarCompany = "/src/assets/images/samples/300x300/1.jpg";

const InternshipDetail: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const [internshipData, setInternshipData] = useState<Internship>();
    const [isApplying, setIsApplying] = useState(false);

    const fetchInternshipDetail = async () => {
        try {
            setLoading(true);
            if (id) {
                const data = await fetchInternshipById(id);
                console.log({ data })
                if (data) {
                    setInternshipData(data);
                } else {
                    console.error("Fetched data is null");
                }
            } else {
                console.error("ID is undefined");
            }
        } catch (error) {
            setError("Failed to fetch internship detail.");
        } finally {
            setLoading(false);
        }
    }

    const apply = async () => {
        if (isApplying) return;

        try {
            setIsApplying(true);
            if (id) {
                await applyJob(id);
                alert("Ứng tuyển thành công!"); // Hiện message box
                navigate('/internship/list'); // Chuyển trang sau khi user click OK
            } else {
                console.error("ID is undefined");
            }
        } catch (error) {
            setError("Failed to apply job.");
            alert("Ứng tuyển thất bại. Vui lòng thử lại.");
        } finally {
            setIsApplying(false);
        }
    }

    useEffect(() => {
        fetchInternshipDetail();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container-fluid bg-light">

            <div className="container p-5">
                {internshipData ? (
                    <>
                        <div className="body-partner-detail">
                            <div className="job-detail__body">
                                <div className="job-detail__body-left">
                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">
                                        <div className="job-detail__info--title">
                                            <h1 className="bold job-detail__info--title">{internshipData.position}</h1>
                                        </div>
                                        <div className="job-detail__info--sections">
                                            <div className="job-detail__info--section">
                                                <span className='job-detail__info--section-icon'>
                                                    <i className='ti-money'></i>
                                                </span>
                                                <div className="job-detail__info--section-content">
                                                    <div>Thu nhập</div>
                                                    <div>
                                                        <strong>{Math.round(internshipData.salary / 3 * 2)} - {internshipData.salary} triệu</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="job-detail__info--section">
                                                <span className='job-detail__info--section-icon'>
                                                    <i className='ti-location-pin'></i>
                                                </span>
                                                <div className="job-detail__info--section-content">
                                                    <div>Địa điểm</div>
                                                    <div>
                                                        <strong>{internshipData.companyAddress}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="job-detail__info--section">
                                                <span className='job-detail__info--section-icon'>
                                                    <i className='ti-time'></i>
                                                </span>
                                                <div className="job-detail__info--section-content">
                                                    <div>Kinh nghiệm</div>
                                                    <div>
                                                        <strong>Không yêu cầu</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="job-detail__info--actions box-apply-current">
                                            <button
                                                onClick={apply}
                                                disabled={isApplying}
                                                className={`job-detail__info--actions-button button-primary ${isApplying ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="button-icon">
                                                    <i className="ti-email"></i>
                                                </span>
                                                {isApplying ? 'Đang xử lý...' : 'Ứng tuyển ngay'}
                                            </button>
                                        </div>
                                    </div>

                                    <div id="job-detail__box--left job-detail__info" className="job-detail__box--left job-detail__info">
                                        <div className="d-flex justify-content-between align-items-center job-detail__information-detail--title-container">
                                            <h2 className="job-detail__information-detail--title">Chi tiết tin tuyển dụng</h2>
                                        </div>
                                        <div className="job-detail__information-container">
                                            <div className="job-detail__information-detail--content">
                                                <div className="job-description">
                                                    <div className="job-description__item">
                                                        <h3>Mô Tả công việc</h3>
                                                        <div className="job-description__item--content">{internshipData.description}</div>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Yêu cầu ứng tuyển</h3>
                                                        <div className="job-description__item--content">{internshipData.requirement}</div>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Thu nhập</h3>
                                                        <div className="job-description__item--content">
                                                            <ul>
                                                                <li>Thu nhập khi đạt 100% KPI: {internshipData.salary} triệu</li>
                                                                <li>Lương cứng: {Math.round(internshipData.salary / 3)} - {Math.round(internshipData.salary / 2)} triệu</li>
                                                                <li>Lương cứng không phụ thuộc doanh số</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Thời gian làm việc</h3>
                                                        <div className="job-description__item--content">
                                                            <ul>
                                                                <li>Thứ 2 - Thứ 6 (từ 08:00 đến 17:30)</li>
                                                                <li>Thứ 7 (từ 08:00 đến 12:00)</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="job-description__item">
                                                        <h3>Quyền lợi</h3>
                                                        <div className="job-description__item--content">{internshipData.benefits}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-detail__body-right">
                                    <div className="job-detail__box--right job-detail__company">
                                        <div className="job-detail__company--information">
                                            <div className="job-detail__company--information-item company-name">
                                                <Link className="company-logo" to="">
                                                    <img src={String(internshipData.companyLogo || avatarCompany)} alt="company-logo" />
                                                </Link>
                                                <h2 className="company-name-label">
                                                    <p className="name">{internshipData.companyName}</p>
                                                </h2>
                                            </div>
                                            <div className="job-detail__company--information-item company-address">
                                                <div className="company-title">
                                                    <i className="ti-location-pin"></i>
                                                    <strong className="title-location"> Địa điểm:</strong>
                                                </div>
                                                <div className="company-value">
                                                    {internshipData.companyLocation}, {internshipData.companyAddress}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="job-detail__company--link">
                                            <Link to={`/company/detail/${internshipData.companyID}`}>
                                                Xem trang công ty
                                            </Link>
                                            <i className="ti-new-window"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy thông tin tuyển dụng</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InternshipDetail;