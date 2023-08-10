import { TrashIcon } from "../icons/TrashIcon";
import { PlusIcon } from "../icons/PlusIcon";

import { Column, Id, Task } from "../types";

import React, { useState } from "react";
import { TaskCard } from "./TaskCard";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ref from "react";
import TaskIcon from "../icons/TaskIcon";

interface Props {
  columns: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const { columns, deleteColumn, updateColumn, createTask, tasks } = props;

  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columns.id,
    data: {
      type: "column",
      columns,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
     bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px]
     max-h-[500px] rounded-md flex flex-col
    "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="
      bg-mainBackgroundColor text-md h-[50px] cursor-grab rounded-md rounded-b-none p-2 font-bold 
      border-columnBackgroundColor border-4  flex gap-2
      justify-between items-center
      "
      >
        {!editMode && columns.title}
        {editMode && (
          <input
            value={columns.title}
            className="bg-black text-white w-full"
            onChange={(event) => {
              updateColumn(columns.id, event.target.value);
            }}
            autoFocus
            onBlur={() => {
              setEditMode(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setEditMode(false);
              }
            }}
          ></input>
        )}
        <div className="flex gap-5">
          <div className="flex justify-center items-center rounded-full bg-columnBackgroundColor px-2 py-1 text-sm">
            0
          </div>
          <button
            onClick={() => deleteColumn(columns.id)}
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-grow">
        <div className="flex flex-col gap-2 w-full">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor active:bg-black border-t-black "
        onClick={() => {
          createTask(columns.id);
        }}
      >
        <TaskIcon />
        Add Task
      </button>
    </div>
  );
};

export { ColumnContainer };
