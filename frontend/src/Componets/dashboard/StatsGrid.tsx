import React, { useEffect, useState } from 'react'
import {
  stats,
} from "../../Data/dashboard.ts";
import { getStats } from '../../Api/getApis.ts';
import { dashBoardStats } from '../../Store/store.ts';


function StatsGrid() {

  const [isLoading , setIsLoading] = useState(false)
  const {totalVideos , setTotalVideos , videosInQueue , setVideosInQueue , UsedStorage , setUsedStorage , completedToday , setCompletedToday} = dashBoardStats()
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await getStats();
      const data = response.data.data;

      setTotalVideos(Number(data.totalVideos._count));
      setVideosInQueue(Number(data.InQueue._count));
      setUsedStorage(Number(data.storage));
      setCompletedToday(Number(data.todayStats._count));

      setIsLoading(false);
    };

    fetchData();
  }, []);

  if(isLoading) {
    console.log("Loading from Stats Gride...")
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${stat.badgeColor}`}
                      >
                        {stat.label === "Of 10GB"
                          ? `${(UsedStorage * 10).toFixed(3)}%`
                          : stat.label}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.label === "Total Videos"
                        ? totalVideos
                        : stat.label === "Processing"
                          ? videosInQueue
                          : stat.label === "Completed Today"
                            ? completedToday
                            : stat.label === "Of 10GB"
                              ? Math.floor(UsedStorage)
                              : 0}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
  )
}

export default StatsGrid