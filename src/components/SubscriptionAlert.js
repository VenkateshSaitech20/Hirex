import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const SubscriptionAlert = ({message}) => {
    const navigate = useNavigate()
  return (
        <div className="box-lightorange h-auto mb-30 d-flex  align-align-items-center justify-content-center gap-3">
                  <h5 className="text-black  mb-0 text-center">
                      {message}
                    </h5>
                    <Button 
                  className="btn btn-main" 
                  onClick={() => {
                    navigate("/employer/pricing-plan");
                  }}
                > 
                  Buy Subscription
                </Button>
                </div>
  )
}

SubscriptionAlert.propTypes = {
  message : PropTypes.string
}

export default SubscriptionAlert