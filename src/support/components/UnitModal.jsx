import { memo, Children } from "react";
import styled from "styled-components";
import { I } from "./Base";

const UnitModalItemBox = styled.div`
    @media ( max-width: calc( ${( props ) => props.$maxWidth} + 40px ) ) { max-width: calc( 100% - 40px ); }
`;
const UnitModalItem = memo(({ item, removeModal, completeRemoveModal }) => {
    const handleMaskClick = ( event ) => {
        if ( event.target !== event.currentTarget ) { return; }
        if ( item.mask === false || item.maskClosable === false ) { return; }
        removeModal( item.id );
    };
    const handleAnimationEnd = ( event ) => {
        if ( event.target !== event.currentTarget || !item.closing ) { return; }
        completeRemoveModal( item.id );
    };
    const boxClassName = [ 'modal-item-box', 'center', item.mask !== false ? 'has-mask' : '', item.closing ? 'closing' : '' ].filter( Boolean ).join( ' ' );

    return (
        <div className={boxClassName} onClick={handleMaskClick} style={{ "--modalWidth": item.width }}>
            <UnitModalItemBox $maxWidth={item.width} className={`modal-item box-background ${item.closing ? 'closing' : ''}`} onAnimationEnd={handleAnimationEnd}>
                {( ( item.title && typeof item.title === 'string' ) || ( item.icon && typeof item.icon === 'string' ) || item.close ) && (<>
                    <div className="modal-item-header">
                        {item.icon && typeof item.icon === 'string' && (<>
                            <I className="modal-item-header-icon bold" name={item.icon} block />
                        </>)}
                        {item.title && typeof item.title === 'string' && (<>
                            <h5 className={`more ${item.icon && typeof item.icon === 'string' ? '' : 'no-icon'}`}>{item.title}</h5>
                        </>)}
                        {item.close && (<>
                            <I className="modal-item-header-close click" name="bi-x-lg" onClick={() => { removeModal( item.id ); }} block />
                        </>)}
                    </div>
                </>)}
                <div className="modal-item-body">
                    <div className="modal-item-body-content scroll">{item.content ?? ''}</div>
                </div>
                {item.buttons && item.buttons.length > 0 && (
                    <div className="modal-item-footer">
                        {Children.toArray( item.buttons )}
                    </div>
                )}
            </UnitModalItemBox>
        </div>
    );
});
const UnitModal = memo(({ modalData, removeModal, completeRemoveModal }) => {

    return (
        <div id="modal">
            {modalData.map(( item ) => (
                <UnitModalItem key={item.id} item={item} removeModal={removeModal} completeRemoveModal={completeRemoveModal} />
            ))}
        </div>
    );
});

export default UnitModal;