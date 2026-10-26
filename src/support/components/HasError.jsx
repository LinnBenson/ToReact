import { memo, useEffect } from "react";
import styled from "styled-components";
import { A } from "./Base";
import useAppContext from "../context/AppContext";

const View = styled.div`
    min-height: 100vh;
    min-height: 100dvh;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    padding: 64px 28px;
    background-color: rgb( var( --r0 ) );
    background-image:
        linear-gradient( rgba( var( --r1 ), 0.035 ) 1px, transparent 1px ),
        linear-gradient( 90deg, rgba( var( --r1 ), 0.035 ) 1px, transparent 1px );
    background-size: 48px 48px;
    color: rgb( var( --r1 ) );
    > .content {
        width: 100%;
        max-width: 560px;
    }
    .status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 32px;
        font-family: monospace;
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        &::before {
            content: '';
            width: 6px;
            height: 6px;
            flex-shrink: 0;
            background: rgb( var( --r5 ) );
        }
    }
    .code {
        margin: 0 0 24px;
        font-size: clamp( 80px, 22vw, 180px );
        font-weight: 700;
        line-height: 0.9;
        letter-spacing: -0.075em;
        overflow-wrap: anywhere;
    }
    .details {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 24px;
        border-top: 1px solid rgba( var( --r1 ), 0.2 );
        padding-top: 20px;
    }
    .message {
        margin: 0;
        font-size: 16px;
        line-height: 1.6;
        overflow-wrap: anywhere;
        min-width: 0;
    }
    .back {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        min-height: 44px;
        color: inherit;
        font-size: 12px;
        text-decoration: none;
        text-underline-offset: 5px;
        > span { transition: transform 160ms ease; }
        &:hover { text-decoration: underline; }
        &:hover > span { transform: translateX( 3px ); }
        &:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 4px;
        }
    }
    @media ( max-width: 480px ) {
        .details {
            flex-direction: column;
            gap: 16px;
        }
    }
    @media ( prefers-reduced-motion: reduce ) {
        .back > span { transition: none; }
    }
`;

const HasError = memo( ( { code, message } ) => {
    const { setTitle } = useAppContext();

    useEffect(() => { setTitle([ 'Error', code ?? 'oops' ]) }, [setTitle, code]);
    return (
        <View>
            <div className="content">
                <p className="status">Request interrupted</p>
                <h1 className="code">{code ?? 'Oops'}</h1>
                <div className="details">
                    <p className="message">{message || 'Something went wrong'}</p>
                    <A className="back" href="/">
                        <span>Back to Home</span>
                        <span aria-hidden="true">↗</span>
                    </A>
                </div>
            </div>
        </View>
    )
});

export default HasError;
