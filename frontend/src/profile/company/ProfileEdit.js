import React, { useState, useEffect } from 'react'
import { Tabs, Menu, Form, Input, Button, Upload, Space, message, DatePicker, Modal, Card } from 'antd';
import { Row, Col, Avatar, Switch } from 'antd';
import { companyServices } from "@/services";
import { accountServices } from "@/services";


const { TabPane } = Tabs;
const color = (
  <Menu style={{ marginLeft: 450 }}>
    <Button key='3' title="Orange" style={{ backgroundColor: "rgb(250,173,20" }}>Orange</Button>
    <Button key='4' title="Daybreak Blue" style={{ backgroundColor: 'rgb(24,144,255)' }}>LBlue</Button>
    <Button key='5' title="Red" style={{ backgroundColor: "rgb(245,34,45)" }}>Red</Button>
    <Button key='6' title="Volcano" style={{ backgroundColor: "rgb(250,84,28)" }}>Volc</Button>
    <Button key='7' title="Cyan" style={{ backgroundColor: "rgb(19,194,194)" }}>Cyan</Button>
    <Button key='8' title="Green" style={{ backgroundColor: "rgb(82,196,26)" }}>Green</Button>
    <Button key='9' title="Geek Blue" style={{ backgroundColor: "rgb(47,84,235)" }}>GBlue</Button>
    <Button key='10' title="Purple" style={{ backgroundColor: "rgb(114,46,209)" }}>Purple</Button>
  </Menu>
)

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


function ProfileEdit() {

  const [disabled, setDisabled] = useState([]);
  const [basicProfileData, setBasicProfileData] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [phoneData, setPhoneData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [formEditBasicInfo] = Form.useForm();

  const handleChangeAvatar = info => {
    getBase64(info.file.originFileObj, picture =>
      setImageUrl(picture)
    );
  };

  useEffect(() => {
    let user = accountServices.userValue;
    console.log(user);
    if (user) {
      companyServices.getCompany(user.account.id);
      const subscription = companyServices.companyObject
        .subscribe((company) => {
          if (company) {
            company.basic_data.profile_picture = "http://127.0.0.1:8000" + company.basic_data.profile_picture;
            setBasicProfileData(company.basic_data);
            setEmailData(company.email);
            setPhoneData(company.phone);
            formEditBasicInfo.resetFields();
          }
        });
      return () => {
        subscription.unsubscribe();
      }
    }
    else {
      console.log("Oh no!");
    }
  }, [])

  const changeDisabled = () => {
    setDisabled(!disabled);
  }
  const editProfileCompany = values => {
    console.log(values);
    companyServices
      .updateBasicCompany(
        values.name,
        values.website,
        values.specialties,
        values.description
      )
      .then(() => {
        companyServices.getCompany(accountServices.userValue.account.id);
        Modal.success({ title: "uWu", content: "Basic information updated!" });
      })
      .catch((error) => {
        console.log(error);
        Modal.error({ title: "uWu", content: error });
      });

    if (!phoneData[0]) {
      companyServices
        .createCompanyPhone(
          values.phoneNumber
        )
        .then(() => {
          companyServices.getCompany(accountServices.userValue.account.id);
          Modal.success({ title: "uWu", content: "Phone updated!" });
        })
        .catch((error) => {
          console.log(error);
          Modal.error({ title: "uWu", content: error });
        });
    }
    else {
      companyServices
        .updateCompanyPhone(
          phoneData[0],
          values.phoneNumber,
        )
        .then(() => {
          companyServices.getCompany(accountServices.userValue.account.id);
          Modal.success({ title: "uWu", content: "Phone updated!" });
        })
        .catch((error) => {
          console.log(error);
          Modal.error({ title: "uWu", content: error });
        });
    }

    companyServices
      .updateCompanyEmail(
        emailData[0],
        values.email,
      )
      .then(() => {
        Modal.success({ title: "\^o^/", content: "Success" });
      })
      .catch((error) => {
        console.log(error);
        Modal.error({ title: "╯︿╰", content: error });
      });


  }
  const onFinishChangePass = values => {
    console.log(values.newPass, values.oldPass);
    if (values.newPass !== values.confPass) {
      Modal.error({ title: "╯︿╰", content: 'Password not match!' });
    } else {
      accountServices.changePassword(values.oldPass, values.newPass).then()
        .then(() => {
          Modal.success({ title: "\^o^/", content: "Change Password successfully!!!" });
        })
        .catch((error) => {
          Modal.error({ title: "╯︿╰", content: error });
        })
    }
  }

  return (
    <Card style={{ marginTop: "10vh", minHeight: "60vh" }}>
      <Tabs tabPosition="left" style={{ marginLeft: 24 }}>
        <TabPane tab="Thông tin tài khoản" key="1" style={{ marginTop: 20 }}>
          <span style={{ fontWeight: "bold" }}>THÔNG TIN TÀI KHOẢN</span>
          <Row>

            <Col span={10} offset={4}>
              <Form
                // ref={formRef}
                form={formEditBasicInfo}
                onFinish={editProfileCompany}
                style={{ marginTop: 32 }}
                initialValues={{
                  name: basicProfileData.name,
                  website: basicProfileData.website,
                  email: emailData[0],
                  specialties: basicProfileData.specialties,
                  phoneNumber: phoneData[0],
                  description: basicProfileData.description
                }}
              >

                <span>Company Name</span>
                <Form.Item name="name" >
                  <Input></Input>
                </Form.Item>

                <span>Website</span>
                <Form.Item name="website" >
                  <Input ></Input>
                </Form.Item>


                <span>Email</span>
                <Form.Item name="email" >
                  <Input ></Input>
                </Form.Item>

                <span>Phone Number</span>
                <Form.Item name="phoneNumber"  >
                  <Input />
                </Form.Item>
                <span>Specialties</span>
                <Form.Item name="specialties"  >
                  <Input />
                </Form.Item>

                <span>Description</span>
                <Form.Item name="description" >
                  <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit">Save</Button>
                <Button type="primary" style={{ marginLeft: 16 }} htmlType="cancel" >Cancel</Button>
              </Form>
            </Col>
            <Col span={10} style={{ textAlign: "center" }}>
              <Space style={{ marginTop: 32 }} direction="vertical">
                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChangeAvatar}

                >
                  <Avatar style={{ width: 180, height: 180, marginBottom: 10 }} src={imageUrl ? imageUrl : basicProfileData.profile_picture} alt=''></Avatar>
                </Upload>
              </Space>
            </Col>
          </Row>

        </TabPane>
        <TabPane tab="Change Password" key="3" style={{ marginTop: 20 }}   >
          <span style={{ fontWeight: "bold" }}>CHANGE PASSWORD</span>
          <Row>
            <Col span={10} offset={4}>
              <Form
                onFinish={onFinishChangePass}
                style={{ marginTop: 32 }} >
                <span> Old Password</span>
                <Form.Item name="oldPass" rules={[{ required: true, message: 'Đừng để trống' }]}>
                  <Input.Password placeholder="Old Password"  ></Input.Password>
                </Form.Item>

                <span>New Password</span>
                <Form.Item name="newPass" rules={[{ required: true, message: 'Đừng để trống' }]}>
                  <Input.Password placeholder="New Password"  ></Input.Password>
                </Form.Item>

                <span> Confirm Password</span>
                <Form.Item name="confPass" rules={[{ required: true, message: 'Đừng để trống' }]}>
                  <Input.Password placeholder="Confirm Password" ></Input.Password>
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit" >Save</Button>
                  <Button type="primary" htmlType="cancel" >Cancel</Button>
                </Space>
              </Form>
            </Col>
            <Col span={10}></Col>
          </Row>
        </TabPane>
        <TabPane tab="Settings" key="2" style={{ marginTop: 20 }}>
          <span style={{ fontWeight: "bold" }}>CHANGE PASSWORD</span>
          <Row style={{ marginTop: 56 }}>
            <Col span={20} offset={4}>
              <span>Notification</span>
              <Switch style={{ position: 'absolute', right: 64 }} checkedChildren="ON" unCheckedChildren="OFF" defaultChecked onClick={changeDisabled} />
            </Col>
          </Row>
        </TabPane>

      </Tabs>
    </Card>


  );
}

export { ProfileEdit };