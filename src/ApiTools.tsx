const API_URL = 'na1.api.riotgames.com';

const API_KEY = process.env.REACT_APP_API_KEY;

// Example response
// {
//     "id": "wqHWPqzX1yTxqO4OR_A1f_1o7oSFw_xR_xYaF903oJJlPeY",
//     "accountId": "2x8NALnWqM0vWq8Q3GMgwIC6G1Vp5ePoq3hEKcPK7aHIPyk",
//     "puuid": "cYdxwJVOfdCH3m-XoxZ7rmg9tZT6lReauSDWH-_SYgyA9fI4TGT4WKnDAL9Rk7likdV4BE2GkSoh3w",
//     "name": "Yoobin",
//     "profileIconId": 20,
//     "revisionDate": 1707638578000,
//     "summonerLevel": 56
// }
export const getSummoner = async (summonerName: string) => {
  const response = await fetch(
    `https://${API_URL}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};