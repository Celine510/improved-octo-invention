import TodoList from './components/TodoList';
function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Task List</h1>
      <TodoList />
    </div>
  );
}

export default App;
