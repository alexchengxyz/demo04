import React, { Component } from 'react';
import { Header, Table, Button, Modal, Form, Message, Pagination } from 'semantic-ui-react';
import Search from '../components/Search';
import axios from 'axios';

class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      activePage: 1,
      firstResult: 0,
      maxResults: 20,
      total: '',
      newMemberData: {
        username: '',
        enable: '0',
        locked: '0',
      },
      editMemberData: {
        id: '',
        username: '',
        enable: '0',
        locked: '0',
      },
      addMemberModal: false,
      editMemberModal: false,
      addError: false,
      editError: false,
      search: '',
      searchTotal: ''
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
    let { activePage } = this.state;

    this.refresh(activePage);
  }

  // 刷新資料
  refresh(number) {
    let postsPerPage = this.state.maxResults - this.state.firstResult;
    let lastPost = postsPerPage * number;
    let firstPost = lastPost - postsPerPage;
    let pageNoUrl  = new URLSearchParams();

    pageNoUrl.set('first_result', firstPost);
    pageNoUrl.set('max_results', lastPost);

    axios.get('http://192.168.56.101:9988/api/users?' + pageNoUrl).then((res) => {
      this.setState({
        userList: res.data.ret,
        total: res.data.pagination.total,
        search: ''
      })
    });
  }

  // 新增資料
  addMember() {
    let { userList } = this.state;

    if (this.state.newMemberData.username === '') {
      this.setState({
        addError: true,
        addMemberModal: true
      });
    } else {
      axios.post('http://192.168.56.101:9988/api/user', this.state.newMemberData).then((res) => {
        userList.push(res.data.ret);

        this.setState({
          userList: userList,
          total: this.state.total + 1,
          newMemberData:{
            username: '',
            enable: '0',
            locked: '0'
          },
          addMemberModal: false
        });
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

    if (username === '') {
      this.setState({ editError: true });
    } else {
      axios.put('http://192.168.56.101:9988/api/user/' + id, { username, enable, locked }).then(() => {
        this.refresh(this.state.activePage);

        this.setState({
          activePage: this.state.activePage,
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
    }
  }

  // 刪除資料
  deleteMember(id) {
    if (confirm('請確認是否刪除')) {
      axios.delete('http://192.168.56.101:9988/api/user/' + id).then(() => {
        let { activePage, total, maxResults, firstResult, search } = this.state;
        let changeNumber = Math.ceil((total - 1) / (maxResults - firstResult));
        let number;

        if (activePage > changeNumber) {
          number = changeNumber;
        } else {
          number = activePage;
        }

        if(search === '') {
          this.refresh(number);
        } else {
          this.search(this.state.search);
        }
      });
    } else {
      return false;
    }
  }

  // 搜尋
  search(searchText) {
    let searchUrl  = new URLSearchParams();
    let { activePage, firstResult, total } = this.state;

    searchUrl.set('first_result', firstResult);
    searchUrl.set('max_results', total);
    searchUrl.set('username', searchText);

    axios.get('http://192.168.56.101:9988/api/users?' + searchUrl).then((res) => {
      this.setState({
        userList: res.data.ret,
        activePage: activePage,
        search: searchText,
        searchTotal: res.data.ret.length
      });
    });
  }

  searchChange(e){
    if (e.target.value !== '') {
      let value = e.target.value;

      this.setState({
        search: value,
        activePage: 1
      });

      this.search(value);
    } else {
      this.refresh(this.state.activePage);
    }
  }

  // 分頁刷頁
  handlePaginationChange(e, {activePage}) {
    this.setState({ activePage });

    if (this.state.search === ''){
      this.refresh(activePage);
    } else {
      this.search(this.state.search);
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
    let { userList, activePage, firstResult , maxResults, total, searchTotal } = this.state;
    let showPost;
    let paginationTotal;

    // 頁面顯示筆數
    if (this.state.search === '') {
      // 顯示一般列表
      showPost = userList.slice(firstResult, maxResults);

      paginationTotal = Math.ceil(total / (maxResults - firstResult));
    } else {
      // 顯示搜尋列表
      let postsPerPage = maxResults - firstResult;
      let lastPost = postsPerPage * activePage;
      let firstPost = lastPost - postsPerPage;

      showPost = userList.slice(firstPost, lastPost);

      paginationTotal = Math.ceil(searchTotal / (maxResults - firstResult));

      console.log(this.state.activePage);
    }

    // 顯示列表
    let showUserList = showPost.map((userData) => {
      return(
        <Table.Row key={userData.id}>
          <Table.Cell>{userData.id}</Table.Cell>
          <Table.Cell>{userData.username}</Table.Cell>
          <Table.Cell>{userData.enable}</Table.Cell>
          <Table.Cell>{userData.locked}</Table.Cell>
          <Table.Cell>{userData.created_at}</Table.Cell>
          <Table.Cell>
            <Button color='teal' onClick={this.editMember.bind(this, userData.id, userData.username, userData.enable, userData.locked)}>編輯</Button>
            <Button color='red' onClick={this.deleteMember.bind(this, userData.id)}>刪除</Button>
          </Table.Cell>
        </Table.Row>
      )
    });

    return(
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
          <Table.Body>{showUserList}</Table.Body>
        </Table>

        <div className="ui.clearing.segment">
          <div style={{float: 'right'}} className="ui pagination menu">
            <Pagination
              activePage={activePage}
              onPageChange={this.handlePaginationChange}
              totalPages={paginationTotal}
            />
          </div>
        </div>

        {/* 彈跳視窗 - 新增資料 */}
        <Modal open={this.state.addMemberModal} >
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
                    newMemberData.enable = e.target.value;
                    this.setState({ newMemberData });
                  }}
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
                    newMemberData.locked = e.target.value;
                    this.setState({ newMemberData });
                  }}
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
        <Modal open={this.state.editMemberModal} >
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
                    editMemberData.enable = e.target.value;
                    this.setState({ editMemberData });
                  }}
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
                    editMemberData.locked = e.target.value;
                    this.setState({ editMemberData });
                  }}
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
