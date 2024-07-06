export default interface DishInfo {
  name: string;
  expirationTime: number;
  expirationTimeDisplay: string;
  status: string;
  id: string;
  plateID: string;
  categoryID: string;
  stationID: string;
}

export interface BeltData {
  plateData: {
    [categoryID: string]: {
      [name: string]: number;
    };
  };
  expired: number;
  almostExpired: number;
  total: number;
}
