
import React, { useState } from 'react'

export default function Publisher(props) {
  const [record, setRecord] = useState({
    topic: '/',
    qos: 0,
    payload: '',
  })

  const nameChangeTopic = (e) => {
    setRecord({ ...record, topic: e.target.value })
  }
  const nameChangePayload = (e) => {
    setRecord({ ...record, payload: e.target.value })
  }
  const handlePublish = () => {
    props.publish(record)
  }

  return (
    <form onSubmit={handlePublish}>
      <input id="topic" value={record.topic} onChange={nameChangeTopic} type="text" />
      <input id="payload" value={record.payload} onChange={nameChangePayload} type="text" />
      <button type="submit">Publish</button>
    </form>
  )
}
