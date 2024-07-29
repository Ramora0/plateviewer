import Formatter from "../../helpers/Formatter";
import { CategoryData } from "../../types/DishInfo";

export default function Category({ data, name, selectMe }: {
  data: CategoryData;
  name: string;
  selectMe: () => void;
}) {
  return (
    <div
      style={{ background: 'white', margin: '10px', padding: '10px', borderRadius: '30px' }}
      onClick={selectMe}>
      <h1>{name}</h1>
      <p>Total: {data.total}</p>
      <p>Expired: {data.expired}</p>
      <p>Almost Expired: {data.almostExpired}</p>
      <p>Average Age: {Formatter.formatTime(data.averageAge)}</p>
    </div>
  );
}