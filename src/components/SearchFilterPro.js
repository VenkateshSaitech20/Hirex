import PropTypes from 'prop-types';

const SearchFilterPro = ({ setData, originalData, onSearchValueLengthChange }) => {

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
            onChange={(e) => {
                handleSearch(e);
                onSearchValueLengthChange(e.target.value.length);
            }}
        />
    );
};

SearchFilterPro.propTypes = {
    setData : PropTypes.any,
    originalData : PropTypes.any,
    onSearchValueLengthChange: PropTypes.func
}

export default SearchFilterPro;