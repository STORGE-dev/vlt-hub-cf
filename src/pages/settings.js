import React, { useState } from 'react';
import Header from '../Components/Header';
import { Checkbox, Button } from 'antd';

function Settings() {
  const [requestCount, setRequestCount] = useState(null); // State to hold the selected option for Request Count
  const [requestHistory, setRequestHistory] = useState(null); // State to hold the selected option for Request History
  const [isSaveVisibleForCount, setIsSaveVisibleForCount] = useState(false);
  const [isSaveVisibleForHistory, setIsSaveVisibleForHistory] = useState(false);

  // Handle changes for Request Count checkboxes (only one selectable at a time)
  const handleRequestCountChange = (value) => {
    setRequestCount(value);
    setIsSaveVisibleForCount(true); // Show "Save Changes" button when a selection is changed
  };

  // Handle changes for Request History checkboxes (only one selectable at a time)
  const handleRequestHistoryChange = (value) => {
    setRequestHistory(value);
    setIsSaveVisibleForHistory(true); // Show "Save Changes" button when a selection is changed
  };

  // Functions for handling Save and Delete for Request Count
  const handleSaveChangesCount = () => {
    console.log('Request Count changes saved');
    setIsSaveVisibleForCount(false); // Hide the "Save Changes" button after saving
  };

  const handleDeleteNowCount = () => {
    console.log('Request Count deleted now');
  };

  // Functions for handling Save and Delete for Request History
  const handleSaveChangesHistory = () => {
    console.log('Request History changes saved');
    setIsSaveVisibleForHistory(false); // Hide the "Save Changes" button after saving
  };

  const handleDeleteNowHistory = () => {
    console.log('Request History deleted now');
  };

  return (
    <>
      <Header />
      <div className="p-20 space-y-10">
        {/* Request Count Section */}
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl">Request Count</h2>
          </div>
          <div className="space-x-5">
            <Checkbox
              checked={requestCount === 'daily'}
              onChange={() => handleRequestCountChange('daily')}
              className="text-white"
            >
              Delete Daily
            </Checkbox>
            <Checkbox
              checked={requestCount === 'twoDays'}
              onChange={() => handleRequestCountChange('twoDays')}
              className="text-white"
            >
              Delete after 2 days
            </Checkbox>
            <Checkbox
              checked={requestCount === 'monthly'}
              onChange={() => handleRequestCountChange('monthly')}
              className="text-white"
            >
              Delete Monthly
            </Checkbox>
          </div>

          {/* Buttons for Request Count */}
          <div className="flex space-x-3">
            <Button
              className="bg-red-600 text-white rounded-md text-sm hover:bg-red-500 py-1 px-4"
              onClick={handleDeleteNowCount}
            >
              Delete Now
            </Button>

            {isSaveVisibleForCount && (
              <Button
                className="bg-green-800 text-white rounded-md text-sm hover:bg-green-700 py-1 px-4"
                onClick={handleSaveChangesCount}
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Request History Section */}
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl">Request History</h2>
          </div>
          <div className="space-x-5">
            <Checkbox
              checked={requestHistory === 'daily'}
              onChange={() => handleRequestHistoryChange('daily')}
              className="text-white"
            >
              Delete Daily
            </Checkbox>
            <Checkbox
              checked={requestHistory === 'twoDays'}
              onChange={() => handleRequestHistoryChange('twoDays')}
              className="text-white"
            >
              Delete after 2 days
            </Checkbox>
            <Checkbox
              checked={requestHistory === 'monthly'}
              onChange={() => handleRequestHistoryChange('monthly')}
              className="text-white"
            >
              Delete Monthly
            </Checkbox>
          </div>

          {/* Buttons for Request History */}
          <div className="flex space-x-3">
            <Button
              className="bg-red-600 text-white rounded-md text-sm hover:bg-red-500 py-1 px-4"
              onClick={handleDeleteNowHistory}
            >
              Delete Now
            </Button>

            {isSaveVisibleForHistory && (
              <Button
                className="bg-green-800 text-white rounded-md text-sm hover:bg-green-700 py-1 px-4"
                onClick={handleSaveChangesHistory}
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
