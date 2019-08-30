import React from 'react';
import { render, cleanup, waitForElement, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Member from '../Member';

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

test('click add member button will execute new toggle modal', () => {
  const { getByTestId, getByText } = render(<Member />);
  let addButton = getByText('新增會員');

  fireEvent.click(addButton);

  // 打開新增會員視窗
  expect(getByTestId('addMemberModal')).toHaveTextContent('新增會員');

  const inputName = getByTestId('username-input-addMember');

  console.log(inputName.parentNode.innerHTML);

  fireEvent.change(inputName.querySelector('input'), { target: { value: 'alex' } });


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
