import React from 'react';
// import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import Member from '../Member';
configure({ adapter: new Adapter() });
jest.mock('axios');


it('test axios', () => {
  const getSpy = jest.spyOn(axios, 'get');
  const wrapper = shallow( <Member /> );

  expect(getSpy).toBeCalled();
  //expect(wrapper).toMatchSnapshot();
});