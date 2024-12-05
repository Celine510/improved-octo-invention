import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TodoList from '../components/TodoList';

// describe 描述測試主題的容器
describe('todoList componentn', () => {
  // ? Q：跟 testing-library 提供的 screen 的差別？
  // ? Q：每次it測試結束後就會釋放掉外部變數的 screen? 為何放 it 外部，第二個 it 會取不到
  // const screen = render(<TodoList />);

  // it 測試行為，等同於 test
  it('should have the correct default list state', () => {
    const screen = render(<TodoList />);
    // 預期的初始列表內容
    const expectedList = [
      { id: 1, title: 'study', status: true },
      { id: 2, title: 'have lunch', status: false },
      { id: 3, title: 'code', status: true },
    ];

    expectedList.forEach((task) => {
      // 根據標題找到 DOM 元素
      // getByText 回傳第一個符合的元素
      const taskElement = screen.getByText(task.title);
      // 驗證畫面中是否存在每個任務
      expect(taskElement).toBeInTheDocument();

      // getAllByText 回傳符合條件的所有 DOM 元素陣列
      const statusElements = screen.getAllByText(
        task.status ? 'Completed' : 'Pending'
      );
      // 驗證狀態是否正確顯示對應文字
      expect(
        statusElements.map(
          (el) => el.textContent === (task.status ? 'Completed' : 'Pending')
        )
      ).toBeTruthy(); // 檢查元素是否有值 (能被轉成 true)
    });
  });

  it('should add a new task to the list when input is submitted', () => {
    const screen = render(<TodoList />);

    // 獲取輸入框與按鈕
    // getByRole 根據元素的 ARIA Role（角色屬性）來定位畫面上的 DOM 元素。
    const inputElement = screen.getByRole('textbox'); // 根據角色找到輸入框
    const addButton = screen.getByRole('button', { name: '+' }); // 根據按鈕文字找到按鈕

    // 模擬用戶輸入
    fireEvent.change(inputElement, { target: { value: 'new task' } });

    // 模擬點擊按鈕
    fireEvent.click(addButton);

    const lastElements = screen.getByText('new task');
    // 確保有新增 new task 項目
    expect(lastElements).toBeTruthy();

    // ? 需要加 .toBeTruthy() 嗎?
    expect(
      lastElements.nextElementSibling.textContent === 'Pending'
    ).toBeTruthy();
  });

  it('should delete a task from the list when its title is double-clicked', () => {
    const screen = render(<TodoList />);

    // 確認初始列表項目存在
    const defaultTaskTitle = 'study';
    const taskElement = screen.getByText(defaultTaskTitle);

    // ? 需要先確認該任務存在? (因為上個test已經做過這件事)
    expect(taskElement).toBeInTheDocument(); // 初始任務應存在

    // 模擬雙擊任務標題
    fireEvent.doubleClick(taskElement);

    // 確保該任務已被刪除
    expect(screen.queryByText(defaultTaskTitle)).toBeNull(); // 任務應不存在於畫面上
  });

  it('should toggle task status to Completed when its title or checkbox is clicked', () => {
    const screen = render(<TodoList />);

    const defaultTaskTitle = 'study';

    const checkboxElement = screen.getAllByRole('checkbox').at(0);
    expect(checkboxElement).toBeInTheDocument();
    const taskElement = screen.getByText(defaultTaskTitle);
    expect(taskElement).toBeInTheDocument();

    // 點擊 checkbox 切換狀態
    fireEvent.click(checkboxElement);
    expect(taskElement.nextElementSibling.textContent).toBe('Pending');

    // 點擊 title 切換狀態
    fireEvent.click(taskElement);
    expect(taskElement.nextElementSibling.textContent).toBe('Completed');

    // ? 兩個測試內容要拆成兩個 it 寫嗎?
  });
});
