import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import UnityBuildInfo from "../unity/UnityBuildInfo.json";

const { buildName, dataSize, wasmSize } = UnityBuildInfo;

// palette:  
// https://coolors.co/702781-bc227a-1ea8e1-f28e31-000000
const colorChange = keyframes` 
  0% { background: #702781; }
  25% { background: #bc227a; }
  50% { background: #1ea8e1; }
  75% { background: #f28e31; }
  100% { background: #000000; }
`;

const StyledBanner = styled.div<{ duration: number, progress: number }>`
  position: absolute;
  width: ${props => props.progress}%;
  height: 18px;
  background: #702781;
  font-size: 24px;
  color: #000000;
  text-align: center;
  align-items: center;
  animation: ${colorChange} ${(props) => props.duration}s linear infinite;
`;

const StyledImage = styled.img`
  display: flex;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LoadingScreenContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
`;

const startTime = Date.now();

const totalSize = parseInt(dataSize) + parseInt(wasmSize);
const loadSize = (Math.round((totalSize / 1048576) * 100) / 100);
const downloadSpeed = 1.5;
const estimatedLoadingTime = (Math.round((loadSize / downloadSpeed) * 100) / 100);
console.log("Loading " + loadSize + "MB, ETA " + estimatedLoadingTime + "s");

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(5); 
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const importedImg = await import(`./../assets/Build/${buildName}.jpg`);
      setImg(importedImg.default);
    };
    loadImage();
  }, []);

  // TODO: detect internet speed
  
  useEffect(() => { 

        // Simulate progress
        let progTick = Date.now();

        const progressInterval = setInterval(() => {
          // rate limiter
          if (Date.now() - progTick < 150){
            return;
          }
          progTick = Date.now();
          const elapsedTime = (Date.now() - startTime) / 1000;

          setProgress(() => {
            const newProgression = (elapsedTime / estimatedLoadingTime) * 100;

            if (newProgression >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return Math.round(newProgression);
          });

        }, 300);
      }, [progress])
  
    return (
      <LoadingScreenContainer>    
        <StyledBanner 
          duration={estimatedLoadingTime} 
          progress={progress}/>
        <StyledImage src={img} alt="ExeuδVR"/>
      </LoadingScreenContainer>
    );
};

export default LoadingScreen;