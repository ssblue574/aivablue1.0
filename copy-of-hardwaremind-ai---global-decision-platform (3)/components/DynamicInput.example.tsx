import React, { useState } from 'react';
import { DynamicInput } from './DynamicInput';

/**
 * Example usage of the DynamicInput component
 * 
 * This component demonstrates:
 * - Floating label animation
 * - Focus glow effects
 * - Particle effects on typing
 * - Gradient underline
 * - Character count animation
 * - Error states
 * - Icon support
 */

export const DynamicInputExample: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (value && !value.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 600 }}>
        Dynamic Input Examples
      </h2>

      {/* Basic Input with Floating Label */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Basic Input with Floating Label
        </h3>
        <DynamicInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            validateEmail(value);
          }}
          placeholder="Enter your email"
          error={emailError}
          required
        />
      </div>

      {/* Password Input with Icon */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Password Input with Icon
        </h3>
        <DynamicInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
          required
        />
      </div>

      {/* Input with Character Count */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Username with Character Limit
        </h3>
        <DynamicInput
          label="Username"
          value={username}
          onChange={setUsername}
          maxLength={20}
          showCharCount
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* Textarea-style Input */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Bio with Character Count
        </h3>
        <DynamicInput
          label="Bio"
          value={bio}
          onChange={setBio}
          maxLength={150}
          showCharCount
          placeholder="Tell us about yourself"
        />
      </div>

      {/* Disabled Input */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Disabled Input
        </h3>
        <DynamicInput
          label="Disabled Field"
          value="This field is disabled"
          onChange={() => {}}
          disabled
        />
      </div>

      {/* Input without Floating Label */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>
          Input without Floating Label
        </h3>
        <DynamicInput
          placeholder="Search..."
          value=""
          onChange={() => {}}
          floatingLabel={false}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default DynamicInputExample;
