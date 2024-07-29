import { useState } from "react";
import Formatter from "../../helpers/Formatter";
import { BeltData } from "../../types/DishInfo";
import Category from "./Category";
import CategoryDetail from "./CategoryDetail";

export const categoryIDs = {
  '3': 'Rolls',
  '8': 'Nigiri',
  '10': 'Sashimi',
  '11': 'Salad',
  '12': 'Sweets',
  '13': 'Vegetarian',
  '15': 'Snacks',
  '16': 'Other',
  '17': 'Heated',
} as { [categoryID: string]: string };

export default function CategoryDisplay({ beltData }: { beltData: BeltData | undefined }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!beltData) {
    return null;
  }

  const categories = Object.keys(beltData.categoryData);
  const maxRows = Math.max(...categories.map(category => Object.keys(beltData.categoryData[category]).length));

  function getCategoryName(categoryID: string) {
    if (!categoryIDs.hasOwnProperty(categoryID)) {
      return categoryID;
    }
    return categoryIDs[categoryID];
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5px' }}>
        <p>Expired:</p>
        <p style={{ color: 'red' }}>
          {beltData.expired}
        </p>
        <div />
        <p>Almost Expired:</p>
        <p style={{ color: 'orange' }}>{beltData.almostExpired}</p>
        <div />
        <p>Fresh:</p>
        <p>{beltData.total - beltData.almostExpired - beltData.expired}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {selectedCategory === null ? categories.map((categoryID) =>
        (<Category
          key={categoryID}
          data={beltData.categoryData[categoryID]}
          name={getCategoryName(categoryID)}
          selectMe={() => setSelectedCategory(categoryID)}
        />)
        ) : (
          <CategoryDetail
            name={getCategoryName(selectedCategory)}
            data={beltData.categoryData[selectedCategory]}
            unselect={() => setSelectedCategory(null)}
          />
        )}
      </div>
      {/* <table>
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
              return (
                <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                  Total: {beltData.categoryData[categoryID].total}
                </td>
              );
            })}
          </tr>
          <tr>
            {categories.map((categoryID) => {
              return (
                <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                  Expired: {beltData.categoryData[categoryID].expired}
                </td>
              );
            })}
          </tr>
          <tr>
            {categories.map((categoryID) => {
              return (
                <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                  Almost Expired: {beltData.categoryData[categoryID].almostExpired}
                </td>
              );
            })}
          </tr>
          <tr>
            {categories.map((categoryID) => {
              return (
                <td key={categoryID} style={{ borderRight: '1px solid black' }}>
                  Average Age: {Formatter.formatTime(beltData.categoryData[categoryID].averageAge)}
                </td>
              );
            })}
          </tr>
          {/* {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {categories.map((categoryID) => {
                const plates = Object.entries(beltData.categoryData[categoryID].plates)
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
      </table > */
      }
    </div >
  );
}