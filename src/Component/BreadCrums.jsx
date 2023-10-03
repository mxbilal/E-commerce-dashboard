import { Breadcrumb } from 'antd'
import React from 'react'

const BreadCrums = ({ items }) => {
  return (
    <Breadcrumb
      style={{
        margin: '16px 0',
        textTransform: 'capitalize'
      }}
      items={items}
    />
  )
}

export default React.memo(BreadCrums)
