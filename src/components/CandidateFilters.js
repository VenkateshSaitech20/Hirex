import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import { FormControl } from 'react-bootstrap';
import LoaderButton from './LoaderButton';
import PropTypes from 'prop-types';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const CandidateFilters = ({ onFilterChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGenderLoading, setIsGenderLoading] = useState(false);
    const [isJobTitleLoading, setIsJobTitleLoading] = useState(false);
    const [jobTitles, setJobTitles] = useState([]);
    const [gender, setGender] = useState([]);
    const [states, setStates] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [salary, setSalary] = useState('');

    useEffect(() => {
        getJobTitle();
        getGender();
        getLocations();
    }, []);

    // Job Titles
    const getJobTitle = () => {
        setIsJobTitleLoading(true);
        axios.get(BASE_API_URL + 'master-jobtitle/jobtitle/count').then((response) => {
            if (response?.data) {
                setIsJobTitleLoading(false);
                setJobTitles(response.data);
            }
        });
    };
    
    const getGender = () => {
        setIsGenderLoading(true);
        axios.get(BASE_API_URL + 'candidate-details/get/gender/count').then((response) => {
            if (response?.data) {
                setIsGenderLoading(false);
                setGender(response.data);
            }
        });
    };

    // Locations
    const getLocations = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'candidate-details/get/state/count').then((response) => {
            if (response?.data) {
                setIsLoading(false);
                setStates(response.data);
            }
        });
    };

    const searchLocation = (e) => {
        let searchName = e.target.value;
        let slug_name = searchName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
        let slug = slug_name.replace(/(^-+|-+$)/g, '');
        if (states) {
            let filteredState = states.filter((state) => state.slug.includes(slug));
            setFilteredStates(filteredState);
        }
    };

    const handleJobTitleChange = (id) => {
        const newSelectedJobTitle = selectedJobTitle.includes(id)
            ? selectedJobTitle.filter((c) => c !== id)
            : [...selectedJobTitle, id];
        setSelectedJobTitle(newSelectedJobTitle);
        onFilterChange({
            jobtitles: newSelectedJobTitle,
            gender: selectedGender,
            locations: selectedLocations,
            salary: salary,
            flag : "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('candidateFilters', JSON.stringify({
            jobtitles: newSelectedJobTitle,
            gender: selectedGender,
            locations: selectedLocations,
            salary: salary,
        }));
    };

    const handleGenderChange = (id) => {
        const newSelectedGender = selectedGender.includes(id)
            ? selectedGender.filter((t) => t !== id)
            : [...selectedGender, id];
        setSelectedGender(newSelectedGender);
        onFilterChange({
            jobtitles: selectedJobTitle,
            gender: newSelectedGender,
            locations: selectedLocations,
            salary: salary,
            flag : "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('candidateFilters', JSON.stringify({
            jobtitles: selectedJobTitle,
            gender: newSelectedGender,
            locations: selectedLocations,
            salary: salary,
        }));
    };

    const handleLocationChange = (id) => {
        const newSelectedLocations = selectedLocations.includes(id)
            ? selectedLocations.filter((l) => l !== id)
            : [...selectedLocations, id];
        setSelectedLocations(newSelectedLocations);
        onFilterChange({
            jobtitles: selectedJobTitle,
            gender: selectedGender,
            locations: newSelectedLocations,
            salary: salary,
            flag : "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('candidateFilters', JSON.stringify({
            jobtitles: selectedJobTitle,
            gender: selectedGender,
            locations: newSelectedLocations,
            salary: salary,
        }));
    };

    const handleKeyPress = (e) => {
        // Allow only numbers and some special keys (e.g., Backspace, Delete, Arrow keys)
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleSalaryChange = (e) => {
        let salary = e.target.value;
        setSalary((prevSalary) => {
            onFilterChange({
                jobtitles: selectedJobTitle,
                gender: selectedGender,
                locations: selectedLocations,
                salary: salary,
                flag : "filter",
            });
            // Store filters in sessionStorage
            sessionStorage.setItem('candidateFilters', JSON.stringify({
                jobtitles: selectedJobTitle,
                gender: selectedGender,
                locations: selectedLocations,
                salary: salary,
            }));
            return salary;
        });
    };

    useEffect(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem('candidateFilters')) || {
            jobtitles: [],
            gender: [],
            locations: [],
            salary : '',
            searchJob : '',
            districtID : '',
            districtName : ''
        };
        setSelectedJobTitle(storedFilters.jobtitles);
        setSelectedGender(storedFilters.gender);
        setSelectedLocations(storedFilters.locations);
        setSalary(storedFilters.salary);
        onFilterChange(storedFilters);
    }, [onFilterChange]);

    return (
        <Form className="jobfilter-form">
            <h5 className="mb-20 d-flex">Job Titles{isJobTitleLoading && <span className="ms-1"><LoaderButton/></span>}</h5>
            <div className="filter-height">
                {jobTitles.map((jobTitle) => (
                    <div className="d-flex justify-content-between mb-2" key={jobTitle._id}>
                        <div>
                            <Form.Check
                                type="checkbox"
                                id={jobTitle._id}
                                label={jobTitle.title}
                                onChange={() => handleJobTitleChange(jobTitle._id)}
                                checked={selectedJobTitle?.includes(jobTitle._id)}
                            />
                        </div>
                        <div>
                            <Badge className="badge-orange">{jobTitle.count}</Badge>
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <h5 className="mb-20 d-flex">Gender{isGenderLoading && <span className="ms-1"><LoaderButton/></span>}</h5>
            <div className="">
                {gender?.map((item) => (
                    <div className="d-flex justify-content-between mb-2" key={item.slug}>
                        <div>
                            <Form.Check
                                type="checkbox"
                                id={item.slug}
                                label={item.type}
                                onChange={() => handleGenderChange(item.slug)}
                                checked={selectedGender?.includes(item.slug)}
                            />
                        </div>
                        <div>
                            <Badge className="badge-orange">{item.count}</Badge>
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <h5 className="mb-20">Salary</h5>
            <div className="mb-20">
                <FormControl 
                    type="text" 
                    placeholder="Search salary" 
                    className="mb-2" 
                    onChange={(e)=>handleSalaryChange(e)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    value={salary}
                ></FormControl>
            </div>
            <hr/>
            <h5 className="mb-20 d-flex">Locations {isLoading && <span className="ms-1"><LoaderButton/></span>}</h5>
            <FormControl
                type="text"
                placeholder="Search location"
                className="mb-10"
                onChange={(e) => searchLocation(e)}
            ></FormControl>
            <div className="filter-height">
                {filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                        <div className="d-flex justify-content-between mb-2" key={state.stateId}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={state.stateId}
                                    label={state.stateName}
                                    onChange={() => handleLocationChange(state.stateId)}
                                    checked={selectedLocations?.includes(state.stateId)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{state.count}</Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    states.map((state) => (
                        <div className="d-flex justify-content-between mb-2" key={state.stateId}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={state.stateId}
                                    label={state.stateName}
                                    onChange={() => handleLocationChange(state.stateId)}
                                    checked={selectedLocations?.includes(state.stateId)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{state.count}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Form>
    );
};

CandidateFilters.propTypes = {
    onFilterChange: PropTypes.func,
};

export default CandidateFilters;