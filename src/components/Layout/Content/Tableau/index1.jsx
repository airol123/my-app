import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Table, Button } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },

  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `EdwarKing ${i}`,
    address: `London,Park Lane no.${i}`,
  });
}

export default class index extends Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        pagination: {
            pageSize: 6,
            simple:true,
            size:'small',
          },
      };
    
      start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      };
    
      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };

    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
          <div>
            <div style={{ marginBottom: 0 }}>
              <span style={{ marginLeft: 3 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
            </div>
            <Table size="small" rowSelection={rowSelection} columns={columns} dataSource={data} pagination={this.state.pagination} />
          </div>
        );
      }
    }