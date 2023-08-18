import { Id, Task } from "../types";
import { TrashIcon } from "../icons/TrashIcon";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500"
      ></div>
    );
  }
  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <textarea
          className="
          bg-mainBackgroundColor text-md cursor-grab rounded-xl pt-4 pl-4 font-bold
          border-columnBackgroundColor border-1 flex gap-2 max-w-[327px] h-[66px]
          justify-between items-center w-full resize-none m-2"
          maxLength={50}
          defaultValue={task.content}
          autoFocus
          placeholder="Enter a title for this card..."
          onBlur={toggleEditMode}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              toggleEditMode();
            }
          }}
          onChange={(event) => {
            updateTask(task.id, event.target.value);
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="
    bg-mainBackgroundColor text-md cursor-grab rounded-xl p-5 font-bold 
    border-columnBackgroundColor border-4  flex gap-2 h-[82px] min-h-[82px] 
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
          className="
           
           stroke-white opacity-60 hover:opacity-95 right-4 bg-columnBackgroundColor p-2 rounded "
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export { TaskCard };
