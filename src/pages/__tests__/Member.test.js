import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Member from '../Member';

jest.mock('axios');

afterEach(cleanup);

test('test can render 3 item', async () => {
  const userList = [
    { id: 1, username: "user1", enable: 1, locked: 0, created_at: "2019-08-13T17:54:31+00:00" },
    { id: 2, username: "user2", enable: 1, locked: 0, created_at: "2019-08-09T18:40:50+00:00" },
    { id: 3, username: "user3", enable: 0, locked: 0, created_at: "2019-08-10T09:47:22+00:00" },
  ]

  const resp = {
    data: {
      ret: userList,
      pagination: { total: userList.length }
    }
  };

  axios.get(resp);

  const { getAllByTestId } = render(<Member />);

  const getByID = await waitForElement( () => {
    getAllByTestId('displayList');
  } );

  console.log(getAllByTestId('displayList'));

  expect(getByID.length).toBe(3);

});