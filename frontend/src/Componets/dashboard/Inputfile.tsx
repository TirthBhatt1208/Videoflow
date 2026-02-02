import React, { forwardRef} from "react";
import type { ChangeEvent } from "react";
import uploadVideos from "../../Services/uploadVideos";
import dashboardSection, {
  videoUploding,
  uploadVideoProcessing,
} from "../../Store/store";
import { useAuth } from "@clerk/clerk-react";

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
    const { addVideo } = uploadVideoProcessing();
    const {userId} = useAuth()
    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const fileList = e.target.files;

      if (!fileList || fileList.length === 0) {
        console.log("No files selected");
        return;
      }

      const files = Array.from(fileList);
      console.log("Files are: ", files);

      files.forEach((file, index) => {
        addVideo({
          id: index.toString(),
          fileName: file.name,
          progress: 0,
          status: "UPLOADING",
        });
      });


      try {

        setid("videoUploading");
        setActiveTab("videoUploading");
        setIsUploading()

        await uploadVideos(
          files,
          userId!,
        );
        
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
