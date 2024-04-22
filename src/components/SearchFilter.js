import PropTypes from 'prop-types';

const SearchFilter = ({ setData, originalData }) => {
    
    const handleSearch = (e) => {
        const keyword = e.target.value?.toLowerCase();
        if (keyword === '') {
            setData(originalData);
        } else {
            const filteredData = originalData.filter((row) => {
                for (const key in row) {
                    if (row[key]?.toString().toLowerCase().includes(keyword)) {
                        return true;
                    }
                }
                return false;
            });
            setData(filteredData);
        }
    };

    return (
        <input
            className="form-control w-25"
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
        />
    );
};

SearchFilter.propTypes = {
    setData : PropTypes.any,
    originalData : PropTypes.any,
}

export default SearchFilter;