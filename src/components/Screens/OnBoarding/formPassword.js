import React, { useMemo } from 'react'
import styled from 'styled-components';
import { Form, Input, Button, Checkbox } from 'antd';
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';
import { WalletContext } from '@utils/context';
import { UnlockOutlined } from '@ant-design/icons'
import './OnBoarding.css'


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

const MIN_LENGTH = 8;

const FormPassword = ({ children, locked, confirmPassword, getWallet, afterSubmit, textSubmit }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [form] = Form.useForm();
  form.resetFields = () => false;
  const ContextValue = React.useContext(WalletContext);
  const { encrypt, decrypt, encryptionStatus, setWallet } = ContextValue;
  const [callAfterSubmit, setCalldAfterSubmit] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      if (callAfterSubmit && afterSubmit) await afterSubmit();
      setCalldAfterSubmit(false);
    })();
  }, [callAfterSubmit, afterSubmit]);
  const onConfirmPassword = values => {
    if (!confirmPassword) return true;
    if (values.password === values.confirmPassword) return true;
    return Promise.reject(new Error('The two passwords that you entered do not match!'));
  }

  const onFinish =  (values) => {
    const wallet = getWallet();
    const { password } = values;
    console.log('password', password);
    console.log('current encryption status', encryptionStatus);
    onConfirmPassword(values);
    switch (encryptionStatus) {
      case ENCRYPTION_STATUS_CODE.DECRYPTED:
        const mnemonicCypher = encrypt(password, wallet.mnemonic);
        console.log('mnemonic cypher objects', password, wallet, mnemonicCypher);
        setWallet({
          ...wallet,
          mnemonicCypher,
          mnemonic: false
        });
        setCalldAfterSubmit(true)
        break;
      case ENCRYPTION_STATUS_CODE.ENCRYPTED:
        console.log('decrypt', password, wallet);
        const decryptedMnemonic = decrypt(password, wallet.mnemonicCypher);
        console.log(decryptedMnemonic);
        setWallet({
          ...wallet,
          mnemonic: decryptedMnemonic,
        });
        setCalldAfterSubmit(true)
        break;
      default:
    }
  }

  const showForm = locked || encryptionStatus === ENCRYPTION_STATUS_CODE.ENCRYPTED;

  const UnlockButton = () => <StyledButton htmlType="submit" icon={<UnlockOutlined />}>
                             </StyledButton>;

  const addonAfter = textSubmit ? false : <UnlockButton />;

  const LockedForm = () =>
    <Form
    style={form_style}
      form={form}
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}

      resetFields={() =>false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="password"
        align="center"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          () => ({
            validator(_, value) {
               if (value.length < MIN_LENGTH) {
                return Promise.reject(new Error(`Password should have at least ${MIN_LENGTH} characters`));
               }

               return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password placeholder="Password" {...addonAfter}/>
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

const form_style = {
  margin: 'auto',
  marginTop:'20px',
  display: 'inline-block',
  alignItems: 'center'
}


export default FormPassword;
