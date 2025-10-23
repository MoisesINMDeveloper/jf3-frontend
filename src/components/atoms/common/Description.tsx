const Description = ({ text, color }: { text: string; color?: string }) => {
  return (
    <p className={`text-[16px] text-justify ${color ?? "text-gray-400"} leading-relaxed`}>
      {text}
    </p>
  );
};

export default Description;
