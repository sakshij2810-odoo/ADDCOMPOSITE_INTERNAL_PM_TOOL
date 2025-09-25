import { IDynamicFileObject } from 'src/types/IDynamicObject';
import { ICompanyInformation } from './comapany-info.types';
import { uploadFile } from 'src/mui-components/FileUpload/utils';
import { FILE_UPLOAD_KEYS } from 'src/constants/enums';

export const uplaodCompanyDocuments = async (
  documents: IDynamicFileObject,
  data: ICompanyInformation
): Promise<ICompanyInformation> => {
  let company_payload = data;

  for (let key in documents) {
    const document = documents[key];
    if (document) {
      const asPayload = {
        company_name: data.company_name,
        filename: document.name,
      };
      const file_path = await uploadFile(
        document,
        FILE_UPLOAD_KEYS.COMPANY_INFORMATION,
        company_payload[key as keyof ICompanyInformation] || '',
        asPayload
      );
      // Map the uploaded file to the correct field
      if (key === 'logo') {
        company_payload.preview_logo = file_path;
      } else if (key === 'fav_icon') {
        company_payload.preview_fav_icon = file_path;
      } else {
        company_payload[key as keyof ICompanyInformation] = file_path;
      }
    }
  }

  return company_payload;
};
