import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import axios from 'axios';
import Loader from 'components/Loader';
import Select from 'react-select';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const CandidateKeySkills = () => {
    const navigate = useNavigate();
    const [keyskills, setKeyskills] = useState([]);
    const [allKeyskills, setAllKeyskills] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const { userid, token, usertype } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [err, setErr] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {handleSubmit, control, formState:{errors}, reset, setValue} = useForm();

    // Candidate Detail
    const getCandidate = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'candidate-details/'+userid+'/'+usertype,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true) {
            const data = response.data.candidate_detail;
            if(data.keyskills){
                setKeyskills(data.keyskills);
                const initialSkills = data.keyskills.map(skill=> ({
                    value: skill.slug,
                    label: skill.skill,
                }))
                setValue('skills', initialSkills);
                setIsEdit(true);
                setIsLoading(false);
            } else {
                setValue('skills','');
                setKeyskills();
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
        let keyskills = [];
        data.skills.forEach(skill => {
            keyskills.push({
                slug: skill.value,
                skill: skill.label
            });
        });
        setIsLoading(true);
        const response = await axios.put(BASE_API_URL+'candidate-details/'+userid,{ keyskills: keyskills },{headers:{Authorization:`Bearer ${token}`}});
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

    // Get Job titles
    const getKeySkills = useCallback( async() => {
        const response = await axios.get(BASE_API_URL+'master-keyskill');
        if(response?.data){
            setAllKeyskills(response.data);
        }
    },[]);

    // Open Modal
    const openModal = () => {
        if(!isEdit){
            reset();
        }
        if(keyskills){
            const initialSkills = keyskills.map(skill=> ({
                value: skill.slug,
                label: skill.skill,
            }))
            setValue('skills', initialSkills);
        }
        setErr();
        setModalShow(true);
    }

    const closeModal = () => {
        reset();
        setModalShow(false)
    }

    useEffect(()=>{
        getKeySkills()
        if(userid && token){
            getCandidate();
        }
    },[userid, token, getCandidate, getKeySkills]);

    return(
        <>
            <div className="white-cardbox">
                <h6 className="mb-15">Key Skills</h6>
                {/* {isLoading && <Loader/>} */}
                <div className="mb-15 skill-span">
                    {keyskills.length > 0 ? (
                        keyskills.map((skill) => (
                            <span key={skill.slug}>{skill.skill}</span>
                        ))
                    ) : (
                        <p className="mb-1">Add your skills here</p>
                    )} 
                </div>
                <Link className="btn btn-main" onClick={() => openModal()}>{ keyskills.length > 0 ? "Edit Skills" : "Add Skills"}</Link>
            </div>

            <Modal show={modalShow} backdrop="static" size="lg" centered>
                <Modal.Header className="modal-orange-light">
                    <h5 className="mb-0">Key Skills </h5>
                </Modal.Header>
                <Modal.Body className="pb-4">
                    {isLoading && <Loader/>}
                    <p className="mb-15"> It is the first thing recruiters notice in your profile. Write concisely what makes you unique and right person for the job you are looking for. </p>
                    <Form autoComplete='off' onSubmit={handleSubmit(handleSave)}>
                        <div className="mb-20">
                            <Controller 
                                name = "skills"
                                control = {control}
                                rules = {{required: "Skill is required"}}
                                render = {({field}) => (
                                    <Select {...field} 
                                        isMulti
                                        closeMenuOnSelect={false}
                                        options={allKeyskills?.map(keyskill => ({
                                            value: keyskill.slug,
                                            label: keyskill.keySkill,
                                        }))}
                                        placeholder="Select skill"
                                    />
                                )}
                            />
                            {errors?.skills && errors.skills.message && <span className="text-red-dark">{errors.skills.message}</span>}
                            {err?.skills && <span className="text-danger">{err?.skills}</span>}
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

export default CandidateKeySkills;