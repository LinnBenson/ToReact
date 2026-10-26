import { memo } from "react";
import { Outlet } from "react-router";
import styled from "styled-components";

const DefaultFrameBox = styled.div`
    padding: 30px;
    box-sizing: border-box;

    @media screen and (max-width: 580px) {
        padding: 16px;
    }
`;

const DefaultFrame = memo(() => {

    return (
        <DefaultFrameBox>
            <Outlet />
        </DefaultFrameBox>
    );
});

export default DefaultFrame;