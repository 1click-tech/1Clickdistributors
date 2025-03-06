import { useState, useEffect, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { GrCheckboxSelected, GrCheckbox } from "react-icons/gr";
import Modal from "../utills/Modal";
import { panelRoles, panels } from "@/lib/data/commonData";
import panelContext from "@/lib/context/panelContext";

const camelToTitle = (string) => {
  if (!string) {
    return null;
  }

  let arr = string.split("_");
  return arr.join(" ");
};

const ManageRoles = () => {
  const [panelList, setPanelList] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [selectedPanels, setSelectedPanels] = useState([]);
  const [assignToList, setAssignToList] = useState([]);
  const [unassignFromList, setUnAssignFromList] = useState([]);
  const [selectSelected, setSelectSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { allUserRoles } = useContext(panelContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const array1Ids = allUserRoles?.map((obj) => `${obj.id}_${obj.department}`);
    let filteredArray2 = panelRoles.map((role) => {
      let roles = role.hierarchy;
      return roles
        ?.filter((item) => {
          return !array1Ids.includes(`${item}_${role.department}`);
        })
        ?.map((item2) => ({
          id: item2,
          department: role.department,
          panels: [],
        }));
    });

    filteredArray2 = filteredArray2.flat();
    let resultArray = allUserRoles.concat(filteredArray2);
    setData(resultArray);
  }, [allUserRoles]);

  const handleResize = () => {
    const resolution = window.innerWidth;
    if (resolution < 769) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const queryClient = useQueryClient();

  const handleClick = (item) => {
    const panel = item.panel;
    setPanelList((prev) => {
      if (prev.includes(panel)) {
        return prev.filter((item) => item !== panel);
      }
      return [...prev, panel];
    });
  };

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/roles/assignPanelToRole`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: assignToList.hierarchy,
          department: assignToList.department,
          panels: panelList,
        }),
      });
      const res = await response.json();

      if (response.status === 200) {
        toast.success("Panels Assigned");
        setPanelList([]);
        setAssignToList([]);
        queryClient.invalidateQueries("roles");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectAll = () => {
    setSelectSelected((prev) => !prev);
    if (selectSelected === false) {
      setPanelList(panels.map((item) => item.panel));
    } else {
      // setPanelList([]);
    }
  };
  const openModal = () => {};

  return (
    <div className="w-full mx-auto mt-4 h-full">
      {0 ? (
        <div>Loading...</div>
      ) : (
        <div className="flex justify-between w-[80%] mx-auto h-[90%] overflow-hidden">
          {/* {clicks !== 2? */}
          <main className="w-full h-full overflow-auto scrollbar-thin">
            <div className="flex flex-col gap-3">
              {Array.isArray(data) &&
                data?.map((role, index) => {
                  return (
                    <div className="row w-[90%] md:w-[60%] mx-auto" key={index}>
                      <RoleTile
                        role={role}
                        assignToList={assignToList}
                        setAssignToList={setAssignToList}
                        panelList={panelList}
                        setPanelList={setPanelList}
                        selectedPanels={selectedPanels}
                        setClicks={setClicks}
                        openModal={openModal}
                        isOpen={isOpen}
                      />
                    </div>
                  );
                })}
            </div>
          </main>

          <aside className="w-[50%] px-3 md:flex flex-col justify-start hidden">
            <h2 className="text-lg font-semibold mb-2">All Panels</h2>
            <div className="flex flex-wrap gap-3">
              {panels.map((panel, index) => {
                return (
                  <Label
                    key={index}
                    panel={panel}
                    handleClick={handleClick}
                    panelList={panelList}
                  />
                );
              })}
            </div>

            <div className="mt-10">
              <button
                onClick={handleAssign}
                className={`bg-colorPrimary text-white px-4 py-2 rounded-lg`}
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      )}

      {isOpen && clicks == 2 && (
        <Modal>
          <div className="max-w-[90vw] max-h-[80vh] bg-white relative overflow-auto">
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1"
              onClick={() => setClicks(0)}
            >
              Close
            </button>
            <div className="min-h-screen px-4 text-center">
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <h2 className="text-lg font-semibold mb-2">All Panels</h2>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-3">
                    {panels.map((panel, index) => {
                      return (
                        <Label
                          key={index}
                          panel={panel}
                          handleClick={handleClick}
                          panelList={panelList}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <label>
                      {selectSelected === false ? (
                        <>
                          <p
                            className="text-xs mr-1 text-center flex item-center"
                            onClick={handleSelectAll}
                          >
                            Select All
                            <span className="ml-1 flex items-center">
                              <GrCheckboxSelected />
                            </span>
                          </p>
                        </>
                      ) : (
                        <p
                          className="text-xs mr-1 text-center flex item-center"
                          onClick={handleSelectAll}
                        >
                          Unselect All
                          <span className="ml-1 flex items-center">
                            <GrCheckbox />
                          </span>
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={handleAssign}
                      className={`bg-colorPrimary text-white px-4 py-2 rounded-lg`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Label = ({ panel, handleClick, index, panelList }) => {
  return (
    <div
      className={`flex flex-col items-center  rounded-lg cursor-pointer
    ${
      panelList.includes(panel.panel)
        ? "text-colorPrimary bg-colorTransparent border-colorPrimary border"
        : null
    }`}
      key={index}
      onClick={() => handleClick(panel)}
    >
      <div className="px-[3.5px] border rounded-lg">
        <p className={`text-xs capitalize`}>{camelToTitle(panel.panel)}</p>
      </div>
    </div>
  );
};

const RoleTile = ({
  role,
  setAssignToList,
  assignToList,
  panelList,
  setPanelList,
  selectedPanels,
  setClicks,
  openModal,
}) => {
  useEffect(() => {
    if (role.id !== assignToList?.hierarchy) {
      setPanelList([]);
    }
  }, [assignToList.hierarchy]);

  const handleAddToList = () => {
    openModal();
    setClicks((prev) => prev + 1);
    setAssignToList({ hierarchy: role.id, department: role.department });
    setPanelList([...panelList, ...role.panels]);
    setPanelList((prev) => {
      return [...new Set(prev)];
    });
  };

  return (
    <div
      className={`flex flex-col justify-between border-2 border-slate-500 h-[5.5rem]
    rounded-md p-2 pb-0 cursor-pointer ${
      assignToList?.hierarchy === role.id &&
      assignToList?.department == role.department
        ? "bg-colorTransparent"
        : ""
    }`}
      onClick={handleAddToList}
    >
      <p className="mb-2 capitalize flex gap-2 items-center">
        {camelToTitle(role.id)}{" "}
        {role.department && (
          <span className="text-sm text-gray-500">({role.department})</span>
        )}
      </p>
      <div className="flex flex-wrap overflow-y-auto scrollbar-thin mb-1 gap-1">
        {role.panels.map((panel, index) => {
          return (
            <div
              className="flex flex-col items-center  rounded-lg cursor-pointer
                text-colorPrimary bg-colorTransparent border-colorPrimary border gap-1 "
              key={index}
            >
              <div className="px-[3.5px] border rounded-lg ">
                <p className={`text-xs capitalize`}>{camelToTitle(panel)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageRoles;
