"use client";

import React from 'react';
import SignUpForm from '../../components/landing/SignUpForm';
import {Button} from "../../components/ui/button";


export  function UserPage(){
    return (
        <div id="sign-up" className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <Button onClick={() => window.history.back()} className="mb-4 text-yellow-300 hover:text-yellow-100">
                    &larr; Back
                </Button>
                <SignUpForm/>
            </div>
        </div>
    );
}

export default UserPage;