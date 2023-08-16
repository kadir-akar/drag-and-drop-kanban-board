import { PlusIcon } from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import { useState, useMemo } from "react";
import { ColumnContainer } from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const createNewColumn = () => {
    const newColumn: Column = {
      id: new Date().getTime().toString(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  };
  const deleteColumn = (id: Id) => {
    const newColumns = columns.filter((column) => column.id !== id);
    setColumns(newColumns);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.columns);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeColumnId
        );
        const overTaskIndex = tasks.findIndex(
          (task) => task.id === overColumnId
        );

        if (tasks[activeTaskIndex].columnId !== tasks[overTaskIndex].columnId) {
          tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        }

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = active.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeColumnId
        );

        tasks[activeTaskIndex].columnId = overColumnId;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return {
        ...column,
        title,
      };
    });
    setColumns(newColumns);
  };
  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: new Date().getTime().toString(),
      content: `Task ${tasks.length + 1}`,
      columnId,
    };
    setTasks([...tasks, newTask]);
  };
  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };
  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return {
        ...task,
        content,
      };
    });
    setTasks(newTasks);
  };

  return (
    <div
      className="m-auto  min-h-screen  items-center overflow-x-auto overflow-y-hidden px-[40px] w-full 
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <button
          className="h-[60px] 
        transition duration-500 mb-10 mt-5
        min-w-[350px] flex gap-2 
        cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 "
          onClick={() => createNewColumn()}
        >
          <PlusIcon />
          Add Column
        </button>
        <div
          className="m-auto flex gap-2 
      "
        >
          <div className="flex gap-3 flex-wrap">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  columns={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                columns={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export { KanbanBoard };
