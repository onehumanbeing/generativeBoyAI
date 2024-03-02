// ChatComponent.tsx
import React, { useState, useEffect} from 'react';
// import './chatbot.css'; // Assume you've copied the CSS styles into this file
import ProgressBar from '../ProgressBar/progressbar';
import { ConnectKitButton } from 'connectkit';
import AddressValidation from '../harpie/addressValidation';
import SubmissionComponent from '../submissionResult/submissionResult';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const RTBGChatComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
  ]);
//   let progressRoundValue = 0; 
  const [progressRoundValue, setProgressRoundValue] = useState(0);
  const progressRoundMax = 10; 
  const [progressValue, setProgressValue] = useState(10);
  const progressMax = 100; 
  const [additionalInput, setAdditionalInput] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const lotteryAmount = 50.42;
 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };



  const script = `Welcome to a thrilling adventure in a mysterious Far Eastern ancient kingdom, surrounded by lush greenery and secret-filled palaces. As your Game Master (GM), I'm here to guide you through this adventure.

  You'll start by choosing your path. Feel free to share details about your character like traits and skills, but it's entirely up to you. No matter how much or little you tell, our journey will be full of discovery and wonder, enriched by the lore of this ancient land.
  
  Our goal is to explore the kingdom's secrets within 20 rounds. At key points, I'll offer you 3 to 5 choices (A, B, C, D, E) to decide the direction of our story. Don't worry about the depth of your character's backstory; the adventure will be immersive and engaging regardless.
  
  I promise to keep things fair and balanced, offering concise replies and ensuring our adventure is logical and exciting. This journey will be filled with intrigue, emotional depth, and the thrill of exploration. Character development is encouraged but not required. The narrative will adapt to our choices, ensuring a seamless experience.
  
  Let's dive into this adventure together, where every decision shapes our path through a world of mystery and challenges. Get ready for an unforgettable exploration in the ancient kingdom, where every turn is a new adventure. Remember, you'll always have options A, B, C, D, and sometimes E to choose from. Let the adventure begin without any need for pictures or pre-game inputs from you!
  `;
  

  useEffect(() => {

    const sendInitialScript = async () => {
        try {
          const response = await fetch('/agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                { role: "system", content: script },
              ],
              bounty: 1000 // Placeholder, adjust the bounty logic as needed
            }),
          });
          const data = await response.json();
          const newStr  = data.response;
          console.log("Initial script response:", data);
          const newBotMessage: Message = { role: 'bot', content: newStr }; 
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

          // Update your state based on the response if needed
        } catch (error) {
          console.error('Error sending initial script: ', error);
        }
      };
    
      // Call the function to send initial script
      sendInitialScript();


    // Clear data when the component mounts
    setMessages([]);
    setProgressRoundValue(0);
    setMessages([]);
    setIsSubmitted(false);
  }, []);

  const handleAdditionalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalInput(e.target.value);
  };

  const handleAdditionalInputSubmit = () => {
    console.log(additionalInput);
    setAdditionalInput('');
    setIsSubmitted(true);
    
  };


  const handleSubmit = async () => {
    if (input.trim() === '') {
      alert('Please Input some texts！');
      return;
    }

    const newUserMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');

    // let tempInput = "Imagine you are playing the role of my girlfriend during a trip we are on together. Unfortunately, none of the photos I've taken of you are suitable for posting on Instagram,\
    // In this role-play, after providing your response, you will give a rating of my message on a scale from -10 to 10, where -10 means you are very unhappy or angry about it as a person, and 10 means you are very happy or pleased about it as a person. Your response needs to align with your rating, meaning that if the rating shows unhappy then your response need to reflect angry and disappointment. End your response with three asterisks followed by the number representing the rating. For example, 'Your message is considerate, thank you for being so understanding. ***8. here is my message: " + input;
    const fruits: string[] = ['banana', 'apple', 'pineapple', 'orange', 'grape', 'watermelon', 'kiwi', 'pear', 'peach'];
    const getRandomFruit = (): string => {
        const randomIndex = Math.floor(Math.random() * fruits.length);
        return fruits[randomIndex];
      };
      const randomFruit = getRandomFruit();
   
   
       const messages: { role: string; content: string }[] = [    
        { role: "system", content: script }
        ];

    const newMessage = {
        role: "user",
        content: input,
    };
    
    messages.push(newMessage);


    try {

      const response = await fetch('/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

     

        body: JSON.stringify({
            messages,
            // messages: [{ role: "user", content: PROMPTS }],
            bountry: 1000 // Placeholder, adjust the bounty logic as needed
          }),
      });
      setProgressRoundValue(progressRoundValue+1);
      const data = await response.json();
      const newStr  = data.response;
      console.log("newStr", newStr);
      setProgressValue(0);

      const newBotMessage: Message = { role: 'bot', content: newStr }; 
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);


    } catch (error) {
      console.error('Error fetching data: ', error);
      const errorMessage: Message = { role: 'bot', content: 'Error! Please try again later!' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

    // const imagePath: string = './penguin.jpeg';
    // // Get a reference to the img element
    // const imgElement: HTMLImageElement = document.getElementById('myImage') as HTMLImageElement;
    // imgElement.src = imagePath;


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line in textarea
      handleSubmit();
    }
  };

  return (
  <div style={{ transform: 'translateY(-60%)' }}>
      {/* <h1 className="text-center m-b-lg">Chat with ChatGPT</h1> */}
      <div className="answer">

        <h2> Welcome Warrior! Are you ready for the next adventure? </h2>
        <h2> Lottery Amount: ${lotteryAmount}</h2>
      {/* <h2> 2000 years ago, there was a rumor that there was a giant jailed in the eastern castle. No one know its story and it's prohibited to ask anything about this. </h2>
      <h2> You are a warrior who just shipped from the other side of the ocean, are you ready for this adventure? </h2>
    <h2> You landed on the port, standing right infront of the castle, dark and huge. You walked in, no one guaided the entrance. Then you saw a old lady, what do you want to ask? </h2> */}

      {/* <h2> Lottery Amount: $425.25</h2>
      <ProgressBar
          value={progressValue}
          max={progressMax}
        //   label=""
          topLeftText="energy"
          topRightText={`${progressValue}/${progressMax}`}
          leftText=" current round / available rounds "
          rightText={`${progressRoundValue}/${progressRoundMax}`}
        /> */}

<div id="chatWindow" className="mb-3" style={{
  height: '500px', 
  overflowY: 'scroll', 
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}}>
  {messages.map((message, index) => (
    <div key={index} className="row message-bubble">
      {/* <img className="chat-icon" src={message.role === 'user' ? './card1.png' : './card2.png'} alt="icon" /> */}
      <p className="message-text">{message.content}</p>
    </div>
  ))}
</div>


     <div className="input-group ipt" style={{ padding: '10px 20px' }}>          
        <textarea
            id="chatInput"
            className="form-control"
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{width: '100%', borderRadius: '5px', padding: '5px' }}
          ></textarea>
          <button  style={{ padding: '10px 20px' }} id="chatBtn" className="btn btn-primary" type="button" onClick={handleSubmit}> Enter</button>
        </div>
      </div>
      
      <div className="additional-input-container" style={{ 
          position: 'fixed', 
          bottom: '10px', // Adjust as needed
          left: '50%',   // Center the container
          transform: 'translate(-50%, 400%)', // Center the container
          padding: '10px',
        //   background: '#fff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
          borderRadius: '5px' // Rounded corners
      }}>
                
    {!isSubmitted ? (

<div style={{
    
}}>
<input
type="text"
value={additionalInput}
onChange={handleAdditionalInputChange}
placeholder="Enter Your Answer"
style={{ width: '150px' }}
/>

<button
className="btn btn-primary"
type="button"
onClick={handleAdditionalInputSubmit}
style={{
    whiteSpace: 'nowrap' // Ensure button text does not wrap
}}
>
Submit Your Answer!
</button>
</div>

) : (
<div>
<SubmissionComponent amount={lotteryAmount} success={false}/>
</div>
)}
   
        
</div>
    </div>
  );
};

export default RTBGChatComponent;
