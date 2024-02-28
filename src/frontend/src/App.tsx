import React from 'react';
import Slider from "react-slick";
import $ from 'jquery';
import { TweenMax, Power2, Power3, TimelineMax } from 'gsap';
import { ConnectKitButton } from 'connectkit';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';

class App extends React.Component {
  componentDidMount() {
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
    // ($('.slider') as any).slick({
    //   centerMode: true,
    //   centerPadding: '60px',
    //   slidesToShow: 3,
    //   slidesToScroll: 1,
    //   prevArrow: '<button type="button" class="slick-prev"> ← </button>',
    //   nextArrow: '<button type="button" class="slick-next"> →</button>',
    //   appendArrows: $('.slick-arrow-container'),
    // });
  }

  render() {
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
         <nav className="p-4">
          <div className="flex justify-end items-center">
            <ConnectKitButton />
          </div>
        </nav>
        </nav>
        <div className="m-grid"></div>
        <div className="m-logo" id="sectionZero">
          <div className="m-logo__wrap" id="sectionOne">
            <h1>GBA<br/></h1>
            <div className="subtitle">GameBoy AI</div>
            <h3> PRESS ENTER </h3>
          </div>
        </div>
        <div className="m-logo" id="sectionTwo">
          <h4> PRESS ENTER TO SELECT GAME </h4>
          <Slider {...settings} className='slider'>
            <div>
              <img src="card1.png"/>
            </div>
            <div>
              <img src="card2.png"/>
            </div>
            <div>
              <img src="card3.png"/>
            </div>
            <div>
              <img src="card4.png"/>
            </div>
            <div>
              <img src="card5.png"/>
            </div>
          </Slider>
          <div className="slick-arrow-container"></div>
          <img src="game.png" id="gameboy"/>
          <div id="gameContent">
            <div className="game-nav">
              <button id="closeBtn">✕</button>
            </div>
            <div className="game-body">
              <h2>Title</h2>
              <p> Description</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;