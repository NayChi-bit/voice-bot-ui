const organizationList = async (formData) => {
    const url = "http://localhost:8080/api/organization/list";

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
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

const organizationDelete = async (id) => {
    const url = "http://localhost:8080/api/organization/delete/" + id;
  
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

const organizationDetail = async (id) => {
    const url = "http://localhost:8080/api/organization/detail/" + id;
  
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


const organizationCreate = async (formData) => {
  const url = "http://localhost:8080/api/organization/add";

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

const organizationEdit = async (formData) => {
  const url = "http://localhost:8080/api/organization/edit";

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

const parentOrgList = async (level) => {
  const url = "http://localhost:8080/api/organization/parentOrgList/" + level;

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
export const organization = {
    organizationList, 
    organizationDelete,
    organizationDetail,
    organizationCreate,
    parentOrgList,
    organizationEdit
};
