import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { Dropdown, Popconfirm, Spin, message, Pagination, Modal, DatePicker, TimePicker, Segmented, Switch } from "antd";
import axios from "axios";
import "./custom.css"
import dayjs from 'dayjs';
import History from "../Components/History";


const Normal = () => {
  const [Responses, setResponses] = useState(null);
  const [vltRequests, setVltRequests] = useState([]);
  const [paginatedRequests, setPaginatedRequests] = useState([]);
  const [isSpin, setIsSpin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [segmentFilter, setSegmentFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(5);

  const [inputValue, setInputValue] = useState("");
  const [DispatchType, setDispatchType] = useState("");
  const [updtId, setUpdtId] = useState("");
  const [vltDate, setDate] = useState(null);
  const [vlttime, setTime] = useState(null);
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");// For unique item IDs
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setmodalEdit] = useState(false);
  const [alertMode, setalertMode] = useState(false);

  // Define dropdown menu items for status change actions
  // eslint-disable-next-line no-sparse-arrays
  const items = (id, curStatus, Imei, latitude, longitude, date, time, type) => [
    {
      key: "1",
      label: (
        <a
          onClick={() => InitEditRequest(Imei, latitude, longitude, date, time, type)}
          style={{ color: "#00000" }}
        >
          Dispatch Again
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <Popconfirm
          title="Are you sure you want to change the status to Success?"
          onConfirm={
            curStatus !== "success"
              ? () => updateStatus(id, "success")
              : undefined
          }
          okText="Yes"
          cancelText="No"
          disabled={curStatus === "success"}
        >
          <a
            style={{
              color: curStatus !== "success" ? "green" : "gray",
              cursor: curStatus !== "success" ? "pointer" : "not-allowed",
            }}
          >
            {curStatus !== "success"
              ? "Change status to Success"
              : "Status already Success"}
          </a>
        </Popconfirm>
      ),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          title="Are you sure you want to change the status to Failed?"
          onConfirm={
            curStatus !== "failed" ? () => updateStatus(id, "failed") : undefined
          }
          okText="Yes"
          cancelText="No"
          disabled={curStatus === "failed"}
        >
          <a
            style={{
              color: curStatus !== "failed" ? "red" : "gray",
              cursor: curStatus !== "failed" ? "pointer" : "not-allowed",
            }}
          >
            {curStatus !== "failed"
              ? "Change status to Failed"
              : "Status already Failed"}
          </a>
        </Popconfirm>
      ),
    },
  ];




  const InitEditRequest = (Imei, latitude, longitude, date, time, type) => {
    console.log(Imei, latitude, longitude, date, time, type)
    setInputValue(Imei)
    setlatitude(latitude)
    setlongitude(longitude)
    setDate(date)
    setTime(time)
    handleEditTime()
    setDispatchType(type)
    setmodalEdit(true)
  }

  const handleEditTime = () => {
    if (vlttime) {
      const timeToEdit = dayjs(vlttime, 'h:mm a'); // Parse the time using Day.js
      if (timeToEdit.isValid()) {
        setTime(timeToEdit.format('h:mm a')); // Set formatted time
      } else {
        console.error('Invalid time format');
      }
    }
  };

  const ClearInputs = () => {
    setInputValue("");
    setDate(null);
    setTime(null)
    setlatitude("");
    setlongitude("");
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleLatInputChange = (event) => {
    setlatitude(event.target.value);
  };

  const handleLonInputChange = (event) => {
    setlongitude(event.target.value);
  };

  function formatDateTimeToGPS(time, date) {
    const [day, month, year] = date.split(" ").map(Number);
    const [timePart, period] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    const adjustedHours =
      period.toLowerCase() === "pm" && hours !== 12
        ? hours + 12
        : hours === 12
          ? 0
          : hours;

    const dateObject = new Date(year, month - 1, day, adjustedHours, minutes);

    const dayStr = String(dateObject.getDate()).padStart(2, "0");
    const monthStr = String(dateObject.getMonth() + 1).padStart(2, "0");
    const yearStr = String(dateObject.getFullYear()).slice(-2);

    const formattedDate = `${dayStr}${monthStr}${yearStr}`;

    const hoursStr = String(dateObject.getHours()).padStart(2, "0");
    const minutesStr = String(dateObject.getMinutes()).padStart(2, "0");
    const secondsStr = "00"; // Assuming seconds are not provided

    const formattedTime = `${hoursStr}${minutesStr}${secondsStr}`;

    return {
      formattedTime,
      formattedDate,
    };
  }

  const HandleUpdate = async () => {
    try {
      setIsSpin(true);
      const TD = formatDateTimeToGPS(vlttime, vltDate);


      if (DispatchType === 'NRM') {
        await axios.post('http://148.113.44.181:3000/trak24-liveupdate', {
          Imei: inputValue,
          Date: TD.formattedDate,
          Time: TD.formattedTime,
          latitude: latitude,
          longitude: longitude
        });

      } else {
        if (alertMode === false) {
          console.log('off')
          await axios.post('http://148.113.44.181:3000/trak24-liveupdate-alert-off', {
            Imei: inputValue,
            Date: TD.formattedDate,
            Time: TD.formattedTime,
            latitude: latitude,
            longitude: longitude
          });
        } else {
          console.log('on')
          await axios.post('http://148.113.44.181:3000/trak24-liveupdate-alert-on', {
            Imei: inputValue,
            Date: TD.formattedDate,
            Time: TD.formattedTime,
            latitude: latitude,
            longitude: longitude
          });
        }

      }

      IncrRequest();
      setIsSpin(false);
      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const IncrRequest = async () => {
    try {
      const res = await axios.post("/api/v1/requests/incr-request",
        {
          updtId: updtId,
          Imei: inputValue,
          Date: vltDate,
          Time: vlttime,
          latitude: latitude,
          longitude: longitude,
          status: "success",
          reqType: DispatchType
        }
      );
      setUpdtId(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (checked) => {
    setalertMode(checked);
  };


  const ConfirmFailedRequest = async () => {
    try {
      setIsSpin(true);
      await axios.put("/api/v1/requests/update-status", {
        updtId: updtId,
        status: "failed",
      });
      //ClearInputs()
      setModalOpen(false);
      setIsSpin(false);
      getRequests()
      message.success("Status Recorded!");
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    console.log(dateString)
    setDate(dateString);
  };

  const onChangeTime = (time, timeString) => {
    setTime(timeString);
    console.log(time, timeString);
  };

  const paginateRequests = (requests, page, size) => {
    const start = (page - 1) * size;
    const end = page * size;
    return requests.slice(start, end);
  };

  // Fetch all requests and handle pagination
  const getRequests = async () => {
    try {
      setIsSpin(true);

      // Fetch request stats
      const reqData = await axios.get("/api/v1/requests/get-request-data");
      console.log(reqData)
      setResponses(reqData.data.data[0]);

      // Fetch request list
      const response = await axios.get("/api/v1/requests/get-all-requests");
      const allRequests = response.data.data.reverse();

      setVltRequests(allRequests);
      setPaginatedRequests(paginateRequests(allRequests, currentPage, pageSize)); // Initial pagination
      setIsSpin(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getNRMRequests = async () => {
    try {
      setIsSpin(true);

      const response = await axios.get("/api/v1/requests/get-nrm-requests");
      const allRequests = response.data.data.reverse();

      setVltRequests(allRequests);
      setPaginatedRequests(paginateRequests(allRequests, currentPage, pageSize)); // Initial pagination
      setIsSpin(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getALTRequests = async () => {
    try {
      setIsSpin(true);

      const response = await axios.get("/api/v1/requests/get-alt-requests");
      const allRequests = response.data.data.reverse();

      setVltRequests(allRequests);
      setPaginatedRequests(paginateRequests(allRequests, currentPage, pageSize)); // Initial pagination
      setIsSpin(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (segmentFilter === 'NRM') {
      getNRMRequests();
    } else if (segmentFilter === 'ALT') {
      getALTRequests();
    } else {
      getRequests(); // Corrected to call getRequests()
    }
  }, [segmentFilter]);



  const updateStatus = async (id, status) => {
    try {
      setIsSpin(true);
      await axios.put("/api/v1/requests/update-status", {
        updtId: id,
        status: status,
      });
      getRequests(); // Refresh data after status update
      setIsSpin(false);
      message.success("Status Updated!");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    setPaginatedRequests(paginateRequests(vltRequests, page, size)); // Recalculate pagination on change
  };

  // Fetch requests on component mount
  useEffect(() => {
    getRequests();
  }, []);

  return (
    <>
      <Spin size="large" spinning={isSpin} fullscreen={true} />
      <Header />
      <div className="flex flex-col p-10 items-center justify-center space-y-5">
        <div className="flex flex-col mb-2 items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Update Requests</h1>
          <p className="text-xl text-white mt-2">
            Request history | Re-Dispatch requests | Clear request history
          </p>
        </div>

        <div
          className="flex flex-row rounded-md w-3/4 p-3 mb-10 items-center justify-between"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="flex justify-between items-center w-full p-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl">{Responses?.TotalReqs}</h1>
              <h1 className="text-lg">Total Successful Requests</h1>
            </div>

            <div className="h-16 w-px bg-gray-300"></div>

            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl">{Responses?.monthlyReqs}</h1>
              <h1 className="text-lg">Successful Requests</h1>
            </div>
            <div className="h-16 w-px bg-gray-300"></div>

            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl">{Responses?.failedReqs}</h1>
              <h1 className="text-lg">Unuccessful Requests</h1>
            </div>
          </div>
        </div>

        <div className="flex space-x-8">
          <Segmented
            options={['ALL', 'NRM', 'ALT']}
            size="large"
            onChange={(value) => {
              setSegmentFilter(value);
              setCurrentPage(1);
            }}
          />
           <History GetData={getRequests}/>
        </div>
        {paginatedRequests.length > 0 &&
          paginatedRequests?.map((req) => (
            <div
              key={req?._id}
              className="flex flex-row rounded-md w-2/4 p-5 items-center justify-between pr-10"
              style={{ backgroundColor: "#191919" }}
            >
              <div className="space-y-6">
                <div className="flex space-x-10">
                  <div className="flex flex-col items-start">
                    <div className="flex space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                        />
                      </svg>

                      <div>
                        <h2 className="text-gray-400 text-xs">IMEI</h2>
                        <h1 className=" text-white">{req?.Imei}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">

                    <div className="flex space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>

                      <div>
                        <h2 className="text-gray-400 text-xs">
                          Latitude & Longitude
                        </h2>
                        <h1 className=" text-white">
                          {req?.latitude} , {req?.longitude}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-10">
                  <div className="flex flex-col items-start">
                    <div className="flex space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>

                      <div>
                        <h2 className="text-gray-400 text-xs">Date</h2>
                        <h1 className=" text-white text-sm">{req?.Date}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <div className="flex space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <div>
                        <h2 className="text-gray-400 text-xs">Time</h2>
                        <h1 className=" text-white text-sm">{req?.Time}</h1>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <div className="flex space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 text-gray-400"
                      >
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>

                      <div>
                        <h2 className="text-gray-400 text-xs">Type</h2>
                        <h1 className=" text-white text-sm">{req?.reqType}</h1>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex space-x-3 justify-center items-center">
                <div
                  className={`flex h-fit px-3 rounded-md p-1 justify-center items-center ${req.status === "success"
                    ? "bg-green-700"
                    : req.status === "failed"
                      ? "bg-red-700 px-5"
                      : ""
                    }`}
                >
                  <h1>{req.status === "success" ? "Success" : "Failed"}</h1>
                </div>
                <Dropdown
                  menu={{
                    items: items(req._id, req.status, req?.Imei, req?.latitude, req?.longitude, req?.Date, req?.Time, req?.reqType),
                  }}
                  placement="bottomRight"
                  arrow={{
                    pointAtCenter: true,
                  }}
                >
                  <div className="flex w-fit h-fit border hover:cursor-pointer border-white rounded-full justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </div>
                </Dropdown>
              </div>
            </div>
          ))}
      </div>
      <div className="mb-10 ">
        <Pagination
          align="center"
          current={currentPage}
          total={vltRequests.length}
          defaultCurrent={1}
          pageSize={pageSize}
          onChange={handlePageChange}
          className="pagination-control"
        />
      </div>
      {/* Simple Pagination control */}


      <Modal
        title="Edit & Dispatch Request"
        centered
        width={800}
        open={modalEdit}
        keyboard={false}
        onOk={() => { }}
        onCancel={() => { ClearInputs(); setmodalEdit(false); }}
        footer={[]}
        style={{ backgroundColor: "black" }}
      >
        <>
          <Spin size="large" spinning={isSpin} fullscreen={true} />
          <div className="flex flex-col justify-center mt-10 items-center space-y-5">
            <div className="flex flex-row space-x-5 w-full">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="imeiInput"
                  className="mb-1 text-gray-400 text-xs"
                >
                  Enter Unit IMEI
                </label>
                <input
                  id="imeiInput"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Unit IMEI"
                  className="border p-2 rounded-md w-[300px] text-white bg-transparent hover:border-blue-500"
                />
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="timePicker"
                  className="mb-1 text-gray-400 text-xs"
                >
                  Select Time
                </label>
                <TimePicker
                  id="timePicker"
                  style={{ color: 'white' }}
                  use12Hours // Use 12-hour format
                  value={vlttime ? dayjs(vlttime, 'h:mm a') : null} // Set value with dayjs
                  format="h:mm a" // Format to 12-hour AM/PM
                  size="large" // Large size input
                  onChange={onChangeTime} // onChange handler
                />
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="datePicker"
                  className="mb-1 text-gray-400 text-xs"
                >
                  Select Date
                </label>
                <DatePicker
                  id="datePicker"
                  onChange={onChangeDate} // onChange handler for date selection
                  format="DD MM YYYY" // Custom date format
                  value={vltDate ? dayjs(vltDate, 'DD MM YYYY') : null} // Display the selected date
                  size="large" // Large size input
                  className="w-full bg-transparent text-white" // Custom styling (className)
                />
              </div>
            </div>

            <div className="flex  space-x-5 ">
              {DispatchType === 'ALT' ? (
                <div className="flex flex-col w-full space-y-2">
                  <label
                    htmlFor="latInput"
                    className="mb-1 text-gray-400 text-xs"
                  >
                    Alert Mode
                  </label>
                  <div>
                    <Switch checkedChildren="ON" unCheckedChildren="OFF" onChange={handleChange} defaultValue={alertMode} />
                  </div>

                </div>
              ) : (null)}

              <div className="flex flex-col w-full">
                <label
                  htmlFor="latInput"
                  className="mb-1 text-gray-400 text-xs"
                >
                  Latitude 100&lt;[x.xxxx]&gt;00N
                </label>
                <input
                  id="latInput"
                  type="text"
                  value={latitude}
                  maxLength={12}
                  onChange={handleLatInputChange}
                  placeholder="Latitude"
                  className="border p-2 rounded-md w-[250px] text-white bg-transparent hover:border-blue-500"
                />
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="longiInput"
                  className="mb-1 text-gray-400 text-xs"
                >
                  Enter Longitude 0&lt;[xx.xxxx]&gt;00E
                </label>
                <input
                  id="longiInput"
                  type="text"
                  value={longitude}
                  maxLength={11}
                  onChange={handleLonInputChange}
                  placeholder="Longitude"
                  className="border p-2 rounded-md w-[250px] text-white bg-transparent hover:border-blue-500"
                />
              </div>
            </div>

            <div className="p-5">
              <button
                onClick={HandleUpdate}
                className="bg-green-800 text-white py-2  px-6 rounded-md text-lg  w-full max-w-xs"
              >
                Dispatch Again
              </button>
            </div>
          </div>
        </>
      </Modal>



      <Modal
        title="Confirm Request Status"
        centered
        closable={false}
        open={modalOpen}
        maskClosable={false}
        keyboard={false}
        onOk={() => { }}
        onCancel={() => { }}
        footer={[]}
      >
        <>
          <Spin size="large" spinning={isSpin} fullscreen={true} />
          <div className="flex flex-col mb-10 items-center mt-10 justify-center">
            <h1 className="text-2xl font-bold text-white">
              Was the request successful ?
            </h1>
            <p className="text-sm text-white mt-2">
              Continue by confirming the current request status
            </p>
            <div className="flex space-x-5 mt-5">
              <button
                onClick={ConfirmFailedRequest}
                className="bg-red-800 text-white w-fit h-fit rounded-lg text-lg hover:bg-red-700 py-2 px-8 mb-4"
              >
                Failed
              </button>

              <button
                onClick={() => {
                  ClearInputs();
                  setModalOpen(false);
                  setmodalEdit(false);
                  getRequests();
                  message.success("Status Recorded!");
                }}
                className="bg-green-800 text-white w-fit h-fit rounded-lg text-lg hover:bg-green-700 py-2 px-8 mb-4"
              >
                Success
              </button>
            </div>
          </div>
        </>
      </Modal>

    </>
  );
};

export default Normal;


