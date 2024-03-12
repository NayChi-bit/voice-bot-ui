const callLogList = async (req, res) => {
    const url = "http://localhost:8080/api/callLog/list";

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
    }catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export default callLogList;