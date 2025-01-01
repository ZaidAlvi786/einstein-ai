const InputField = ({ label, type, name, value, onChange, error }) => {
  return (
    <div className="flex flex-col mt-3">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`mt-3 px-3 py-1.5 rounded-lg border focus:outline-none ${
          error ? "border-red-500" : "border-white"
        } text-white bg-transparent`}
        style={{ color: "white", width: "350px" }}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1 w-[350px]">{error}</span>
      )}
    </div>
  );
};

export default InputField;
