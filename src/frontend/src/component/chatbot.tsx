// ChatComponent.tsx
import React, { useState, useEffect} from 'react';
import './chatbot.css'; // Assume you've copied the CSS styles into this file
import ProgressBar from './ProgressBar/progressbar';
import { ConnectKitButton } from 'connectkit';
import AddressValidation from './harpie/addressValidation';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
//   let progressRoundValue = 0; 
  const [progressRoundValue, setProgressRoundValue] = useState(0);
  const progressRoundMax = 10; 
  const [progressValue, setProgressValue] = useState(10);
  const progressMax = 100; 
  const [additionalInput, setAdditionalInput] = useState('');



//   const prompt = "During a trip, none of the photos taken for my girlfriend are suitable for posting on Instagram...";

    const prompt = "Please guess a fruit !"

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };


  useEffect(() => {
    // Clear data when the component mounts
    setMessages([]);
    setProgressRoundValue(0);
  }, []);

  const handleAdditionalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalInput(e.target.value);
  };

  const handleAdditionalInputSubmit = () => {
    console.log(additionalInput);
    setAdditionalInput('');
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

      const script = `You are a AI assistant of the guess-fruit game. The answer of this game is ${randomFruit}. User will chat with you to play this game and guess the fruit name.`;
    const messages: { role: string; content: string }[] = [
        {
            role: "system",
            content: script,
        },
        {
            role: "system",
            content: "You need to tell the user if their guess is correct or incorrect. You cannot provide too much inforamtion about the game. You need to make it concise and make each response to be within 12 words",
        },
        {
            role: "system",
            content: "If the user guess the right answer, you need to congraduate him/her."
        }
    ];

    // let tempInput = input;


    // const newPrompt = {
    //     role: "user",
    //     content: input,
    // };
    
    // // Append the new prompt to the PROMPTS array
    // PROMPTS.push(newPrompt);

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
  <div>
      {/* <h1 className="text-center m-b-lg">Chat with ChatGPT</h1> */}
      <div className="answer">

      <h2>Prompt: {prompt}</h2>
      
      <h2> Lottery Amount: $425.25</h2>
      <ProgressBar
          value={progressValue}
          max={progressMax}
        //   label=""
          topLeftText="energy"
          topRightText={`${progressValue}/${progressMax}`}
          leftText=" current round / available rounds "
          rightText={`${progressRoundValue}/${progressRoundMax}`}
        />

        <div id="chatWindow" className="mb-3">
          {messages.map((message, index) => (
            <div key={index} className="row message-bubble">
              <img className="chat-icon" src={message.role === 'user' ? './card1.png' : './card2.png'} alt="icon" />
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
            style={{ borderRadius: '5px' }}
          ></textarea>
          <button  style={{ padding: '10px 20px' }} id="chatBtn" className="btn btn-primary" type="button" onClick={handleSubmit}> Enter</button>
        </div>
      </div>
      
      <div className="additional-input-container" style={{ 
          position: 'fixed', 
          bottom: '10px', // Adjust as needed
          left: '50%',   // Center the container
          transform: 'translateX(-50%)', // Center the container
          padding: '10px',
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
          borderRadius: '5px' // Rounded corners
      }}>
        <input
          type="text"
          value={additionalInput}
          onChange={handleAdditionalInputChange}
          placeholder="Enter additional info here"
          style={{ 
            marginRight: '10px',
            width: '300px', // Adjust width as needed
            borderRadius: '5px',
            border: '1px solid #ccc' // Adjust border as needed
          }}
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
        <div>
        
        </div>
      </div>
       

    </div>
  );
};

export default ChatComponent;
