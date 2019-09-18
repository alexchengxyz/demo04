import React, { useState } from 'react';
import { Header, Table, Button, Modal, Form, Message, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import Search from '../components/Search';

const moment = require('moment');

function Member(){
  const [userList, setUserList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
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

  function useEffect() {
    refresh({activePage});
  }

  // 刷新資料
  function refresh(number) {
    let firstPost = (number * postsPerPage) - postsPerPage ;
    let pageNoUrl  = new URLSearchParams();

    pageNoUrl.set('first_result', firstPost);
    pageNoUrl.set('max_results', postsPerPage);

    axios.get('/api/users?' + pageNoUrl).then((res) => {
      let itemTotal = res.data.pagination.total;
      let paginationTotal = Math.ceil(itemTotal / postsPerPage);

      setUserList(res.data.ret);
      setTotal(itemTotal);
      setSearch('');
      setPostsPerPage(paginationTotal);
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
      axios.put('/api/user/' + editMemberData.id, { editMemberData }).then(() => {
        if (search) {
          search(search, activePage);
        } else {
          refresh(activePage);
        }

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

  return(
    <div>
        <Header as="h1" className="dividing artivle-title">會員管理</Header>

    </div>
  );
}

export default Member;
