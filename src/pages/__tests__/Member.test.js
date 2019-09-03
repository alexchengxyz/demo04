import React from 'react';
import { render, cleanup, waitForElement, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Member from '../Member';
import Search from '../../components/Search';

jest.mock('axios');

afterEach(cleanup);

test('test Member can render 20 item', async () => {
  const userList = [
    { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 2, username: "user2", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 3, username: "user3", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 4, username: "user4", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 5, username: "user5", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 6, username: "user6", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 7, username: "user7", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 8, username: "user8", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 9, username: "user9", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 10, username: "user10", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 11, username: "user11", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 12, username: "user12", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 13, username: "user13", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 14, username: "user14", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 15, username: "user15", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 16, username: "user16", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 17, username: "user17", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 18, username: "user18", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
    { id: 19, username: "user19", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 20, username: "user20", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
  ]

  const resp = {
    data: {
      ret: userList,
      pagination: { total: userList.length }
    }
  };

  axios.get.mockResolvedValue(resp);

  const { getAllByTestId } = render(<Member />);
  const item = await waitForElement( () => getAllByTestId('displayList') );

  expect(item.length).toBe(20);
});

test('click add member button will execute new toggle modal', async () => {
  const { getByTestId, getByText } = render(<Member />);
  let addButton = getByText('新增會員');

  fireEvent.click(addButton);
  let addMemberModal = getByTestId('addMemberModal');

  // 打開新增會員視窗
  expect(addMemberModal).toHaveTextContent('新增會員');

  fireEvent.change(addMemberModal.querySelector('input'), { target: { value: 'alex' } });
  fireEvent.change(getByTestId('addMemberEnable'), { target: { value: '1' } });
  fireEvent.change(getByTestId('addMemberLocked'), { target: { value: '0' } });

  expect(getByTestId('addMemberEnable').value).toBe('1');
  expect(getByTestId('addMemberLocked').value).toBe('0');

  // const addUserList = [
  //   { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
  // ]

  // const addResp = {
  //   data: {
  //     ret: addUserList,
  //     pagination: { total: addUserList.length }
  //   }
  // };

  // axios.post.mockResolvedValue(addResp);
  // axios.get.mockResolvedValue(addResp);

  // const { getAllByTestId } = render(<Member />);
  // const addItem = await waitForElement( () => getAllByTestId('displayList') );

  // expect(addItem.length).toBe(21);
  // fireEvent.click(getByText('確定'));
});

test('click edit member button will execute edit toggle modal', async () => {
  const userList = [
    { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
  ]

  const resp = {
    data: {
      ret: userList,
      pagination: { total: userList.length }
    }
  };

  axios.get.mockResolvedValue(resp);

  const { getByTestId, getByText } = render(<Member />);

  await waitForElement( () => getByTestId('displayList') );

  let editButton = getByText('編輯');

  fireEvent.click(editButton);

  expect(getByTestId('editMemberModal')).toHaveTextContent('修改會員資料');
});

test('search input', async () => {
  const { getByPlaceholderText } = render(<Search />);
  const searchInput = getByPlaceholderText('搜尋');
  fireEvent.change(searchInput, { target: { value: 'user1' } });

  if (searchInput.value) {
    expect(searchInput.value).toBe('user1');
  }

  const userList = [
    { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
  ]

  const resp = {
    data: {
      ret: userList,
      pagination: { total: userList.length }
    }
  };

  axios.get.mockResolvedValue(resp);

  const { getAllByTestId } = render(<Member />);
  const item = await waitForElement( () => getAllByTestId('displayList') );
  expect(item[0].innerHTML).toMatch(/user1/);
});

test('delete item', async () => {
  const userList = [
    { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 2, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
  ]

  const resp = {
    data: {
      ret: userList,
      pagination: { total: userList.length }
    }
  };

  axios.get.mockResolvedValue(resp);

  const { getAllByTestId, getAllByText } = render(<Member />);
  const item = await waitForElement( () => getAllByTestId('displayList') );

  fireEvent.click(getAllByText('刪除')[0]);

  // let mockConfirm = jest.fn();

  // mockConfirm = true;

  // await mockConfirm;

  // axios.get.mockResolvedValue(resp);

  // expect(item.length).toBe(20);

});

