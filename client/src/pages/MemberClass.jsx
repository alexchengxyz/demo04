import React, { Component } from 'react';
import { Header, Table, Button, Modal, Form, Message, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import Search from '../components/Search';

const moment = require('moment');

class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      activePage: 1,
      postsPerPage: 20,
      total: '',
      search: '',
      searchTotal: '',
      paginationTotal: '',
      newMemberData: {
        username: '',
        enable: 0,
        locked: 0,
      },
      editMemberData: {
        id: '',
        username: '',
        enable: 0,
        locked: 0,
      },
      addMemberModal: false,
      editMemberModal: false,
      addError: false,
      editError: false,
    };

    this.newToggleModal = this.newToggleModal.bind(this);
    this.editToggleModal = this.editToggleModal.bind(this);
    this.addMember = this.addMember.bind(this)
    this.updateMember = this.updateMember.bind(this)
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentDidMount() {
    // 讀取資料
    this.refresh(this.state.activePage);
  }

  // 刷新資料
  refresh(number) {
    let { postsPerPage } = this.state;
    let firstPost = (number * postsPerPage) - postsPerPage ;
    let pageNoUrl  = new URLSearchParams();

    pageNoUrl.set('first_result', firstPost);
    pageNoUrl.set('max_results', postsPerPage);

    axios.get('/api/users?' + pageNoUrl).then((res) => {
      let itemTotal = res.data.pagination.total;
      let paginationTotal = Math.ceil(itemTotal / postsPerPage);

      this.setState({
        userList: res.data.ret,
        total: itemTotal,
        search: '',
        paginationTotal: paginationTotal
      })
    });
  }

  // 新增資料
  addMember() {
    let { newMemberData } = this.state;
    if (newMemberData.username) {
      axios.post('/api/user', newMemberData).then((res) => {
        let { userList, total, paginationTotal } = this.state;
        const newUserList = [res.data.ret, ...userList];

        this.setState({
          userList: newUserList,
          activePage: 1,
          total: total + 1,
          paginationTotal: paginationTotal,
          newMemberData: {
            username: '',
            enable: 0,
            locked: 0
          },
          addMemberModal: false
        });

        this.refresh(1);
      });
    } else {
      this.setState({
        addError: true,
        addMemberModal: true
      });
    }
  }

  // 編輯資料
  editMember(id, username, enable, locked) {
    this.setState({
      editMemberData: { id, username, enable, locked },
      editMemberModal: !this.state.editMemberModal
    });
  }

  updateMember() {
    let { id, username, enable, locked } = this.state.editMemberData;
    let { activePage, search,  } = this.state;

    if (username) {
      axios.put('/api/user/' + id, { username, enable, locked }).then(() => {
        if (search) {
          this.search(search, activePage);
        } else {
          this.refresh(activePage);
        }

        this.setState({
          activePage: activePage,
          editMemberData: {
            id: '',
            username: '',
            enable: '',
            locked: ''
          },
          editMemberModal: false,
          editError: false
        });
      });
    } else {
      this.setState({ editError: true });
    }
  }

  // 刪除資料
  deleteMember(id) {
    if (confirm('請確認是否刪除')) {
      axios.delete('/api/user/' + id).then(() => {
        let { postsPerPage, activePage, total, search, searchTotal } = this.state;
        let number;
        let allItem;

        if (search) {
          allItem = searchTotal;
        } else {
          allItem = total;
        }

        let changeNumber = Math.ceil((allItem - 1) / postsPerPage);

        if (activePage > changeNumber) {
          number = changeNumber;
        } else {
          number = activePage;
        }

        this.setState({ activePage: number });

        if (search) {
          this.search(search, number);
        } else {
          this.refresh(number);
        }
      });
    } else {
      return false;
    }
  }

  // 搜尋
  search(searchText, number) {
    let { postsPerPage } = this.state;
    let firstPost = (number * postsPerPage) - postsPerPage ;
    let proSearchText = searchText.toLowerCase();
    let getYear = proSearchText.substring(0,4);
    let getMoth = proSearchText.substr(5,2);
    let getDay = proSearchText.substr(8,2);
    let getHours = proSearchText.substr(13,2);
    let getMinute = proSearchText.substr(-2);
    let getDate;
    let getTime;
    let getAllTime;
    let searchUrl  = new URLSearchParams();

    searchUrl.set('first_result', firstPost);
    searchUrl.set('max_results', postsPerPage);

    if (!isNaN(proSearchText)) {
      searchUrl.set('id', proSearchText);
    }

    // 比對年月日
    if(
      !isNaN(getYear)
      && !isNaN(getMoth)
      && !isNaN(getDay)
      && proSearchText.length === 10
      || proSearchText.length === 18
    ){
      getDate = getYear + '-' + getMoth + '-' + getDay;
    }

    // 比對所有時間
    if(
      !isNaN(getYear)
      && !isNaN(getMoth)
      && !isNaN(getDay)
      && !isNaN(getHours)
      && !isNaN(getMinute)
      && proSearchText.length === 18
    ){
      getTime = getHours + ':' + getMinute;
      getAllTime = getYear + '-' + getMoth + '-' + getDay + ' / ' + getTime;
    }

    if (
      proSearchText !== '否'
      && proSearchText !== '是'
      && proSearchText !== getDate
      && proSearchText !== getAllTime
    ) {
      searchUrl.set('username', proSearchText);
    }

    if (proSearchText === '否') {
      searchUrl.set('enable', 0);
      searchUrl.set('locked', 0);
    }

    if (proSearchText === '是') {
      searchUrl.set('enable', 1);
      searchUrl.set('locked', 1);
    }

    // 搜尋年月日
    if (proSearchText === getDate && proSearchText.length === 10) {
      let timeStart = moment().format('T00:00:00+00:00');
      let timeEnd = moment().format('T24:59:59+59:59');

      searchUrl.set('start_created_at', getDate + timeStart);
      searchUrl.set('end_created_at', getDate + timeEnd);
    }

    // 搜尋年月日時
    if (proSearchText === getAllTime && proSearchText.length === 18) {
      let timeStart = moment().format(':00+00:00');
      let timeEnd = moment().format(':59+59:59');

      searchUrl.set('start_created_at', getDate + 'T' + getTime + timeStart);
      searchUrl.set('end_created_at', getDate + 'T' + getTime + timeEnd);
    }

    axios.get('/api/users?' + searchUrl).then((res) => {
      let dataPageTotal = res.data.pagination.total;
      let paginationTotal = Math.ceil(dataPageTotal / postsPerPage);

      this.setState({
        userList: res.data.ret,
        search: searchText,
        searchTotal: dataPageTotal,
        paginationTotal: paginationTotal
      });
    });

  }

  searchChange(e){
    let value = e.target.value;

    this.setState({
      search: value,
      activePage: 1
    });

    this.search(value, 1);
  }

  // 分頁刷頁
  handlePaginationChange(e, {activePage}) {
    let { search } = this.state;

    this.setState({ activePage });

    if (search){
      this.search(search, activePage);
    } else {
      this.refresh(activePage);
    }
  }

  // 彈跳視窗 - 新增資料
  newToggleModal() {
    this.setState({
      addMemberModal: !this.state.addMemberModal,
      addError: false
    });
  }

  // 彈跳視窗 - 編輯資料
  editToggleModal() {
    this.setState({
      editMemberModal: !this.state.editMemberModal,
      editError: false
    });
  }

  render() {
    let { userList, activePage, total, searchTotal,search, paginationTotal } = this.state;
    let showUserList;
    let showPagination;
    let noInfo;

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
                onClick={this.editMember.bind(this, userData.id, userData.username, userData.enable, userData.locked)}
              >
                編輯
              </Button>
              <Button
                color="red"
                onClick={this.deleteMember.bind(this, userData.id)}
              >
                刪除
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      });
    }

    if (total < 1 || (search && searchTotal < 1)) {
      noInfo = (
        <Table.Row>
          <Table.Cell colSpan="7">
            <Message>
              <Message.Header>找不到符合條件的內容。</Message.Header>
            </Message>
          </Table.Cell>
        </Table.Row>
      );
    }

    // 顯示頁碼
    if (paginationTotal > 1) {
      showPagination = (
        <div className="ui.clearing.segment">
          <div style={{float: 'right', marginBottom: '40px'}} className="ui pagination menu">
            <Pagination
              activePage={activePage}
              onPageChange={this.handlePaginationChange}
              totalPages={paginationTotal}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header as="h1" className="dividing artivle-title">會員管理</Header>

        <div style={{textAlign: 'right'}}>
          <Search
            value={this.state.search}
            onChange={this.searchChange}
          />
          <Button color="blue" onClick={this.newToggleModal}>新增會員</Button>
        </div>

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
            {noInfo}
          </Table.Body>
        </Table>

        {showPagination}

        {/* 彈跳視窗 - 新增資料 */}
        <Modal open={this.state.addMemberModal} data-testid="addMemberModal">
          <Modal.Header>新增會員</Modal.Header>
          <Modal.Content>
            <Form error={this.state.addError}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='姓名'
                  error={this.state.addError}
                  value={this.state.newMemberData.username}
                  onChange={(e) => {
                    let{newMemberData} = this.state;
                    newMemberData.username = e.target.value;
                    this.setState({ newMemberData });
                  }}
                />
              </Form.Group>
              <Message error content="請填寫姓名" />
              <Form.Group widths='equal'>
                <Form.Field
                  label="是否啟動"
                  control="select"
                  value={this.state.newMemberData.enable}
                  onChange={(e) => {
                    let {newMemberData} = this.state;
                    newMemberData.enable = Number(e.target.value);
                    this.setState({ newMemberData });
                  }}
                  data-testid="addMemberEnable"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
                <Form.Field
                  label="是否鎖定"
                  control="select"
                  value={this.state.newMemberData.locked}
                  onChange={(e) => {
                    let {newMemberData} = this.state;
                    newMemberData.locked = Number(e.target.value);
                    this.setState({ newMemberData });
                  }}
                  data-testid="addMemberLocked"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.addMember}>確定</Button>
            <Button onClick={this.newToggleModal}>取消</Button>
          </Modal.Actions>
        </Modal>

        {/* 彈跳視窗 - 編輯資料 */}
        <Modal open={this.state.editMemberModal} data-testid="editMemberModal">
          <Modal.Header>修改會員資料</Modal.Header>
          <Modal.Content>
            <Form error={this.state.editError}>
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='姓名'
                  error={this.state.editError}
                  value={this.state.editMemberData.username}
                  onChange={(e) => {
                    let{editMemberData} = this.state;
                    editMemberData.username = e.target.value;
                    this.setState({ editMemberData });
                  }}
                />
              </Form.Group>
              <Message error content="請填寫姓名" />
              <Form.Group widths='equal'>
                <Form.Field
                  label="是否啟動"
                  control="select"
                  value={this.state.editMemberData.enable}
                  onChange={(e) => {
                    let {editMemberData} = this.state;
                    editMemberData.enable = Number(e.target.value);
                    this.setState({ editMemberData });
                  }}
                  data-testid="editMemberEnable"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
                <Form.Field
                  label="是否鎖定"
                  control="select"
                  value={this.state.editMemberData.locked}
                  onChange={(e) => {
                    let {editMemberData} = this.state;
                    editMemberData.locked = Number(e.target.value);
                    this.setState({ editMemberData });
                  }}
                  data-testid="editMemberLocked"
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.updateMember}>更新</Button>
            <Button onClick={this.editToggleModal}>取消</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default Member;
