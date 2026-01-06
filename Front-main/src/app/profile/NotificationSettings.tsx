"use client"
import React from 'react';

const NotificationSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h3>
      <div className="space-y-4">
        {[
          {
            title: 'Order Updates',
            description: 'Receive updates about your orders',
            defaultChecked: true
          },
          {
            title: 'Promotions',
            description: 'Receive updates about promotions and deals',
            defaultChecked: false
          },
          {
            title: 'Newsletter',
            description: 'Receive our weekly newsletter',
            defaultChecked: true
          }
        ].map((setting, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{setting.title}</h4>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={setting.defaultChecked} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;