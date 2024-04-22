import {imagePath} from 'components/Constants';
const NoDataFound = () => {
    return (
        <>
            <img className="img-fluid h-300 mb-15" src={imagePath.nodata} alt="No data" />
            <h5 className="mb-0">No Data Found</h5>
        </>
    )
}
export default NoDataFound;