'use client';

import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Link from 'next/link';
import { userLogin } from '@/api/ai';
import { useRouter } from 'next/navigation';
import { MoonIcon, SunIcon } from 'lucide-react';
import classNames from 'classnames';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const Login = (props) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/');
      return;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const rs = await userLogin({
        username: formData.username,
        password: formData.password
      });

      if (rs.data?.code === 200) {
        const token = rs.data?.data?.access_token;
        if (token) {
          localStorage.setItem('authToken', `Bearer ${token}`);
          router.push('/');
        } else {
          throw new Error('No token received');
        }
      } else {
        setError(rs.data?.sub_message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.sub_message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=0.76, user-scalable=no"></meta>
      </Head>
      <div className="login-page">
      <div className={`login-container ${theme}`}>
        <button className="login-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? (
            <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>

        <form className={classNames(['login-form', {
          'login-form-light': theme === 'light',
          'login-form-dark': theme === 'dark'
        }])} onSubmit={handleSubmit}>
          <h1>Login</h1>

          {error && (
            <div className="login-error-message">
              {error}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={classNames(['login-submit-button', {
              'login-submit-button-light': theme === 'light',
              'login-submit-button-dark': theme === 'dark'
            }])}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-page-link">
            <Link href="/register">Don't have an account? Register here</Link>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;

export async function getStaticProps({ locale }) {
  return {
      props: {
          ...(await serverSideTranslations(locale, ['common'])),
      },
  };
}