import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { I } from "./Base";

/**
 * 全屏加载组件
 */
const UnitViewLoader = memo(({ loaderVisible }) => {
    return (
        <div id="loader" className={`center ${loaderVisible ? 'active' : ''}`}>
            <svg className="animation" width="240" height="240" viewBox="0 0 240 240">
                <circle className="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 660" strokeDashoffset="-330" strokeLinecap="round"></circle>
                <circle className="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 220" strokeDashoffset="-110" strokeLinecap="round"></circle>
                <circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
                <circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
            </svg>
        </div>
    );
});

/**
 * Toast 通知组件
 */
const UnitViewToastItem = memo(({ toast, status, removeToast, itemRef }) => {
    const [ closing, setClosing ] = useState( false );
    const closingRef = useRef( false );
    const removeTimerRef = useRef( null );
    /**
     * 开始关闭 Toast
     */
    const close = useCallback(() => {
        if ( closingRef.current ) { return; }
        closingRef.current = true;
        setClosing( true );
        removeTimerRef.current = setTimeout(() => { removeToast( toast.id ); }, 160 );
    }, [ toast.id, removeToast ]);
    useEffect(() => {
        if ( toast.timeout <= 0 ) { return; }
        const timer = setTimeout( close, toast.timeout );
        return () => { clearTimeout( timer ); };
    }, [ close, toast.timeout ]);
    useEffect(() => {
        return () => { if ( removeTimerRef.current !== null ) { clearTimeout( removeTimerRef.current ); } };
    }, []);

    return (
        <div ref={itemRef} className={`toast-box${closing ? ' is-closing' : ''}`} style={{ '--background': status.background, '--color': status.color }}>
            <div className="box-background toast-content">
                <I className="toast-content-icon" name={status.icon} />
                <span>{toast.content}</span>
                <I className="toast-content-close" name='bi-x-lg' onClick={close} />
            </div>
        </div>
    );
});
const UnitViewToast = memo(({ toastData, removeToast }) => {
    const itemRefs = useRef( new Map() );
    const previousPositionsRef = useRef( new Map() );
    useLayoutEffect(() => {
        const nextPositions = new Map();
        for ( const item of toastData ) {
            const element = itemRefs.current.get( item.id );
            if ( !element ) { continue; }
            const currentTop = element.getBoundingClientRect().top;
            const previousTop = previousPositionsRef.current.get( item.id );
            nextPositions.set( item.id, currentTop );
            if ( previousTop === undefined ) { continue; }
            const offset = previousTop - currentTop;
            if ( offset === 0 ) { continue; }
            element.animate(
                [
                    { transform: `translateY( ${offset}px )` },
                    { transform: 'translateY( 0 )' }
                ],
                { duration: 300, easing: 'cubic-bezier( 0.22, 1, 0.36, 1 )' }
            );
        }
        previousPositionsRef.current = nextPositions;
    }, [ toastData ]);
    const statusMap = {
        info: { icon: 'bi-lightbulb', background: 'var( --r3 )', color: 'var( --r3c )' },
        success: { icon: 'bi-check-circle', background: 'var( --r4 )', color: 'var( --r4c )' },
        error: { icon: 'bi-x-circle', background: 'var( --r5 )', color: 'var( --r5c )' },
        warning: { icon: 'bi-shield-slash', background: 'var( --r5 )', color: 'var( --r5c )' }
    };

    return (
        <div id="toast">
            {Object.values(toastData).map(( toast ) => (
                <UnitViewToastItem itemRef={( element ) => {
                    if ( element ) {
                        itemRefs.current.set( toast.id, element );
                    } else {
                        itemRefs.current.delete( toast.id );
                    }
                }} key={toast.id} toast={toast} status={statusMap[toast.status]} removeToast={removeToast} />
            ))}
        </div>
    );
});

export { UnitViewToast, UnitViewLoader };