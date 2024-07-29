import Formatter from "../../helpers/Formatter";
import { CategoryData } from "../../types/DishInfo";

export default function CategoryDetail({ data, name, unselect }: {
  data: CategoryData;
  name: string;
  unselect: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ background: 'white', margin: '10px', padding: '10px', borderRadius: '30px' }}
        onClick={unselect}>
        Back
      </div>
      <div
        style={{ background: 'white', margin: '10px', padding: '10px', borderRadius: '30px' }}>
        <h1>{name}</h1>
        <p>Total: {data.total}</p>
        <p>Expired: {data.expired}</p>
        <p>Almost Expired: {data.almostExpired}</p>
        <p>Average Age: {Formatter.formatTime(data.averageAge)}</p>
        {
          data.plates && (
            <div>
              <h3>Plates:</h3>
              <ul>
                {Object.entries(data.plates).map(([plateName, count]) => (
                  <li key={plateName}>
                    {plateName}: {count}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>
    </div>
  );
}