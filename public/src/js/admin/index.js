import React, { Component } from 'react';
import { render } from 'react-dom';
import { Layout } from 'antd';
import UserInfo from './component/userinfo';
import AdminSlider from './component/adminAside';
import Category from './component/category';
import CategoryAdd from './component/category_add';
import "./../../css/admin.scss";

const {Header, Sider, Content, Footer } = Layout;

class Admin extends Component{
  constructor(props){
    super(props);
    this.state = {
      userInfo_data: null,
      userInfo_pagination: null,
      mode: "userInfo",
      collapsed: false,
      category_data: null,
      category_pagination: null
    }
    this.changeMode = this.changeMode.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }
  componentDidMount(){
    this.getUserInfo();
    this.getCategory();
  }
  changeMode(mode){
    this.setState({
      mode: mode
    });
  }
  getUserInfo(page = 1){
    fetch(`/admin/user?page=${page}`,{
      method: "GET",
      mode: 'cors',
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      credentials: 'include',
    }).then(response => response.json())
      .then( userInfoData => {
        if(userInfoData.code > 0){
          this.setState({
            userInfo_data: userInfoData.data,
            userInfo_pagination: userInfoData.pagination
          });
          //console.log(userInfoData.data);
        }
      })
  }
  getCategory(page = 1){
    fetch(`/admin/category?page=${page}`,{
      method: "GET",
      mode: 'cors',
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      credentials: 'include',
    }).then(response => response.json())
      .then( categoryData => {
        //console.log(data);
        this.setState({
          category_data: categoryData.data,
          category_pagination: categoryData.pagination
        });
      })
  }
  addCategory(e,form){
    e.preventDefault();
    let categoryName = '';
    form.validateFields((err, values)=>{
      if(!err){
        categoryName = values.categoryName;
      }
    });
    fetch(`/admin/category/add?categoryName=${categoryName}`,{
      method: "GET",
      mode: 'cors',
      headers:{
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      credentials: 'include',
    }).then(response => response.json())
      .then( data => {
        //console.log(data);
        if(data.code === 2){
          alert("添加成功");
          this.setState({
            mode: 'category_add',
          });
        }
      })
  }

  render(){
    return(
        <Layout>
          <AdminSlider
             handleChangeMode = {this.changeMode}
          />
          <Layout>
            <Header style={{ background: "#fff", padding: 0}}/>
            <Content style={{ margin: "24px 16px 0"}} >
              {
                this.state.mode === "userInfo" ?
                  <UserInfo
                     userInfoData={this.state.userInfo_data}
                     userInfoPage={this.state.userInfo_pagination}
                     handleGetUserInfo={this.getUserInfo}
                  /> :
                this.state.mode === "category" ?
                  <Category
                     categoryData={this.state.category_data}
                     categoryPage={this.state.category_pagination}
                     handleGetCategory={this.getCategory}
                  /> :
                this.state.mode === "category_add" ?
                  <CategoryAdd
                     handleAddCategory={this.addCategory}
                  /> : null
               }
            </Content>
            <Footer style={{ textAlign: 'center'}}>
              Extpress Blog @2017 Create by Tiankai
            </Footer>
          </Layout>
        </Layout>
    )
  }
}

render(
    <Admin/>,
  document.getElementById('admin')
);
