import React, { forwardRef } from "react";
import type { ChangeEvent } from "react";
import uploadVideos from "../../Services/uploadVideos";
import dashboardSection, {
  videoUploding,
  uploadVideoProcessing,
} from "../../Store/store";

interface InputFileProps {
  type: string;
  id: string;
  name: string;
  accept: string;
  className?: string;
}

const Inputfile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ type, id, name, accept, className }, ref) => {

    const {setid , setActiveTab} = dashboardSection()
    const {setIsUploading} = videoUploding()
    const { setStatus , setProgress , setFileName} = uploadVideoProcessing();
    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const fileList = e.target.files;

      if (!fileList || fileList.length === 0) {
        console.log("No files selected");
        return;
      }

      const files = Array.from(fileList);
      console.log("Files are: ", files);

      try {

        setid("videoUploading");
        setActiveTab("videoUploading");
        setIsUploading()
        setFileName(files[0].name)
        await uploadVideos(files, setStatus, setProgress, setFileName);
        setIsUploading()
        
      } catch (error) {
        console.error("Error uploading files:", error);
        setIsUploading()
      }

    };

    return (
      <input
        type={type}
        id={id}
        name={name}
        accept={accept}
        ref={ref}
        className={className}
        multiple
        onChange={handleOnChange}
      />
    );
  }
);

export default Inputfile;
