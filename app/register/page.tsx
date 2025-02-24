'use client';

import React, { useEffect, useState } from 'react';
import './index.css';
import Link from 'next/link';
import { userRegister } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { MoonIcon, SunIcon } from 'lucide-react';
import classNames from 'classnames';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const rs = await userRegister({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
     
      if (rs.data?.code === 200) {
        router.push('/login');
      } else {
        setError(rs.data?.sub_message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.sub_message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="register-page">
      <div className={classNames(['register-container', theme])}>
        <button className="register-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? (
            <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>
        
        <form className={classNames(['register-form', {
          'register-form-light': theme === 'light',
          'register-form-dark': theme === 'dark'
        }])} onSubmit={handleSubmit}>
          <h1>Register</h1>
          
          {error && (
            <div className="register-error-message">
              {error}
            </div>
          )}

          <div className="register-form-group">
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

          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="register-form-group">
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

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={classNames(['register-submit-button', {
              'register-submit-button-light': theme === 'light',
              'register-submit-button-dark': theme === 'dark'
            }])}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="register-page-link">
            <Link href="/login">Already have an account? Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;