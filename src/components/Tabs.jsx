import { useState } from "react";

export function Tabs({ activeTab, onChangeCb }) {
  // const [tab, setTab] = useState(0);

  console.log({ activeTab });

  const tabs = [
    {
      label: "Select Question",
      value: 0
    },
    {
      label: "Show Question",
      value: 1
    }
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 flex p-1">
      {tabs.map(({ label, value }, index) => (
        <Tab
          label={label}
          active={value === activeTab}
          key={index}
          onClick={() => onChangeCb(value)}
        />
      ))}
    </div>
  );
}

const Tab = ({ active, label, onClick }) => {
  return (
    <div
      className={`basis-1/2 py-3 text-center cursor-pointer ${
        active ? "active-tab" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};
