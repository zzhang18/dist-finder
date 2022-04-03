import './App.css';
import { Button, Input, Table } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import _ from 'lodash';
import axios from 'axios';

const { TextArea } = Input;
function App(props) {
  const columns = [
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: text => <a>{text}</a>,
    },
    {
      title: '小区',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
      <div>

        <p style={{ fontSize: 18, fontWeight: 600 }}>根据地址搜索小区，批量用'、'分隔</p>
        <TextArea rows={4} value={props.input} onChange={(e) => props.onInputChange(e.target.value)} />
        <Button onClick={props.checkDist}>搜索</Button>
        <p style={{ fontSize: 18, fontWeight: 600 }}>结果</p>
        <TextArea rows={4} value={props.output} />
        <Table
          columns={columns}
          dataSource={props.data}
        />
      </div>
    </div>
  );
}


let hoc = WrappedComponent => {
  return class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        input: '',
        source: '北松公路5768号、北闵路375号、北松公路6955弄、滨湖路585弄、仓丰路955弄',
        data: [],
        output: ''
      }
    }

    componentDidMount = () => {
    }

    onInputChange = (value) => {
      console.log('value', value);
      // console.log('input', this.state.source);

      this.setState({ input: value })

    }

    checkDist = async () => {
      // console.log('intpuDa', this.state.source)
      // _.compact(this.state.source)
      let dataSource = `庵前小区、

      奥利匹克花园、
      
      中原二村。`
      // dataSource = _.split(dataSource, '、')
      // console.log('data', dataSource)

      dataSource = _.split(this.state.input, '、')
      console.log('data', dataSource)

      let dists = [];
      let distString = '';
      dists = await Promise.all(_.map(dataSource, async address => {
        address = _.trim(address)
        let url = 'https://restapi.amap.com/v3/place/text?key=bd6119734661f2ffa8b25e2cd0fc52e9&keywords=' + address + '&types=%E4%BD%8F%E5%AE%85%E5%8C%BA&city=%E4%B8%8A%E6%B5%B7&children=1&offset=20&page=1&extensions=all'

        let res = await axios.get(url)
        let name = res.data && res.data.pois[0] && res.data.pois[0].name ? res.data.pois[0].name : '';
        console.log('res name', name);
        distString += `地址：${address} → 小区：${name} \n`;
        return { address, name };
        // return { address  };
      }))
      console.log('dists', dists);
      console.log('distString', distString);
      this.setState({ data: dists, output: distString })
    }
    render() {
      return <WrappedComponent
        input={this.state.input}
        output={this.state.output}
        source={this.state.source}
        data={this.state.data}
        onInputChange={this.onInputChange}
        checkDist={this.checkDist}
      />
    }
  }
}

export default hoc(App);
