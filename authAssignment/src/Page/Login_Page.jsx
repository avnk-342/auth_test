import React, { useState, useEffect } from 'react';
import "./Login_Page.css";
import photo from '../assets/photo.jpg'
import { GoogleLogin } from '@react-oauth/google';



const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
  
const KeypadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v.01" />
        <path d="M12 12v.01" />
        <path d="M12 18v.01" />
        <path d="M16 6v.01" />
        <path d="M16 12v.01" />
        <path d="M16 18v.01" />
        <path d="M8 6v.01" />
        <path d="M8 12v.01" />
        <path d="M8 18v.01" />
    </svg>
);


// --- Main Component ---

const Login_Page = () => {
    // Original form states
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    
    // States for OTP flow
    const [step, setStep] = useState('details'); 
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);

    // Effect for the countdown timer
    useEffect(() => {
        let timer;
        if (step === 'otp' && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [step, countdown]);

    const handleSignUpAndSendOtp = async (e) => {
        e.preventDefault();
        // Validate all form fields
        if (!name || !dob || !email || !/\S+@\S+\.\S+/.test(email)) {
          setError('Please fill in all fields with valid information.');
          return;
        }
        setError('');
        setIsLoading(true);
    
        // --- OTP Generation Simulation ---
        console.log('Form submitted:', { name, dob, email });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        
        console.log(`Generated OTP for ${email}: ${newOtp}`); // Log OTP for testing
        // --- End Simulation ---
        
        setIsLoading(false);
        setStep('otp');
        setCountdown(60); 
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
          setError('OTP must be 6 digits.');
          return;
        }
        setError('');
        setIsLoading(true);
    
        // --- OTP Verification Simulation ---
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        if (otp === generatedOtp) {
          setStep('success');
          setError('');
        } else {
          setError('Invalid OTP. Please try again.');
        }
        // --- End Simulation ---
    
        setIsLoading(false);
    };

    const handleResendOtp = async () => {
        setOtp('');
        setError('');
        setIsLoading(true);
        setCountdown(60);
    
        // --- Resend OTP Simulation ---
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        console.log(`New Resent OTP for ${email}: ${newOtp}`);
        // --- End Simulation ---
        setIsLoading(false);
    };

    const handleStartOver = () => {
        // Reset all relevant states to go back to the sign-up form
        setName('');
        setDob('');
        setEmail('');
        setOtp('');
        setGeneratedOtp('');
        setStep('details');
        setError('');
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded);
        setName(decoded.name || 'User'); // Set name from Google response
        setStep('success'); // Go to success screen
    };

    const handleGoogleError = () => {
        console.log('Login Failed');
        setError('Google login failed. Please try again.');
    };

    // --- Render Functions for each step ---

    const renderDetailsForm = () => (
        <>
          <h2 className="text-3xl font-extrabold text-left text-gray-800 mb-6 w-full">Sign up</h2>
          <p className='text-md text-left text-gray-500 mb-6 w-full' >Sign up to enjoy the feature of HD</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm w-full" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUpAndSendOtp} className="w-full">
            <fieldset className="border-none p-0 m-0 mb-6">
              <legend className="text-gray-700 font-medium mb-2">Full Name</legend>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </fieldset>

            <fieldset className="border-none p-0 m-0 mb-6">
              <legend className="text-gray-700 font-medium mb-2">Date of Birth</legend>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </fieldset>

            <fieldset className="border-none p-0 m-0 mb-6">
              <legend className="text-gray-700 font-medium mb-2">Email Address</legend>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </fieldset>

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center">
             {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Sign Up'}
            </button>
          </form>

            <div className="relative flex py-5 items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center items-center w-full">
                 <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                />
            </div>


          <div className="mt-8 text-center mb-6">
            <p className="text-gray-600 text-sm">
              Already have an account?
              <a href="#" className="text-blue-600 font-medium hover:underline ml-1">Sign In</a>
            </p>
          </div>
        </>
    );

    const renderOtpForm = () => (
        <div className='w-full'>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Enter Verification Code</h2>
            <p className="text-center text-gray-500 mb-6">A 6-digit code was sent to <br/><strong className="text-gray-700">{email}</strong></p>
            
            <form onSubmit={handleVerifyOtp}>
                <div className="relative mb-4">
                    <KeypadIcon />
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} placeholder="_ _ _ _ _ _" maxLength="6" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-center tracking-[1em] text-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <div className="text-center text-sm text-gray-500 mb-4">
                    {countdown > 0 ? (
                        <p>Resend OTP in {countdown}s</p>
                    ) : (
                        <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-blue-600 hover:underline disabled:text-gray-400">
                            Resend OTP
                        </button>
                    )}
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
                    {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Verify'}
                </button>
                <button type="button" onClick={() => { setStep('details'); setError(''); }} className="w-full text-center text-sm text-gray-500 mt-4 hover:text-gray-700">
                    Use a different email
                </button>
            </form>
        </div>
    );
    
    const renderSuccessScreen = () => (
        <div className="text-center w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up Successful!</h2>
          <p className="text-gray-600 mb-6">Welcome, <strong className="text-gray-700">{name}</strong>.</p>
          <button onClick={handleStartOver} className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800">
            Start Over
          </button>
        </div>
    );

    const renderContent = () => {
        switch (step) {
          case 'otp':
            return renderOtpForm();
          case 'success':
            return renderSuccessScreen();
          case 'details':
          default:
            return renderDetailsForm();
        }
    };
    
    return (
        <div className="flex items-center justify-center h-screen bg-white font-inter w-full">
            <div className="flex items-center w-full h-full overflow-hidden">
                <div className="bg-white flex flex-col justify-center items-center h-screen p-8 lg:w-1/2 w-full">
                    {renderContent()}
                </div>
                <div className="h-screen p-3 hidden lg:block lg:w-3/5">
                    <img
                        src= {photo}
                        alt="An abstract illustration of people signing up"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login_Page;