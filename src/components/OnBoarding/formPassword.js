import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { Form, Input, Button, Checkbox } from 'antd';
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';
import { WalletContext } from '@utils/context';


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const FormPassword = ({ children, locked, getWallet, afterSubmit, textSubmit }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const ContextValue = React.useContext(WalletContext);
  const { encrypt, decrypt, encryptionStatus, setWallet } = ContextValue;

  const onFinish = (values) => {
    const wallet = getWallet();
    const { password } = values;

    switch (encryptionStatus) {
      case ENCRYPTION_STATUS_CODE.DECRYPTED:
        const mnemonicCypher = encrypt(password, wallet.mnemonic);
        setWallet({
          ...wallet,
          mnemonicCypher,
          mnemonic: false
        })
        break;
      case ENCRYPTION_STATUS_CODE.ENCRYPTED:
        const decryptedMnemonic = decrypt(password, wallet.mnemonicCypher);
        setWallet({
          ...wallet,
          mnemonic: decryptedMnemonic,
        })
        break;
      default:
    }

    afterSubmit();
  }

  const showForm = locked || encryptionStatus === ENCRYPTION_STATUS_CODE.ENCRYPTED;

  const LockedForm = () =>
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {textSubmit}
        </Button>
      </Form.Item>
   </Form>;
  
   return showForm ? <LockedForm /> : <div>{children}</div>;
};

export default FormPassword;
