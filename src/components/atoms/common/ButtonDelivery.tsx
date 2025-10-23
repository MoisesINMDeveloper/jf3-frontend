import {MdDeliveryDining} from "react-icons/md";

const ButtonDelivery=({onClick,color}: {onClick: () => void,label?: string; color?: string}) => {
    return <button className={`text-secundary  active:text-fourth flex flex-row border-secundary  font-semibold ${color}`} onClick={onClick}>

        <span className="underline underline-offset-4">Delivery Service</span>
        <MdDeliveryDining className="w-8 h-8 " />

    </button>;
}

export default ButtonDelivery;