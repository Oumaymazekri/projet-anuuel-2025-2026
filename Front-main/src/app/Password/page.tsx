"use client"
import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Simuler l'envoi d'un email avec un code
        setMessage("A verification code has been sent to your email.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Forgot Password
                </h2>
                {message && (
                    <p className="text-green-500 text-center mb-4">{message}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-600 font-medium mb-2"
                        >
                            Email Adress
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
                    >
                        Send Code
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
