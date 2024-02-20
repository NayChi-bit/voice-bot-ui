const loginAuth = async (formData) => {
    const url = "http://localhost:8080/api/auth/login";

try{
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    console.log(response.status);
    if (response.status !== 200 && response.status !== 423) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response;
    
} catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export default loginAuth;