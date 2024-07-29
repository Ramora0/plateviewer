import React, { useEffect, useState } from 'react';
import { TagReads } from '../../types/TagReads';
import Formatter from '../../helpers/Formatter';
import { timeLeft, timeToSeen } from '../../App';

const Plate: React.FC<TagReads & {
  currentTime: number;
  urgent: boolean;
}> = ({ tagID, timesSeen, currentTime, dishData, urgent }) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(timeToSeen(timesSeen, currentTime) < 24 * 1000);
  }, [timesSeen, currentTime]);

  if (!dishData) {
    return <div>Loading...</div>;
  }
  const isExpired = currentTime - timesSeen[0] > dishData.expirationTime;

  let color;

  if (isExpired) {
    if (shown) {
      color = 'red';
    } else {
      color = 'darkred';
    }
  } else {
    if (shown) {
      color = 'darkorange';
    } else {
      color = 'black'
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #BBB',
    }}>
      {/* <h2 style={{ marginRight: '10px', color: isExpired ? 'red' : 'inherit' }}>{tagID}</h2>
      <h2 style={{ marginRight: '10px', color: isExpired ? 'red' : 'inherit' }}>{dishData.id}</h2> */}
      <h4 style={{ color, margin: '0px', marginTop: '10px' }}>{dishData.name}</h4>
      <p>
        {/* {Formatter.formatTime(Math.abs(timeLeft(timesSeen, dishData, currentTime)))} / */}
        {Formatter.formatTime(timeToSeen(timesSeen, currentTime))}
      </p>
    </div>
  );
};

export default Plate;