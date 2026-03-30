import React from 'react';
import styled from 'styled-components';

const Scriptsmith = () => {
  return (
    <StyledWrapper>
      <div className="parent ">
        <div className="card  rounded-[50px]  ">
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5">
              
            </span>
          </div>
          <div className="glass" />
          <div className="content 
          
pt-10 px-4 pb-4.5


xl:pt-6 xl:pl-8 xl:pr-15 xl:pb-7.5


2xl:pt-6 2xl:pl-10
                relative z-10 
                translate-z-6.5">
            <h1 className='text-3xl h-10 xl:text-4xl 2xl:text-7xl xl:h-20 tracking-wide font-bold bg-linear-to-r from-indigo-600 via-purple-500 to-pink-700 bg-size-[200%_200%]
               animate-[gradientMove_4s_ease_infinite] bg-clip-text text-transparent'><span className="title">Script Smith</span></h1>
            <span className="text font-mono block text-white/90 font-semibold text-[12px] xl:text-[20px] mt-0.5 xl:-mt-10 2xl:-mt-1">Powered by Precision</span>
          </div>
          
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;

  .parent {
 
perspective: 1000px;
  position: relative;
  width: 100%;
  height: 100%;
  }

  .card {
    width: 100%;
    height: 100%;
    border-radius: 40px;
    background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%);
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow:
      rgba(37, 5, 71, 0) 40px 50px 25px -40px,
      rgba(34, 5, 71, 0.2) 0px 25px 25px -5px;
    position: relative;
    z-index: 1;
  }

  .glass {
    
    transform-style: preserve-3d;
    position: absolute;
    inset: 1px;
    border-radius: 55px;
    border-top-right-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.349) 0%,
      rgba(255, 255, 255, 0.815) 100%
    );
     
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }

 

  

 

  

  

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    transform-style: preserve-3d;
    z-index: 5;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    right: 0;
    box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.233);
    transition: all 0.5s ease-in-out;
  }

  .logo .circle1 {
    width: 170px;
    transform: translate3d(0, 0, 20px);
    top: 8px;
    right: 8px;
  }

  .logo .circle2 {
    width: 140px;
    transform: translate3d(0, 0, 40px);
    top: 10px;
    right: 10px;
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
    transition-delay: 0.1s;
  }

  .logo .circle3 {
    width: 110px;
    transform: translate3d(0, 0, 60px);
    top: 17px;
    right: 17px;
    transition-delay: 0.2s;
  }

  .logo .circle4 {
    width: 80px;
    transform: translate3d(0, 0, 80px);
    top: 23px;
    right: 23px;
    transition-delay: 0.3s;
  }

  .logo .circle5 {
    width: 50px;
    transform: translate3d(0, 0, 100px);
    top: 30px;
    right: 30px;
    display: grid;
    place-content: center;
    transition-delay: 0.4s;
  }

  .logo .circle5 .svg {
    width: 20px;
    fill: white;
  }

  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 30deg);
    box-shadow:
      rgba(28, 5, 71, 0.3) 30px 50px 25px -40px,
      rgba(28, 5, 71, 0.3) 0px 25px 30px 0px;
  }

  .parent:hover .card .bottom .social-buttons-container .social-button {
    transform: translate3d(0, 0, 50px);
    box-shadow: rgba(34, 5, 71, 0.2) -5px 20px 10px 0px;
  }

  .parent:hover .card .logo .circle2 {
    transform: translate3d(0, 0, 60px);
    background: rgba(255, 255, 255, 0.3);
  }

  .parent:hover .card .logo .circle3 {
    transform: translate3d(0, 0, 80px);
    background: rgba(255, 255, 255, 0.4);
  }

  .parent:hover .card .logo .circle4 {
    transform: translate3d(0, 0, 100px);
    background: rgba(255, 255, 255, 0.5);
  }

  .parent:hover .card .logo .circle5 {
    transform: translate3d(0, 0, 120px);
    background: rgba(255, 255, 255, 0.6);
  }

  `;

export default Scriptsmith;
