import React, { useEffect, useState, useRef } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import img from "../assets/Images/patrick-tomasso-Oaqk7qqNh_c-unsplash.jpg"
import LogoComponent from '../subComponents/LogoComponent'
import SocialIcons from '../subComponents/SocialIcons'
import { lightTheme } from "./Themes";
import DetailsBar from './DetailsBar'
import PowerButton from '../subComponents/PowerButton'
import InputSide from './InputSide'
import AnchorComponent from '../subComponents/Anchor'
import BigTitle from "../subComponents/BigTitlte"
import { motion } from "framer-motion";


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  background-color: whitesmoke;
  padding-bottom: 50px;
`;

const PageHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 120px;
`;

const FormContainer = styled.div`
  width: 70%;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
  height: 70vh;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextOne = styled.b`
  font-size: 30px;
  color: rgb(4, 4, 59);
  text-align: center;
`;

const TextTwo = styled.p`
  color: rgb(4, 4, 34);
  font-size: 15px;
  text-align: center;
`;

const BlogPage = () => {





    return (
        <>
            <ThemeProvider theme={lightTheme}>

                <LogoComponent theme="light" />
                <SocialIcons theme="light" />
                <PowerButton />
                <BigTitle text="Contactez-moi" top="10%" right="20%" />

                <PageWrapper>
                    <PageHeadingWrapper>
                    </PageHeadingWrapper>
                    <FormContainer>
                        <DetailsBar/>
                        <InputSide/>
                    </FormContainer>
                </PageWrapper>

            </ThemeProvider>
        </>
    )
}

export default BlogPage