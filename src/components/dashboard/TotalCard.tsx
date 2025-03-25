import { useNavigate } from "react-router";
import { TotalProps } from "../../types/dashboard.ts";
import {FaChevronRight} from "react-icons/fa6";

const TotalCard: React.FC<TotalProps> = ({redirect, displayTitle, value}) => {
    const navigate = useNavigate();
    const goToDetails = () => {
        navigate("/Home" + redirect);
    }
    function formatNumber(num: number): string {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        } else {
            return num.toString();
        }
    }
    return (
        <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer w-1/3 flex flex-col items-center">
            <h3 className="text-xl text-gray-800 font-medium mb-2">{displayTitle}</h3>
            <p className="text-6xl font-bold">{formatNumber(value)}</p>
            <button onClick={() => goToDetails()} className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer my-6 flex flex-row items-center gap-2">View details <FaChevronRight /></button>
        </div>
    );
}

export default TotalCard;