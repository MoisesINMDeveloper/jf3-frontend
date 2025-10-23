interface ButtonProps {
  label?: string;
  onClick: () => void;
  color?: string;
  className?: string;
}

const Button = ({ label, onClick, color, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 
      ${color ?? " text-white hover:bg-secundary"} 
      ${className ?? ""}`}
    >
      {label}
    </button>
  );
};

export default Button;
