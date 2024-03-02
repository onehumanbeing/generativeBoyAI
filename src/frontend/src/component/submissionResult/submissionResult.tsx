
interface SubmissionComponentProps {
    amount: number;
    success: boolean;
  }

  const SubmissionComponent: React.FC<SubmissionComponentProps> = ({ amount, success }) => {
    const backgroundColor = success ? 'green' : 'red';

    return (
      <div style={{ backgroundColor: backgroundColor, color: 'white',borderRadius: '10px', textAlign: 'center' }}>
        {success ? (
          <>
            Congratulations, you won the lottery with the amount of ${amount.toFixed(2)}
          </>
        ) : (
          <>
            Unfortunately, your answer is wrong. You've paid the ticket. Better luck next time!
          </>
        )}
      </div>
    );
  }
  
  export default SubmissionComponent;

  

//   style={{
//     // marginTop: '50px',
//     // backgroundColor: '#4CAF50', // A shade of green, adjust as needed
//     // borderRadius: '50px', // Rounded ends for a capsule shape
//     // border: 'none', // Remove default border
//     // color: 'white', // Text color for contrast
//     // padding: '10px 20px', // Padding inside the button
//     // fontSize: '16px', // Font size for readability
//     // cursor: 'pointer', // Cursor change to indicate clickability
//     // whiteSpace: 'nowrap', // Prevent text wrapping
//     // display: 'inline-block', // Ensure button doesn't stretch to full container width
//     // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Optional: Adds a subtle shadow for depth
//   }}