import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import { FormControl } from 'react-bootstrap';
import LoaderButton from './LoaderButton';
import PropTypes from 'prop-types';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const JobFilters = ({ onFilterChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isJobTypeLoading, setIsJobTypeLoading] = useState(false);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [jobCategories, setJobCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [states, setStates] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredJobCategory, setFilteredJobCategory] = useState([]);
    const [filteredJobType, setFilteredJobType] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');

    useEffect(() => {
        getJobCategory();
        getJobType();
        getLocations();
    }, []);

    const getJobCategory = () => {
        setIsCategoryLoading(true);
        axios.get(BASE_API_URL + 'master-job-category/category/count').then((response) => {
            if (response?.data) {
                setIsCategoryLoading(false);
                setJobCategories(response.data);
            }
        });
    };

    const getJobType = () => {
        setIsJobTypeLoading(true);
        axios.get(BASE_API_URL + 'master-jobtype/type/count').then((response) => {
            if (response?.data) {
                setIsJobTypeLoading(false);
                setJobTypes(response.data);
            }
        });
    };

    const getLocations = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-state/state/count').then((response) => {
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

    const searchCategory = (e) => {
        let searchName = e.target.value;
        let slug_name = searchName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
        let slug = slug_name.replace(/(^-+|-+$)/g, '');
        if (jobCategories) {
            let filteredCategory = jobCategories.filter((category) => category.slug.includes(slug));
            setFilteredJobCategory(filteredCategory);
        }
    };

    const searchJobType = (e) => {
        let searchName = e.target.value;
        let slug_name = searchName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
        let slug = slug_name.replace(/(^-+|-+$)/g, '');
        if (jobTypes) {
            let filteredType = jobTypes.filter((type) => type.slug.includes(slug));
            setFilteredJobType(filteredType);
        }
    };

    const handleCategoryChange = (id) => {
        const newSelectedCategories = selectedCategories.includes(id)
            ? selectedCategories.filter((c) => c !== id)
            : [...selectedCategories, id];
        setSelectedCategories(newSelectedCategories);
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        onFilterChange({
            categories: newSelectedCategories,
            types: selectedTypes,
            locations: selectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
            flag: "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('appliedFilters', JSON.stringify({
            categories: newSelectedCategories,
            types: selectedTypes,
            locations: selectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
        }));
    };

    const handleTypeChange = (id) => {
        const newSelectedTypes = selectedTypes.includes(id)
            ? selectedTypes.filter((t) => t !== id)
            : [...selectedTypes, id];
        setSelectedTypes(newSelectedTypes);
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        onFilterChange({
            categories: selectedCategories,
            types: newSelectedTypes,
            locations: selectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
            flag: "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('appliedFilters', JSON.stringify({
            categories: selectedCategories,
            types: newSelectedTypes,
            locations: selectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
        }));
    };

    const handleLocationChange = (id) => {
        const newSelectedLocations = selectedLocations.includes(id)
            ? selectedLocations.filter((l) => l !== id)
            : [...selectedLocations, id];
        setSelectedLocations(newSelectedLocations);
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        onFilterChange({
            categories: selectedCategories,
            types: selectedTypes,
            locations: newSelectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
            flag: "filter",
        });
        // Store filters in sessionStorage
        sessionStorage.setItem('appliedFilters', JSON.stringify({
            categories: selectedCategories,
            types: selectedTypes,
            locations: newSelectedLocations,
            minSalary: minSalary,
            maxSalary: maxSalary,
            districtID: storedFilters.districtID,
            districtName: storedFilters.districtName,
            searchJob: storedFilters.searchJob,
        }));
    };

    const handleKeyPress = (e) => {
        // Allow only numbers and some special keys (e.g., Backspace, Delete, Arrow keys)
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleMinSalaryChange = (e) => {
        let min_sal = e.target.value;
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        setMinSalary((prevMinSalary) => {
            onFilterChange({
                categories: selectedCategories,
                types: selectedTypes,
                locations: selectedLocations,
                minSalary: min_sal,
                maxSalary: maxSalary,
                districtID: storedFilters.districtID,
                districtName: storedFilters.districtName,
                searchJob: storedFilters.searchJob,
                flag: "filter",
            });
            // Store filters in sessionStorage
            sessionStorage.setItem('appliedFilters', JSON.stringify({
                categories: selectedCategories,
                types: selectedTypes,
                locations: selectedLocations,
                minSalary: min_sal,
                maxSalary: maxSalary,
                districtID: storedFilters.districtID,
                districtName: storedFilters.districtName,
                searchJob: storedFilters.searchJob,
            }));
            return min_sal;
        });
    };

    const handleMaxSalaryChange = (e) => {
        let max_sal = e.target.value;
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        setMaxSalary((prevMaxSalary) => {
            onFilterChange({
                categories: selectedCategories,
                types: selectedTypes,
                locations: selectedLocations,
                minSalary: minSalary,
                maxSalary: max_sal,
                flag: "filter",
                districtID: storedFilters.districtID,
                districtName: storedFilters.districtName,
                searchJob: storedFilters.searchJob,
            });
            // Store filters in sessionStorage
            sessionStorage.setItem('appliedFilters', JSON.stringify({
                categories: selectedCategories,
                types: selectedTypes,
                locations: selectedLocations,
                minSalary: minSalary,
                maxSalary: max_sal,
                districtID: storedFilters.districtID,
                districtName: storedFilters.districtName,
                searchJob: storedFilters.searchJob,
            }));
            return max_sal;
        });
    };

    useEffect(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || {
            categories: [],
            types: [],
            locations: [],
            minSalary: '',
            maxSalary: '',
            searchJob: '',
            districtID: '',
            districtName: ''
        };
        setSelectedCategories(storedFilters.categories);
        setSelectedTypes(storedFilters.types);
        setSelectedLocations(storedFilters.locations);
        setMinSalary(storedFilters.minSalary);
        setMaxSalary(storedFilters.maxSalary);
        onFilterChange(storedFilters);
    }, [onFilterChange]);

    return (
        <Form className="jobfilter-form">
            <h5 className="mb-20 d-flex">Categories{isCategoryLoading && <span className="ms-1"><LoaderButton /></span>}</h5>
            <FormControl
                type="text"
                placeholder="Search categories"
                className="mb-10"
                onChange={(e) => searchCategory(e)}
            ></FormControl>
            <div className="filter-height">
                {filteredJobCategory.length > 0 ? (
                    filteredJobCategory.map((category) => (
                        <div className="d-flex justify-content-between mb-2" key={category._id}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={category._id}
                                    label={category.categoryName}
                                    onChange={() => handleCategoryChange(category._id)}
                                    checked={selectedCategories.includes(category._id)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{category.count}</Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    jobCategories.map((category) => (
                        <div className="d-flex justify-content-between mb-2" key={category._id}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={category._id}
                                    label={category.categoryName}
                                    onChange={() => handleCategoryChange(category._id)}
                                    checked={selectedCategories.includes(category._id)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{category.count}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <hr />
            <h5 className="mb-20 d-flex">Job Type{isJobTypeLoading && <span className="ms-1"><LoaderButton /></span>}</h5>
            <FormControl
                type="text"
                placeholder="Search job type"
                className="mb-10"
                onChange={(e) => searchJobType(e)}
            ></FormControl>
            <div className="filter-height">
            {filteredJobType.length > 0 ? (
                    filteredJobType.map((jobtype) => (
                        <div className="d-flex justify-content-between mb-2" key={jobtype._id}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={jobtype._id}
                                    label={jobtype.jobTypeName}
                                    onChange={() => handleTypeChange(jobtype._id)}
                                    checked={selectedTypes.includes(jobtype._id)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{jobtype.count}</Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    jobTypes.map((jobtype) => (
                        <div className="d-flex justify-content-between mb-2" key={jobtype._id}>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id={jobtype._id}
                                    label={jobtype.jobTypeName}
                                    onChange={() => handleTypeChange(jobtype._id)}
                                    checked={selectedTypes.includes(jobtype._id)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{jobtype.count}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <hr />
            <h5 className="mb-20 d-flex">Job Locations {isLoading && <span className="ms-1"><LoaderButton /></span>}</h5>
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
                                    checked={selectedLocations.includes(state.stateId)}
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
                                    checked={selectedLocations.includes(state.stateId)}
                                />
                            </div>
                            <div>
                                <Badge className="badge-orange">{state.count}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <hr />
            <h5 className="mb-20">Salary Range</h5>
            <div className="filter-height">
                <p className="font-bold mb-2">From</p>
                <FormControl
                    type="text"
                    placeholder="Enter min salary"
                    className="mb-2"
                    onChange={(e) => handleMinSalaryChange(e)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    value={minSalary}
                ></FormControl>
                <p className="font-bold mb-2">To</p>
                <FormControl
                    type="text"
                    placeholder="Enter max salary"
                    onChange={(e) => handleMaxSalaryChange(e)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    value={maxSalary}
                ></FormControl>
            </div>
        </Form>
    );
};

JobFilters.propTypes = {
    onFilterChange: PropTypes.func,
};

export default JobFilters;