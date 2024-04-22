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

const CandidateLanguageKnown = () => {
    const navigate = useNavigate();
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [langKnown, setLangKnown] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteItemSlug, setDeleteItemSlug] = useState();
    const [proficiency, setProficiency] = useState();
    const [err, setErr] = useState();
    const [selectedProficiency, setSelectedProficiency] = useState('');
    const [profErr, setProfErr] = useState(false);
    const { register, handleSubmit, formState : {errors}, reset, setValue } = useForm();

    // Candidate Detail
    const getCandidate = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'candidate-details/'+userid+'/'+usertype,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            const data = response.data.candidate_detail;
            if(data.languageKnown){
                setLangKnown(data.languageKnown);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setLangKnown();
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

    // Get Proficiency
    const getProficiency = useCallback( async() => {
        const response = await axios.get(BASE_API_URL+'master-proficiency');
        if(response?.data){
            setProficiency(response.data);
        }
    },[]);

    const openModal = () => {
        setIsEdit(false);
        setProfErr(false);
        setSelectedProficiency('');
        reset();
        setErr();
        setModalShow(true);
    }

    const closeModal = () => {
        reset();
        setProfErr(false);
        setModalShow(false)
        setIsEdit(false);
    }

    // Save or update
    const handleSave = async (data) => {
        data.proficiencyName = selectedProficiency;
        if (!data.proficiencyName) {
            setProfErr(true);
            return;
        } else {
            setProfErr(false);
        }
        delete data.proficiency;
        let add_langKnown = [];
        if(langKnown){
            add_langKnown = langKnown;
        }
        if(isEdit){
            add_langKnown = add_langKnown.map(langKnown => (langKnown._id === data._id ? data : langKnown));
            let flag = "edit";
            handleData(add_langKnown,flag);
        } else {
            add_langKnown.push(data);
            let flag = "new";
            handleData(add_langKnown, flag);
        }
    }

    // Edit Education
    const handleEdit = (id) => {
        setIsEdit(true);
        setProfErr(false);
        setErr();
        if(langKnown){
            let edit_langKnown = langKnown.find(langKnown => langKnown._id === id);
            for(const key in edit_langKnown){
                setValue(key, edit_langKnown[key]);
            }
            setSelectedProficiency(edit_langKnown.proficiencyName);
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
        if(langKnown){
            let delete_langKnown = langKnown.filter(langKnown => langKnown._id !== id);
            let flag = "delete";
            handleData(delete_langKnown,flag);
            setShowConfirm(false);
        }
    }

    // Handle save or update or delete data
    const handleData = async (add_langKnown,flag) => {
        setIsButtonLoading(true);
        const response = await axios.put(`${BASE_API_URL}candidate-details/${userid}`,{ languageKnown: add_langKnown },{headers:{Authorization:`Bearer ${token}`}});
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
                        langKnown?.pop();
                    }
                }
            }
        }
    }

    const handleToast = (flag) => {
        if(flag === "new"){
            toast.success("Language added successfully",{theme: "colored"});
        } else if (flag === "edit") {
            toast.success("Language updated successfully",{theme: "colored"});
        } else if (flag === "delete") {
            toast.success("Language deleted successfully",{theme: "colored"});
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

    const renderLangKnown = (langKnown,index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{langKnown.language}</td>
            <td>{langKnown.proficiencyName}</td>
            <td>
                <span className="text-success me-1"><FaEdit onClick={()=>handleEdit(langKnown._id)} /></span>
                <span className="text-danger"><FaRegTrashAlt onClick={()=>handleConfirmPopup(langKnown._id)} /></span>
            </td>
        </tr>
    )

    useEffect(()=>{
        getProficiency();
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate, getProficiency]);

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Language Known</h6>
                {isLoading && <Loader/>}
                <div className="mb-15">
                    { langKnown?.length > 0 ? (
                            <Table responsive>
                                <thead className="thead-bg-orange-lightest">
                                    <tr>
                                        <th>#</th>
                                        <th>Language</th>
                                        <th>Proficiency</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { langKnown?.map((langKnown,index) => (
                                        renderLangKnown(langKnown,index)
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Add language</p>
                        )
                    }
                </div>
                <Link className="btn btn-main" onClick={()=>openModal()}>Add Language</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Language Known</h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <Row className="g-2 mb-20">
                            <Col lg={6}>
                                <Form.Group>
                                    <Form.Label>Language</Form.Label>
                                    <Form.Control type="text" 
                                        {...register('language',{
                                            required : "Language is required"
                                        })} 
                                        isInvalid = {errors?.language}
                                    />
                                    {errors?.language && errors.language.message && <span className="text-red-dark">{errors.language.message}</span>}
                                    {err?.language && <span className="text-danger">{err?.language}</span>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Label>Proficiency</Form.Label>
                                <Form.Select 
                                    value={selectedProficiency}
                                    onChange={(e) => setSelectedProficiency(e.target.value)}
                                >
                                    <option value="" disabled>Select proficiency</option>
                                    {proficiency?.map(prof => (
                                        <option key={prof.slug} value={prof.proficiencyName}>{prof.proficiencyName}</option>
                                    ))}
                                </Form.Select>
                                {profErr && ( <span className="text-danger">Proficiency is required</span>)}
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
                message = "Are you sure you want to delete language?"
            />
        </>
    )
}

export default CandidateLanguageKnown;