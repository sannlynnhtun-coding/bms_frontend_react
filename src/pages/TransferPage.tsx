import React from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from 'react';
import SuccessMessage from '../components/transfer/SuccessMessage';
import {
  ResponseData,
  ResponseDataSchema,
  RequestBody,
  RequestBodySchema,
  error,
} from '../lib/types';
import TransferForm from '../components/transfer/TransferForm';

const NotAllowedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"/><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"/></svg>
);

const TransferPage = () => {

  const [accounts, setAccounts] = useState({
    sender: { name: '', isTouched: false },
    recipient: { name: '', isTouched: false },
    amount: { name: '', isTouched: false },
  });

  const [data, setData] = useState<ResponseData | null>(null);

  const [success, setSuccess] = useState(false);

  const [errorMessage, setErrorMessage] = useState<error | null>(null);
  console.log(errorMessage);

  const convertAmount = parseInt(accounts.amount.name, 10);

  const requestBody: RequestBody = {
    process: 'transfer',
    data: {
      sender: accounts.sender.name,
      receiver: accounts.recipient.name,
      transferAmount: convertAmount,
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbkNvZGUiOiJibXNfMWFkNGI2N2UyYjVhN2JlNjA5MTJhYTJkNDc0ZDQxMGEiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MTc1MjUwNzksImV4cCI6MTcxNzYxMTQ3OX0.KzA4QljkwEiw4ZzRDQikAg7gIVqbuOyjGUHKAee1AQQ',
  };

  const config: AxiosRequestConfig = {
    headers: headers,
  };

  const handleOnChange = (field: string, value: string): void => {
    setAccounts((prevAccounts) => ({
      ...prevAccounts,
      [field]: {
        name: value,
        isTouched: true,
      },
    }));
  };

  const isCompleted = Object.values(accounts).every((value) => value.name);

  const clickHandler = async () => {
    try {

      RequestBodySchema.parse(requestBody);

      const response: AxiosResponse<{ data: ResponseData }> = await axios.post<{
        data: ResponseData;
      }>(
        'https://bms-backend-nodejs.vercel.app/api/v1/admins/users/transactions',
        requestBody,
        config,
      );

      ResponseDataSchema.parse(response.data.data);

      console.log('Response data:', response.data.data);
      if (response.status == 200) {
        setData(response.data.data);
        setSuccess(true);
        setErrorMessage(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          setErrorMessage(error.response.data);
          setSuccess(false);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="w-full mx-auto h-screen">
      <div className="w-full max-w-lg mx-auto mt-20">
        <form className="bg-secondaryBg border border-borderColor rounded-md px-8 pt-6 pb-8 mb-4">
          {!success && !errorMessage?.message && (
            <TransferForm
              accounts={accounts}
              handleOnChange={handleOnChange}
              isCompleted={isCompleted}
              clickHandler={clickHandler}
            />
          )}

          {success && <SuccessMessage data={data} />}
          {errorMessage && (
            <div className="w-full flex items-center justify-center gap-2">
              <NotAllowedIcon/>
              <p className="text-sm text-center text-deleteBtn">
                {errorMessage.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransferPage;
