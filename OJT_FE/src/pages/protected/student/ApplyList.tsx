import { useEffect, useState } from "react";
import { getListApplied } from "../../../services/StudentServices";
import { Apply } from "../../../types/DataTypes";
import { Link } from "react-router-dom";

const CvStudent: React.FC = () => {
    const [applyList, setApplyList] = useState<Apply[]>([]);
    const [Loading, setLoading] = useState<boolean>(true);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const applyListData = await getListApplied();
            console.log({ applyListData });
            if (applyListData && applyListData.data) {
                setApplyList(applyListData.data);
            } else {
                throw new Error("Invalid data format: expected an object with items.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAllData();
    }, []);


    return (
        <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Bordered table</h4>

                    <div className="table-responsive pt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Internship Position
                                    </th>
                                    <th>
                                        Company
                                    </th>
                                    <th>
                                        Time Apply
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            {applyList.length > 0 ? (
                                <tbody>
                                    {applyList.map((apply, index) => (
                                        <tr key={apply.applyId}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                <Link to={`/internship/detail/${apply.internshipID}`}>
                                                    {apply.internshipPosition}
                                                </Link>
                                            </td>
                                            <td>
                                                {apply.companyName}
                                            </td>
                                            <td>
                                                {new Date(apply.timeApply).toLocaleDateString()}
                                            </td>
                                            <td className={`status-cell ${apply.status === "Pending" ? "text-warning" :
                                                apply.status === "Approved" ? "text-success" :
                                                    apply.status === "Reject" ? "text-danger" : ""
                                                }`}>
                                                {apply.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <Link to="/internship/list" className="btn btn-primary ml-2">
                                                <i className="ti-angle-left mr-1"></i>
                                                Tìm việc ngay
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            )}

                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CvStudent;