import { useCallback, useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useSessionStorage } from 'context/SessionStorageContext';
import axios from 'axios';
import Loader from 'components/Loader';
import PaginationComponent from 'components/PaginationComponent';
import { Rating } from 'react-simple-star-rating'
import PropTypes from 'prop-types';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const ReviewComponent = ({companyId}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { userid, token, companyid } = useSessionStorage();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reviews, setReviews] = useState();

    const getBadgeBgColor = (rating) => {
        if (rating < 2.5) {
            return 'danger';
        } else if (rating <= 3.5) {
            return 'info';
        } else {
            return 'success';
        }
    };

    // Get review 
    const getReviews = useCallback(async (page = 1, limit = 5) => {
        const response = await axios.get(BASE_API_URL+`company-review/find-all-review-by-company/${companyId}?page=${page}&limit=${limit}`);
        if(response?.data?.result === true) {
            setIsLoading(false);
            setReviews(response.data.reviews);
            setTotalPages(response.data.totalPages);
        }
    },[companyId])

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if(userid && token && companyid){
            getReviews(newPage);
        }
    };

    useEffect(() => {
        if(companyId){
            getReviews();
        }
    },[getReviews,companyId]);

    return(
        <>
            <h4 className="mb-20">All Reviews</h4>
            {isLoading && <Loader/>}
            {
                reviews?.length > 0 ? (
                    reviews?.map((review)=>(
                        <div key={review._id}>
                            <h6 className="mb-10">{review?.candidateDetail?.name}</h6>
                            <div className="mb-10">
                                <Rating
                                    allowFraction
                                    initialValue={review?.rating ?? 0}
                                    readonly
                                    size={22}
                                />
                                <Badge className="ms-2" bg={getBadgeBgColor(review?.rating)}>{review?.rating}</Badge>
                            </div>
                            {review?.likes && <p className="mb-2"><span className="font-bold">Likes : </span>{review?.likes}</p>}
                            {review?.dislikes && <p><span className="font-bold">Dislikes : </span>{review?.dislikes}</p>}
                            <hr/>
                        </div>
                    ))
                ) : (
                    <p className="mb-30 font-bold">No reviews found</p>
                )
            }
            {
                reviews?.length > 0 && (
                    <div className="mt-3 mb-30">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                )
            }
        </>
    )
}

ReviewComponent.propTypes = {
    companyId : PropTypes.string
}

export default ReviewComponent;