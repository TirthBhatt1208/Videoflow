import React from 'react'
import WelcomeSection from './WelcomeSection.tsx';
import StatsGrid from './StatsGrid.tsx';
import Recentactivity from './Recentactivity.tsx';
import ProcessingQueue from './ProcessingQueue.tsx';
import QuickUpload from './QuickUpload.tsx';
import Header from './Header.tsx';

function MainContent() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Grid */}
        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Recentactivity />

          {/* Processing Queue & Upload */}
          <div className="space-y-6">
            {/* Processing Queue */}
            <ProcessingQueue />

            {/* Quick Upload */}
            <QuickUpload />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainContent