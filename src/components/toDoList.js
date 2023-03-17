import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import queryClient from "../queryClient";

let todos = [
  { id:1, title:'First Todo', isCompleted:false},
  { id:2, title:'Second Todo', isCompleted:true},
  { id:3, title:'Third Todo', isCompleted:false},
];

const fetchTodos = () => {
  return Promise.resolve(todos);
};

function addToDoApi(title){ //Create a new todo
  const newTodo={
    id: Date.now(),
    title,
    isCompleted:false
  };
  
  todos.push(newTodo);
  return Promise.resolve(newTodo);
}

function deleteToDoApi(todoIdDelete){ // Delete by ID
  const newTodos = todos.filter((todo) => todo.id !== todoIdDelete)
  todos = newTodos;
  return Promise.resolve(newTodos);
}

function toggleToDoApi(toDoIdToggle){ //Switch completed state 
  const newTodos = todos.map((todo)=>{
    if(todo.id === toDoIdToggle){
      return{...todo,isCompleted: !todo.isCompleted}
    }
    return todo
  })
  todos = newTodos;
  return Promise.resolve(newTodos);
}

function ToDoList() {
  const { data } = useQuery("todos", fetchTodos);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newToDoBody, setNewToDoBody] = useState("");

  const addToDo = useMutation(() => addToDoApi(newToDoBody), {
    onSuccess: () => {
      setNewToDoBody("");
      queryClient.invalidateQueries("todos");
    }
  });

  const deleteToDo = useMutation(
    (todoIdDelete) => deleteToDoApi(todoIdDelete),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      }
    }
  );

  const toggleToDo = useMutation((toDoIdToggle) => toggleToDoApi(toDoIdToggle), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  function handleAddToDo() {
    if (newToDoBody.trim() === "") return;
    addToDo.mutate();
  }

  function handleDelete(todoIdDelete) {
    deleteToDo.mutate(todoIdDelete);
  }

  function handleSetNewToDoBody(event) {
    setNewToDoBody(event.target.value);
  }

  function handleToggle(toDoIdToggle) {
    toggleToDo.mutate(toDoIdToggle);
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">To Do List</h1>
      <form className="flex mb-2">
        <input
          type="text"
          placeholder="Ajouter une tâche"
          value={newToDoBody}
          onChange={handleSetNewToDoBody}
          className="w-full p-2 mr-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleAddToDo}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Add
        </button>
        
      </form>
      <span 
  onClick={() => setShowCompleted(!showCompleted)}
  className="link link-underline link-underline-black text-base mb-5 cursoi text-black"
>
  {showCompleted ? "All task" : "Only completed task"}
</span>

      {data?.filter((todo) => !showCompleted || todo.isCompleted).map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between mt-4 mb-4 p-2 bg-white rounded-md shadow-md"
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-500 rounded-md focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              checked={todo.isCompleted}
              onChange={() => handleToggle(todo.id)}
            />
            <span
              className={`text-gray-800 ${
                todo.isCompleted ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </span>
          </label>
          <button
            onClick={() => handleDelete(todo.id)}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}


  
export default ToDoList;
