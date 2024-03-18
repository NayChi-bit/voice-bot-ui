const employeeList = async (req, res) => {
    const url = "http://localhost:8080/api/employee/list";

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

const employeeDetail = async (id) => {
    const url = "http://localhost:8080/api/employee/detail/" + id;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
};

const employeeDelete = async (id) => {
  const url = "http://localhost:8080/api/employee/delete/" + id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const employee = {
    employeeList, 
    employeeDetail,
    employeeDelete
};