import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Button, Form, Table } from 'react-bootstrap';
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

const CandidatePreferredLocation = () => {
    const navigate = useNavigate();
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [prefLoc, setPrefLoc] = useState();
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
            if(data.preferredLocations){
                setPrefLoc(data.preferredLocations);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setPrefLoc();
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
        setIsEdit(false);
        reset();
        setErr();
        setModalShow(true);
    }

    const closeModal = () => {
        reset();
        setModalShow(false)
        setIsEdit(false);
    }

    // Save or update
    const handleSave = async (data) => {
        let add_prefLoc = [];
        if(prefLoc){
            add_prefLoc = prefLoc;
        }
        if(isEdit){
            add_prefLoc = add_prefLoc.map(prefLoc => (prefLoc._id === data._id ? data : prefLoc));
            let flag = "edit";
            handleData(add_prefLoc,flag);
        } else {
            add_prefLoc.push(data);
            let flag = "new";
            handleData(add_prefLoc,flag);
        }
    }

    // Edit Education
    const handleEdit = (id) => {
        setIsEdit(true);
        setErr();
        if(prefLoc){
            let edit_prefLoc = prefLoc.find(prefLoc => prefLoc._id === id);
            for(const key in edit_prefLoc){
                setValue(key, edit_prefLoc[key]);
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
        if(prefLoc){
            let delete_prefLoc = prefLoc.filter(prefLoc => prefLoc._id !== id);
            let flag = "delete";
            handleData(delete_prefLoc,flag);
            setShowConfirm(false);
        }
    }

    // Handle save or update or delete data
    const handleData = async (add_prefLoc,flag) => {
        setIsButtonLoading(true);
        const response = await axios.put(`${BASE_API_URL}candidate-details/${userid}`,{ preferredLocations: add_prefLoc },{headers:{Authorization:`Bearer ${token}`}});
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
                        prefLoc?.pop();
                    }
                }
            }
        }
    }

    const handleToast = (flag) => {
        if(flag === "new"){
            toast.success("Location added successfully",{theme: "colored"});
        } else if (flag === "edit") {
            toast.success("Location updated successfully",{theme: "colored"});
        } else if (flag === "delete") {
            toast.success("Location deleted successfully",{theme: "colored"});
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

    const renderPrefLoc = (prefloc,index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{prefloc.location}</td>
            <td>
                <span className="text-success me-1"><FaEdit onClick={()=>handleEdit(prefloc._id)} /></span>
                <span className="text-danger"><FaRegTrashAlt onClick={()=>handleConfirmPopup(prefloc._id)} /></span>
            </td>
        </tr>
    )

    useEffect(()=>{
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate]);

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Preferred Location</h6>
                {isLoading && <Loader/>}
                <div className="mb-15">
                    { prefLoc?.length > 0 ? (
                            <Table responsive>
                                <thead className="thead-bg-orange-lightest">
                                    <tr>
                                        <th>#</th>
                                        <th>Location</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { prefLoc?.map((prefloc,index) => (
                                        renderPrefLoc(prefloc,index)
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Add your preferred locations</p>
                        )
                    }
                </div>
                <Link className="btn btn-main" onClick={()=>openModal()}>Add Locations</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="md" centered scrollable>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Preferred Locations</h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <Row className="g-2 mb-15">
                            <Col lg={12}>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('location',{
                                            required : "Location is required"
                                        })} 
                                        isInvalid = {errors?.location}
                                    />
                                    {errors?.location && <span className="text-red-dark">{errors?.location?.message}</span>}
                                    {err?.location && <span className="text-danger">{err?.location}</span>}
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
                message = "Are you sure you want to delete location?"
            />
        </>
    )
}

export default CandidatePreferredLocation;