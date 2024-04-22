import { useEffect, useState, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { validateDoc } from 'utils/docUtils';
import { FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'components/Loader';
import axios from 'axios';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateUploadResume = () => {
    const navigate = useNavigate();
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [ docValidationErr, setDocValidationErr] = useState();
    const [ resumeDoc, setResumeDoc ] = useState();
    const { control } = useForm();

    // Candidate Detail
    const getCandidate = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'candidate-details/'+userid+'/'+usertype,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            const data = response.data.candidate_detail;
            if(data.resume){
                setResumeDoc(data.resume);
            }
            setIsLoading(false);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
            setIsLoading(false);
            navigate('/login');
        }
    },[userid, token, clearStorage, navigate, usertype]);

    // Save Key Skills
    const handleDocChange = async (e) => {
        let file = e.target.files[0];
        setDocValidationErr();
        if (!validateDoc(file, setDocValidationErr)) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);
        const response = await axios.put(BASE_API_URL+'candidate-details/change-resume/'+userid,formData,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            setResumeDoc(response.data.resume);
            setIsLoading(false);
            toast.success("Resume updated successfully",{theme: 'colored'});
        }
    }

    useEffect(()=>{
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate]);

    return(
        <div className="white-cardbox">
            <h6 className="mb-15">{resumeDoc ? 'Change Resume' : 'Attach Resume'}</h6>
            {isLoading && <Loader/>}
            <p className="mb-30">Resume is the most important document recruiters look for. Recruiters generally do not look at profiles without resumes.</p>
            <Form>
                <div className="position-relative">
                    {resumeDoc && <Link to={resumeDoc} target="_blank" className="btn btn-main mb-30">Download Resume</Link>}
                    <label htmlFor="changeDoc" className="upload-document mb-30">
                        <FaUpload className="me-2" /> <div>Upload Resume File Size  is 2 MB</div>
                    </label>
                </div>
                <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                        <input 
                            type="file" 
                            id="changeDoc"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                field.onChange(e.target.files[0]);
                                handleDocChange(e);
                            }}
                        />
                    )}
                />
            </Form>                    
            {docValidationErr && <p className="text-danger mb-15">{docValidationErr}</p>}
            <p className="mb-15 text-center">If you do not have a resume document, you may write your brief professional profile here.</p>
            <ToastContainer/>
        </div>
    )
}

export default CandidateUploadResume;