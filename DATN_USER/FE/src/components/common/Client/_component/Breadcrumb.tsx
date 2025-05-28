import React from 'react';
import { Breadcrumb } from 'antd';

const Breadcrumb_Component: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Home',
      },
      {
        title: <a href="">Application Center</a>,
      },
      {
        title: <a href="">Application List</a>,
      },
      {
        title: 'An Application',
      },
    ]}
  />
);

export default Breadcrumb_Component;