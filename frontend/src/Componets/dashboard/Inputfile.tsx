import React, { forwardRef } from "react";

interface InputFileProps {
  type: string;
  id: string;
  name: string;
  accept: string;
  className?: string;
}

const Inputfile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ type, id, name, accept, className }, ref) => {
    return (
      <input
        type={type}
        id={id}
        name={name}
        accept={accept}
        ref={ref}
        className={className}
      />
    );
  }
);

export default Inputfile;
