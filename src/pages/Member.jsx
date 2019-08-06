import React, { Component } from 'react';
import { Header, Table, Button, Modal, Form, Message } from 'semantic-ui-react';
import Search from '../components/Search';
import axios from 'axios';

class Member extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      pageNo: 1,
      first_result: 0,
      max_results: 20,
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
    };

    this.newToggleModal = this.newToggleModal.bind(this);
    this.editToggleModal = this.editToggleModal.bind(this);

  }

  componentDidMount(){
    //讀取資料
    this.refresh();
  }

  //刷新資料 =============================================================
  refresh(){
    axios.get('http://192.168.56.101:9988/api/users').then((response) => {

      this.setState({
        userList: response.data.ret,
        search: '',
        total: response.data.pagination.total
      })

      console.log(
        'first_result:' + this.state.first_result +
        '  max_results:' + this.state.max_results +
        '  pageNo:' + this.state.pageNo
      );

      //console.log(response.data.pagination.total);
    });
  }

  //新增資料 =============================================================
  addMember(){
    axios.post('http://192.168.56.101:9988/api/user', this.state.newMemberData).then((response) => {

      let { userList } = this.state;
      userList.push(response.data.ret);

      if(this.state.newMemberData.username == '')
        this.setState({
          addError: true
        });
      else
        this.setState({
          userList: userList,
          addMemberModal: false,
          newMemberData:{
            username: '',
            enable: '0',
            locked: '0',
          },
        });

      //console.log(response.data.ret);
    });
  }

  //編輯資料 =============================================================
  editMember(id, username, enable, locked){
    this.setState({
      editMemberData: { id, username, enable, locked },
      editMemberModal: !this.state.editMemberModal,
    });

    //console.log(this.state.editMemberData);
  }

  updateMember(){
    let { username, enable, locked } = this.state.editMemberData;

    axios.put('http://192.168.56.101:9988/api/user/' + this.state.editMemberData.id, { username, enable, locked }).then(() => {
      this.refresh();

      if(this.state.editMemberData.username == '')
        this.setState({
          editError: true
        });
      else
        this.setState({
          editMemberData: {
            id: '',
            username: '',
            enable: '',
            locked: '',
          },
          editMemberModal: false,
          editError: false,
        });
    });
  }

  //刪除資料 =============================================================
  deleteMember(id){
    if(confirm('請確認是否刪除'))
      axios.delete('http://192.168.56.101:9988/api/user/' + id).then(() => {
        this.refresh();
      });
    else
      return false;
  }

  //搜尋資料 =============================================================
  updateSearch(){
    this.setState({
      data: this.state.data,
      search: event.target.value
    })
  }

  //彈跳視窗 - 新增資料  =============================================================
  newToggleModal(){
    this.setState({
      addMemberModal: !this.state.addMemberModal,
    });
  }

  //彈跳視窗 - 編輯資料
  editToggleModal(){
    this.setState({
      editMemberModal: !this.state.editMemberModal,
    });
  }

  render(){

    //頁面顯示筆數 =============================================================
    let { pageNo, first_result , max_results , total  } = this.state;

    const postsPerPage = max_results - first_result;
    const lastPost = postsPerPage * pageNo;
    const firstPost = lastPost - postsPerPage;
    const currentPost = this.state.userList.slice(firstPost, lastPost);

    //頁碼 =============================================================
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(total / postsPerPage); i++) {
      pageNumbers.push(i);
    }

    const PageNumbers = pageNumbers.map(number => {

      return (
        <a
          key={number}
          id={number}
          className={pageNo === number ? 'item active' : 'item'}
          onClick={() => {

            let params  = new URLSearchParams();
            params.set('first_result', firstPost);
            params.set('max_results', lastPost);

            axios.get('http://192.168.56.101:9988/api/users?' + params).then((response) => {

              this.setState({
                userList: response.data.ret,
                pageNo: number,
                first_result: firstPost,
                max_results: lastPost,
                total: response.data.pagination.total,
              });

              console.log(
                'first_result:' + this.state.first_result +
                '  max_results:' + this.state.max_results +
                '  pageNo:' + this.state.pageNo
              );


            });

          }}
        >
          {number}
        </a>
      );
    });

    //搜尋 =============================================================
    let searchPost = this.state.userList.filter((item)=>{
      return item.username.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    })

    let showPost;

    if(this.state.search === '')
      showPost = currentPost;
    else
      showPost = searchPost;

    //console.log(currentPost);

    //顯示列表 =============================================================
    let userList = showPost.map((userData) => {
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
            onChange={(e) => {
              this.setState({
                userList: this.state.userList,
                search: e.target.value
              });
            }}
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
          <Table.Body>{userList}</Table.Body>
        </Table>
        <div className="ui.clearing.segment">
          <div style={{float: 'right'}} className="ui pagination menu ">
            {PageNumbers}
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
                    this.setState({newMemberData});
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
                    this.setState({newMemberData});
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
                    this.setState({newMemberData});
                  }}
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>

              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.addMember.bind(this)}>確定</Button>
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
                    this.setState({editMemberData});
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
                    this.setState({editMemberData});
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
                    this.setState({editMemberData});
                  }}
                >
                  <option value="0">否</option>
                  <option value="1">是</option>
                </Form.Field>

              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.updateMember.bind(this)}>更新</Button>
            <Button onClick={this.editToggleModal}>取消</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default Member;
