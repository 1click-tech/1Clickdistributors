import moment from "moment";
import { panelRoles } from "./data/commonData";
import { toast } from "react-toastify";
import { logout } from "@/store/auth/authReducer";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { Timestamp } from "firebase/firestore";

export const formatUnderScoreString = (string) => {
  if (!string) return null;

  return string?.split("_")?.join(" ");
};

export const convertTimeStamp = (time) => {
  if (!time?._seconds) {
    return null;
  }

  let dt = new Date(time._seconds * 1000);

  return moment(dt).format("DD-MM-YYYY hh:mm A");
};

// return subordinate and senior designations
export const compareDesignations = (dept, designation) => {
  let findDept = panelRoles.find((item) => item.department == dept);

  if (findDept) {
    let allRoles = findDept.hierarchy;

    let desgIndex = allRoles.findIndex((item) => item == designation);

    if (desgIndex != -1) {
      const superior = allRoles.slice(0, desgIndex);
      const subordinate = allRoles.slice(desgIndex + 1);
      return { superior, subordinate };
    } else {
      return { superior: [], subordinate: [] };
    }
  } else {
    return { superior: [], subordinate: [] };
  }
};

export const sendUsersToPages = (userType, router) => {
  console.log("in sendUsersToPages");
  if (userType == "internal_user") {
    router.replace("/board");
  } else if (userType == "distributor") {
    router.replace("/distributors");
  } else if (userType == "manufacturer") {
    router.replace("/manufacturers");
  } else {
    router.replace(`/${userType}`);
  }
};

export const handleLogout = ({ dispatch, router }) => {
  router.replace("/login");
  localStorage.removeItem("authToken");
  localStorage.removeItem("email");
  localStorage.removeItem("currentDisplayComponent");
  dispatch({ type: "LOGOUT" });
  dispatch(logout());
  toast.success("Logout successfully");
};

export const uploadFile = async (file) => {
  if (!file) {
    return { message: "file not found" };
  }
  const blob = await fileToBlob(file);
  const url = URL.createObjectURL(blob);

  return { success: true, blob, url };
};

export const fileToBlob = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        resolve(blob);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader?.readAsArrayBuffer(file);
    } catch (error) {
      reject();
    }
  });
};

// export async function uploadMediaFileToDB(file, storagePath) {
//   // Input validation
//   try {
//     let blob = await fileToBlob(file);
//     if ((!blob, !storagePath)) {
//       return { success: false, message: "Invalid inputs" };
//     }
//     let body = new FormData();
//     body.append("file", blob);
//     body.append("storagePath", storagePath);
//     console.log(body, "checkBody");
//     const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/quilingo/courses/uploadImageToDB`;
//     const token = localStorage.getItem("authToken");
//     const bearerToken = token.replace(/\"/g, "");
//     const resp = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: bearerToken,
//       },
//       body,
//     });
//     const response = await resp.json();
//     console.log("first response is", response);
//     if (response.success) {
//       let fileURL = response.fileURL;
//       return { success: true, fileURL };
//     }
//     return {
//       success: false,
//       message: response.message || "Something went wrong",
//     };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

export const uploadMediaFileToDB = async (file, storagePath) => {
  try {
    if (!file) {
      toast.error("No file selected");
      return { success: false };
    }

    // Reference to Firebase storage
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wrap the upload process in a promise
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle upload error
          toast.error("File upload failed: " + error.message);
          reject({ success: false });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL:", downloadURL);
            resolve({ success: true, downloadURL });
          } catch (apiError) {
            toast.error("Error uploading image: " + apiError.message);
            reject({ success: false });
          }
        }
      );
    });
  } catch (error) {
    // General error handling
    console.error("Error during upload process:", error);
    toast.error("Error during upload: " + error.message);
    return { success: false };
  }
};

// for formatting the value of disposition and subdisposition
export const formatValue = (value) => {
  if (!value) return null;

  return value?.split("_")?.join(" ");
};

export const convertFromTimeStamp = (time) => {
  if (!time?._seconds) {
    return null;
  }

  const dt = new Timestamp(time?._seconds, time?._nanoseconds).toDate();

  return dt;
};
