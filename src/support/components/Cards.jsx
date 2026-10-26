import { memo, useState } from "react";
import { I } from "./Base";

const Card = memo(({
    title,
    right,
    open = null,
    footer,
    padding = '24px',
    children,
    style,
    ...props
}) => {
    const [ openStatus, setOpenStatus ] = useState(( open === null || open === true ));
    const cardStyle = {
        ...style,
        '--padding': padding
    };

    return (
        <div className={`unit-card box-background ${openStatus ? "unit-card-status-open" : "unit-card-status-closed"}`} style={cardStyle} {...props}>
            {( title || right || typeof open === 'boolean' ) && (
                <div className="unit-card-header">
                    {title && <h5 className="unit-card-title more">{title}</h5>}
                    {right && <div className="unit-card-right">{right}</div>}
                    {typeof open === 'boolean' && <I name={openStatus ? "bi-chevron-down" : "bi-chevron-right"} className="unit-card-status-button click block" onClick={() => setOpenStatus( !openStatus )} />}
                </div>
            )}
            <div className='unit-card-status-box'>
                <div className="unit-card-status-inner">
                    <div className="unit-card-content">{children}</div>
                    {footer && <div className="unit-card-footer">{footer}</div>}
                </div>
            </div>
        </div>
    );
});

export default Card;