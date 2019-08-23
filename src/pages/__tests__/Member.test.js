import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import axios from 'axios';
import Member from '../Member';

jest.mock('axios');
configure({ adapter: new Adapter() });


it('renders correctly', () => {

  const users = [
    { id: 1, username: "user1", enable: 0, locked: 0, created_at: "2019-08-17T06:42:58+00:00" },
    { id: 2, username: "user2", enable: 0, locked: 0, created_at: "2019-08-17T06:42:58+00:00" },
  ];

  const page = {
    first_result: "0",
    max_results: "20",
    total: 2
  }

  const resp = {result: "ok",ret: users, pagination: page};

  axios.get.mockResolvedValue(resp);

  // console.log(resp);

  const tree = renderer.create(<Member />).toJSON();
  expect(tree).toMatchSnapshot();
});