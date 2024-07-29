import { Dispatch, SetStateAction, useState } from "react";
import DishHelper from "../../helpers/DishHelper";
import { categoryIDs } from "../Home/CategoryDisplay";
import DishInfo from "../../types/DishInfo";
import Formatter from "../../helpers/Formatter";

export default function EditDishInfo({ dishInfo, setDishHelper, setEditID }: {
  dishInfo: DishInfo,
  setDishHelper: React.Dispatch<React.SetStateAction<DishHelper>>,
  setEditID: Dispatch<SetStateAction<string | null>>
}) {
  const [expirationTime, setExpirationTime] = useState<number>(dishInfo.expirationTime);
  const [name, setName] = useState<string>(dishInfo.name);
  const [categoryID, setCategoryID] = useState<string>(dishInfo.categoryID);

  function submit() {
    setDishHelper((old) => {
      const newDishData = { ...old.dishData[dishInfo.id] };
      newDishData.expirationTime = expirationTime;
      newDishData.name = name;
      newDishData.categoryID = categoryID;
      old.dishData[dishInfo.id] = newDishData;
      return old;
    });

    setEditID(null);
  }

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <p>Expiration Time: {Formatter.formatTime(expirationTime)}</p>
      <button onClick={() => setExpirationTime(time => (time + 1000 * 60 * 30))}>+30m</button>
      <button onClick={() => setExpirationTime(time => (time - 1000 * 60 * 30))}>-30m</button>
      <div>
        <label htmlFor="category-select">Category:</label>
        <select
          id="category-select"
          value={categoryID}
          onChange={(e) => setCategoryID(e.target.value)}
        >
          {Object.keys(categoryIDs).map((category) => (
            <option key={category} value={category}>
              {categoryIDs[category]}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => setEditID(null)}>Cancel</button>
      <button onClick={submit}>Submit</button>
    </div>
  );
}