import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Announcement {
  title: string;
  content: string;
}

interface AnnouncementBoxProps {
  announcements: Announcement[];
}

const AnnouncementBox: React.FC<AnnouncementBoxProps> = ({ announcements }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-6 w-full h-full bg-white p-5 shadow-md">
      <h2 className="text-xl font-bold p-4 ">Announcements</h2>
      {announcements.map((announcement, index) => (
        <div key={index}>
          <button
            onClick={() => toggle(index)}
            className="w-full relative text-left p-5 bg-blue-100 hover:bg-gray-50 font-medium flex justify-between items-center"
          >
            {announcement.title}
            <span>{openIndex === index ? <ChevronUp /> : <ChevronDown />}</span>
          </button>
          {openIndex === index && (
            <div className="px-4 absolute z-20 pb-4 text-gray-700 bg-gray-100">
              {announcement.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBox;
