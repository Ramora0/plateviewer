import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DishHelper from "../../helpers/DishHelper";
import DishInfoDisplay from "./DishInfoDisplay";
import API from "../../helpers/API";
import EditDishInfo from "./EditDishInfo";
import { TagReads } from "../../types/TagReads";
import Select from "react-select";
import { InputActionMeta } from "react-select";

export default function Admin({ dishHelper, refreshDishData, setDishHelper, plates, setPlates }: {
  dishHelper: DishHelper;
  refreshDishData: () => void;
  setDishHelper: React.Dispatch<React.SetStateAction<DishHelper>>;
  plates: TagReads[];
  setPlates: React.Dispatch<React.SetStateAction<TagReads[]>>;
}) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  // const [messages, setMessages] = useState<{ [tagID: string]: string }>({});
  const [queue, setQueue] = useState<{ dishID: string, tagID: string }[]>([]);
  const [loading, setLoading] = useState<{ dishID: string, tagID: string } | null>(null);

  const [editID, setEditID] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (queue.length === 0 || loading !== null) return;

    const item = queue[0];
    setLoading(item);
    console.log("QUEUE", queue);
    API
      .getAPICall('change-tags?dishID=' + item.dishID + '&tagID=' + item.tagID)
      .then(() => {
        setLoading(null);
        setQueue((old) => old.filter((q) => JSON.stringify(q) !== JSON.stringify(item)));
      });
  }, [queue, loading]);

  useEffect(() => {
    const password = prompt('Enter password') ?? '';
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashHex === '56ee594f98747439310ab70e6924c76b381d68a94a7ed81ebbe932eb4660f441') {
        setLoggedIn(true);
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  function saveChanges() {
    API.postAPICall('update-dish-data', Object.values(dishHelper.dishData)).then(() => {
      refreshDishData();
    });
  }

  function addRoll() {
    const largestID = Math.max(...Object.keys(dishHelper.dishData).map((id) => parseInt(id)));
    const newID = "" + (largestID + 1);
    setDishHelper((old) => {
      old.dishData[newID] = {
        id: newID,
        name: 'New Roll',
        categoryID: '1',
        expirationTime: 1000 * 60 * 60 * 24 * 3,
        plateID: "",
        status: "",
        stationID: "",
      };
      return old;
    });
    setEditID(newID);
  }

  return ( //loggedIn ? (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Select
          value={null}
          options={Object.values(dishHelper.dishData).map((dish) => ({ value: dish.id, label: dish.name }))}
          onChange={(selectedOption) => {
            if (selectedOption === null) return;

            setEditID(selectedOption.value);
          }}
        />
        <button onClick={saveChanges}>Save Changes</button>
        <button onClick={addRoll}>Add Roll</button>
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
          {
            editID === null ?
              Object.values(dishHelper.dishData).map((dish) => (
                <div style={{ border: '1px solid black' }}>
                  <DishInfoDisplay dishInfo={dish} key={dish.id} />
                  <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <button style={{ fontSize: '22px' }} onClick={() => setEditID(dish.id)}>Edit</button>
                    <button style={{ fontSize: '22px' }} onClick={() => setDishHelper((old) => { delete old.dishData[dish.id]; return old; })}>Delete</button>
                  </div>
                </div>
              )) : <EditDishInfo dishInfo={dishHelper.dishData[editID]} setDishHelper={setDishHelper} setEditID={setEditID} />
          }
        </div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: '100vh', width: '500px' }}>
        {/* <div style={{ margin: '20px', padding: '7px', border: '1px solid black' }} onClick={refreshTags}>Refresh</div> */}
        {plates.reverse().map((plate) => (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px', justifyContent: 'space-between' }}>
            {plate.tagID}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Select
                value={{ value: plate.dishData!.id, label: plate.dishData!.name }}
                onChange={(selectedOption) => {
                  if (selectedOption === null) return;

                  setPlates((old) => {
                    const newPlates = [...old];
                    const index = newPlates.findIndex((p) => p.tagID === plate.tagID);
                    newPlates[index].dishData = dishHelper.getDishData(selectedOption.value);
                    return newPlates;
                  });
                }}
                options={Object.values(dishHelper.dishData).map((dish) => ({ value: dish.id, label: dish.name }))}
              />
              <div
                style={{ marginLeft: '20px', padding: '7px', border: '1px solid black' }}
                onClick={() => {
                  setQueue((old) => {
                    const newQueue = [...old];
                    newQueue.push({ dishID: plate.dishData!.id, tagID: plate.tagID });
                    return newQueue;
                  });
                }}
              >Save</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )// : (<></>);
}