import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DashboardBanner from 'components/DashboardBanner';
import CandidateMenu from 'components/CandidateMenu';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSessionStorage } from 'context/SessionStorageContext';
import { useClearStorage } from 'utils/useClearStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import LoaderButton from 'components/LoaderButton';
import SeoComponent from 'components/SeoComponent';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const expYears = [
    { value : 0, year : "0 Yr"},
    { value : 1, year : "1 Yr"},
    { value : 2, year : "2 Yrs"},
    { value : 3, year : "3 Yrs"},
    { value : 4, year : "4 Yrs"},
    { value : 5, year : "5 Yrs"},
    { value : 6, year : "6 Yrs"},
    { value : 7, year : "7 Yrs"},
    { value : 8, year : "8 Yrs"},
    { value : 9, year : "9 Yrs"},
    { value : 10, year : "10 Yrs" },
    { value : 11, year : "11 Yrs" },
    { value : 12, year : "12 Yrs" },
    { value : 13, year : "13 Yrs" },
    { value : 14, year : "14 Yrs" },
    { value : 15, year : "15 Yrs" },
    { value : 16, year : "16 Yrs" },
    { value : 17, year : "17 Yrs" },
    { value : 18, year : "18 Yrs" },
    { value : 19, year : "19 Yrs" },
    { value : 20, year : "20 Yrs" },
]

const expMonths = [
    { value : 1, month : "1 Mos"},
    { value : 2, month : "2 Mos"},
    { value : 3, month : "3 Mos"},
    { value : 4, month : "4 Mos"},
    { value : 5, month : "5 Mos"},
    { value : 6, month : "6 Mos"},
    { value : 7, month : "7 Mos"},
    { value : 8, month : "8 Mos"},
    { value : 9, month : "9 Mos"},
    { value : 10, month : "10 Mos" },
    { value : 11, month : "11 Mos" },
]

const CandidateProfile = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState();
    const [states, setStates] = useState();
    const [selectedState, setSelectedState] = useState(null);
    const [districts, setDistricts] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const { userid, token, usertype, setUsername } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [jobTitles, setJobTitles] = useState();
    const [err, setErr] = useState();
    const [slugCountryId, setSlugCountryId] = useState(null);
    const [slugStateId, setSlugStateId] = useState(null);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isStateButtonLoading, setIsStateButtonLoading] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({ mode: 'all' });

    // Get Countries
    const getCountries = useCallback(() => {
        axios.get(BASE_API_URL + 'master-country').then((response) => {
            if (response?.data) {
                setCountries(response.data);
            }
        })
    }, []);

    const getStatesByCountry = useCallback((countryID) => {
        setIsStateButtonLoading(true);
        axios.get(BASE_API_URL + "master-state/by-country/" + countryID).then((response) => {
            if (response?.data) {
                setStates(response.data);
                setIsStateButtonLoading(false);
            }
        });
    }, [])

    const getDistrictsByState = useCallback((stateID) => {
        setIsButtonLoading(true);
        axios.get(BASE_API_URL + "master-district/by-state/" + stateID).then((response) => {
            if (response?.data) {
                setDistricts(response.data);
                setIsButtonLoading(false);
            }
        });
    }, [])

    const handleStates = (selectedCountryId) => {
        setSelectedState(null);
        setValue("state", selectedState);
        setSelectedDistrict(null);
        setValue("district", selectedDistrict);
        setDistricts(selectedDistrict);
        getStatesByCountry(selectedCountryId);
    };

    // Districts populated based on state
    const handleDistricts = (selectedStateId) => {
        setSelectedDistrict(null);
        setValue("district", selectedDistrict);
        getDistrictsByState(selectedStateId);
    };

    // Number validation
    const handleKeyPress = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    // Get Candidate
    const getCandidate = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'candidate-details/' + userid + '/' + usertype, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            const data = response.data.candidate_detail;
            for (const key in data) {
                setValue(key, data[key]);
            }
            if (data.dob && data.jobTitle && data.country && data.state && data.district) {
                let date = new Date(data.dob);
                setValue('dob', date.toISOString().split('T')[0]);
                setValue('jobTitle', { label: data.jobTitle.title, value: data.jobTitle.id });
                setValue('country', { label: data.country.countryName, value: data.country.countryId });
                setValue('state', { label: data.state.stateName, value: data.state.stateId });
                setValue('district', { label: data.district.districtName, value: data.district.districtId });
                setSlugCountryId(data.country.countryId);
                setSlugStateId(data.state.stateId);
            }
            if (data.experience) {
                let [years, months] = data.experience.toString().split('.').map(Number);
                setValue('experienceYears',years);
                setValue('experienceMonths',months);
            }
            setIsLoading(false);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
            setIsLoading(false);
            navigate('/login');
        }
    }, [userid, token, clearStorage, navigate, setValue, usertype]);

    // Get Job titles
    const getJobTitles = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'master-jobtitle');
        if (response?.data) {
            setJobTitles(response.data);
        }
    }, []);

    // Use Effect
    useEffect(() => {
        getCountries();
        getJobTitles();
        if (userid && token) {
            getCandidate();
        }
    }, [getCountries, getCandidate, userid, getJobTitles, token]);

    useEffect(() => {
        if (slugCountryId) {
            getStatesByCountry(slugCountryId);
        }
        if (slugStateId) {
            getDistrictsByState(slugStateId);
        }
    }, [slugCountryId, slugStateId, getStatesByCountry, getDistrictsByState]);

    const updateData = async (data) => {
        setIsLoading(true);
        delete data.email;
        data.country = {
            countryId: data.country.value,
            countryName: data.country.label
        }
        data.state = {
            stateId: data.state.value,
            stateName: data.state.label
        }
        data.district = {
            districtId: data.district.value,
            districtName: data.district.label
        }
        data.jobTitle = {
            id: data.jobTitle.value,
            title: data.jobTitle.label
        }
        if(data.experienceYears==="" && data.experienceMonths ==="") { data.experienceYears="";  data.experienceMonths="" }
        else if(data.experienceYears && data.experienceMonths) {
            data.experience = data.experienceYears+'.'+data.experienceMonths;
        } else if (data.experienceYears) {
            data.experience = data.experienceYears
        } else {
            data.experience = "0."+data.experienceMonths
        }
        delete data.experienceYears;
        delete data.experienceMonths;
        const response = await axios.put(BASE_API_URL + 'candidate-details/' + data.candidateNo, data, { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            for (const key in data) {
                setValue(key, data[key]);
            }
            let date = new Date(data.dob);
            setUsername(response?.data?.data?.name);
            localStorage.setItem("username",response?.data?.data?.name);
            setValue('dob', date.toISOString().split('T')[0]);
            setValue('jobTitle', { label: data.jobTitle.title, value: data.jobTitle.id });
            setValue('country', { label: data.country.countryName, value: data.country.countryId });
            setValue('state', { label: data.state.stateName, value: data.state.stateId });
            setValue('district', { label: data.district.districtName, value: data.district.districtId });
            setSlugCountryId(data.country.countryId);
            setSlugStateId(data.state.stateId);
            setIsLoading(false);
            setErr();
            toast.success("Details updated successfully", { theme: 'colored' });
        } else if (response?.data?.result === false) {
            if (response?.data?.message === "Token Expired") {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
                setIsLoading(false);
                navigate('/login');
            } else {
                setIsLoading(false);
                setErr(response.data.errors);
            }
        }
    }

    const location = useLocation();
    const currentUrl = location.pathname;
    const lastSegment = currentUrl.substring(currentUrl.indexOf('/') + 1);
    const convertedString = lastSegment.replace(/\//g, '-');

    return (
        <>
            <SeoComponent slug={convertedString} />

            <DashboardBanner />

            <section className="py-50">
                <Container fluid>
                    <Row>
                        <Col lg={5} xl={4} xxl={3} className="mb-30 mb-lg-0">
                            <CandidateMenu />
                        </Col>
                        <Col lg={7} xl={8} xxl={9} className="position-relative">
                            <h4 className="mb-20">Basic Information</h4>
                            {isLoading && <Loader />}
                            <Form autoComplete="off" onSubmit={handleSubmit(updateData)}>
                                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2">
                                    <Col className="mb-15">
                                        <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register('name', {
                                                required: "Name is required"
                                            })}
                                            isInvalid={errors?.name}
                                        ></Form.Control>
                                        {errors?.name && <span className="text-danger">{errors?.name?.message}</span>}
                                        {err?.name && <span className="text-danger">{err?.name}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+$/,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            isInvalid={errors?.email}
                                            readOnly
                                        ></Form.Control>
                                        {errors?.email && <span className="text-danger">{errors?.email?.message}</span>}
                                        {err?.email && <span className="text-danger">{err?.email}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Date of birth <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="date"
                                            {...register('dob', {
                                                required: "Dob is required",
                                            })}
                                            isInvalid={errors?.dob}
                                        ></Form.Control>
                                        {errors?.dob && <span className="text-danger">{errors?.dob?.message}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Mobile No <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register("mobileNo", {
                                                required: "Mobile number is Required",
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: "Enter digits only"
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Mobile number must be minimum 10 digits"
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: "Mobile number must be 10 digits"
                                                }
                                            })}
                                            isInvalid={errors?.mobileNo}
                                        ></Form.Control>
                                        {errors?.mobileNo && <span className="text-danger">{errors?.mobileNo?.message}</span>}
                                        {err?.mobileNo && <span className="text-danger">{err?.mobileNo}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                                        <div>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                rules={{ required: 'Gender is required' }}
                                                render={({ field }) => (
                                                    <>
                                                        <Form.Check inline label="Male" type="radio" id="inline-radio-1"
                                                            checked={field.value === 'male'}
                                                            onChange={() => {
                                                                field.onChange('male');
                                                                setValue('gender', 'male');
                                                            }}
                                                        />
                                                        <Form.Check inline label="Female" type="radio" id="inline-radio-2"
                                                            checked={field.value === 'female'}
                                                            onChange={() => {
                                                                field.onChange('female');
                                                                setValue('gender', 'female');
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>
                                        {errors.gender && (<span className="text-danger">{errors.gender.message}</span>)}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Nationality <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register('nationality', {
                                                required: "Nationality is required",
                                            })}
                                            isInvalid={errors?.nationality}
                                        ></Form.Control>
                                        {errors.nationality && (<span className="text-danger">{errors.nationality.message}</span>)}
                                        {err?.nationality && <span className="text-danger">{err?.nationality}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Highest Qualification <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text"
                                            {...register('qualification', {
                                                required: "Qualification is required",
                                            })}
                                            isInvalid={errors?.qualification}
                                        ></Form.Control>
                                        {errors.qualification && (<span className="text-danger">{errors.qualification.message}</span>)}
                                        {err?.qualification && <span className="text-danger">{err?.qualification}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                                        <Controller
                                            name="jobTitle"
                                            control={control}
                                            rules={{ required: "Job title is required" }}
                                            render={({ field }) => (
                                                <Select {...field}
                                                    options={jobTitles?.map(title => ({
                                                        value: title._id,
                                                        label: title.title,
                                                    }))}
                                                    placeholder="Select Job title"
                                                />
                                            )}
                                        />
                                        {errors.jobTitle && (<span className="text-danger">{errors.jobTitle.message}</span>)}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Salary (Per annum)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register('salary')}
                                            isInvalid={errors?.salary}
                                            onKeyDown={(e) => handleKeyPress(e)}
                                        ></Form.Control>
                                        {errors?.salary && <span className="text-danger">{errors?.salary?.message}</span>}
                                        {err?.salary && <span className="text-danger">{err?.salary}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Experience <span className="text-orange">(Ex: 1 or 1.5)</span></Form.Label>
                                        <div className="d-flex gap-2">
                                            <div>
                                                <Form.Select {...register('experienceYears')} defaultValue="">
                                                    <option value="" disabled>Years</option>
                                                    {
                                                        expYears?.map(item=>(
                                                            <option key={item.value} value={item.value}>{item.year}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </div>
                                            <div>
                                                <Form.Select {...register('experienceMonths')} defaultValue="">
                                                    <option value="" disabled>Months</option>
                                                    {
                                                        expMonths?.map(item=>(
                                                            <option key={item.value} value={item.value}>{item.month}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                                        <Controller
                                            name="country"
                                            control={control}
                                            rules={{ required: "Country is required" }}
                                            render={({ field }) => (
                                                <Select {...field}
                                                    options={countries?.map(country => ({
                                                        value: country.countryId,
                                                        label: country.countryName,
                                                    }))}
                                                    onChange={(selectedCountry) => {
                                                        field.onChange(selectedCountry);
                                                        handleStates(selectedCountry.value);
                                                    }}
                                                    placeholder="Select Country"
                                                />
                                            )}
                                        />
                                        {errors?.country && (<span className="text-danger">{errors?.country?.message}</span>)}
                                        {err?.country && <span className="text-danger">{err?.country}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label className="d-flex align-items-center">
                                            <span className="me-1">
                                                State <span className="text-danger">*</span>
                                            </span>
                                            {isStateButtonLoading && <LoaderButton />}
                                        </Form.Label>
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
                                                    onChange={(selectedState) => {
                                                        field.onChange(selectedState);
                                                        handleDistricts(selectedState.value);
                                                    }}
                                                    isClearable
                                                    placeholder="Select State"
                                                />
                                            )}
                                        />
                                        {errors?.state && (<span className="text-danger">{errors?.state?.message}</span>)}
                                        {err?.state && <span className="text-danger">{err?.state}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label className="d-flex align-items-center">
                                            <span className="me-1">District <span className="text-danger">*</span></span>
                                            {isButtonLoading && <LoaderButton />}
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
                                        {errors?.district && (<span className="text-danger">{errors?.district?.message}</span>)}
                                        {err?.district && <span className="text-danger">{err?.district}</span>}
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
                                        {err?.address && <span className="text-danger">{err?.address}</span>}
                                    </Col>
                                    <Col className="mb-15">
                                        <Form.Label>Description <span className="text-orange">(About yourself)</span> <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            {...register('description', {
                                                required: "Description is required"
                                            })}
                                            isInvalid={errors?.description}
                                        >
                                        </Form.Control>
                                        {errors?.description && (<span className="text-danger">{errors?.description?.message}</span>)}
                                        {err?.description && <span className="text-danger">{err?.description}</span>}
                                    </Col>
                                </Row>
                                <Button className="btn btn-main-lg w-auto" type="submit">Submit</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer />
        </>
    )
}
export default CandidateProfile;