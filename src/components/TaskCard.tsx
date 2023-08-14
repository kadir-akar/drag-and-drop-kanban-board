import React from "react";
import { Task } from "../types";
import { TrashIcon } from "../icons/TrashIcon";
import { useState } from "react";

interface Props {
  task: Task;
  deleteTask: (id: string) => void;
}

const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };
  if (editMode) return <div>editmode</div>;

  return (
    <div
      onClick={toggleEditMode}
      className="
    bg-mainBackgroundColor text-md h-[62px] cursor-grab rounded p-2 font-bold 
    border-columnBackgroundColor border-4  flex gap-2
    justify-between items-center "
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {task.content}
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white opacity-60 hover:opacity-95 right-4 bg-columnBackgroundColor p-2 rounded "
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export { TaskCard };
