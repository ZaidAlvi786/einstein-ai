const DigitCodeConfirmation = ({ onClose }) => {
  // State to store the entered code
  const initialCodeState = ["", "", "", ""];
  const [code, setCode] = useState(initialCodeState);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleDigitInput = (event, index) => {
    const { value } = event.target;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (index < 3 && value !== "") {
      // Move focus to the next input box
      refs[index + 1].current.focus();
    }
  };

  return (
    <section className="flex flex-col px-6 pt-5 pb-9 rounded-[10px] bg-[#2D2D2D] min-w-[400px]">
      <header className="flex justify-end">
        <img
          loading="lazy"
          src="svg/close.svg"
          alt="close icon"
          onClick={onClose}
          className="self-end aspect-square w-[18px]"
        />
      </header>
      <h1 className="self-center mt-2 text-5xl text-center text-white whitespace-nowrap font-nasalization">
        4 Digit Code
      </h1>
      <div className="flex gap-2.5 self-center mt-9 max-w-full w-[248px]">
        {code.map((digit, index) => (
          <CodeInput
            key={index}
            index={index}
            forwardRef={refs[index]}
            onDigitInput={handleDigitInput}
          />
        ))}
      </div>
      <button
        className={`justify-center items-center px-16 py-2 mt-9 text-white rounded-xl bg-gradient-to-r from-[#7B88FF] to-[#64D0FF] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
        tabIndex="0"
      >
        Confirm
      </button>
    </section>
  );
};
export default DigitCodeConfirmation;
