import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import FullScreen from "./FullScreen";

const LoaderItem = styled.div`
    position: relative;
    width: 2.5em;
    height: 2.5em;
    transform: rotate(165deg);
    &:before, &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 0.25em;
        transform: translate(-50%, -50%);
    }
    &::before { animation: before8 1.4s infinite; }
    &::after { animation: after6 1.4s infinite; }
    @keyframes before8 {
        0% { width: 0.5em; box-shadow: 1em -0.5em rgba(var( --r2 )), -1em 0.5em rgba(var( --r3 )); }
        35% { width: 2.5em; box-shadow: 0 -0.5em rgba(var( --r2 )), 0 0.5em rgba(var( --r3 )); }
        70% { width: 0.5em; box-shadow: -1em -0.5em rgba(var( --r2 )), 1em 0.5em rgba(var( --r3 )); }
        100% { box-shadow: 1em -0.5em rgba(var( --r2 )), -1em 0.5em rgba(var( --r3 )); }
    }
    @keyframes after6 {
        0% { height: 0.5em; box-shadow: 0.5em 1em rgba(var( --r4 )), -0.5em -1em rgba(var( --r5 )); }
        35% { height: 2.5em; box-shadow: 0.5em 0 rgba(var( --r4 )), -0.5em 0 rgba(var( --r5 )); }
        70% { height: 0.5em; box-shadow: 0.5em -1em rgba(var( --r4 )), -0.5em 1em rgba(var( --r5 )); }
        100% { box-shadow: 0.5em 1em rgba(var( --r4 )), -0.5em -1em rgba(var( --r5 )); }
    }
    position: absolute;
    top: calc(50% - 1.25em);
    left: calc(50% - 1.25em);
`;

const RouterLoader = memo(({ delay = 120 }) => {
    // 控制加载器的可见性，根据延迟时间显示，避免闪烁
    const [ visible, setVisible ] = useState( delay <= 0 );
    useEffect(() => {
        if ( delay <= 0 ) { setVisible( true ); return; }
        const timer = setTimeout(() => { setVisible( true ); }, delay );
        return () => { clearTimeout( timer ); };
    }, [ delay ]);

    if ( !visible ) { return null; }
    return (
        <FullScreen className="center" style={{ background: 'rgb( var( --r0 ), 0.75 )' }}>
            <LoaderItem></LoaderItem>
        </FullScreen>
    );
});

export default RouterLoader;