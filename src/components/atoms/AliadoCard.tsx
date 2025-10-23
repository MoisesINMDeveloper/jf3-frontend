import React from 'react';

interface AliadoCardProps {
  id: number;
  name: string;
  image: string; // ✅ Nueva prop para la imagen
  onClick: (id: number) => void;
}

const AliadoCard: React.FC<AliadoCardProps> = ({ id, name, image, onClick }) => (
  <div
    onClick={() => onClick(id)}
    className="cursor-pointer border border-secundary rounded shadow p-4 text-center hover:scale-105 transition"
  >
    <img
      src={image} // 🔹 Aquí usamos la imagen dinámica
      alt={name}
      className="mb-2 w-full h-32 object-cover rounded"
    />
    <h3 className="text-secundary font-bold">{name}</h3>
  </div>
);

export default AliadoCard;
