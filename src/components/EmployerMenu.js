import { useState } from 'react';
import { useSessionStorage } from 'context/SessionStorageContext';
import { SlUser, SlWallet, SlLayers, SlDoc, SlCheck, SlDrawer, SlPeople, SlNotebook, SlSettings, SlSpeech } from "react-icons/sl";
import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { BsFillPencilFill } from "react-icons/bs";
import axios from 'axios';
import { validateImage } from 'utils/imageUtils';
import { imagePath } from 'components/Constants';
import LoaderButton from './LoaderButton';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const EmployerMenu = () => {
    const { companyname, token, companyid, roleid, profileimg, setProfileimg } = useSessionStorage();
    const location = useLocation();
    const { control, errors, setValue } = useForm();
    const [ imageValidationErr, setImageValidationErr] = useState();
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
        const response = await axios.put(BASE_API_URL+'companies/change-profile/'+companyid,formData,{headers:{Authorization:`Bearer ${token}`}});
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
                                className="img-fluid mb-15 company-profile-img" 
                                src={profileimg === null || profileimg === "null" ? imagePath.human : profileimg} 
                                alt="Profile" 
                            />
                            {
                                roleid === "1" && <label htmlFor="changeProfile" className="edit-circle change-profile"><BsFillPencilFill /></label>
                            }
                        </div>
                        {isLoading && <span className="d-flex justify-content-center mb-2">Please wait... <span className="ms-2 mt-1"><LoaderButton/></span></span> }
                        {
                            roleid === "1" && 
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
                        }
                    </Form>                    
                    {imageValidationErr && <p className="text-danger mb-15">{imageValidationErr}</p>}
                    <h6 className="mb-0">{companyname}</h6>
                </div>
                <ul className="ul-icon-wrap dashboard-menu">
                    <li>
                        <Link to="/employer/dashboard" className={isActive("/employer/dashboard") ? "active-menu" : ""}>
                            <div className="icon-left"><SlLayers/></div>
                            <div className="icon-right"><p>Dashboard</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/company-profile" className={isActive("/employer/company-profile") ? "active-menu" : ""}>
                            <div className="icon-left"><SlNotebook /></div>
                            <div className="icon-right"><p>Company Profile</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/profile" className={isActive("/employer/profile") ? "active-menu" : ""}>
                            <div className="icon-left"><SlUser /></div>
                            <div className="icon-right"><p>Profile</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/change-password" className={isActive("/employer/change-password") ? "active-menu" : ""}>
                            <div className="icon-left"><SlWallet/></div>
                            <div className="icon-right"><p>Change Password</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/post-new-job" className={isActive("/employer/post-new-job") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDoc /></div>
                            <div className="icon-right"><p>Post New Job</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/manage-jobs" className={isActive("/employer/manage-jobs") ? "active-menu" : ""}>
                            <div className="icon-left"><SlCheck /></div>
                            <div className="icon-right"><p>Manage Jobs</p></div>
                        </Link>
                    </li>
                    {
                        roleid === "1" &&
                        <li>
                            <Link to="/employer/manage-users" className={isActive("/employer/manage-users") ? "active-menu" : ""}>
                                <div className="icon-left"><SlPeople /></div>
                                <div className="icon-right"><p>Manage Users</p></div>
                            </Link>
                        </li>
                    }
                    <li>
                        <Link to="/employer/manage-reviews" className={isActive("/employer/manage-reviews") ? "active-menu" : ""}>
                            <div className="icon-left"><SlSpeech className="mt-1" /></div>
                            <div className="icon-right"><p>Manage Reviews</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/support" className={isActive("/employer/support") ? "active-menu" : ""}>
                            <div className="icon-left"><SlSettings /></div>
                            <div className="icon-right"><p>Support</p></div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/employer/pricing-plan" className={isActive("/employer/pricing-plan") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDrawer /></div>
                            <div className="icon-right"><p>Pricing Plan</p></div>
                        </Link>
                    </li>
                    {roleid === "1" && 
                    <li>
                        <Link to="/employer/delete-profile" className={isActive("/employer/delete-profile") ? "active-menu" : ""}>
                            <div className="icon-left"><SlDrawer /></div>
                            <div className="icon-right"><p>Delete Profile</p></div>
                        </Link>
                    </li>}
                </ul>
            </div>
        </div>
    )
}
export default EmployerMenu;