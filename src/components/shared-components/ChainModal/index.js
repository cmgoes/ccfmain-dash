import React from 'react'
import { Avatar } from 'antd';
import PropTypes from "prop-types";

const ChainModal = ({ name, icon, balance, sizeAvatar, className}) => {
    console.log('23232-------------')
    return (
        
        <div className="d-flex align-items-center mb-2 ml-5">
            <Avatar size={sizeAvatar} className="font-size-sm" src={icon}>
            </Avatar>
            <div className="ml-2">
                <p className="mb-0 mt-0" style={{ fontSize: "13px" }}>{name}</p>
                <h5 className="mb-0 " style={{ fontSize: "15px", marginTop: "-5px" }}>${balance}</h5>
            </div>
        </div>
    )
}

ChainModal.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    balance: PropTypes.string,
    sizeAvatar: PropTypes.number,
    className: PropTypes.string
};

export default ChainModal;
