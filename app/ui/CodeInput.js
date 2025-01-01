const CodeInput = ({ onDigitInput, index, forwardRef }) => (
  <input
    ref={forwardRef}
    className="flex-1 shrink-0 rounded-lg border border-solid border-neutral-400 h-[58px] text-center text-xl font-medium text-white bg-transparent"
    style={{ width: "54px", height: "58px" }}
    maxLength="1"
    onChange={(e) => onDigitInput(e, index)}
    type="text"
  />
);
export default CodeInput;
