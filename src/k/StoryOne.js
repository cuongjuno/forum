/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './storyOne.styles.scss';
import listCity from '../../../../../../remote/weather-test/src/resources/json/city.list.min.json';
import { getWeatherByCityName } from '../../../../../../remote/weather-test/src/api/api';
import moment from 'moment';
import { Layout, List, Card, Typography, Row, Col, Divider } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography;
function StoryOne() {
  const [listQueryCity, setListQueryCity] = useState(listCity.slice(0, 5));
  const [listWeatherData, setListWeatherData] = useState([]);
  const fetchData = async () => {
    Promise.all(
      listQueryCity.map((e) => {
        return getWeatherByCityName(e.name);
      })
    ).then((res) => setListWeatherData(res));
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(listWeatherData);
  }, [listWeatherData]);
  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
    {
      title: 'Title 5',
    },
    {
      title: 'Title 6',
    },
    {
      title: 'Title 7',
    },
    {
      title: 'Title 8',
    },
    {
      title: 'Title 9',
    },
  ];
  return (
    <>
      <Layout>
        <Header>
          <img src="./images/logo.png" alt="logo" height="40px" />
        </Header>
        <Layout>
          <Content>
            <Title level={2}>h2. Ant Design</Title>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={listWeatherData}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.name}>
                    <Row>
                      <Col span={12}>
                        <div className="weather-icon"></div>
                      </Col>
                      <Col span={12}>
                        <div className="weather-content">
                          {moment().format('dddd, MMMM Do YYYY')}
                          <Divider />
                          <Typography.Paragraph>
                            {Math.floor(item.main.temp_max - 273.15)}°C/
                            {Math.floor(item.main.temp_min - 273.15)}°C
                          </Typography.Paragraph>
                          <Typography.Paragraph>
                            {item.weather[0].main}
                          </Typography.Paragraph>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default StoryOne;
