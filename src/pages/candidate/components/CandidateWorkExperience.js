import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useForm } from 'react-hook-form';
import Loader from 'components/Loader';
import axios from 'axios';
import ConfirmPopup from 'components/ConfirmPopup';
import LoaderButton from 'components/LoaderButton';
import { ToastContainer, toast } from 'react-toastify';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateWorkExperience = () => {
    const navigate = useNavigate();
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [workExp, setWorkExp] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteItemSlug, setDeleteItemSlug] = useState();
    const [err, setErr] = useState();
    const { register, handleSubmit, formState : {errors}, reset, setValue } = useForm();

    // Candidate Detail
    const getCandidate = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'candidate-details/'+userid+'/'+usertype,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            const data = response.data.candidate_detail;
            if(data.workExperience){
                setWorkExp(data.workExperience);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setWorkExp();
                setIsEdit(false);
                setIsLoading(false);
            }
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
            setIsLoading(false);
            navigate('/login');
        }
    },[userid, token, clearStorage, navigate, usertype]);

    const openModal = () => {
        reset();
        setErr();
        setIsEdit(false);
        setModalShow(true);
    }

    const closeModal = () => {
        reset();
        setIsEdit(false);
        setModalShow(false)
    }

    // Save or update
    const handleSave = async (data) => {
        let add_workExp = [];
        if(workExp){
            add_workExp = workExp;
        }
        if(isEdit){
            add_workExp = add_workExp.map(workExp => (workExp._id === data._id ? data : workExp));
            let flag = "edit";
            handleData(add_workExp,flag);
        } else {
            add_workExp.push(data);
            let flag = "new";
            handleData(add_workExp,flag);
        }
    }

    // Edit Education
    const handleEdit = (id) => {
        setIsEdit(true);
        setErr();
        if(workExp){
            let edit_workExp = workExp.find(workExp => workExp._id === id);
            for(const key in edit_workExp){
                setValue(key, edit_workExp[key]);
            }
        }
        setModalShow(true);
    }

    // Confirm Popup
    const handleConfirmPopup = async (id) => {
        setDeleteItemSlug(id);
        setShowConfirm(true);
    }

    // Delete Education
    const handleConfirmDelete = (id) => {
        if(workExp){
            let delete_workExp = workExp.filter(workExp => workExp._id !== id);
            let flag = "delete";
            handleData(delete_workExp,flag);
            setShowConfirm(false);
        }
    }

    // Handle save or update or delete data
    const handleData = async (add_workExp,flag) => {
        setIsButtonLoading(true);
        const response = await axios.put(`${BASE_API_URL}candidate-details/${userid}`,{ workExperience: add_workExp },{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            getCandidate();
            setModalShow(false);
            setIsEdit(false);
            setIsButtonLoading(false);
            handleToast(flag);
        } else if(response?.data?.result === false){
            if(response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr",LOGIN_ERR);
                setIsButtonLoading(false);
                navigate('/login');
            } else {
                setIsButtonLoading(false);
                const errors = {};
                let err = response?.data?.errors;
                if(err){
                    Object.keys(err).forEach((key) => {
                        const errorKey = key.split('.')[2];
                        errors[errorKey] = err[key];
                    });
                    setErr(errors);
                    if(flag === "new"){
                        workExp?.pop();
                    }
                }
            }
        }
    }

    const handleToast = (flag) => {
        if(flag === "new"){
            toast.success("Work experience added successfully",{theme: "colored"});
        } else if (flag === "edit") {
            toast.success("Work experience updated successfully",{theme: "colored"});
        } else if (flag === "delete") {
            toast.success("Work experience deleted successfully",{theme: "colored"});
        }
    }

    // Close Confirm popup
    const handleCloseConfirm = () => {
        setShowConfirm(false);
    }

    const renderSaveOrUpdateButton = () => {
        if (isEdit) {
            return "Update";
        } else {
            return "Save";
        }
    };

    const renderWorkExp = (work,index) => (
        <React.Fragment key={index}>
            <div>
                <p className="mb-0">
                    <span className="font-bold me-2">{work.companyName}</span>
                    <span className="text-success me-1"><FaEdit onClick={()=>handleEdit(work._id)} /></span>
                    <span className="text-danger"><FaRegTrashAlt onClick={()=>handleConfirmPopup(work._id)} /></span>
                </p>
                <p className="mb-0">{work.workTitle ? 'Role : '+work.workTitle : ''}</p>
                <p className="mb-0">{work.workFrom ? 'From : '+work.workFrom : ''}</p>
                <p className="mb-0">{work.workTo ? 'To : '+work.workTo : ''}</p>
                <p className="mb-0">{work.workDescription ? 'Description : '+work.workDescription : ''}</p>
            </div>
            {index < workExp?.length - 1 && <hr />}
        </React.Fragment>
    )

    useEffect(()=>{
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate]);

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Work & Experience</h6>
                {isLoading && <Loader/>}
                <div className="mb-15">
                    { workExp?.length > 0 ? (
                            workExp?.map((work,index) => (
                                renderWorkExp(work,index)
                            ))
                        ) : (
                            <p>Mention your work and experience details</p>
                        )
                    }
                </div>
                <Link className="btn btn-main" onClick={()=>openModal()}>Add Work & Experience</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Work & Experience</h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <Row className="g-2 mb-15">
                            <Col lg={6}>
                                <Form.Group>
                                    <Form.Label>Company name</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('companyName',{
                                            required : "Company name is required"
                                        })} 
                                        isInvalid = {errors?.companyName}
                                    />
                                    {errors?.companyName && errors.companyName.message && <span className="text-red-dark">{errors.companyName.message}</span>}
                                    {err?.companyName && <span className="text-danger">{err?.companyName}</span>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group>
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('workTitle',{
                                            required : "Role is required"
                                        })} 
                                        isInvalid = {errors?.workTitle}
                                    />
                                    {errors?.workTitle && errors.workTitle.message && <span className="text-red-dark">{errors.workTitle.message}</span>}
                                    {err?.workTitle && <span className="text-danger">{err?.workTitle}</span>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group>
                                    <Form.Label>From</Form.Label>
                                    <Form.Control type="date" 
                                        {...register('workFrom',{
                                            required : "From date is required"
                                        })}
                                        isInvalid = {errors?.workFrom}
                                    />
                                    {errors?.workFrom && errors.workFrom.message && <span className="text-red-dark">{errors.workFrom.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group>
                                    <Form.Label>To</Form.Label>
                                    <Form.Control type="date" 
                                        {...register('workTo')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={12}>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea"
                                        {...register('workDescription')}
                                        isInvalid = {errors?.workDescription}
                                    />
                                    {err?.workDescription && <span className="text-danger">{err?.workDescription}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex ">
                            <Button className="btn-main me-1 d-flex align-items-center" type="submit">
                                {isButtonLoading ? (
                                    <span className="me-1">{<LoaderButton />}</span>
                                    ) : (
                                    renderSaveOrUpdateButton()
                                )}
                            </Button>
                            <Button className="btn-cancel" onClick={() => closeModal()}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer />

            <ConfirmPopup
                show={showConfirm}
                onClose={handleCloseConfirm}
                onConfirm={()=>handleConfirmDelete(deleteItemSlug)}
                slug={deleteItemSlug}
                message = "Are you sure you want to delete work experience?"
            />
        </>
    )
}

export default CandidateWorkExperience;