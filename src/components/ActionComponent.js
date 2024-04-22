import { useState } from 'react'; 
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ConfirmPopup from './ConfirmPopup';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from 'utils/useClearStorage';
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const ActionComponent = ({ slug, editUrl, deleteUrl, updateData, deleteMessage, jwtToken }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteItemSlug, setDeleteItemSlug] = useState();
    const { username, token } = useSessionStorage();
    const { clearStorage } = useClearStorage();
    
    const handleDelete = (slug) => {
        setDeleteItemSlug(slug);
        setShowConfirm(true);
    }; 
    
    const handleConfirmDelete = async (slug) => {
        let response;
        if(jwtToken === "yes") {
            response = await axios.post(deleteUrl+slug,{ username: username },{ headers: { Authorization: `Bearer ${token}`}});
        } else {
            response = await axios.post(deleteUrl+slug,{ username: username });
        }
        if(response?.data?.result === true){
            setShowConfirm(false);
            toast.success(response.data.message, { theme: "colored" });
            updateData();
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
        }
    }
    
    const handleCloseConfirm = () => {
        setShowConfirm(false);
    }

    return (
        <>
            {
                editUrl !== "" ? (
                    <Link className="btn p-0 text-success icon-18 me-2 border-0" to={`/${editUrl}/${slug}`}><FaEdit /></Link>
                ) : ''
            }

          <button className="btn p-0 text-danger icon-17 border-0" onClick={() => handleDelete(slug)}>
            <FaTrashAlt />
          </button>
          <ConfirmPopup
              show={showConfirm}
              onClose={handleCloseConfirm}
              onConfirm={()=>handleConfirmDelete(deleteItemSlug)}
              slug={deleteItemSlug}
              message = {deleteMessage}
          />
        </>
    );
}

ActionComponent.propTypes = {
    slug: PropTypes.string.isRequired,
    editUrl: PropTypes.string.isRequired,
    deleteUrl: PropTypes.string.isRequired,
    updateData: PropTypes.func.isRequired,
    deleteMessage: PropTypes.string.isRequired,
    jwtToken: PropTypes.string,
};

export default ActionComponent;