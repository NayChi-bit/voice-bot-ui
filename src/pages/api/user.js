const userList = async () => {
    const url = "http://localhost:8080/api/user/list";

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200 && response.status !== 423) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        response.map(element => {
            alert(element);
        });
        return response;
    }catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export default userList;