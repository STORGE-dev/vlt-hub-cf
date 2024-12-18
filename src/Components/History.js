import React, { useState } from "react";
import { Spin, message, Modal, Checkbox } from "antd";
import axios from "axios";

function History({ GetData }) {
    const [isSpin, setIsSpin] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [verified, setVerified] = useState(false);
    const [allReqs, setallReqs] = useState(false);
    const [reqCount, setreqCount] = useState(false);
    const [key, setkey] = useState("");
    console.log(allReqs, reqCount)

    const Verify = () => {
        setIsSpin(true);
        if (key === 'del24x7') {
            setTimeout(() => {
                setVerified(true)
                setIsSpin(false);
                message.success('Verified');
            }, 300);

        } else {
            setTimeout(() => {
                setIsSpin(false);
                message.success('Invalid Key');
            }, 300);
        }

    }

    const HandleDelete = async () => {
        try {
            setIsSpin(true);
            if (allReqs === true) {
                await axios.delete("http://148.113.44.181:3000/api/v1/requests/delete-all-reqs");
                GetData()
                setIsSpin(false);
                setModalOpen(false)
                setVerified(false)
                message.success('Delete Successfull');
            }
            if (reqCount === true) {
                await axios.delete("http://148.113.44.181:3000/api/v1/requests/delete-req-count");
                GetData()
                setIsSpin(false);
                setModalOpen(false)
                setVerified(false)
                message.success('Delete Successfull');
            } else {
                setIsSpin(false);
                message.warning('Choose an option');
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <img
                src="/shredder.svg"
                alt="Web Development"
                className="w-8 hover:cursor-pointer"
                onClick={() => setModalOpen(true)}
            />
            <Modal
                title="Are you sure you want delete the request history?"
                centered
                open={modalOpen}
                onOk={() => { }}
                onCancel={() => setModalOpen(false)}
                footer={[]}
            >
                <>
                    <Spin size="large" spinning={isSpin} fullscreen={true} />
                    {verified === false ? (
                        <div className="flex flex-col mb-10 items-center mt-10 justify-center">
                            <h1 className="text-2xl font-bold text-white">Verify User</h1>
                            <p className="text-sm text-white mt-2">
                                Continue by confirming by entering the delete key
                            </p>
                            <div className="flex items-center justify-center mt-5">

                                <div className="flex flex-col w-full items-center space-y-5">

                                    <input
                                        type="password"
                                        value={key}
                                        onChange={(event) => setkey(event.target.value)}
                                        placeholder="Delete Key"
                                        className="border p-2 rounded-md w-[250px] text-white bg-transparent hover:border-blue-500"
                                    />

                                    <button
                                        onClick={Verify}
                                        className="bg-green-800 text-white py-1  px-6 rounded-md text-lg  w-fit max-w-xs"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (null)}


                    {verified === true ? (
                        <>
                            <div className=" flex flex-col items-center mt-8 justify-center">
                                <h1 className="text-2xl font-bold text-white">Select Data</h1>
                                <p className="text-sm text-white mt-2">
                                    Choose what data to be deleted
                                </p>
                            </div>
                            <div className=" flex flex-col space-y-3 mt-7 items-center justify-center">

                                <div className="space-x-5 mb-5">
                                    <Checkbox
                                        onChange={(e) => setreqCount(e.target.checked)}
                                        className="text-white"
                                    >
                                        Request Count
                                    </Checkbox>
                                    <Checkbox
                                        onChange={(e) => setallReqs(e.target.checked)}
                                        className="text-white"
                                    >
                                        All Requests
                                    </Checkbox>
                                </div>
                                <button
                                    onClick={HandleDelete}
                                    className="bg-green-800 text-white py-1 px-6 rounded-md text-lg  w-1/4 max-w-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    ) : (null)}

                </>
            </Modal>
        </>
    );
}

export default History;
