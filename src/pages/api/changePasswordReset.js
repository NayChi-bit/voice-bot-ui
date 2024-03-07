import env from "../../environments/config.json";
const changePasswordReset = async (formData) => {
  const url = env.apiTestUrl + "/api/user/changePasswordReset";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
  
export default changePasswordReset;
  