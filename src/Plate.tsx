import React, { useEffect } from 'react';
import { TagReads } from './types/TagReads';
import DishHelper from './helpers/DishHelper';
import DishInfo from './types/DishInfo';
import Formatter from './helpers/Formatter';

const Plate: React.FC<TagReads & {
  currentTime: number;
  dishHelper: DishHelper;
}> = ({ tagID, timesSeen, currentTime, dishHelper }) => {
  const [dishData, setDishData] = React.useState<DishInfo>({} as DishInfo);

  useEffect(() => {
    if (!dishHelper.ready)
      return;

    const dishID = dishHelper.getDishID(tagID);
    const dishData = dishHelper.getDishData(dishID);
    setDishData(dishData);
  }, [tagID, dishHelper]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <h2 style={{ marginRight: '10px' }}>{tagID}</h2>
      <h2 style={{ marginRight: '10px' }}>{dishData.id}</h2>
      <h2 style={{ marginRight: '10px' }}>{dishData.name}</h2>
      <p>{Formatter.formatTime(currentTime - timesSeen[0])} / {Formatter.formatTime(dishData.expirationTime)}</p>
    </div>
  );
};

export default Plate;