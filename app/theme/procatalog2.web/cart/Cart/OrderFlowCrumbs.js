import { Breadcrumbs, Typography } from '@mui/material';

export const OrderFlowCrumbs = ({ param1, param2, param3 }) => {
    return (
        <Breadcrumbs separator="›" aria-label="breadcrumb" style={{ marginLeft: '0.5rem', position: 'relative', bottom: '0.3rem' }}>
            {param1 && (
                <span style={{ textTransform: 'capitalize', color: '#AF8238', fontSize: '11px' }}>
                    {param1}
                </span>
            )}
            {param2 && (
                <>
                    <span style={{ textTransform: 'capitalize', color: '#AF8238', fontSize: '11px' }}>
                        {param2}
                    </span>
                </>
            )}
            {param3 && (
                <>
                    <span style={{ textTransform: 'capitalize', color: '#AF8238', fontSize: '11px' }}>
                        {param3}
                    </span>
                </>
            )}
        </Breadcrumbs>
    );
};
