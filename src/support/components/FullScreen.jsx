import styled from "styled-components";

const FullScreen = styled.div`
    width: var( --vw, 100vw );
    height: var( --vh, 100vh );
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
`;

export default FullScreen;