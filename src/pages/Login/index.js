import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LoginCard from './LoginCard';
import LoginForm from './LoginForm';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length !== 9) {
      newErrors.phone = 'Phone number must be 9 digits';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Send full phone number with country code
      const fullPhone = '+251' + phone;
      const user = await login(fullPhone, password);
      
      if (user.role === 'admin' || user.role === 'superadmin') {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error('Admin access only');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      
      switch (err.response?.status) {
        case 401:
          toast.error('Invalid credentials');
          break;
        case 423:
          toast.error(message);
          break;
        default:
          if (err.code === 'ERR_NETWORK') {
            toast.error('Cannot connect to server');
          } else {
            toast.error(message);
          }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginCard>
      <LoginForm
        phone={phone}
        setPhone={setPhone}
        password={password}
        setPassword={setPassword}
        loading={loading}
        errors={errors}
        onSubmit={handleSubmit}
      />
    </LoginCard>
  );
}