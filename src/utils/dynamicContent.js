import axios from "axios";
const AIRTABLE_READONLY_API_KEY = process.env.REACT_APP_API_AIRTABLE_KEY;
const endpointMap = {
  market: `${process.env.REACT_APP_API_AIRTABLE_URL}/Assets%20Submissions?maxRecords=1&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc&view=Grid%20view`,
  news: `${process.env.REACT_APP_API_AIRTABLE_URL}/News?maxRecords=3&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=desc&view=Grid%20view`,
};

const dynamicContent = async (endpoint) => {
  const responseFromAirtable = await axios.get(endpointMap[endpoint], {
    headers: {
      Authorization: `Bearer ${AIRTABLE_READONLY_API_KEY}`,
    },
  });

  return responseFromAirtable;
};

export default dynamicContent;
