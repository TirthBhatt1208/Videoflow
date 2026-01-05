import React from 'react'
import Title from './Title';
import DropZone from './DropZone';
import ActiveUpload from './ActiveUpload';

function MainUpload() {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Title Section */}
        <Title />

      {/* Drop Zone */}
        <DropZone />


      {/* Active Uploads */}
        <ActiveUpload />

    </div>
  );
}

export default MainUpload