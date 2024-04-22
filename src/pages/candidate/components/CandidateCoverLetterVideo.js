import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import Ratio from 'react-bootstrap/Ratio';
import { useForm } from 'react-hook-form';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import axios from 'axios';
import Loader from 'components/Loader';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateCoverLetterVideo = () => {
    const navigate = useNavigate();
    const [coverLetter, setCoverLetter] = useState();
    const [videoResume, setVideoResume] = useState();
    const [modalShow, setModalShow] = useState(false);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [err, setErr] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, formState:{errors}, reset, setValue} = useForm();

    // Candidate Detail
    const getCandidate = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'candidate-details/'+userid+'/'+usertype,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            const data = response.data.candidate_detail;
            if(data.coverLetter || data.videoResume){
                setValue('coverLetter', data.coverLetter);
                setCoverLetter(data.coverLetter);
                setValue('videoResume', data.videoResume);
                setVideoResume(data.videoResume);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setValue('coverLetter','');
                setCoverLetter();
                setValue('videoResume','');
                setVideoResume();
                setIsEdit(false);
                setIsLoading(false);
            }
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
            setIsLoading(false);
            navigate('/login');
        }
    },[userid, token, clearStorage, navigate, setValue, usertype]);

    // Save Key Skills
    const handleSave = async (data) => {
        setIsLoading(true);
        const response = await axios.put(BASE_API_URL+'candidate-details/'+userid,data,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            getCandidate();
            setModalShow(false);
            setIsLoading(false);
        } else if(response?.data?.result === false){
            if(response?.data?.message === "Token Expired"){
                clearStorage();
                sessionStorage.setItem("loginErr",LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            } else{
                setIsLoading(false);
                setErr(response.data.errors);
            }
        }
    }

    // Open Modal
    const openModal = () => {
        if(!isEdit){
            reset();
        }
        if(coverLetter){
            setValue('coverLetter', coverLetter);
        }
        if(videoResume){
            setValue('videoResume', videoResume);
        }
        setErr();
        setModalShow(true);
    }

    const closeModal = () => {
        reset();
        setModalShow(false)
    }

    useEffect(()=>{
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate]);

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Cover Letter and Video</h6>
                {/* {isLoading && <Loader/>} */}
                <div className="mb-15 skill-span">
                    {coverLetter || videoResume ? (
                        <>
                            <p className="mb-10"> {coverLetter} </p>
                            { videoResume && 
                                <Ratio aspectRatio="16x9">
                                    <iframe src={videoResume} title="Resume video" allowFullScreen></iframe>
                                </Ratio>
                            }
                        </>
                    ) : (
                        <p className="mb-1">Introduce yourself and summarizes your professional background here. Add video resume here.</p>
                    )}
                </div>
                <Link className="btn btn-main" onClick={() => openModal()}>{ coverLetter && coverLetter !== "" ? "Edit" : "Add"}</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Cover letter and video resume </h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    {isLoading && <Loader/>}
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <Form.Group className="mb-15">
                            <Form.Label>Cover letter</Form.Label>
                            <Form.Control as="textarea" rows="5"
                                {...register('coverLetter',{
                                    required : "Cover letter is required"
                                })}
                                isInvalid = {errors?.coverLetter}
                            />
                            {errors?.coverLetter && errors.coverLetter.message && <span className="text-red-dark">{errors.coverLetter.message}</span>}
                            {err?.coverLetter && <span className="text-danger">{err?.coverLetter}</span>}
                        </Form.Group>
                        <Form.Group className="mb-15">
                            <Form.Label className="mb-0">Video resume link</Form.Label>
                            <Form.Label><span className="text-orange">(Add video embedded link. Ex:-https://www.youtube.com/embed/D0UnqGm_miA?si=oTiKOBtfNHoVAkC_)</span></Form.Label>
                            <Form.Control type="text" {...register('videoResume')} />
                            {err?.videoResume && <span className="text-danger">{err?.videoResume}</span>}
                        </Form.Group>
                        
                        <div className="d-flex">
                            <Button className="btn-main me-1" type="submit">Save</Button>
                            <Button className="btn-cancel" onClick={() => closeModal()}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CandidateCoverLetterVideo;