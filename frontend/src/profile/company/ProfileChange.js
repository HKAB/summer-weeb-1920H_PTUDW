import React, {useState, useEffect} from "react";
import { Component } from "react";
import {
	EditOutlined,
	SettingOutlined,
	PlusOutlined,
} from "@ant-design/icons";

import {
	Tag,
	Card,
	Button,
	Modal,
	Select,
	Input,
	Form,
	Upload,
	Carousel,
} from "antd";
import Meta from "antd/lib/card/Meta";


import { List, Avatar, Typography } from "antd";

import { accountServices } from "@/services";
import dayjs from "dayjs";
import moment from 'moment';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

import '../assets/css/profile.css';

import Markdown from 'braft-extensions/dist/markdown'
//import Form from "antd/lib/form/Form";
import {EditableTagGroup} from '@/components';

const { Option } = Select;
const { Title } = Typography;
const jobs = [
	{
		title: "Tuyển Dev tại facebook.wap.sh",
		seniority_level: "Junior",
		employment_type: "Full time",
		cities: "Hà Nội",
		skills: ["Python", "C++", "C#", "Java", "Coffee"],
		description: "",
		recruitment_url:"",
	},
	{
		title: "Tuyển Dev tại facebook.wap.sh",
		seniority_level: "Mid level",
		employment_type: "Part time",
		cities: "Hà Nội",
		skills: ["Python", "C++", "C#", "Java", "Coffee"],
		description: "",
		recruitment_url:"",
	},
	{
		title: "Tuyển Dev tại facebook.wap.sh",
		seniority_level: "Fresher",
		employment_type: "Remote",
		cities: "Hà Nội",
		skills: ["Python", "C++", "C#", "Java", "Coffee"],
		description: "",
		recruitment_url:"",
	}
]


BraftEditor.use(Markdown());

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function ProfileChange() {

	const [visible, setVisible] = useState(false);
	const [createJob_visible, setCreateJob_visible] = useState(false);
	const [editJob_visible, setEditJob_visible] = useState(false);
	const [editorState, setEditorState] = useState(null);
	const [outputHTML, setOutputHTML] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const [fileList, setfileList] = useState([]);

	const [formEdit] = Form.useForm();
	
	const handleEditorChange = (editorState) => {
		setEditorState(editorState);
		//outputHTML: editorState.toHTML()
		//console.log(state.outputHTML);	
	}
	const onEditorFinish = () =>{
		setOutputHTML(editorState.toHTML());
		// console.log(state.outputHTML);
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	const showCreateJobModal = () => {
		setCreateJob_visible(true);
	};

	const handleCreateJobCancel = (e) => {
		setCreateJob_visible(false);
	};

	const showEditJobModal = () => {
		setEditJob_visible(true);
	};

	const handleEditJobCancel = (e) => {
		setEditJob_visible(false);
	};

	const onJobModify = (item) => {
		console.log(item);
		formEdit.setFieldsValue({
			editjobtitle: item.title,
			editsenioritylevel: item.seniority_level,
			editcity: item.cities,
			editemployeetype: item.employment_type,
			editdescription: item.description,
			editrecruitmenturl: item.recruitment_url,
		});
		//EditTag.setState({tags: item.skills});
		// editTags.setTags(item.skills);
		showEditJobModal();
	};
	
	const handlePreviewCancel = () => setPreviewVisible(false);

	const handlePreview = async file => {
	  if (!file.url && !file.preview) {
		file.preview = await getBase64(file.originFileObj);
	  }
  
	//   setState({
	// 	previewImage: file.url || file.preview,
	// 	previewVisible: true,
	// 	previewTitle:
	// 	  file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
	//   });
	  setPreviewImage(file.url || file.preview);
	  setPreviewVisible(true);
	  setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
	};
  
	const handleUploadChange = ({ fileList }) => {
		// setState({ fileList });
	}

		const uploadButton = (
			<div>
			  <PlusOutlined />
			  <div>Upload</div>
			</div>
		);
		return (
			<>
				<Card className="card-info" style={{ marginTop: 24 }} title={<Title level={3}>Mô tả</Title>}>
					<BraftEditor 
						language="en"
						value={editorState}
						onChange={handleEditorChange}
					/>
					<Button type ="primary" htmlType="submit" onClick={()=>onEditorFinish()}>Save</Button>
				</Card>

				<Card
					className="card-info"
					style={{
						marginTop: 24,
					}}>
					<Meta title={<Title level={3}>Việc làm</Title>}></Meta>
					<List
						grid={{ gutter: 24, column: 2 }}
						dataSource={jobs}
						renderItem={item => (
							<List.Item>
								<Card
									style={{ marginTop: 16 }}
									actions={[
										<SettingOutlined key="setting" />,
										<EditOutlined key="edit" onClick={() => onJobModify(item)}/>,
									]}
								>
									<Meta
										avatar={<Avatar src="https://image.flaticon.com/icons/svg/3198/3198832.svg"></Avatar>}
										title={item.title}
										description={<div>
											<div>Yêu cầu: {item.seniority_level}</div>
											<div>Địa điểm: {item.cities}</div>
											<div>Công việc: {item.employment_type}</div>
											<List dataSource={item.skills} renderItem={skill => (<Tag>{skill}</Tag>)}></List>
										</div>}
									/>
								</Card>
							</List.Item>
						)}>
					</List>
					<Button style={{ float: "right" }} size="large" type="primary" shape="circle" onClick={()=>showCreateJobModal()}>+</Button>
				</Card>
				
				<Modal
					forceRender
					title="Tạo việc làm"
					visible={createJob_visible}
					onCancel={handleCreateJobCancel}
				>
					<Form
						id = "createJob"
						labelCol={{ span: 6 }}
						wrapperCol={{ span: 18 }}
					>
						<Form.Item
							label="Job Title"
							name="Jobtitle"
							rules={[{ required: true, message: "Job title is required!" }]}
						>
							<Input />
						</Form.Item>
						
						<Form.Item
							label="Job Description"
							name="JobDescription"
							rules={[{ required: true, message: "Job description is required!" }]}
						>
							<Input />
						</Form.Item>
						
						<Form.Item
							label="Seniority level"
							name="seniority_level"
							rules={[{ required: true, message: "Seniority level is required!" }]}
						>
							<Select placeholder="select seniority level">
								<Option value="junior">Junior</Option>
								<Option value="midlevel">Mid Level</Option>
								<Option value="senior">Senior</Option>
							</Select>
						</Form.Item>

						<Form.Item
							label="Employee type"
							name="employee_type"
							rules={[{ required: true, message: "Employee type is required!" }]}
						>
							<Select placeholder="select employee type">
								<Option value="junior">Full time</Option>
								<Option value="midlevel">Part time</Option>
								<Option value="senior">Full time/Part time</Option>
								<Option value="senior">Remote</Option>
							</Select>
						</Form.Item>
						
						<Form.Item
							label="Recruitment url"
							name="recruitment_url"
							rules={[{ required: true, message: "Recruitment url is required!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="City"
							name="City"
							rules={[{ required: true, message: "City is required!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Skill"
							name="skill"
							rules={[{ required: true, message: "Skill is required!" }]}
						>
							<Input />
						</Form.Item>						
					</Form>
				</Modal>

				<Modal
					forceRender
					title = "Chỉnh sửa việc làm"
					visible = {editJob_visible}
					onCancel = {handleEditJobCancel}
				>
					<Form
						id = "editJob"
						labelCol={{ span: 6 }}
						wrapperCol={{ span: 18 }}
						form = {formEdit}
					>
						<Form.Item
							initialValue="title"
							label="Title"
							name="editjobtitle"
							rules={[{ required: true, message: "Job title is required!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							initialValue="seniority_level"
							label="Yêu cầu:"
							name="editsenioritylevel"
							rules={[{ required: true, message: "Seniority level is required!" }]}
						>
							<Select>
								<Option value="junior">Junior</Option>
								<Option value="midlevel">Mid Level</Option>
								<Option value="senior">Senior</Option>
							</Select>
						</Form.Item>
						
						<Form.Item
							initialValue="city"
							label="Địa điểm:"
							name="editcity"
							rules={[{ required: true, message: "City is required!" }]}
						>
							<Input />
						</Form.Item>
											
						<Form.Item
							initialValue="employee_type"
							label="Công việc:"
							name="editemployeetype"
							rules={[{ required: true, message: "Employee type is required!" }]}
						>
							<Select>
								<Option value="junior">Full time</Option>
								<Option value="midlevel">Part time</Option>
								<Option value="senior">Full time/Part time</Option>
								<Option value="senior">Remote</Option>
							</Select>
						</Form.Item>

						<Form.Item
							initialValue="description"
							label="Description:"
							name="editdescription"
							rules={[{ required: true, message: "Description is required!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							initialValue="recruitment_url"
							label="Recruitment url:"
							name="editrecruitmenturl"
							rules={[{ required: true, message: "Recruitment url is required!" }]}
						>
							<Input />
						</Form.Item>

						{/* <Form.Item
							initialValue="skill"
							label="Skill:"
							name="editskill"
							rules={[{ required: true, message: "Skill is required!" }]}
						>
							<EditTag/>
							<EditableTagGroup ref={ref => (editTags = ref)} />
						</Form.Item> */}
					</Form>
				</Modal>
				<Card className="card-info" style={{ marginTop: 24 }}>
					<Upload
						//action ???
						listType="picture-card"
						fileList={fileList}
						onPreview={handlePreview}
						onChange={handleUploadChange}
					>
						{/* max number of image upload */}
						{fileList.length >= 8 ? null : uploadButton} 
					</Upload>
					<Modal
						visible={previewVisible}
						title={previewTitle}
						footer={null}
						onCancel={handlePreviewCancel}
					>
						<img alt="example" style={{ width: "100%" }} src={previewImage} />
					</Modal>
				</Card>
			</>
		);
	
}

export default ProfileChange;