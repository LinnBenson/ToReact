import { memo, useRef, useState, useEffect } from "react";

/**
 * 加载组件
 */
const Loading = memo(({ active, mask = 'r0', type = 'default', children, height = '120px', style, ...props }) => {
    const typeMap = {
        default: <LoadingTypeDefault />,
        text: <LoadingTypeText />,
        ai: <LoadingTypeAI />
    };

    return (
        <div className={`unit-loading ${active ? 'unit-loading-active' : ''}`} style={{ ...style, '--minHeight': height }}>
            <div className={`unit-loading-animation unit-loading-animation-${type} ${mask ? `unit-loading-mask-${mask}` : ''} center`}>
                {typeMap[type] || typeMap['default']}
            </div>
            <div className="unit-loading-body">{children}</div>
        </div>
    );
});

const LoadingTypeDefault = memo(() => {
    return (
        <svg viewBox="0 0 16 16" height="48" width="48" className="unit-loading-animation-default-box">
            <circle r="7px" cy="8px" cx="8px"></circle>
        </svg>
    );
});

const LoadingTypeText = memo(() => {
    const boxRef = useRef( null );
    const [ lineCount, setLineCount ] = useState( 1 );

    useEffect(() => {
        const box = boxRef.current;
        if ( !box || typeof ResizeObserver === 'undefined' ) { return; }

        const observer = new ResizeObserver(( entries ) => {
            const styles = getComputedStyle( box );
            const lineHeight = parseFloat( styles.getPropertyValue( '--lineHeight' ) );
            const lineGap = parseFloat( styles.getPropertyValue( '--lineGap' ) );
            const height = entries[0].contentRect.height;
            const count = Math.max( 1, Math.floor( ( height + lineGap ) / ( lineHeight + lineGap ) ) );

            setLineCount(( currentCount ) => {
                return currentCount === count ? currentCount : count;
            });
        });

        observer.observe( box );

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={boxRef} className="unit-loading-animation-text-box" aria-hidden="true">
            {Array.from({ length: lineCount }, ( _, index ) => (
                <span key={index}></span>
            ))}
        </div>
    );
});

const LoadingTypeAI = memo(() => {
    return (
        <div className="unit-loading-animation-ai-box">
            <svg id="pegtopone" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" >
                <defs>
                <filter id="shine"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>
                <mask id="mask">
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="white" ></path>
                </mask>
                <radialGradient id="gradient-1" cx="50" cy="66" fx="50" fy="66" r="30" gradientTransform="translate(0 35) scale(1 0.5)" gradientUnits="userSpaceOnUse" >
                    <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                    <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                </radialGradient>
                    <radialGradient id="gradient-2" cx="55" cy="20" fx="55" fy="20" r="30" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                        <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                        <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="gradient-3" cx="85" cy="50" fx="85" fy="50" xlinkHref="#gradient-2"></radialGradient>
                    <radialGradient id="gradient-4" cx="50" cy="58" fx="50" fy="58" r="60" gradientTransform="translate(0 47) scale(1 0.2)" xlinkHref="#gradient-3"></radialGradient>
                    <linearGradient id="gradient-5" x1="50" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                        <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                    </linearGradient>
                </defs>
                <g>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="currentColor"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-1)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="none" stroke="white" opacity="0.3" strokeWidth="3" filter="url(#shine)" mask="url(#mask)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-2)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-3)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-4)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-5)"></path>
                </g>
            </svg>
            <svg id="pegtoptwo" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" >
                <defs>
                    <filter id="shine"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>
                    <mask id="mask">
                        <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="white" ></path>
                    </mask>
                    <radialGradient id="gradient-1" cx="50" cy="66" fx="50" fy="66" r="30" gradientTransform="translate(0 35) scale(1 0.5)" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                        <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                        <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="gradient-2" cx="55" cy="20" fx="55" fy="20" r="30" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                        <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                        <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="gradient-3" cx="85" cy="50" fx="85" fy="50" xlinkHref="#gradient-2"></radialGradient>
                    <radialGradient id="gradient-4" cx="50" cy="58" fx="50" fy="58" r="60" gradientTransform="translate(0 47) scale(1 0.2)" xlinkHref="#gradient-3"></radialGradient>
                    <linearGradient id="gradient-5" x1="50" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                        <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                    </linearGradient>
                </defs>
                <g>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="currentColor"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-1)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="none" stroke="white" opacity="0.3" strokeWidth="3" filter="url(#shine)" mask="url(#mask)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-2)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-3)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-4)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-5)"></path>
                </g>
            </svg>
            <svg id="pegtopthree" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" >
                <defs>
                    <filter id="shine"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>
                    <mask id="mask">
                        <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="white" ></path>
                    </mask>
                    <radialGradient id="gradient-1" cx="50" cy="66" fx="50" fy="66" r="30" gradientTransform="translate(0 35) scale(1 0.5)" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                        <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                        <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="gradient-2" cx="55" cy="20" fx="55" fy="20" r="30" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                        <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                        <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="gradient-3" cx="85" cy="50" fx="85" fy="50" xlinkHref="#gradient-2"></radialGradient>
                    <radialGradient id="gradient-4" cx="50" cy="58" fx="50" fy="58" r="60" gradientTransform="translate(0 47) scale(1 0.2)" xlinkHref="#gradient-3"></radialGradient>
                    <linearGradient id="gradient-5" x1="50" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                        <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                    </linearGradient>
                </defs>
                <g>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="currentColor"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-1)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="none" stroke="white" opacity="0.3" strokeWidth="3" filter="url(#shine)" mask="url(#mask)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-2)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-3)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-4)"></path>
                    <path d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z" fill="url(#gradient-5)"></path>
                </g>
            </svg>
        </div>
    );
});

export default Loading;
