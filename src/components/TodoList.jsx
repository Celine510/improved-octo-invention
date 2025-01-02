import { useEffect, useState } from 'react';

function TodoList() {
  const [list, setList] = useState([
    { id: 1, title: 'study', status: true, deadline: '2025-04-20 11:03' },
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
  const [tempDatetime, setTempDatetime] = useState('');

  const addTask = () => {
    if (!tempContent.trim()) return;
    const newList = [
      ...list,
      {
        id: list.at(-1).id + 1,
        title: tempContent,
        status: false,
        deadline: tempDatetime.split('T').join(' '),
      },
    ];

    setList(newList);
    setTempContent('');
    setTempDatetime('');
  };

  const deleteTask = (id) => {
    const newList = list.filter((item) => item.id !== id);

    setList(newList);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(timer);
  });

  return (
    <div>
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
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
            <div
              className={`text-xs  min-w-20 ${
                new Date(currentTime).getTime() >=
                  new Date(item?.deadline).getTime() && !item.status
                  ? 'text-red-500 font-bold'
                  : 'hidden'
              }`}
            >
              {item?.deadline}
            </div>
            <div
              className={`text-sm font-semibold min-w-20 ${
                item.status ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.status ? 'Completed' : 'Pending'}
            </div>
          </div>
        ))}
        <span className="text-sm text-gray-600">*Double click to delete</span>
      </div>
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 mt-10">
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
        >
          <div>
            <label htmlFor="content">item</label>
            <input
              type="text"
              id="content"
              className="px-2 border-2 h-10 w-full rounded-md input-custom mb-3"
              onChange={(e) => setTempContent(e.target.value)}
              value={tempContent}
            />
            <label htmlFor="deadline">deadline time</label>
            <input
              type="datetime-local"
              id="deadline"
              className="px-2 border-2 h-10 w-full rounded-md input-custom"
              onChange={(e) => setTempDatetime(e.target.value)}
              value={tempDatetime}
            />
          </div>
          <button
            type="button"
            className="hover:bg-indigo-200 hover:text-white transition duration-300 rounded-md ml-2"
            onClick={addTask}
          >
            <p className="px-8 text-3xl"> + </p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default TodoList;
