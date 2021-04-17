import axios from 'axios';
const AIRTABLE_READONLY_API_KEY = "keyc9Awfjh1RPAbyZ";
const endpointMap = {
    market: "https://api.airtable.com/v0/appYoHNjKSpv1cPF2/Assets%20Submissions?maxRecords=1&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc&view=Grid%20view",
    news: "https://api.airtable.com/v0/appYoHNjKSpv1cPF2/News?maxRecords=3&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc&view=Grid%20view",
}

const dynamicContent = async (endpoint) => {
            //TODO: Move to environment variables
            const responseFromAirtable = await axios.get(endpointMap[endpoint], {
                headers: {
                    "Authorization": `Bearer ${AIRTABLE_READONLY_API_KEY}`
                }
            })

            return responseFromAirtable;
}

export default dynamicContent;