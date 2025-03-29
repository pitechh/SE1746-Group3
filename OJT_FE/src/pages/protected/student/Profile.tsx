import React, { useEffect, useState } from 'react';
import { Account } from '../../../types/DataTypes';
import AuthService from '../../../services/AuthService';
import { getStudentByAccountId, getStudentInStorage } from '../../../services/StudentServices';
import axios from 'axios';

const Profile = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [accountData, setAccountData] = useState<Account | null>();
    const [studentData, setStudentData] = useState<any>(null);
    const [cvData, setCvData] = useState<string>("");
    const [newCvFile, setNewCvFile] = useState<File | null>(null);

    const getCvFileName = (url: string) => {
        if (!url) return '';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userData = await AuthService.getUserInfo();
            if (!userData) return;
            setAccountData(userData);
            const studentData = await getStudentByAccountId(userData.accountId);
            setStudentData(studentData);
            setCvData(getCvFileName(studentData?.cvImage));
        } catch {
            console.error("Failed to fetch profile data.");
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewCvFile(file);
        }
    };

    const handleSaveCv = async () => {
        if (!newCvFile) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', newCvFile);
            const token = localStorage.getItem('accessToken');

            await axios.post('http://localhost:5028/api/Student/students/upload-cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            // Refresh data after successful upload
            await fetchProfileData();
            setNewCvFile(null);
        } catch (error) {
            console.error('Error uploading CV:', error);
        } finally {
            setUploading(false);
            fetchProfileData();
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    return (
        <div id="profile" className="container rounded mt-5 mb-5">
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5" style={{ gap: '10px' }}>
                        {/* <input
                            type="file"
                            name="studentImage"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        <div
                            className="d-flex justify-content-center align-items-center rounded-circle"
                            style={{ width: "150px", height: "150px", overflow: "hidden" }}
                        >
                            <img
                                id="selectedImage"
                                alt=""
                                className="img-fluid"
                                src="/StudentImages/StudentImages"
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            name="ImageUrl"
                            defaultValue=""
                            hidden
                        />
                        <small id="imageInputText" className="m-2">Change your profile picture here</small> */}
                        <span className="font-weight-bold mt-1">{accountData?.fullname}</span>
                        <span className="text-black-50">Status: {studentData?.applyStatus}</span>
                        <span className="">
                            {studentData?.cvImage && (
                                <a
                                    href={studentData.cvImage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary"
                                >
                                    View CV
                                </a>
                            )}</span>
                    </div>
                </div>
                <div className="col-md-9 border-right">
                    <div className="p-3 py-2 profile-section" id="profileSection">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Profile Settings</h4>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 mt-2">
                                <label className="labels">Full Name<span className="required-color">  <code>*</code></span></label>
                                <input type="text" className="form-control" name="FullName" id="fullNameInput" defaultValue={accountData?.fullname} readOnly />
                            </div>
                            <div className="col-md-6 mt-2">
                                <label className="labels">Student Code<span className="required-color">  <code>*</code></span></label>
                                <input type="text" className="form-control" name="FullName" id="fullNameInput" defaultValue={studentData?.studentCode} readOnly />
                            </div>
                            <div className="col-md-6 mt-2">
                                <div className="form-group">
                                    <label>Specialization<span className="required-color"> </span></label>
                                    <input type="text" name="SpecializationName" readOnly className="form-control" defaultValue={studentData?.major} />
                                </div>
                            </div>

                            <div className="col-md-6 mt-2">
                                <label className="labels">Email<span className="required-color">  <code>*</code></span></label>
                                <input type="text" className="form-control" name="Email" defaultValue={accountData?.email} readOnly />
                            </div>
                            <div className="col-md-6 mt-2">
                                <label className="labels">Address<span className="required-color">  <code>*</code></span></label>
                                <input type="text" className="form-control" name="Address" defaultValue={studentData?.address} readOnly />
                            </div>
                        </div>
                        <div className="row mt-3 cv">
                            <div className="col-md-12 mt-2">
                                <div className="form-group">
                                    <div className="form-group">
                                        <label>Update Cv</label>
                                        <input
                                            type="file"
                                            name="avatar"
                                            className="file-upload-default"
                                            onChange={handleFileChange}
                                        />
                                        <div className="input-group col-xs-12">
                                            <input
                                                type="text"
                                                className="form-control file-upload-info"
                                                disabled
                                                placeholder="Upload Cv"
                                                defaultValue={newCvFile ? newCvFile.name : ''}
                                            />
                                            <span className="input-group-append">
                                                <button
                                                    className="file-upload-browse btn btn-primary"
                                                    type="button"
                                                    onClick={() => (document.querySelector('input[name="avatar"]') as HTMLInputElement)?.click()}
                                                >
                                                    Upload
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        {newCvFile && (
                                            <button
                                                type="button"
                                                className="btn btn-primary showAllCompaniesButton rounded rounded-1"
                                                onClick={handleSaveCv}
                                                disabled={uploading}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    'Save'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;