import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import {Typeahead} from 'react-bootstrap-typeahead';
import axios from 'axios';
import PropTypes from 'prop-types';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const SearchJob = ({ onFilterChange = () => {} }) => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const { register, handleSubmit, setValue } = useForm();
    const location = useLocation()
    let storedFilters;

    if (location.pathname === "/") {
        sessionStorage.removeItem('appliedFilters');
        storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { searchJob: '', districtID: '', districtName: '' };
    } else {
        storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { searchJob: '', districtID: '', districtName: '' };
    }

    const getDistricts = async (query) => {
        const response = await axios.get(`${BASE_API_URL}master-district/district/filter?query=${query}`);
        if (response?.data) {
            let districtData = [...response.data];
            setDistricts(districtData);
        }
    };

    const handleSearch = (data) => {
        if(data.district === "Select Location") {
            data.district = "";
        }
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { categories: [], types: [], locations: [], minSalary : '', maxSalary : '', searchJob : '', districtID : '' };

        // Store filters in sessionStorage
        sessionStorage.setItem('appliedFilters', JSON.stringify({
            categories: storedFilters.categories,
            types: storedFilters.types,
            locations: storedFilters.locations,
            minSalary : storedFilters.minSalary,
            maxSalary : storedFilters.maxSalary,
            searchJob : data?.searchJob,
            districtID : data?.district?.value,
            districtName : data.district
        }));
        onFilterChange({
            flag : "filter",
            categories: storedFilters.categories,
            types: storedFilters.types,
            locations: storedFilters.locations,
            minSalary : storedFilters.minSalary,
            maxSalary : storedFilters.maxSalary,
            searchJob : data?.searchJob,
            districtID : data?.district?.value,
            districtName : data.district
        });    
        navigate('/jobs');
    }

    const handleKeyPress = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const isAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);
        const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
        if (!(isAlphanumeric || isAllowedKey) || isModifierKey) {
            e.preventDefault();
        }
    };

    return(
        <Form className="mt-4 banner-form" onSubmit={handleSubmit(handleSearch)} autoComplete='off'>
            <Row className='g-0'>
                <Col md={5}>
                    <Form.Control 
                        placeholder="Search Job" 
                        {...register('searchJob')}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </Col>
                <Col md={5}>
                    <Typeahead
                        id="district-id"
                        labelKey="districtName"
                        options={districts}
                        placeholder="Search Location"
                        isLoading={!districts.length}
                        minLength={3}
                        defaultSelected={Array.isArray(storedFilters.districtName) && storedFilters.districtName.length > 0 ? [storedFilters.districtName[0]] : []}
                        onInputChange={(query) => {
                            const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
                            if(query.length === 0){
                                setValue('district', capitalizedQuery);
                            } else {
                                setValue('district', [capitalizedQuery]);
                            }
                            if (query.length >= 3) {
                                getDistricts(query);
                            }
                        }}
                        onChange={(selectedDistrict) => {
                            setValue('district', selectedDistrict);
                        }}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </Col>
                <Col md={2}><Button type="submit">Search</Button></Col>
            </Row>
        </Form>
    )
}

SearchJob.propTypes = {
    onFilterChange: PropTypes.func,
};

export default SearchJob;