
import { useState } from 'react';

function TodoList() {
  const [list, setList] = useState([
    { id: 1, title: 'study', status: true },
    { id: 2, title: 'have lunch', status: false },
    { id: 3, title: 'code', status: true },
  ]);

  const toggleStatus = (id) => {
    const newList = list.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    setList(newList);
  };

  const [tempContent, setTempContent] = useState('');

  const addTask = () => {
    if (!tempContent.trim()) return;
    const newList = [
      ...list,
      { id: list.at(-1).id + 1, title: tempContent, status: false },
    ];

    setList(newList);
    setTempContent('');
  };

  const deleteTask = (id) => {
    const newList = list.filter((item) => item.id !== id);

    setList(newList);
  };
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
      {list.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-3 border-b">
          <input
            type="checkbox"
            checked={item.status} // 綁定勾選狀態
            onChange={() => toggleStatus(item.id)} // 監聽變更事件
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <div
            className={`text-xl font-medium cursor-pointer w-full ${
              item.status ? 'line-through' : ''
            }`}
            onClick={() => toggleStatus(item.id)}
            onDoubleClick={() => deleteTask(item.id)}
          >
            {item.title}
          </div>
          <span
            className={`text-sm font-semibold ${
              item.status ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {item.status ? 'Completed' : 'Pending'}
          </span>
        </div>
      ))}
      <span className="text-sm text-gray-600">*Double click to delete</span>

      <form
        className="flex mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          className="border-2 w-full rounded-md input-custom"
          onChange={(e) => setTempContent(e.target.value)}
          value={tempContent}
        />
        <button
          type="button"
          className="hover:bg-indigo-200 hover:text-white transition duration-300 rounded-md ml-2"
          onClick={addTask}
        >
          <p className="px-8 text-3xl"> + </p>
        </button>
      </form>
    </div>
  );
}

export default TodoList;
