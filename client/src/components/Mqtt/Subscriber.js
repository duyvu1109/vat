import React, { useState } from 'react'

export default function Subscriber(props) {
  const [record, setRecord] = useState({
    topic: '/',
    qos: 0,
  })

  const nameChangeHandler = (e) => {
    setRecord({ topic: e.target.value, qos: 0 })
  }

  const handleSubscribe = () => {
    const { topic, qos } = record
    props.subscribe(topic, qos)
  }

  const handleUnsub = () => {
    const { topic } = record
    props.unsubscribe(topic)
  }

  return (
    <form onSubmit={handleSubscribe}>
      <input id="name" value={record.topic} onChange={nameChangeHandler} type="text" />
      <button type="submit">Subscribe</button>
      {props.showUnsub ? <button onClick={handleUnsub}>Unsubscribe</button> : null}
    </form>
  )
}
