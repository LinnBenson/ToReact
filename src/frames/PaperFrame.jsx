import { memo, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import FullScreen from "../support/components/FullScreen";
import "../assets/css/PaperFrame.css";
import useAppContext from "../support/context/AppContext";
import { A } from "../support/components/Base";
import { useCurrentRoute } from "../support/helpers/router";
import useUnitContext from "../support/context/UnitContext";
import styled from "styled-components";

const PaperFrameStyle = styled.div`
    .box-background {
        background: rgb( var( --r0 ), 0.5 );
    }
`;
const PaperFrame = memo(() => {
    const { th, app } = useAppContext();
    const { t } = useUnitContext();
    const { pathname } = useLocation();
    const scrollRef = useRef( null );
    const { route } = useCurrentRoute();
    useEffect( () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }, [ pathname ] );

    return (
        <FullScreen id="PaperFrame" ref={scrollRef} className="scroll" style={{ backgroundImage: `url( ${th.img} )` }}>
            <PaperFrameStyle>
                <div id="body">
                    <div id="content">
                        <header>
                            <A href="/"><img className="logo" src={th.logo} alt="Logo" /></A>
                            <h1 className="title more">{Array.isArray( route.title ) ? t( ...route.title ) : route.title}</h1>
                        </header>
                        <main>
                            <Outlet />
                        </main>
                        <footer>
                            <p className="copyright" dangerouslySetInnerHTML={{ __html: app.copyright }}></p>
                        </footer>
                    </div>
                </div>
            </PaperFrameStyle>
        </FullScreen>
    );
});

export default PaperFrame;