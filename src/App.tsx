import React, { useEffect, useState } from 'react';
import './App.css';
import { TagReads } from './types/TagReads';
import Plate from './Plate';
import API from './helpers/API';
import DishHelper from './helpers/DishHelper';
import DishInfo, { BeltData } from './types/DishInfo';
import Table from './Table';

export function timeLeft(timesSeen: number[], dishData: DishInfo, currentTime: number) {
  return dishData!.expirationTime - (currentTime - timesSeen[0]);
}

export function timeToSeen(timesSeen: number[], currentTime: number) {
  if (timesSeen.length === 0) {
    return Infinity;
  }

  const beltTime = timesSeen.length === 1 ? (785150) : timesSeen[1] - timesSeen[0];
  const endSesh = (timesSeen[timesSeen.length - 1]) + beltTime;
  const timeUntil = (endSesh - currentTime);
  return timeUntil;
}

function App() {
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());
  const [dishHelper, setDishHelper] = useState<DishHelper>(new DishHelper());

  // const [platesThatAreExpiredBecauseTheyHaveBeenOnTheBeltTooLongAndAreNotSafeToEat,
  //   setPlatesThatAreExpiredBecauseTheyHaveBeenOnTheBeltTooLongAndAreNotSafeToEat]
  //   = useState<TagReads[]>([]);
  const [plates, setPlates] = useState<TagReads[]>([]);

  const [beltData, setBeltData] = useState<BeltData>();

  function daTimeLeft(plate: TagReads) {
    return timeLeft(plate.timesSeen, plate.dishData!, currentTime);
  }

  function daTimeToSeen(plate: TagReads) {
    return timeToSeen(plate.timesSeen, currentTime);
  }

  //Calculate belt data
  useEffect(() => {
    const plateData: { [categoryID: string]: { [name: string]: number } } = {};
    let almostExpired = 0;
    let expired = 0;

    plates.forEach((plate) => {
      const categoryID = plate.dishData!.categoryID;
      const name = plate.dishData!.name;

      if (!plateData[categoryID]) {
        plateData[categoryID] = {};
      }

      if (!plateData[categoryID][name]) {
        plateData[categoryID][name] = 0;
      }

      plateData[categoryID][name] += 1;

      if (daTimeLeft(plate) < 0) {
        expired += 1;
      } else if (daTimeLeft(plate) < plate.timesSeen[1] - plate.timesSeen[0]) {
        almostExpired += 1;
      }
    });

    const data = {
      plateData,
      total: plates.length,
      almostExpired,
      expired,
    }

    setBeltData(data);
  }, [plates]);

  //
  useEffect(() => {
    let intervalId: NodeJS.Timeout; // This will hold the ID of the interval so we can clear it later

    const fetchData = async () => {
      try {
        console.log('running');
        const dishHelper = await DishHelper.getData();
        setDishHelper(dishHelper);
        let loopNumber = 0;

        intervalId = setInterval(() => {
          setCurrentTime(new Date().getTime());
          // console.log(loopNumber);
          if (loopNumber % 10 === 0) {
            API.getPlates().then((plates) => {
              plates = plates.filter((plate) => plate.timesSeen.length > 0);
              plates = plates.map((plate) => {
                const dishID = dishHelper.getDishID(plate.tagID);
                const dishData = dishHelper.getDishData(dishID);

                plate.dishData = dishData;
                return plate;
              });
              plates = plates.sort((a, b) => {
                return timeToSeen(a.timesSeen, new Date().getTime()) - timeToSeen(b.timesSeen, new Date().getTime());
              });

              setPlates(plates);

              // plates = plates.filter((plate) => {
              //   return daTimeLeft(plate) < 0 && plate.timesSeen.length > 1;
              // })

              // setPlatesThatAreExpiredBecauseTheyHaveBeenOnTheBeltTooLongAndAreNotSafeToEat(plates);
              console.log(plates.length);
            });
          } else {
            setPlates((plates) => {
              return plates.sort((a, b) => {
                return timeToSeen(a.timesSeen, new Date().getTime()) - timeToSeen(b.timesSeen, new Date().getTime());
              });
            });
          }
          loopNumber++;
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      if (intervalId) clearInterval(intervalId); // Clear the interval
    };
  }, []);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100vh', width: '500px' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Table beltData={beltData} />
      </div>
    </div>
  );
}

export default App;
