import axios from "axios";
const getAccessToken = async () => {
  const API_KEY = "EwZYeYDZUoD56GpMUQ4kOOzrW"; // Replace with your API key
  const API_SECRET_KEY = "uTH51dQbEzSM7DlMrIbukGa6WsozDzhEavVmi7MbYVif1ffZ3O"; // Replace with your secret key

  const credentials = Buffer.from(`${API_KEY}:${API_SECRET_KEY}`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.x.com/oauth2/token",
      "grant_type=client_credentials", // Body data as a string
      {
        headers: {
          Authorization: `Basic ${credentials}`, // Basic Auth with encoded credentials
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Access Token:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.response?.data || error.message);
    throw error;
  }
};

// Call the function
getAccessToken();
