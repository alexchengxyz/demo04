import React from "react";
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { create } from "react-test-renderer";
import { Button } from 'semantic-ui-react';
import Member from '../Member';

configure({ adapter: new Adapter() });

describe('Member component', () => {
  test('Matches the snapshot', () => {
    const button = create(<Button />);
    expect(button.toJSON()).toMatchSnapshot();
  });

  // total default state
  it('total一開始為空值', () => {
    const member = shallow(<Member />);
    expect(member.state('total')).toBe('');
  });

  // refresh
  test('測試refresh', () => {
    const wrapper = shallow(<Member />);
    const instance = wrapper.instance();

    expect(instance.refresh).toHaveBeenCalledWith();

    // function instance.refresh(data) {
    //   expect(data).toBe(1);
    // }

    // fetchData(instance.refresh);
  });
});