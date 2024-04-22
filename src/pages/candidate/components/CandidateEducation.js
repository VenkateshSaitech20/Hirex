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
import { ToastContainer, toast } from 'react-toastify';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateEducation = () => {
    const navigate = useNavigate();
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [education, setEducation] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            if(data.education){
                setEducation(data.education);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setEducation();
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
        let add_education = [];
        if(education){
            add_education = education;
        }
        if(isEdit){
            add_education = add_education.map(education => (education._id === data._id ? data : education));
            let flag = "edit";
            handleData(add_education,flag);
        } else {
            add_education.push(data);
            let flag = "new";
            handleData(add_education,flag);
        }
    }

    // Edit Education
    const handleEdit = (id) => {
        setIsEdit(true);
        setErr();
        if(education){
            let edit_education = education.find(education => education._id === id);
            for(const key in edit_education){
                setValue(key, edit_education[key]);
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
        if(education){
            let delete_education = education.filter(education => education._id !== id);
            let flag = "delete";
            handleData(delete_education,flag);
            setShowConfirm(false);
        }
    }

    // Handle save or update or delete data
    const handleData = async (add_education,flag) => {
        setIsLoading(true);
        const response = await axios.put(`${BASE_API_URL}candidate-details/${userid}`,{ education: add_education },{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            getCandidate();
            setModalShow(false);
            setIsEdit(false);
            setIsLoading(false);
            handleToast(flag);
        } else if(response?.data?.result === false){
            if(response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr",LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            } else {
                setIsLoading(false);
                const errors = {};
                let err = response?.data?.errors;
                if(err){
                    Object.keys(err).forEach((key) => {
                        const errorKey = key.split('.')[2];
                        errors[errorKey] = err[key];
                    });
                    setErr(errors);
                    if(flag === "new"){
                        education?.pop();
                    }
                }
            }
        }
    }

    const handleToast = (flag) => {
        if(flag === "new"){
            toast.success("Education added successfully",{theme: "colored"});
        } else if (flag === "edit") {
            toast.success("Education updated successfully",{theme: "colored"});
        } else if (flag === "delete") {
            toast.success("Education deleted successfully",{theme: "colored"});
        }
    }

    // Close Confirm popup
    const handleCloseConfirm = () => {
        setShowConfirm(false);
    }

    useEffect(()=>{
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate]);

    const renderEducation = (edu, index) => (
        <React.Fragment key={index}>
            <div>
                <p className="mb-0">
                    <span className="font-bold me-2">{edu.degree}</span>
                    <span className="text-success me-1"><FaEdit onClick={() => handleEdit(edu._id)} /></span>
                    <span className="text-danger"><FaRegTrashAlt onClick={() => handleConfirmPopup(edu._id)} /></span>
                </p>
                <p className="mb-0">{edu.gradYear ? 'Year : '+edu.gradYear : ''}</p>
                <p className="mb-0">{edu.specialization ? 'Specialization : '+edu.specialization : ''}</p>
                <p className="mb-0">{edu.gpa ? 'GPA : '+edu.gpa+'%' : ''}</p>
                <p className="mb-0">
                    {edu.college ? 'College : '+edu.college : ''} 
                    {edu.college ? ',' : ''} 
                    {edu.university ? 'University : '+edu.university : ''} 
                    {edu.university ? ',' : ''} 
                    {edu.educationState ? edu.educationState : ''} 
                    {edu.educationState ? ',' : ''} 
                    {edu.educationCountry ? edu.educationCountry : ''}
                </p>
            </div>
            {index < education?.length - 1 && <hr />}
        </React.Fragment>
    );

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Education</h6>
                {/* {isLoading && <Loader/>} */}
                <div className="mb-15">
                    { education?.length > 0 ? (
                            education?.map((edu,index) => (
                                renderEducation(edu, index)
                            ))
                        ) : (
                            <p>Mention your education details</p>
                        )
                    }
                </div>
                <Link className="btn btn-main" onClick={()=>openModal()}>Add Education</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Education</h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    {isLoading && <Loader/>}
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        {isEdit && <Form.Control type="hidden" {...register('_id')} />}
                        <Row className="row-cols-1 row-cols-lg-2 g-2 mb-15">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Degree</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('degree',{
                                            required : "Degree is required"
                                        })} 
                                        isInvalid = {errors?.degree}
                                    />
                                    {errors?.degree && errors.degree.message && <span className="text-red-dark">{errors.degree.message}</span>}
                                    {err?.degree && <span className="text-danger">{err?.degree}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Specialization</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('specialization')}
                                    />
                                    {err?.specialization && <span className="text-danger">{err?.specialization}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Graduation Year</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('gradYear',{
                                            required : "Graduation Year is required"
                                        })}
                                        isInvalid = {errors?.gradYear}
                                    />
                                    {errors?.gradYear && errors.gradYear.message && <span className="text-red-dark">{errors.gradYear.message}</span>}
                                    {err?.gradYear && <span className="text-danger">{err?.gradYear}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>GPA</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('gpa')}
                                    />
                                    {err?.gpa && <span className="text-danger">{err?.gpa}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>College</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('college')}
                                    />
                                    {err?.college && <span className="text-danger">{err?.college}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>University</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('university')}
                                    />
                                    {err?.university && <span className="text-danger">{err?.university}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('educationState')}
                                    />
                                    {err?.educationState && <span className="text-danger">{err?.educationState}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('educationCountry')}
                                    />
                                    {err?.educationCountry && <span className="text-danger">{err?.educationCountry}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex ">
                            <Button className="btn-main me-1" type="submit">{isEdit ? "Update" : "Save"}</Button>
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
              message = "Are you sure you want to delete education?"
            />
        </>
    )
}

export default CandidateEducation;