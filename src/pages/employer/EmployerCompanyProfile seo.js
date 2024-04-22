import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import EmployerMenu from 'components/EmployerMenu';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import LoaderBlur from 'components/LoaderBlur';
import { ToastContainer, toast } from 'react-toastify';
import LoaderButton from 'components/LoaderButton';
import SeoComponent from 'components/SeoComponent';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployerCompanyProfile = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState();
    const [states, setStates] = useState();
    const [allStates, setAllStates] = useState();
    const [selectedState, setSelectedState] = useState(null);
    const [districts, setDistricts] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [allDistricts, setAllDistricts] = useState();
    const { token, companyid, roleid } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [companyTypes, setCompanyTypes] = useState();
    const [err, setErr] = useState();
    const [slugCountryId, setSlugCountryId] = useState(null);
    const [slugStateId, setSlugStateId] = useState(null);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const { register, handleSubmit, control, formState : {errors}, setValue } = useForm({ mode : 'all' });

    // Get Countries
    const getCountries = useCallback(() => {
        axios.get(BASE_API_URL+'master-country').then((response) => {
            if(response?.data){
                setCountries(response.data);
            }
        })
    },[]);

    // Get States
    const getStates = useCallback(() => {
        axios.get(BASE_API_URL+'master-state').then((response) => {
            if(response?.data){
                setAllStates(response.data);
            }
        })
    },[]);

    // Get Districts
    const getDistricts = useCallback(() => {
        setIsButtonLoading(true);
        axios.get(BASE_API_URL+'master-district').then((response) => {
            if(response?.data){
                setAllDistricts(response.data);
                setIsButtonLoading(false);
            }
        })
    },[]);

    // States populated based on country
    const handleStates = (selectedCountryId) => {
        setSelectedState(null);
        setValue("state", selectedState);
        setSelectedDistrict(null);
        setValue("district", selectedDistrict);
        setDistricts(selectedDistrict);
        let states = allStates?.filter(states => states.countryId === selectedCountryId);
        setStates(states);
    }

    // Districts populated based on state
    const handleDistricts = (selectedStateId) => {
        setSelectedDistrict(null);
        setValue("district", selectedDistrict);
        let districts = allDistricts?.filter(districts => districts.stateId === selectedStateId);
        setDistricts(districts);
    }

    // Get Employer
    const getCompany = useCallback(async()  => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'companies/'+companyid);
        if(response?.data?.result === true) {
            const data = response.data.companyDetail;
            setIsLoading(false);
            for(const key in data){
                setValue(key, data[key]);
            }
            if(data.companyType && data.country && data.state && data.district){
                setValue('companyType',{label:data.companyType.type, value:data.companyType.slug});
                setValue('country',{label:data.country.countryName, value:data.country.countryId});
                setValue('state',{label:data.state.stateName, value:data.state.stateId});
                setValue('district',{label:data.district.districtName, value:data.district.districtId});
                setSlugCountryId(data.country.countryId);
                setSlugStateId(data.state.stateId);
            }
        }
    },[companyid, setValue]);

    // Get Job types
    const getCompanyTypes = useCallback( async() => {
        const response = await axios.get(BASE_API_URL+'master-companytype');
        if(response?.data){
            setCompanyTypes(response.data);
        }
    },[]);

    // Use Effect
    useEffect(() => {
        getCountries();
        getStates();
        getDistricts();
        getCompanyTypes();
        if(companyid){
            getCompany();
        }
    }, [getCountries, getStates, getDistricts, getCompany, getCompanyTypes, companyid]);

    useEffect(() => {
        if(allStates && slugCountryId) {
            let states = allStates.filter(states => states.countryId === slugCountryId);
            setStates(states);
        }
        if(allDistricts && slugStateId) {
            let districts = allDistricts.filter(districts => districts.stateId === slugStateId);
            setDistricts(districts);
        }
    }, [allStates, slugCountryId, allDistricts, slugStateId]);

    const updateData = async (data) => {
        setIsLoading(true);
        let slug_name = data?.companyName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        let slug = slug_name.replace(/(^-+|-+$)/g, '');
        data.companySlug = slug;
        data.country = {
            countryId : data.country.value,
            countryName : data.country.label
        }
        data.state = {
            stateId : data.state.value,
            stateName : data.state.label
        }
        data.district = {
            districtId : data.district.value,
            districtName : data.district.label
        }
        data.companyType = {
            slug : data.companyType.value,
            type : data.companyType.label
        }
        const response = await axios.put(BASE_API_URL+'companies/'+data._id,data,{headers:{Authorization:`Bearer ${token}`}});
        if(response?.data?.result === true){
            for(const key in data){
                setValue(key, data[key]);
            }
            setValue('companyType',{label:data.companyType.type, value:data.companyType.slug});
            setValue('country',{label:data.country.countryName, value:data.country.countryId});
            setValue('state',{label:data.state.stateName, value:data.state.stateId});
            setValue('district',{label:data.district.districtName, value:data.district.districtId});
            setSlugCountryId(data.country.countryId);
            setSlugStateId(data.state.stateId);
            setIsLoading(false);
            setErr();
            toast.success("Details updated successfully",{theme: 'colored'});
        } else if(response?.data?.result === false){
            if(response?.data?.message === "Token Expired"){
                clearStorage();
                sessionStorage.setItem("loginErr",LOGIN_ERR);
                setIsLoading(false);
                navigate('/employer/login');
            } else{
                setIsLoading(false);
                setErr(response.data.errors);
            }
        }
    }
    
    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return(
        <>
            <SeoComponent slug={convertedString} />
            <DashboardBanner />
            
            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <EmployerMenu/>
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            <h4 className="mb-20">Company Details</h4>
                            {isLoading && <LoaderBlur/>}
                            <Form autoComplete="off" onSubmit={handleSubmit(updateData)}>
                                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2">
                                    <Col className="mb-15">
                                        <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" 
                                            {...register('companyName',{
                                                required: "Company name is required"
                                            })}
                                            isInvalid = {errors?.companyName}
                                            readOnly
                                        ></Form.Control>
                                        { errors?.companyName && <span className="text-danger">{errors?.companyName && errors.companyName.message}</span>}
                                        { err?.companyName && <span className="text-danger">{err?.companyName}</span> }
                                        { err?.companySlug && <span className="text-danger">{err?.companySlug}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Company Type <span className="text-danger">*</span></Form.Label>
                                        <Controller 
                                            name = "companyType"
                                            control = {control}
                                            rules = {{required: "Company type is required"}}
                                            render = {({field}) => (
                                                <Select {...field} 
                                                    options={companyTypes?.map(type => ({
                                                        value: type.slug,
                                                        label: type.companyType,
                                                    }))}
                                                    placeholder="Select type"
                                                />
                                            )}
                                        />
                                        {errors.companyType && ( <span className="text-danger">{errors?.companyType && errors.companyType.message}</span>)}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>No of Employees</Form.Label>
                                        <Form.Control type="text"
                                            {...register('empCount')}
                                        ></Form.Control>
                                        { err?.empCount && <span className="text-danger">{err?.empCount}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                                        <Controller 
                                            name = "country"
                                            control = {control}
                                            rules = {{required: "Country is required"}}
                                            render = {({field}) => (
                                                <Select {...field} 
                                                    options={countries?.map(country => ({
                                                        value: country.countryId,
                                                        label: country.countryName,
                                                    }))}
                                                    onChange = {(selectedCountry) => {
                                                        field.onChange(selectedCountry);
                                                        handleStates(selectedCountry.value);
                                                    }}
                                                    placeholder="Select Country"
                                                />
                                            )}
                                        />
                                        {errors.country && ( <span className="text-danger">{errors?.country && errors.country.message}</span>)}
                                        { err?.country && <span className="text-danger">{err?.country}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>State <span className="text-danger">*</span></Form.Label>
                                        <Controller
                                            name="state"
                                            control={control}
                                            rules={{ required: "State is required" }}
                                            render={({ field }) => (
                                                <Select {...field} 
                                                    options={states?.map(state => ({
                                                        value: state.stateId,
                                                        label: state.stateName,
                                                    }))}
                                                    onChange = {(selectedState) => {
                                                        field.onChange(selectedState);
                                                        handleDistricts(selectedState.value);
                                                    }}
                                                    isClearable
                                                    placeholder="Select State"
                                                />
                                            )}
                                        />
                                        {errors.state && ( <span className="text-danger">{errors?.state && errors.state.message}</span>)}
                                        { err?.state && <span className="text-danger">{err?.state}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label className="d-flex align-items-center">
                                            <span className="me-1">District <span className="text-danger">*</span></span>
                                            { isButtonLoading && <LoaderButton /> }
                                        </Form.Label>
                                        <Controller
                                            name="district"
                                            control={control}
                                            rules={{ required: "District is required" }}
                                            render={({ field }) => (
                                                <Select {...field} 
                                                    options={districts?.map(district => ({
                                                        value: district.districtId,
                                                        label: district.districtName,
                                                    }))}
                                                    isClearable
                                                    placeholder="Select District"
                                                />
                                            )}
                                        />
                                        {errors.district && ( <span className="text-danger">{errors?.district && errors.district.message}</span>)}
                                        { err?.district && <span className="text-danger">{err?.district}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control type="text" {...register('zipcode')}></Form.Control>
                                        { err?.zipcode && <span className="text-danger">{err?.zipcode}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Website URL</Form.Label>
                                        <Form.Control type="text" {...register('websiteUrl')}></Form.Control>
                                        { err?.websiteUrl && <span className="text-danger">{err?.websiteUrl}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Facebook</Form.Label>
                                        <Form.Control type="text" {...register('facebook')}></Form.Control>
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Twitter</Form.Label>
                                        <Form.Control type="text" {...register('twitter')}></Form.Control>
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Linked In</Form.Label>
                                        <Form.Control type="text" {...register('linkedIn')}></Form.Control>
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Full Address</Form.Label>
                                        <Form.Control as="textarea" {...register('address')}></Form.Control>
                                        { err?.address && <span className="text-danger">{err?.address}</span> }
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                        <Form.Control as="textarea" 
                                            {...register('description',{
                                                required:"Company description is required"
                                            })}
                                        ></Form.Control>
                                        { errors?.description && <span className="text-danger"> { errors?.description?.message }</span> }
                                        { err?.description && <span className="text-danger">{err?.description}</span> }
                                    </Col>
                                </Row>
                                { roleid === "1" && <Button className="btn btn-main-lg w-auto" type="submit">Submit</Button> }
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer/>
        </>
    )
}
export default EmployerCompanyProfile;