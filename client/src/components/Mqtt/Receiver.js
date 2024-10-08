import React from 'react'
import { Card, List } from 'antd'

class Receiver extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const renderListItem = (item) => (
      <List.Item>
        <List.Item.Meta title={item.topic} description={item.message} />
      </List.Item>
    )

    return (
      <div>
        {console.log(this.props.messages)}
        <Card title="Receiver">
          <List
            size="small"
            bordered
            dataSource={this.props.messages}
            renderItem={renderListItem}
          />
        </Card>
      </div>
    )
  }
}

export default Receiver

