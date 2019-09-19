import React, { useState, useEffect } from 'react';
import { Header, Table, Button, Modal, Form, Message, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import Search from '../components/Search';

const moment = require('moment');
const postsPerPage = 20;

function Member(){
  const [userList, setUserList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState('');
  const [search, setSearch] = useState('');
  const [searchTotal, setSearchTotal] = useState('');
  const [paginationTotal, setPaginationTotal] = useState('');
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [editMemberModal, setEditMemberModal] = useState(false);
  const [addError, setAddError] = useState(false);
  const [editError, setEditError] = useState(false);

  const [newMemberData, setNewMemberData] = useState({
    username: '',
    enable: 0,
    locked: 0
  });

  const [editMemberData, setEditMemberData] = useState({
    id: '',
    username: '',
    enable: 0,
    locked: 0
  });

  useEffect( () => {
    refresh(activePage);
  }, []);

  // 刷新資料
  function refresh(number) {
    let firstPost = (number * postsPerPage) - postsPerPage ;
    let pageNoUrl  = new URLSearchParams();

    pageNoUrl.set('first_result', firstPost);
    pageNoUrl.set('max_results', postsPerPage);

    axios.get('/api/users?' + pageNoUrl).then((res) => {
      let itemTotal = res.data.pagination.total;
      let newPaginationTotal = Math.ceil(itemTotal / postsPerPage);

      //console.log(postsPerPage);

      setUserList(res.data.ret);
      setTotal(itemTotal);
      setSearch('');
      setPaginationTotal(newPaginationTotal);
    });
  }

  // 新增資料
  function addMember() {
    if (newUsername) {
      axios.post('/api/user', newMemberData).then((res) => {
        const newUserList = [res.data.ret, ...userList];

        setUserList(newUserList);
        setActivePage(1);
        setTotal(total + 1);
        setPostsPerPage(paginationTotal);
        setAddMemberModal(false);

        setNewMemberData({
          username: '',
          enable: 0,
          locked: 0
        });

        refresh(1);
      });
    } else {
      setAddError(true);
      setAddMemberModal(true);
    }
  }

  // 編輯資料
  function editMember(id, username, enable, locked) {
    setEditMemberData({ id, username, enable, locked });
    setEditMemberModal(!editMemberModal);
  }

  function updateMember() {
    if (editMemberData.username) {
      let innerId = editMemberData.id;
      let innerUsername = editMemberData.username;
      let innerEnable = editMemberData.enable;
      let innerLocked = editMemberData.locked;

      axios.put('/api/user/' + innerId, { innerUsername, innerEnable, innerLocked }).then(() => {
        refresh(activePage);

        setActivePage(activePage);
        setEditMemberModal(false);
        setEditError(false);

        setEditMemberData({
          id: '',
          username: '',
          enable: '',
          locked: ''
        });
      });
    } else {
      setEditError(true);
    }
  }

  // 彈跳視窗 - 編輯資料
  function editToggleModal() {
    setEditMemberModal(!editMemberModal);
    setEditError(false);
  }

  let showUserList;

  // 顯示列表
  if (total) {
    showUserList = userList.map((userData) => {
      let showEnable;
      let showLocked;
      let getDate = userData.created_at.slice(0, 10);
      let getTime = userData.created_at.slice(11, 16);
      let showTime = getDate + ' / ' + getTime;

      // 將enable與locked從值轉為中文字串
      if (userData.enable === 0) {
        showEnable = '否';
      } else {
        showEnable = '是';
      }

      if (userData.locked === 0) {
        showLocked = '否';
      } else {
        showLocked = '是';
      }

      return (
        <Table.Row key={userData.id} data-testid="displayList">
          <Table.Cell>{userData.id}</Table.Cell>
          <Table.Cell>{userData.username}</Table.Cell>
          <Table.Cell>{showEnable}</Table.Cell>
          <Table.Cell>{showLocked}</Table.Cell>
          <Table.Cell>{showTime}</Table.Cell>
          <Table.Cell>
            <Button
              color="teal"
              onClick={() => editMember(userData.id, userData.username, userData.enable, userData.locked)}
            >
              編輯
            </Button>

          </Table.Cell>
        </Table.Row>
      );
    });
  }

  return(
    <div>
        <Header as="h1" className="dividing artivle-title">會員管理</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>序號</Table.HeaderCell>
              <Table.HeaderCell>名字</Table.HeaderCell>
              <Table.HeaderCell>是否啟用</Table.HeaderCell>
              <Table.HeaderCell>是否鎖定</Table.HeaderCell>
              <Table.HeaderCell>建立時間</Table.HeaderCell>
              <Table.HeaderCell>設定</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {showUserList}
          </Table.Body>
        </Table>


        {/* 彈跳視窗 - 編輯資料 */}
        <Modal open={editMemberModal} data-testid="editMemberModal">
          <Modal.Header>修改會員資料</Modal.Header>
          <Modal.Content>
            <Form error={editError}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='姓名'
                  error={editError}
                  value={editMemberData.username}
                  onChange={ e => setEditMemberData({ ... editMemberData, username: e.target.value }) }
                />
              </Form.Group>
              <Message error content="請填寫姓名" />
              <Form.Group widths='equal'>
                <Form.Field
                  label="是否啟動"
                  control="select"
                  value={editMemberData.enable}
                  onChange={ e => setEditMemberData({ ... editMemberData, enable: Number(e.target.value) }) }
                  data-testid="editMemberEnable"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
                <Form.Field
                  label="是否鎖定"
                  control="select"
                  value={editMemberData.locked}
                  onChange={ e => setEditMemberData({ ... editMemberData, locked: Number(e.target.value) }) }
                  data-testid="editMemberLocked"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={() => updateMember()}>更新</Button>
            <Button onClick={() => editToggleModal()}>取消</Button>
          </Modal.Actions>
        </Modal>
    </div>
  );
}

export default Member;
