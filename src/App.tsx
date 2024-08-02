import { useEffect, useState } from 'react';
import './App.css';
import { TagReads } from './types/TagReads';
import API from './helpers/API';
import DishHelper from './helpers/DishHelper';
import DishInfo, { BeltData, CategoryData } from './types/DishInfo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';

export function timeLeft(timesSeen: number[], dishData: DishInfo, currentTime: number) {
  return dishData!.expirationTime - (currentTime - timesSeen[0]);
}

export function timeToSeen(timesSeen: number[], currentTime: number) {
  if (timesSeen.length === 0) {
    return Infinity;
  }

  const beltTime = timesSeen.length === 1 ? (785150) : timesSeen[1] - timesSeen[0];
  const endSesh = (timesSeen[timesSeen.length - 1]) + beltTime - 14 * 1000;
  const timeUntil = (endSesh - currentTime + beltTime) % beltTime;
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
    const categoryData: { [categoryID: string]: CategoryData } = {};
    let almostExpired = 0;
    let expired = 0;

    plates.forEach((plate) => {
      if (!plate.dishData) {
        console.log('no dish data', plate);
        return;
      }

      const categoryID = plate.dishData.categoryID;
      const name = plate.dishData.name;

      if (!categoryData[categoryID]) {
        categoryData[categoryID] = {
          plates: {},
          expired: 0,
          almostExpired: 0,
          total: 0,
          averageAge: 0,
        };
      }

      if (!categoryData[categoryID].plates[name]) {
        categoryData[categoryID].plates[name] = 0;
      }

      categoryData[categoryID].plates[name] += 1;
      categoryData[categoryID].total += 1;
      categoryData[categoryID].averageAge += currentTime - plate.timesSeen[0];

      if (daTimeLeft(plate) < 0) {
        expired += 1;
        categoryData[categoryID].expired += 1;
      } else if (daTimeLeft(plate) < plate.timesSeen[1] - plate.timesSeen[0]) {
        almostExpired += 1;
        categoryData[categoryID].almostExpired += 1;
      }
    });

    for (const categoryID in categoryData) {
      categoryData[categoryID].averageAge /= categoryData[categoryID].total;
    }

    const data = {
      categoryData,
      total: plates.length, //Why on gods green earth does this not include expired and almost expired plates??
      almostExpired,
      expired,
    }

    setBeltData(data);
  }, [plates, currentTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout; // This will hold the ID of the interval so we can clear it later


    const fetchData = async () => {
      try {
        console.log('running');

        const dishHelper = await refreshDishData();

        let loopNumber = 0;

        intervalId = setInterval(() => {
          setCurrentTime(new Date().getTime());
          // console.log('loop number', loopNumber);
          if (loopNumber % 20 === 0) {
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

              plates = plates.filter((plate) => {
                return plate.dishData?.name !== 'Shrimp Dumplings' &&
                  plate.dishData?.name !== 'Chicken Dumplings' &&
                  plate.dishData?.name !== 'Vegetable Spring Rolls';
              });

              setPlates(plates);

              // plates = plates.filter((plate) => {
              //   return daTimeLeft(plate) < 0 && plate.timesSeen.length > 1;
              // })

              // setPlatesThatAreExpiredBecauseTheyHaveBeenOnTheBeltTooLongAndAreNotSafeToEat(plates);
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

  async function refreshDishData() {
    const dh = await DishHelper.getData();
    setDishHelper(dh);
    return dh;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home plates={plates} beltData={beltData} currentTime={currentTime} />} />
        <Route path="/admin" element={<Admin dishHelper={dishHelper} refreshDishData={refreshDishData} setDishHelper={setDishHelper} plates={plates} setPlates={setPlates} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
