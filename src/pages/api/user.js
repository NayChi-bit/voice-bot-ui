import env from "../../environments/config.json";
const userList = async () => {
  const url = env.apiTestUrl + "/api/user/list";

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
        
        return response;
    }catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

const userDetail = async (id) => {
  const url = env.apiTestUrl + "/api/user/detail/" + id;
  
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

const userCreate = async (formData) => {
  const url = env.apiTestUrl + "/api/user/add";

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

const userEdit = async (formData) => {
  const url = env.apiTestUrl + "/api/user/edit";

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

const userDelete = async (id) => {
  const url = env.apiTestUrl + "/api/user/delete/" + id;

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

const setAccLock = async (formData) => {
  const url = env.apiTestUrl + "/api/user/setAccLock";

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

export const systemUser = {
    userList, 
    userDetail,
    userCreate,
    userDelete,
    userEdit,
    setAccLock
};