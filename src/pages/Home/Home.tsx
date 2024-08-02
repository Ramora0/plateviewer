import { useNavigate } from "react-router-dom";
import { timeToSeen } from "../../App";
import Plate from "./Plate";
import CategoryDisplay from "./CategoryDisplay";
import { BeltData } from "../../types/DishInfo";
import { TagReads } from "../../types/TagReads";

export default function Home({ plates, currentTime, beltData }: {
  plates: TagReads[],
  currentTime: number,
  beltData: BeltData | undefined
}) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', background: '#EEE' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: 'calc(100vh - 75px)',
        // width: '500px'
        minWidth: '350px',
      }}>
        <div style={{
          margin: '20px',
          padding: '10px',
          borderRadius: '20px',
          paddingTop: '0px',
          background: 'white'
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'end' }}>
            <h2>Expired Plates</h2>
            <h4>Countdown</h4>
          </div>
          {plates.filter((plate) => timeToSeen(plate.timesSeen, currentTime) > 0).map((plate, index) => (
            <Plate
              key={index}
              tagID={plate.tagID}
              currentTime={currentTime}
              timesSeen={plate.timesSeen}
              dishData={plate.dishData}
              urgent={true}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => navigate('/admin')}>Admin</button>
        <CategoryDisplay beltData={beltData} />
      </div>
    </div>
  );
}