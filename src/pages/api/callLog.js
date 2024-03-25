import env from "../../environments/config.json";
const callLogList = async (formData) => {
    const url = env.apiTestUrl + "/api/callLog/list";

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
             body: JSON.stringify(formData),
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
    }catch (error) {
    console.info("Error posting data:", error);
    throw error;
  }
};

export default callLogList;
