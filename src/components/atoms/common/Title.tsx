import { useNavigate } from "react-router-dom";

const Title = ({ title, color }: { title: string; color?: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/"); // ✅ Redirige a la página principal
  };

  return (
    <button
      onClick={handleClick}
      className={`font-bold text-xl ${color} active:text-fourth `}
    >
     {title}
    </button>
  );
};

export default Title;
