import { useState } from 'react';
import { useSessionStorage } from 'context/SessionStorageContext';
import { SlUser, SlWallet, SlLayers, SlDoc, SlCheck, SlDrawer } from "react-icons/sl";
import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { BsFillPencilFill } from "react-icons/bs";
import axios from 'axios';
import { validateImage } from 'utils/imageUtils';
import { imagePath } from 'components/Constants';
import LoaderButton from './LoaderButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const CandidateMenu = () => {
    const { username } = useSessionStorage();
    const location = useLocation();
    const { userid, token } = useSessionStorage();
    const { control, errors, setValue } = useForm();
    const [ imageValidationErr, setImageValidationErr] = useState();
    const { profileimg, setProfileimg } = useSessionStorage();
    const [ isLoading, setIsLoading] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleImageChange = async (e) => {
        setIsLoading(true);
        let image = e.target.files[0];
        setImageValidationErr();
        if (!validateImage(image, setImageValidationErr)) {
            setIsLoading(false);
            return;
        }
        setValue('image', image);
        const formData = new FormData();
        formData.append('image', image);
        const response = await axios.put(BASE_API_URL+'candidate-details/change-profile/'+userid,formData,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            setProfileimg(response.data.profileImg);
            setIsLoading(false);
        }
    }

    return(
        <div className="h-100">
            <div className="job-company-wrap">
                <div className="text-center mb-20">
                    <Form>
                        <div className="position-relative">
                            <img 
                                className="img-fluid mb-15 profile-img" 
                                src={profileimg === null || profileimg === "null" ? imagePath.human : profileimg} 
                                alt="Profile" 
                            />
                            <label htmlFor="changeProfile" className="edit-circle change-profile"><BsFillPencilFill /></label>
                        </div>
                        <Controller
                            name="image"
                            control={control}
                            rules={{ required: 'Image is required' }}
                            render={({ field }) => (
                            <>
                                <input 
                                    type="file" 
                                    id="changeProfile"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        field.onChange(e.target.files[0]);
                                        handleImageChange(e);
                                    }}
                                />
                                {errors?.image && <p>{errors?.image?.message}</p>}
                            </>
                            )}
                        />
                        {isLoading && <span className="d-flex justify-content-center mb-2">Please wait... <span className="ms-2 mt-1"><LoaderButton/></span></span> }
                    </Form>                    
                    {imageValidationErr && <p className="text-danger mb-15">{imageValidationErr}</p>}
                    <h6 className="mb-0">{username}</h6>
                </div>
                <ul className="ul-icon-wrap dashboard-menu">
                    <li>
                        <Link to="/candidate/dashboard" className={isActive("/candidate/dashboard") ? "active-menu" : ""}>
                            <div className="icon-left"><SlLayers/></div>
                            <div className="icon-right"><p>Dashboard</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/profile" className={isActive("/candidate/profile") ? "active-menu" : ""}>
                            <div className="icon-left"><SlUser /></div>
                            <div className="icon-right"><p>Profile</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/change-password" className={isActive("/candidate/change-password") ? "active-menu" : ""}>
                            <div className="icon-left"><SlWallet/></div>
                            <div className="icon-right"><p>Change Password</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/resume" className={isActive("/candidate/resume") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDoc /></div>
                            <div className="icon-right"><p>My Resume</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/applied-jobs" className={isActive("/candidate/applied-jobs") ? "active-menu" : ""}>
                            <div className="icon-left"><SlCheck /></div>
                            <div className="icon-right"><p>Applied Jobs</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/saved-jobs" className={isActive("/candidate/saved-jobs") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDrawer /></div>
                            <div className="icon-right"><p>Saved Jobs</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/candidate/resume-builder" className={isActive("/candidate/resume-builder") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDrawer /></div>
                            <div className="icon-right"><p>Resume Builder</p></div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default CandidateMenu;