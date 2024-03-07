import env from "../../environments/config.json";
const changePassword = async (formData) => {
  const url = env.apiTestUrl + "/api/user/changePassword";
  
  const authToken = sessionStorage.getItem("authToken");
  const username = sessionStorage.getItem("username");
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": authToken,
        "User-Name": username,
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export default changePassword;
  