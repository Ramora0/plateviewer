import { TagReads } from "../types/TagReads";

export default class API {
  static url = "https://rfp7desgu5.execute-api.us-east-1.amazonaws.com/prod";

  static async getPlates(): Promise<TagReads[]> {
    const tags = (await API.apiCall("tag_timestamps")).tags;
    const plateProps = [];

    for (const tagID in tags) {
      plateProps.push({
        tagID: tagID,
        timesSeen: tags[tagID],
      });
    }

    return plateProps;
  }

  static async apiCall(id: string): Promise<any> {
    const toURL = `${API.url}/get-data?id=${id}`;
    console.log(toURL);
    const response = await fetch(toURL).then((response) => response.json());
    return response;
  }
}
