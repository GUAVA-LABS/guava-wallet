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

const FormPassword = ({ getWallet, afterSubmit }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const ContextValue = React.useContext(WalletContext);
  const { encrypt, decrypt, encryptionStatus, setWallet } = ContextValue;

  const onFinish = (values) => {
    const wallet = getWallet();
    const { password } = values;
    
    switch(encryptionStatus) {
      case ENCRYPTION_STATUS_CODE.DECRYPTED: 
        const mnemonicCypher = encrypt(password, wallet.mnemonic);
        setWallet({
          ...wallet,
          mnemonic: mnemonicCypher
        })
        break;
      case ENCRYPTION_STATUS_CODE.ENCRYPTED:
        const decryptedMnemonic = decrypt(password, wallet.mnemonic);
        setWallet({
          ...wallet,
          mnemonic: decryptedMnemonic
        })
        break;
      default:
      }

      afterSubmit();
  }


  return (
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

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
     
        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Ok, make me a wallet.
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormPassword;
