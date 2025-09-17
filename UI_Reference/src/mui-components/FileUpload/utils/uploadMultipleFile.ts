import axios_base_api from "src/utils/axios-base-api";
import { getUniqueId } from "../../../helpers";
import { IFileUpload } from "../FileUpload.type";

export const uploadMultipleFile = async (
  files: IFileUpload[],
  module_name: string,
  asPayload: {
    [key: string]: string | number | null;
  }
) => {
  let filesCount = 0;
  const formdata = new FormData();
  for (let file of files) {
    if (file.file) {
      filesCount++;
      formdata.append("files", file.file);
    }
  }
  formdata.append("module_name", module_name);
  formdata.append("as_payload", JSON.stringify(asPayload));
  if (filesCount === 0) {
    return {
      files,
      paths: files.map((item) => item.path),
    };
  }
  const res = await axios_base_api.post("/general/upload", formdata);
  const data: string[] = res.data.data;
  const finalList = [];
  let i = 0;
  if (data.length > 0) {
    for (let item of files) {
      const url = data[i];
      const obj = { ...item };
      if (item.file) {
        obj.file = null;
        obj.path = url;
        i++;
      }
      finalList.push(obj);
    }
    return {
      files: finalList,
      paths: finalList.map((item) => item.path),
    };
  }

  return {
    files,
    paths: files.map((item) => item.path)
  };
};


export const mergeFiles = async (
  files: IFileUpload[],
) => {
  let filesCount = 0;
  let fileName = "";

  const formdata = new FormData();
  for (let file of files) {
    if (filesCount === 0) {
      fileName = file.name || "";
    }
    if (file.file) {
      filesCount++;
      formdata.append("files", file.file);
    }
  }
  if (filesCount === 0) {
    return {
      files,
      paths: files.map((item) => item.path),
    };
  }
  const res = await axios_base_api.post("/general/merge-pdfs", formdata, {
    responseType: 'arraybuffer'
  });
  const blob = new Blob([res.data], { type: 'application/pdf' });

  // Create a File from the Blob with the specified file name
  const file = new File([blob], fileName, { type: 'application/pdf' });



  return {
    file
  }


};