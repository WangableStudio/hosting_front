import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingIndicator = ({ loading, children }) => {
    if (loading) {
        return (
            <div style={{ width:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'absolute', top: '0px', left: '0px', zIndex: '9', background: "#FFF" }}>
                <CircularProgress />
            </div>
        );
    }

    return <>{children}</>;
};

export default LoadingIndicator;