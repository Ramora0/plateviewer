import Formatter from "../../helpers/Formatter";
import { categoryIDs } from "../Home/CategoryDisplay";
import DishInfo from "../../types/DishInfo";

export default function DishInfoDisplay({ dishInfo }: { dishInfo: DishInfo }) {
  return (
    <div>
      <h4>{dishInfo.name}</h4>
      <p>Expiration Time: {Formatter.formatTime(dishInfo.expirationTime)}</p>
      <p>Category: {categoryIDs[dishInfo.categoryID]}</p>
    </div>
  );
}