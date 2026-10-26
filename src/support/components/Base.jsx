import { memo, useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { QRCodeSVG } from 'qrcode.react';
import useAppContext from "../context/AppContext";

/**
 * A 标签工具
 */
const A = memo(({ href, children, ...props }) => {
    if ( href && href.charAt( 0 ) === '/' ) {
        return (<Link to={href} {...props}>{children}</Link>);
    }else {
        return (<a href={href} {...props}>{children}</a>);
    }
});

/**
 * 图标工具
 */
const I = memo(({ name, className, block, size, style, ...props }) => {
    const iconStyle = size ? { ...style, '--size': size } : style;
    if ( name && name.startsWith('bi-') ) {
        return (
            <i
                className={`icon bi ${name} ${block ? 'block' : ''} ${className || ''}`}
                style={iconStyle}
                {...props}
            />
        );
    }

    return null;
});

/**
 * 二维码
 */
const QRCode = memo(({ value, size = 168, level = "H", marginSize = 0, bgColor = `rgb( var( --r0 ), 0 )`, fgColor = `rgb( var( --r1 ) )`, ...props }) => {
    const { th } = useAppContext();

    return (
        <QRCodeSVG
            value={value}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            marginSize={marginSize}
            imageSettings={{
                src: th.icon,
                width: 40,
                height: 40,
                excavate: true
            }}
            {...props}
        />
    );
});

/**
 * 按钮组件
 */
const Button = memo(({ children, href, target, animation, noBorder, color = 'r3', icon, size = 'medium', disabled, loading, solid, dashed, ...props }) => {
    const [ ripple, setRipple ] = useState( null );
    const rippleIdRef = useRef( 0 );
    const isRight = icon?.startsWith( 'right-' );
    if ( isRight ) { icon = icon.slice( 'right-'.length ); }
    const iconName = loading ? 'bi-arrow-repeat spin' : ( typeof icon === 'string' ? icon : null );
    const ButtonTag = href ? A : 'button';
    const colorMap = {
        r0: { '--background': 'var( --r0 )', '--color': 'var( --r1 )', '--border': 'var( --r0 )', '--borderType': 'solid' },
        r1: { '--background': 'var( --r1 )', '--color': 'var( --r0 )', '--border': 'var( --r1 )', '--borderType': 'solid' },
        r2: { '--background': 'var( --r2 )', '--color': 'var( --r2c )', '--border': 'var( --r2 )', '--borderType': 'solid' },
        r3: { '--background': 'var( --r3 )', '--color': 'var( --r3c )', '--border': 'var( --r3 )', '--borderType': 'solid' },
        r4: { '--background': 'var( --r4 )', '--color': 'var( --r4c )', '--border': 'var( --r4 )', '--borderType': 'solid' },
        r5: { '--background': 'var( --r5 )', '--color': 'var( --r5c )', '--border': 'var( --r5 )', '--borderType': 'solid' },
        r6: { '--background': 'var( --r6 )', '--color': 'var( --r1 )', '--border': 'var( --r6 )', '--borderType': 'solid' }
    };
    color = colorMap[color] || colorMap.r3;
    if ( solid || dashed || noBorder ) {
        const colorBackup = { ...color };
        color['--background'] = 'var( --r6 ), 0';
        color['--color'] = colorBackup['--background'];
        color['--border'] = colorBackup['--background'];
        if ( dashed || noBorder ) { color['--borderType'] = 'dashed'; }
    }
    const sizeMap = {
        small: { '--size': 'calc( var( --fontSize ) * 2 - 2px )', '--fontSizeData': 'calc( var( --fontSize ) - 3px )' },
        medium: { '--size': 'calc( var( --fontSize ) * 2 + 4px )', '--fontSizeData': 'calc( var( --fontSize ) - 1px )' },
        large: { '--size': 'calc( var( --fontSize ) * 2 + 10px )', '--fontSizeData': 'calc( var( --fontSize ) + 1px )' }
    }
    size = sizeMap[size] || sizeMap.medium;
    /**
     * 创建点击扩散效果
     * @param {PointerEvent} event 指针按下事件
     */
    const handlePointerDown = useCallback(( event ) => {
        if ( disabled || loading ) { return; }
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // 计算覆盖整个按钮所需的圆形半径
        const radius = Math.hypot(
            Math.max( x, rect.width - x ),
            Math.max( y, rect.height - y )
        );
        rippleIdRef.current += 1;
        setRipple({
            id: rippleIdRef.current,
            left: x - radius,
            top: y - radius,
            size: radius * 2
        });
    }, [ disabled, loading ]);

    return (<>
        <div className={`unit-button ${iconName ? 'unit-button-hasIcon' : ''} ${animation ? `unit-button-animation-${animation}` : ''} ${isRight ? 'unit-button-icon-right' : ''} ${children && children !== '' ? 'unit-button-hasText' : ''} ${noBorder ? 'unit-button-no-border' : ''} ${disabled ? 'unit-button-disabled' : ''} ${loading ? 'unit-button-loading' : ''}`} {...props}>
            <ButtonTag className="unit-button-inner" href={href} target={target} onPointerDown={handlePointerDown} style={{ ...color, ...size }}>
                {ripple ? (
                    <span
                        key={ripple.id}
                        className="unit-button-ripple"
                        style={{
                            left: ripple.left,
                            top: ripple.top,
                            width: ripple.size,
                            height: ripple.size
                        }}
                        onAnimationEnd={() => { setRipple( null ); }}
                    />
                ) : null}
                {iconName && !isRight ? <I className="unit-button-icon bold" name={iconName} /> : null}
                {children && children !== '' ? <span className="unit-button-text">{children}</span> : null}
                {iconName && isRight ? <I className="unit-button-icon bold" name={iconName} /> : null}
            </ButtonTag>
        </div>
    </>);
});

export { A, I, QRCode, Button };
