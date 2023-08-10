import React from "react";
import { Task } from "../types";
import { TrashIcon } from "../icons/TrashIcon";

interface Props {
  task: Task;
}

const TaskCard = ({ task }: Props) => {
  return (
    <div
      className="
  bg-mainBackgroundColor text-md h-[62px] cursor-grab rounded p-2 font-bold 
  border-columnBackgroundColor border-4  flex gap-2
    justify-between items-center "
    >
      {task.content}
      <button className="stroke-white right-4 bg-columnBackgroundColor p-2 rounded ">
        <TrashIcon />
      </button>
    </div>
  );
};

export { TaskCard };
