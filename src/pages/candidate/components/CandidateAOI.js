import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import axios from 'axios';
import Loader from 'components/Loader';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateAOI = () => {
    const navigate = useNavigate();
    const [aoi, setAoi] = useState();
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
            if(data.aoi){
                setValue('aoi', data.aoi);
                setAoi(data.aoi);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setValue('aoi','');
                setAoi();
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
        if(aoi){
            setValue('aoi', aoi);
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
                <h6 className="mb-15">Area of interest</h6>
                <div className="mb-15 skill-span">
                    {aoi && aoi !== "" ? (
                        aoi.split(',').map((aoi) => (
                            <span key={aoi.trim()}>{aoi.trim()}</span>
                        ))
                    ) : (
                        <p className="mb-1">Add your area of interest here</p>
                    )}
                </div>
                <Link className="btn btn-main" onClick={() => openModal()}>{ aoi && aoi !== "" ? "Edit Interest" : "Add Interest"}</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Area of interest </h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    {isLoading && <Loader/>}
                    <p className="mb-15"> Add some of your best hobbies or interests. </p>
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <div className="mb-20">
                            <Form.Control placeholder="Ex : Sports, Blogging, Travel"
                                {...register('aoi',{
                                    required : "Area of interest is required"
                                })}
                                isInvalid = {errors?.aoi}
                            />
                            {errors?.aoi && errors.aoi.message && <span className="text-red-dark">{errors.aoi.message}</span>}
                            {err?.aoi && <span className="text-danger">{err?.aoi}</span>}
                        </div>
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

export default CandidateAOI;