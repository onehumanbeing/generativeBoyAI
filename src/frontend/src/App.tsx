import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import $ from 'jquery';
import { TweenMax, Power2, Power3, TimelineMax } from 'gsap';
import { ConnectKitButton } from 'connectkit';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';
import ChatComponent from './component/chatbot';
import { DAIAddress, getBalance, signPermit } from './permit';
import { useSigner, useAccount } from 'wagmi';
import AddressValidation from './component/harpie/addressValidation';
import RTBGChatComponent from './component/chatbot-rtbg/rtbgChatbot';
import { ethers } from 'ethers';
import { contractAddress, getArtelaBalance } from './artela';
import { BrowserRouter as Router, Route,Routes, Link } from 'react-router-dom';
import CreateGameComponent from './component/CreateGameComponent/createGameComponent';

const App = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: signer } = useSigner();
  const [isMaliciousAddress, setIsMaliciousAddress] = useState<boolean | null>(null);
  const [validationSummary, setValidationSummary] = useState<string>('');
  const [addressTags, setAddressTags] = useState<Record<string, boolean> | null>(null);
  const [daiBalance, setDaiBalance] = useState(null);
  const [artelaBalance, setArtelaBalance] = useState<null | string>(null);
  const [isCreateGameVisible, setIsCreateGameVisible] = useState(false);

      // function for Harpie service
      const validateAddress = async (address: string) => {
        try {
          const response = await fetch("https://api.harpie.io/v2/validateAddress", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              apiKey: "541e2fce-c0a1-495e-8989-ac4dc224d5fd",
              address: address
            })
          });

          // console.log("response of validateAddress is : ", response )
          const data = await response.json();
          
          console.log("data is :" , data);
          setIsMaliciousAddress(data.isMaliciousAddress);
          setValidationSummary(data.isMaliciousAddress ? data.summary : 'This address is safe.');
          setAddressTags(data.tags);


        } catch (error) {
          console.error('Error validating address:', error);
          setIsMaliciousAddress(null);
          setValidationSummary('Error validating address.');
        }
      };


  const [selectedGame, setSelectedGame] = useState<number | null>(1);

  useEffect(() => {
  
    // get dai address
    const fetchDaiBalance = async () => {
      const balance = await getBalance(DAIAddress);
  
      const divisor = ethers.BigNumber.from("1000000000000000000"); // Equivalent to 10^18
      const balanceInTokens = balance.div(divisor);
    
      // Assuming you have a specific reason for dividing by 10^6
      // const balanceInTokens = balance.div(10 ** 18);

      console.log("balanceInTokens +++++  ++++ ", balanceInTokens.toString());
    
      // Assuming setDaiBalance can handle a string
      setDaiBalance(balanceInTokens.toString()); 
      
    };

    fetchDaiBalance();
    const fetchArtelaBalance = async () => {
      try {
          const balance = await getArtelaBalance(contractAddress);
          if (balance !== undefined) {
              console.log("Balance in Ether:", balance);
              // Assuming setDaiBalance can handle numbers or strings
              setArtelaBalance(balance.toString()); // Convert to string if necessary
          }
      } catch (error) {
          console.error(`Failed to fetch balance: ${error}`);
      }
  };

  // Call the function to fetch balance
  fetchArtelaBalance();
  setSelectedGame(1);

    const grid = document.querySelector('.m-grid');
    const tl = new TimelineMax();
    TweenMax.set(grid, {
      transformPerspective: 400,
      transformOrigin: '50% 50%' 
    });
    const anim2Props = {
      rotationX: 75,
      y: '0%',
      ease: Power2.easeIn,
      transformPerspective: 300,
      onComplete: () => grid!.classList.add('is-animating') 
    };
    tl.
    to(grid, 1, { scaleY: 1.5, ease: Power3.easeIn }).
    to(grid, 1, anim2Props, '+=0.3').
    to('.m-logo__wrap', 1, { scale: 1 });
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        // Section Zero & one animation 
        if ($("#sectionZero").length) {
          const sectionOne = document.getElementById("sectionOne");
          if (sectionOne) {
            sectionOne.classList.add("press-enter");
          }
          setTimeout(function () {
            document.getElementById("sectionZero")?.classList.add("game-init");
          }, 1000);
          setTimeout(function () {
            document.getElementById("sectionZero")?.remove();
            document.getElementById("sectionTwo")?.classList.add("select-game");
          }, 2500);
        }
        // Section two animation 
        if ($("#sectionTwo").hasClass('select-game')) {
          document.getElementById("sectionTwo")?.classList.add("selected-game");
        }
      }
    });

    $("#closeBtn").click(function(){
      const sectionTwo = document.getElementById("sectionTwo");
      if (sectionTwo) {
        sectionTwo.classList.add("quit-game");
        setTimeout(function() {
          sectionTwo.classList.remove("selected-game");
          sectionTwo.classList.remove("quit-game");
        }, 6000); 
      }
    });

    // validate the smart contract using Harpie
    validateAddress(DAIAddress);

  }, []);




  // const response = await fetch("https://api.harpie.io/v2/validateAddress", {
  //   method: "POST",
  //   headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //       apiKey: "541e2fce-c0a1-495e-8989-ac4dc224d5fd",
  //       address: address
  //   })
  // })
  // const data = await response.json();

  // const headingText = data.isMaliciousAddress ? 'Malicious!' : 'Safe, verified by Harpie.';
  // const details = data.isMaliciousAddress ? data.summary : 'This address is safe.';
  // const tags = Object.entries(data.tags).map(([key, value]) => {
  //   const formattedKey = key.toLowerCase().replace(/_/g, ' ');
  //   return text(`${formattedKey}: ${value ? 'True' : 'False'}`);
  // });


  const handlePermit = async () => {
    const amount = "1000000000000000000000000"
    const deadline = Math.floor(Date.now() / 1000) + 86400;
    signPermit(signer, address ?? '', amount, deadline.toString() ?? '')
  }

  var settings = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <button type="button" className="slick-prev"> ← </button>,
    nextArrow: <button type="button" className="slick-next"> →</button>,
  };    

  
    return (
      <div className="wrapper">
           <nav className="p-4">
      <div className="flex justify-end items-center">
        <ConnectKitButton />
      </div>
      <div style={{ color: 'white' }} > Balance is : ${daiBalance}</div>
      {/* <div style={{ color: 'white' }} > Artela Balance is : ${artelaBalance}</div> */}
      <div className="w-1/6 h-1/2 text-right"> {/* Set width to 1/6, height to 1/2, and align to the right */}
        <AddressValidation
          isMalicious={isMaliciousAddress ?? false}
          summary={validationSummary}
          tags={addressTags ?? undefined} // Pass the tags as a prop
          // style={{ width: '100%', height: '100%' }} // Adjust the width and height of the AddressValidation component
        />
      </div>
    </nav>



        <div className="m-grid"></div>
        <div className="m-logo" id="sectionZero">
          <div className="m-logo__wrap" id="sectionOne">
            <h1 onClick={handlePermit}>GBA<br/></h1>
            <div className="subtitle">GameBoy AI</div>
            <h3> PRESS ENTER </h3>
          </div>
        </div>
        <div className="m-logo" id="sectionTwo">
          <h4> PRESS ENTER TO SELECT GAME </h4>
          <Slider {...settings} className='slider'>
          
          <button data-game-id="1" onClick={() => setSelectedGame(1)}>
            <div>
              <img src="card1.png"/>
              <div style={{ color: 'yellow', textAlign: 'center' }}>Guess The Fruit</div>
              <p style={{ color: 'white', textAlign: 'center' }}>Game1</p>
            </div>
          </button>

           <button data-game-id="2" onClick={() => setSelectedGame(2)}>
            <div>
              <img src="card2.png"/>
              <div style={{ color: 'yellow', textAlign: 'center' }}> Ancient Kingdom (Tabletop Role-playing game)</div>
              <p style={{ color: 'white', textAlign: 'center' }}>Game2</p>
            </div>
            </button>
            <div>
              <img src="card3.png"/>
              
              <div style={{ color: 'yellow', textAlign: 'center' }}> Sweet Talk Your Girlfriend </div>
              <p style={{ color: 'white', textAlign: 'center' }}>Game3</p>
            </div>
            <div>
              <img src="card4.png"/>
              <div style={{ color: 'yellow', textAlign: 'center' }}> Minecraft </div>
              <p style={{ color: 'white', textAlign: 'center' }}>Game4</p>
            </div>
            <div>
              <img src="card5.png"/>
              <div style={{ color: 'yellow', textAlign: 'center' }}> Among Us </div>
              <p style={{ color: 'white', textAlign: 'center' }}>Game5</p>
            </div>

          </Slider>
     
     
          <Router>
      <div>
      <button
   style={{
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'lowercase',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Adjust width as necessary
    border: 'none', // Optional: Removes the border
    background: 'transparent', // Optional: Sets a transparent background
    cursor: 'pointer' // Optional: Changes the mouse cursor on hover
  }}
  onClick={() => setIsCreateGameVisible(!isCreateGameVisible)}
>
  Create a New Game
</button>
{isCreateGameVisible && <CreateGameComponent />}
      </div>
    </Router>

          <div className="slick-arrow-container"></div>
          <img src="game.png" id="gameboy"/>
          <div id="gameContent">
            <div className="game-nav" style={{ transform: 'translateY(-200%)' }}>
              <button id="closeBtn">✕</button>
            </div>

            <div>
            {/* {selectedGame === 1 && <ChatComponent address={address} signer={signer} />} */}
            {selectedGame === 1 && <ChatComponent address={address} signer={signer} />}
            {selectedGame === 2 && <RTBGChatComponent address={address} signer={signer}  />}
            </div>


          </div>
  
          </div>
      </div>
    );
}

export default App;