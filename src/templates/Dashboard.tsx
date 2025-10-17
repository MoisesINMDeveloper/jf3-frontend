import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAliados, type Aliado } from "../constant/Api";
import AliadoCard from "../components/atoms/AliadoCard";

const Dashboard = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAliados() {
      const data = await getAliados();
      console.log("Aliados con productos:", data);
      // data.aliados viene como objeto con { status, aliados: [...] }
      setAliados(data.aliados || []);
    }
    fetchAliados();
  }, []);

  const handleAliadoClick = (id: number) => {
    navigate(`/aliados/${id}`); // ✅ ruta dinámica, no query param
  };

  return (
    <div className="bg-primary grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-20">
      {aliados.map((aliado) => (
        <AliadoCard
          key={aliado.id}
          id={aliado.id}
          name={aliado.name}
          image={aliado.image}
          onClick={handleAliadoClick}
        />
      ))}
    </div>
  );
};

export default Dashboard;
