// Reusable Button Component
const RegisterButton = ({
  imageUrl,
  altText,
  buttonText,
  extraClasses,
  onClick,
}) => (
  <button
    className={`flex items-center justify-between px-4 py-3 w-full rounded-xl shadow ${extraClasses}`}
    onClick={onClick}
  >
    <img src={imageUrl} alt={altText} className="w-6 h-6  mr-2" />
    <span className="flex-auto text-left">{buttonText}</span>
  </button>
);
export default RegisterButton;
