import { Link } from "react-router-dom";
import {imagePath} from 'components/Constants';
import PropTypes from 'prop-types';

export default function CategoryCard(props,{ onFilterChange = () => {} }){
    const jobList = (id) => {
        let categoryID = id;
        const storedFilters = JSON.parse(sessionStorage.getItem('appliedFilters')) || { categories: [], types: [], locations: [], minSalary : '', maxSalary : '', searchJob : '', districtID : '' };
        // Store filters in sessionStorage
        sessionStorage.setItem('appliedFilters', JSON.stringify({
            categories: [categoryID],
            types: storedFilters.types,
            locations: storedFilters.locations,
            minSalary : storedFilters.minSalary,
            maxSalary : storedFilters.maxSalary,
            searchJob : storedFilters.searchJob,
            districtID : storedFilters.districtId,
            districtName : storedFilters.districtName
        }));
        onFilterChange({
            flag : "filter",
            categories: [categoryID],
            types: storedFilters.types,
            locations: storedFilters.locations,
            minSalary : storedFilters.minSalary,
            maxSalary : storedFilters.maxSalary,
            searchJob : storedFilters.searchJob,
            districtID : storedFilters.districtId,
            districtName : storedFilters.districtName
        });    
    };

    const handleClick = () => {
        jobList(props.categoryID);
    };

    return(
        <Link to="/jobs" onClick={handleClick}>
            <div className="category-wrap">
                <div className="category-image">
                    <img className="img-fluid" src={imagePath.human} alt="human" />
                </div>
                <div className="category-desc">
                    <h5>{props.name}</h5>
                    <p className="font-xs"><span className="text-orange">{props.vacancy}</span><span> Jobs Available</span></p>
                </div>
            </div>
        </Link>
    )
}

CategoryCard.propTypes = {
    name: PropTypes.string,
    vacancy: PropTypes.number,
    categoryID: PropTypes.any
}