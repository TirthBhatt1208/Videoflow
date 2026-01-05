import type {UploadFile} from "../../Types/videoUpload.ts";
import OutputFFormat from "./OutputFFormat.tsx";

import OutputQuality from './OutputQuality.tsx';
import Privacy from "./privacy.tsx";
import ProccesingButton from "./ProccesingButton.tsx";
import ProccesingOptions from './ProccesingOptions.tsx';

function Setting({files}: {files: UploadFile[]}) {

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900 mb-1">
            Upload Settings
          </h3>
          <p className="text-sm text-slate-500">
            Configure your output preferences
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Output Quality */}
          <OutputQuality files={files}/>

          {/* Processing Options */}
          <ProccesingOptions />


          {/* Output Format */}
          <OutputFFormat/>


          {/* Privacy */}
          <Privacy/>


          {/* Start Processing Button */}
          <ProccesingButton/>
  
        </div>
      </div>
    </div>
  );
}

export default Setting