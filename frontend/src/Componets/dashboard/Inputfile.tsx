import React, { forwardRef } from "react";
import type { ChangeEvent } from "react";
import uploadVideos from "../../Api/postApis";

interface InputFileProps {
  type: string;
  id: string;
  name: string;
  accept: string;
  className?: string;
}

const Inputfile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ type, id, name, accept, className }, ref) => {
    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const fileList = e.target.files;

      if (!fileList || fileList.length === 0) {
        console.log("No files selected");
        return;
      }

      const files = Array.from(fileList);
      console.log("Files are: ", files);

      await uploadVideos(files);
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
