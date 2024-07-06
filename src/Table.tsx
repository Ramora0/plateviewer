import { BeltData } from "./types/DishInfo";
export default function Table({ beltData }: { beltData: BeltData | undefined }) {
  if (!beltData) {
    return null;
  }

  const categories = Object.keys(beltData.plateData);
  const maxRows = Math.max(...categories.map(category => Object.keys(beltData.plateData[category]).length));

  const categoryIDs = {
    '3': 'Rolls',
    '8': 'Nigiri',
    '11': 'Salad',
    '12': 'Sweets',
    '13': 'Vegetarian',
    '15': 'Snacks',
    '17': 'Heated',
  } as { [categoryID: string]: string };

  function getCategoryName(categoryID: string) {
    if (!categoryIDs.hasOwnProperty(categoryID)) {
      return categoryID;
    }
    return categoryIDs[categoryID];
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <p style={{ color: 'red' }}>
          {beltData.expired}
        </p>
        <p>/</p>
        <p style={{ color: 'orange' }}>{beltData.almostExpired}</p>
        <p>/{beltData.total - beltData.almostExpired - beltData.expired}</p>
      </div>
      <table>
        <thead>
          <tr>
            {categories.map((categoryID) => (
              <th key={categoryID}>{getCategoryName(categoryID)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {categories.map((categoryID) => {
              const total = Object.values(beltData.plateData[categoryID]).reduce((a, b) => a + b, 0);
              return (
                <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                  Total: {total}
                </td>
              );
            })}
          </tr>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {categories.map((categoryID) => {
                const plates = Object.entries(beltData.plateData[categoryID])
                  .sort(([, aCount], [, bCount]) => bCount - aCount);
                const plate = plates[rowIndex];
                return (
                  <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                    {plate ? `${plate[0]}: ${plate[1]}` : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}