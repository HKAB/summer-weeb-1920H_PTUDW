import { RightOutlined } from '@ant-design/icons';
import { Affix, Avatar, Button, Card, Col, Divider, List, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
// import { feedJobSuggestionService } from 'services/feed/feedJobSuggestion.service';
import { studentServices } from "services";
import { Config } from '../../config/consts';
const { Title, Text } = Typography;

function FeedJobSuggestion(props) {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggesions = async () => {
    let response = await studentServices.getStudentJobSuggestion();
    let result = response.map((item) => {
      return {
        jobId: item.id,
        accountId: item.account_id,
        companyName: item.company_name,
        companyProfilePicture: item.company_profile_picture,
        jobTitle: item.title,
        recruitmentUrl: item.recruitment_url,
        cities: item.cities
      }
    })
    setSuggestions(result);
  }

  useEffect(() => {
    fetchSuggesions();
  }, [])

  return (
    <Affix offsetTop={450}>
      <Card className="card-info" style={{ width: 400, height: 410, margintop: 24 }}>
        <Meta title={<Text>Jobs you might interest</Text>} />
        <Divider style={{ marginTop: 16, marginBottom: 0 }} />
        <List
          style={{ margin: 0 }}
          grid={{ gutter: 0, column: 1 }}
          itemLayout="vertical"
          dataSource={suggestions}
          renderItem={item => (
            <List.Item style={{ margin: 0, padding: 0 }} key={item.jobId}>
              <Card bordered={false} style={{ padding: 0 }}>
                <Row justify="space-between">
                  <Col span={4}>
                    <a href={"profile/company/" + item.accountId}>
                      <Avatar shape="square" size={32} src={Config.backendUrl + item.companyProfilePicture} style={{ marginTop: 16, marginLeft: 0 }} />
                    </a>
                  </Col>
                  <Col span={14}>
                    <Row justify="left"><a href={"profile/company/" + item.accountId}><Text ellipsis>{item.jobTitle}</Text></a></Row>
                    <Row justify="left"><a href={"profile/company/" + item.accountId}><Text ellipsis type="secondary">{item.companyName}</Text></a></Row>
                    <Row justify="left"><Text ellipsis type="secondary">{item.cities.join(", ")}</Text></Row>
                  </Col>
                  <Col span={6}>
                    <Button
                      onClick={() => { window.open(item.recruitmentUrl, "_blank") }} // Open stuff in new tab
                      type="default"
                      style={{ padding: 0, textAlign: "center", marginLeft: 8, marginRight: 4, marginTop: 4, width: 84 }}
                    >Visit <RightOutlined />
                    </Button>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </Affix>
  )
}

export { FeedJobSuggestion };

