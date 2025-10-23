import { MdOutlineCancel } from "react-icons/md";

const CloseCartIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      <button onClick={onClick} className="">
        <MdOutlineCancel className="text-secundary hover:text-fourth h-8 w-8" />
      </button>
    </>
  );
};

export default CloseCartIcon;
