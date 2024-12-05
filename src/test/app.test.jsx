import { render, fireEvent, screen } from '@testing-library/react';
// import { describe, it, expect, beforeEach } from 'vitest'; // 因 vite.config.js 有設置 globals: true 不必於檔案中匯入
import TodoList from '../components/TodoList';
import { expect } from 'vitest';

// describe 描述測試主題的容器
// 標記用、獨立區塊 (作用域)，可以準備各種前置狀態/環境
// 會描述標註測試的等級: page, component, function 等
describe('todoList component', () => {
  // * Q：const screen = render(<TodoList />) 跟 testing-library 提供的 screen 的差別？
  // * A：後者僅需 render 出元件環境。
  // * Q：每次it測試結束後就會釋放掉外部變數的 screen? 為何放 it 外部，第二個 it 會取不到
  // * A：共用環境可能會疊加測試操作，導致結果不如預期

  // 每次測試前重新渲染元件，打造獨立的環境
  beforeEach(() => {
    render(<TodoList />);
  });

  // it 測試行為，等同於 test
  it('should have the correct default list state', () => {
    // Uli 做法：確認畫面上列表元素數量為3

    const taskElement = screen.getByText('study');
    expect(taskElement).toBeInTheDocument();
    const statusElement = taskElement.nextElementSibling;
    expect(statusElement.textContent).toBe('Completed');

    const taskElement2 = screen.getByText('have lunch');
    expect(taskElement2).toBeInTheDocument();
    const statusElement2 = taskElement2.nextElementSibling;
    expect(statusElement2.textContent).toBe('Pending');

    // * 舊有寫法的問題：都用陣列遍歷，沒有指定項目對應結果 (ps.保留以供回顧)
    // const expectedList = [
    //   { id: 1, title: 'study', status: true },
    //   { id: 2, title: 'have lunch', status: false },
    //   { id: 3, title: 'code', status: true },
    // ];

    // expectedList.forEach((task) => {
    //   // 根據標題找到 DOM 元素
    //   // getByText 回傳第一個符合的元素
    //   const taskElement = screen.getByText(task.title);
    //   // 驗證畫面中是否存在每個任務
    //   expect(taskElement).toBeInTheDocument();

    //   // getAllByText 回傳符合條件的所有 DOM 元素陣列
    //   const statusElements = screen.getAllByText(
    //     task.status ? 'Completed' : 'Pending'
    //   );
    //   // 驗證狀態是否正確顯示對應文字
    //   expect(
    //     statusElements.map(
    //       (el) => el.textContent === (task.status ? 'Completed' : 'Pending')
    //     )
    //   ).toBeTruthy(); // 檢查元素是否有值 (能被轉成 true)
    // });
  });

  it('should add a new task to the list when input is submitted', () => {
    // * input 也可以用 placeholder 文字取：e.g. screen.getByPlaceholderText('please enter password');
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
    expect(lastElements).toBeInTheDocument();
    // 也可以 expect(lastElements).toBeTruthy();

    expect(lastElements.nextElementSibling.textContent).toBe('Pending');
    // 原寫法，盡量不要在測試內寫 if else 判斷，改用 toBe
    // expect(
    //   lastElements.nextElementSibling.textContent === 'Pending'
    // ).toBeTruthy();
  });

  it('should delete a task from the list when its title is double-clicked', () => {
    const defaultTaskTitle = 'study';
    const taskElement = screen.getByText(defaultTaskTitle);

    // * Q：需要先確認該任務存在? (因為上個test已經做過這件事)
    // * A：前面確認存在就不重複斷言。會在所有測試之前先確認元素存在。
    // matcher -> toBeInTheDocument
    // 整個 expect 加 matcher 就是個斷言(n)
    expect(taskElement).toBeInTheDocument(); // 初始任務應存在

    // 模擬雙擊任務標題
    fireEvent.doubleClick(taskElement);

    // 確保該任務已被刪除
    expect(screen.queryByText(defaultTaskTitle)).toBeNull(); // 任務應不存在於畫面上
    // 其他寫法:
    // .not.toBeInTheDocument();
    // .toBe(null)
  });

  it('should toggle task status to Completed when its title or checkbox is clicked', () => {
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

    // * Q：兩個測試內容要拆成兩個 it 寫嗎?
    // * A：看心情&程式碼複雜度XD 太多斷言會難以除錯
  });
});
