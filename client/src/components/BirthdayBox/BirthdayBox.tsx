import React from "react";

interface Birthday {
  name: string;
  date: string; // e.g. "2025-04-28"
}

interface BirthdayBoxProps {
  birthdays: Birthday[];
  onSendWish: (name: string) => void;
}

const BirthdayBox: React.FC<BirthdayBoxProps> = ({ birthdays, onSendWish }) => {
  return (
    <div className="space-y-6 w-full h-full bg-white  py-10 px-5 shadow-md">
      <h2 className="text-xl font-bold mb-4">🎉 Upcoming Birthdays</h2>
      {birthdays.length === 0 ? (
        <p className="text-gray-500">No upcoming birthdays.</p>
      ) : (
        <ul className="space-y-4 ">
          {birthdays.map(({ name, date }, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded-md bg-gray-200"
            >
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => onSendWish(name)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Send Wish
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BirthdayBox;
