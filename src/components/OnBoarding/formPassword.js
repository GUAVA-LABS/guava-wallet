import React, { useMemo } from 'react'
import styled from 'styled-components';
import { Form, Input, Button, Checkbox } from 'antd';
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';
import { WalletContext } from '@utils/context';
import { UnlockOutlined } from '@ant-design/icons'

export const StyledButton = styled(Button)`
  border: 2px solid #D5008C;
  display: inline-block;
  
`;

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

const FormPassword = ({ children, locked, confirmPassword, getWallet, afterSubmit, textSubmit }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const ContextValue = React.useContext(WalletContext);
  const { encrypt, decrypt, encryptionStatus, setWallet } = ContextValue;

  const onConfirmPassword = values => {
    if (!confirmPassword) return true;
    if (values.password === values.confirmPassword) return true;
    return Promise.reject(new Error('The two passwords that you entered do not match!'));
  }

  const onFinish = (values) => {
    const wallet = getWallet();
    const { password } = values;
    onConfirmPassword(values);
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

  const UnlockButton = () => <StyledButton htmlType="submit" icon={<UnlockOutlined />}>
                             </StyledButton>;

  const addonAfter = textSubmit ? false : <UnlockButton />;

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
        
        name="password"
        align="center"

        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder="Password" {...addonAfter} />
      </Form.Item>
      {confirmPassword &&  <Form.Item
        
        name="confirmPassword"
        align="center"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm Password" {...addonAfter} />
      </Form.Item>}
      {textSubmit && <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {textSubmit}
        </Button>
      </Form.Item>}
    </Form>;
  
  return (<>
    {showForm && <LockedForm />}
    {!showForm && <div>{children}</div>}
  </>)

};

export default FormPassword;
