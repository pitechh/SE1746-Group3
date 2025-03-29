import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageUploader from "../../../components/layout/ImageUploaderComponent";

const defaultAvatar = "/src/assets/images/samples/300x300/1.jpg";

const ProposalCreate: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const studentData = localStorage.getItem("studentData");
    const parsedStudentData = studentData ? JSON.parse(studentData) : null;

    const [formData, setFormData] = useState({
        jobPosition: "",
        taskDescription: "",
        companyName: "",
        address: "",
        employeeSize: "",
        taxNumber: "",
        websiteURL: "",
        hrMail: "",
        hrName: "",
        studentId: parsedStudentData?.studentId || "",
        status: "Pending"
    });

    const [location, setLocation] = useState<string>("");
    const [companyLogo, setCompanyLogo] = useState<File | null>(null);
    const [companyLogoPreview, setCompanyLogoPreview] = useState(defaultAvatar);
    const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
    const [evidenceImagePreview, setEvidenceImagePreview] = useState<string>("");
    const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
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
        fetchProvinces();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setCompanyLogo(file);
            const reader = new FileReader();
            reader.onload = () => {
                setCompanyLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEvidenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setEvidenceImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setEvidenceImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!companyLogo || !evidenceImage) {
            alert("Please provide all required images");
            setIsLoading(false);
            return;
        }

        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitFormData.append(key, value);
        });
        submitFormData.append("location", location);
        submitFormData.append("CompanyLogo", companyLogo);
        submitFormData.append("Evidences", evidenceImage);

        try {
            const response = await fetch("http://localhost:5028/api/Proposal/CreateProposal", {
                method: "POST",
                body: submitFormData
            });

            if (!response.ok) {
                throw new Error("Failed to create proposal");
            }
            if (response.status === 200) {
                navigate('/InternshipProposals', {
                    replace: true,
                    state: {
                        success: true,
                        message: "Proposal created successfully"
                    }
                });
            }
        } catch (error) {
            console.error("Error creating proposal:", error);
            alert("Failed to create proposal: " + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid bg-light">
            <div className="container p-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-9">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Create OJT Proposal</h2>
                                    <div className="mb-3">
                                        <label className="form-label">Evidence Image <code className="text-danger">*</code></label>
                                        {evidenceImagePreview && (
                                            <img src={evidenceImagePreview} alt="Evidence" className="mt-2 mb-2" style={{ width: "200px", height: "auto" }} />
                                        )}
                                        <input type="file" accept="image/*" onChange={handleEvidenceImageChange} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Location <code className="text-danger">*</code></label>
                                        <Select
                                            className="h-46px"
                                            options={provinces}
                                            placeholder="Select location"
                                            onChange={(selectedOption) => setLocation(selectedOption ? selectedOption.value : "")}
                                            isClearable
                                        />
                                    </div>
                                    {Object.entries(formData).map(([key, value]) => {
                                        if (key === "studentId" || key === "status") {
                                            return (
                                                <div className="mb-3" key={key}>
                                                    <input type="hidden" className="form-control" id={key} value={value} disabled />
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="mb-3" key={key}>
                                                <label htmlFor={key} className="form-label">{key.replace(/([A-Z])/g, " $1").trim()} <code className="text-danger">*</code></label>
                                                <input type={key === "hrMail" ? "email" : "text"} className="form-control" id={key} value={value} onChange={handleInputChange} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Company Logo</h5>
                                    <ImageUploader defaultImage={companyLogoPreview} onImageChange={handleCompanyLogoChange} className="w-100 mb-3" />
                                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? "Saving..." : "Save Proposal"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProposalCreate;