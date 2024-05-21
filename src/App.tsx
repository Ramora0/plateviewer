import React, { useEffect, useState } from 'react';
import './App.css';
import { TagReads } from './types/TagReads';
import Plate from './Plate';
import API from './helpers/API';
import DishHelper from './helpers/DishHelper';

function App() {
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());
  const [loopNumber, setLoopNumber] = useState<number>(0);
  const [dishHelper, setDishHelper] = useState<DishHelper>(new DishHelper());

  useEffect(() => {
    API.getPlates().then((plates) => {
      setPlates(plates);
    });
    (async () => {
      const dishHelper = await DishHelper.getData();
      setDishHelper(dishHelper);
    })();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
      if (loopNumber % 10 === 0) {
        // API.getPlates().then((plates) => {
        //   setPlates(plates);
        // });
      }
      setLoopNumber((prev) => ((prev + 1)));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loopNumber]);

  const [plates, setPlates] = useState<TagReads[]>([
  ]);


  return (
    <div className="App">
      <div>
        {plates.map((plate, index) => (
          <Plate
            dishHelper={dishHelper}
            key={index}
            tagID={plate.tagID}
            currentTime={currentTime}
            timesSeen={plate.timesSeen}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
